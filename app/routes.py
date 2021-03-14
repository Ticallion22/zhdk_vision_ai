from app import app


@app.route('/')
def index():
    return app.send_static_file('index.html')


# @app.route('/file', methods=['GET', 'POST'])
# def upload_file():
#     if request.method == 'POST':
#
#         if 'image' not in request.files:
#             flash('No image found in request')
#             return redirect(request.url)
#
#         image = request.files['image']
#
#         if image.filename == '':
#             flash('No file selected')
#             return redirect(request.url)
#
#         if image:
#             filename = secure_filename(image.filename)
#             file_dir_path = Path(app.config['UPLOAD_FOLDER']) / datetime.now().strftime("%Y%m%d-%H%M%S")
#             file_dir_path.mkdir()
#             file_path = file_dir_path / filename
#             image.save(file_path)
#
#             result = vision_api.annotate_image(file_path)
#             with open(file_dir_path / 'results.txt', 'w') as image:
#                 image.write(str(result))
#
#     return redirect(request.url)
