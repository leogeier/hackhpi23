from flask import Flask, abort, request
from flask_restful import Resource, Api
from schema import UploadedPhotoSchema
import geopandas as gpd
import pandas as pd
from streets import calculate_streets, WORKING_CRS, calculate_route
from flask_cors import CORS
import os
import uuid
import json

from flask import Flask, flash, request, redirect, url_for, render_template
from werkzeug.utils import secure_filename
from photos import load_photos_from_disk
import shapely

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

UPLOAD_FOLDER = 'uploads/'
app = Flask(__name__,
            static_url_path='/static',
            static_folder='uploads',
            template_folder='templates')
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
CORS(app)
api = Api(app)

geometry_objects = gpd.read_file("example_data/haus_l_points.json")
photos = load_photos_from_disk(app.config['UPLOAD_FOLDER'])

class Datapoint(Resource):
    def put(self):
        global geometry_objects
        # errors = AddedPointSchema().validate(request.json)
        # if errors:
            # abort(400, str(errors))
        df = gpd.GeoDataFrame.from_features(request.json, crs="EPSG:4326")
        # Filter after close points and remove them from dataset
        mask = shapely.geometry.MultiPoint(list(df.to_crs(WORKING_CRS).geometry)).buffer(10)
        geometry_objects = geometry_objects.to_crs(WORKING_CRS)
        print(len(geometry_objects))
        print(geometry_objects[geometry_objects.within(mask)])
        geometry_objects = geometry_objects[~geometry_objects.within(mask)]
        print(len(geometry_objects))
        geometry_objects = geometry_objects.to_crs("EPSG:4326")
        geometry_objects = pd.concat([geometry_objects, df])

class UploadedPhoto(Resource):
    def put(self):
        global photos, geometry_objects
        errors = UploadedPhotoSchema().validate(request.args)
        print(request.args)
        if errors:
            abort(400, str(errors))
        if 'file' not in request.files:
            flash('No file part')
            return
        file = request.files['file']
        # If the user does not select a file, the browser submits an
        # empty file without a filename.
        if file.filename == '':
            flash('No selected file')
            return 
        if file and allowed_file(file.filename):
            file_ending = file.filename.rsplit('.', 1)[1].lower()
            uuid_string = str(uuid.uuid4())
            filename = uuid_string + "." + file_ending
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            args = request.args
            metadata = {"x": float(args["x"]), "y": float(args["y"]), "photo_filename": filename}
            with open(os.path.join(app.config['UPLOAD_FOLDER'], uuid_string) + '.json', 'w') as fp:
                json.dump(metadata, fp)
            point_geo_series = gpd.points_from_xy(x=[args["x"]], y=[args["y"]], crs="EPSG:4326")

            point_data_frame = gpd.GeoDataFrame({"pollution": 90, "geometry": point_geo_series})

            geometry_objects = pd.concat([geometry_objects, point_data_frame])
            

        photos = load_photos_from_disk(app.config['UPLOAD_FOLDER'])
        return '''
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new File</h1>
    <form method=post enctype=multipart/form-data>
      <input type=file name=file>
      <input type=submit value=Upload>
    </form>
    '''

class Cleaned(Resource):
    def put(self):
        global photos, geometry_objects
        args = request.args

        point_data_frame = gpd.points_from_xy(x=[args["x"]], y=[args["y"]], crs="EPSG:4326")
        mask = point_data_frame.to_crs(WORKING_CRS)[0].buffer(10)
        photos = photos.to_crs(WORKING_CRS)
        photos = photos[~photos.within(mask)]
        photos = photos.to_crs("EPSG:4326")

        geometry_objects = geometry_objects.to_crs(WORKING_CRS)
        geometry_objects = geometry_objects[~geometry_objects.within(mask)]
        geometry_objects = geometry_objects.to_crs("EPSG:4326")




class Photos(Resource):
    def get(self):
        return photos.to_json()



class Points(Resource):
    def get(self):
        return geometry_objects.to_json()

class Streets(Resource):
    def get(self):
        df = calculate_streets(geometry_objects)
        return df.to_json()
    
class Route(Resource):
    def get(self):
        global geometry_objects
        args = request.args
        position = [float(args["x"]), float(args["y"])]
        length = float(args["length"])
        route = calculate_route(position=position, geometry_objects=geometry_objects, path_length_meters=length)
        return route.to_json()
    
class GameTarget(Resource):
    def get(self):
        global geometry_objects
        args = request.args
        position = [float(args["x"]), float(args["y"])]
        res = {
            'target_lon' : position[0] + 0.001,
            'target_lat' : position[1] + 0.001,
        }
        return json.dumps(res)

api.add_resource(Datapoint, '/upload/points')
api.add_resource(UploadedPhoto, '/upload/photo')
api.add_resource(Points, '/points')
api.add_resource(Streets, '/streets')
api.add_resource(Photos, '/photos')
api.add_resource(Cleaned, '/cleaned')
api.add_resource(Route, '/route')
api.add_resource(GameTarget, '/game_target')


if __name__ == '__main__':

    import ssl
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.load_cert_chain('cert.pem', 'key.pem')
    app.run(debug=True, host="0.0.0.0", ssl_context=context, port=8082)
