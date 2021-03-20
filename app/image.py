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
        self._content_type = image_file.content_type
        self._annotations = ''
        self._content = image_file.read()
        self._name = image_file.filename
        self._raw_path = IMAGE_RAW_PATH.format(uuid=shortuuid.uuid(), datetime=get_current_utc_datetime_string())

    @property
    def annotations(self):
        return self._annotations

    def annotate_image(self):
        image_annotator = ImageAnnotator()
        self._annotations = image_annotator.annotate_from_content(self._content)

    def save_annotation(self):
        raw_storage_client = get_raw_storage_client()
        annotations_path = f'{self._raw_path}/annotations.json'
        raw_storage_client.upload_blob_from_content(annotations_path, self._annotations, content_type='application/json')

    def save_image(self):
        raw_storage_client = get_raw_storage_client()
        image_path = f'{self._raw_path}/{self._name}'
        raw_storage_client.upload_blob_from_content(image_path, self._content, content_type=self._content_type)
