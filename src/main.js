import "./styles.css"

import douyinQr from "./assets/douyin-qr.jpg"
import wechatQr from "./assets/wechat-qr.jpg"
import xiaohongshuQr from "./assets/xiaohongshu-qr.jpg"

const root = document.documentElement
const languageButton = document.querySelector("[data-language-toggle]")
const descriptionMeta = document.querySelector('meta[name="description"]')
const qrDialog = document.querySelector("#qr-dialog")
const qrImage = document.querySelector("[data-qr-preview]")
const qrTitle = document.querySelector("[data-qr-title]")
const qrClose = document.querySelector("[data-qr-close]")
const qrTriggers = [...document.querySelectorAll("[data-qr]")]

const pageCopy = {
  zh: {
    title: "JOBO实验室｜用 AI 重构传统业务流程，持续实验",
    description:
      "JOBO实验室从真实工作问题出发，用 AI、Agent 与自动化重构传统业务流程，并持续验证可用成果。",
  },
  en: {
    title: "JOBO Lab | Rebuild traditional workflows with AI",
    description:
      "JOBO Lab rebuilds traditional workflows with AI, agents, and automation, then tests what actually works.",
  },
}

const qrProfiles = {
  douyin: {
    src: douyinQr,
    width: 1279,
    height: 1910,
    title: { zh: "抖音二维码", en: "Douyin QR code" },
    alt: { zh: "JOBO 抖音二维码", en: "JOBO Douyin QR code" },
  },
  xiaohongshu: {
    src: xiaohongshuQr,
    width: 987,
    height: 1347,
    title: { zh: "小红书二维码", en: "Xiaohongshu QR code" },
    alt: { zh: "JOBO 小红书二维码", en: "JOBO Xiaohongshu QR code" },
  },
  wechat: {
    src: wechatQr,
    width: 960,
    height: 1418,
    title: { zh: "微信二维码", en: "WeChat QR code" },
    alt: { zh: "JOBO 微信二维码", en: "JOBO WeChat QR code" },
  },
}

let activeTrigger = null
let activeProfile = null

function currentLanguage() {
  return root.dataset.language === "en" ? "en" : "zh"
}

function updateActiveQrCopy(language) {
  if (!activeProfile) return
  qrTitle.textContent = activeProfile.title[language]
  qrImage.alt = activeProfile.alt[language]
}

function setLanguage(language) {
  const normalizedLanguage = language === "en" ? "en" : "zh"
  const isEnglish = normalizedLanguage === "en"

  root.dataset.language = isEnglish ? "en" : "zh-CN"
  root.lang = isEnglish ? "en" : "zh-CN"

  document.querySelectorAll("[data-zh][data-en]").forEach((element) => {
    element.textContent = isEnglish ? element.dataset.en : element.dataset.zh
  })

  document.title = pageCopy[normalizedLanguage].title
  descriptionMeta?.setAttribute("content", pageCopy[normalizedLanguage].description)
  languageButton?.setAttribute("aria-pressed", String(isEnglish))
  updateActiveQrCopy(normalizedLanguage)
}

function saveLanguage(language) {
  try {
    localStorage.setItem("jobo-language", language)
  } catch {}
}

function toggleLanguage() {
  const nextLanguage = currentLanguage() === "en" ? "zh" : "en"
  saveLanguage(nextLanguage)
  setLanguage(nextLanguage)
}

function openQr(trigger) {
  const profile = qrProfiles[trigger.dataset.qr]
  if (!profile || !qrDialog || qrDialog.open) return

  activeTrigger = trigger
  activeProfile = profile
  qrImage.src = profile.src
  qrImage.width = profile.width
  qrImage.height = profile.height
  updateActiveQrCopy(currentLanguage())

  trigger.setAttribute("aria-expanded", "true")
  qrDialog.showModal()
  qrClose?.focus()
}

function closeQr() {
  if (qrDialog?.open) qrDialog.close()
}

function handleDialogClose() {
  activeTrigger?.setAttribute("aria-expanded", "false")
  activeTrigger?.focus()
  activeTrigger = null
  activeProfile = null
}

function closeQrOnBackdrop(event) {
  if (event.target === qrDialog) closeQr()
}

let initialLanguage = root.dataset.language === "en" ? "en" : "zh"
try {
  initialLanguage = localStorage.getItem("jobo-language") === "en" ? "en" : "zh"
} catch {}

setLanguage(initialLanguage)
document.querySelector("[data-current-year]").textContent = String(new Date().getFullYear())

languageButton?.addEventListener("click", toggleLanguage)
qrTriggers.forEach((trigger) => trigger.addEventListener("click", () => openQr(trigger)))
qrClose?.addEventListener("click", closeQr)
qrDialog?.addEventListener("click", closeQrOnBackdrop)
qrDialog?.addEventListener("close", handleDialogClose)
