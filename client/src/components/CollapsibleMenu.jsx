import React, { useState } from "react";
import {
  Drawer,
  FormGroup,
  FormControlLabel,
  IconButton,
  Checkbox,
  Button,
  AppBar,
  Toolbar,
  CssBaseline,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/system";

export function CollapsibleMenu({
  visibleFields,
  toggleFieldVisibility,
  onAddLayerClick,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleToggle}
            style={
              menuOpen
                ? { transform: "rotate(90deg)", transition: "transform 0.3s" }
                : { transition: "transform 0.3s" }
            }
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Image Viewer
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={menuOpen} onClose={handleToggle}>
        <Button
          variant="contained"
          color="primary"
          onClick={onAddLayerClick}
          style={{ margin: "10px" }}
          endIcon={<AddIcon />}
        >
          Add layer
        </Button>
        <FieldSelectionMenu
          visibleFields={visibleFields}
          toggleFieldVisibility={toggleFieldVisibility}
        />
      </Drawer>
    </div>
  );
}

const StyledFormControlLabel = styled(FormControlLabel)`
  margin: 8px;
`;

function FieldSelectionMenu({ visibleFields, toggleFieldVisibility }) {
  return (
    <FormGroup style={{ padding: "15px" }}>
      {Object.keys(visibleFields).map((field) => (
        <StyledFormControlLabel
          key={field}
          control={<Checkbox defaultChecked={visibleFields[field]} />}
          label={field}
          onClick={() => toggleFieldVisibility(field)}
        />
      ))}
    </FormGroup>
  );
}