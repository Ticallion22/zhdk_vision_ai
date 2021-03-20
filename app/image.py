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

    def post_image(self):
        image_annotator = ImageAnnotator()
        result = image_annotator.annotate_from_content(self._image_content)

        self._store_image(result)

    def _get_new_blob_path(self) -> str:
        return IMAGE_RAW_PATH.format(uuid=shortuuid.uuid(), datetime=get_current_utc_datetime_string())

    def _store_image(self, annotator_results):
        blob_path = self._get_new_blob_path()

        raw_storage_client = get_raw_storage_client()
        while raw_storage_client.exists(f'{blob_path}/annotations.json'):
            blob_path = self._get_new_blob_path()

        raw_storage_client.upload_blob_from_content(f'{blob_path}/{self._image_name}', self._image_content, content_type=self._content_type)
        raw_storage_client.upload_blob_from_content(f'{blob_path}/annotations.json', annotator_results, content_type='application/json')
