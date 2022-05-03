from ReptileDB import blueprint
from flask import Flask, render_template

from flask_cors import CORS

app = Flask(__name__)
app.register_blueprint(blueprint)

CORS(app)

@app.route('/')
def serve_main():
    return render_template('index.html')
