from flask import request

from app import app
from app.image import Image


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/image', methods=['POST'])
def route_image():
    if request.method == 'GET':
        pass

    elif request.method == 'POST':
        image_file = request.files.get('image', None)

        if image_file:
            image = Image(image_file)
            image.save_image()
            image.annotate_image()
            image.save_annotation()
            return "Saved image with annotations", 201

        else:
            return "Invalid file in request", 400
