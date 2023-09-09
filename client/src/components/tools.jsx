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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import {
  RestartAlt,
  DeleteForeverOutlined as DelIcon,
} from "@mui/icons-material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "../App.css";

export function DropdownContainer({
  dataDict,
  onSelectionChange,
  onDelete,
  isDeletable,
}) {
  const [selections, setSelections] = useState({});

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
  const gridSize = Object.keys(dataDict).length === 2 ? 6 : 3;
  return (
    <Container>
      <Paper
        elevation={3}
        style={{ padding: "20px", marginTop: "20px", position: "relative" }}
      >
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
        <Dialog open={openDialog} onClose={handleClose}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this layer?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} color="secondary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
        <div
          style={{
            position: "absolute",
            top: "-10px",
            right: "-10px",
            background: "white",
            borderRadius: "10%",
            padding: "5px",
            boxShadow: "0px 0px 5px rgba(0,0,0,0.2)",
          }}
        >
          <IconButton
            color="primary"
            aria-label="reset"
            size="small" // Makes the button smaller
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
          {isDeletable && (
            <IconButton
              color="primary"
              aria-label="delete"
              size="small" // Makes the button smaller
              onClick={showConfirmDialog}
            >
              <DelIcon fontSize="small" /> {/* Makes the icon smaller */}
            </IconButton>
          )}
        </div>
      </Paper>
    </Container>
  );
}

export const getInitialSelections = (dataDict) => {
  return Object.keys(dataDict).reduce((acc, key) => {
    return { ...acc, [key]: "" };
  }, {});
};
