import { i18n } from "../i18n"
import { FullSlug, getFileExtension, joinSegments, pathToRoot, simplifySlug } from "../util/path"
import { CSSResourceToStyleElement, JSResourceToScriptElement } from "../util/resources"
import { googleFontHref, googleFontSubsetHref } from "../util/theme"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { unescapeHTML } from "../util/escape"
import { CustomOgImagesEmitterName } from "../plugins/emitters/ogImage"
export default (() => {
  const Head: QuartzComponent = ({
    cfg,
    fileData,
    externalResources,
    ctx,
  }: QuartzComponentProps) => {
    const titleSuffix = cfg.pageTitleSuffix ?? ""
    const title =
      (fileData.frontmatter?.title ?? i18n(cfg.locale).propertyDefaults.title) + titleSuffix
    const description =
      fileData.frontmatter?.socialDescription ??
      fileData.frontmatter?.description ??
      unescapeHTML(fileData.description?.trim() ?? i18n(cfg.locale).propertyDefaults.description)

    const { css, js, additionalHead } = externalResources

    const siteUrl = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
    if (!siteUrl.pathname.endsWith("/")) {
      siteUrl.pathname += "/"
    }

    const path = siteUrl.pathname as FullSlug
    const baseDir = fileData.slug === "404" ? path : pathToRoot(fileData.slug!)
    const iconPath = joinSegments(baseDir, "static/icon.svg")

    const canonicalUrl =
      cfg.baseUrl && fileData.slug !== "404"
        ? new URL(
            simplifySlug(fileData.slug!) === "/" ? "." : simplifySlug(fileData.slug!),
            siteUrl,
          )
        : undefined
    const socialUrl = canonicalUrl?.toString() ?? siteUrl.toString()
    const isHomePage = simplifySlug(fileData.slug!) === "/"
    const isArticle = fileData.slug?.startsWith("projects/") || fileData.slug?.startsWith("notes/")
    const ogImageDefaultPath = `https://${cfg.baseUrl}/index-og-image.webp`
    const ogImageType = (getFileExtension(ogImageDefaultPath) ?? "png").replace(/^\./, "")

    const usesCustomOgImage = ctx.cfg.plugins.emitters.some(
      (e) => e.name === CustomOgImagesEmitterName,
    )

    return (
      <head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        {cfg.theme.cdnCaching && cfg.theme.fontOrigin === "googleFonts" && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link rel="stylesheet" href={googleFontHref(cfg.theme)} />
            {cfg.theme.typography.title && (
              <link rel="stylesheet" href={googleFontSubsetHref(cfg.theme, cfg.pageTitle)} />
            )}
          </>
        )}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta property="og:site_name" content={cfg.pageTitle}></meta>
        <meta property="og:title" content={title} />
        <meta property="og:type" content={isArticle ? "article" : "website"} />
        <meta property="og:locale" content="zh_CN" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:image:alt" content={description} />
        <meta name="author" content="周博" />
        <meta name="theme-color" content="#FAFAFA" />

        {!usesCustomOgImage && (
          <>
            <meta property="og:image" content={ogImageDefaultPath} />
            <meta property="og:image:url" content={ogImageDefaultPath} />
            <meta name="twitter:image" content={ogImageDefaultPath} />
            <meta property="og:image:type" content={`image/${ogImageType}`} />
          </>
        )}

        {cfg.baseUrl && (
          <>
            <meta property="twitter:domain" content={cfg.baseUrl}></meta>
            <meta property="og:url" content={socialUrl}></meta>
            <meta property="twitter:url" content={socialUrl}></meta>
            {canonicalUrl && <link rel="canonical" href={canonicalUrl.toString()} />}
          </>
        )}

        <link rel="icon" href={iconPath} />
        <meta name="description" content={description} />
        <meta name="generator" content="Quartz" />
        {fileData.slug === "404" && <meta name="robots" content="noindex" />}
        {cfg.baseUrl && isHomePage && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@graph": [
                  {
                    "@type": "WebSite",
                    "@id": `${socialUrl}#website`,
                    name: cfg.pageTitle,
                    description,
                    url: socialUrl,
                    inLanguage: "zh-CN",
                    publisher: { "@id": `${siteUrl.toString()}#person` },
                  },
                  {
                    "@type": "Person",
                    "@id": `${siteUrl.toString()}#person`,
                    name: "周博",
                    alternateName: "JOBO",
                    url: siteUrl.toString(),
                    jobTitle: "AI 产品与全栈开发实践者",
                    sameAs: [
                      "https://github.com/Jobo16",
                      "https://x.com/BJO221238954295",
                      "https://xhslink.com/m/637xuspR4iI",
                      "https://v.douyin.com/pRUDhpBqOrc/",
                    ],
                  },
                ],
              }),
            }}
          />
        )}

        {css.map((resource) => CSSResourceToStyleElement(resource, true))}
        {js
          .filter((resource) => resource.loadTime === "beforeDOMReady")
          .map((res) => JSResourceToScriptElement(res, true))}
        {additionalHead.map((resource) => {
          if (typeof resource === "function") {
            return resource(fileData)
          } else {
            return resource
          }
        })}
      </head>
    )
  }

  return Head
}) satisfies QuartzComponentConstructor
