import React, { useEffect, useRef, useState } from "react";

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
