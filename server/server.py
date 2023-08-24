from flask import Flask, jsonify, send_file, request
from pathlib import Path
import json
from config import Config

app = Flask(__name__)
app.config.from_object(Config)

rootdir = app.config['ROOTDIR']
port = app.config['PORT']

def update_subjects_and_sessions():
    derivatives_path = rootdir / "derivatives/mproc"
    subjects = []
    sessions = set()

    for subject_dir in derivatives_path.iterdir():
        if subject_dir.name.startswith("sub-NDARINV"):
            subject_id = subject_dir.name.replace("sub-NDARINV", "")
            subjects.append(subject_id)

            # Get the sessions for this subject
            for session_dir in subject_dir.iterdir():
                if session_dir.name.startswith("ses-"):
                    sessions.add(session_dir.name.replace("ses-", ""))

    with open(rootdir / "dataDict.json") as f:
        data = json.load(f)

    data["Subjects"] = subjects
    data["Sessions"] = list(sessions)

    with open(rootdir / "dataDict.json", "w") as f:
        json.dump(data, f, indent=2)

@app.route('/subjects')
def get_subjects():
    subjects_dir = rootdir / "derivatives/mproc"
    subjects = [d.name for d in subjects_dir.iterdir() if d.is_dir()]
    return jsonify(subjects)

@app.route('/check-file-exists')
def check_file_exists():
    file_path = Path(request.args['path'])
    exists = file_path.exists()
    return jsonify({'exists': exists})

@app.route('/<path:file_path>', methods=['GET'])
def get_file(file_path):
    file_path = rootdir / file_path
    if file_path.exists():
        return send_file(str(file_path))
    else:
        return "File not found", 404

# You can add the route to get available files similar to what we discussed earlier

# Call this function on server launch
update_subjects_and_sessions()

if __name__ == '__main__':
    app.run(port=port)
