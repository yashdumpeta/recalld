import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import api from '../api'
import '../styles/StudyPage.css'
import { FaArrowLeft, FaArrowRight, FaCheck, } from 'react-icons/fa'
import { FaX } from 'react-icons/fa6'

const StudyPage = () => {
  const [deck, setDeck] = useState(null)
  const [cards, setCards] = useState([])
  const [currentCardIndex, setcurrentCardIndex] = useState(0)
  const [showAnswer, setshowAnswer] = useState(false)
  const { deckId } = useParams();
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true);

  const Loader = () => {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  };

  useEffect(() => {
    fetchDeckAndCards();
  }, [deckId]);

  const fetchDeckAndCards = async () => {
    const minLoadTime = 1000; // 1 second

    const start = Date.now();
    try {
      const deckResponse = await api.get(`/catalog/decks/${deckId}/`);
      setDeck(deckResponse.data);

      const cardResponse = await api.get(`/catalog/decks/${deckId}/cards/`);
      const cardResponse_data = Array.isArray(cardResponse.data) ? cardResponse.data : cardResponse.data.results;
      setCards(Array.isArray(cardResponse_data) ? cardResponse_data : []);
    } catch (error) {
      console.error("Error getting the cards for this deck", error);
    } finally {
      const elapsed = Date.now() - start;
      const remainingTime = minLoadTime - elapsed;

      if (remainingTime > 0) {
        setTimeout(() => setIsLoading(false), remainingTime);
      } else {
        setIsLoading(false);
      }
    }
  };

  const handleNext = () => {
    setshowAnswer(false);
    setcurrentCardIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setshowAnswer(false);
    setcurrentCardIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!deck || cards.length === 0) {
    return <div>No cards found for this deck.</div>;
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy':
        return { backgroundColor: '#90EE90' };  // Light green
      case 'medium':
        return { backgroundColor: '#FFD700' };  // Gold
      case 'hard':
        return { backgroundColor: '#ff4500' };  // Light salmon
      case 'xhard':
        return { backgroundColor: '#dc143c' };  // Tomato
      case 'none':
        return { backgroundColor: '#FFFFFF' };  // White
      default:
        return { backgroundColor: '#FFFFFF' };
    }
  };

  const currentCard = cards[currentCardIndex];

  const handleCorrect = () => {
    setshowAnswer(false);
    setcurrentCardIndex((prev) => (prev + 1) % cards.length);

  }

  const handleIncorrect = () => {
    setshowAnswer(false);
    setcurrentCardIndex((prev) => (prev + 1) % cards.length);

  }


  const handleSkip = () => {
    setshowAnswer(false);
    setcurrentCardIndex((prev) => (prev + 1) % cards.length);

  }

  return (
    <div className='entire-container'>
      <div className="study-page">
        <div id="header-block">
          <div className="left-header">
            <button id='back-button' onClick={() => navigate('/dashboard')}><FaArrowLeft style={{ marginRight: '8px' }} /> Back</button>
          </div>
          <div className="right-header">
            <h3 id="study-header">{deck.deck_name} </h3>
          </div>
        </div>

        <div className="card-container">
          <div className={`flashcard ${showAnswer ? 'dark-mode' : ''}`}>
            <div className={`card-header ${showAnswer ? 'dark-mode' : ''}`}>
              <h2 className={`current ${showAnswer ? 'dark-mode' : ''}`}>
                {showAnswer ? 'Answer' : 'Question'}
                <span id="difficulty" style={getDifficultyColor(currentCard.difficulty)}>
                  {currentCard.difficulty}
                </span>
              </h2>
              <button className="flip-button" onClick={() => setshowAnswer(!showAnswer)}>
                {showAnswer ? 'Question' : 'Answer'}
              </button>
            </div>
            <p className={`card-content ${showAnswer ? 'show-answer' : ''}`}>
              {showAnswer ? currentCard.back_side : currentCard.front_side}
            </p>
          </div>
          <div className='options'>
            <div className="navigation">
              <button id='nav-button' onClick={handlePrev}><FaArrowLeft /></button>
              <span id='prog'>{currentCardIndex + 1} / {cards.length}</span>
              <button id='nav-button' onClick={handleNext}><FaArrowRight /></button>
            </div>
            <div className="userProgress">
              <button id="incorrect" onClick={handleIncorrect}> <FaX /> </button>
              <button id='skip' onClick={handleSkip}> - </button>
              <button id="correct" onClick={handleCorrect}> <FaCheck /> </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default StudyPage;
