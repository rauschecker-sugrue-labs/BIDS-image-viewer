import axios from "axios";
import { useEffect, useState, useRef } from "react";
import "./App.css";
import { getSubjectsSessions, getFields, updateFields, getPath } from "./api";
import { CollapsibleMenu } from "./components/CollapsibleMenu";
import { DropdownContainer, getInitialSelections } from "./components/tools";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";

import NiiVue from "./Niivue";

function App() {
  useEffect(() => {
    document.title = "BIDS Image Visualizer";
  }, []);
  // ************** Setup **************  \\
  const [menuOpen, setMenuOpen] = useState(false);
  const [layers, setLayers] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [volumeList, setVolumeList] = useState([]);
  const [meshList, setMeshList] = useState([]);
  const [ids, setIds] = useState({});
  const [globalId, setGlobalId] = useState({ subject: null, session: null });
  const [lastSuccessfulSelection, setLastSuccessfulSelection] = useState({});
  const [lastSuccessfulLayerSelection, setLastSuccessfulLayerSelection] = useState({});
  const [wasPathValid, setWasPathValid] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  // ************** Debugging **************  \\
  useEffect(() => {
    console.debug("Layers:", layers);
  }, [layers]);

  const createNewLayer = (entities) => {
    return {
      entities,
      chosenValues: {},
      lastSuccessfulSelection: {},
      wasPathValid: false,
      imageUrl: null,
    };
  };

  // ************** Initialization **************  \\
  useEffect(() => {
    console.info("Initializing...");
    const initialization = async () => {
      try {
        let data;
        console.debug("Fetching subjects and sessions");
        data = await getSubjectsSessions();
        setIds({
          subject: data.subjectList,
          session: data.sessionList,
        });
        console.debug("Fetching fields");
        data = await getFields();
        const newLayer = createNewLayer(data);
        setLayers([newLayer]);
      } catch (error) {
        console.error("There was an error initializing the app:", error);
      }
    };
    initialization();
  }, []);

  // ************** Functions **************  \\
  const updateLayer = async (layerIndex, newIds, newParams) => {
    const selections = { ...newIds, ...newParams };
    console.debug("layerIndex", layerIndex, "selections", selections);
    const newPath = await getPath(selections);
    console.debug("getting path: ", newPath);
    const updatedLayers = [...layers];
    if (newPath.exists) {
      updatedLayers[layerIndex].imageUrl = newPath.path;
      updatedLayers[layerIndex].chosenValues = newParams;
    } else if (!newPath.exists && updatedLayers[layerIndex].imageUrl) {
      console.debug("Path does not exist, and `imageUrl` was set already");
      setShowErrorMessage(true); // add info about which layer is invalid
      //TODO reset layer to previous valid state, using chosenValues which still reflects the previous state
    } else {
      console.debug("Path does not exist and no `imageUrl` was set yet.");
      updatedLayers[layerIndex].chosenValues = newParams;
      //TODO: update entities, graying out choices that won't lead to a valid path
    }
    setLayers(updatedLayers);
  };

  // ************** Handlers **************  \\
  const handleAddLayerClick = async () => {
    try {
      const bidsEntities = await getFields();
      const newLayer = createNewLayer(bidsEntities);
      setLayers([...layers, newLayer]);
    } catch (error) {
      console.error("There was an error adding a new layer:", error);
    }
  };

  const handleGlobalChange = async (newIds, type) => {
    setGlobalId(newIds);
    console.debug("just reset newIds");
    for (let layerIndex = 0; layerIndex < layers.length; layerIndex++) {
      const layerValues = layers[layerIndex].chosenValues;
      console.debug("layerValues", layerValues);
      if (Object.keys(layerValues).length !== 0) {
        await updateLayer(layerIndex, newIds, layerValues);
      }
    }
    if (showErrorMessage && type) {
      // Reset the subject-session dropdown to the last successful selection
      setGlobalId({
        ...globalId,
        [type]: lastSuccessfulSelection[type],
      });
    }
  };

  const handleLayerSelectionChange = async (layerIndex, newSelections, type) => {
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
      await updateLayer(layerIndex, globalId, filteredSelections);
    } catch (error) {
      console.error("There was an error updating the layer:", error);
    }
  };
  // const newPath = await getPath(filteredSelections);
  // if (newPath.exists) {
  //   // update layer
  //   updateLayer(layerIndex, globalId, filteredSelections);
  // } else {
  //   // update dropdown choices
  // }
  // const updatedLayerParams = await updateFields(filteredSelections);
  // // Only update if there are changes
  // if (JSON.stringify(layers[layerIndex]) !== JSON.stringify(updatedLayerParams)) {
  //   const updatedLayers = [...layers];
  //   updatedLayers[layerIndex].entities = updatedLayerParams;
  //   setLayers(updatedLayers);
  //   // Try to get path for that layer
  //   const updatedSelections = { ...globalId, ...updatedLayerParams };
  //   const validPath = await getValidPath(updatedSelections, layerIndex); // Assume getValidPath returns true if the path is valid

  //   if (validPath) {
  //     setLastSuccessfulLayerSelection({
  //       ...lastSuccessfulLayerSelection,
  //       [layerIndex]: { ...updatedLayerParams },
  //     });
  //   } else {
  //     if (showErrorMessage && type) {
  //       const updatedLayers = [...layers];
  //       updatedLayers[layerIndex] = lastSuccessfulLayerSelection[layerIndex];
  //       setLayers(updatedLayers);
  //     }
  //   }
  // }
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
      const fullExt = "." + url.split(".").slice(-2).join("."); // Get the full extension for cases like '.nii.gz'
      console.debug("ext: ", ext);
      console.debug("fullext: ", fullExt);
      if (supportedExt.volume.includes(ext) || supportedExt.volume.includes(fullExt)) {
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

  // ************** Rendering **************  \\
  const [isManualOverride, setIsManualOverride] = useState(false);
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState(prefersDarkMode ? "dark" : "light");
  const theme = createTheme({
    palette: {
      mode: mode,
    },
  });
  // Listen for system color scheme changes
  useEffect(() => {
    if (!isManualOverride) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      setMode(systemTheme);
    }
  }, [isManualOverride]);
  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
    setIsManualOverride(true);
  };

  return (
    <div className="App">
      <CssBaseline />
      <ThemeProvider theme={theme}>
        {ids ? (
          <>
            <Box display="flex" flexDirection="column" height="100vh">
              <Box>
                <CollapsibleMenu
                  menuOpen={menuOpen}
                  onAddLayerClick={handleAddLayerClick}
                  toggleTheme={toggleTheme}
                  theme={theme}
                />
                {/* Add subject-session container */}
                <DropdownContainer
                  dataDict={ids}
                  onSelectionChange={(newIds, type) => handleGlobalChange(newIds, type)}
                  isDeletable={false}
                />
                {/* Add layer containers */}
                {layers.length > 0 &&
                  layers.map((layer, index) => (
                    <DropdownContainer
                      key={index}
                      dataDict={layer.entities}
                      onSelectionChange={(newSelections) =>
                        handleLayerSelectionChange(index, newSelections)
                      }
                      onDelete={() => handleDeleteLayer(index)}
                      isDeletable={true}
                    />
                  ))}
              </Box>
              <Box className="niivue-container" flexGrow={1} minHeight="300px">
                {layers.map((layer) => layer.imageUrl).filter(Boolean).length > 0 ? (
                  <NiiVue
                    imageUrls={layers.map((layer) => layer.imageUrl).filter(Boolean)}
                  />
                ) : (
                  <p>Choose an image to load...</p>
                )}
              </Box>
              <Box flexBasis={"50px"}></Box>
            </Box>
          </>
        ) : (
          <p>Loading...</p>
        )}
        {showErrorMessage && (
          <p style={{ color: "red" }}>
            Error: Unable to find a valid path for the selected item.
          </p>
        )}
      </ThemeProvider>
    </div>
  );
}

export default App;
