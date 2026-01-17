# Learning Management System (LMS)

A scalable online learning platform for college students and teachers built with React.js, Express.js, and MongoDB.

## Features

### For Students
- Student registration and login
- Browse and enroll in available courses
- Access learning materials (files, links, text)
- View enrolled courses
- Download course materials

### For Teachers
- Teacher registration and login
- Create and manage courses
- Upload learning materials (files, links, text)
- View enrolled students
- Delete courses and materials

## Tech Stack

- **Frontend**: React.js 18, React Router, Axios
- **Backend**: Express.js, Node.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer

## Project Structure

```
lms/
├── backend/
│   ├── models/          # MongoDB models (User, Course, Material)
│   ├── routes/          # API routes (auth, courses, materials)
│   ├── middleware/      # Authentication middleware
│   ├── uploads/         # Uploaded files (created automatically)
│   ├── server.js        # Express server
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # Auth context
│   │   ├── pages/       # Page components
│   │   ├── utils/       # API utilities
│   │   └── App.js
│   └── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lms
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
```

4. Start the backend server:
```bash
npm run dev
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register/student` - Register a new student
- `POST /api/auth/register/teacher` - Register a new teacher
- `POST /api/auth/login` - Login (requires role in body)
- `GET /api/auth/me` - Get current user (protected)

### Courses
- `GET /api/courses` - Get all courses for current user (protected)
- `GET /api/courses/available` - Get all available courses (student only)
- `GET /api/courses/:id` - Get single course (protected)
- `POST /api/courses` - Create course (teacher only)
- `PUT /api/courses/:id` - Update course (teacher only)
- `DELETE /api/courses/:id` - Delete course (teacher only)
- `POST /api/courses/:id/enroll` - Enroll in course (student only)

### Materials
- `GET /api/materials/course/:courseId` - Get all materials for a course (protected)
- `GET /api/materials/:id` - Get single material (protected)
- `POST /api/materials` - Create material with file upload (teacher only)
- `PUT /api/materials/:id` - Update material (teacher only)
- `DELETE /api/materials/:id` - Delete material (teacher only)

## Usage

1. Start MongoDB (if running locally)
2. Start the backend server
3. Start the frontend development server
4. Open `http://localhost:3000` in your browser
5. Register as a student or teacher
6. Login and start using the platform

## Scalability Features

- **Modular Architecture**: Separated concerns with models, routes, and middleware
- **Authentication Middleware**: Reusable protection for routes
- **Role-Based Access Control**: Different permissions for students and teachers
- **File Upload Handling**: Secure file storage with Multer
- **Error Handling**: Comprehensive error handling throughout the API
- **RESTful API**: Clean, standardized API design
- **Environment Variables**: Configuration through .env files

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Protected routes with middleware
- Role-based authorization
- File upload validation

## Future Enhancements

- Student assignments and submissions
- Grades and assessments
- Discussion forums
- Notifications
- Search functionality
- Pagination for courses and materials
- User profiles
- Email notifications

## License

MIT

