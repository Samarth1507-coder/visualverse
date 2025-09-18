# Visualverse - DSA Learning Platform

A modern, full-stack web application for learning Data Structures & Algorithms through interactive visual doodling and community collaboration.

## 🎯 **Project Overview**

Visualverse is an innovative EdTech platform that combines visual learning with DSA education. Users can create, share, and learn from interactive doodles that visualize complex programming concepts.

### ✨ **Key Features**

- **🎨 Interactive Drawing Canvas** - Create DSA visualizations with powerful drawing tools
- **🏆 DSA Challenges** - Progressive learning challenges with gamification
- **🤝 Community Gallery** - Share and discover amazing doodles from the community
- **📊 Learning Analytics** - Track progress, streaks, and achievements
- **👥 Social Features** - Follow users, like drawings, and collaborate
- **🏅 Gamification** - Earn badges, points, and climb leaderboards

## 🛠 **Tech Stack**

### **Frontend**
- **React 18** - Modern React with hooks and context
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API communication

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication and authorization
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation

### **Development Tools**
- **Nodemon** - Auto-restart server during development
- **Concurrently** - Run frontend and backend simultaneously
- **PostCSS & Autoprefixer** - CSS processing

## 📁 **Project Structure**

```
visualverse/
├── public/                     # Static files
│   └── index.html             # Main HTML file
├── src/                       # React frontend
│   ├── components/            # React components
│   │   ├── LoginPage.js       # Authentication page
│   │   └── Dashboard.js       # Main dashboard
│   ├── contexts/              # React contexts
│   │   └── AuthContext.js     # Authentication context
│   ├── App.js                 # Main App component
│   ├── index.js              # React entry point
│   └── index.css             # Global styles
├── backend/                   # Node.js backend
│   ├── models/               # MongoDB models
│   │   └── User.js           # User model
│   ├── routes/               # API routes
│   │   ├── auth.js           # Authentication routes
│   │   ├── users.js          # User management routes
│   │   ├── drawings.js       # Drawing routes (placeholder)
│   │   ├── challenges.js     # Challenge routes (placeholder)
│   │   └── community.js      # Community routes (placeholder)
│   ├── middleware/           # Express middleware
│   │   ├── auth.js           # Authentication middleware
│   │   └── errorHandler.js   # Error handling middleware
│   ├── server.js             # Express server
│   ├── package.json          # Backend dependencies
│   └── env.example           # Environment variables template
├── package.json              # Frontend dependencies
├── tailwind.config.js        # Tailwind configuration
├── postcss.config.js         # PostCSS configuration
└── README.md                 # Project documentation
```

## 🚀 **Getting Started**

### **Prerequisites**

- **Node.js** (version 14 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local installation or MongoDB Atlas)

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd visualverse
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cd backend
   cp env.example .env
   ```
   
   Edit the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/visualverse
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=30d
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Start MongoDB** (if using local installation)
   ```bash
   # On Windows
   mongod
   
   # On macOS/Linux
   sudo systemctl start mongod
   ```

5. **Run the application**
   ```bash
   # Development mode (runs both frontend and backend)
   npm run dev
   
   # Or run separately:
   npm run server  # Backend only
   npm run client  # Frontend only
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/api/health

## 📚 **API Documentation**

### **Authentication Endpoints**

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/forgot-password` - Request password reset

### **User Management Endpoints**

- `GET /api/users` - Get all users (with pagination and search)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/follow/:id` - Follow a user
- `DELETE /api/users/follow/:id` - Unfollow a user
- `GET /api/users/leaderboard` - Get leaderboard

### **Placeholder Endpoints** (Coming Soon)

- `GET /api/drawings` - Get all drawings
- `POST /api/drawings` - Create new drawing
- `GET /api/challenges` - Get all challenges
- `GET /api/community/gallery` - Get community gallery
- `GET /api/community/feed` - Get community feed

## 🎨 **Features in Detail**

### **Authentication System**
- JWT-based authentication
- Password hashing with bcrypt
- Input validation with express-validator
- Protected routes with middleware
- User registration and login

### **User Management**
- Complete user profiles with progress tracking
- Achievement system with badges
- Learning streaks and points
- Social features (follow/unfollow)
- Profile completion tracking

### **Dashboard**
- Beautiful, responsive design
- Tab-based navigation
- Real-time user statistics
- Quick action buttons
- Achievement display

### **Security Features**
- Helmet.js for security headers
- Rate limiting
- CORS configuration
- Input sanitization
- Error handling middleware

## 🔧 **Development Scripts**

```bash
# Install all dependencies
npm run install-all

# Development mode (both frontend and backend)
npm run dev

# Run backend only
npm run server

# Run frontend only
npm run client

# Build for production
npm run build

# Run tests
npm test
```

## 🎯 **Upcoming Features**

### **Phase 2: Canvas Component**
- HTML5 Canvas integration
- Drawing tools (pen, brush, shapes, text)
- Color palette and brush sizes
- Undo/redo functionality
- Save and load drawings

### **Phase 3: DSA Challenges**
- Progressive challenge system
- Multiple difficulty levels
- Interactive problem solving
- Solution validation
- Progress tracking

### **Phase 4: Community Features**
- Drawing gallery
- Like and comment system
- User profiles
- Social feed
- Collaboration tools

### **Phase 5: Advanced Features**
- Real-time collaboration
- Video tutorials
- Code integration
- Mobile app
- Advanced analytics

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 **Acknowledgments**

- [React](https://reactjs.org/) for the frontend framework
- [Express.js](https://expressjs.com/) for the backend framework
- [Tailwind CSS](https://tailwindcss.com/) for the styling
- [MongoDB](https://www.mongodb.com/) for the database
- [Mongoose](https://mongoosejs.com/) for MongoDB object modeling

## 📞 **Support**

For support and questions:
- Create an issue in the repository
- Email: support@visualverse.com
- Documentation: [docs.visualverse.com](https://docs.visualverse.com)

---

**Built with ❤️ for the DSA learning community**

