import React, { useState } from 'react';

const EditCardModal = ({ card, onClose, onUpdate }) => {

    const [front, setFront] = useState(card.front_side)
    const [back, setBack] = useState(card.back_side)

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate({ ...card, front_side: front, back_side: back })
    }

    return (
        <div className="modal">
            <div className="modal-content">
                <h2 id='edit-header'>Edit your card</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={front}
                        onChange={(e) => setFront(e.target.value)}
                        placeholder="Change the front of your flashcard..."
                    />
                    <input
                        value={back}
                        onChange={(e) => setBack(e.target.value)}
                        placeholder="Change the back of your flashcard..."
                    />
                    
                    <button id='update-button' type="submit">Update Deck</button>
                    <button id='cancel-button' type="button" onClick={onClose}>Cancel</button>
                </form>
            </div>
        </div>
    );
};

export default EditCardModal;