import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import api from '../api'
import CreateCard from '../components/CreateCard'
import '../styles/ManageCards.css'

const ManageCards = () => {
    const [cards, setCards] = useState([]);
    const { deckId } = useParams();
    const navigate = useNavigate();

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'easy':
                return '#90EE90';  // Light green
            case 'medium':
                return '#FFD700';  // Gold
            case 'hard':
                return '#ff4500';  // Light salmon
            case 'xhard':
                return '#dc143c';  // Tomato
            default:
                return '#FFFFFF';  // White
        }
    };

    useEffect(() => {
        fetch_cards_for_deck(deckId);
    }, [deckId])

    const fetch_cards_for_deck = async (deckId) => {
        try {
            const response = await api.get(`/catalog/decks/${deckId}/cards/`);
            const cardsData = Array.isArray(response.data) ? response.data : response.data.results;
            setCards(Array.isArray(cardsData) ? cardsData : []);
        } catch (error) {
            console.error("Error getting the cards for this deck", error);
            setCards([]);
        }
    }

    const addNewCard = (newCard) => {
        console.log('New card added:', newCard);  // Add this line
        setCards(prevCards => [...prevCards, newCard]);
    };

    return (
        <div id='main-container'>
            <div id='header-block'>
                <div className="left-header">
                    <button id='back-button' onClick={() => navigate('/dashboard')}><FaArrowLeft style={{ marginRight: '8px' }} /> Back to Overview</button>
                    <h1 id='managecards-header'>Manage cards</h1>
                </div>
                <CreateCard uponCreation={addNewCard} deckId={deckId} />
            </div>
            {cards.length === 0 ? (
                <p id='no-cards'>No cards found for this deck.</p>
            ) : (
                <div className="card-grid">
                    {cards.map(card => {
                        const cardColor = getDifficultyColor(card.difficulty || 'medium');
                        return (
                            <div key={card.id} className="card" style={{ backgroundColor: cardColor, opacity: 0.9}}>
                                <h3 className='front-side'>{card.front_side}</h3>
                                <p className='back-side'>{card.back_side}</p>
                                <span className='difficulty'>{card.difficulty || 'medium'}</span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    )
}

export default ManageCards