# %%
from pathlib import Path
from bids.layout import BIDSLayout, add_config_paths
from bids.exceptions import ConfigError
import numpy as np
from collections import defaultdict

# %%
# save time and only load a few subjects
# BIDSLayout(bids_dir, ignore=[re.compile(r"(sub-(?!25)\d*/)")])
EXCLUSION_STR = ["json", "xform", "csv", "bval", "bvec"]


def toPathList_exclude(str_list: list, exclude: list = EXCLUSION_STR) -> list:
    """Convert a list of absolute path strings to a list of Path objects,
    excluding some extensions"""
    return [Path(m.path) for m in str_list if not any(e in m.relpath for e in exclude)]


def get_layout(root_dir: Path) -> BIDSLayout:
    """
    Get the layout of the data
    """
    try:
        add_config_paths(
            **{
                "bidsafq": "/Users/pierre/Documents/code/viewer-app/my-app/server/bids.json"  # noqa: E501
            }
        )
    except ConfigError as e:
        print(e)
    except Exception as e:
        raise e

    layout = BIDSLayout(root_dir)
    layout.add_derivatives(root_dir / "derivatives", config=["bids", "bidsafq"])
    return layout


def get_fp(layout: BIDSLayout, kwargs: dict):
    """Get the filepath of the image of interest based on series of bids arguments"""
    try:
        fp = layout.get(**kwargs)
    except FileNotFoundError:
        UserWarning(FileNotFoundError("No file found"))
        return None
    if len(fp) > 0:
        fp = toPathList_exclude(fp)
    if len(fp) > 1:
        UserWarning(Exception("More than one file found, please specify more"))
        return None
    if len(fp) == 0:
        UserWarning(Exception("No file found"))
        return None
    return Path(fp[0])


def create_dict(fname):
    fparsed = fname.split("_")
    suffix = fparsed.pop()
    md = {sp[0]: sp[1] for m in fparsed if len((sp := m.split("-"))) > 1}
    md["suffix"] = suffix
    return md


def get_choices(layout: BIDSLayout, kwargs: dict, exclude: list):
    """Get the list of choices for a given layout and kwargs under dict format"""
    files = layout.get(**kwargs)
    files = toPathList_exclude(files)
    files = [fp.name.split("run-01_")[1].split(".nii.gz")[0] for fp in files]
    files = np.unique(files)
    files = [m for m in files if not any([e in m for e in exclude])]
    return [create_dict(m) for m in files]


def parse_bids_data_attributes(layout: BIDSLayout, kwargs: dict = {}):
    """Parse the bids data attributes and return a dictionary of possible choices

    Examples:
        ```
        parse_bids_data_attributes(layout)
        parse_bids_data_attributes(layout, {'suffix':'T1w'})
        ```
    """
    all_files = layout.get(**kwargs)
    # TODO perform tests on the server with 10000 subjects...

    # Convert to relative paths & exclude
    all_files = toPathList_exclude(all_files)
    scopes = np.unique([m.parts[1] for m in all_files])
    all_files = [m.name for m in all_files]

    # Extract extensions and suffixes
    extensions = np.unique([m.split(".", 1)[1] for m in all_files])
    all_files = [m.split(".")[0].split("_") for m in all_files]
    all_files = [
        n.split("-")
        for m in all_files
        for n in m
        if not any(k in n for k in ["sub", "ses"])
    ]
    suffix = np.unique([m[0] for m in all_files if len(m) == 1])
    all_files = [m for m in all_files if len(m) > 1]
    # Using defaultdict to avoid KeyError
    result_dict = defaultdict(set)
    for key, value in all_files:
        result_dict[key].add(value)
    result_dict = dict(result_dict)
    # Converting sets back to lists
    result_dict["suffix"] = suffix
    result_dict["extension"] = extensions
    result_dict["scope"] = scopes
    result_dict = {k: list(v) for k, v in result_dict.items()}
    # Check that all keys are valid
    to_drop = []
    for key, value in result_dict.items():
        try:
            if isinstance(value, list):
                value = [value]
            layout.get(**{key: value[0]})
        except ValueError:
            to_drop.append(key)
    result_dict = {k: v for k, v in result_dict.items() if k not in to_drop}
    return result_dict

