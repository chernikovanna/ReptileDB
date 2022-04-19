from . import blueprint
import json
import sqlite3 as sl
from flask import jsonify

@blueprint.route('/data/species', methods=['GET'])
def species():
    con = sl.connect('data_pipelines/reptile.db')
    with con:
        species_out = {}
        species_queried = con.execute('SELECT * FROM SPECIES')
        desc = species_queried.description
        column_names = [col[0] for col in desc]
        for row in species_queried:
            species_out[row[0]] = dict(zip(column_names, row))
        return jsonify(species_out)

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
