import { randomInt } from "node:crypto"

const DEFAULT_SPECIAL_CHARS = ["!", "@", "#", "$", "%", "&", "*", "?"]

const TEMPLATES = [
  { name: "balanced-classic", slots: ["adverb", "flavor", "mood", "drink", "predicate"], slugSafe: false, securityOnly: false },
  { name: "balanced-celestial", slots: ["adverb", "texture", "drink", "abstract", "predicate"], slugSafe: false, securityOnly: false },
  { name: "balanced-smooth", slots: ["mood", "flavor", "drink", "predicate"], slugSafe: false, securityOnly: false },
  { name: "balanced-minimal", slots: ["mood", "flavor", "drink", "abstract"], slugSafe: false, securityOnly: false },
  { name: "balanced-core", slots: ["mood", "flavor", "drink"], slugSafe: false, securityOnly: false },
  { name: "security-chaos", slots: ["adverb", "texture", "flavor", "drink", "abstract", "predicate"], slugSafe: false, securityOnly: true },
  { name: "security-ritual", slots: ["adverb", "mood", "flavor", "drink", "abstract", "predicate"], slugSafe: false, securityOnly: true },
  { name: "security-night-shift", slots: ["texture", "flavor", "mood", "drink", "abstract", "predicate"], slugSafe: false, securityOnly: true },
  { name: "security-compact", slots: ["texture", "flavor", "mood", "drink", "abstract"], slugSafe: false, securityOnly: true },
  { name: "security-core", slots: ["texture", "flavor", "mood", "drink"], slugSafe: false, securityOnly: true },
  { name: "slug-classic", slots: ["flavor", "mood", "drink"], slugSafe: true, securityOnly: false },
  { name: "slug-abstract", slots: ["mood", "drink", "abstract"], slugSafe: true, securityOnly: false },
]

const adverbs = [
  "boldly", "brightly", "briskly", "calmly", "cleanly", "cozily", "creamily", "crisply", "curiously", "daily",
  "deeply", "delicately", "dreamily", "dryly", "eagerly", "easily", "fiercely", "finely", "fondly", "freshly",
  "gently", "gladly", "glowingly", "goldenly", "grandly", "happily", "honestly", "jauntily", "keenly", "kindly",
  "lightly", "loudly", "lovingly", "lushly", "merrily", "neatly", "openly", "patiently", "playfully", "purely",
  "quickly", "quietly", "richly", "royally", "silently", "silkily", "smoothly", "softly", "slowly", "snugly",
  "sparkly", "steadily", "sweetly", "swiftly", "tenderly", "thickly", "toasty", "warmly", "wildly", "wisely",
  "zestily",
]

const flavors = [
  "almond", "amber", "apple", "apricot", "banana", "basil", "berry", "biscuit", "black-sesame", "blackberry",
  "blood-orange", "blueberry", "brown-sugar", "butter", "butterscotch", "cacao", "candied-ginger", "caramel", "cardamom", "chai-spice",
  "cherry", "chestnut", "chocolate", "cinnamon", "citrus", "clove", "coconut", "cookie", "cream", "crisp-pear",
  "custard", "date", "dragonfruit", "dulce", "elderflower", "fig", "garden-mint", "ginger", "grapefruit", "guava",
  "hazelnut", "hibiscus", "honey", "honeydew", "jasmine", "key-lime", "kumquat", "lavender", "lemon", "lime",
  "lychee", "macadamia", "malt", "mango", "maple", "marshmallow", "masala", "melon", "mint", "mocha",
  "molasses", "nectarine", "nutmeg", "orange", "orange-blossom", "papaya", "passionfruit", "peach", "peanut", "pear",
  "peppermint", "persimmon", "pineapple", "pistachio", "plum", "pomegranate", "praline", "pumpkin", "raspberry", "rose",
  "saffron", "salted-caramel", "sesame", "shortbread", "spice", "strawberry", "tamarind", "taro", "toffee", "toasted-coconut",
  "ube", "vanilla", "walnut", "watermelon", "white-peach", "wildflower", "yuzu",
]

const moods = [
  "afterglow", "balmy", "bright", "calm", "chill", "coastal", "cozy", "crystal", "dappled", "dawnlit",
  "daybreak", "dewy", "dusky", "electric", "ember", "feathered", "festival", "fizzy", "floral", "gentle",
  "glassy", "glimmering", "glossy", "golden", "hazy", "honeyed", "lively", "lush", "lunar", "mellow",
  "midnight", "misty", "molten", "moonlit", "morning", "opal", "pearl", "radiant", "rainy", "restful",
  "rosy", "serene", "shadowy", "silken", "silver", "smoky", "snug", "soft-glow", "solar", "sparkling",
  "spirit", "stormy", "sugared", "summer", "sunlit", "teahouse", "toasted", "velvet", "whispering", "winter",
]

const textures = [
  "aerated", "airy", "bubbly", "buttery", "candied", "chilled", "cloudy", "creamy", "dense", "dusty",
  "fizzy", "fluffy", "foamy", "frosted", "glazed", "iced", "inky", "jammy", "layered", "milky",
  "pillowy", "polished", "roasted", "silky", "slushy", "smoked", "smooth", "sparkling", "spiced", "steamed",
  "steeped", "sugary", "syrupy", "thick-cut", "toasted", "velvety", "warm-foam", "whipped",
]

const coffeeTerms = [
  "affogato", "americano", "au-lait", "breve", "cafe-bombon", "cafe-con-miel", "cappuccino", "cold-brew", "cortado", "crema",
  "demitasse", "drip", "espresso", "flatwhite", "frappe", "freddo", "irish", "latte", "lungo", "macchiato",
  "marocchino", "mocha", "nitro", "piccolo", "pour-over", "red-eye", "ristretto", "roast", "shakerato", "vienna",
]

const teaTerms = [
  "assam", "chai", "darjeeling", "earl-grey", "genmaicha", "green-tea", "gunpowder", "herbal", "hojicha", "jasmine-tea",
  "kukicha", "lapsang", "lemongrass-tea", "matcha", "milk-oolong", "oolong", "pekoe", "pu-erh", "rooibos", "sencha",
  "thai-tea", "tisane", "white-tea", "yerba-mate",
]

const bobaTerms = [
  "boba", "brown-sugar-milk-tea", "bubble-tea", "cheese-foam-tea", "crystal-boba", "fruit-tea", "grass-jelly", "jelly-tea", "milk-tea", "pearl-tea",
  "popping-boba", "sea-cream", "slush-tea", "snow-bubble", "tapioca", "tea-latte", "taro-milk-tea", "wintermelon-tea",
]

const abstracts = [
  "arc", "aurora", "bloom", "breeze", "canopy", "cascade", "comet", "crescent", "drift", "echo",
  "ember", "festival", "flare", "glimmer", "groove", "harbor", "horizon", "hush", "lantern", "meadow",
  "mirage", "nebula", "nova", "oasis", "orbit", "petal", "ripple", "rush", "signal", "solstice",
  "spark", "spell", "sprout", "starfall", "stream", "swell", "thicket", "tide", "trail", "twilight",
  "velour", "whirl", "whisper", "wisp", "zenith",
]

const predicates = [
  "awakens", "blossoms", "brews", "bursts", "crackles", "dances", "drifts", "echoes", "fizzes", "floats",
  "glimmers", "glows", "hums", "infuses", "lingers", "melts", "pours", "radiates", "rises", "rushes",
  "shimmers", "sings", "sparks", "spills", "steeps", "stirs", "swirls", "warms", "whispers",
]

const PASS_PHRASE_DEFAULTS = {
  category: "mixed",
  delimiter: "-",
  includeAdverb: true,
  includeAbstract: true,
  includePredicate: true,
  includeSpecialChar: true,
  includeNumber: true,
  numberOfDigits: 3,
  specialChars: DEFAULT_SPECIAL_CHARS,
  caseStyle: "lower",
  avoidRepeats: true,
  securityGrade: false,
  cryptoSecure: true,
}

export const generatePassphrase = options => generate({ ...options, mode: "passphrase" })

const generate = (options = {}) => {
  const normalized = normalizeOptions(options)
  const rng = createRng(normalized)
  const template = selectTemplate(normalized, rng)
  const words = buildWords(template, normalized, rng)
  return finalize(words, normalized, rng)
}

const normalizeOptions = (options = {}) => {
  const securityGrade = options.securityGrade ?? PASS_PHRASE_DEFAULTS.securityGrade
  const includeSpecialChar = options.includeSpecialChar ?? (securityGrade ? true : PASS_PHRASE_DEFAULTS.includeSpecialChar)
  const includeAdverb = options.includeAdverb ?? (securityGrade ? true : PASS_PHRASE_DEFAULTS.includeAdverb)
  const includeAbstract = options.includeAbstract ?? PASS_PHRASE_DEFAULTS.includeAbstract
  const includePredicate = options.includePredicate ?? (securityGrade ? true : PASS_PHRASE_DEFAULTS.includePredicate)
  const includeNumber = options.includeNumber ?? PASS_PHRASE_DEFAULTS.includeNumber
  const numberOfDigits = includeNumber
    ? Math.max(1, Math.min(options.numberOfDigits ?? (securityGrade ? 4 : PASS_PHRASE_DEFAULTS.numberOfDigits), 12))
    : 0

  return {
    mode: "passphrase",
    category: options.category ?? PASS_PHRASE_DEFAULTS.category,
    delimiter: options.delimiter ?? PASS_PHRASE_DEFAULTS.delimiter,
    template: options.template ?? "auto",
    includeAdverb,
    includeAbstract,
    includePredicate,
    includeSpecialChar,
    includeNumber,
    numberOfDigits,
    specialChars: options.specialChars ?? PASS_PHRASE_DEFAULTS.specialChars,
    caseStyle: options.caseStyle ?? PASS_PHRASE_DEFAULTS.caseStyle,
    avoidRepeats: options.avoidRepeats ?? PASS_PHRASE_DEFAULTS.avoidRepeats,
    securityGrade,
    cryptoSecure: options.cryptoSecure ?? PASS_PHRASE_DEFAULTS.cryptoSecure,
    seed: options.seed,
  }
}

const selectTemplate = (options, rng) => {
  const pool = TEMPLATES.filter(template => isValidTemplate(template, options))
  if (pool.length === 0) {
    throw new Error("No templates available for the current options")
  }

  if (options.template !== "auto") {
    const explicit = pool.find(template => template.name === options.template)
    if (!explicit) {
      throw new Error(`Template ${options.template} is incompatible with the current options`)
    }
    return explicit
  }

  const preferred = pool.filter(template => {
    if (options.includeAdverb && !template.slots.includes("adverb")) return false
    if (options.includeAbstract && !template.slots.includes("abstract")) return false
    if (options.includePredicate && !template.slots.includes("predicate")) return false
    return true
  })

  const finalPool = preferred.length > 0 ? preferred : pool
  return finalPool[pickIndex(finalPool.length, rng)]
}

const isValidTemplate = (template, options) => {
  if (template.slugSafe) return false
  if (options.securityGrade && !template.securityOnly) return false
  if (!options.securityGrade && template.securityOnly) return false
  if (!options.includeAdverb && template.slots.includes("adverb")) return false
  if (!options.includeAbstract && template.slots.includes("abstract")) return false
  if (!options.includePredicate && template.slots.includes("predicate")) return false
  return true
}

const buildWords = (template, options, rng) => {
  const used = new Set()
  return template.slots.map(slot => {
    const pool = getBucket(slot, options.category)
    if (pool.length === 0) {
      throw new Error(`Bucket ${slot} is empty`)
    }
    return pickUnique(pool, used, options.avoidRepeats, rng)
  })
}

const finalize = (words, options, rng) => {
  const formatted = applyCase(words, options.caseStyle, options.delimiter)
  const symbol = options.includeSpecialChar && options.specialChars.length > 0
    ? options.specialChars[pickIndex(options.specialChars.length, rng)]
    : ""
  const number = options.includeNumber ? pickNumber(options.numberOfDigits, rng) : ""
  return `${formatted}${symbol}${number}`
}

const applyCase = (words, style, delimiter) => {
  switch (style) {
    case "title":
      return words.map(toTitle).join(delimiter)
    case "camel": {
      const [first, ...rest] = words
      return [first.toLowerCase(), ...rest.map(toPascalToken)].join("")
    }
    case "pascal":
      return words.map(toPascalToken).join("")
    case "lower":
    default:
      return words.map(word => word.toLowerCase()).join(delimiter)
  }
}

const toTitle = word => word
  .split("-")
  .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
  .join("-")

const toPascalToken = word => word
  .split("-")
  .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
  .join("")

const pickUnique = (pool, used, avoidRepeats, rng) => {
  if (!avoidRepeats) {
    return pool[pickIndex(pool.length, rng)]
  }

  for (let attempts = 0; attempts < 24; attempts += 1) {
    const candidate = pool[pickIndex(pool.length, rng)]
    if (!used.has(candidate)) {
      used.add(candidate)
      return candidate
    }
  }

  const fallback = pool.find(candidate => !used.has(candidate))
  if (!fallback) {
    return pool[pickIndex(pool.length, rng)]
  }

  used.add(fallback)
  return fallback
}

const getBucket = (bucket, category) => {
  switch (bucket) {
    case "adverb":
      return adverbs
    case "flavor":
      return flavors
    case "mood":
      return moods
    case "texture":
      return textures
    case "abstract":
      return abstracts
    case "predicate":
      return predicates
    case "drink":
      if (category === "coffee") return coffeeTerms
      if (category === "tea") return teaTerms
      if (category === "boba") return bobaTerms
      return [...coffeeTerms, ...teaTerms, ...bobaTerms]
    default:
      return []
  }
}

const pickNumber = (digits, rng) => pickIndex(10 ** digits, rng).toString().padStart(digits, "0")

const createRng = options => {
  if (options.seed !== undefined) {
    const seeded = mulberry32(hashSeed(String(options.seed)))
    return () => seeded()
  }

  if (options.cryptoSecure) {
    return () => randomInt(0, 1_000_000_000) / 1_000_000_000
  }

  return () => Math.random()
}

const pickIndex = (length, rng) => {
  if (length < 1) {
    throw new Error("Cannot pick from an empty pool")
  }
  return Math.floor(rng() * length)
}

const hashSeed = input => {
  let hash = 1779033703 ^ input.length
  for (let index = 0; index < input.length; index += 1) {
    hash = Math.imul(hash ^ input.charCodeAt(index), 3432918353)
    hash = (hash << 13) | (hash >>> 19)
  }
  return hash >>> 0
}

const mulberry32 = seed => {
  let state = seed
  return () => {
    state |= 0
    state = (state + 0x6D2B79F5) | 0
    let result = Math.imul(state ^ (state >>> 15), 1 | state)
    result ^= result + Math.imul(result ^ (result >>> 7), 61 | result)
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296
  }
}
