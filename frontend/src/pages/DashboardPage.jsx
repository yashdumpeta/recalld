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
                <button>Delete</button>
                <button>Study</button>
              </div>
            </li>
          ))}
        </ul>
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
        </nav>
      </div>
      <div className="main-content">
        <header>
          <h2>{activeTab === 'overview' ? 'Dashboard' : 'My Decks'}</h2>
          {activeTab === 'mydecks' ? (
            <CreateModal />
          ) : ''}
        </header>
        {activeTab === 'overview' ? renderOverview() : renderDecks()}
      </div>
    </div>
  )
}

export default DashboardPage


