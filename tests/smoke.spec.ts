import { test, expect } from "@playwright/test";

const routes = [
  { path: "/inbox", name: "Inbox", mustContain: "Inbox" },
  { path: "/inbox?status=unread", name: "Inbox (unread)", mustContain: "Welcome" },
  { path: "/skills", name: "Skills", mustContain: "Select a skill" },
  { path: "/skills?skill=onboarding", name: "Skills (detail)", mustContain: "Onboarding" },
  { path: "/routines", name: "Routines", mustContain: "Routines" },
  { path: "/map", name: "Map (org)", mustContain: "Acme" },
  { path: "/map/directory", name: "Map (directory)", mustContain: "Directory" },
  { path: "/map/raci", name: "Map (RACI)", mustContain: "RACI" },
  { path: "/vault", name: "Vault", mustContain: "Vault" },
  { path: "/settings", name: "Settings", mustContain: "Settings" },
];

for (const route of routes) {
  test(`${route.name} (${route.path}) loads without errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    const response = await page.goto(route.path);

    expect(response?.status()).toBeLessThan(400);
    await expect(page.locator("body")).toContainText(route.mustContain);
    expect(errors).toEqual([]);
  });
}

test("/ redirects to /inbox", async ({ page }) => {
  await page.goto("/");
  await page.waitForURL("/inbox");
  expect(page.url()).toContain("/inbox");
});

test("sidebar has nav items", async ({ page }) => {
  await page.goto("/inbox");
  const sidebar = page.locator("aside");
  for (const item of ["Inbox", "Skills", "Routines", "Map", "Vault", "Settings"]) {
    await expect(sidebar.getByText(item)).toBeVisible();
  }
});

test("sidebar shows sync to github button", async ({ page }) => {
  await page.goto("/inbox");
  await expect(page.locator("aside").getByText("Sync to GitHub")).toBeVisible();
});

test("sidebar shows daemon status", async ({ page }) => {
  await page.goto("/inbox");
  await expect(page.locator("aside").getByText(/Daemon/)).toBeVisible();
});

test("skills detail shows visibility and open file", async ({ page }) => {
  await page.goto("/skills?skill=weekly-summary");
  await expect(page.getByText("Aggregates data from connected systems")).toBeVisible();
  await expect(page.getByText("Open file")).toBeVisible();
  await expect(page.getByText(/Visibility:/)).toBeVisible();
});

test("inbox messages are expandable with actions", async ({ page }) => {
  await page.goto("/inbox?status=unread");
  await page.getByText("Welcome to your company brain").click();
  await expect(page.getByText("Mark read")).toBeVisible();
  await expect(page.getByRole("button", { name: "Archive" })).toBeVisible();
});

test("routines page has tabs and daemon status", async ({ page }) => {
  await page.goto("/routines");
  await expect(page.locator("main").getByText("Daemon:", { exact: false }).first()).toBeVisible();
  await expect(page.getByText("Activity")).toBeVisible();
});

test("routines have toggle switches", async ({ page }) => {
  await page.goto("/routines");
  const toggles = page.locator("button.rounded-full");
  const count = await toggles.count();
  expect(count).toBeGreaterThan(0);
});

test("RACI matrix shows decisions", async ({ page }) => {
  await page.goto("/map/raci");
  await expect(page.getByText("Hiring")).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "Responsible" })).toBeVisible();
});

test("directory shows entries with slugs", async ({ page }) => {
  await page.goto("/map/directory");
  await expect(page.getByText("shopify").first()).toBeVisible();
  await expect(page.getByText("shenzhen-components").first()).toBeVisible();
});

test("connections page shows pairwise relationships", async ({ page }) => {
  await page.goto("/map/connections");
  await expect(page.getByText("→").first()).toBeVisible();
  await expect(page.getByText("↔").first()).toBeVisible();
});

test("directory filters by team", async ({ page }) => {
  await page.goto("/map/directory");
  await expect(page.getByText("All").first()).toBeVisible();
  await expect(page.getByText("Operations").first()).toBeVisible();
});

test("settings page has page toggles", async ({ page }) => {
  await page.goto("/settings");
  await expect(page.getByText("Sidebar pages")).toBeVisible();
  await expect(page.locator("main").getByText("Inbox")).toBeVisible();
});

test("vault shows integrations with status dots", async ({ page }) => {
  await page.goto("/vault");
  await expect(page.getByRole("cell", { name: "Slack", exact: true })).toBeVisible();
  await expect(page.getByRole("cell", { name: "Linear", exact: true })).toBeVisible();
  await expect(page.getByRole("cell", { name: "HubSpot", exact: true })).toBeVisible();
});

test("vault shows last checked column", async ({ page }) => {
  await page.goto("/vault");
  await expect(page.getByText("Last Checked")).toBeVisible();
});

test("settings shows user section", async ({ page }) => {
  await page.goto("/settings");
  await expect(page.getByText("User")).toBeVisible();
  await expect(page.getByText("Not set").first()).toBeVisible();
});
