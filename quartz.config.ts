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
          light: "#FFFFFF",
          lightgray: "#E2E2E3",
          gray: "#67676C",
          darkgray: "#3C3C43",
          dark: "#3C3C43",
          secondary: "#3451B2",
          tertiary: "#3A5CCC",
          highlight: "#F6F6F7",
          textHighlight: "#E4E4E9",
        },
        darkMode: {
          light: "#1B1B1F",
          lightgray: "#3C3F44",
          gray: "#98989F",
          darkgray: "#DFDFD6",
          dark: "#F1F1EC",
          secondary: "#A8B1FF",
          tertiary: "#C1C7FF",
          highlight: "#202127",
          textHighlight: "#3C3F44",
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
