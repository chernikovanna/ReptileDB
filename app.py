from ReptileDB import blueprint
from flask import Flask, render_template

app = Flask(__name__)
app.register_blueprint(blueprint)


@app.route('/')
def serve_main():
    return render_template('index.html')
