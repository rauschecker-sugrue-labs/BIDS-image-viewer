import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

export const getInitialSelections = (dataDict) => {
  return Object.keys(dataDict).reduce((acc, key) => {
    const value = dataDict[key];
    let firstValue;
    if (Array.isArray(value)) {
      firstValue = value[0];
    } else if (typeof value === "object") {
      // If it's an object, take the first value of the first key
      firstValue = value[Object.keys(value)[0]][0];
    }
    return { ...acc, [key]: firstValue };
  }, {});
};

export function DropdownContainer({ dataDict, onSelectionChange }) {
  const initialSelections = getInitialSelections(dataDict);
  const [selections, setSelections] = useState(initialSelections);
  const handleChange = (key, event) => {
    const value = event.target.value;
    const newSelections = { ...selections, [key]: value };
    setSelections(newSelections);
    onSelectionChange(newSelections); // Call the callback with all selections
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
  return (
    <Container>
      <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
        <Grid container spacing={3}>
          {Object.keys(dataDict).map(
            (key) => (
              // visibleFields[key] && (
              <Grid item xs={12} sm={6} md={4} key={key}>
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
                    {renderOptions(dataDict[key])}
                  </Select>
                </FormControl>
              </Grid>
            )
            // )
          )}
        </Grid>
      </Paper>
    </Container>
  );
}
