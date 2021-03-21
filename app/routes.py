import io

from flask import request, send_file

from app import app
from app.image import Image
# TODO auth
from app.storage import StorageClient


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/images', methods=['GET'])
def all_images():
    raw_storage_client = StorageClient.build_raw_storage_client()
    blobs = raw_storage_client.list_blobs('image')

    images = []
    for blob in blobs:
        if not blob.name.endswith('annotations.json'):
            images.append({'image_id': blob.name.split('/')[1], 'image_filename': blob.name.split('/')[2]})

    return {'images': images}, 200


@app.route('/image', methods=['DELETE', 'GET', 'POST'])
def route_image():
    if request.method == 'DELETE':
        image_id = request.args.get('image_id')

        if image_id:
            raw_storage_client = StorageClient.build_raw_storage_client()
            blobs = raw_storage_client.list_blobs(f'image/{image_id}')
            for blob in blobs:
                raw_storage_client.delete_blob(blob.name)

            return f"Successfully delete all files in {image_id}", 200

        else:
            return "Image ID is missing", 400

    elif request.method == 'GET':
        image_id = request.args.get('image_id')
        image_filename = request.args.get('image_filename')

        if image_id and image_filename:
            image = Image.build_image_from_storage_client(image_id, image_filename)
            return send_file(io.BytesIO(image.content), mimetype=image.content_type)

        else:
            return "Image ID or filename is missing", 400

    elif request.method == 'POST':
        image_file = request.files.get('image', None)

        if image_file:
            image = Image.build_image_from_file_storage(image_file)
            image.annotate_image()
            image.save_annotation()
            image.save_image()
            return {'annotations': image.annotations}, 201

        else:
            return "Invalid file in request", 400
