import { NextResponse } from "next/server"

export const corsHeaders = {
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers":
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
}

export const corsPreflight = () => new Response(null, { status: 200, headers: corsHeaders })

export const withCorsHeaders = response => {
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })
  return response
}

export const corsJson = (data, init = {}) => withCorsHeaders(NextResponse.json(data, init))
