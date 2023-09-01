import axios from "axios";
import { useEffect, useState, useRef } from "react";
import "./App.css";
import { CollapsibleMenu } from "./components/CollapsibleMenu";
import { DropdownContainer, getInitialSelections } from "./components/tools";
import { Niivue } from "@niivue/niivue";

const NiiVue = ({ volumeList, meshList }) => {
  const canvas = useRef();
  useEffect(() => {
    const loadResourcesAndSetSliceType = async () => {
      const nv = new Niivue();
      nv.attachToCanvas(canvas.current);
      nv.loadVolumes(volumeList);
      await nv.loadMeshes(meshList); // Await completion before moving on
      nv.setSliceType(nv.sliceTypeMultiplanar);
    };

    loadResourcesAndSetSliceType();
  }, [volumeList, meshList]);

  return <canvas ref={canvas} height={480} width={640} />;
};

function App() {
  useEffect(() => {
    document.title = "BIDS Image Visualizer";
  }, []);

  const [menuOpen, setMenuOpen] = useState(false);
  const [layers, setLayers] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [volumeList, setVolumeList] = useState([]);
  const [meshList, setMeshList] = useState([]);
  const [ids, setIds] = useState({});
  const [globalId, setGlobalId] = useState({ subject: null, session: null });
  const supportedExt = {
    volume: ["nii.gz", ".nii.gz", ".nii", ".gz"],
    mesh: [".trk", ".trx"],
  };

  useEffect(() => {
    console.debug("Fetching subjects and sessions");
    axios
      .get("/get-subjects-sessions")
      .then((response) => {
        setIds({
          subject: response.data.subjectList,
          session: response.data.sessionList,
        });
      })
      .catch((error) => {
        console.error("There was an error fetching data: ", error);
      });
  }, []);

  // Function to check for valid path
  const getValidPath = async (params, layerIndex) => {
    try {
      const response = await axios.post("/get-image-path", params);
          if (response.data.exists) {
        const newImageUrls = [...imageUrls];
        newImageUrls[layerIndex] = response.data.path;
        setImageUrls(newImageUrls);
      }
    } catch (error) {
      console.error("Error:", error);
          }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("/get-fields");
      const bidsEntities = response.data;
      setLayers([bidsEntities]);
    } catch (error) {
      console.error("There was an error fetching the default layer:", error);
    }
  };

  // This useEffect will run when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  const handleAddLayerClick = async () => {
    try {
      const response = await axios.get("/get-fields");
      const bidsEntities = response.data;
      setLayers([...layers, bidsEntities]);
    } catch (error) {
      console.error("There was an error adding a new layer:", error);
    }
  };

  const handleGlobalChange = async (newIds) => {
    setGlobalId(newIds);
    for (let layerIndex = 0; layerIndex < layers.length; layerIndex++) {
      const layer = layers[layerIndex];
    // Merge global IDs and selections for the layer
    const updatedSelections = { ...newIds, ...layer };
      await getValidPath(updatedSelections, layerIndex);
    }
  };

  const handleLayerSelectionChange = async (layerIndex, newSelections) => {
    try {
      // Filter only the keys that have non-empty values
      const filteredSelections = Object.fromEntries(
        Object.entries(newSelections)
          .map(([key, value]) => {
            if (typeof value === "string" && value !== "") {
              return [key, value];
            } else if (Array.isArray(value)) {
              if (value.length === 1) {
                return [key, value[0]];
              }
            }
            return null;
          })
          .filter((item) => item !== null)
      );
      console.debug("filteredSelections");
      console.debug(filteredSelections);
      const response = await axios.post("/update-fields", filteredSelections);
      const updatedLayer = response.data;
      // Only update if there are changes
      if (JSON.stringify(layers[layerIndex]) !== JSON.stringify(updatedLayer)) {
        const updatedLayers = [...layers];
        updatedLayers[layerIndex] = updatedLayer;
        setLayers(updatedLayers);
        // Try to get path for that layer
        console.debug({ ...globalId, ...filteredSelections });
        console.debug("getValidPath");
        console.debug(getValidPath({ ...globalId, ...filteredSelections }));
        const updatedSelections = { ...globalId, ...updatedLayer };
        await getValidPath(updatedSelections, layerIndex);
      }
    } catch (error) {
      console.error("There was an error updating the layer:", error);
    }
  };
  const handleDeleteLayer = (layerIndex) => {
    const newLayers = [...layers];
    newLayers.splice(layerIndex, 1);
    setLayers(newLayers);

    const newImageUrls = [...imageUrls];
    newImageUrls.splice(layerIndex, 1);
    setImageUrls(newImageUrls);
  };
  useEffect(() => {
    console.log("imageUrls updated:", imageUrls);
    const newVolumeList = [];
    const newMeshList = [];

    imageUrls.forEach((url, index) => {
      const ext = url.substring(url.lastIndexOf(".")); // Get the file extension
      const fullExt = url.split(".").slice(-2).join("."); // Get the full extension for cases like '.nii.gz'
      console.debug("ext: ", ext);
      console.debug("fullext: ", fullExt);
      // console.debug("fullext: ", fullext);
      if (
        supportedExt.volume.includes(ext) ||
        supportedExt.volume.includes(fullExt)
      ) {
        newVolumeList.push({ url });
      } else if (
        supportedExt.mesh.includes(ext) ||
        supportedExt.mesh.includes(fullExt)
      ) {
        newMeshList.push({ url });
      }
    });

    setVolumeList(newVolumeList);
    setMeshList(newMeshList);
    console.log("volumes updated: ", newVolumeList);
    console.log("meshes updated: ", newMeshList);
    console.log(layers);
  }, [imageUrls]);

  return (
    <div className="App">
      {ids ? (
        <>
          <div>
            <CollapsibleMenu
              menuOpen={menuOpen}
              onAddLayerClick={handleAddLayerClick}
            />
            <DropdownContainer
            dataDict={ids}
            onSelectionChange={handleGlobalChange}
              isDeletable={false}
          />
            {layers.map((layer, index) => (
              <DropdownContainer
                key={index}
                dataDict={layer}
                onSelectionChange={(newSelections) =>
                  handleLayerSelectionChange(index, newSelections)
                }
                onDelete={() => handleDeleteLayer(index)}
                isDeletable={true}
              />
            ))}
          </div>
          <div className="niivue-container">
            {volumeList.length > 0 || meshList.length > 0 ? (
              <NiiVue volumeList={volumeList} meshList={meshList} />
            ) : (
              <p
                style={{
                  backgroundColor: "white",
                  color: "black",
                  fontStyle: "oblique",
                }}
              >
                Choose an image to load...
              </p>
            )}
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
