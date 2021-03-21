from flask import request

from app import app
from app.image import Image


# TODO auth

@app.route('/')
def index():
    return app.send_static_file('index.html')


# TODO get and delete route (protected)
@app.route('/image', methods=['GET', 'POST'])
def route_image():
    if request.method == 'POST':
        image_file = request.files.get('image', None)

        if image_file:
            image = Image.build_image_from_file_storage(image_file)
            image.annotate_image()
            image.save_annotation()
            image.save_image()
            return {'annotations': image.annotations}, 201

        else:
            return "Invalid file in request", 400
