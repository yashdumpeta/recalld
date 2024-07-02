import React, { useEffect, useState } from 'react'
import { useAuth } from '../AuthContext';
import api from '../api';

const DashboardPage = () => {

  const [decks, setDecks] = useState([]);
  const [new_deckname, set_new_deckname] = useState('')
  const [deckDescription, set_deckDescription] = useState('')
  const { user } = useAuth();


  //get the decks at the beginning of the page's load
  useEffect(() => {
    fetchDecks();
  }, [])

  useEffect(() => {
    console.log('Decks state updated:', decks);
    if (!Array.isArray(decks)) {
      console.error('Decks is not an array:', decks);
    }
  }, [decks]);



  const fetchDecks = async () => {
    try {
      const res = await api.get('/catalog/decks/')
      console.log('API response:', res.data);
      // Check if res.data is an array, if not, look for a results property
      const decksData = Array.isArray(res.data) ? res.data : res.data.results;
      console.log('Decks data:', decksData);
      setDecks(Array.isArray(decksData) ? decksData : []);
    } catch (error) {
      console.error("Error fetching decks:", error);
      alert("There has been an error getting the deck data");
      setDecks([]); // Set to empty array in case of error
    }
  }


  const createDeck = async (e) => {
    e.preventDefault();
    try {
      const create_response = await api.post('/catalog/decks/',
        {
          deck_name: new_deckname,
          description: deckDescription
        }
      )
      console.log('Deck created', create_response.data)
      await fetchDecks(); // Wait for fetchDecks to complete
      set_new_deckname('');
      set_deckDescription('');
    } catch (error) {
      console.error("Error creating deck", error)
    }
  }


  return (
    <div className='dashboard-container' id='dashboard'>
      <h1 id='decks-title'>My decks</h1>

      <div id='decks-list'>
        <h2>Your Decks</h2>
        {!Array.isArray(decks) ? (
          <p>Error: Unable to load decks. Please try again later.</p>
        ) : decks.length === 0 ? (
          <p>You don't have any decks yet. Create one to get started!</p>
        ) : (
          <ul>
            {decks.map(deck => (
              <li key={deck.id} className="deck-item">
                <h3>{deck.deck_name}</h3>
                <p>{deck.description}</p>
                <p>Created: {new Date(deck.time_created).toLocaleDateString()}</p>
                <p>Last Updated: {new Date(deck.last_updated).toLocaleDateString()}</p>
                <button onClick={() => {/* Add edit functionality */ }}>Edit</button>
                <button onClick={() => {/* Add delete functionality */ }}>Delete</button>
                <button onClick={() => {/* Add study functionality */ }}>Study</button>
              </li>
            ))}
          </ul>
        )}
      </div>


      <form onSubmit={createDeck}>
        <input
          type="text"
          value={new_deckname}
          onChange={(e) => set_new_deckname(e.target.value)}
          placeholder="Deck Name"
        />
        <textarea
          value={deckDescription}
          onChange={(e) => set_deckDescription(e.target.value)}
          placeholder="Deck Description"
        />
        <button type="submit">Create Deck</button>
      </form>

    </div>
  )
}

export default DashboardPage
