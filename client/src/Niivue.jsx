import { useEffect, useRef } from "react";
import { Niivue } from "@niivue/niivue";

const NiiVue = ({ imageUrls }) => {
  const canvas = useRef();

  useEffect(() => {
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
      const nv = new Niivue();
      nv.attachToCanvas(canvas.current);
      nv.loadVolumes(volumeList);
      await nv.loadMeshes(meshList); // Await completion before moving on
      nv.setSliceType(nv.sliceTypeMultiplanar);
    };

    loadResourcesAndSetSliceType();
  }, [imageUrls]);

  return <canvas ref={canvas}></canvas>;
};

export default NiiVue;
