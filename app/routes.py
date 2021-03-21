import io

from flask import request, send_file

from app import app, auth
from app.image import Annotation, Image, ImageAnnotator
from app.storage import StorageClient


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/login')
@auth.login_required
def login():
    return "logged in", 200


@app.route('/images', methods=['GET'])
@auth.login_required
def all_images():
    raw_storage_client = StorageClient.build_raw_storage_client()
    blobs = raw_storage_client.list_blobs('image')

    images = []
    for blob in blobs:
        if not blob.name.endswith('annotations.json'):
            images.append({'image_id': blob.name.split('/')[1], 'image_filename': blob.name.split('/')[2]})

    return {'images': images}, 200


@app.route('/annotation', methods=['GET'])
@auth.login_required
def get_annotation():
    image_id = request.args.get('image_id')

    if image_id:
        annotation = Annotation.get_annotation_from_storage_client(image_id)
        return {'annotation': annotation.json}

    else:
        return "Image ID is missing", 400


@app.route('/annotation', methods=['POST'])
def post_annotation():
    data = request.json

    if data and 'image_id' in data and data['image_id'] and data['filename']:
        image = Image.get_image_from_storage_client(image_id=data['image_id'], image_filename=data['filename'])
        image_annotator = ImageAnnotator()
        image_annotations = image_annotator.annotate_from_content(image.content)
        annotation = Annotation(image_annotations, image.image_id)
        annotation.save_annotation()
        return {'annotation': annotation.json}

    else:
        return "Image ID is missing", 400


@app.route('/image', methods=['DELETE'])
@auth.login_required
def delete_image():
    image_id = request.args.get('image_id')

    if image_id:
        Image.delete_image(image_id)
        return f"Successfully delete all files in {image_id}", 200

    else:
        return "Image ID is missing", 400


@app.route('/image', methods=['GET'])
@auth.login_required
def get_image():
    image_id = request.args.get('image_id')
    image_filename = request.args.get('image_filename')

    if image_id and image_filename:
        image = Image.get_image_from_storage_client(image_id, image_filename)
        return send_file(io.BytesIO(image.content), mimetype=image.content_type)

    else:
        return "Image ID or filename is missing", 400


@app.route('/image', methods=['POST'])
def post_image():
    image_file = request.files.get('image', None)

    if image_file:
        image = Image(image_file.read(), image_file.content_type, image_file.filename)
        image.save_image()
        return {'image_id': image.image_id, 'filename': image.filename}, 201

    else:
        return "Invalid file in request", 400
