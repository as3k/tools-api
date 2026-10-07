import { corsJson, corsPreflight } from "../_lib/cors"

export const runtime = "nodejs"

export const OPTIONS = () => corsPreflight()

// Default is ZIP 92503 (Riverside/Arlington). Locations are deliberately smaller
// than cities where possible so generated searches are useful for prospecting.
const locations = [
  ["Arlington", "Riverside", 1],
  ["Arlanza", "Riverside", 2],
  ["La Sierra", "Riverside", 4],
  ["Wood Streets", "Riverside", 4],
  ["Magnolia Center", "Riverside", 4],
  ["Downtown", "Riverside", 5],
  ["Casa Blanca", "Riverside", 5],
  ["Victoria", "Riverside", 5],
  ["Canyon Crest", "Riverside", 7],
  ["Mission Grove", "Riverside", 7],
  ["Orangecrest", "Riverside", 8],
  ["Alessandro Heights", "Riverside", 9],
  ["Lake Mathews", "Riverside County", 10],
  ["Woodcrest", "Riverside County", 8],
  ["Jurupa Valley", "Riverside County", 7],
  ["Rubidoux", "Jurupa Valley", 7],
  ["Mira Loma", "Jurupa Valley", 10],
  ["Pedley", "Jurupa Valley", 8],
  ["Highgrove", "Riverside County", 9],
  ["Moreno Valley", "Riverside County", 11],
  ["March Air Reserve Base", "Riverside County", 12],
  ["Grand Terrace", "San Bernardino County", 15],
  ["Colton", "San Bernardino County", 17],
  ["Bloomington", "San Bernardino County", 17],
  ["Loma Linda", "San Bernardino County", 18],
  ["Redlands", "San Bernardino County", 21],
  ["Norco", "Riverside County", 13],
  ["Home Gardens", "Riverside County", 14],
  ["Corona", "Riverside County", 16],
  ["Eastvale", "Riverside County", 16],
  ["Mead Valley", "Riverside County", 16],
  ["Perris", "Riverside County", 20],
  ["Nuevo", "Riverside County", 24],
  ["Sun City", "Menifee", 25],
  ["Menifee", "Riverside County", 27],
]

const services = [
  ["water heater repair", "plumbing"],
  ["tankless water heater installation", "plumbing"],
  ["slab leak detection", "plumbing"],
  ["sewer camera inspection", "plumbing"],
  ["drain cleaning", "plumbing"],
  ["emergency plumber", "plumbing"],
  ["AC repair", "HVAC"],
  ["mini split installation", "HVAC"],
  ["furnace repair", "HVAC"],
  ["air duct cleaning", "HVAC"],
  ["roof leak repair", "roofing"],
  ["tile roof repair", "roofing"],
  ["flat roof repair", "roofing"],
  ["solar panel cleaning", "solar"],
  ["garage door spring repair", "garage doors"],
  ["garage door opener repair", "garage doors"],
  ["mobile locksmith", "locksmith"],
  ["car key replacement", "locksmith"],
  ["pest control", "pest control"],
  ["termite inspection", "pest control"],
  ["bed bug exterminator", "pest control"],
  ["tree trimming", "tree service"],
  ["stump grinding", "tree service"],
  ["pool equipment repair", "pool service"],
  ["pool leak detection", "pool service"],
  ["pool tile cleaning", "pool service"],
  ["concrete driveway repair", "concrete"],
  ["epoxy garage floor coating", "flooring"],
  ["kitchen cabinet refinishing", "cabinetry"],
  ["shower remodel", "remodeling"],
  ["bathroom remodeling", "remodeling"],
  ["foundation crack repair", "foundation repair"],
  ["water damage restoration", "restoration"],
  ["mold remediation", "restoration"],
  ["fire damage restoration", "restoration"],
  ["junk removal", "junk removal"],
  ["roll-off dumpster rental", "waste removal"],
  ["window replacement", "windows"],
  ["patio cover installation", "outdoor living"],
  ["artificial turf installation", "landscaping"],
  ["landscape lighting", "landscaping"],
  ["sprinkler repair", "irrigation"],
  ["fence repair", "fencing"],
  ["wrought iron fence installation", "fencing"],
  ["moving company", "moving"],
  ["senior move manager", "moving"],
  ["commercial cleaning", "cleaning"],
  ["house cleaning", "cleaning"],
  ["carpet cleaning", "cleaning"],
  ["mobile auto detailing", "auto detailing"],
  ["windshield replacement", "auto glass"],
  ["transmission repair", "auto repair"],
  ["diesel mechanic", "auto repair"],
  ["dog grooming", "pet care"],
  ["pet boarding", "pet care"],
  ["elder care home", "senior care"],
  ["in-home care agency", "senior care"],
  ["family law attorney", "legal"],
  ["estate planning attorney", "legal"],
  ["bankruptcy attorney", "legal"],
  ["personal injury attorney", "legal"],
  ["tax preparation", "accounting"],
  ["bookkeeping service", "accounting"],
  ["payroll service", "accounting"],
  ["med spa", "aesthetics"],
  ["Botox clinic", "aesthetics"],
  ["dental implant dentist", "dentistry"],
  ["emergency dentist", "dentistry"],
  ["chiropractor", "healthcare"],
  ["physical therapy clinic", "healthcare"],
]

const number = (value, fallback, min, max) => {
  const parsed = Number.parseInt(value ?? "", 10)
  return Number.isFinite(parsed) ? Math.min(Math.max(parsed, min), max) : fallback
}

const seededRandom = seed => {
  let state = Number.isFinite(seed) ? seed : Math.floor(Math.random() * 2 ** 32)
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 2 ** 32
  }
}

const shuffle = (items, random) => {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    ;[result[index], result[swapIndex]] = [result[swapIndex], result[index]]
  }
  return result
}

export const GET = request => {
  const { searchParams } = request.nextUrl
  const count = number(searchParams.get("count"), 12, 1, 100)
  const radius = number(searchParams.get("radius"), 30, 1, 50)
  const seed = searchParams.has("seed")
    ? number(searchParams.get("seed"), 0, 0, 2 ** 32 - 1)
    : null
  const random = seededRandom(seed)
  const nearbyLocations = locations.filter(([, , miles]) => miles <= radius)
  const combinations = nearbyLocations.flatMap(([neighborhood, city, distanceMiles]) =>
    services.map(([service, category]) => ({
      service,
      category,
      neighborhood,
      city,
      distanceMiles,
      query: `${service} in ${neighborhood}, ${city}, CA`,
    })),
  )

  return corsJson({
    origin: { zip: "92503", label: "Riverside / Arlington, CA" },
    radiusMiles: radius,
    count,
    targets: shuffle(combinations, random).slice(0, count),
    note: "Distances are approximate from ZIP 92503. Use a geocoder before treating a target as a strict radius match.",
  })
}
