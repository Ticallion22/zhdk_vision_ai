from pathlib import Path

from flask import Flask
from flask_httpauth import HTTPBasicAuth
from werkzeug.security import check_password_hash, generate_password_hash

from app.config import MainConfig

PROJECT_ROOT = Path(__file__).parent.parent
APP_FOLDER = PROJECT_ROOT / 'app'
STATIC_FOLDER = PROJECT_ROOT / 'static'

app = Flask(__name__, static_folder=str(STATIC_FOLDER), static_url_path='/')

config = MainConfig.load(APP_FOLDER / 'config.yaml')
app.config['SECRET_KEY'] = config.flask_secret_key

auth = HTTPBasicAuth()
users = {config.http.user: generate_password_hash(config.http.password)}


@auth.verify_password
def verify_password(username, password):
    if username in users and check_password_hash(users[username], password):
        return username
    else:
        return False


# import routes at end of file to prevent circular import error
from app import routes
