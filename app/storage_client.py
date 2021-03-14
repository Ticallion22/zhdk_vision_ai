
from google.cloud.storage import Blob, Client

RAW_BUCKET_NAME = 'zhdk-vision-raw'


class StorageClient:
    def __init__(self):
        self._storage_client = None

    def _build_client(self):
        if self._storage_client is None:
            self._storage_client = Client()

    def upload_blob(self, content: str, blob_name: str, bucket_name: str, content_type: str = 'text/plan'):
        self._build_client()

        bucket = self._storage_client.get_bucket(bucket_name)
        blob = Blob(blob_name, bucket)
        blob.upload_from_string(content, content_type=content_type)
