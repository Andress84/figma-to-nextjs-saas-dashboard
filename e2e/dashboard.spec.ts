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
  const breadcrumb = page.getByRole("navigation", { name: "Breadcrumb" });

  await expect(primaryNavigation.getByRole("link")).toHaveCount(5);

  for (const route of routes) {
    const routeLink = primaryNavigation.getByRole("link", { name: route.label });

    await routeLink.click();
    await expect(page).toHaveURL((url) => url.pathname === route.path);
    await expect(page.getByRole("heading", { level: 1, name: route.heading })).toBeVisible();
    await expect(routeLink).toHaveAttribute("aria-current", "page");
    await expect(primaryNavigation.locator('[aria-current="page"]')).toHaveCount(1);
    await expect(breadcrumb.getByText("Dashboard", { exact: true })).toBeVisible();
    await expect(breadcrumb.getByText(route.label, { exact: true })).toHaveAttribute(
      "aria-current",
      "page",
    );
  }
});

test("renders the approved shared desktop shell content", async ({ page }) => {
  await page.goto("/");

  const sidebar = page.getByRole("complementary");

  await expect(sidebar.getByRole("link", { name: "Subtera overview" })).toBeVisible();
  await expect(sidebar.getByText("Acme Cloud", { exact: true })).toBeVisible();
  await expect(sidebar.getByText("Maya Chen", { exact: true })).toBeVisible();
  await expect(sidebar.getByText("Workspace Admin", { exact: true })).toBeVisible();
  await expect(page.getByText("Phase 1", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Technical foundation", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Portfolio project", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Local demo", { exact: true })).toHaveCount(0);
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
