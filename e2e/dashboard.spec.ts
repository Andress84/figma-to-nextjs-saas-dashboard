import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const routes = [
  { heading: "Dashboard foundation", label: "Overview", path: "/" },
  { heading: "Analytics", label: "Analytics", path: "/analytics" },
  { heading: "Customers", label: "Customers", path: "/customers" },
  { heading: "Subscriptions", label: "Subscriptions", path: "/subscriptions" },
  { heading: "Settings", label: "Settings", path: "/settings" },
] as const;

test("navigates between every dashboard route", async ({ page }) => {
  await page.goto("/");

  const primaryNavigation = page.getByRole("navigation", { name: "Primary navigation" });

  for (const route of routes) {
    await primaryNavigation.getByRole("link", { name: route.label }).click();
    await expect(page).toHaveURL((url) => url.pathname === route.path);
    await expect(page.getByRole("heading", { level: 1, name: route.heading })).toBeVisible();
  }
});

test("passes an automated WCAG accessibility smoke test", async ({ page }) => {
  await page.goto("/");

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  expect(results.violations).toEqual([]);
});

test("closes the mobile menu after navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await page.getByText("Menu", { exact: true }).click();

  const mobileNavigation = page.getByRole("navigation", { name: "Mobile primary navigation" });
  await expect(mobileNavigation).toBeVisible();
  await mobileNavigation.getByRole("link", { name: "Analytics" }).click();

  await expect(page).toHaveURL((url) => url.pathname === "/analytics");
  await expect(page.getByRole("heading", { level: 1, name: "Analytics" })).toBeVisible();
  await expect(mobileNavigation).toBeHidden();
});
