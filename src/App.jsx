import './App.css';
import { useState } from 'react';
import GameCard from './components/GameCard';

const App = () => {
  const [currentStreak, setCurrentStreak] = useState(0);//A state to store the user's correct streak.
  const [inputs, setInputs] = useState({ //A state to store the user's input.
    'answer': '',
  });
  const [trueAnswer, setTrueAnswer] = useState({}); //A state to store the correct answer.
  const [correct_answer, setCorrectAnswer] = useState('');// A state to store the id of wrong and correct answer for later styling.

  const handleStreak = () => { //A function that counts the user's correct answer streak.
    setCurrentStreak(currentStreak + 1);
  };

  const shuffleArray = (array) => {
      if (array.length <= 1) return array; // If only one card, return as-is
    const [firstCard, ...restCards] = array; // Separate the first card from the rest
    for (let i = restCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [restCards[i], restCards[j]] = [restCards[j], restCards[i]]; // Swap elements
    }
    return [firstCard, ...restCards]; // Keep the first card at index 0
  };

  const handleShuffle = () => {
     // A function to deal with shuffling the card collection.
    console.log("Shuffling Function is running");
    setTriviaGame((prev) => shuffleArray(prev));
    setNumCard(1);
  }
  const getSimilarity = (str1, str2) => { //Find common words between the user input and the answer by trimming unecessary words. 
    const words1 = str1.toLowerCase().split(/\s+/);
    const words2 = str2.toLowerCase().split(/\s+/);
    const set1 = new Set(words1);
    const set2 = new Set(words2);
    const intersection = new Set([...set1].filter(word => set2.has(word)));
    const similarity = intersection.size / Math.max(set1.size, set2.size);
    return similarity;
  }
  const checkAnswer = (e) => {//A function to check the user's answer by finding the common words betwwen the input and the correct answer. 
                              // The result will be correct if the user has 70% of the real answer correctly. 
    e.preventDefault();
    const userInput = inputs.answer.trim();
    const correctAnswer = trueAnswer.trim();
    const similarityScore = getSimilarity(userInput, correctAnswer);
    console.log("Check answer function is run");
    if (similarityScore >= 0.5) {
      setCorrectAnswer('correct');
      handleStreak();
      console.log(inputs['answer']);
      
    } else {
      setCorrectAnswer('wrong');
      console.log("wrong");
    
    }
    setInputs({'answer': ''});
    console.log(inputs);

    
  }

  let [numCard, setNumCard] = useState(1);
  
const getNextCard = () => {
  const nextAnswer = triviaGame[numCard].answer;
  setTrueAnswer(nextAnswer);
  setCorrectAnswer('');
  console.log(nextAnswer);
}

  const updateNextCardsNum = () => {
    if (numCard <= 10) {
      getNextCard();
      setNumCard(numCard + 1);
      setCorrectAnswer('');
      
    }
  }
  const updatePrevCardsNum = () => {
    if (numCard >= 1) {
      setNumCard(numCard -1);
    }
  }

  const resetFlashCard = () => {
    setNumCard(numCard = 1);
    setCorrectAnswer('');
    setInputs({'answer': ''});

  }


  const [triviaGame, setTriviaGame] = useState([
    {
      "question" : "Welcome to the most exciting Data Structure and Algorithm Quiz",
      "answer" : "Hit the arrow button to start!",
      "id" : "intro"
    },
    {
      "question": "What is a Data Structure?",
      "answer": "A data structure is a way to store, organize, and manage data for efficient access and modification.",
      "id": "easy"
    },
    {
      "question": "What are the main types of Data Structures?",
      "answer": "Linear: Arrays, LinkedList, Stacks, Queues\n Non-Linear: Trees, Graphs\n Hash-based: Hash Tables, Hash Maps\n Advanced: Heaps, Tries, B-Trees",
      "id": "medium"
    },
    {
      "question": "What is Big-O Notation?",
      "answer": "Big-O notation describes the time complexity or space complexity of an algorithm, indicating how it scales with input size.",
      "id": "medium"
    },
    {
      "question": "What are common Big-O complexities from best to worst?",
      "answer": "O(1): Constant Time, \nO(log n): Logarithmic Time, \nO(n): Linear Time, \nO(n log n): Linearithmic Time, \nO(n²): Quadratic Time, \nO(2ⁿ): Exponential Time, \nO(n!): Factorial Time",
      "id": "hard"
    },
    {
      "question": "What is a Linked List?",
      "answer": "A linked list is a linear data structure where each element (node) contains: Data and Pointer to the next node.",
      "id": "easy"
    },
    {
      "question": "Difference between Stack and Queue?",
      "answer": "Stack: Last In, First Out (LIFO) – e.g., Backtracking, Undo operations\n Queue: First In, First Out (FIFO) – e.g., Scheduling tasks, Printing.",
      "id": "medium"
    },
    {
      "question": "What is a Binary Search Tree (BST)?",
      "answer": "A BST is a tree where:\nLeft subtree nodes < Root node\nRight subtree nodes > Root node. It allows efficient searching, insertion, and deletion.",
      "id": "medium"
    },
    {
      "question": "What is a Hash Table?",
      "answer": "A hash table is a data structure that maps keys to values using a hash function for fast access (O(1) average time).",
      "id": "medium"
    },
    {
      "question": "What are common sorting algorithms and their time complexities?",
      "answer": "Bubble Sort: O(n²)\nSelection Sort: O(n²)\nMerge Sort: O(n log n)\nQuick Sort: O(n log n) average, O(n²) worst\nInsertion Sort: O(n²)",
      "id": "hard"
    },
    {
      "question": "What is recursion?",
      "answer": "Recursion is a technique where a function calls itself to solve smaller instances of the same problem.",
      "id": "easy"
    }
]);

  
  return ( 
    <div className="App">
      <h1>The Ultimate Computer Science Quiz</h1>
      <h2>How much knowledge of Data Structure and Algorithm do you know? Test it here!</h2>
      <h4>Number of cards: 11</h4>
      <h4>Card Number: #{numCard}</h4>
      <h4>Current Streak: {currentStreak}</h4>
    
      <br/>
      {numCard <= triviaGame.length  && numCard >= 1 ? (
        <GameCard key={numCard} question={triviaGame[numCard - 1].question} answer= {triviaGame[numCard - 1].answer} level={triviaGame[numCard - 1].id}/>
      ): (
        <p>No more cards left!!</p>
      )}
      <form className='container'>
        <div className='mini-container'>
           
          <div className='answer-space' id={correct_answer}>
          Guess the answer here:
            <input type='text' name='answer' value={inputs.answer} placeholder='Place your answer here...' onChange={(e) => setInputs((prevState) => ({
              ...prevState,
              [e.target.name]: e.target.value,
            }))}>
            </input>
            <button type='submit' className='submit-Btn' onClick={checkAnswer}>Submit Guess</button>
          </div>
          
          
        </div>
      </form>
      <button type='button' className='previousCard'onClick={updatePrevCardsNum}>⭠</button>
      <button type='button' className='nextCard'onClick={updateNextCardsNum}>→</button>
      <button className='reset-button' onClick={resetFlashCard}>↻</button>
      <button type='shuffle' className='shuffle-Btn' onClick={handleShuffle}>Shuffle Cards</button>
    </div>
  )
}

export default App