from datetime import datetime
from pathlib import Path

from flask import Flask, flash, request, redirect, url_for
from werkzeug.utils import secure_filename

from app import vision_ai


UPLOAD_FOLDER = r"C:\Users\dsch\PycharmProjects\zhdk_vision_ai\data"
# TODO specify
# ALLOWED_EXTENSIONS = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
# TODO set to something secret
app.secret_key = 'asdf'


@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':

        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)

        file = request.files['file']

        if file.filename == '':
            flash('No file selected')
            return redirect(request.url)

        if file:
            filename = secure_filename(file.filename)
            # TODO what should the name of the file be? how to store the files?
            file_dir_path = Path(app.config['UPLOAD_FOLDER']) / datetime.now().strftime("%Y%m%d-%H%M%S")
            file_dir_path.mkdir()
            file_path = file_dir_path / filename
            file.save(file_path)

            result = vision_ai.annotate_image(file_path)
            with open(file_dir_path / 'results.txt', 'w') as file:
                file.write(str(result))

    return '''
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new File</h1>
    <form method=post enctype=multipart/form-data>
      <input type=file name=file>
      <input type=submit value=Upload>
    </form>
    '''


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
