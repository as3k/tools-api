import { corsJson, corsPreflight, withCorsHeaders } from "../_lib/cors"

export const runtime = "nodejs"

const calculateProjectCost = hours => {
  if (hours <= 30) {
    return hours * 95 * 1.15
  }
  if (hours <= 40) {
    return hours * 92 * 1.15
  }
  if (hours <= 50) {
    return hours * 88 * 1.15
  }
  if (hours <= 70) {
    return hours * 84 * 1.15
  }
  return hours * 80 * 1.15
}

const hourlyRate = hours => {
  if (hours <= 30) return 95
  if (hours <= 40) return 92
  if (hours <= 50) return 88
  if (hours <= 70) return 84
  return 80
}

const formatCurrency = amount =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)

export const OPTIONS = () => corsPreflight()

export const GET = request => {
  const { searchParams } = request.nextUrl
  const hoursParam = searchParams.get("hours")
  if (!hoursParam) {
    return corsJson({ error: "Missing required parameter 'hours'." }, { status: 400 })
  }

  const hours = Number.parseFloat(hoursParam)
  if (Number.isNaN(hours) || hours <= 0) {
    return corsJson({ error: "Parameter 'hours' must be a positive number." }, { status: 400 })
  }

  try {
    const total = calculateProjectCost(hours)
    const rate = hourlyRate(hours)
    const message = `The rate for this project is ${formatCurrency(total)} at ${formatCurrency(rate)}/hr.`
    return withCorsHeaders(new Response(message, { status: 200 }))
  } catch (error) {
    console.error("rateCalc error", error)
    return corsJson({ error: "processing failed" }, { status: 500 })
  }
}
