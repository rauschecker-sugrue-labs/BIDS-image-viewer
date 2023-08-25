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
  const [selections, setSelections] = useState({
    Mandatory: {},
    Layers: {},
  });

  const [visibleFields, setVisibleFields] = useState(default_dict.visibility);

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
    if (dataDict && dataDict.Mandatory) {
      setSelections(getInitialSelections(dataDict.Mandatory));
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

  var imageUrl =
    selections &&
    genImagePath({
      subjectID: selections.Subjects,
      sessionID: selections.Sessions,
      modality: selections.Modality,
    });

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
            <DropdownContainer
              dataDict={dataDict.Mandatory}
              visibleFields={visibleFields}
              onSelectionChange={handleSelectionChange}
            />
            {layers.map((layer, index) => (
              <DropdownContainer
                dataDict={layer}
                visibleFields={visibleFields}
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
