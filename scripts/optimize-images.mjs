import { readdir, readFile, stat, writeFile } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const targetDir = process.argv[2] ?? "public"
const maxDefaultWidth = Number(process.env.IMAGE_MAX_WIDTH ?? 1600)
const maxDefaultHeight = Number(process.env.IMAGE_MAX_HEIGHT ?? 1600)
const maxQrWidth = Number(process.env.IMAGE_QR_MAX_WIDTH ?? 480)
const maxQrHeight = Number(process.env.IMAGE_QR_MAX_HEIGHT ?? 600)
const jpegQuality = Number(process.env.IMAGE_JPEG_QUALITY ?? 82)
const webpQuality = Number(process.env.IMAGE_WEBP_QUALITY ?? 82)

const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp"])
const qrPattern = /(qr|qrcode|weixin|wechat|二维码)/i

async function listImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) return listImages(fullPath)
      if (!entry.isFile()) return []

      const ext = path.extname(entry.name).toLowerCase()
      return imageExtensions.has(ext) ? [fullPath] : []
    }),
  )

  return files.flat()
}

function resizeOptions(file, metadata) {
  const isQrLike = qrPattern.test(file)
  const maxWidth = isQrLike ? maxQrWidth : maxDefaultWidth
  const maxHeight = isQrLike ? maxQrHeight : maxDefaultHeight

  if ((metadata.width ?? 0) <= maxWidth && (metadata.height ?? 0) <= maxHeight) {
    return undefined
  }

  return {
    width: maxWidth,
    height: maxHeight,
    fit: "inside",
    withoutEnlargement: true,
  }
}

function outputPipeline(image, file) {
  const ext = path.extname(file).toLowerCase()

  if (ext === ".jpg" || ext === ".jpeg") {
    return image.jpeg({ quality: jpegQuality, mozjpeg: true })
  }

  if (ext === ".webp") {
    return image.webp({ quality: webpQuality, effort: 4 })
  }

  return image.png({
    adaptiveFiltering: true,
    compressionLevel: 9,
    palette: qrPattern.test(file),
  })
}

async function optimizeImage(file) {
  const original = await readFile(file)
  const image = sharp(original, { animated: false })
  const metadata = await image.metadata()
  const resize = resizeOptions(file, metadata)
  const pipeline = resize ? image.resize(resize) : image
  const optimized = await outputPipeline(pipeline, file).toBuffer()

  if (optimized.length >= original.length) {
    return { file, changed: false, original: original.length, optimized: original.length }
  }

  await writeFile(file, optimized)
  return { file, changed: true, original: original.length, optimized: optimized.length }
}

const rootStat = await stat(targetDir).catch(() => undefined)
if (!rootStat?.isDirectory()) {
  console.error(`Image optimization target does not exist: ${targetDir}`)
  process.exit(1)
}

const images = await listImages(targetDir)
const results = []

for (const file of images) {
  results.push(await optimizeImage(file))
}

const changed = results.filter((result) => result.changed)
const savedBytes = changed.reduce((sum, result) => sum + result.original - result.optimized, 0)

for (const result of changed) {
  const relativePath = path.relative(process.cwd(), result.file)
  const saved = result.original - result.optimized
  console.log(
    `${relativePath}: ${Math.round(result.original / 1024)}KB -> ${Math.round(
      result.optimized / 1024,
    )}KB, saved ${Math.round(saved / 1024)}KB`,
  )
}

console.log(
  `Optimized ${changed.length}/${results.length} images, saved ${Math.round(savedBytes / 1024)}KB`,
)
