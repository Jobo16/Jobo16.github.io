import { describe, expect, it } from "vitest";
import { buildMemberProjectTree, chooseEntry, scoreFile } from "./utils.js";

describe("portal utils", () => {
  it("prefers shallow index.html as project entry", () => {
    const files = [
      "成员/项目/landing.html",
      "成员/项目/index.html",
      "成员/项目/nested/index.html",
    ];
    expect(chooseEntry(files)).toBe("成员/项目/index.html");
  });

  it("scores index.html higher priority than other html files", () => {
    expect(scoreFile("a/b/index.html")).toBe(0);
    expect(scoreFile("a/b/demo.html")).toBeGreaterThan(
      scoreFile("a/b/index.html"),
    );
    expect(scoreFile("a/b/c/index.html")).toBeGreaterThan(
      scoreFile("a/b/index.html"),
    );
  });

  it("builds sorted member->project tree with chosen entry and pages", () => {
    const htmlPaths = [
      "张三/博客/post.html",
      "张三/博客/index.html",
      "李四/展示/gallery.html",
    ];

    const tree = buildMemberProjectTree(htmlPaths);
    expect(tree).toEqual([
      {
        name: "李四",
        projects: [
          {
            name: "展示",
            entry: "李四/展示/gallery.html",
            files: ["李四/展示/gallery.html"],
          },
        ],
      },
      {
        name: "张三",
        projects: [
          {
            name: "博客",
            entry: "张三/博客/index.html",
            files: ["张三/博客/index.html", "张三/博客/post.html"],
          },
        ],
      },
    ]);
  });
});
