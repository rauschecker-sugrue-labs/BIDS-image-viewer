import React from "react";
import { render } from "@testing-library/react";
import { NiiVue } from "./NiiVue";

test("renders NiiVue component", () => {
  const imageUrl = "./FLAIR.nii.gz";
  render(<NiiVue imageUrl={imageUrl} />);
  // Add more assertions as needed, for example:
  // const canvas = screen.getByTagName('canvas');
  // expect(canvas).toBeInTheDocument();
});
