import './App.css';
import { useState } from 'react';
import GameCard from './components/GameCard';

const App = () => {
  let [numCard, setNumCard] = useState(1);
  let  [cardsLeft, setCardsLeft] = useState(10);


  const updateCardsNum = () => {
    if (numCard <= 10) {
      setNumCard(numCard + 1);
      setCardsLeft(cardsLeft -1);
    }
  }

  const resetFlashCard = () => {
    setNumCard(numCard = 1);
    setCardsLeft(cardsLeft = 10);
  }


  const triviaGame = [
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
];

  
  return ( 
    <div className="App">
      <h1>The Ultimate Computer Science Quiz</h1>
      <h2>How much knowledge of Data Structure and Algorithm do you know? Test it here!</h2>
      <h4>Number of cards: 11</h4>
      <h4>Card Number: #{numCard}</h4>
      <h4>Cards Left: {cardsLeft}</h4>
      <br/>
      {numCard <= triviaGame.length ? (
        <GameCard key={numCard} question={triviaGame[numCard - 1].question} answer= {triviaGame[numCard - 1].answer} level={triviaGame[numCard - 1].id}/>
      ): (
        <p>No more cards left!!</p>
      )}
      
      <button type='button' className='nextCard'onClick={updateCardsNum}>→</button>
      <button className='reset-button' onClick={resetFlashCard}>↻</button>
    </div>
  )
}

export default App