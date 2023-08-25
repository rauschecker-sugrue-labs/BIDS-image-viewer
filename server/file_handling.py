#%%
from pathlib import Path
from bids.layout import BIDSLayout
# %%
root_dir = Path('/Users/pierre/Documents/code/viewer-app/data/abcd2')
# save time and only load a few subjects
# BIDSLayout(bids_dir, ignore=[re.compile(r"(sub-(?!25)\d*/)")])

def get_layout(root_dir: Path) -> BIDSLayout:
    """
    Get the layout of the data
    """
    return BIDSLayout(root_dir, derivatives=True)


def get_fp(layout, kwargs):
    """Get the filepath of the image of interest based on series of bids arguments
    """
    try: 
        fp = layout.get(return_type='filename', **kwargs)
    except FileNotFoundError:
        UserWarning(FileNotFoundError("No file found"))
        return None
    if len(fp) > 1:
        UserWarning(Exception("More than one file found, please specify more"))
        return None
    if len(fp) == 0:
        UserWarning(Exception("No file found"))
        return None
    print(fp)
    return Path(fp[0]).relative_to(root_dir)

