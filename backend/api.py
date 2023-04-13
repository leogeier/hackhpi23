from flask import Flask, abort, request
from flask_restful import Resource, Api
from schema import UploadedPhotoSchema, AddedPointSchema
import geopandas
import pandas as pd
from streets import calculate_streets

app = Flask(__name__)
api = Api(app)

geometry_objects = pd.DataFrame()

class Datapoint(Resource):
    def put(self):
        global geometry_objects
        # errors = AddedPointSchema().validate(request.json)
        # if errors:
            # abort(400, str(errors))
        df = geopandas.GeoDataFrame.from_features(request.json)
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
