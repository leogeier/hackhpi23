# Backend API

# Endpoints
## Set datapoint
- Can easily be generated [here](https://geojson.io/#map=2/0/20).
- Pollution [0-100] in Prozent
POST /upload/points
```
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "pollution": 1,
	"nature_affected": 50
      },
      "geometry": {
        "coordinates": [
          8.909563636123664,
          50.145478451003584
        ],
        "type": "Point"
      },
      "id": 0
    },
    {
      "type": "Feature",
      "properties": {
        "pollution": 10,
	"nature_affected": 50
      },
      "geometry": {
        "coordinates": [
          8.91039383065987,
          50.14363159334505
        ],
        "type": "Point"
      },
      "id": 1
    }
  ]
}
```
## Upload photo
POST /upload/photo?x=X_COORDINATE&y=Y_COORDINATE
Mit Fileupload


## Query pollution
GET /streets
```
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "stroke": "#ff2d28",
        "stroke-width": 2,
        "stroke-opacity": 1
      },
      "geometry": {
        "coordinates": [
          [
            8.910232129914675,
            50.14536687853564
          ],
          [
            8.911144597334612,
            50.14742157191719
          ],
          [
            8.911524792092678,
            50.14826616335989
          ]
        ],
        "type": "LineString"
      },
      "id": 0
    },
    {
      "type": "Feature",
      "properties": {
        "stroke": "#10ff00",
        "stroke-width": 2,
        "stroke-opacity": 1
      },
      "geometry": {
        "coordinates": [
          [
            8.908811602572115,
            50.14699078160584
          ],
          [
            8.910979915141581,
            50.1469691551643
          ]
        ],
        "type": "LineString"
      },
      "id": 1
    }
  ]
}
```