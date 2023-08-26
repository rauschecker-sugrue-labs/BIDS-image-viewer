import axios from "axios";
import { useEffect, useRef, useState } from "react";
import "./App.css";
import { CollapsibleMenu } from "./components/CollapsibleMenu";
import NiiVue from "./components/NiiVue";
import { DropdownContainer, getInitialSelections } from "./components/tools";
import { genImagePath } from "./pathUtils";
import default_dict from "./utils/defaults.json";

function App() {
  const [dataDict, setDataDict] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [layers, setLayers] = useState([]);
  const [selections, setSelections] = useState(null);
  const [imageUrl, setImageUrl] = useState(null); // Add this state
  const [imageExists, setImageExists] = useState(false);

  const [visibleFields, setVisibleFields] = useState(default_dict.visibility);
  const [ids, setIds] = useState({ subject: [], session: [] });

  useEffect(() => {
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

  const toggleFieldVisibility = (field) => {
    setVisibleFields({
      ...visibleFields,
      [field]: !visibleFields[field],
    });
  };

  useEffect(() => {
    axios
      .get("/dataDict.json")
      .then((response) => {
        setDataDict(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    console.log("Get imageUrl from selections");
    if (selections) {
      axios
        .post("/get-image-path", selections)
        .then((response) => {
          console.log(`Image exists response: ${response.data.exists}`);
          setImageExists(response.data.exists);
          if (response.data.exists) {
            setImageUrl(response.data.path); // Set the image URL in state
          }
        })
        .catch((error) => {
          console.error("Error checking image:", error);
        });
    }
  }, [selections]);

  useEffect(() => {
    if (dataDict) {
      setSelections(getInitialSelections(dataDict));
    }
  }, [dataDict]);

  const handleSelectionChange = (newSelections) => {
    setSelections(newSelections);
    console.log(newSelections);
  };

  const handleAddLayerClick = () => {
    // Step 2: Hardcode the specific dictionary for each new layer
    const newLayer = {
      scope: ["scope1", "s2"],
      extension: [".trk", ".nii.gz"],
    };
    setLayers([...layers, newLayer]);
  };

  const handleLayerSelectionChange = (layerIndex, newSelections) => {
    // const updatedLayers = [...layers];
    // updatedLayers[layerIndex] = newSelections;
    // setLayers(updatedLayers);
  };

  return (
    <div className="App">
      {dataDict ? (
        <>
          <div>
            <CollapsibleMenu
              menuOpen={menuOpen}
              visibleFields={visibleFields}
              toggleFieldVisibility={toggleFieldVisibility}
              onAddLayerClick={handleAddLayerClick}
            />
            <DropdownContainer dataDict={ids} onSelectionChange={null} />
            <DropdownContainer
              dataDict={dataDict}
              onSelectionChange={handleSelectionChange}
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
