
import shortuuid
from google.cloud import vision_v1 as vision

from app.storage import StorageClient

IMAGE_RAW_PATH = 'image/{image_id}'
VISION_AI_FEATURES = [
    {'type_': vision.Feature.Type.FACE_DETECTION},
    {'type_': vision.Feature.Type.LABEL_DETECTION},
    {'type_': vision.Feature.Type.LANDMARK_DETECTION},
    {'type_': vision.Feature.Type.LOGO_DETECTION},
    {'type_': vision.Feature.Type.OBJECT_LOCALIZATION},
    {'type_': vision.Feature.Type.SAFE_SEARCH_DETECTION},
    {'type_': vision.Feature.Type.TEXT_DETECTION},
    {'type_': vision.Feature.Type.WEB_DETECTION}
]


class Annotation:
    def __init__(self, json, image_id):
        self._json = json
        self._image_id = image_id
        self._path = f'{IMAGE_RAW_PATH.format(image_id=image_id)}/annotations.json'

    @classmethod
    def get_annotation_from_storage_client(cls, image_id):
        annotations_path = f'{IMAGE_RAW_PATH.format(image_id=image_id)}/annotations.json'

        raw_storage_client = StorageClient.build_raw_storage_client()
        json, _ = raw_storage_client.download_blob_as_text(annotations_path)

        return cls(json, image_id)

    @property
    def json(self):
        return self._json

    def save_annotation(self):
        raw_storage_client = StorageClient.build_raw_storage_client()
        raw_storage_client.upload_blob_from_content(self._path, self._json, content_type='application/json')


class Image:
    def __init__(self, content, content_type, filename, image_id=''):
        self._content = content
        self._content_type = content_type
        self._filename = filename
        self._image_id = image_id if image_id else shortuuid.uuid()
        self._path = f'{IMAGE_RAW_PATH.format(image_id=self._image_id)}/{self._filename}'

    @classmethod
    def get_image_from_storage_client(cls, image_id, image_filename):
        image_path = f'{IMAGE_RAW_PATH.format(image_id=image_id)}/{image_filename}'

        raw_storage_client = StorageClient.build_raw_storage_client()
        image_bytes, image_content_type = raw_storage_client.download_blob_as_bytes(image_path)

        return cls(image_bytes, image_content_type, image_filename, image_id)

    @staticmethod
    def delete_image(image_id):
        raw_storage_client = StorageClient.build_raw_storage_client()
        blobs = raw_storage_client.list_blobs(IMAGE_RAW_PATH.format(image_id=image_id))

        for blob in blobs:
            raw_storage_client.delete_blob(blob.name)

    @property
    def content(self):
        return self._content

    @property
    def content_type(self):
        return self._content_type

    @property
    def filename(self):
        return self._filename

    @property
    def image_id(self):
        return self._image_id

    def save_image(self):
        raw_storage_client = StorageClient.build_raw_storage_client()
        raw_storage_client.upload_blob_from_content(self._path, self._content, content_type=self._content_type)


class ImageAnnotator:
    def __init__(self):
        self._annotator_client = None

    def annotate_from_content(self, content: bytes):
        image = vision.Image(content=content)
        return self._annotate(image)

    def annotate_from_url(self, url: str):
        image = vision.Image(source={'image_uri': url})
        return self._annotate(image)

    def _annotate(self, image: vision.Image) -> str:
        self._build_client()
        request = self._build_annotator_request(image)
        response = self._annotator_client.annotate_image(request)
        return vision.AnnotateImageResponse.to_json(response)

    def _build_client(self):
        if self._annotator_client is None:
            self._annotator_client = vision.ImageAnnotatorClient()

    def _build_annotator_request(self, image: vision.Image) -> dict:
        return {
            'image': image,
            'features': VISION_AI_FEATURES
        }
