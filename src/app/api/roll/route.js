import { DiceRoller } from "@dice-roller/rpg-dice-roller"
import { corsJson, corsPreflight } from "../_lib/cors"

export const runtime = "nodejs"

export const OPTIONS = () => corsPreflight()

export const GET = request => {
  const { searchParams } = request.nextUrl
  const rollString = searchParams.get("ndn") ?? "1d20"
  const roller = new DiceRoller()
  const roll = roller.roll(rollString)
  const payload = typeof roll.toJSON === "function" ? roll.toJSON() : roll
  return corsJson(payload)
}
