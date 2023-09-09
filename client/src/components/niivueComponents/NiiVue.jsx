import React, { useEffect, useRef } from "react";
import { Niivue, NVImage, NVMesh } from "@niivue/niivue";

const NiiVue = ({ imageUrl, meshUrl, segmentationUrl }) => {
  // Reference to the canvas element
  const canvasRef = useRef(null);

  useEffect(() => {
    // Initialize Niivue
    const nv = new Niivue();

    // Attach Niivue to canvas
    nv.attachToCanvas(canvasRef.current);

    if (imageUrl) {
      nv.addVolumeFromUrl({ url: imageUrl });
      nv.setClipPlane([0.3, 270, 0]);
    }

    // Load mesh if URL is provided
    if (meshUrl) {
      nv.addMeshFromUrl({ url: meshUrl });
      nv.setMeshThicknessOn2D(5);
    }

    // Load segmentation if URL is provided
    if (segmentationUrl) {
      // Add your code to add the segmentation
    }

    // You can also set colormaps, adjust the view, etc.
    // For example: nv.addColormap('newColorMap', someColormapData);

    // If you want to switch out different images or segmentations,
    // You may want to use nv.addVolume() or nv.addVolumeFromUrl() dynamically

    // Clean-up
    return () => {
      // Perform any clean-up operations here
      // e.g., nv.detach();  // if Niivue provides such a method
    };
  }, [imageUrl, meshUrl, segmentationUrl]); // Re-run the effect if URLs change

  return (
    <div>
      <canvas
        ref={canvasRef}
        id="niivueCanvas"
        width="800"
        height="600"
      ></canvas>
    </div>
  );
};

export default NiiVue;
