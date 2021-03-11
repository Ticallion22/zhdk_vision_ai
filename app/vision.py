from pathlib import Path

from google.cloud import vision

# TODO exception handling

LIKELIHOODS = vision.Likelihood
VISION_FEATURES = [
    {'type_': vision.Feature.Type.FACE_DETECTION},
    {'type_': vision.Feature.Type.IMAGE_PROPERTIES},
    {'type_': vision.Feature.Type.LABEL_DETECTION},
    {'type_': vision.Feature.Type.LANDMARK_DETECTION},
    {'type_': vision.Feature.Type.LOGO_DETECTION},
    {'type_': vision.Feature.Type.OBJECT_LOCALIZATION},
    {'type_': vision.Feature.Type.SAFE_SEARCH_DETECTION},
    {'type_': vision.Feature.Type.TEXT_DETECTION},
    {'type_': vision.Feature.Type.WEB_DETECTION}
]


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
        request = self._build_request(image)
        response = self._annotator_client.annotate_image(request)
        return vision.AnnotateImageResponse.to_json(response)

    def _build_client(self):
        if self._annotator_client is None:
            self._annotator_client = vision.ImageAnnotatorClient()

    def _build_request(self, image: vision.Image) -> dict:
        return {
            'image': image,
            'features': VISION_FEATURES
        }


if __name__ == '__main__':
    annotator = ImageAnnotator()

    with open(r"C:\Users\dsch\OneDrive\Bilder\_Titelbild.jpg", 'rb') as file:
        content = file.read()
        image = vision.Image(content=content)
        result = annotator.annotate_from_content(content)
        print(result)
