from google.cloud.vision import AnnotateImageResponse, Feature, Image, ImageAnnotatorClient, Likelihood

# TODO exception handling

LIKELIHOODS = Likelihood
VISION_FEATURES = [
    {'type_': Feature.Type.FACE_DETECTION},
    {'type_': Feature.Type.IMAGE_PROPERTIES},
    {'type_': Feature.Type.LABEL_DETECTION},
    {'type_': Feature.Type.LANDMARK_DETECTION},
    {'type_': Feature.Type.LOGO_DETECTION},
    {'type_': Feature.Type.OBJECT_LOCALIZATION},
    {'type_': Feature.Type.SAFE_SEARCH_DETECTION},
    {'type_': Feature.Type.TEXT_DETECTION},
    {'type_': Feature.Type.WEB_DETECTION}
]


class ImageAnnotator:
    def __init__(self):
        self._annotator_client = None

    def annotate_from_content(self, content: bytes):
        image = Image(content=content)
        return self._annotate(image)

    def annotate_from_url(self, url: str):
        image = Image(source={'image_uri': url})
        return self._annotate(image)

    def _annotate(self, image: Image) -> str:
        self._build_client()
        request = self._build_request(image)
        response = self._annotator_client.annotate_image(request)
        return AnnotateImageResponse.to_json(response)

    def _build_client(self):
        if self._annotator_client is None:
            self._annotator_client = ImageAnnotatorClient()

    def _build_request(self, image: Image) -> dict:
        return {
            'image': image,
            'features': VISION_FEATURES
        }
