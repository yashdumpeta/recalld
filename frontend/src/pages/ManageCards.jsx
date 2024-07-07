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
    const [sortOrder, setSortOrder] = useState('none');
    const [difficultyFilter, setDifficultyFilter] = useState('all');



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
            case 'none':
                return '#FFFFFF';  // White
            default:
                return '#FFFFFF';
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

    const difficultyOrder = ['easy', 'medium', 'hard', 'xhard', 'none'];

    const compareDifficulties = (a, b) => {
        const indexA = difficultyOrder.indexOf(a.difficulty || 'none');
        const indexB = difficultyOrder.indexOf(b.difficulty || 'none');
        return sortOrder === 'ascending' ? indexA - indexB : indexB - indexA;
    };

    return (
        <div id="entire">

            <div id='main-container'>
                <h1 id='managecards-header'>Manage cards</h1>

                <div id='header-block'>
                    <div className="left-header">
                        <button id='back-button' onClick={() => navigate('/dashboard')}><FaArrowLeft style={{ marginRight: '8px' }} /> Back</button>
                    </div>
                    <div className="filter-sort-container">
                        <select className="styled-select" value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)}>
                            <option value="all">All Difficulties</option>
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                            <option value="xhard">XHard</option>
                            <option value="none">None</option>
                        </select>
                        <select className="styled-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                            <option value="none">No Sorting</option>
                            <option value="ascending">Easiest to Hardest</option>
                            <option value="descending">Hardest to Easiest</option>
                        </select>
                    </div>
                    <CreateCard uponCreation={addNewCard} deckId={deckId} />
                </div>
                {cards.length === 0 ? (
                    <p id='no-cards'>No cards found for this deck.</p>
                ) : (
                    <div className="card-grid">
                        {cards
                            .filter(card => difficultyFilter === 'all' || card.difficulty === difficultyFilter)
                            .sort((a, b) => sortOrder === 'none' ? 0 : compareDifficulties(a, b))
                            .map(card => {
                                const cardColor = getDifficultyColor(card.difficulty || 'none');
                                return (
                                    <div key={card.id} className="card">
                                        <h3 className='front-side'>{card.front_side}</h3>
                                        <p className='back-side'>{card.back_side}</p>
                                        <span className='difficulty' style={{ backgroundColor: cardColor, opacity: 0.9 }}>{card.difficulty || 'none'}</span>
                                    </div>
                                );
                            })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ManageCards