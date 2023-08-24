import React, { useState } from "react";
import {
  Drawer,
  FormGroup,
  FormControlLabel,
  IconButton,
  Checkbox,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export function CollapsibleMenu({ visibleFields, toggleFieldVisibility }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div>
      <IconButton onClick={handleToggle}>
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={menuOpen} onClose={handleToggle}>
        <FieldSelectionMenu
          visibleFields={visibleFields}
          toggleFieldVisibility={toggleFieldVisibility}
        />
      </Drawer>
    </div>
  );
}

function FieldSelectionMenu({ visibleFields, toggleFieldVisibility }) {
  return (
    <FormGroup>
      {Object.keys(visibleFields).map((field) => (
        <FormControlLabel
          key={field}
          control={<Checkbox defaultChecked={visibleFields[field]} />}
          label={field}
          onClick={() => toggleFieldVisibility(field)}
        />
      ))}
    </FormGroup>
  );
}
