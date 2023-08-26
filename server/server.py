from flask import Flask, jsonify, send_file, request
from pathlib import Path
import json
from config import Config
import file_handling as fh

app = Flask(__name__)
app.config.from_object(Config)

ROOTDIR = app.config['ROOTDIR']
port = app.config['PORT']

def update_subjects_and_sessions():
    derivatives_path = ROOTDIR / "derivatives/mproc"
    subjects = []
    sessions = set()

    for subject_dir in derivatives_path.iterdir():
        if subject_dir.name.startswith("sub-NDARINV"):
            subject_id = subject_dir.name.replace("sub-", "")
            subjects.append(subject_id)

            # Get the sessions for this subject
            for session_dir in subject_dir.iterdir():
                if session_dir.name.startswith("ses-"):
                    sessions.add(session_dir.name.replace("ses-", ""))

    with open(ROOTDIR / "dataDict.json") as f:
        data = json.load(f)

    data["subject"] = subjects
    data["session"] = list(sessions)

    with open(ROOTDIR / "dataDict.json", "w") as f:
        json.dump(data, f, indent=2)

@app.route('/subjects')
def get_subjects():
    subjects_dir = ROOTDIR / "derivatives/mproc"
    subjects = [d.name for d in subjects_dir.iterdir() if d.is_dir()]
    return jsonify(subjects)

@app.route('/get-subjects-sessions')
def get_subjects_sessions():
    
    return jsonify({"subject": LAYOUT.get_subjects(), "session": LAYOUT.get_sessions()})

@app.route('/get-image-path', methods=['POST'])
def get_image_path():
    data = request.json
    data['extension'] = 'nii.gz'
    # Build the path using pyBIDS and check if the image exists
    image_path = fh.get_fp(LAYOUT, data)
    exists = image_path is not None
    return jsonify({'exists': exists, 'path': str(image_path) if exists else None})

@app.route('/<path:file_path>', methods=['GET'])
def get_file(file_path):
    file_path = ROOTDIR / file_path
    if file_path.exists():
        return send_file(str(file_path))
    else:
        return "File not found", 404

# You can add the route to get available files similar to what we discussed earlier

# Call this function on server launch
def on_start():
    update_subjects_and_sessions()
    LAYOUT = fh.get_layout(ROOTDIR)
    return LAYOUT

if __name__ == '__main__':
    LAYOUT = on_start()
    app.run(port=port, debug=True)