# DSA Challenge System - VisualVerse

A comprehensive challenge system for learning Data Structures & Algorithms through interactive visual doodling. Users receive prompts to draw DSA concepts and can submit their visualizations to a community gallery.

## 🎯 Features

### Core Challenge System
- **Visual Prompts**: DSA-focused drawing challenges with detailed descriptions
- **Difficulty Levels**: Beginner, Intermediate, and Advanced challenges
- **Categories**: Data Structures, Algorithms, Graphs, Trees, Arrays, Strings, etc.
- **Point System**: Earn points for completing challenges
- **Time Tracking**: Monitor completion time for each challenge

### Drawing & Submission
- **HTML5 Canvas**: Integrated drawing board with tools and colors
- **Real-time Drawing**: Smooth pen and eraser tools
- **Save & Submit**: Save drawings as images and submit to challenges
- **Metadata**: Add titles, descriptions, and tags to submissions

### Community Features
- **Gallery View**: Browse all submissions for each challenge
- **Social Interactions**: Like and rate other users' doodles
- **Sorting Options**: Sort by newest, most liked, or highest rated
- **User Profiles**: See who created each doodle

## 🏗️ Architecture

### Backend Models

#### Challenge Model
```javascript
{
  title: String,           // Challenge title
  prompt: String,          // Drawing prompt
  description: String,     // Detailed description
  category: String,        // DSA category
  difficulty: String,      // beginner/intermediate/advanced
  tags: [String],          // Related tags
  points: Number,          // Points awarded
  timeLimit: Number,       // Time limit in minutes
  isActive: Boolean,       // Challenge availability
  stats: Object            // Submission statistics
}
```

#### Doodle Model
```javascript
{
  userId: ObjectId,        // User who created it
  challengeId: ObjectId,   // Associated challenge
  title: String,           // Doodle title
  description: String,     // User's description
  imageData: String,       // Base64 image data
  tags: [String],          // User-defined tags
  likes: Number,           // Like count
  likedBy: [ObjectId],     // Users who liked
  rating: Number,          // Average rating
  ratings: [Object],       // Individual ratings
  comments: [Object],      // User comments
  completionTime: Number,  // Time taken in seconds
  isPublic: Boolean,       // Visibility setting
  isFeatured: Boolean      // Featured status
}
```

### API Endpoints

#### Challenges
- `GET /api/challenges` - Get all challenges with filters
- `GET /api/challenges/:id` - Get specific challenge details
- `GET /api/challenges/:id/doodles` - Get doodles for a challenge
- `POST /api/challenges/:id/submit` - Submit a doodle for a challenge
- `GET /api/challenges/categories` - Get available categories
- `GET /api/challenges/difficulties` - Get difficulty levels
- `GET /api/challenges/random` - Get random challenge

#### Doodles
- `GET /api/drawings` - Get all doodles with filters
- `GET /api/drawings/:id` - Get specific doodle details
- `POST /api/drawings` - Create new doodle
- `PUT /api/drawings/:id/like` - Like/unlike a doodle
- `POST /api/drawings/:id/rate` - Rate a doodle
- `GET /api/drawings/featured` - Get featured doodles
- `GET /api/drawings/trending` - Get trending doodles

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- VisualVerse backend and frontend setup

### Database Setup

1. **Seed Sample Challenges**
   ```bash
   cd backend
   npm run seed
   ```
   This will create 15 sample DSA challenges across different categories and difficulty levels.

2. **Verify Seeding**
   ```bash
   # Check MongoDB for challenges
   mongo visualverse
   db.challenges.find().count()
   ```

### Frontend Integration

1. **Navigate to Challenges**
   - Go to `/challenges` in your app
   - Or click "Take a Challenge" from the dashboard

2. **Complete a Challenge**
   - Browse available challenges
   - Select a challenge to view details
   - Click "Start Drawing Challenge"
   - Use the drawing canvas to create your visualization
   - Submit with title, description, and tags

3. **View Gallery**
   - Click "View Gallery" from challenge details
   - Browse all submissions for that challenge
   - Like and rate other users' doodles

## 🎨 Challenge Categories

### Data Structures
- **Binary Trees**: Visualize tree structures and traversals
- **Linked Lists**: Show node connections and operations
- **Stacks & Queues**: Demonstrate LIFO and FIFO principles
- **Hash Tables**: Illustrate collision resolution

### Algorithms
- **Sorting**: Bubble sort, merge sort, quick sort visualizations
- **Searching**: Binary search, linear search processes
- **Graph Algorithms**: DFS, BFS, Dijkstra's algorithm
- **Dynamic Programming**: Fibonacci, memoization tables

### Advanced Topics
- **AVL Trees**: Self-balancing tree rotations
- **String Matching**: KMP algorithm visualization
- **Heap Operations**: Max/min heap structures

## 📊 Challenge Statistics

Each challenge tracks:
- **Total Submissions**: Number of doodles submitted
- **Average Rating**: Community rating of submissions
- **Completion Times**: How long users take to complete
- **Popularity**: Based on likes and engagement

## 🔧 Customization

### Adding New Challenges

1. **Create Challenge Object**
   ```javascript
   const newChallenge = {
     title: "Your Challenge Title",
     prompt: "Draw the structure for...",
     description: "Detailed instructions...",
     category: "data-structures",
     difficulty: "beginner",
     tags: ["tag1", "tag2"],
     points: 20,
     timeLimit: 30
   };
   ```

2. **Add to Database**
   ```javascript
   const challenge = new Challenge(newChallenge);
   await challenge.save();
   ```

### Custom Categories

Add new categories in `backend/models/Challenge.js`:
```javascript
enum: {
  values: ['data-structures', 'algorithms', 'graphs', 'trees', 'arrays', 'strings', 'dynamic-programming', 'sorting', 'searching', 'your-category'],
  message: 'Invalid category'
}
```

## 🎯 User Experience Flow

1. **Discovery**: Users browse challenges by category, difficulty, or search
2. **Selection**: Choose a challenge and read the prompt
3. **Creation**: Use the drawing canvas to create visualization
4. **Submission**: Add metadata and submit doodle
5. **Community**: View gallery, like, and rate other submissions
6. **Progress**: Track completed challenges and earned points

## 🔒 Security & Validation

### Input Validation
- Challenge submissions require authentication
- Image data validation and size limits
- Title and description length restrictions
- Tag validation and sanitization

### Rate Limiting
- API endpoints protected with rate limiting
- One submission per user per challenge
- Like/rating limits to prevent abuse

### Data Protection
- User authentication required for submissions
- Public/private doodle visibility controls
- Secure image data handling

## 📱 Responsive Design

The challenge system is fully responsive:
- **Desktop**: Full-featured drawing canvas with all tools
- **Tablet**: Touch-optimized drawing interface
- **Mobile**: Simplified interface with essential features

## 🧪 Testing

### Backend Testing
```bash
# Test challenge endpoints
curl http://localhost:5000/api/challenges

# Test doodle submission
curl -X POST http://localhost:5000/api/challenges/[id]/submit \
  -H "Authorization: Bearer [token]" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","imageData":"data:image/png;base64,..."}'
```

### Frontend Testing
- Challenge list rendering
- Drawing canvas functionality
- Submission form validation
- Gallery display and interactions

## 🚀 Performance Optimizations

### Database
- Indexed queries for efficient challenge and doodle retrieval
- Pagination for large datasets
- Aggregation pipelines for statistics

### Frontend
- Lazy loading of challenge images
- Debounced search and filter inputs
- Optimized canvas rendering
- Efficient state management

## 🔮 Future Enhancements

### Planned Features
- **Collaborative Drawing**: Real-time multi-user drawing
- **Challenge Templates**: Pre-made challenge templates
- **Achievement System**: Badges and milestones
- **Leaderboards**: User rankings and competitions
- **AI Integration**: Smart challenge recommendations

### Advanced Features
- **Video Tutorials**: Step-by-step drawing guides
- **Code Integration**: Link drawings to actual code
- **Export Options**: SVG, PDF, and animation exports
- **Mobile App**: Native iOS and Android apps

## 📄 API Documentation

For detailed API documentation, see the individual route files:
- `backend/routes/challenges.js` - Challenge endpoints
- `backend/routes/drawings.js` - Doodle endpoints

## 🤝 Contributing

When contributing to the challenge system:

1. **Follow Code Style**: Use existing patterns and conventions
2. **Add Tests**: Include tests for new features
3. **Update Documentation**: Document API changes
4. **Test Responsiveness**: Ensure mobile compatibility
5. **Validate Inputs**: Add proper validation for new endpoints

## 📞 Support

For issues or questions about the challenge system:

- Check the main VisualVerse documentation
- Review the API endpoint files
- Open an issue in the project repository
- Contact the development team

---

**Built with ❤️ for the VisualVerse DSA learning community**
