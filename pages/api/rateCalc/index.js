// API route that calculates a buffered project quote based on hour tiers, returning the
// computed total alongside the effective hourly rate for the requested hours.

// Example: GET /api/rateCalc?hours=42 → "The rate for this project is $4,420 at $92/hr."
function calculateProjectCost(hours) {
  let rate;

  if (hours <= 30) {
    rate = 95;
  } else if (hours <= 40) {
    rate = 92;
  } else if (hours <= 50) {
    rate = 88;
  } else if (hours <= 70) {
    rate = 84;
  } else {
    rate = 80;
  }

  const baseCost = hours * rate;
  const totalCost = baseCost * 1.15; // adding a 15% buffer
  return totalCost;
}

function hourlyRate(hours) {
  let rate;
  if (hours <= 30) {
    rate = 95;
  } else if (hours <= 40) {
    rate = 92;
  } else if (hours <= 50) {
    rate = 88;
  } else if (hours <= 70) {
    rate = 84;
  } else {
    rate = 80;
  }
  return formatCurrency(rate)
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}
export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // (1) Existing GET logic for ?url=...
      const { hours } = req.query;

      if (!hours) {
        return res.status(400).json({ error: "Missing required parameter 'url'." });
      }
      const rate = calculateProjectCost(hours);
      return res.status(200).send(`The rate for this project is ` + formatCurrency(rate) + ' at ' + hourlyRate(hours) + '/hr.');

    }
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: 'processing failed' });
  }
}
