import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const routes = [
  { heading: "Overview", label: "Overview", path: "/" },
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
  const desktopSearch = sidebar.getByRole("searchbox", { name: "Search workspace" });

  await expect(sidebar.getByRole("link", { name: "Subtera overview" })).toBeVisible();
  await expect(sidebar.getByText("Acme Cloud", { exact: true })).toBeVisible();
  await expect(sidebar.getByText("Maya Chen", { exact: true })).toBeVisible();
  await expect(sidebar.getByText("Workspace Admin", { exact: true })).toBeVisible();
  await expect(desktopSearch).toHaveAttribute("placeholder", "Search");
  await expect(desktopSearch).toHaveValue("");
  expect(await sidebar.innerText()).not.toContain("null");
  await expect(page.getByRole("button", { name: "Help" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Notifications" })).toBeVisible();
  await expect(page.getByText("Phase 1", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Technical foundation", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Portfolio project", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Local demo", { exact: true })).toHaveCount(0);
});

test("renders and operates the approved Overview dashboard", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: "Overview" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Overview metrics" })).toBeVisible();
  await expect(page.getByRole("figure", { name: "Revenue Overview" })).toBeVisible();
  await expect(page.getByRole("figure", { name: "Customer Growth" })).toBeVisible();
  await expect(page.getByRole("figure", { name: "Subscriptions by Plan" })).toBeVisible();
  await expect(page.getByRole("table", { name: "Recent subscription transactions" })).toBeVisible();

  const revenueFigure = page.getByRole("figure", { name: "Revenue Overview" });
  await revenueFigure.getByRole("radio", { name: "MRR" }).click();
  await expect(revenueFigure.getByRole("radio", { name: "MRR" })).toBeChecked();
  await expect(revenueFigure.locator(".chart-legend-label").getByText("Current MRR")).toBeVisible();

  const filterTrigger = page.getByRole("button", { name: "Filters" });
  await filterTrigger.click();
  const filterDialog = page.getByRole("dialog", { name: "Filter recent transactions" });
  await filterDialog.getByRole("combobox", { name: "Status" }).selectOption("refunded");
  await expect(filterDialog.getByText("1 of 5 shown")).toBeVisible();
  await expect(page.getByRole("rowheader", { name: /Marco Ruiz/ })).toBeVisible();
  await expect(page.getByRole("rowheader", { name: /Olivia Chen/ })).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(filterDialog).toBeHidden();
  await expect(filterTrigger).toBeFocused();

  await expect(page.getByRole("link", { name: "View details" })).toHaveAttribute(
    "href",
    "/subscriptions",
  );
  await expect(page.getByRole("link", { name: "View all" }).first()).toHaveAttribute(
    "href",
    "/customers",
  );
  expect(consoleErrors).toEqual([]);
});

test("contains the Overview layout at every required integration viewport", async ({ page }) => {
  const consoleProblems: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") {
      consoleProblems.push(message.text());
    }
  });
  const viewports = [
    { width: 1440, height: 900 },
    { width: 1200, height: 900 },
    { width: 1024, height: 800 },
    { width: 768, height: 800 },
    { width: 390, height: 844 },
    { width: 320, height: 700 },
  ] as const;

  await page.goto("/");

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await expect(page.getByRole("heading", { level: 1, name: "Overview" })).toBeVisible();
    await expect(page.getByRole("figure", { name: "Revenue Overview" })).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(hasHorizontalOverflow).toBe(false);
  }

  expect(consoleProblems).toEqual([]);
});

test("keeps the approved Overview actions available on mobile", async ({ page }) => {
  const consoleProblems: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") {
      consoleProblems.push(message.text());
    }
  });

  await page.goto("/");

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 320, height: 700 },
  ]) {
    await page.setViewportSize(viewport);

    const dateControl = page.getByRole("button", {
      name: /Reporting period: Jun 15 – Jul 14, 2026/,
    });
    const filterAction = page.getByRole("button", { name: "Filters" });
    const exportAction = page.getByRole("button", { name: "Export" });
    const contentWidth = await page
      .locator(".page-container")
      .evaluate((element) => Number.parseFloat(window.getComputedStyle(element).width));
    const dateBounds = await dateControl.boundingBox();
    const filterBounds = await filterAction.boundingBox();
    const exportBounds = await exportAction.boundingBox();

    await expect(dateControl).toBeVisible();
    await expect(filterAction).toBeVisible();
    await expect(exportAction).toBeVisible();
    expect(dateBounds?.width).toBeGreaterThan(contentWidth - 40);
    expect(filterBounds?.height).toBeGreaterThanOrEqual(44);
    expect(exportBounds?.height).toBeGreaterThanOrEqual(44);
    expect(filterBounds?.y).toBe(exportBounds?.y);
    expect(Math.abs((filterBounds?.width ?? 0) - (exportBounds?.width ?? 0))).toBeLessThanOrEqual(
      1,
    );
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      ),
    ).toBe(false);
  }

  const filterAction = page.getByRole("button", { name: "Filters" });
  await filterAction.click();
  const filterDialog = page.getByRole("dialog", { name: "Filter recent transactions" });
  const filterDialogBounds = await filterDialog.boundingBox();
  await expect(filterDialog).toBeVisible();
  expect(filterDialogBounds?.x).toBeGreaterThanOrEqual(0);
  expect((filterDialogBounds?.x ?? 0) + (filterDialogBounds?.width ?? 0)).toBeLessThanOrEqual(320);
  await filterDialog.getByRole("combobox", { name: "Plan" }).selectOption("growth");
  await page.keyboard.press("Escape");
  await expect(filterDialog).toBeHidden();
  const activeFilterAction = page.getByRole("button", { name: "Filters (1)" });
  await expect(activeFilterAction).toBeFocused();
  await expect(activeFilterAction).toBeVisible();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("subtera-overview-transactions-2026-07-14.csv");
  await expect(page.locator(".overview-report-actions [role='status']")).toHaveText(
    "Downloaded subtera-overview-transactions-2026-07-14.csv with 1 transaction.",
  );

  await expect(page.locator(".overview-transactions-mobile")).toBeVisible();
  await expect(page.getByRole("table", { name: "Recent subscription transactions" })).toBeHidden();
  expect(consoleProblems).toEqual([]);
});

test("renders and operates the approved Analytics dashboard", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  });

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/analytics");

  await expect(page).toHaveTitle("Analytics — Subtera");
  await expect(page.getByRole("heading", { level: 1, name: "Analytics" })).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Breadcrumb" }).getByText("Analytics"),
  ).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("region", { name: "Analytics metrics" })).toBeVisible();
  await expect(page.getByRole("figure", { name: "Revenue and MRR Trends" })).toBeVisible();
  await expect(page.getByRole("figure", { name: "Subscription Growth" })).toBeVisible();
  await expect(page.getByRole("figure", { name: "Churn and Retention" })).toBeVisible();
  await expect(
    page.getByRole("table", { name: /Plan performance by subscriber mix/ }),
  ).toBeVisible();
  await expect(page.locator('[data-chart-summary="true"]')).toHaveCount(3);

  const revenueFigure = page.getByRole("figure", { name: "Revenue and MRR Trends" });
  await revenueFigure.getByRole("radio", { name: "MRR" }).click();
  await expect(revenueFigure.getByRole("radio", { name: "MRR" })).toBeChecked();
  await expect(revenueFigure.locator(".chart-legend-label").getByText("Current MRR")).toBeVisible();

  const compare = page.getByRole("button", { name: "Compare to previous period" });
  await expect(compare).toHaveAttribute("aria-pressed", "true");
  await compare.click();
  await expect(compare).toHaveAttribute("aria-pressed", "false");
  await expect(revenueFigure.locator(".chart-legend-label").getByText("Previous MRR")).toHaveCount(
    0,
  );

  const filterTrigger = page.getByRole("button", { name: "Filters" });
  await filterTrigger.click();
  const filterDialog = page.getByRole("dialog", { name: "Filter Analytics report" });
  await filterDialog.getByRole("combobox", { name: "Plan" }).selectOption("growth");
  await expect(filterDialog.getByText("1 of 4 plans shown")).toBeVisible();
  const planTable = page.getByRole("table", { name: /Plan performance by subscriber mix/ });
  await expect(planTable.getByRole("rowheader", { name: "Growth" })).toBeVisible();
  await expect(planTable.getByRole("rowheader", { name: "Starter" })).toHaveCount(0);
  await page.keyboard.press("Escape");
  const activeFilterTrigger = page.getByRole("button", { name: "Filters (1)" });
  await expect(activeFilterTrigger).toBeFocused();

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export report" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("subtera-analytics-report-2026-07-14.csv");
  await expect(page.locator(".analytics-report-actions [role='status']")).toHaveText(
    "Downloaded subtera-analytics-report-2026-07-14.csv with 1 visible plan.",
  );
  expect(consoleErrors).toEqual([]);
});

test("keeps Analytics responsive and its controls reachable at required widths", async ({
  page,
}) => {
  const consoleProblems: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") {
      consoleProblems.push(message.text());
    }
  });
  const viewports = [
    { width: 1440, height: 900 },
    { width: 1200, height: 900 },
    { width: 1024, height: 800 },
    { width: 768, height: 800 },
    { width: 390, height: 844 },
    { width: 320, height: 700 },
  ] as const;

  await page.goto("/analytics");

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await expect(page.getByRole("heading", { level: 1, name: "Analytics" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Export report" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Filters" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Compare to previous period" })).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      ),
    ).toBe(false);
  }

  const dateControl = page.getByRole("button", {
    name: /Reporting period: Jun 15 – Jul 14, 2026/,
  });
  const compareControl = page.getByRole("button", { name: "Compare to previous period" });
  const filterControl = page.getByRole("button", { name: "Filters" });
  const exportControl = page.getByRole("button", { name: "Export report" });

  for (const control of [dateControl, compareControl, filterControl, exportControl]) {
    const bounds = await control.boundingBox();
    expect(bounds?.height).toBeGreaterThanOrEqual(44);
  }

  await filterControl.click();
  const filterDialog = page.getByRole("dialog", { name: "Filter Analytics report" });
  const filterBounds = await filterDialog.boundingBox();
  await expect(filterDialog).toBeVisible();
  expect(filterBounds?.x).toBeGreaterThanOrEqual(0);
  expect((filterBounds?.x ?? 0) + (filterBounds?.width ?? 0)).toBeLessThanOrEqual(320);
  await filterDialog.getByRole("combobox", { name: "Churn performance" }).selectOption("low-churn");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Filters (1)" })).toBeFocused();
  expect(consoleProblems).toEqual([]);
});

test("passes Analytics WCAG smoke tests on desktop and mobile", async ({ page }) => {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/analytics");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  }
});

test("renders and operates the approved Customers dashboard", async ({ page }) => {
  const consoleProblems: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") {
      consoleProblems.push(message.text());
    }
  });

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/customers");

  await expect(page).toHaveTitle("Customers — Subtera");
  await expect(page.getByRole("heading", { level: 1, name: "Customers" })).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Breadcrumb" }).getByText("Customers"),
  ).toHaveAttribute("aria-current", "page");
  await expect(
    page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", {
      name: "Customers",
    }),
  ).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("region", { name: "Customer metrics" })).toBeVisible();
  const table = page.getByRole("table", {
    name: "Customer accounts with subscription status, recurring value and recent activity",
  });
  await expect(table).toBeVisible();
  await expect(table.getByRole("rowheader")).toHaveCount(8);
  await expect(table.getByRole("rowheader", { name: /Olivia Chen/ })).toBeVisible();
  await expect(table.getByRole("row", { name: /Marco Ruiz/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.getByText("Showing 1–8 of 3,214 customers")).toBeVisible();

  const search = page.getByRole("searchbox", { name: "Search customers" });
  await search.fill("BRIGHTLAYER");
  await expect(search).toHaveValue("BRIGHTLAYER");
  await expect(table.getByRole("rowheader")).toHaveCount(1);
  await expect(table.getByRole("rowheader", { name: /Noah Williams/ })).toBeVisible();
  await expect(table.getByRole("rowheader", { name: /Olivia Chen/ })).toHaveCount(0);
  await search.fill("");

  const activeTab = page.getByRole("tab", { name: "Active" });
  await activeTab.focus();
  await page.keyboard.press("Home");
  await expect(page.getByRole("tab", { name: "All" })).toBeFocused();
  await page.keyboard.press("ArrowRight");
  await expect(activeTab).toHaveAttribute("aria-selected", "true");
  const riskFilter = page.getByRole("button", { name: /At risk: 96/ });
  await riskFilter.click();
  await expect(riskFilter).toHaveAttribute("aria-pressed", "true");
  await expect(table.getByRole("rowheader", { name: /Marco Ruiz/ })).toBeVisible();
  await expect(table.getByText("Active")).toBeVisible();
  await expect(table.getByRole("rowheader")).toHaveCount(1);

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export CSV" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("subtera-customers-2026-07-14.csv");
  await expect(page.locator(".customer-page-actions [role='status']")).toHaveText(
    "Downloaded subtera-customers-2026-07-14.csv with 1 customer.",
  );
  expect(consoleProblems).toEqual([]);
});

test("supports Customers popovers, row actions, pagination, and demo-only actions", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/customers");

  const filterTrigger = page.getByRole("button", { name: "Filters" });
  await filterTrigger.click();
  const dialog = page.getByRole("dialog", { name: "Filter customer accounts" });
  await dialog.getByRole("combobox", { name: "Plan" }).selectOption("growth");
  await expect(
    page
      .getByRole("table", {
        name: "Customer accounts with subscription status, recurring value and recent activity",
      })
      .getByRole("rowheader"),
  ).toHaveCount(2);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Filters (1)" })).toBeFocused();

  await page.getByRole("button", { name: "Filters (1)" }).click();
  await page.getByRole("heading", { level: 1, name: "Customers" }).click();
  await expect(page.getByRole("dialog", { name: "Filter customer accounts" })).toBeHidden();
  await expect(page.getByRole("button", { name: "Filters (1)" })).toBeFocused();

  await page.getByRole("button", { name: "Filters (1)" }).click();
  await page
    .getByRole("dialog", { name: "Filter customer accounts" })
    .getByRole("button", { name: "Clear" })
    .click();
  await page.keyboard.press("Escape");

  const rowActionTrigger = page.getByRole("button", { name: "Actions for Marco Ruiz account" });
  await rowActionTrigger.focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("menuitem", { name: "View account (demo)" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(rowActionTrigger).toBeFocused();

  await page.getByRole("button", { name: "Go to next page" }).click();
  await expect(page.getByText("Records not loaded in this static demo")).toBeVisible();
  await page.getByRole("combobox", { name: "Rows per page" }).selectOption("16");
  await expect(page.getByRole("button", { name: "Go to page 1" })).toHaveAttribute(
    "aria-current",
    "page",
  );

  await page.getByRole("button", { name: "Add customer" }).click();
  await expect(page.locator(".customer-page-actions [role='status']")).toHaveText(
    "Add customer is a non-persistent demo action. No customer record was created.",
  );
  await page.getByRole("button", { name: "Refresh" }).click();
  await expect(page.locator(".customer-page-actions [role='status']")).toHaveText(
    "Customer records refreshed. Deterministic demo data is unchanged.",
  );
});

test("keeps Customers responsive with contained scrolling at every required viewport", async ({
  page,
}) => {
  const consoleProblems: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") {
      consoleProblems.push(message.text());
    }
  });
  const viewports = [
    { width: 1440, height: 900 },
    { width: 1200, height: 900 },
    { width: 1024, height: 800 },
    { width: 768, height: 800 },
    { width: 390, height: 844 },
    { width: 320, height: 700 },
  ] as const;

  await page.goto("/customers");

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await expect(page.getByRole("heading", { level: 1, name: "Customers" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Add customer" })).toBeVisible();
    await expect(page.getByRole("searchbox", { name: "Search customers" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Past due" })).toBeAttached();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      ),
    ).toBe(false);

    if (viewport.width < 1024) {
      await expect(page.locator(".mobile-navigation")).toBeVisible();
      await expect(page.getByRole("complementary")).toBeHidden();
    }
  }

  const tableViewport = page.getByRole("region", {
    name: "Scrollable customer accounts table",
  });
  expect(await tableViewport.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(
    true,
  );
  expect(
    await page
      .getByRole("region", { name: "Customer lifecycle tabs" })
      .evaluate((element) => element.scrollWidth > element.clientWidth),
  ).toBe(true);
  const contentWidth = await page
    .locator(".page-container")
    .evaluate((element) => Number.parseFloat(window.getComputedStyle(element).width));
  const searchBounds = await page.locator(".customer-page-search").boundingBox();
  const addBounds = await page.getByRole("button", { name: "Add customer" }).boundingBox();
  expect(searchBounds?.width).toBeGreaterThan(contentWidth - 40);
  expect(addBounds?.height).toBeGreaterThanOrEqual(44);

  const { drawer } = await openMobileDrawer(page);
  await expect(
    drawer.getByRole("navigation", { name: "Mobile primary navigation" }).getByRole("link", {
      name: "Customers",
    }),
  ).toHaveAttribute("aria-current", "page");
  await page.keyboard.press("Escape");
  expect(consoleProblems).toEqual([]);
});

test("passes Customers WCAG smoke tests on desktop and mobile", async ({ page }) => {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/customers");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  }
});

test("renders and operates the approved Subscriptions dashboard", async ({ page }) => {
  const consoleProblems: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") {
      consoleProblems.push(message.text());
    }
  });

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/subscriptions");

  await expect(page).toHaveTitle("Subscriptions — Subtera");
  await expect(page.getByRole("heading", { level: 1, name: "Subscriptions" })).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", {
      name: "Subscriptions",
    }),
  ).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("region", { name: "Subscription metrics" })).toBeVisible();
  await expect(page.getByText("2,846 active · $84,720 MRR · 100% subscriber share")).toBeVisible();
  const statusFigure = page.getByRole("figure", { name: "Subscription Status" });
  await expect(statusFigure).toBeVisible();
  await expect(statusFigure.locator(".chart-donut-total")).toHaveText("3,164");
  await expect(statusFigure.getByText("Churned during selected period")).toBeVisible();
  await expect(statusFigure.getByText("104")).toBeVisible();

  const table = page.getByRole("table", {
    name: "All subscriptions with plan, billing cycle, lifecycle status, dates, and amount",
  });
  await expect(table).toBeVisible();
  await expect(table.getByRole("rowheader")).toHaveCount(8);
  await expect(table.getByRole("rowheader", { name: /Olivia Chen/ })).toBeVisible();
  await expect(table.getByRole("rowheader", { name: /Liam Carter/ })).toBeVisible();
  await expect(table.getByText("Trialing")).toBeVisible();
  await expect(table.getByText("Past due")).toBeVisible();
  await expect(table.getByText("Canceled")).toBeVisible();
  await expect(table.getByRole("row", { name: /Sophia Nguyen/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.getByText("Showing 1–8 of 3,268 subscription records")).toBeVisible();
  expect((await page.locator("main").innerText()).toLocaleLowerCase()).not.toContain("undefined");
  expect((await page.locator("main").innerText()).toLocaleLowerCase()).not.toContain("null");
  expect(consoleProblems).toEqual([]);
});

test("supports Subscriptions search, composed filters, sorting, export, actions, and pagination", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/subscriptions");
  const table = page.getByRole("table", {
    name: "All subscriptions with plan, billing cycle, lifecycle status, dates, and amount",
  });
  const search = page.getByRole("searchbox", { name: "Search subscriptions" });

  await search.fill("TEAMS");
  await expect(table.getByRole("rowheader")).toHaveCount(2);
  await expect(table.getByRole("rowheader", { name: /Noah Williams/ })).toBeVisible();
  await expect(table.getByRole("rowheader", { name: /Sophia Nguyen/ })).toBeVisible();
  await search.fill("");

  const filterTrigger = page.getByRole("button", { name: "Filters" });
  await filterTrigger.click();
  const filterDialog = page.getByRole("dialog", { name: "Filter subscriptions" });
  await filterDialog.getByRole("combobox", { name: "Plan" }).selectOption("growth");
  await filterDialog.getByRole("combobox", { name: "Status" }).selectOption("active");
  await expect(table.getByRole("rowheader")).toHaveCount(2);
  await expect(table.getByRole("rowheader", { name: /Olivia Chen/ })).toBeVisible();
  await expect(table.getByRole("rowheader", { name: /Maya Patel/ })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Filters (2)" })).toBeFocused();

  await table.getByRole("button", { name: /Amount, not sorted/ }).click();
  await expect(
    table.getByRole("columnheader", { name: /Amount, sorted ascending/ }),
  ).toHaveAttribute("aria-sort", "ascending");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("subtera-subscriptions-2026-07-14.csv");
  await expect(page.locator(".subscriptions-page > [role='status']")).toHaveText(
    "Downloaded subtera-subscriptions-2026-07-14.csv with 2 subscriptions.",
  );

  await page.getByRole("combobox", { name: "Plan" }).selectOption("all");
  await page.getByRole("combobox", { name: "Status" }).selectOption("all");
  const rowActionTrigger = page.getByRole("button", {
    name: "Actions for Sophia Nguyen subscription",
  });
  await rowActionTrigger.focus();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("menuitem", { name: "View subscription (demo)" })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("menuitem", { name: "Clear selection" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(rowActionTrigger).toBeFocused();
  await expect(table.getByRole("row", { name: /Sophia Nguyen/ })).toHaveAttribute(
    "aria-selected",
    "false",
  );

  await page.getByRole("button", { name: "Go to next page" }).click();
  await expect(page.getByText("Records not loaded in this static demo")).toBeVisible();
  await expect(page.getByText(/Page 2 of 409/)).toBeVisible();
  await page.getByRole("button", { name: "Go to previous page" }).click();
  await expect(table.getByRole("rowheader")).toHaveCount(8);

  await page.getByRole("button", { name: "Add subscription" }).click();
  await expect(page.locator(".subscriptions-page > [role='status']")).toHaveText(
    "Add subscription is a non-persistent demo action. No subscription record was created.",
  );
});

test("keeps Subscriptions responsive with contained table scrolling and mobile navigation", async ({
  page,
}) => {
  const consoleProblems: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") {
      consoleProblems.push(message.text());
    }
  });
  const viewports = [
    { width: 1440, height: 900 },
    { width: 1200, height: 900 },
    { width: 1100, height: 800 },
    { width: 1024, height: 800 },
    { width: 768, height: 800 },
    { width: 390, height: 844 },
    { width: 320, height: 700 },
  ] as const;

  await page.goto("/subscriptions");

  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    await expect(page.getByRole("heading", { level: 1, name: "Subscriptions" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Add subscription" })).toBeVisible();
    await expect(page.getByRole("searchbox", { name: "Search subscriptions" })).toBeAttached();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
      ),
    ).toBe(false);

    const addBounds = await page.getByRole("button", { name: "Add subscription" }).boundingBox();
    expect(addBounds?.height).toBeGreaterThanOrEqual(viewport.width < 1024 ? 44 : 40);

    if (viewport.width === 1200) {
      expect(
        await page
          .locator(".subscriptions-page-header")
          .evaluate((element) => Number.parseFloat(window.getComputedStyle(element).height)),
      ).toBeLessThan(180);
    }

    if (viewport.width < 1024) {
      await expect(page.locator(".mobile-navigation")).toBeVisible();
      await expect(page.getByRole("complementary")).toBeHidden();
    }
  }

  const tableViewport = page.getByRole("region", { name: "Scrollable subscriptions table" });
  const planViewport = page.getByRole("region", {
    name: "Scrollable subscription plan performance table",
  });
  expect(await tableViewport.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(
    true,
  );
  expect(await planViewport.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(
    true,
  );

  const filterTrigger = page.getByRole("button", { name: "Filters" });
  await filterTrigger.click();
  const filterDialog = page.getByRole("dialog", { name: "Filter subscriptions" });
  const filterBounds = await filterDialog.boundingBox();
  expect(filterBounds?.x).toBeGreaterThanOrEqual(0);
  expect((filterBounds?.x ?? 0) + (filterBounds?.width ?? 0)).toBeLessThanOrEqual(320);
  await page.keyboard.press("Escape");
  await expect(filterTrigger).toBeFocused();

  const { drawer } = await openMobileDrawer(page);
  await expect(
    drawer.getByRole("navigation", { name: "Mobile primary navigation" }).getByRole("link", {
      name: "Subscriptions",
    }),
  ).toHaveAttribute("aria-current", "page");
  await page.keyboard.press("Escape");
  expect(consoleProblems).toEqual([]);
});

test("passes Subscriptions WCAG smoke tests on desktop and mobile", async ({ page }) => {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/subscriptions");

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  }
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
  await expect(page.locator(".mobile-notification-status")).toHaveText("You’re all caught up.");
  const dismissStatusButton = page.getByRole("button", { name: "Dismiss notification status" });
  const dismissStatusBounds = await dismissStatusButton.boundingBox();
  expect(dismissStatusBounds?.width).toBeGreaterThanOrEqual(44);
  expect(dismissStatusBounds?.height).toBeGreaterThanOrEqual(44);
  await page.keyboard.press("Escape");
  await expect(page.locator(".mobile-notification-status")).toBeHidden();

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);
});

test("opens a modal drawer and contains keyboard focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const { drawer, menuButton } = await openMobileDrawer(page);
  const mobileSearch = drawer.getByRole("searchbox", { name: "Search workspace" });

  await expect(menuButton).toHaveAttribute("aria-expanded", "true");
  await expect(mobileSearch).toHaveAttribute("placeholder", "Search workspace");
  await expect(mobileSearch).toHaveValue("");
  expect(await drawer.innerText()).not.toContain("null");
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
