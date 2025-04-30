import './App.css';
import { useState, useEffect } from 'react';
import GameCard from './components/GameCard';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const App = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [inputs, setInputs] = useState({
    answer: '',
    question: '',
    level: 'easy'
  });
  const [triviaGame, setTriviaGame] = useState([]);
  const [numCard, setNumCard] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [feedback, setFeedback] = useState('');

  // Fetch flashcards from Supabase
  useEffect(() => {
    fetchFlashcards();
  }, []);

  const fetchFlashcards = async () => {
    try {
      const { data, error } = await supabase
        .from('vietnamese-db')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setTriviaGame(data);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      alert(`Failed to load flashcards: ${error.message}`);
    }
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  const handleStreak = () => {
    setCurrentStreak(prev => prev + 1);
  };

  const getSimilarity = (str1, str2) => {
    if (!str1 || !str2) return 0;
    
    const cleanStr1 = str1.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').replace(/\s+/g, ' ').trim();
    const cleanStr2 = str2.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').replace(/\s+/g, ' ').trim();
    
    const words1 = cleanStr1.split(/\s+/);
    const words2 = cleanStr2.split(/\s+/);
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    const intersection = new Set([...set1].filter(word => set2.has(word)));
    return intersection.size / Math.max(set1.size, set2.size);
  };

  const updateNextCardsNum = () => {
    if (triviaGame.length === 0) return;
    if (numCard < triviaGame.length - 1) {
      setNumCard(prev => {
        const nextIndex = prev + 1;
        console.log(`Moving from card ${prev} to ${nextIndex}`); // Debug log
        return nextIndex;
      });
      setIsFlipped(false);
    } else {
      alert("You've reached the end of the deck! Click the reset button (↻) to start over.");
    }
  };

  const updatePrevCardsNum = () => {
    if (triviaGame.length === 0) return;
    if (numCard > 0) {
      setNumCard(prev => {
        const prevIndex = prev - 1;
        console.log(`Moving from card ${prev} to ${prevIndex}`); // Debug log
        return prevIndex;
      });
      setIsFlipped(false);
    } else {
      alert("You're at the beginning of the deck! Use the next button (→) to proceed.");
    }
  };

  const resetFlashCard = () => {
    setNumCard(0);
    setCurrentStreak(0);
    setIsFlipped(false);
    alert("Deck has been reset to the beginning!");
  };

  const shuffleCards = () => {
    setTriviaGame(prevCards => {
      const shuffled = [...prevCards].sort(() => Math.random() - 0.5);
      setNumCard(0);
      setIsFlipped(false);
      return shuffled;
    });
    alert("Cards have been shuffled!");
  };

  const handleCreateFlashcard = async (e) => {
    e.preventDefault();
    if (!inputs.question.trim() || !inputs.answer.trim()) {
      alert('Please fill in both question and answer fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('vietnamese-db')
        .insert([{
          question: inputs.question.trim(),
          answer: inputs.answer.trim(),
          level: inputs.level
        }]);

      if (error) throw error;
      
      await fetchFlashcards();
      setInputs({ answer: '', question: '', level: 'easy' });
      alert('New flashcard created successfully!');
    } catch (error) {
      console.error('Error creating flashcard:', error);
      alert(`Failed to create flashcard: ${error.message}`);
    }
  };

  const handleEditFlashcard = async (e) => {
    e.preventDefault();
    if (!inputs.question.trim() || !inputs.answer.trim()) {
      alert('Please fill in both question and answer fields');
      return;
    }

    try {
      const { error } = await supabase
        .from('vietnamese-db')
        .update({
          question: inputs.question.trim(),
          answer: inputs.answer.trim(),
          level: inputs.level
        })
        .eq('id', editingId);

      if (error) throw error;
      
      await fetchFlashcards();
      setIsEditing(false);
      setEditingId(null);
      setInputs({ answer: '', question: '', level: 'easy' });
      alert('Flashcard updated successfully!');
    } catch (error) {
      console.error('Error updating flashcard:', error);
      alert(`Failed to update flashcard: ${error.message}`);
    }
  };

  const handleDeleteFlashcard = async (id) => {
    if (!id) return;

    if (window.confirm('Are you sure you want to delete this flashcard?')) {
      try {
        const { error } = await supabase
          .from('vietnamese-db')
          .delete()
          .eq('id', id);

        if (error) throw error;
        
        await fetchFlashcards();
        if (numCard >= triviaGame.length - 1) {
          setNumCard(Math.max(0, triviaGame.length - 2));
        }
        alert('Flashcard deleted successfully!');
      } catch (error) {
        console.error('Error deleting flashcard:', error);
        alert(`Failed to delete flashcard: ${error.message}`);
      }
    }
  };

  const startEditing = (card) => {
    setIsEditing(true);
    setEditingId(card.id);
    setInputs({
      question: card.question,
      answer: card.answer,
      level: card.level
    });
  };

  const checkAnswer = (e) => {
    e.preventDefault();
    const userInput = inputs.answer.trim();
    const correctAnswer = triviaGame[numCard]?.answer.trim();
    
    if (!userInput) {
      alert('Please enter an answer');
      return;
    }

    if (isFlipped) {
      alert("You can't answer while the answer card is flipped");
      return;
    }

    if (!correctAnswer) {
      console.error('No correct answer available');
      return;
    }

    const similarityScore = getSimilarity(userInput, correctAnswer);
    
    if (similarityScore >= 0.4) {
      setFeedback('correct');
      handleStreak();
      setTimeout(() => {
        setFeedback('');
      }, 1500);
    } else {
      setFeedback('wrong');
      setCurrentStreak(0);
      setTimeout(() => setFeedback(''), 1500);
    }
    
    setInputs(prev => ({ ...prev, answer: '' }));
  };

  return (
    <div className="App">
      <div className="logo">
        <span className="logo-text">VN</span>
      </div>
      <h1>Vietnamese Language Flashcard</h1>
      <h2>Master Vietnamese vocabulary and phrases with interactive flashcards!</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1rem' }}>
        <h4>Number of cards: {triviaGame.length}</h4>
        <h4>Card Number: #{triviaGame.length > 0 ? numCard + 1 : 0}</h4>
        <h4>Current Streak: {currentStreak}</h4>
      </div>

      <div className="main-content">
        <div className="game-area">
          {triviaGame.length > 0 ? (
            <>
              <GameCard
                key={numCard}
                question={triviaGame[numCard]?.question || 'No question available'}
                answer={triviaGame[numCard]?.answer || 'No answer available'}
                level={triviaGame[numCard]?.level || 'easy'}
                isFlipped={isFlipped}
                onFlip={handleCardClick}
              />

              <form className='container'>
                <div className='mini-container'>
                  <div className={`answer-space ${feedback}`}>
                    Guess the answer here:
                    <input
                      type='text'
                      name='answer'
                      value={inputs.answer}
                      placeholder='Place your answer here...'
                      onChange={(e) => setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                    />
                    <button type='submit' className='submit-Btn' onClick={checkAnswer}>
                      Submit Guess
                    </button>
                  </div>
                </div>
              </form>

              <div className="card-controls">
                <button type='button' className='previousCard' onClick={updatePrevCardsNum}>⭠</button>
                <button type='button' className='nextCard' onClick={updateNextCardsNum}>→</button>
                <button className='reset-button' onClick={resetFlashCard}>↻</button>
                <button className='shuffle-button' onClick={shuffleCards}>🔀</button>
                <button
                  className='edit-button'
                  onClick={() => triviaGame[numCard] && startEditing(triviaGame[numCard])}
                >
                  Edit Current Card
                </button>
                <button
                  className='delete-button'
                  onClick={() => triviaGame[numCard]?.id && handleDeleteFlashcard(triviaGame[numCard].id)}
                >
                  Delete Current Card
                </button>
              </div>
            </>
          ) : (
            <div className="no-cards-message">
              <p>No flashcards available. Create some flashcards to get started!</p>
            </div>
          )}
        </div>

        <div className="card-management">
          <h3>{isEditing ? 'Edit Flashcard' : 'Create New Flashcard'}</h3>
          <form onSubmit={isEditing ? handleEditFlashcard : handleCreateFlashcard}>
            <input
              type="text"
              name="question"
              value={inputs.question}
              placeholder="Enter question"
              onChange={(e) => setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))}
            />
            <input
              type="text"
              name="answer"
              value={inputs.answer}
              placeholder="Enter answer"
              onChange={(e) => setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))}
            />
            <select
              name="level"
              value={inputs.level}
              onChange={(e) => setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <button type="submit">
              {isEditing ? 'Update Flashcard' : 'Create Flashcard'}
            </button>
            {isEditing && (
              <button type="button" onClick={() => {
                setIsEditing(false);
                setEditingId(null);
                setInputs({ answer: '', question: '', level: 'easy' });
              }}>
                Cancel Edit
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;
