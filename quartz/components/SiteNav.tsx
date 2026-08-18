import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { pathToRoot } from "../util/path"
import style from "./styles/siteNav.scss"

const languageBootstrap = `
try {
  if (localStorage.getItem("jobo-language") === "en") {
    document.documentElement.dataset.language = "en"
  }
} catch {}
`

const languageScript = `
const root = document.documentElement
const storageKey = "jobo-language"
const button = document.querySelector("[data-language-toggle]")
const qrTriggers = [...document.querySelectorAll("[data-qr-trigger]")]
const qrDialog = document.querySelector("[data-qr-dialog]")
const qrClose = document.querySelector("[data-qr-close]")
const qrImage = document.querySelector("[data-qr-preview]")
const qrTitle = document.querySelector("[data-qr-title]")
let activeQrTrigger = null

function setLanguage(language) {
  const isEnglish = language === "en"
  root.dataset.language = isEnglish ? "en" : "zh-CN"
  root.lang = isEnglish ? "en" : "zh-CN"

  document.querySelectorAll("[data-zh][data-en]").forEach((element) => {
    element.textContent = isEnglish ? element.dataset.en : element.dataset.zh
  })

  if (button) {
    button.setAttribute("aria-pressed", String(isEnglish))
  }
}

let savedLanguage = "zh"
try {
  savedLanguage = localStorage.getItem(storageKey) ?? "zh"
} catch {}
setLanguage(savedLanguage === "en" ? "en" : "zh")

function toggleLanguage() {
  const nextLanguage = root.dataset.language === "en" ? "zh" : "en"
  try {
    localStorage.setItem(storageKey, nextLanguage)
  } catch {}
  setLanguage(nextLanguage)
}

function syncQrState() {
  qrTriggers.forEach((trigger) => {
    trigger.setAttribute("aria-expanded", String(trigger === activeQrTrigger && qrDialog?.open))
  })
}

function openQr(event) {
  const trigger = event.currentTarget
  if (!qrDialog || qrDialog.open) return

  const image = trigger.dataset.qrImage
  const titleZh = trigger.dataset.qrTitleZh
  const titleEn = trigger.dataset.qrTitleEn

  if (image) {
    qrImage?.setAttribute("src", image)
    qrImage?.setAttribute("alt", trigger.dataset.qrAlt ?? "")
    qrImage?.setAttribute("width", trigger.dataset.qrWidth ?? "960")
    qrImage?.setAttribute("height", trigger.dataset.qrHeight ?? "1418")
  }

  if (titleZh && titleEn && qrTitle) {
    qrTitle.dataset.zh = titleZh
    qrTitle.dataset.en = titleEn
    qrTitle.textContent = root.dataset.language === "en" ? titleEn : titleZh
  }

  activeQrTrigger = trigger
  qrDialog.showModal()
  syncQrState()
  qrClose?.focus()
}

function closeQr() {
  if (qrDialog?.open) qrDialog.close()
}

function closeQrOnBackdrop(event) {
  if (event.target === qrDialog) closeQr()
}

function handleQrClose() {
  activeQrTrigger = null
  syncQrState()
}

button?.addEventListener("click", toggleLanguage)
qrTriggers.forEach((trigger) => trigger.addEventListener("click", openQr))
qrClose?.addEventListener("click", closeQr)
qrDialog?.addEventListener("click", closeQrOnBackdrop)
qrDialog?.addEventListener("close", handleQrClose)
window.addCleanup(() => {
  button?.removeEventListener("click", toggleLanguage)
  qrTriggers.forEach((trigger) => trigger.removeEventListener("click", openQr))
  qrClose?.removeEventListener("click", closeQr)
  qrDialog?.removeEventListener("click", closeQrOnBackdrop)
  qrDialog?.removeEventListener("close", handleQrClose)
})
`

const SiteNav: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const baseDir = pathToRoot(fileData.slug!)
  const homeHref = baseDir === "." ? "./" : `${baseDir}/`
  const sectionHref = (section: string) => `${homeHref}#${section}`

  return (
    <nav class="site-nav" aria-label="JOBO实验室主导航">
      <div class="site-nav-inner">
        <a class="site-mark" href={homeHref} aria-label="返回首页">
          JOBO实验室
        </a>
        <div class="site-links">
          <a href={sectionHref("projects")}>
            <span data-zh="项目" data-en="Projects">
              项目
            </span>
          </a>
          <a href={sectionHref("products")}>
            <span data-zh="产品" data-en="Products">
              产品
            </span>
          </a>
          <div class="site-contact-links" aria-label="联系方式">
            <button
              class="site-contact-link"
              type="button"
              data-qr-trigger
              data-qr-image={`${homeHref}static/douyin-qr.jpg`}
              data-qr-title-zh="抖音二维码"
              data-qr-title-en="Douyin QR code"
              data-qr-alt="JOBO 抖音二维码"
              data-qr-width="1279"
              data-qr-height="1910"
              aria-expanded="false"
              aria-controls="qr-dialog"
              aria-label="打开抖音二维码 / Open Douyin QR code"
            >
              <span class="contact-full" data-zh="抖音" data-en="Douyin">
                抖音
              </span>
              <span class="contact-short" data-zh="抖" data-en="D">
                抖
              </span>
            </button>
            <button
              class="site-contact-link"
              type="button"
              data-qr-trigger
              data-qr-image={`${homeHref}static/xiaohongshu-qr.jpg`}
              data-qr-title-zh="小红书二维码"
              data-qr-title-en="Xiaohongshu QR code"
              data-qr-alt="JOBO 小红书二维码"
              data-qr-width="987"
              data-qr-height="1347"
              aria-expanded="false"
              aria-controls="qr-dialog"
              aria-label="打开小红书二维码 / Open Xiaohongshu QR code"
            >
              <span class="contact-full" data-zh="小红书" data-en="Xiaohongshu">
                小红书
              </span>
              <span class="contact-short" data-zh="红" data-en="R">
                红
              </span>
            </button>
            <a
              class="site-contact-link"
              href="https://x.com/BJO221238954295"
              target="_blank"
              rel="noreferrer"
              aria-label="X"
            >
              <span data-zh="X" data-en="X">
                X
              </span>
            </a>
            <button
              class="wechat-toggle qr-trigger"
              type="button"
              data-qr-trigger
              data-qr-image={`${homeHref}static/wechat-qr.jpg`}
              data-qr-title-zh="微信二维码"
              data-qr-title-en="WeChat QR code"
              data-qr-alt="JOBO 微信二维码"
              data-qr-width="960"
              data-qr-height="1418"
              aria-expanded="false"
              aria-controls="qr-dialog"
              aria-label="打开微信二维码 / Open WeChat QR code"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.7 5.2c-3.2 0-5.8 2-5.8 4.6 0 1.5.8 2.8 2.2 3.7l-.6 2 2.2-1.1c.6.2 1.3.3 2 .3h.4c-.1-.4-.2-.8-.2-1.2 0-2.6 2.5-4.7 5.7-4.7.3 0 .6 0 .9.1-.5-2.1-2.8-3.7-5.8-3.7Z" />
                <path d="M16.1 10.1c-2.7 0-4.9 1.7-4.9 3.8s2.2 3.8 4.9 3.8c.6 0 1.2-.1 1.7-.3l1.8.9-.5-1.7c1.2-.7 1.9-1.6 1.9-2.7 0-2.1-2.2-3.8-4.9-3.8Zm-1.5 3.4a.7.7 0 1 1 0-1.4.7.7 0 0 1 0 1.4Zm3 0a.7.7 0 1 1 0-1.4.7.7 0 0 1 0 1.4Z" />
              </svg>
            </button>
            <dialog
              class="qr-dialog"
              id="qr-dialog"
              data-qr-dialog
              aria-labelledby="qr-dialog-title"
            >
              <button
                class="qr-dialog-close"
                type="button"
                data-qr-close
                aria-label="关闭二维码 / Close QR code"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
              <figure>
                <img
                  data-qr-preview
                  src={`${homeHref}static/wechat-qr.jpg`}
                  alt="JOBO 微信二维码"
                  width="960"
                  height="1418"
                  decoding="async"
                />
                <figcaption
                  id="qr-dialog-title"
                  data-qr-title
                  data-zh="微信二维码"
                  data-en="WeChat QR code"
                >
                  微信二维码
                </figcaption>
              </figure>
            </dialog>
          </div>
          <button
            class="language-toggle"
            type="button"
            data-language-toggle
            aria-label="切换语言 / Switch language"
            aria-pressed="false"
          >
            <span data-zh="EN" data-en="中">
              EN
            </span>
          </button>
        </div>
      </div>
    </nav>
  )
}

SiteNav.beforeDOMLoaded = languageBootstrap
SiteNav.afterDOMLoaded = languageScript
SiteNav.css = style

export default (() => SiteNav) satisfies QuartzComponentConstructor
