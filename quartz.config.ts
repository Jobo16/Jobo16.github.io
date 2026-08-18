import { QuartzConfig } from "./quartz/cfg"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "JOBO实验室",
    pageTitleSuffix: "",
    enableSPA: false,
    enablePopovers: false,
    analytics: null,
    locale: "zh-CN",
    baseUrl: "jobo.asia",
    ignorePatterns: ["private", "templates", ".obsidian", "_ai-skills"],
    defaultDateType: "created",
    theme: {
      fontOrigin: "local",
      cdnCaching: false,
      typography: {
        title: { name: "Archivo", weights: [700], includeItalic: false },
        header: { name: "Archivo", weights: [600, 700], includeItalic: false },
        body: { name: "Noto Sans SC", weights: [400], includeItalic: false },
        code: { name: "IBM Plex Mono", weights: [400], includeItalic: false },
      },
      colors: {
        lightMode: {
          light: "#FAFAFA",
          lightgray: "#E4E4E7",
          gray: "#71717A",
          darkgray: "#3F3F46",
          dark: "#18181B",
          secondary: "#2563EB",
          tertiary: "#1D4ED8",
          highlight: "#EFF6FF",
          textHighlight: "#DBEAFE",
        },
        darkMode: {
          light: "#111113",
          lightgray: "#3F3F46",
          gray: "#A1A1AA",
          darkgray: "#E4E4E7",
          dark: "#FAFAFA",
          secondary: "#60A5FA",
          tertiary: "#93C5FD",
          highlight: "#172554",
          textHighlight: "#1E3A8A",
        },
      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false, mermaid: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Robots(),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
    ],
  },
}

export default config
