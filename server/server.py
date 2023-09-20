from flask import Flask, jsonify, send_file, request, send_from_directory
from flask_cors import CORS, cross_origin
from pathlib import Path
import os
import json
from config import Config
import file_handling as fh

app = Flask(__name__, static_folder="../client/build")
app.config.from_object(Config)
CORS(app)

ROOTDIR = app.config["ROOTDIR"]
port = app.config["PORT"]
# Call this on server launch
LAYOUT = fh.get_layout(ROOTDIR)


@app.route("/api/subjects")
def get_subjects():
    subjects_dir = ROOTDIR / "derivatives/mproc"
    subjects = [d.name for d in subjects_dir.iterdir() if d.is_dir()]
    return jsonify(subjects)


@app.route("/api/get-subjects-sessions")
def get_subjects_sessions():
    return jsonify(
        {"subjectList": LAYOUT.get_subjects(), "sessionList": LAYOUT.get_sessions()}
    )


@app.route("/api/get-image-path", methods=["POST"])
def get_image_path():
    data = request.json
    # Build the path using pyBIDS and check if the image exists
    image_path = fh.get_fp(LAYOUT, data)
    if image_path:
        image_path = image_path.relative_to(ROOTDIR)
        image_path = Path("data") / image_path  # so that it works with the nginx server
    exists = image_path is not None
    print(f"Image exists: {exists} at {image_path}")
    return jsonify({"exists": exists, "path": str(image_path) if exists else None})


@app.route("/api/get-fields")
def get_fields():
    fields = fh.parse_bids_data_attributes(LAYOUT)
    return jsonify(fields)


@app.route("/api/update-fields", methods=["POST"])
def update_fields():
    data = request.json
    updated_fields = fh.parse_bids_data_attributes(LAYOUT, data)
    return jsonify(updated_fields)


@app.route("/api/get-choices", methods=["POST"])
def get_choices():
    data = request.json
    data["extension"] = "nii.gz"
    choices = fh.get_choices(LAYOUT, data, exclude=["mask"])
    return jsonify(choices)


@app.route("/data/<path:file_path>", methods=["GET"])
def get_file(file_path):
    file_path = ROOTDIR / file_path
    if file_path.exists():
        return send_file(str(file_path))
    else:
        return "File not found", 404


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path != "" and os.path.exists(app.static_folder + "/" + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=port, debug=True)
