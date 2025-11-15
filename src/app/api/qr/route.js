import QRCode from "qrcode"
import nodeCanvas from "canvas"
import { JSDOM } from "jsdom"
import { createRequire } from "module"
import { corsHeaders, corsPreflight } from "../_lib/cors"

// Create require for CommonJS modules
const require = createRequire(import.meta.url)

// Generate rounded QR code using qr-code-styling
const generateRoundedQR = async (data, errorCorrectionLevel, size) => {
  // Import CommonJS module properly - it exports { QRCodeStyling }
  const { QRCodeStyling } = require("qr-code-styling/lib/qr-code-styling.common.js")

  // Create QR code with your exact styling configuration
  const qrCode = new QRCodeStyling({
    type: "canvas",
    shape: "square",
    width: size,
    height: size,
    data: data,
    margin: 0,
    qrOptions: {
      typeNumber: 0,
      mode: "Byte",
      errorCorrectionLevel: errorCorrectionLevel,
    },
    dotsOptions: {
      type: "rounded",
      color: "#000000",
    },
    backgroundOptions: {
      color: "#ffffff",
    },
    cornersSquareOptions: {
      type: "extra-rounded",
      color: "#000000",
    },
    cornersDotOptions: {
      type: "dot",
      color: "#000000",
    },
    nodeCanvas,
    jsdom: JSDOM,
  })

  // getRawData returns a Buffer in Node.js
  return await qrCode.getRawData("png")
}

export const runtime = "nodejs"

export const OPTIONS = () => corsPreflight()

export const POST = async request => {
  try {
    // Get parameters from query string
    const { searchParams } = request.nextUrl
    const queryUrl = searchParams.get("url")
    const querySource = searchParams.get("source")
    const queryMedium = searchParams.get("medium")
    const queryLogo = searchParams.get("logo")
    const queryRounded = searchParams.get("rounded")
    const querySize = searchParams.get("size")

    // Get parameters from body
    let bodyParams = {}
    try {
      bodyParams = await request.json()
    } catch {
      // If body parsing fails, just use query params
    }

    // Merge params (body takes precedence over query params)
    const url = bodyParams.url || queryUrl
    const source = bodyParams.source || querySource
    const medium = bodyParams.medium || queryMedium
    const logo = bodyParams.logo !== undefined ? bodyParams.logo : queryLogo
    const rounded = bodyParams.rounded !== undefined ? bodyParams.rounded : queryRounded
    const size = bodyParams.size || querySize

    // Parse booleans
    const withLogo = logo === true || logo === "true" || logo === "1"
    const withRounded = rounded === true || rounded === "true" || rounded === "1"

    // Parse size with default of 1024
    const qrSize = size ? parseInt(size, 10) : 1024

    // Validate required URL parameter
    if (!url) {
      return new Response(
        JSON.stringify({ error: "URL parameter is required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      )
    }

    // Build final URL with UTM parameters if provided
    let finalUrl
    try {
      finalUrl = new URL(url)

      if (source) {
        finalUrl.searchParams.set("utm_source", source)
      }

      if (medium) {
        finalUrl.searchParams.set("utm_medium", medium)
      }
    } catch (error) {
      return new Response(
        JSON.stringify({ error: "Invalid URL format" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      )
    }

    // Generate QR code as PNG buffer
    // Use high error correction when logo is requested (allows ~30% coverage)
    // Use medium error correction otherwise (allows ~15% coverage)
    const errorCorrectionLevel = withLogo ? "H" : "M"
    let qrBuffer

    if (withRounded) {
      // Use qr-code-styling for rounded corners
      qrBuffer = await generateRoundedQR(finalUrl.toString(), errorCorrectionLevel, qrSize)
    } else {
      // Use standard qrcode library
      qrBuffer = await QRCode.toBuffer(finalUrl.toString(), {
        type: "png",
        width: qrSize,
        margin: 2,
        errorCorrectionLevel,
      })
    }

    // Return QR code image
    return new Response(qrBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Length": qrBuffer.length.toString(),
        ...corsHeaders,
      },
    })
  } catch (error) {
    console.error("QR code generation error:", error)
    return new Response(
      JSON.stringify({ error: "Failed to generate QR code" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    )
  }
}
