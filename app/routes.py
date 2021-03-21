from flask import request

from app import app
from app.image import Image


@app.route('/')
def index():
    return app.send_static_file('index.html')


# TODO get and delete route (protected)
@app.route('/image', methods=['POST'])
def route_image():
    if request.method == 'POST':
        image_file = request.files.get('image', None)

        if image_file:
            image = Image(image_file)
            image.save_image()
            image.annotate_image()
            image.save_annotation()
            return {'annotations': image.annotations}, 201

        else:
            return "Invalid file in request", 400
