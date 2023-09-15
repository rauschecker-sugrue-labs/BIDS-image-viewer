import React, { useState } from "react";
import { IconButton, Tooltip, Popover, Slider } from "@mui/material";
import {
  RestartAlt,
  DeleteOutlined as DelIcon,
  Edit,
  Settings,
  VisibilityOff,
  Visibility,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { FiberColorDropdown, RangeSlider } from "./NiivueComponents";

export default function IconGroup({
  isCollapsed,
  handleEditClick,
  handleReset,
  isDeletable,
  showDeleteDialog,
  handleMouseEnter,
  handleMouseLeave,
  getRotationStyle,
  onFiberColorChange,
  onClipValueChange,
}) {
  const theme = useTheme();
  const iconGroupStyle = isCollapsed
    ? {
        display: "flex",
        verticalAlign: "center",
        justifyContent: "flex-end",
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

  // ********** Settings popover ********** \\
  const [anchorEl, setAnchorEl] = useState(null);

  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const [sliderValue, setSliderValue] = useState(5);

  return (
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
          <RestartAlt fontSize="small" />
        </IconButton>
      </Tooltip>
      {isDeletable && (
        <Tooltip title="Delete layer">
          <IconButton
            color="primary"
            size="small"
            aria-label="delete"
            onClick={showDeleteDialog}
          >
            <DelIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
      <div style={{ width: "8px" }}></div>{" "}
      {isCollapsed && (
        <>
          <Tooltip title="Edit image parameters">
            <IconButton color="secondary" size="small" onClick={handleSettingsClick}>
              <Settings fontSize="small" />
            </IconButton>
          </Tooltip>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleSettingsClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
          >
            <div style={{ padding: theme.spacing(5) }}>
              <FiberColorDropdown onChange={(value) => onFiberColorChange(value)} />

              <RangeSlider
                title="Tracto clip"
                descriptionTip="Adjust how far from the plane of view the tracts are clipped."
                onChange={(value) => {
                  setSliderValue(value);
                  onClipValueChange(value);
                }}
                min={0}
                max={50}
                value={sliderValue}
              />
            </div>
          </Popover>
        </>
      )}
    </div>
  );
}
