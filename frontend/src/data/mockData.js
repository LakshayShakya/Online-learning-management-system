// Mock data for offline use
export const mockStudent = {
  id: '1',
  name: 'John Student',
  email: 'student@example.com',
  role: 'student',
  studentId: 'STU001',
  department: 'Computer Science'
};

export const mockTeacher = {
  id: '2',
  name: 'Dr. Jane Teacher',
  email: 'teacher@example.com',
  role: 'teacher',
  department: 'Computer Science'
};

export const mockCourses = [
  {
    _id: '1',
    title: 'Introduction to Programming',
    code: 'CS101',
    description: 'Learn the fundamentals of programming with examples and practical exercises.',
    teacher: {
      _id: '2',
      name: 'Dr. Jane Teacher',
      email: 'teacher@example.com'
    },
    enrolledStudents: [
      { _id: '1', name: 'John Student', email: 'student@example.com', studentId: 'STU001' }
    ]
  },
  {
    _id: '2',
    title: 'Web Development Basics',
    code: 'CS102',
    description: 'Introduction to HTML, CSS, and JavaScript for building modern web applications.',
    teacher: {
      _id: '2',
      name: 'Dr. Jane Teacher',
      email: 'teacher@example.com'
    },
    enrolledStudents: []
  },
  {
    _id: '3',
    title: 'Database Management',
    code: 'CS201',
    description: 'Understanding databases, SQL, and data modeling concepts.',
    teacher: {
      _id: '2',
      name: 'Dr. Jane Teacher',
      email: 'teacher@example.com'
    },
    enrolledStudents: []
  }
];

export const mockMaterials = {
  '1': [
    {
      _id: '1',
      title: 'Course Syllabus',
      description: 'Overview of topics covered in this course, grading criteria, and important dates.',
      materialType: 'text',
      course: { _id: '1' },
      teacher: { _id: '2', name: 'Dr. Jane Teacher', email: 'teacher@example.com' },
      createdAt: new Date().toISOString()
    },
    {
      _id: '2',
      title: 'Introduction to Programming - Lecture 1',
      description: 'First lecture covering variables, data types, and basic operations.',
      materialType: 'text',
      course: { _id: '1' },
      teacher: { _id: '2', name: 'Dr. Jane Teacher', email: 'teacher@example.com' },
      createdAt: new Date().toISOString()
    },
    {
      _id: '3',
      title: 'Reference Book Link',
      description: 'Online resource for programming fundamentals',
      materialType: 'link',
      linkUrl: 'https://example.com/programming-book',
      course: { _id: '1' },
      teacher: { _id: '2', name: 'Dr. Jane Teacher', email: 'teacher@example.com' },
      createdAt: new Date().toISOString()
    }
  ],
  '2': [
    {
      _id: '4',
      title: 'HTML & CSS Basics',
      description: 'Introduction to HTML structure and CSS styling.',
      materialType: 'text',
      course: { _id: '2' },
      teacher: { _id: '2', name: 'Dr. Jane Teacher', email: 'teacher@example.com' },
      createdAt: new Date().toISOString()
    }
  ],
  '3': [
    {
      _id: '5',
      title: 'SQL Fundamentals',
      description: 'Learn SQL queries and database operations.',
      materialType: 'text',
      course: { _id: '3' },
      teacher: { _id: '2', name: 'Dr. Jane Teacher', email: 'teacher@example.com' },
      createdAt: new Date().toISOString()
    }
  ]
};

