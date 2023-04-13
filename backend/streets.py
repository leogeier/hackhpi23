from io import StringIO

import geopandas as gpd
import pandas as pd
import shapely
import numpy as np
import osmnx as osx
import folium


north = 52.39890924715826
south = 52.38917919930299
east = 13.120473448878073
west = 13.137786761544476
tags = {'highway':['motorway', 'trunk', 'primary', 'secondary', 'tertiary', 'unclassified', 'residential', 
                   'motorway_link', 'trunk_link', 'primary_link', 'secondary_link', 'tertiary_link',
                   'living_street', 'service', 'track', 'bus_guideway', 'escape', #'pedestrian',
                   'raceway', 'road', 'busway',
                   'footway', 'bridleway', 'steps', 'corridor', 'path', 'via_ferrata']}
example_photos_path = 'example_data/haus_l_points.json'
WORKING_CRS = 'EPSG:32632'

def calculate_streets(geometry_objects, buffer_distance=10):
    street_geoms = osx.geometries.geometries_from_bbox(north=north,south=south,east=east,west=west,tags=tags)
    street_geoms = street_geoms.loc[:, ('geometry', 'highway')].reset_index('element_type')
    street_geoms_buffered = street_geoms.to_crs(WORKING_CRS)
    street_geoms_buffered.geometry = street_geoms_buffered.buffer(buffer_distance)
    joined_streets = street_geoms_buffered.sjoin(geometry_objects, how="left")
    photo_attributes = joined_streets.groupby('osmid')[['pollution', 'nature_effected']].mean()
    street_geoms.loc[photo_attributes.index, ['pollution', 'nature_effected']] = photo_attributes
    street_geoms.pollution = street_geoms.pollution.fillna(0)
    street_geoms.nature_effected = street_geoms.nature_effected.fillna(0)
    rgb = pd.DataFrame({'red':(street_geoms.pollution * 255 / 100), 'green':0, 'blue':0}).astype(int)
    hex_number = rgb.red 
    hex_number = hex_number * 256 + rgb.green
    hex_number = hex_number * 256 + rgb.blue
    street_geoms['stroke'] = hex_number.astype(int).apply(lambda i: f'#{i:06x}')
    return street_geoms
