import { describe, expect, it } from "vitest";
import {
  buildViewerHash,
  parseHashSelection,
  toRelativePathFromPathname,
} from "./routing.js";

describe("routing helpers", () => {
  it("builds hash without route suffix", () => {
    expect(buildViewerHash("成员/项目/index.html")).toBe(
      "#/%E6%88%90%E5%91%98/%E9%A1%B9%E7%9B%AE/index.html",
    );
  });

  it("builds hash with route suffix", () => {
    expect(buildViewerHash("成员/项目/index.html", "articles/detail")).toBe(
      "#/%E6%88%90%E5%91%98/%E9%A1%B9%E7%9B%AE/index.html/articles/detail",
    );
  });

  it("parses hash for exact page", () => {
    const selection = parseHashSelection("#/a/b/index.html", [
      "a/b/index.html",
    ]);
    expect(selection).toEqual({ path: "a/b/index.html", routeSuffix: "" });
  });

  it("parses hash with nested route suffix", () => {
    const selection = parseHashSelection("#/a/b/index.html/categories/list", [
      "a/b/index.html",
      "a/b/other.html",
    ]);
    expect(selection).toEqual({
      path: "a/b/index.html",
      routeSuffix: "categories/list",
    });
  });

  it("returns relative path from pathname with encoded chars", () => {
    const relative = toRelativePathFromPathname(
      "/repo/%E6%88%90%E5%91%98/%E9%A1%B9%E7%9B%AE/index.html",
      "/repo/",
    );
    expect(relative).toBe("成员/项目/index.html");
  });
});
