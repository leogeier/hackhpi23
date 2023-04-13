from marshmallow import Schema, fields
from marshmallow_geojson import GeoJSONSchema

class UploadedPhotoSchema(Schema):
    x = fields.Float(required=True)
    y = fields.Float(required=True)

class AddedPointSchema(GeoJSONSchema):
    pass
