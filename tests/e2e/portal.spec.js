import { expect, test } from "@playwright/test";

const htmlPaths = [
  "alice/landing/index.html",
  "bob/dashboard/index.html",
  "bob/dashboard/reports.html",
  "charlie/broken/index.html",
];

const manifestPayload = {
  generatedAt: "2026-02-12T00:00:00Z",
  version: 3,
  htmlPaths,
  members: [
    {
      name: "alice",
      projectCount: 1,
      projects: [
        {
          id: "alice/landing",
          member: "alice",
          name: "landing",
          entry: "alice/landing/index.html",
          pages: ["alice/landing/index.html"],
          pageCount: 1,
          routeMode: "path",
        },
      ],
    },
    {
      name: "bob",
      projectCount: 1,
      projects: [
        {
          id: "bob/dashboard",
          member: "bob",
          name: "dashboard",
          displayName: "Dashboard",
          entry: "bob/dashboard/index.html",
          pages: ["bob/dashboard/index.html", "bob/dashboard/reports.html"],
          hiddenPages: ["bob/dashboard/reports.html"],
          pageCount: 2,
          routeMode: "path",
        },
      ],
    },
    {
      name: "charlie",
      projectCount: 1,
      projects: [
        {
          id: "charlie/broken",
          member: "charlie",
          name: "broken",
          entry: "charlie/broken/index.html",
          pages: ["charlie/broken/index.html"],
          pageCount: 1,
          routeMode: "path",
        },
      ],
    },
  ],
  projects: [
    {
      id: "alice/landing",
      member: "alice",
      name: "landing",
      entry: "alice/landing/index.html",
      pages: ["alice/landing/index.html"],
      pageCount: 1,
      routeMode: "path",
    },
    {
      id: "bob/dashboard",
      member: "bob",
      name: "dashboard",
      displayName: "Dashboard",
      entry: "bob/dashboard/index.html",
      pages: ["bob/dashboard/index.html", "bob/dashboard/reports.html"],
      hiddenPages: ["bob/dashboard/reports.html"],
      pageCount: 2,
      routeMode: "path",
    },
    {
      id: "charlie/broken",
      member: "charlie",
      name: "broken",
      entry: "charlie/broken/index.html",
      pages: ["charlie/broken/index.html"],
      pageCount: 1,
      routeMode: "path",
    },
  ],
  stats: {
    memberCount: 3,
    projectCount: 3,
    pageCount: 4,
  },
};

const landingHtml = `<!doctype html>
<html lang="en">
  <body>
    <h1>Landing Page</h1>
  </body>
</html>`;

const dashboardHtml = `<!doctype html>
<html lang="en">
  <body>
    <h1>Dashboard Page</h1>
    <button id="toMetrics" type="button" onclick='history.pushState({}, "", "/bob/dashboard/index.html/metrics")'>
      Go Metrics
    </button>
  </body>
</html>`;

const reportsHtml = `<!doctype html>
<html lang="en">
  <body>
    <h1>Reports Page</h1>
  </body>
</html>`;

/**
 * @param {import("@playwright/test").Page} page
 * @returns {Promise<void>}
 */
async function mockGitHubApi(page) {
  await page.route(
    /https:\/\/api\.github\.com\/repos\/Jobo16\/Jobo16\.github\.io$/,
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ default_branch: "main" }),
      });
    },
  );

  await page.route(
    /https:\/\/api\.github\.com\/repos\/Jobo16\/Jobo16\.github\.io\/git\/trees\/[^?]+\?recursive=1$/,
    async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          tree: htmlPaths.map((path) => ({ type: "blob", path })),
        }),
      });
    },
  );
}

/**
 * @param {import("@playwright/test").Page} page
 * @returns {Promise<void>}
 */
async function mockManifest(page) {
  await page.route("**/projects.manifest.json", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(manifestPayload),
    });
  });
}

/**
 * @param {import("@playwright/test").Page} page
 * @returns {Promise<void>}
 */
async function mockProjectPages(page) {
  await page.route(/\/alice\/landing\/index\.html(?:\/.*)?$/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/html",
      body: landingHtml,
    });
  });

  await page.route(/\/bob\/dashboard\/index\.html(?:\/.*)?$/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/html",
      body: dashboardHtml,
    });
  });

  await page.route(/\/bob\/dashboard\/reports\.html(?:\/.*)?$/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "text/html",
      body: reportsHtml,
    });
  });

  await page.route(/\/charlie\/broken\/index\.html(?:\/.*)?$/, async (route) => {
    await route.abort("failed");
  });
}

test.beforeEach(async ({ page }) => {
  await mockManifest(page);
  await mockGitHubApi(page);
  await mockProjectPages(page);
});

test("renders member and project catalog, then filters members", async ({ page }) => {
  await page.goto("/");

  const tree = page.locator("#tree");
  await expect(tree).toContainText("alice");
  await expect(tree).toContainText("bob");

  await page.getByPlaceholder("搜索成员名称...").fill("ali");
  await expect(tree).toContainText("alice");
  await expect(tree).not.toContainText("bob");
});

test("updates hash and share link when iframe pushes sub route", async ({ page }) => {
  await page.goto("/");

  await page.locator(".project-summary", { hasText: "Dashboard" }).click();
  await expect(page.locator("#viewerTitle")).toContainText("bob / Dashboard");
  await expect(page).toHaveURL(/#\/bob\/dashboard\/index\.html$/);

  const frame = page.frameLocator("#viewerFrame");
  await expect(frame.locator("#toMetrics")).toBeVisible();
  await frame.locator("#toMetrics").click();

  await expect(page).toHaveURL(/#\/bob\/dashboard\/index\.html\/metrics$/);
  await expect(page.locator("#viewerLink")).toHaveAttribute(
    "href",
    /#\/bob\/dashboard\/index\.html\/metrics$/,
  );
});

test("restores preview from deep link hash", async ({ page }) => {
  await page.goto("/#/bob/dashboard/index.html/reports");

  await expect(page.locator("#viewerTitle")).toContainText("bob / Dashboard");
  await expect(page.locator("#viewerLink")).toHaveAttribute(
    "href",
    /#\/bob\/dashboard\/index\.html\/reports$/,
  );
  await expect(page.locator("#viewerStatus")).toBeHidden();
});

test("shows clear message when iframe load fails", async ({ page }) => {
  await page.goto("/");

  await page.locator(".project-summary", { hasText: "broken" }).click();
  await expect(page.locator("#viewerTitle")).toContainText("charlie / broken");
  await expect(page.locator("#viewerStatus")).toContainText("预览加载失败");
});
