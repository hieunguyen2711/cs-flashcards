import './App.css';
import { useState, useEffect } from 'react';
import GameCard from './components/GameCard';

const App = () => {
  const [isFlipped, setisFlipped] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [inputs, setInputs] = useState({
    'answer': '',
    'question': '',
    'level': 'easy'
  });
  const [trueAnswer, setTrueAnswer] = useState('');
  const [correct_answer, setCorrectAnswer] = useState('');
  const [triviaGame, setTriviaGame] = useState([]);
  const [numCard, setNumCard] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Fetch flashcards from backend
  useEffect(() => {
    fetchFlashcards();
  }, []);

  // Set initial answer when flashcards are loaded
  useEffect(() => {
    if (triviaGame.length > 0) {
      setTrueAnswer(triviaGame[0].answer);
    }
  }, [triviaGame]);

  const fetchFlashcards = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/flashcards');
      const data = await response.json();
      setTriviaGame(data);
    } catch (error) {
      console.error('Error fetching flashcards:', error);
    }
  };

  const handleCardClick = () => {
    setisFlipped(!isFlipped);
  };

  const handleStreak = () => {
    setCurrentStreak(prev => prev + 1);
  };

  const getSimilarity = (str1, str2) => {
    if (!str1 || !str2) return 0;
    
    const words1 = str1.toLowerCase().split(/\s+/);
    const words2 = str2.toLowerCase().split(/\s+/);
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    const intersection = new Set([...set1].filter(word => set2.has(word)));
    const similarity = intersection.size / Math.max(set1.size, set2.size);
    return similarity;
  };

  const getNextCard = () => {
    if (triviaGame.length > 0 && numCard < triviaGame.length) {
      const nextAnswer = triviaGame[numCard].answer;
      setTrueAnswer(nextAnswer);
      setCorrectAnswer('');
    }
  };

  const updateNextCardsNum = () => {
    if (numCard < triviaGame.length - 1) {
      setNumCard(prev => {
        const newNum = prev + 1;
        // Update trueAnswer for the next card
        setTrueAnswer(triviaGame[newNum].answer);
        return newNum;
      });
      setCorrectAnswer('');
    } else {
      alert("You've reached the last card!");
    }
  };

  const updatePrevCardsNum = () => {
    if (numCard > 0) {
      setNumCard(prev => {
        const newNum = prev - 1;
        // Update trueAnswer for the previous card
        setTrueAnswer(triviaGame[newNum].answer);
        return newNum;
      });
      setCorrectAnswer('');
    } else {
      alert("You're at the first card!");
    }
  };

  const resetFlashCard = () => {
    setNumCard(0);
    setCorrectAnswer('');
    setInputs({ answer: '', question: '', level: 'easy' });
    setCurrentStreak(0);
    // Reset to first card's answer
    if (triviaGame.length > 0) {
      setTrueAnswer(triviaGame[0].answer);
    }
  };

  const handleCreateFlashcard = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: inputs.question,
          answer: inputs.answer,
          level: inputs.level
        }),
      });
      
      if (response.ok) {
        await fetchFlashcards();
        setInputs({ answer: '', question: '', level: 'easy' });
        alert('New flashcard created successfully!');
      }
    } catch (error) {
      console.error('Error creating flashcard:', error);
      alert('Failed to create flashcard. Please try again.');
    }
  };

  const handleEditFlashcard = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/api/flashcards/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: inputs.question,
          answer: inputs.answer,
          level: inputs.level
        }),
      });
      
      if (response.ok) {
        await fetchFlashcards();
        setIsEditing(false);
        setEditingId(null);
        setInputs({ answer: '', question: '', level: 'easy' });
        alert('Flashcard updated successfully!');
      }
    } catch (error) {
      console.error('Error updating flashcard:', error);
      alert('Failed to update flashcard. Please try again.');
    }
  };

  const handleDeleteFlashcard = async (id) => {
    if (window.confirm('Are you sure you want to delete this flashcard?')) {
      try {
        const response = await fetch(`http://localhost:3001/api/flashcards/${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          await fetchFlashcards();
          if (numCard >= triviaGame.length - 1) {
            setNumCard(Math.max(0, triviaGame.length - 2));
          }
          alert('Flashcard deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting flashcard:', error);
        alert('Failed to delete flashcard. Please try again.');
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
    const correctAnswer = trueAnswer.trim();
    
    // Debug logging
    console.log('User Input:', userInput);
    console.log('Correct Answer:', correctAnswer);
    console.log('Current Card Index:', numCard);
    
    // Validate input
    if (!userInput) {
      alert('Please enter an answer');
      return;
    }

    if (isFlipped) {
      alert("You can't answer while the answer card is flipped");
      return;
    }

    // Normalize both answers for comparison
    const normalizedUserInput = userInput.toLowerCase().replace(/\s+/g, ' ');
    const normalizedCorrectAnswer = correctAnswer.toLowerCase().replace(/\s+/g, ' ');
    
    // Calculate similarity score
    const similarityScore = getSimilarity(normalizedUserInput, normalizedCorrectAnswer);
    
    // Debug logging
    console.log('Similarity Score:', similarityScore);
    
    // Check for exact match first
    if (normalizedUserInput === normalizedCorrectAnswer) {
      console.log('Exact match!');
      setCorrectAnswer('correct');
      handleStreak();
      setTimeout(() => {
        setCorrectAnswer('');
        updateNextCardsNum();
      }, 1500);
    } 
    // Check for high similarity (reduced threshold to 0.4)
    else if (similarityScore >= 0.4) {
      console.log('High similarity match!');
      setCorrectAnswer('correct');
      handleStreak();
      setTimeout(() => {
        setCorrectAnswer('');
        updateNextCardsNum();
      }, 1500);
    } 
    // Check for partial match (at least 30% similar)
    else if (similarityScore >= 0.3) {
      console.log('Partial match!');
      setCorrectAnswer('partial');
      setCurrentStreak(0);
      setTimeout(() => setCorrectAnswer(''), 1500);
    } 
    // No match
    else {
      console.log('No match!');
      setCorrectAnswer('wrong');
      setCurrentStreak(0);
      setTimeout(() => setCorrectAnswer(''), 1500);
    }
    
    // Clear input
    setInputs(prev => ({ ...prev, answer: '' }));
  };

  return (
    <div className="App">
      <h1>The Ultimate Computer Science Quiz</h1>
      <h2>How much knowledge of Data Structure and Algorithm do you know? Test it here!</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1rem' }}>
        <h4>Number of cards: {triviaGame.length}</h4>
        <h4>Card Number: #{numCard + 1}</h4>
        <h4>Current Streak: {currentStreak}</h4>
      </div>

      <div className="main-content">
        <div className="game-area">
          {triviaGame.length > 0 && numCard < triviaGame.length ? (
            <GameCard
              key={numCard}
              question={triviaGame[numCard].question}
              answer={triviaGame[numCard].answer}
              level={triviaGame[numCard].level}
              isFlipped={isFlipped}
              onFlip={handleCardClick}
            />
          ) : (
            <p>No more cards left!!</p>
          )}

          <form className='container'>
            <div className='mini-container'>
              <div className='answer-space' id={correct_answer}>
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
            {triviaGame.length > 0 && numCard < triviaGame.length && (
              <button
                className='edit-button'
                onClick={() => startEditing(triviaGame[numCard])}
              >
                Edit Current Card
              </button>
            )}
            {triviaGame.length > 0 && numCard < triviaGame.length && (
              <button
                className='delete-button'
                onClick={() => handleDeleteFlashcard(triviaGame[numCard].id)}
              >
                Delete Current Card
              </button>
            )}
          </div>
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
