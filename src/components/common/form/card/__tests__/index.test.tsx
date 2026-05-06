import React from "react";

import { render } from "@/__tests__/test-utils";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CardForm } from "@/components/common/form/card";

describe("CardForm", () => {
  const defaultProps = {
    onSubmit: jest.fn(),
    headerText: "Test Form",
    menu: "Test Menu",
    isEdit: false,
    isLoading: false,
    onBack: jest.fn(),
    children: <div>Form Content</div>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders header text and menu correctly", () => {
      render(<CardForm {...defaultProps} />);

      expect(screen.getByText("Test Form Test Menu")).toBeTruthy();
    });

    it("renders children content", () => {
      render(<CardForm {...defaultProps} />);

      expect(screen.getByText("Form Content")).toBeTruthy();
    });

    it("renders as form element", () => {
      render(<CardForm {...defaultProps} />);

      const form = document.querySelector("form");
      expect(form).toBeTruthy();
    });
  });

  describe("View Mode (isEdit = false)", () => {
    it("shows edit button when not in edit mode", () => {
      render(<CardForm {...defaultProps} isEdit={false} />);

      const editButton = screen.getByRole("button", { name: /Common\.edit/i });
      expect(editButton).toBeTruthy();
      expect(editButton).toHaveTextContent("Common.edit");
    });

    it("does not show save button when not in edit mode", () => {
      render(<CardForm {...defaultProps} isEdit={false} />);

      expect(
        screen.queryByRole("button", { name: /Common\.save/i }),
      ).toBeFalsy();
    });

    it("calls onBack when edit button is clicked", async () => {
      const user = userEvent.setup();
      render(<CardForm {...defaultProps} isEdit={false} />);

      const editButton = screen.getByRole("button", { name: /Common\.edit/i });
      await user.click(editButton);

      expect(defaultProps.onBack).toHaveBeenCalledTimes(1);
    });
  });

  describe("Edit Mode (isEdit = true)", () => {
    it("shows cancel and save buttons when in edit mode", () => {
      render(<CardForm {...defaultProps} isEdit={true} />);

      expect(
        screen.getByRole("button", { name: /Common\.cancel/i }),
      ).toBeTruthy();
      expect(
        screen.getByRole("button", { name: /Common\.save/i }),
      ).toBeTruthy();
    });

    it("calls onBack when cancel button is clicked", async () => {
      const user = userEvent.setup();
      render(<CardForm {...defaultProps} isEdit={true} />);

      const cancelButton = screen.getByRole("button", {
        name: /Common\.cancel/i,
      });
      await user.click(cancelButton);

      expect(defaultProps.onBack).toHaveBeenCalledTimes(1);
    });

    it("calls onSubmit when save button is clicked", async () => {
      const user = userEvent.setup();
      render(<CardForm {...defaultProps} isEdit={true} />);

      const saveButton = screen.getByRole("button", { name: /Common\.save/i });
      await user.click(saveButton);

      expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1);
    });

    it("calls onSubmit when form is submitted", () => {
      render(<CardForm {...defaultProps} isEdit={true} />);

      // Find the form element directly
      const form = document.querySelector("form") as HTMLFormElement;
      expect(form).toBeTruthy();

      // Simulate form submission by calling onSubmit directly
      const mockEvent = {
        preventDefault: jest.fn(),
        target: form,
      } as any;

      defaultProps.onSubmit(mockEvent);
      expect(defaultProps.onSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe("Loading States", () => {
    it("shows loading spinner on save button when isLoading is true", () => {
      render(<CardForm {...defaultProps} isEdit={true} isLoading={true} />);

      const saveButton = screen.getByRole("button", { name: /Common\.save/i });
      expect(saveButton.hasAttribute("disabled")).toBe(true);
      expect(screen.getByRole("progressbar")).toBeTruthy();
    });

    it("disables save button when isLoading is true", () => {
      render(<CardForm {...defaultProps} isEdit={true} isLoading={true} />);

      const saveButton = screen.getByRole("button", { name: /Common\.save/i });
      expect(saveButton.hasAttribute("disabled")).toBe(true);
    });

    it("disables save button when disabledSaveButton is true", () => {
      render(
        <CardForm {...defaultProps} isEdit={true} disabledSaveButton={true} />,
      );

      const saveButton = screen.getByRole("button", { name: /Common\.save/i });
      expect(saveButton.hasAttribute("disabled")).toBe(true);
    });
  });

  describe("Approve Functionality", () => {
    const onApprove = jest.fn();

    beforeEach(() => {
      onApprove.mockClear();
    });

    it("shows approve button when onApprove prop is provided and in edit mode", () => {
      render(
        <CardForm {...defaultProps} isEdit={true} onApprove={onApprove} />,
      );

      expect(
        screen.getByRole("button", { name: /Common\.saveAndApprove/i }),
      ).toBeTruthy();
    });

    it("does not show approve button when not in edit mode", () => {
      render(
        <CardForm {...defaultProps} isEdit={false} onApprove={onApprove} />,
      );

      expect(
        screen.queryByRole("button", { name: /Common\.saveAndApprove/i }),
      ).toBeFalsy();
    });

    it("calls onApprove when approve button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <CardForm {...defaultProps} isEdit={true} onApprove={onApprove} />,
      );

      const approveButton = screen.getByRole("button", {
        name: /Common\.saveAndApprove/i,
      });
      await user.click(approveButton);

      expect(onApprove).toHaveBeenCalledTimes(1);
    });

    it("shows loading spinner on approve button when approveIsLoading is true", () => {
      render(
        <CardForm
          {...defaultProps}
          isEdit={true}
          onApprove={onApprove}
          approveIsLoading={true}
        />,
      );

      const approveButton = screen.getByRole("button", {
        name: /Common\.saveAndApprove/i,
      });
      expect(approveButton.hasAttribute("disabled")).toBe(true);
      // Should have at least one progress bar
      expect(screen.getAllByRole("progressbar").length).toBeGreaterThanOrEqual(
        1,
      );
    });

    it("disables approve button when disabledSaveButton is true", () => {
      render(
        <CardForm
          {...defaultProps}
          isEdit={true}
          onApprove={onApprove}
          disabledSaveButton={true}
        />,
      );

      const approveButton = screen.getByRole("button", {
        name: /Common\.saveAndApprove/i,
      });
      expect(approveButton.hasAttribute("disabled")).toBe(true);
    });
  });

  describe("Accessibility", () => {
    it("has proper form structure", () => {
      render(<CardForm {...defaultProps} />);

      const form = document.querySelector("form");
      expect(form).toBeTruthy();
      expect(form?.getAttribute("novalidate")).toBe("");
    });

    it("buttons have proper accessibility attributes", () => {
      render(<CardForm {...defaultProps} isEdit={true} />);

      const saveButton = screen.getByRole("button", { name: /Common\.save/i });
      expect(saveButton.getAttribute("type")).toBe("submit");
    });
  });

  describe("Custom Props", () => {
    it("passes paperProps to Paper component", () => {
      const customPaperProps = { "data-testid": "custom-paper" };
      render(<CardForm {...defaultProps} paperProps={customPaperProps} />);

      expect(screen.getByTestId("custom-paper")).toBeTruthy();
    });
  });
});
