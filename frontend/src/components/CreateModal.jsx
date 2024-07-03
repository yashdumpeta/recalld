import React, { useState } from "react";
import '../styles/CreateModal.css';
import { FaPlus } from "react-icons/fa";
import api from "../api.js";

export default function Modal({ uponCreation }) {

    const [modal, setModal] = useState(false);
    const [new_deckname, set_new_deckname] = useState('');
    const [deckDescription, set_deckDescription] = useState('');

    const toggleModal = () => {
        setModal(!modal);
    };

    const handleCreateDeck = async (e) => {
        e.preventDefault();
        try {
            const create_response = await api.post('/catalog/decks/', {
                deck_name: new_deckname,
                description: deckDescription
            });
            console.log('Deck created', create_response.data);
            uponCreation(create_response.data);
            toggleModal();
        } catch (error) {
            console.error("Error creating deck", error);
        }
    };

    return (
        <>
            <button
                id='create-deck-button'
                onClick={toggleModal}
            >
                <FaPlus style={{ marginRight: '8px' }} />
                Create Deck
            </button>

            {modal && (
                <div className="modal">
                    <div className="modal-content">
                        <p id="description">Give your new deck a name and a description.</p>
                        <h3 id="name-header">Name</h3>
                        <input
                            type="text"
                            id="create-deck-name"
                            placeholder="Enter a name..."
                            value={new_deckname}
                            onChange={(e) => set_new_deckname(e.target.value)}
                        />
                        <h3 id="description-header">Description</h3>
                        <input
                            type="text"
                            id="create-deck-description"
                            placeholder="Enter a description..."
                            value={deckDescription}
                            onChange={(e) => set_deckDescription(e.target.value)}
                        />
                        <div className="modal-buttons">
                            <button id="discard-deck" onClick={toggleModal}>
                                Discard
                            </button>
                            <button id="save-deck" onClick={handleCreateDeck}>
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
