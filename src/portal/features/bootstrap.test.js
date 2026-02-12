import { describe, expect, it, vi } from "vitest";
import { initializePortal } from "./bootstrap.js";

function createState() {
  return {
    itemsByPath: new Map(),
    activePath: "",
    activeTitle: "",
    activeRouteSuffix: "",
    routeModeByPath: new Map(),
    routeRetryKey: "",
    pendingFramePath: "",
    pendingFrameSetAt: 0,
    memberTreeRaw: [],
    rootPath: "/",
    searchKeyword: "",
    sidebarCollapsed: false,
  };
}

const memberTree = [
  {
    name: "alice",
    projects: [
      {
        name: "demo",
        entry: "alice/demo/index.html",
        files: ["alice/demo/index.html"],
      },
    ],
  },
];

describe("initializePortal", () => {
  it("does not auto-activate first project before trying hash", async () => {
    const state = createState();
    /** @type {{ autoActivateFirst?: boolean }[]} */
    const renderCalls = [];
    const tryOpenFromHash = vi.fn(() => true);

    await initializePortal({
      config: { owner: "o", repo: "r" },
      state,
      setEmptyMessage: vi.fn(),
      renderByCurrentState: (options) => renderCalls.push(options ?? {}),
      tryOpenFromHash,
      buildMemberProjectTree: vi.fn(() => memberTree),
      inferRepoFromLocation: vi.fn(() => ({ owner: "o", repo: "r" })),
      inferRootPath: vi.fn(() => "/"),
      getBranch: vi.fn(),
      getHtmlPathsFromGitHub: vi.fn(),
      getManifestPortalData: vi.fn(async () => ({
        htmlPaths: ["alice/demo/index.html"],
        memberTree,
      })),
    });

    expect(tryOpenFromHash).toHaveBeenCalledWith("/");
    expect(renderCalls).toEqual([{ autoActivateFirst: false }]);
  });

  it("falls back to auto-activate first project when hash is not matched", async () => {
    const state = createState();
    /** @type {{ autoActivateFirst?: boolean }[]} */
    const renderCalls = [];
    const tryOpenFromHash = vi.fn(() => false);

    await initializePortal({
      config: { owner: "o", repo: "r" },
      state,
      setEmptyMessage: vi.fn(),
      renderByCurrentState: (options) => renderCalls.push(options ?? {}),
      tryOpenFromHash,
      buildMemberProjectTree: vi.fn(() => memberTree),
      inferRepoFromLocation: vi.fn(() => ({ owner: "o", repo: "r" })),
      inferRootPath: vi.fn(() => "/"),
      getBranch: vi.fn(),
      getHtmlPathsFromGitHub: vi.fn(),
      getManifestPortalData: vi.fn(async () => ({
        htmlPaths: ["alice/demo/index.html"],
        memberTree,
      })),
    });

    expect(renderCalls).toEqual([
      { autoActivateFirst: false },
      { autoActivateFirst: true },
    ]);
  });
});
