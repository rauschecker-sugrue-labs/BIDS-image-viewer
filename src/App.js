import "./App.css";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { DropdownContainer, getInitialSelections } from "./components/tools";
import { CollapsibleMenu } from "./components/CollapsibleMenu";
import { genImagePath } from "./pathUtils";
import { Niivue } from "@niivue/niivue";

const NiiVue = ({ imageUrl }) => {
  const canvas = useRef();
  useEffect(() => {
    const volumeList = [
      {
        url: imageUrl,
      },
    ];
    const nv = new Niivue();
    nv.attachToCanvas(canvas.current);
    nv.loadVolumes(volumeList);
  }, [imageUrl]);

  return <canvas ref={canvas} height={480} width={640} />;
};

function App() {
  const [dataDict, setDataDict] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selections, setSelections] = useState(null);
  const [visibleFields, setVisibleFields] = useState({
    Subjects: true,
    Sessions: true,
    Modality: true,
  });

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
    if (dataDict) {
      setSelections(getInitialSelections(dataDict));
    }
  }, [dataDict]);

  const handleSelectionChange = (newSelections) => {
    setSelections(newSelections);
    console.log(newSelections);
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
            />
            <DropdownContainer
              dataDict={dataDict}
              // selections={selections}
              visibleFields={visibleFields}
              onSelectionChange={handleSelectionChange}
            />
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
