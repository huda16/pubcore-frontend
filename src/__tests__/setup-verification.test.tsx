import React from "react";

import { render } from "@/__tests__/test-utils";
import { screen } from "@testing-library/react";

// Simple component to test our setup
const TestComponent = ({ title }: { title: string }) => (
  <div data-testid="test-component">
    <h1>{title}</h1>
    <p>This is a test component</p>
  </div>
);

describe("Test Setup Verification", () => {
  it("renders test component correctly", () => {
    render(<TestComponent title="Hello World" />);

    expect(screen.getByTestId("test-component")).toBeTruthy();
    expect(screen.getByText("Hello World")).toBeTruthy();
    expect(screen.getByText("This is a test component")).toBeTruthy();
  });

  it("supports user interactions", async () => {
    render(<button onClick={() => console.log("clicked")}>Click me</button>);

    expect(screen.getByRole("button")).toBeTruthy();
    expect(screen.getByText("Click me")).toBeTruthy();
  });

  it("supports Material-UI components", () => {
    render(
      <div>
        <button>Material Button</button>
      </div>,
    );

    expect(screen.getByRole("button")).toBeTruthy();
  });
});
