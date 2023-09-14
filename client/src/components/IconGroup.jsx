import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import {
  RestartAlt,
  DeleteOutlined as DelIcon,
  Edit,
  Settings,
  VisibilityOff,
  Visibility,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";

export default function IconGroup({
  isCollapsed,
  handleEditClick,
  handleReset,
  isDeletable,
  showDeleteDialog,
  handleMouseEnter,
  handleMouseLeave,
  getRotationStyle,
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
        <Tooltip title="Edit image parameters">
          <IconButton color="secondary" size="small" onClick={null}>
            <Settings fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
}
