from flask import Flask, abort, request
from flask_restful import Resource, Api
from schema import UploadedPhotoSchema
import geopandas as gpd
import pandas as pd
from streets import calculate_streets
from flask_cors import CORS
import os
import uuid
import json

from flask import Flask, flash, request, redirect, url_for
from werkzeug.utils import secure_filename
from photos import load_photos_from_disk

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

UPLOAD_FOLDER = 'uploads/'
app = Flask(__name__,
            static_url_path='/static',
            static_folder='uploads')
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
        df = gpd.GeoDataFrame.from_features(request.json)
        geometry_objects = pd.concat([geometry_objects, df])

class UploadedPhoto(Resource):
    def put(self):
        global photos
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

api.add_resource(Datapoint, '/upload/points')
api.add_resource(UploadedPhoto, '/upload/photo')
api.add_resource(Points, '/points')
api.add_resource(Streets, '/streets')
api.add_resource(Photos, '/photos')


if __name__ == '__main__':
    app.run(debug=True)
