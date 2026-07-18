import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { Button } from "./button";
import { IconButton } from "./icon-button";

describe("Button", () => {
  it("defaults to a native button and renders every variant and size", () => {
    const { rerender } = render(<Button>Save changes</Button>);
    const button = screen.getByRole("button", { name: "Save changes" });

    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveClass("ui-button--primary", "ui-button--default");

    for (const variant of ["primary", "secondary", "ghost", "destructive"] as const) {
      for (const size of ["default", "compact"] as const) {
        rerender(
          <Button variant={variant} size={size}>
            Save changes
          </Button>,
        );
        expect(button).toHaveClass(`ui-button--${variant}`, `ui-button--${size}`);
      }
    }
  });

  it("disables activation and exposes accessible feedback while loading", () => {
    render(<Button loading>Export report</Button>);

    const button = screen.getByRole("button", { name: "Loading" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(screen.getByText("Loading")).toHaveClass("sr-only");
  });

  it("forwards its button ref", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Save</Button>);

    expect(ref.current).toBe(screen.getByRole("button", { name: "Save" }));
  });
});

describe("IconButton", () => {
  it("uses its required label and preserves native pressed and expanded state", () => {
    render(
      <IconButton label="Notifications" aria-expanded="true" aria-pressed="false">
        <svg aria-hidden="true" />
      </IconButton>,
    );

    const button = screen.getByRole("button", { name: "Notifications" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("forwards its button ref", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <IconButton ref={ref} label="Help">
        <svg aria-hidden="true" />
      </IconButton>,
    );

    expect(ref.current).toBe(screen.getByRole("button", { name: "Help" }));
  });
});
