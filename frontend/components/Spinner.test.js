import Spinner from "./Spinner";
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.

test("spinner renders properly when ON", () => {
  render(<Spinner on={true} />);
  const spinner = screen.queryByText(/Please Wait.../i);
  expect(spinner).toBeInTheDocument();
});

test("spinner renders properly when OFF", () => {
  render(<Spinner on={false} />);
  const spinner = screen.findByTestId("spinner");
  expect(spinner).not.toBeInTheDocument();
});
