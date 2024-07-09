import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const EditDeckModal = ({ deck, onClose, onUpdate }) => {
  const [deckName, setDeckName] = useState(deck.deck_name);
  const [description, setDescription] = useState(deck.description);
  const navigate = useNavigate();


  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate({ ...deck, deck_name: deckName, description });
  };



  return (
    <div className="modal">
      <div className="modal-content">
        <h2 id='edit-header'>Edit your deck</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={deckName}
            onChange={(e) => setDeckName(e.target.value)}
            placeholder="Enter a name..."
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a description..."
          />
          <button id='manage-cards' onClick={() => navigate(`/manage-cards/${deck.id}`)}>Manage Cards</button>
          <button id='update-button' type="submit">Update Deck</button>
          <button id='cancel-button' type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default EditDeckModal;