from flask import Flask, abort, request
from flask_restful import Resource, Api
from schema import UploadedPhotoSchema, AddedPointSchema
import geopandas as gpd
import pandas as pd
from streets import calculate_streets
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
api = Api(app)

geometry_objects = gpd.read_file("example_data/haus_l_points.json")

class Datapoint(Resource):
    def put(self):
        global geometry_objects
        # errors = AddedPointSchema().validate(request.json)
        # if errors:
            # abort(400, str(errors))
        df = gpd.GeoDataFrame.from_features(request.json)
        geometry_objects = pd.concat([geometry_objects, df])

class UploadedPhoto(Resource):
    def put(self):
        errors = UploadedPhotoSchema().validate(request.args)
        print(request.args)
        if errors:
            abort(400, str(errors))

class Points(Resource):
    def get(self):
        return geometry_objects.to_json()

class Streets(Resource):
    def get(self):
        df = calculate_streets(geometry_objects)
        return df.to_json()

api.add_resource(Datapoint, '/upload/points')
api.add_resource(UploadedPhoto, '/upload/photo')
api.add_resource(Points, '/points')
api.add_resource(Streets, '/streets')


if __name__ == '__main__':
    app.run(debug=True)
