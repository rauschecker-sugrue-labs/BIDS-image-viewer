#%%
from pathlib import Path
from bids.layout import BIDSLayout
import numpy as np
from collections import defaultdict

# %%
root_dir = Path('/Users/pierre/Documents/code/viewer-app/data/abcd2')
# save time and only load a few subjects
# BIDSLayout(bids_dir, ignore=[re.compile(r"(sub-(?!25)\d*/)")])

def get_layout(root_dir: Path) -> BIDSLayout:
    """
    Get the layout of the data
    """
    return BIDSLayout(root_dir, derivatives=True)

def get_fp(layout:BIDSLayout, kwargs:dict):
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
    return Path(fp[0]).relative_to(root_dir)

def parse_bids_data_attributes(layout:BIDSLayout, kwargs:dict={}):
    """Parse the bids data attributes and return a dictionary of possible choices
    
    Examples: 
        ```
        parse_bids_data_attributes(layout)
        parse_bids_data_attributes(layout, {'suffix':'T1w'})
        ```
    """
    all_files = layout.get(return_type='filename', **kwargs) #TODO perform tests on the server with 10000 subjects...
    exclude = ['json', 'xform', 'csv', 'bval', 'bvec']

    # Convert to relative paths & exclude
    all_files = [Path(m).relative_to(root_dir)
                for m in all_files
                if not any(e in m for e in exclude)]
    scopes = np.unique([m.parts[1] for m in all_files])
    all_files = [m.name for m in all_files]

    # Extract extensions and suffixes
    extensions = np.unique([m.split('.', 1)[1] for m in all_files])
    all_files = [m.split('.')[0].split('_') for m in all_files]
    all_files = [n.split('-') for m in all_files for n in m 
                if not any(k in n for k in ['sub', 'ses'])]
    suffix = np.unique([m[0] for m in all_files if len(m)==1])
    all_files = [m for m in all_files if len(m)>1]
    # Using defaultdict to avoid KeyError
    result_dict = defaultdict(set)
    for key, value in all_files:
        result_dict[key].add(value)
    result_dict = dict(result_dict)
    # Converting sets back to lists
    result_dict['suffix'] = suffix
    result_dict['extension'] = extensions
    result_dict['scope'] = scopes
    result_dict = {k: list(v) for k, v in result_dict.items()}
    # Check that all keys are valid
    to_drop = []
    for key, value in result_dict.items():
        try:
            layout.get(**{key:value[0]})
        except ValueError:
            to_drop.append(key)
    result_dict = {k: v for k, v in result_dict.items() if k not in to_drop}
    return result_dict

