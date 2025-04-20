# CS Flashcard - Interactive Learning Platform

A modern, interactive flashcard application designed to help users learn and test their knowledge of Computer Science concepts, particularly focusing on Data Structures and Algorithms.

## 🚀 Features

- **Interactive Flashcards**: Flip cards to reveal answers and test your knowledge
- **Smart Answer Checking**: Advanced text comparison algorithm that accepts similar answers
- **Progress Tracking**: Keep track of your learning streak and progress
- **Card Management**: Create, edit, and delete flashcards with ease
- **Difficulty Levels**: Organize cards by difficulty (Easy, Medium, Hard)
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Smooth Animations**: Engaging UI with smooth transitions and feedback
- **Real-time Feedback**: Immediate feedback on answers with visual indicators

## 🛠️ Tech Stack

### Frontend
- **React.js**: Modern UI framework for building interactive user interfaces
- **CSS3**: Styled components with animations and responsive design
- **JavaScript (ES6+)**: Modern JavaScript features and async/await for API calls

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework for building RESTful APIs
- **MySQL**: Relational database for storing flashcard data
- **Sequelize**: ORM for database management

### Development Tools
- **Git**: Version control
- **npm**: Package management
- **MySQL Workbench**: Database management and visualization

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MySQL Server
- npm (Node Package Manager)
- Git

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cs-flashcard.git
   cd cs-flashcard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   - Create a MySQL database
   - Update the `.env` file with your database credentials:
     ```
     DB_HOST=localhost
     DB_USER=your_username
     DB_PASSWORD=your_password
     DB_NAME=your_database_name
     ```

4. **Start the development server**
   ```bash
   npm start
   ```

## 🎮 Usage

1. **Creating Flashcards**
   - Click on "Create New Flashcard"
   - Enter the question and answer
   - Select the difficulty level
   - Click "Create Flashcard"

2. **Studying Flashcards**
   - View the question on the front of the card
   - Try to answer in your mind
   - Click the card to flip and see the answer
   - Type your answer in the input field
   - Get immediate feedback on your response

3. **Managing Flashcards**
   - Edit existing cards using the "Edit Current Card" button
   - Delete cards using the "Delete Current Card" button
   - Navigate between cards using the arrow buttons
   - Reset your progress using the reset button

## 🎨 UI/UX Features

- **Card Flip Animation**: Smooth 3D flip effect
- **Answer Feedback**: Visual indicators for correct/incorrect answers
- **Streak Counter**: Track your consecutive correct answers
- **Mobile Responsive**: Optimized layout for all screen sizes
- **Touch Feedback**: Enhanced mobile interactions
- **Loading States**: Visual feedback during operations
- **Error Handling**: User-friendly error messages

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to all contributors who have helped improve this project
- Inspired by spaced repetition learning techniques
- Built with ❤️ for the CS learning community
