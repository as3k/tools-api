import crypto from "node:crypto"
import { corsJson, corsPreflight } from "../../_lib/cors"

export const runtime = "nodejs"

export const OPTIONS = () => corsPreflight()

export const GET = () => {
  const uuid = crypto.randomUUID()
  return corsJson({ uuid })
}
