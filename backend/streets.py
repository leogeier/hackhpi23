from io import StringIO
import random

import geopandas as gpd
import pandas as pd
import shapely
import numpy as np
import osmnx as osx
import folium
import networkx as nx
import matplotlib

NORTH = 52.39890924715826
SOUTH = 52.38917919930299
EAST = 13.120473448878073
WEST = 13.137786761544476
TAGS = {'highway':['motorway', 'trunk', 'primary', 'secondary', 'tertiary', 'unclassified', 'residential', 
                   'motorway_link', 'trunk_link', 'primary_link', 'secondary_link', 'tertiary_link',
                   'living_street', 'service', 'track', 'bus_guideway', 'escape', #'pedestrian',
                   'raceway', 'road', 'busway',
                   'footway', 'bridleway', 'steps', 'corridor', 'path', 'via_ferrata']}
example_photos_path = 'example_data/haus_l_points.json'
WORKING_CRS = 'EPSG:32632'

DEFAULT_CMAP = matplotlib.colors.LinearSegmentedColormap.from_list("", ["red","green"])

def fetch_osm(north=NORTH, south=SOUTH, east=EAST, west=WEST):
    graph = osx.graph.graph_from_bbox(north=north, south=south, west=west, east=east)
    #graph = nx.DiGraph(graph)
    geometries = []
    osmids = []
    lengths = []
    for edge_id in graph.edges:
        edge = graph.edges[edge_id]
        geometry = edge.get('geometry', None)
        if geometry is None:
            start = graph.nodes[edge_id[0]]
            end = graph.nodes[edge_id[1]]
            start = (start['x'], start['y'])
            end = (end['x'], end['y'])
            geometry = shapely.geometry.LineString([start, end])
            graph.edges[edge_id]['geometry']=geometry
        geometries.append(geometry)
        lengths.append(edge['length'])
        osmids.append(edge_id)
    street_geoms = gpd.GeoDataFrame({'length':lengths, 'geometry':geometries}, index=osmids,
                                    geometry='geometry', crs='EPSG:4326')
    street_geoms.index.name = 'osmid'
    return street_geoms, graph

def style_sreets(streets, intensity_column='urgendy', cmap=DEFAULT_CMAP, width=2, opacity=1):
    rgb = pd.DataFrame(cmap(streets.urgency)[:,:3] * 255, columns=['red', 'green', 'blue'])
    hex_number = rgb.red
    hex_number = hex_number * 256 + rgb.green
    hex_number = hex_number * 256 + rgb.blue
    streets['stroke'] = hex_number.astype(int).apply(lambda i: f'#{i:06x}')
    streets['stroke-width'] = 2
    streets['stroke-opacity'] = 1

def calculate_streets(geometry_objects, buffer_distance=10, cmap=DEFAULT_CMAP):
    input_crs = geometry_objects.crs
    street_geoms, graph = fetch_osm()
    #street_geoms = street_geoms.loc[:, ('geometry', 'highway')].reset_index('element_type')
    street_geoms_buffered = street_geoms.to_crs(WORKING_CRS)
    street_geoms_buffered.geometry = street_geoms_buffered.buffer(buffer_distance)
    joined_streets = street_geoms_buffered.sjoin(geometry_objects.to_crs(WORKING_CRS), how="left")
    photo_attributes = joined_streets.groupby('osmid')[['pollution', 'nature_effected']].mean()
    street_geoms.loc[photo_attributes.index, ['pollution', 'nature_effected']] = photo_attributes
    street_geoms.pollution = street_geoms.pollution.fillna(0)
    street_geoms.nature_effected = street_geoms.nature_effected.fillna(0)
    street_geoms['urgency'] = street_geoms.pollution #TODO
    style_sreets(streets=street_geoms, cmap=cmap)
    return street_geoms.to_crs(input_crs)


def calculate_route(position, geometry_objects, num_paths = 100, path_length_meters = 500, cmap = DEFAULT_CMAP):
    position = np.array(position)

    street_geoms, graph = fetch_osm()
    street_geoms = calculate_streets(geometry_objects)
    nx.set_edge_attributes(graph, street_geoms.pollution, name='pollution')
    nx.set_edge_attributes(graph, street_geoms.nature_effected, name='pollution')
    nx.set_edge_attributes(graph, street_geoms.urgency, name='urgency')

    node_coords = []
    node_ids = []
    for node_id, node in graph.nodes.items():
        node_ids.append(node_id)
        node_coords.append([node['x'], node['y']])
    node_coords = np.array(node_coords)
    start_node_index = np.argmin(np.linalg.norm(node_coords - position, axis=1))
    start_node = node_ids[start_node_index]
    print(f'Start node {start_node} with coordinates: {node_coords[start_node_index]}')

    paths = []
    for p in range(num_paths):
        current_node = start_node
        dist_left = path_length_meters
        path = []
        urgencies = []
        path_geoms = []
        visited = set()
        while dist_left > 0:
            neighbors = [(start_node, end_node, data) for start_node, end_node, data in list(graph.out_edges(current_node, data=True))
                        if (start_node, end_node) not in visited]
            if len(neighbors) == 0:
                break
            edge_start_node, edge_end_node, data = random.choice(neighbors)
            dist_left -= data['length']
            visited.add((start_node, edge_end_node))
            urgencies.append(data['urgency'])
            path_geoms.append(data['geometry'])
            path.append(current_node)
            current_node=edge_end_node
        #path.append(current_node)
        #print([list(g.coords) for g in path_geoms])
        paths.append((sum(urgencies), path, path_geoms, urgencies))
    best_path = paths[np.argmax([p[0] for p in paths])]
    best_path = gpd.GeoDataFrame({'urgency':best_path[3]}, geometry=best_path[2], crs='EPSG:4326')
    style_sreets(streets=best_path, cmap=cmap)
    return best_path
