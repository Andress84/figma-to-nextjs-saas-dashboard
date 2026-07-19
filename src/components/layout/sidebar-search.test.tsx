import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { MobileDrawer } from "./mobile-drawer";
import { Sidebar } from "./sidebar";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

describe("workspace search placeholders", () => {
  it("uses the approved desktop placeholder without rendering null", () => {
    render(<Sidebar />);

    const search = screen.getByRole("searchbox", { name: "Search workspace" });
    expect(search).toHaveAttribute("placeholder", "Search");
    expect(search).toHaveValue("");
    expect(search).not.toHaveDisplayValue("null");
    expect(document.body).not.toHaveTextContent(/\bnull\b/i);
  });

  it("keeps the mobile drawer placeholder unchanged", () => {
    render(<MobileDrawer isOpen onRequestClose={vi.fn()} />);

    const search = screen.getByRole("searchbox", { name: "Search workspace" });
    expect(search).toHaveAttribute("placeholder", "Search workspace");
    expect(search).toHaveValue("");
    expect(search).not.toHaveDisplayValue("null");
    expect(document.body).not.toHaveTextContent(/\bnull\b/i);
  });
});
