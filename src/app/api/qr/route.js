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

// Helper functions to generate QR data strings for different types
const generateQRData = (type, params) => {
  switch (type) {
    case "url":
      return generateUrlData(params)
    case "wifi":
      return generateWifiData(params)
    case "vcard":
      return generateVCardData(params)
    case "email":
      return generateEmailData(params)
    case "sms":
      return generateSmsData(params)
    case "phone":
      return generatePhoneData(params)
    case "text":
      return generateTextData(params)
    default:
      throw new Error(`Unsupported QR type: ${type}`)
  }
}

const generateUrlData = params => {
  const { url, source, medium } = params

  if (!url) {
    throw new Error("URL parameter is required for type 'url'")
  }

  try {
    const finalUrl = new URL(url)

    if (source) {
      finalUrl.searchParams.set("utm_source", source)
    }

    if (medium) {
      finalUrl.searchParams.set("utm_medium", medium)
    }

    return finalUrl.toString()
  } catch (error) {
    throw new Error("Invalid URL format")
  }
}

const generateWifiData = params => {
  const { ssid, password, security = "WPA", hidden = false } = params

  if (!ssid) {
    throw new Error("SSID parameter is required for type 'wifi'")
  }

  // WiFi QR format: WIFI:T:WPA;S:mynetwork;P:mypassword;H:false;;
  const securityType = security.toUpperCase()
  const hiddenFlag = hidden === true || hidden === "true" ? "true" : "false"

  // Escape special characters in SSID and password
  const escapedSsid = ssid.replace(/([\\";,:])/g, "\\$1")
  const escapedPassword = password ? password.replace(/([\\";,:])/g, "\\$1") : ""

  if (securityType === "nopass" || !password) {
    return `WIFI:T:nopass;S:${escapedSsid};H:${hiddenFlag};;`
  }

  return `WIFI:T:${securityType};S:${escapedSsid};P:${escapedPassword};H:${hiddenFlag};;`
}

const generateVCardData = params => {
  const { name, email, phone, company, title, url, address } = params

  if (!name) {
    throw new Error("Name parameter is required for type 'vcard'")
  }

  // Split name into first and last (simple approach)
  const nameParts = name.trim().split(" ")
  const firstName = nameParts[0] || ""
  const lastName = nameParts.slice(1).join(" ") || ""

  // vCard 3.0 format
  let vcard = "BEGIN:VCARD\n"
  vcard += "VERSION:3.0\n"
  vcard += `N:${lastName};${firstName};;;\n`
  vcard += `FN:${name}\n`

  if (company) vcard += `ORG:${company}\n`
  if (title) vcard += `TITLE:${title}\n`
  if (phone) vcard += `TEL:${phone}\n`
  if (email) vcard += `EMAIL:${email}\n`
  if (url) vcard += `URL:${url}\n`
  if (address) vcard += `ADR:;;${address};;;;\n`

  vcard += "END:VCARD"

  return vcard
}

const generateEmailData = params => {
  const { to, subject, body } = params

  if (!to) {
    throw new Error("To parameter is required for type 'email'")
  }

  let emailUrl = `mailto:${to}`
  const queryParams = []

  if (subject) queryParams.push(`subject=${encodeURIComponent(subject)}`)
  if (body) queryParams.push(`body=${encodeURIComponent(body)}`)

  if (queryParams.length > 0) {
    emailUrl += `?${queryParams.join("&")}`
  }

  return emailUrl
}

const generateSmsData = params => {
  const { phone, message } = params

  if (!phone) {
    throw new Error("Phone parameter is required for type 'sms'")
  }

  // SMS format varies by platform, but this works on most devices
  if (message) {
    return `sms:${phone}?body=${encodeURIComponent(message)}`
  }

  return `sms:${phone}`
}

const generatePhoneData = params => {
  const { number } = params

  if (!number) {
    throw new Error("Number parameter is required for type 'phone'")
  }

  return `tel:${number}`
}

const generateTextData = params => {
  const { content } = params

  if (!content) {
    throw new Error("Content parameter is required for type 'text'")
  }

  return content
}

export const POST = async request => {
  try {
    // Get parameters from query string
    const { searchParams } = request.nextUrl
    const allParams = Object.fromEntries(searchParams.entries())

    // Get parameters from body
    let bodyParams = {}
    try {
      bodyParams = await request.json()
    } catch {
      // If body parsing fails, just use query params
    }

    // Merge params (body takes precedence over query params)
    const params = { ...allParams, ...bodyParams }

    // Extract common parameters
    const type = params.type || "url"
    const logo = params.logo
    const rounded = params.rounded
    const size = params.size

    // Parse booleans
    const withLogo = logo === true || logo === "true" || logo === "1"
    const withRounded = rounded === true || rounded === "true" || rounded === "1"

    // Parse size with default of 1024
    const qrSize = size ? parseInt(size, 10) : 1024

    // Generate QR data based on type
    let qrData
    try {
      qrData = generateQRData(type, params)
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
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
      qrBuffer = await generateRoundedQR(qrData, errorCorrectionLevel, qrSize)
    } else {
      // Use standard qrcode library
      qrBuffer = await QRCode.toBuffer(qrData, {
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
