from . import blueprint
import json

#from __main__ import app

@blueprint.route('/data/species', methods=['GET'])
def species():
    data = None
    with open("static/species.json") as url:
        data = json.load(url)
    return data

@blueprint.route('/data/countries', methods=['GET'])
def countries():
    data = None
    with open("static/countries_corrected.json") as url:
        data = json.load(url)
    return data

@blueprint.route('/data/world', methods=['GET'])
def world():
    data = None
    with open("static/world.geojson") as url:
        data = json.load(url)
    return data
