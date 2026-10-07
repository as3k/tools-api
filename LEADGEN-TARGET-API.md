# Lead-generation target API

Generate specific local-service searches for prospecting near Riverside ZIP `92503`.

## Endpoint

```text
GET /api/leadgen-target
```

The default is 12 randomized targets within approximately 30 miles of `92503`.

## Parameters

| Parameter | Default | Allowed values | Purpose |
| --- | --- | --- | --- |
| `count` | `12` | `1`–`100` | Number of targets to return. |
| `radius` | `30` | `1`–`50` | Approximate maximum distance from ZIP `92503`, in miles. |
| `seed` | none | non-negative integer | Makes the result order repeatable. Leave it out for a fresh spin. |

## Examples

```bash
curl "https://YOUR-DOMAIN/api/leadgen-target"
curl "https://YOUR-DOMAIN/api/leadgen-target?count=25&radius=20"
curl "https://YOUR-DOMAIN/api/leadgen-target?count=10&seed=42"
```

## Response

```json
{
  "origin": { "zip": "92503", "label": "Riverside / Arlington, CA" },
  "radiusMiles": 30,
  "count": 2,
  "targets": [
    {
      "service": "water heater repair",
      "category": "plumbing",
      "neighborhood": "Arlington",
      "city": "Riverside",
      "distanceMiles": 1,
      "query": "water heater repair in Arlington, Riverside, CA"
    }
  ],
  "note": "Distances are approximate from ZIP 92503. Use a geocoder before treating a target as a strict radius match."
}
```

## Agent usage

1. Request a small batch, usually `count=10`–`25`.
2. Use `target.query` as the exact search phrase for a directory, map, or web-search tool.
3. Keep `service`, `neighborhood`, and `city` alongside every discovered business so outreach can remain specific.
4. Pass a `seed` when a workflow must be reproducible; omit it for a new mix of targets.
5. Treat `distanceMiles` as a filter aid, not ground truth. Geocode a prospect before enforcing a hard radius.

## API or MCP?

This route is a conventional HTTP JSON API, which is the simplest fit for an agent workflow that can make HTTP requests. It is **not** an MCP server today.

If agents need to discover and call it as a named tool, a thin MCP wrapper can be added later. Vercel can host remote MCP servers through a Next.js API route using Streamable HTTP; that is a separate `/api/mcp` route, not a replacement for this endpoint. Keep this JSON endpoint as the underlying service and have the MCP tool call it.
