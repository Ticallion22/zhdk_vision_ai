from datetime import datetime, timezone

import shortuuid
from werkzeug.datastructures import FileStorage

from app.storage import get_raw_storage_client
from app.vision import ImageAnnotator

IMAGE_RAW_PATH = 'image/{uuid}/{datetime}'


def get_current_utc_datetime_string():
    return datetime.now(timezone.utc).strftime('%Y%m%d-%H%M%S')


class Image:
    def __init__(self, image_file: FileStorage):
        self._image_name = image_file.filename
        self._content_type = image_file.content_type
        self._image_content = image_file.read()
        self._raw_path = IMAGE_RAW_PATH.format(uuid=shortuuid.uuid(), datetime=get_current_utc_datetime_string())

    def annotate_image(self):
        image_annotator = ImageAnnotator()
        result = image_annotator.annotate_from_content(self._image_content)
        self.save_annotation(result)

    def save_annotation(self, annotation):
        raw_storage_client = get_raw_storage_client()
        annotations_path = f'{self._raw_path}/annotations.json'
        raw_storage_client.upload_blob_from_content(annotations_path, annotation, content_type='application/json')

    def save_image(self):
        raw_storage_client = get_raw_storage_client()
        image_path = f'{self._raw_path}/{self._image_name}'
        raw_storage_client.upload_blob_from_content(image_path, self._image_content, content_type=self._content_type)
