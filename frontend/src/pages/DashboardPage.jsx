import React, { useEffect, useState } from 'react'
import api from '../api';
import '../styles/DashboardPage.css'
import { FaBook, FaHome, FaTrash, FaPencilAlt } from 'react-icons/fa';
import CreateModal from '../components/CreateModal';
import EditDeckModal from '../components/EditModal';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const [decks, setDecks] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [editingDeck, setEditingDeck] = useState(null)
  const [update, setUpdate] = useState('')
  const navigate = useNavigate();

  useEffect(() => {
    fetchDecks();
  }, [])

  const addNewDeck = (newDeck) => {
    setDecks([...decks, newDeck]);
  };

  const handleEdit = (deck) => {
    setEditingDeck(deck)
  }

  const fetchDecks = async () => {
    try {
      const res = await api.get('/catalog/decks/')
      const decksData = Array.isArray(res.data) ? res.data : res.data.results;
      setDecks(Array.isArray(decksData) ? decksData : []);
    } catch (error) {
      console.error("Error fetching decks:", error);
      setDecks([]);
    } finally{
      console.log(decks)
    }
  }


  const renderOverview = () => (
    <div className="overview-content">
      <div className="total-decks">
        <h2>Total Decks</h2>
        <p className="big-number">{decks.length}</p>
      </div>
    </div>
  )

  const renderDecks = () => (
    <div className="my-decks-content">
      {decks.length === 0 ? (
        <p>You don't have any decks yet. Create one to start recalling!</p>
      ) : (
        <div className="deck-grid">
          {decks.map(deck => (
            <div key={deck.id} className="deck-item">
              <h1 id='deck-name'>{deck.deck_name}</h1>
              <p id='deck-description'>{deck.description}</p>
              <div className="dates">
                <p id='created'>Created: {new Date(deck.time_created).toLocaleDateString()}</p>
              </div>
              <div className="deck-actions">
                <button onClick={() => handleEdit(deck)}><FaPencilAlt className='icon-style' /></button>
                <button id='delete-button' onClick={() => handleDelete(deck.id)}><FaTrash className='icon-style' /></button>
                <button onClick={() => navigate(`/study/${deck.id}`)}><FaBook className='icon-style' /></button>
              </div>
            </div>
          ))}
        </div>
      )}
      {editingDeck && (
        <EditDeckModal
          deck={editingDeck}
          onClose={() => setEditingDeck(null)}

          onUpdate={handleUpdateDeck}
        />
      )}
    </div>
  )


  const handleDelete = async (deleteId) => {
    if (window.confirm("Are you sure you want to delete this Deck?")) {
      try {
        await api.delete(`/catalog/decks/${deleteId}/delete`)
        setDecks(decks.filter(deck => deck.id !== deleteId)); //re display all the decks whose Id isnt deleteId
      } catch (error) {
        console.error("Error deleting deck", error)
        alert("Uh oh! Failed to delete this deck");
      }
    }
  }

  const handleUpdateDeck = async (updatedDeck) => {
    try {
      const response = await api.patch(`/catalog/decks/${updatedDeck.id}/update/`, updatedDeck);
      setDecks(decks.map(deck => deck.id === updatedDeck.id ? response.data : deck));
      setEditingDeck(null);
    } catch (error) {
      console.error("Error updating deck:", error);
      alert("Failed to update the deck");
    }
  };

  const renderStudy = () => (
    <div className="study-content">
      {decks.length === 0 ? (
        <p>You don't have any decks yet. Create one to start recalling!</p>
      ) : (
        <div className="deck-grid">
          {decks.map(deck => (
            <div key={deck.id} className="deck-item">
              <h1 id='deck-name'>{deck.deck_name}</h1>
              <p id='deck-description'>{deck.description}</p>
              <button id='start' onClick={() => navigate(`/study/${deck.id}`)}>Start recalling</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )


  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <nav>
          <h4 id='menu-title'>Menu</h4>
          <button
            className={activeTab === 'overview' ? 'active' : ''}
            onClick={() => setActiveTab('overview')}
          >
            <FaHome style={{ marginRight: '8px' }} />
            Overview
          </button>
          <button
            className={activeTab === 'mydecks' ? 'active' : ''}
            onClick={() => setActiveTab('mydecks')}
          >
            <FaBook style={{ marginRight: '8px' }} />
            My Decks
          </button>
          <button
            className={activeTab === 'study' ? 'active' : ''}
            onClick={() => setActiveTab('study')}
          >
            <FaPencilAlt style={{ marginRight: '8px' }} />
            Study
          </button>
        </nav>
      </div>
      <div className="main-content">
        <header>
          <h2>
            {activeTab === 'overview'
              ? 'Dashboard'
              : activeTab === 'mydecks'
                ? 'My Decks'
                : 'Study'}
          </h2>
          {activeTab === 'mydecks' ? (
            <CreateModal uponCreation={addNewDeck} />
          ) : ''}
        </header>
        {activeTab === 'overview'
          ? renderOverview()
          : activeTab === 'mydecks'
            ? renderDecks()
            : renderStudy()}
      </div>
    </div>
  )
}

export default DashboardPage


