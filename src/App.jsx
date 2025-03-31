import './App.css';
import { useState } from 'react';
import GameCard from './components/GameCard';

const App = () => {
  const [isFlipped, setisFlipped] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [inputs, setInputs] = useState({ 'answer': '' });
  const [trueAnswer, setTrueAnswer] = useState({});
  const [correct_answer, setCorrectAnswer] = useState('');
  const [newCard, setNewCard] = useState({
    question: '',
    answer: '',
    id: ''  // Add an ID field for cards
  });
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [numCard, setNumCard] = useState(1);
  
  const [triviaGame, setTriviaGame] = useState([
    { "question" : "Welcome to the most exciting Data Structure and Algorithm Quiz", "answer" : "Hit the arrow button to start!", "id" : "intro" },
    { "question": "What is a Data Structure?", "answer": "A data structure is a way to store, organize, and manage data for efficient access and modification.", "id": "easy" },
    { "question": "What are the main types of Data Structures?", "answer": "Linear: Arrays, LinkedList, Stacks, Queues\n Non-Linear: Trees, Graphs\n Hash-based: Hash Tables, Hash Maps\n Advanced: Heaps, Tries, B-Trees", "id": "medium" },
    { "question": "What is Big-O Notation?", "answer": "Big-O notation describes the time complexity or space complexity of an algorithm, indicating how it scales with input size.", "id": "medium" },
    { "question": "What are common Big-O complexities from best to worst?", "answer": "O(1): Constant Time, \nO(log n): Logarithmic Time, \nO(n): Linear Time, \nO(n log n): Linearithmic Time, \nO(n²): Quadratic Time, \nO(2ⁿ): Exponential Time, \nO(n!): Factorial Time", "id": "hard" },
    { "question": "What is a Linked List?", "answer": "A linked list is a linear data structure where each element (node) contains: Data and Pointer to the next node.", "id": "easy" },
    { "question": "Difference between Stack and Queue?", "answer": "Stack: Last In, First Out (LIFO) – e.g., Backtracking, Undo operations\n Queue: First In, First Out (FIFO) – e.g., Scheduling tasks, Printing.", "id": "medium" },
    { "question": "What is a Binary Search Tree (BST)?", "answer": "A BST is a tree where:\nLeft subtree nodes < Root node\nRight subtree nodes > Root node. It allows efficient searching, insertion, and deletion.", "id": "medium" },
    { "question": "What is a Hash Table?", "answer": "A hash table is a data structure that maps keys to values using a hash function for fast access (O(1) average time).", "id": "medium" },
    { "question": "What are common sorting algorithms and their time complexities?", "answer": "Bubble Sort: O(n²)\nSelection Sort: O(n²)\nMerge Sort: O(n log n)\nQuick Sort: O(n log n) average, O(n²) worst\nInsertion Sort: O(n²)", "id": "hard" },
    { "question": "What is recursion?", "answer": "Recursion is a technique where a function calls itself to solve smaller instances of the same problem.", "id": "easy" }
  ]);
  
  const handleCardClick = () => {
    setisFlipped(!isFlipped);
  };

  const handleAddOrEditCard = () => {
    if (editMode) {
      // Edit the card based on the index (numCard - 1)
      setTriviaGame((prev) => 
        prev.map((card, index) => 
          index === numCard - 1 ? { ...card, question: newCard.question, answer: newCard.answer } : card
        )
      );
    } else {
      // Add a new card with a unique ID
      const newCardWithID = { ...newCard, id: `custom-${triviaGame.length + 1}` };
      setTriviaGame((prev) => [...prev, newCardWithID]);
    }
  
    // Reset newCard state after adding or editing
    setNewCard({ question: '', answer: '', id: '' });
    setShowForm(false);
  };
  

  const shuffleArray = (array) => {
    if (array.length <= 1) return array;
    const [firstCard, ...restCards] = array;
    for (let i = restCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [restCards[i], restCards[j]] = [restCards[j], restCards[i]];
    }
    return [firstCard, ...restCards];
  };

  const handleShowForm = (edit = false) => {
    setEditMode(edit);
    setShowForm(true);
  };

  const handleShuffle = () => {
    setTriviaGame((prev) => shuffleArray(prev));
    setNumCard(1);
  };

  const getNextCard = () => {
    const nextAnswer = triviaGame[numCard].answer;
    setTrueAnswer(nextAnswer);
    setCorrectAnswer('');
  };

  const updateNextCardsNum = () => {
    if (numCard < triviaGame.length) {
      setNumCard(numCard + 1);
      getNextCard();
      setCorrectAnswer('');
    }
  };

  const updatePrevCardsNum = () => {
    if (numCard > 1) {
      setNumCard(numCard - 1);
    }
  };

  const resetFlashCard = () => {
    setNumCard(1);
    setCorrectAnswer('');
    setInputs({ 'answer': '' });
  };

  const checkAnswer = (e) => {
    e.preventDefault();
    const userInput = inputs.answer.trim();
    const correctAnswer = trueAnswer.trim();
    const similarityScore = getSimilarity(userInput, correctAnswer);
    if (isFlipped) {
      alert("You can't answer while the answer card is flipped");
    } else {
      if (similarityScore >= 0.5) {
        setCorrectAnswer('correct');
        setCurrentStreak(currentStreak + 1);
      } else {
        setCorrectAnswer('wrong');
      }
      setInputs({ 'answer': '' });
    }
  };

  const getSimilarity = (str1, str2) => {
    const words1 = str1.toLowerCase().split(/\s+/);
    const words2 = str2.toLowerCase().split(/\s+/);
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    const intersection = new Set([...set1].filter(word => set2.has(word)));
    return intersection.size / Math.max(set1.size, set2.size);
  };

  return (
    <div className="App">
      <h1>The Ultimate Computer Science Quiz</h1>
      <h2>How much knowledge of Data Structure and Algorithm do you know? Test it here!</h2>
      <h4>Number of cards: {triviaGame.length}</h4>
      <h4>Card Number: #{numCard}</h4>
      <h4>Current Streak: {currentStreak}</h4>
      
      {numCard <= triviaGame.length && numCard >= 1 ? (
        <GameCard 
          key={numCard} 
          question={triviaGame[numCard - 1].question} 
          answer={triviaGame[numCard - 1].answer} 
          level={triviaGame[numCard - 1].id} 
          isFlipped={isFlipped} 
          onFlip={handleCardClick}
        />
      ) : (
        <p>No more cards left!</p>
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
              onChange={(e) => setInputs({ ...inputs, [e.target.name]: e.target.value })}
            />
            <button type='submit' className='submit-Btn' onClick={checkAnswer}>Submit Guess</button>
          </div>
        </div>
      </form>

      <button type='button' className='previousCard' onClick={updatePrevCardsNum}>⭠</button>
      <button type='button' className='nextCard' onClick={updateNextCardsNum}>→</button>
      <button className='reset-button' onClick={resetFlashCard}>↻</button>
      <button type='button' className='shuffle-Btn' onClick={handleShuffle}>Shuffle Cards</button>

      <button onClick={() => handleShowForm(false)}>Add Card</button>
      <button onClick={() => handleShowForm(true)}>Edit Card</button>
      {showForm && (
        <div>
          <label>Question:</label>
          <input type="text" value={newCard.question} onChange={(e) => setNewCard({ ...newCard, question: e.target.value })} />
          <label>Answer:</label>
          <input type="text" value={newCard.answer} onChange={(e) => setNewCard({ ...newCard, answer: e.target.value })} />
          <label>ID:</label>
          <input type="text" value={newCard.id} onChange={(e) => setNewCard({ ...newCard, id: e.target.value })} />
          <button onClick={() => setShowForm(false)}>Cancel</button>
          <button onClick={() => setNewCard({ question: '', answer: '', id: '' })}>Clear</button>
          <button onClick={handleAddOrEditCard}>{editMode ? 'Edit Card' : 'Add Card'}</button>
        </div>
      )}
    </div>
  );
}

export default App;
