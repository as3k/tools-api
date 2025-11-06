import axios from "axios"
import path from "path"
import sharp from "sharp"
import { corsJson, corsPreflight, withCorsHeaders } from "../_lib/cors"

export const runtime = "nodejs"

const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"]
const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/bmp", "image/webp"]

const parseDimension = (value, fallback) => {
  const parsed = Number.parseInt(value ?? "", 10)
  return Number.isNaN(parsed) ? fallback : parsed
}

const optimizeImage = async (buffer, width, quality) =>
  sharp(buffer).resize({ width }).webp({ quality }).toBuffer()

export const OPTIONS = () => corsPreflight()

export const GET = async request => {
  try {
    const { searchParams } = request.nextUrl
    const url = searchParams.get("url")
    const width = parseDimension(searchParams.get("width"), 1920)
    const quality = parseDimension(searchParams.get("quality"), 85)

    if (!url) {
      return corsJson({ error: "Missing required parameter 'url'." }, { status: 400 })
    }

    let parsedUrl
    try {
      parsedUrl = new URL(url)
    } catch {
      return corsJson({ error: "Invalid URL format." }, { status: 400 })
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return corsJson({ error: "URL must use HTTP or HTTPS." }, { status: 400 })
    }

    const fileExtension = path.extname(parsedUrl.pathname).toLowerCase()
    if (!allowedExtensions.includes(fileExtension)) {
      return corsJson(
        {
          error: `URL must point to an image file with one of: ${allowedExtensions.join(", ")}`,
        },
        { status: 400 },
      )
    }

    const response = await axios.get(url, { responseType: "arraybuffer" })
    const imageBuffer = Buffer.from(response.data)
    const optimized = await optimizeImage(imageBuffer, width, quality)

    return withCorsHeaders(
      new Response(optimized, {
        status: 200,
        headers: {
          "Content-Type": "image/webp",
          "Content-Disposition": 'inline; filename="compressed.webp"',
        },
      }),
    )
  } catch (error) {
    console.error("optimize GET error", error)
    return corsJson({ error: "Image processing failed. Please try again." }, { status: 500 })
  }
}

export const POST = async request => {
  try {
    const formData = await request.formData()
    const width = parseDimension(formData.get("width"), 1920)
    const quality = parseDimension(formData.get("quality"), 85)

    let imageBuffer
    const file = formData.get("image")
    if (file && typeof file === "object" && "arrayBuffer" in file) {
      if (!allowedMimeTypes.includes(file.type)) {
        return corsJson({ error: "Unsupported image type." }, { status: 400 })
      }
      const arrayBuffer = await file.arrayBuffer()
      imageBuffer = Buffer.from(arrayBuffer)
    } else {
      const blobField = formData.get("blob")
      if (typeof blobField === "string" && blobField.length > 0) {
        let base64String = blobField
        const base64Prefix = /^data:image\/\w+;base64,/
        if (base64Prefix.test(base64String)) {
          base64String = base64String.replace(base64Prefix, "")
        }
        try {
          imageBuffer = Buffer.from(base64String, "base64")
        } catch (error) {
          console.error("Failed to parse base64 blob", error)
          return corsJson({ error: "Invalid blob payload." }, { status: 400 })
        }
      }
    }

    if (!imageBuffer) {
      return corsJson({ error: "No file upload or blob field found in the request." }, { status: 400 })
    }

    const optimized = await optimizeImage(imageBuffer, width, quality)

    return withCorsHeaders(
      new Response(optimized, {
        status: 200,
        headers: {
          "Content-Type": "image/webp",
          "Content-Disposition": 'inline; filename="compressed.webp"',
        },
      }),
    )
  } catch (error) {
    console.error("optimize POST error", error)
    return corsJson({ error: "Failed to process image." }, { status: 500 })
  }
}
