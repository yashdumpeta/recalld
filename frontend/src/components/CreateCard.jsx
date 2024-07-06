import React, { useState } from "react";
import api from "../api.js";
import '../styles/CreateCard.css'

export default function Modal({ uponCreation, deckId }) {

    const [modal, setModal] = useState(false);
    const [front, setFront] = useState('');
    const [back, setBack] = useState('');
    const [difficulty, setdifficulty] = useState('easy');  // Change from 'Option 1' to 'easy'

 
    const handleChange = (e) => { 
      setdifficulty(e.target.value); 
    }; 

    const toggleModal = () => {
        setModal(!modal);
    };

    const handleCreateCard = async (e) => {
        e.preventDefault();
        try {
            console.log('Attempting to create card with:', { deckId, front, back, difficulty });
    
            const create_response = await api.post(`/catalog/decks/${deckId}/cards/`, {
                front_side: front,
                back_side: back,
                difficulty: difficulty  // Add this line
            });
            console.log('Card created', create_response.data);
            uponCreation(create_response.data);
            setFront('');
            setBack('');
            setdifficulty('easy');  // Reset difficulty to default
            toggleModal();  // This line was already here, which is correct
        } catch (error) {
            console.error("Error creating card", error);
        }
    };

    return (
        <>
            <button
                id='create-card-button'
                onClick={toggleModal}
            >
                Add a card
            </button>

            {modal && (
                <div className="modal">
                    <div className="modal-content">
                        <p id="description">Make a flashcard for your deck.</p>
                        <h3 id="front-header">Front of Flashcard</h3>
                        <input
                            type="text"
                            id="front-input"
                            placeholder="Example: What is a mitochondria?"
                            value={front}
                            onChange={(e) => setFront(e.target.value)}
                        />
                        <h3 id="back-header">Back of Flashcard</h3>
                        <input
                            type="text"
                            id="back-input"
                            placeholder="Example: Powerhouse of the cell"
                            value={back}
                            onChange={(e) => setBack(e.target.value)}
                        />
                        <select value={difficulty} onChange={handleChange} id="difficulty-input">
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                            <option value="xhard">XHard</option>
                        </select>

                        <div className="modal-buttons">
                            <button id="discard-deck" onClick={toggleModal}>
                                Discard
                            </button>
                            <button id="save-deck" onClick={handleCreateCard}>
                                Create
                            </button>
                        </div>
                    </div>
                </div>

            )}
        </>
    );
}
