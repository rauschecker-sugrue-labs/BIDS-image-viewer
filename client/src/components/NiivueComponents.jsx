import React, { useEffect, useRef, useState } from "react";
import { Slider, Box, Typography, Tooltip } from "@mui/material";

export function FiberColorDropdown({ onChange }) {
  return (
    <select onChange={(e) => onChange(e.target.value)} id="fiberColor">
      <option value="Global">Global direction</option>
      <option value="Local">Local direction</option>
      <option value="Fixed">Fixed</option>
      <option value="DPG0">First Group (if available)</option>
      <option value="DPG1">Second Group (if available)</option>
      <option value="DPG01">Both Groups (if available)</option>
    </select>
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
  return (
    <Box sx={{ width: 200 }}>
      <Tooltip title={descriptionTip}>
        <Typography id="range-slider" gutterBottom>
          {title}
        </Typography>
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
