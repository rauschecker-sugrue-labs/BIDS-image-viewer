from pathlib import Path
import os


class Config:
    ROOTDIR = Path(os.environ.get("BIDSDIR", ""))
    PORT = 3001
