
from google.cloud.storage import Blob, Client

RAW_BUCKET_NAME = 'zhdk-vision-raw'


def get_raw_storage_client():
    return StorageClient(RAW_BUCKET_NAME)


class StorageClient:
    def __init__(self, bucket_name: str):
        self._bucket = None
        self._bucket_name: str = bucket_name
        self._storage_client = None

    def _build_client(self):
        if self._storage_client is None:
            self._storage_client = Client()
            self._bucket = self._storage_client.get_bucket(self._bucket_name)

    def exists(self, blob_name: str) -> bool:
        self._build_client()

        blob = Blob(blob_name, self._bucket)
        return blob.exists()

    def upload_blob_from_content(self, blob_name: str, content: str, content_type: str = 'text/plan'):
        self._build_client()

        blob = Blob(blob_name, self._bucket)
        blob.upload_from_string(content, content_type=content_type)
