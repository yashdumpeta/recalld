import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api'
import '../styles/StudyPage.css'

const StudyPage = () => {

  const [deck, setDeck] = useState(null)
  const [cards, setCards] = useState([])
  const [currentCardIndex, setcurrentCardIndex] = useState(0)
  const [showAnswer, setshowAnswer] = useState(false)
  const { deckId } = useParams();
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDeckAndCards();
  }, [deckId]);

  const fetchDeckAndCards = async () => {
    try {
      const deckResponse = await api.get(`/catalog/decks/${deckId}/`)
      setDeck(deckResponse.data)

      const cardResponse = await api.get(`/catalog/decks/${deckId}/cards/`)
      const cardResponse_data = Array.isArray(cardResponse.data) ? cardResponse.data : cardResponse.data.results
      setCards(Array.isArray(cardResponse_data) ? cardResponse_data : [])

    } catch (error) {
      console.error("Error getting the cards for this deck", error)
    }
    finally {
      setIsLoading(false)
    }
  }

  const handleNext = () => {
    setshowAnswer(false)
    setcurrentCardIndex((prev) => (prev + 1) % cards.length)
  }

  const handlePrev = () => {
    setshowAnswer(false)
    setcurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length)
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!deck || cards.length === 0) {
    return <div>No cards found for this deck.</div>;
  }

  const currentCard = cards[currentCardIndex]



  return (
    <div className="study-page">
      <h2 id="study-header">Studying {deck.deck_name} </h2>
      <div className="card-container">
        <div className="card">
          <h2>{showAnswer ? 'Answer' : 'Question'}</h2>
          <p>{showAnswer ? currentCard.back_side : currentCard.front_side}</p>
        </div>
        <button onClick={() => setshowAnswer(!showAnswer)}>
          {showAnswer ? 'Show Question' : 'Show Answer'}
        </button>
      </div>
      <div className="navigation">
        <button onClick={handlePrev}>Previous</button>
        <span>{currentCardIndex + 1} / {cards.length}</span>
        <button onClick={handleNext}>Next</button>
      </div>
      <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
    </div>
  )
}

export default StudyPage
