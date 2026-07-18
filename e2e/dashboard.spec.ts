import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const routes = [
  { heading: "Dashboard foundation", label: "Overview", path: "/" },
  { heading: "Analytics", label: "Analytics", path: "/analytics" },
  { heading: "Customers", label: "Customers", path: "/customers" },
  { heading: "Subscriptions", label: "Subscriptions", path: "/subscriptions" },
  { heading: "Settings", label: "Settings", path: "/settings" },
] as const;

async function openMobileDrawer(page: Page) {
  const menuButton = page.getByRole("button", { name: "Open navigation menu" });

  await menuButton.click();

  const drawer = page.getByRole("dialog", { name: "Navigation menu" });
  await expect(drawer).toBeVisible();

  return { drawer, menuButton };
}

async function expectFocusInsideDrawer(page: Page) {
  await expect
    .poll(() =>
      page.evaluate(() => {
        const drawer = document.querySelector("#mobile-navigation-drawer");
        return drawer?.contains(document.activeElement) ?? false;
      }),
    )
    .toBe(true);
}

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

test("renders the approved mobile app bar and notification feedback", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const mobileAppBar = page.getByRole("banner");
  const notificationButton = mobileAppBar.getByRole("button", { name: "Notifications" });
  const menuButton = mobileAppBar.getByRole("button", { name: "Open navigation menu" });

  await expect(mobileAppBar.getByRole("link", { name: "Subtera overview" })).toBeVisible();
  await expect(mobileAppBar.getByText("Subtera", { exact: true })).toBeVisible();
  await expect(page.getByText("SaaS Dashboard", { exact: true })).toHaveCount(0);
  await expect(menuButton).toHaveAttribute("aria-haspopup", "dialog");
  await expect(menuButton).toHaveAttribute("aria-expanded", "false");
  await expect(menuButton).toHaveAttribute("aria-controls", "mobile-navigation-drawer");

  for (const button of [notificationButton, menuButton]) {
    const bounds = await button.boundingBox();
    expect(bounds?.width).toBeGreaterThanOrEqual(44);
    expect(bounds?.height).toBeGreaterThanOrEqual(44);
  }

  await notificationButton.click();
  await expect(page.getByRole("status")).toHaveText("You’re all caught up.");
  const dismissStatusButton = page.getByRole("button", { name: "Dismiss notification status" });
  const dismissStatusBounds = await dismissStatusButton.boundingBox();
  expect(dismissStatusBounds?.width).toBeGreaterThanOrEqual(44);
  expect(dismissStatusBounds?.height).toBeGreaterThanOrEqual(44);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("status")).toBeHidden();

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});

test("opens a modal drawer and contains keyboard focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const { drawer, menuButton } = await openMobileDrawer(page);

  await expect(menuButton).toHaveAttribute("aria-expanded", "true");
  await expect(drawer.getByRole("button", { name: "Close navigation menu" })).toBeFocused();
  await expect
    .poll(() => page.evaluate(() => window.getComputedStyle(document.body).overflow))
    .toBe("hidden");

  await page.locator("#main-content").focus();
  await expectFocusInsideDrawer(page);

  for (let index = 0; index < 12; index += 1) {
    await page.keyboard.press("Tab");
    await expectFocusInsideDrawer(page);
  }

  for (let index = 0; index < 12; index += 1) {
    await page.keyboard.press("Shift+Tab");
    await expectFocusInsideDrawer(page);
  }
});

test("closes the mobile drawer through every direct dismissal path", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const initialBodyOverflow = await page.evaluate(() => document.body.style.overflow);
  let openedDrawer = await openMobileDrawer(page);

  await openedDrawer.drawer.getByRole("button", { name: "Close navigation menu" }).click();
  await expect(openedDrawer.drawer).toBeHidden();
  await expect(openedDrawer.menuButton).toBeFocused();
  await expect
    .poll(() => page.evaluate(() => document.body.style.overflow))
    .toBe(initialBodyOverflow);

  openedDrawer = await openMobileDrawer(page);
  await page.keyboard.press("Escape");
  await expect(openedDrawer.drawer).toBeHidden();
  await expect(openedDrawer.menuButton).toBeFocused();

  openedDrawer = await openMobileDrawer(page);
  await page.mouse.click(380, 420);
  await expect(openedDrawer.drawer).toBeHidden();
  await expect(openedDrawer.menuButton).toBeFocused();
  await expect
    .poll(() => page.evaluate(() => document.body.style.overflow))
    .toBe(initialBodyOverflow);
});

test("closes after route navigation and preserves the active route", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  let openedDrawer = await openMobileDrawer(page);
  const mobileNavigation = openedDrawer.drawer.getByRole("navigation", {
    name: "Mobile primary navigation",
  });

  await expect(mobileNavigation.getByRole("link", { name: "Overview" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await mobileNavigation.getByRole("link", { name: "Analytics" }).click();

  await expect(page).toHaveURL((url) => url.pathname === "/analytics");
  await expect(page.getByRole("heading", { level: 1, name: "Analytics" })).toBeVisible();
  await expect(openedDrawer.drawer).toBeHidden();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("");

  openedDrawer = await openMobileDrawer(page);
  await expect(openedDrawer.drawer.getByRole("link", { name: "Analytics" })).toHaveAttribute(
    "aria-current",
    "page",
  );
});

test("cleans up the drawer when switching to the desktop shell", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const { drawer } = await openMobileDrawer(page);
  await page.setViewportSize({ width: 1024, height: 800 });

  await expect(drawer).toBeHidden();
  await expect(page.getByRole("complementary")).toBeVisible();
  await expect(page.locator(".top-header")).toBeVisible();
  await expect(page.locator(".mobile-navigation")).toBeHidden();
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe("");
  await expect(page.getByRole("complementary")).toHaveCSS("width", "248px");
  await expect(page.locator(".top-header")).toHaveCSS("height", "72px");

  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.getByRole("complementary")).toHaveCSS("width", "248px");
  await expect(page.locator(".top-header")).toHaveCSS("height", "72px");
});

test("passes mobile WCAG smoke tests with the drawer closed and open", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const closedResults = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(closedResults.violations).toEqual([]);

  await openMobileDrawer(page);
  const openResults = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(openResults.violations).toEqual([]);
});
