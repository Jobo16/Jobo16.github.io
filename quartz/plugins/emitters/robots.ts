import { FullSlug } from "../../util/path"
import { QuartzEmitterPlugin } from "../types"
import { write } from "./helpers"

export const Robots: QuartzEmitterPlugin = () => ({
  name: "Robots",
  async *emit(ctx) {
    const baseUrl = ctx.cfg.configuration.baseUrl
    if (!baseUrl) {
      return
    }

    const siteUrl = new URL(`https://${baseUrl}`)
    if (!siteUrl.pathname.endsWith("/")) {
      siteUrl.pathname += "/"
    }

    yield write({
      ctx,
      slug: "robots" as FullSlug,
      ext: ".txt",
      content: `User-agent: *\nAllow: /\n\nSitemap: ${new URL("sitemap.xml", siteUrl)}\n`,
    })
  },
  async *partialEmit() {},
})
