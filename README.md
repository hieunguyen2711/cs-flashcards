# Vietnamese Learning Flashcard - Interactive Learning Platform

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
   git clone https://github.com/hieunguyen2711/cs-flashcard.git
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

## 🚀 Deployment Guide

### Prerequisites for Deployment
- Google Cloud Platform account
- Google Cloud SDK installed
- MySQL instance (Cloud SQL recommended)
- Domain name (optional)

### 1. Prepare Your Application

1. **Build your React application**
   ```bash
   npm run build
   ```

2. **Update environment variables**
   Create a `.env.production` file with your production credentials:
   ```
   DB_HOST=your_cloud_sql_instance_ip
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   NODE_ENV=production
   ```

### 2. Set Up Google Cloud Platform

1. **Create a new project**
   ```bash
   gcloud projects create your-project-id
   gcloud config set project your-project-id
   ```

2. **Enable required APIs**
   ```bash
   gcloud services enable compute.googleapis.com
   gcloud services enable sqladmin.googleapis.com
   ```

3. **Create a Cloud SQL instance**
   ```bash
   gcloud sql instances create your-instance-name \
     --database-version=MYSQL_8_0 \
     --tier=db-f1-micro \
     --region=us-central1
   ```

4. **Create a database and user**
   ```bash
   gcloud sql databases create your-database-name --instance=your-instance-name
   gcloud sql users create your-username --instance=your-instance-name --password=your-password
   ```

### 3. Deploy to Google Cloud Run

1. **Create a Dockerfile**
   ```dockerfile
   FROM node:16-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   CMD ["node", "server.js"]
   ```

2. **Build and push the container**
   ```bash
   gcloud builds submit --tag gcr.io/your-project-id/cs-flashcard
   ```

3. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy cs-flashcard \
     --image gcr.io/your-project-id/cs-flashcard \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

### 4. Set Up Continuous Deployment (Optional)

1. **Create a Cloud Build trigger**
   ```bash
   gcloud builds triggers create github \
     --repo-name=your-repo-name \
     --branch-pattern="^main$" \
     --build-config=cloudbuild.yaml
   ```

2. **Create cloudbuild.yaml**
   ```yaml
   steps:
   - name: 'gcr.io/cloud-builders/docker'
     args: ['build', '-t', 'gcr.io/$PROJECT_ID/cs-flashcard', '.']
   - name: 'gcr.io/cloud-builders/docker'
     args: ['push', 'gcr.io/$PROJECT_ID/cs-flashcard']
   - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
     entrypoint: gcloud
     args: ['run', 'deploy', 'cs-flashcard', '--image', 'gcr.io/$PROJECT_ID/cs-flashcard', '--region', 'us-central1', '--platform', 'managed']
   ```

### 5. Monitoring and Maintenance

1. **Set up monitoring**
   - Use Cloud Monitoring for performance metrics
   - Set up alerts for errors and high latency
   - Monitor database connections and query performance

2. **Regular maintenance**
   - Keep dependencies updated
   - Monitor and optimize database performance
   - Regular backups of your database
   - Review and update security settings

### 6. Security Considerations

1. **Database Security**
   - Use SSL for database connections
   - Implement proper access controls
   - Regular security audits

2. **Application Security**
   - Implement rate limiting
   - Use proper CORS settings
   - Regular security updates
   - Input validation and sanitization

3. **Environment Security**
   - Use secret management for sensitive data
   - Implement proper IAM roles
   - Regular security scanning

### 7. Scaling Considerations

1. **Horizontal Scaling**
   - Cloud Run automatically scales based on traffic
   - Monitor and adjust concurrency settings
   - Use connection pooling for database connections

2. **Database Scaling**
   - Monitor database performance
   - Consider read replicas for high read traffic
   - Implement proper indexing

3. **Cost Optimization**
   - Monitor resource usage
   - Use appropriate instance sizes
   - Implement caching where possible
