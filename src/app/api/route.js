import { corsJson, corsPreflight } from "./_lib/cors"

export const runtime = "nodejs"

export const OPTIONS = () => corsPreflight()

export const GET = () => corsJson({ message: "" })
