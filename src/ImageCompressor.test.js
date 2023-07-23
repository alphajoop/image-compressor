import React from "react";
import { render, screen } from "@testing-library/react";
import ImageCompressor from "./ImageCompressor";

describe("ImageCompressor component", () => {
  it("renders without crashing", () => {
    render(<ImageCompressor />);
    expect(screen.getByText("Image Compressor")).toBeInTheDocument();
  });
});