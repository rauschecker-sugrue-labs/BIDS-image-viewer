import React, { useEffect, useRef, useState } from "react";
import { Niivue } from "@niivue/niivue";

const NiiVue = ({ imageUrls, fiberColor }) => {
  const canvas = useRef();
  const nv = useRef(new Niivue());
  const [meshesLoaded, setMeshesLoaded] = useState(false);

  useEffect(() => {
    setMeshesLoaded(false);
    const supportedExt = {
      volume: ["nii.gz", ".nii.gz", ".nii", ".gz"],
      mesh: [".trk", ".trx"],
    };

    const volumeList = [];
    const meshList = [];

    imageUrls.forEach((url) => {
      const ext = url.substring(url.lastIndexOf(".")); // Get the file extension
      const fullExt = "." + url.split(".").slice(-2).join("."); // Get the full extension for cases like '.nii.gz'

      if (supportedExt.volume.includes(ext) || supportedExt.volume.includes(fullExt)) {
        volumeList.push({ url });
      } else if (
        supportedExt.mesh.includes(ext) ||
        supportedExt.mesh.includes(fullExt)
      ) {
        meshList.push({ url });
      }
    });

    const loadResourcesAndSetSliceType = async () => {
      nv.current.attachToCanvas(canvas.current);
      nv.current.loadVolumes(volumeList);
      await nv.current.loadMeshes(meshList); // Await completion before moving on
      nv.current.setSliceType(nv.current.sliceTypeMultiplanar);
      setMeshesLoaded(true);
    };

    loadResourcesAndSetSliceType();
  }, [imageUrls]);

  useEffect(() => {
    if (!nv.current || !meshesLoaded) return;

    // Handle fiber color change
    // Ensure the mesh is loaded before trying to change properties
    if (nv.current.meshes && nv.current.meshes[0]) {
      switch (fiberColor) {
        case "DPG0":
          console.debug("DPG0");
          // logic for DPG0
          break;
        case "DPG1":
          console.debug("DPG1");
          // logic for DPG1
          break;
        case "DPG01":
          console.debug("DPG01");
          // logic for DPG01
          break;
        default: // Will handle "Global", "Local", and "Fixed" or any other value
          console.debug(`Setting fiber color to ${fiberColor}`);
          nv.current.setMeshProperty(nv.current.meshes[0].id, "fiberColor", fiberColor);
          console.debug(nv.current.meshes);
          break;
      }
    }
  }, [fiberColor, meshesLoaded]);

  return <canvas ref={canvas}></canvas>;
};

export default NiiVue;
