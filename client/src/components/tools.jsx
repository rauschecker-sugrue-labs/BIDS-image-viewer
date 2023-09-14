import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Button,
  Collapse,
  Tooltip,
} from "@mui/material";

import {
  RestartAlt,
  DeleteOutlined as DelIcon,
  Edit,
  Settings,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ConfirmDialog } from "./Dialogs";
import "../App.css";

export function DropdownContainer({
  dataDict,
  onSelectionChange,
  onDelete,
  isDeletable,
  imagePath,
}) {
  const [selections, setSelections] = useState({});
  const [isCollapsed, setIsCollapsed] = useState(imagePath !== null);
  useEffect(() => {
    if (imagePath !== null) {
      setIsCollapsed(true);
    }
  }, [imagePath]);
  const theme = useTheme();

  const handleChange = (key, event) => {
    const value = event.target.value;
    const newSelections = { ...selections, [key]: value };
    if (JSON.stringify(newSelections) !== JSON.stringify(selections)) {
      setSelections(newSelections);
      onSelectionChange(newSelections);
    }
  };

  const handleReset = () => {
    setClickRotate(true);
    const newSelections = {};
    setSelections(newSelections);
    onSelectionChange(newSelections);
    // Snap back immediately after rotating
    setTimeout(() => {
      setClickRotate(false);
    }, 400);
    setIsCollapsed(false);
  };

  const renderOptions = (options) => {
    if (!options) return null;
    if (Array.isArray(options)) {
      return options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ));
    } else {
      return Object.keys(options).map((option) => (
        <optgroup key={option} label={option}>
          {renderOptions(options[option])}
        </optgroup>
      ));
    }
  };

  useEffect(() => {
    const emptySelections = Object.keys(dataDict).reduce((acc, key) => {
      return { ...acc, [key]: "" };
    }, {});
    setSelections(emptySelections);
  }, []);
  // Define a custom order for dropdowns
  const customOrder = ["suffix", "extension", "scope", "description"];

  // Function to sort keys based on customOrder
  const sortKeysByCustomOrder = (keys) => {
    return keys.sort((a, b) => {
      const indexA = customOrder.indexOf(a);
      const indexB = customOrder.indexOf(b);
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });
  };

  const [hoverRotate, setHoverRotate] = useState(false);
  const [clickRotate, setClickRotate] = useState(false);

  const handleMouseEnter = () => {
    setHoverRotate(true);
  };
  const handleMouseLeave = () => {
    setHoverRotate(false);
  };
  const getRotationStyle = () => {
    if (clickRotate) return "rotate(-180deg)";
    if (hoverRotate) return "rotate(30deg)";
    return "rotate(0deg)";
  };
  const handleEditClick = () => {
    setIsCollapsed(!isCollapsed);
  };
  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };
  const [openDialog, setOpenDialog] = useState(false);

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleConfirmDelete = () => {
    // Your delete logic here
    handleDelete();
    setOpenDialog(false);
  };

  const showConfirmDialog = () => {
    setOpenDialog(true);
  };

  const iconGroupStyle = isCollapsed
    ? {
        display: "flex",
        verticalAlign: "center",
        justifyContent: "flex-end",
        // padding: "5px",
        // Add any other styles you want when the container is collapsed
      }
    : {
        position: "absolute",
        top: "-10px",
        right: "-10px",
        background: theme.palette.background.paper,
        borderRadius: "10%",
        padding: "5px",
        boxShadow: "0px 0px 5px rgba(0,0,0,0.2)",
      };

  const gridSize = Object.keys(dataDict).length === 2 ? 6 : 3;
  return (
    <Container>
      <Paper
        elevation={3}
        style={{ padding: "20px", marginTop: "20px", position: "relative" }}
      >
        <Collapse in={!isCollapsed} timeout={"auto"}>
          <Grid container spacing={3}>
            {sortKeysByCustomOrder(Object.keys(dataDict)).map((key) => (
              <Grid item xs={6} sm={gridSize} md={6} key={key}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel htmlFor={key}>{key}</InputLabel>
                  <Select
                    native
                    value={selections[key] || ""}
                    onChange={(e) => handleChange(key, e)}
                    label={key}
                    inputProps={{
                      name: key,
                      id: key,
                    }}
                  >
                    <option aria-label="None" value="" />
                    {renderOptions(dataDict[key])}
                  </Select>
                </FormControl>
              </Grid>
            ))}
          </Grid>
        </Collapse>
        <Grid container justifyContent="space-between" alignItems="center">
          {isCollapsed && <i>{getShortName(imagePath)}</i>}
          <div style={iconGroupStyle}>
            {isCollapsed && (
              <Tooltip title="Edit choices">
                <IconButton color="primary" size="small" onClick={handleEditClick}>
                  <Edit fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Reset">
              <IconButton
                color="primary"
                size="small"
                aria-label="reset"
                onClick={handleReset}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                  transition: "transform 0.5s ease",
                  transform: getRotationStyle(),
                }}
              >
                <RestartAlt fontSize="small" /> {/* Makes the icon smaller */}
              </IconButton>
            </Tooltip>
            {isDeletable && (
              <Tooltip title="Delete layer">
                <IconButton
                  color="primary"
                  size="small"
                  aria-label="delete"
                  onClick={showConfirmDialog}
                >
                  <DelIcon fontSize="small" /> {/* Makes the icon smaller */}
                </IconButton>
              </Tooltip>
            )}
            <div style={{ width: "8px" }}></div>{" "}
            {isCollapsed && (
              <Tooltip title="Edit image parameters">
                <IconButton color="secondary" size="small" onClick={null}>
                  <Settings fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </div>
        </Grid>

        <ConfirmDialog
          open={openDialog}
          handleClose={handleClose}
          handleConfirm={handleConfirmDelete}
        />
      </Paper>
    </Container>
  );
}

export const getInitialSelections = (dataDict) => {
  return Object.keys(dataDict).reduce((acc, key) => {
    return { ...acc, [key]: "" };
  }, {});
};

function getFileName(path) {
  return path.split(/[/\\]/).pop();
}

function splitString(str) {
  const runMatch = str.match(/run-\w+_/);
  const sesMatch = str.match(/ses-\w+_/);
  const subMatch = str.match(/sub-\w+_/);

  let splitPoint;

  if (runMatch) {
    splitPoint = runMatch.index + runMatch[0].length;
  } else if (sesMatch) {
    splitPoint = sesMatch.index + sesMatch[0].length;
  } else if (subMatch) {
    splitPoint = subMatch.index + subMatch[0].length;
  }

  if (splitPoint !== undefined) {
    return [str.substring(0, splitPoint), str.substring(splitPoint)];
  }

  return [str];
}

function getShortName(path) {
  const shortName = getFileName(path);
  const [prefix, suffix] = splitString(shortName);
  return suffix;
}
