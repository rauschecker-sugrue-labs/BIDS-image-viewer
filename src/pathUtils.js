import axios from "axios";

function genBaseFP(derivatives_dir, subjectID, sessionID, other = "") {
  //   subjectID = subjectID.replace("sub-", "");
  var fp = `/derivatives/${derivatives_dir}/sub-NDARINV${subjectID}/ses-${sessionID}/${other}sub-NDARINV${subjectID}_ses-${sessionID}`;
  return fp;
}

export function genImagePath({
  subjectID,
  sessionID,
  modality,
  model = "CSDprob",
} = {}) {
  var fp;
  if (["T1w", "T2w"].includes(modality)) {
    fp =
      genBaseFP("mproc", subjectID, sessionID, "anat/") +
      `_run-01_${modality}.nii.gz`;
  } else if (modality === "dwi") {
    fp =
      genBaseFP("mproc", subjectID, sessionID, "dwi/") +
      `_run-01_${modality}.nii.gz`;
  } else if (modality === "b0") {
    fp =
      genBaseFP(model, subjectID, sessionID) +
      `_run-01_dwi_desc-${modality}_dwi.nii.gz`;
  } else if (["FA", "MD"].includes(modality)) {
    fp =
      genBaseFP(model, subjectID, sessionID) +
      `_run-01_dwi_model-DKI_desc-${modality}_dwi.nii.gz`;
  } else if (
    ["F0res", "F0hind", "N0res", "N0hind", "NDres", "NDhind"].includes(modality)
  ) {
    fp = genBaseFP("rsi", subjectID, sessionID) + `_${modality}.nii.gz`;
  } else if (modality === "csv") {
    fp =
      genBaseFP(model, subjectID, sessionID) +
      `_run-01_dwi_space-RASMM_model-${model}_algo-AFQ_desc-profiles_dwi.csv`;
  } else {
    console.error("Unsupported modality");
  }

  console.log(fp);
  axios
    .get("/check-file-exists", { params: { path: fp } })
    .then((response) => {
      if (!response.data.exists) {
        fp = null;
      }
    })
    .catch((error) => {
      console.error("Error checking file existence:", error);
      fp = null;
    });
  return fp;
}
