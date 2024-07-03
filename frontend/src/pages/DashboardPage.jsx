import React, { useEffect, useState } from 'react'
import { useAuth } from '../AuthContext';
import api from '../api';
import '../styles/DashboardPage.css'
import { FaBook, FaHome } from 'react-icons/fa';
import CreateModal from '../components/CreateModal';


const DashboardPage = () => {
  const [decks, setDecks] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const { user } = useAuth();

  useEffect(() => {
    fetchDecks();
  }, [])

  const addNewDeck = (newDeck) => {
    setDecks([...decks, newDeck]);
  };

  const fetchDecks = async () => {
    try {
      const res = await api.get('/catalog/decks/')
      const decksData = Array.isArray(res.data) ? res.data : res.data.results;
      setDecks(Array.isArray(decksData) ? decksData : []);
    } catch (error) {
      console.error("Error fetching decks:", error);
      setDecks([]);
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
      <h2 id='my-decks'>My Decks</h2>

      {decks.length === 0 ? (
        <p>You don't have any decks yet. Create one to start recalling!</p>
      ) : (
        <ul className="deck-list">
          {decks.map(deck => (
            <li key={deck.id} className="deck-item">
              <h3>{deck.deck_name}</h3>
              <p>{deck.description}</p>
              <p>Created: {new Date(deck.time_created).toLocaleDateString()}</p>
              <p>Last Updated: {new Date(deck.last_updated).toLocaleDateString()}</p>
              <div className="deck-actions">
                <button>Edit</button>
                <button onClick={() => handleDelete(deck.id)}>Delete</button>
                <button>Study</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )

  const handleDelete = async (deleteId) => {
    if(window.confirm("Are you sure you want to delete this Deck?")){
      try{
        await api.delete(`/catalog/decks/${deleteId}/`)
        setDecks(decks.filter(deck => deck.id !== deleteId)); //re display all the decks whose Id isnt deleteId
      } catch (error){
        console.error("Error deleting deck", error)
        alert("Uh oh! Failed to delete this deck");
      }
     }
  }

  

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
        </nav>
      </div>
      <div className="main-content">
        <header>
          <h2>{activeTab === 'overview' ? 'Dashboard' : 'My Decks'}</h2>
          {activeTab === 'mydecks' ? (
            <CreateModal uponCreation={addNewDeck} />
          ) : ''}
        </header>
        {activeTab === 'overview' ? renderOverview() : renderDecks()}
      </div>
    </div>
  )
}

export default DashboardPage


