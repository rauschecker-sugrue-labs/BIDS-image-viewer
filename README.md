# BIDS image viewer

Webapp to display images from a BIDS formatted directory, based on [Niivue](https://github.com/niivue/niivue).

<table>
<tr>
<td><img src="https://github.com/rauschecker-sugrue-labs/BIDS-image-viewer/assets/65797646/7f0dafda-55b3-49d5-a62f-c62921653b0a" alt="image" width="600"/></td>
<td><img src="https://github.com/rauschecker-sugrue-labs/BIDS-image-viewer/assets/65797646/39fede2d-81c8-4f08-9e8c-b31be2ed2fe1" alt="image" width="600"/></td>
</tr>
</table>


## Installation and usage

This webviewer relies on the dataset being formatted according the [BIDS standard](https://bids.neuroimaging.io/), using [pybids](https://github.com/bids-standard/pybids) under the hood. If you need help formatting your dataset according to BIDS, please refer to the [BIDS starter kit](https://bids-standard.github.io/bids-starter-kit/).

### Manual use / development

```bash
### Installation
git clone git@github.com:rauschecker-sugrue-labs/BIDS-image-viewer.git

# In server/
# Create a virtual environment
python3 -m venv .env
# Activate the virtual environment
source .env/bin/activate
# Install the requirements
pip install -r requirements.txt

# In client/
# Install the requirements
npm install

### Usage: will need to open two terminals
# First terminal, in server/: running the server
cd server/
source .env/bin/activate
export BIDSDIR=/path/to/bids/directory # replace with your bids directory
python server.py
# Second terminal, in client/: running the client
npm start
```

Then navigate to http://localhost:3000.

### Docker

```bash
git clone git@github.com:rauschecker-sugrue-labs/BIDS-image-viewer.git

# within the root directory: this will install everything the first time,
# and then run the app
BIDSDIR=/path/to/bids/directory docker-compose up

# to force rebuild, add the --build flag at the end
```

Then navigate to http://localhost:3000. Voila!

## Contributing

We welcome contributions from everyone, regardless of experience level! Whether you're reporting a bug, proposing a new feature, or submitting code changes, your involvement is highly appreciated. Here's how to contribute:

1. **Submitting Issues**: If you encounter a problem or have a suggestion, please open an issue. Provide as much information as possible to help us understand and address your concerns. Make sure to check existing issues first to avoid duplicates.

2. **Fork the Repository**: To contribute code, click on the 'Fork' button at the top right of this page and clone your forked repository to your local machine.

3. **Create a New Branch**: Always create a new branch for each feature or fix to keep things clean and organized.

4. **Make Changes**: Modify the codebase as needed, adhering to the project's coding standards.

5. **Submit a Pull Request**: After committing and pushing your changes to your forked repository, open a pull request against the main repository with a clear description of the changes.

Feedback on both issues and pull requests is warmly welcomed. We aim to review and respond as promptly as possible. Remember, open communication is key to a thriving community, and we appreciate every contribution that helps improve our project. Thank you for being a part of our community!
