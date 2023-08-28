import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";

export function DropdownContainer({ dataDict, onSelectionChange }) {
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
    const newSelections = {};
    setSelections(newSelections);
    onSelectionChange(newSelections);
  };

  const renderOptions = (options) => {
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
  //  const customOrder = ["suffix", "extension", "scope", "description"];

  return (
    <Container>
      <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
        <Grid container spacing={3}>
          {Object.keys(dataDict).map((key) => (
            <Grid item xs={6} sm={3} md={6} key={key}>
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
        <Button
          variant="contained"
          color="secondary"
          onClick={handleReset}
          style={{ marginTop: "20px" }}
        >
          Reset
        </Button>
      </Paper>
    </Container>
  );
}

export const getInitialSelections = (dataDict) => {
  return Object.keys(dataDict).reduce((acc, key) => {
    return { ...acc, [key]: "" };
  }, {});
};
