import React, { useEffect, useRef, useState } from "react";
import {
  Slider,
  Box,
  Typography,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormLabel,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

export function FiberColorDropdown({ onChange }) {
  const [selectedValue, setSelectedValue] = React.useState("");

  const handleChange = (event) => {
    const value = event.target.value;
    setSelectedValue(value);
    onChange(value);
  };

  return (
    <Box mt={2}>
      <FormLabel component="legend">Fiber Color</FormLabel>
      <FormControl fullWidth variant="standard">
        <Select
          labelId="fiberColor-label"
          id="fiberColor"
          value={selectedValue}
          onChange={handleChange}
          label="Fiber Color"
        >
          <MenuItem value="Global">Global direction</MenuItem>
          <MenuItem value="Local">Local direction</MenuItem>
          <MenuItem value="Fixed">Fixed</MenuItem>
          <MenuItem value="DPG0">First Group (if available)</MenuItem>
          <MenuItem value="DPG1">Second Group (if available)</MenuItem>
          <MenuItem value="DPG01">Both Groups (if available)</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}

export function RangeSlider({
  title,
  descriptionTip,
  onChange,
  min,
  max,
  step,
  value,
}) {
  const theme = useTheme();
  return (
    <Box mt={2}>
      <Tooltip title={descriptionTip}>
        <FormLabel component="legend">{title}</FormLabel>
      </Tooltip>
      <Slider
        value={value}
        onChange={(event, newValue) => onChange(newValue)}
        min={min}
        max={max}
        step={step}
        valueLabelDisplay="auto"
        aria-labelledby="range-slider"
      />
    </Box>
  );
}
