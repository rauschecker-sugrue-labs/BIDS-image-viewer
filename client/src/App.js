import axios from "axios";
import { useEffect, useRef, useState } from "react";
import "./App.css";
import { CollapsibleMenu } from "./components/CollapsibleMenu";
import NiiVue from "./components/NiiVue";
import { DropdownContainer, getInitialSelections } from "./components/tools";

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [layers, setLayers] = useState([]);
  const [imageUrl, setImageUrl] = useState(null); // Add this state
  const [ids, setIds] = useState({});
  const [globalId, setGlobalId] = useState({ subject: null, session: null });

  useEffect(() => {
    console.debug("Fetching subjects and sessions");
    axios
      .get("/get-subjects-sessions")
      .then((response) => {
        setIds({
          subject: response.data.subject,
          session: response.data.session,
        });
      })
      .catch((error) => {
        console.error("There was an error fetching data: ", error);
      });
  }, []);

  // Function to check for valid path
  const getValidPath = async (params) => {
    try {
      const response = await axios.post("/get-image-path", params);
      console.debug("getValidPath response");
      console.debug(response.data);
          if (response.data.exists) {
        // You have a valid path. Update the NiiVue component.
        setImageUrl(response.data.path);
      } else {
        // Parameters did not form a valid path. Handle accordingly.
        console.log("Not a valid path:");
      }
    } catch (error) {
      console.error("Error:", error);
          }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("/get-fields");
      const newLayer = response.data;
      setLayers([newLayer]);
    } catch (error) {
      console.error("There was an error fetching the default layer:", error);
    }
  };

  // This useEffect will run when the component mounts
  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array means this runs once when the component mounts

  const handleAddLayerClick = async () => {
    try {
      const response = await axios.get("/get-fields"); // replace with your server endpoint if different
      const newLayer = response.data; // assuming server returns the desired object format
      setLayers([...layers, newLayer]);
    } catch (error) {
      console.error("There was an error adding a new layer:", error);
    }
  };

  const handleGlobalChange = async (newIds) => {
    setGlobalId(newIds);
    // Assume we need to update only the first layer for simplicity
    // In a real-world application, you might loop through all layers
    const layer = layers[0]; // Replace with loop if updating multiple layers

    // Merge global IDs and selections for the layer
    const updatedSelections = { ...newIds, ...layer };

    // Check if this forms a valid path
    getValidPath(updatedSelections);
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
      }
    } catch (error) {
      console.error("There was an error updating the layer:", error);
    }
  };

  return (
    <div className="App">
      {ids ? ( //FIXME: this seems to always be true
        <>
          <div>
            <CollapsibleMenu
              menuOpen={menuOpen}
              onAddLayerClick={handleAddLayerClick}
            />
            <DropdownContainer
            dataDict={ids}
            onSelectionChange={handleGlobalChange}
          />
            {layers.map((layer, index) => (
              <DropdownContainer
                dataDict={layer}
                onSelectionChange={(newSelections) =>
                  handleLayerSelectionChange(index, newSelections)
                }
              />
            ))}{" "}
          </div>
          <div className="niivue-container">
            {imageUrl ? (
              <NiiVue imageUrl={imageUrl} />
            ) : (
              <p style={{ color: "white" }}>Error: No image found</p>
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
