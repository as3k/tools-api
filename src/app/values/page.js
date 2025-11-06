'use client'

'use client'

import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"

const ValuesPage = () => {
  const [cards, setCards] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [flipStates, setFlipStates] = useState([])

  useEffect(() => {
    const loadCards = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/values?count=3", { cache: "no-store" })
        if (!response.ok) {
          throw new Error(`Failed to load cards: ${response.status}`)
        }
        const data = await response.json()
        const nextCards = data.cards ?? []
        setCards(nextCards)
        setFlipStates(nextCards.map(() => false))
        setError(null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadCards()
  }, [])

  const handleToggle = useCallback(index => {
    setFlipStates(prev =>
      prev.map((flipped, currentIndex) => (currentIndex === index ? !flipped : flipped)),
    )
  }, [])

  function pickBackground(id) {
    return id % 2 === 0 ? "#C9DFE4" : "#FAF4EA"
  }

  const cardShellStyle = {
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "1rem",
    boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  }

  const cardBackStyle = {
    ...cardShellStyle,
    alignItems: "center",
    justifyContent: "center",
    backgroundImage: "url('/value-card-back-bg.jpg')",
    color: "#1f2937",
    letterSpacing: "0.08em",
    fontWeight: 600,
  }

  return (
    <main style={{ maxWidth: "640px", margin: "2rem auto", padding: "0 1rem" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem" }}>
        Values Cards
      </h1>
      {loading && <p>Loading cards…</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <ul className="oswald-text flex flex-col gap-6 p-0 list-none">
        {cards.map((card, index) => (
          <li key={`${card.value}-${card.index}`}>
            <div
              role="button"
              tabIndex={0}
              onClick={() => handleToggle(index)}
              onKeyDown={event => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault()
                  handleToggle(index)
                }
              }}
              style={{
                cursor: "pointer",
                perspective: "1200px",
              }}
            >
              <motion.div
                initial={{ rotateY: 180 }}
                animate={{ rotateY: flipStates[index] ? 0 : 180 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                style={{ transformStyle: "preserve-3d" }}
                className="w-[372px] h-[534px] relative"
              >
                <div
                  style={{
                    ...cardShellStyle,
                    backgroundColor: pickBackground(card.index),
                    position: "absolute",
                    inset: 0,
                    backfaceVisibility: "hidden",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.8rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: "#1f2937",
                    }}
                  />
                  <p style={{ marginTop: "0.75rem", fontSize: "1.05rem", lineHeight: 1.6 }}>
                    {card.text}
                  </p>
                </div>
                <div
                  style={{
                    ...cardBackStyle,
                    position: "absolute",
                    inset: 0,
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <span>{card.value}</span>
                  <span>{card.type}</span>
                </div>
              </motion.div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default ValuesPage
