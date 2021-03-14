from flask import redirect, request

from app import app
from app.storage_client import RAW_BUCKET_NAME, StorageClient
from app.vision_api import ImageAnnotator


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/image', methods=['POST'])
def upload_image():
    image_annotator = ImageAnnotator()
    storage_client = StorageClient()
    data = request.json

    if 'image' in data and data['image']:
        image = data['image']
        result = image_annotator.annotate_from_content(image)
    elif 'image_url' in data and data['image_url']:
        image_url = data['image_url']
        result = image_annotator.annotate_from_url(image_url)
    else:
        return "No image or image URL provided", 400

    storage_client.upload_blob(result, 'test', RAW_BUCKET_NAME, content_type='application/json')

    return redirect(request.url)
