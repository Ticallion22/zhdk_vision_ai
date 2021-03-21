
import shortuuid
from google.cloud import vision_v1 as vision
from werkzeug.datastructures import FileStorage

from app.storage import StorageClient

IMAGE_RAW_PATH = 'image/{uuid}'
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

# TODO refactor to dataclass and DAO


class Image:
    def __init__(self, content, content_type, filename, path, annotations=''):
        self._annotations = annotations
        self._content = content
        self._content_type = content_type
        self._filename = filename
        self._path = path

    @classmethod
    def build_image_from_file_storage(cls, image_file: FileStorage):
        content = image_file.read()
        content_type = image_file.content_type
        filename = image_file.filename
        path = IMAGE_RAW_PATH.format(uuid=shortuuid.uuid())
        return cls(content, content_type, filename, path)

    @classmethod
    def build_image_from_storage_client(cls, image_id, image_filename):
        path = f'image/{image_id}'
        annotations_path = f'image/{image_id}/annotations.json'
        image_path = f'image/{image_id}/{image_filename}'

        raw_storage_client = StorageClient.build_raw_storage_client()
        image_bytes, image_content_type = raw_storage_client.download_blob_as_bytes(image_path)
        annotations, _ = raw_storage_client.download_blob_as_text(annotations_path)

        return cls(image_bytes, image_content_type, image_filename, path, annotations)

    @property
    def annotations(self):
        return self._annotations

    @property
    def content(self):
        return self._content

    @property
    def content_type(self):
        return self._content_type

    @property
    def filename(self):
        return self._filename

    def annotate_image(self):
        image_annotator = ImageAnnotator()
        self._annotations = image_annotator.annotate_from_content(self._content)

    def save_annotation(self):
        raw_storage_client = StorageClient.build_raw_storage_client()
        annotations_path = f'{self._path}/annotations.json'
        raw_storage_client.upload_blob_from_content(annotations_path, self._annotations, content_type='application/json')

    def save_image(self):
        raw_storage_client = StorageClient.build_raw_storage_client()
        image_path = f'{self._path}/{self._filename}'
        raw_storage_client.upload_blob_from_content(image_path, self._content, content_type=self._content_type)


class ImageAnnotator:
    def __init__(self):
        self._annotator_client = None

    def annotate_from_content(self, content: bytes):
        image = vision.Image(content=content)
        return self._annotate(image)

    def annotate_from_url(self, url: str):
        image = vision.Image(source={'image_uri': url})
        return self._annotate(image)

    def _annotate(self, image: Image) -> str:
        self._build_client()
        request = self._build_annotator_request(image)
        response = self._annotator_client.annotate_image(request)
        return vision.AnnotateImageResponse.to_json(response)

    def _build_client(self):
        if self._annotator_client is None:
            self._annotator_client = vision.ImageAnnotatorClient()

    def _build_annotator_request(self, image: Image) -> dict:
        return {
            'image': image,
            'features': VISION_AI_FEATURES
        }
