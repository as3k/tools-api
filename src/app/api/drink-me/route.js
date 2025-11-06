import { corsJson, corsPreflight } from "../_lib/cors"

export const runtime = "nodejs"

const guide = {
  title: "Tools API – Drink Me Guide",
  description:
    "Your quick reference to the available API routes, what they do, and how to call them. All routes return JSON unless noted otherwise and accept cross-origin requests.",
  endpoints: [
    {
      path: "/api",
      methods: ["GET"],
      query: [],
      summary: "Health probe for the root namespace.",
      sample: "/api",
    },
    {
      path: "/api/8-ball",
      methods: ["GET"],
      query: [],
      summary: "Returns a randomized Magic 8-Ball style response.",
      sample: "/api/8-ball",
    },
    {
      path: "/api/roll",
      methods: ["GET"],
      summary: "Evaluates RPG dice expressions using @dice-roller/rpg-dice-roller.",
      query: [
        { name: "ndn", default: "1d20", description: "Dice notation such as 2d6+3." },
      ],
      sample: "/api/roll?ndn=4d6dl1",
    },
    {
      path: "/api/rateCalc",
      methods: ["GET"],
      summary: "Calculates a buffered project quote for the supplied hours.",
      query: [
        {
          name: "hours",
          required: true,
          description: "Positive number of projected hours (e.g. 42).",
        },
      ],
      returns: "Plain text message with the total and effective hourly rate.",
      sample: "/api/rateCalc?hours=48",
    },
    {
      path: "/api/auth",
      methods: ["GET"],
      query: [],
      summary: "Auth namespace heartbeat – returns a simple message.",
      sample: "/api/auth",
    },
    {
      path: "/api/auth/username",
      methods: ["GET"],
      query: [],
      summary: "Builds a kebab-cased username from adjectives and Nobel laureates.",
      sample: "/api/auth/username",
    },
    {
      path: "/api/auth/uuid",
      methods: ["GET"],
      query: [],
      summary: "Generates a cryptographically secure UUID (v4).",
      sample: "/api/auth/uuid",
    },
    {
      path: "/api/auth/passphrase",
      methods: ["GET"],
      summary: "Generates a customizable passphrase using word-lists and embellishments.",
      query: [
        { name: "capFirst", description: "Capitalize the first word (truthy string)." },
        { name: "adverb", description: "Include a random adverb (truthy string)." },
        { name: "predicate", description: "Include predicate words (truthy string)." },
        { name: "del", description: "Custom delimiter between words. Default '_'" },
        {
          name: "specialCharacter",
          description: "Include a random special character from ?!$*@.",
        },
        { name: "num", description: "Append a random number sequence." },
      ],
      sample: "/api/auth/passphrase?capFirst=true&specialCharacter=1&num=1",
    },
    {
      path: "/api/values",
      methods: ["GET"],
      summary:
        "Returns values cards either randomly or scoped by set/index. Supports batched pulls.",
      query: [
        { name: "value", description: "Name of the values set (e.g. Kindness)." },
        { name: "index", description: "Numeric card index inside the set." },
        { name: "count", default: 1, description: "Number of cards to return." },
      ],
      notes: [
        "Providing both value and index returns that specific card (repeated count times).",
        "Supplying only count draws from random sets for each card.",
      ],
      sample: "/api/values?value=Respect&count=3",
    },
    {
      path: "/api/optimize",
      methods: ["GET", "POST"],
      summary: "Optimizes images to WebP using Sharp – remote fetch or uploaded blobs.",
      query: [
        { name: "url", required: true, when: "GET", description: "Remote image URL." },
        {
          name: "width",
          default: 1920,
          description: "Resize width in pixels (applies to GET & POST).",
        },
        {
          name: "quality",
          default: 85,
          description: "WebP quality (0-100, applies to GET & POST).",
        },
      ],
      body: [
        { field: "image", type: "File", when: "POST", description: "Uploaded image file." },
        { field: "blob", type: "Base64 string", when: "POST", description: "Inline image data." },
      ],
      returns: "WebP binary image with Content-Type image/webp.",
      sample: "/api/optimize?url=https://example.com/photo.jpg&width=1024&quality=70",
    },
    {
      path: "/api/drink-me",
      methods: ["GET"],
      query: [],
      summary: "This guide. Lists the available endpoints and usage hints.",
      sample: "/api/drink-me",
    },
  ],
}

export const OPTIONS = () => corsPreflight()

export const GET = () => corsJson(guide)
