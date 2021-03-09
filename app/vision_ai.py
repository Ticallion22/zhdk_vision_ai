from pathlib import Path

from google.cloud import vision


def annotate_image(image_path: Path):
    image_client = vision.ImageAnnotatorClient()

    with open(image_path, 'rb') as file:
        image_content = file.read()

    image = vision.Image(content=image_content)

    # TODO catch labeling error
    return image_client.label_detection(image=image)


if __name__ == '__main__':
    print(annotate_image(Path(r"C:\Users\dsch\OneDrive\Bilder\_Titelbild.jpg")))
