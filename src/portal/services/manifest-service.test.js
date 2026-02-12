import { describe, expect, it } from "vitest";
import {
  buildMemberTreeFromManifestMembers,
  collectHtmlPathsFromMembers,
} from "./manifest-service.js";

describe("manifest service", () => {
  it("collects paths from entry and pages with de-dup behavior handled by caller", () => {
    const members = [
      {
        projects: [
          {
            entry: "a/b/index.html",
            pages: ["a/b/index.html", "a/b/post.html"],
          },
        ],
      },
    ];

    expect(collectHtmlPathsFromMembers(members)).toEqual([
      "a/b/index.html",
      "a/b/index.html",
      "a/b/post.html",
    ]);
  });

  it("ignores invalid member/project values", () => {
    const members = [
      null,
      { projects: null },
      { projects: [{ pages: [1, 2, "a/b/index.html"] }] },
    ];
    expect(collectHtmlPathsFromMembers(members)).toEqual(["a/b/index.html"]);
  });

  it("returns empty array for non-array input", () => {
    expect(collectHtmlPathsFromMembers(null)).toEqual([]);
    expect(collectHtmlPathsFromMembers({})).toEqual([]);
  });

  it("builds member tree with route mode, hidden pages and displayName", () => {
    const members = [
      {
        name: "张三",
        displayName: "张三同学",
        projects: [
          {
            id: "张三/博客",
            member: "张三",
            name: "博客",
            displayName: "个人博客",
            entry: "张三/博客/index.html",
            pages: ["张三/博客/index.html", "张三/博客/post.html"],
            hiddenPages: ["张三/博客/post.html", "张三/博客/missing.html"],
            routeMode: "hash",
            order: 2,
            tags: ["demo", "demo", 1],
          },
        ],
      },
    ];

    expect(buildMemberTreeFromManifestMembers(members)).toEqual([
      {
        name: "张三",
        displayName: "张三同学",
        projects: [
          {
            id: "张三/博客",
            member: "张三",
            name: "博客",
            displayName: "个人博客",
            entry: "张三/博客/index.html",
            files: ["张三/博客/index.html", "张三/博客/post.html"],
            hiddenFiles: ["张三/博客/post.html"],
            routeMode: "hash",
            order: 2,
            tags: ["demo"],
            updatedAt: undefined,
          },
        ],
      },
    ]);
  });
});
