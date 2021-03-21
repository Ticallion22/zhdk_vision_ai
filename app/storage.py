
from google.cloud.storage import Blob, Client

from app import config


class StorageClient:
    def __init__(self, bucket_name: str):
        self._bucket = None
        self._bucket_name: str = bucket_name
        self._storage_client = None

    @classmethod
    def build_raw_storage_client(cls):
        return StorageClient(config.gcs_raw_bucket)

    def _build_client(self):
        if self._storage_client is None:
            self._storage_client = Client()
            self._bucket = self._storage_client.get_bucket(self._bucket_name)

    def delete_blob(self, blob_name: str):
        self._build_client()

        blob = Blob(blob_name, self._bucket)
        blob.delete()

    def download_blob_as_bytes(self, blob_name: str):
        self._build_client()

        blob = Blob(blob_name, self._bucket)
        return blob.download_as_bytes(), blob.content_type

    def download_blob_as_text(self, blob_name: str):
        self._build_client()

        blob = Blob(blob_name, self._bucket)
        return blob.download_as_text(), blob.content_type

    def exists(self, blob_name: str) -> bool:
        self._build_client()

        blob = Blob(blob_name, self._bucket)
        return blob.exists()

    def list_blobs(self, folder: str = ''):
        self._build_client()

        return self._bucket.list_blobs(prefix=folder)

    def upload_blob_from_content(self, blob_name: str, content: str, content_type: str = 'text/plan'):
        self._build_client()

        blob = Blob(blob_name, self._bucket)
        blob.upload_from_string(content, content_type=content_type)
