import glob
import os
import geopandas as gpd
import json
import pandas

def load_photos_from_disk(path):

    x = []
    y = []
    filenames = []

    jsonFileNames = glob.glob(path + '/*.json')
    for filename in jsonFileNames:
        with open(filename) as f:
            args = json.load(f)
            x.append(args["x"])
            y.append(args["y"])
            filenames.append(args["photo_filename"])

    df = pandas.DataFrame({"x": x, "y": y, "filenames": filenames})
    gdf = gpd.GeoDataFrame(df, geometry=gpd.points_from_xy(df['x'], df['y']), crs="EPSG:4326")
    return gdf


