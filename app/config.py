from confme import BaseConfig
from confme.annotation import Secret


class HttpConfig(BaseConfig):
    user: str
    password: str = Secret('ZHDK_VISION_HTTP_PASSWORD')


class MainConfig(BaseConfig):
    flask_secret_key: str = Secret('ZHDK_VISION_SECRET_KEY')
    http: HttpConfig
    gcs_raw_bucket: str = Secret('ZHDK_VISION_GCS_RAW_BUCKET')
