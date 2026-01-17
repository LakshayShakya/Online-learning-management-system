const User = require('./models/User');
const Course = require('./models/Course');
const Material = require('./models/Material');
const mongoose = require('mongoose');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');

    console.log('Seeding database with sample users...');

    // Create sample student
    const student = await User.findOne({ email: 'student@example.com' });
    if (!student) {
      await User.create({
        name: 'John Student',
        email: 'student@example.com',
        password: 'student123',
        role: 'student',
        studentId: 'STU001',
        department: 'Computer Science'
      });
      console.log('✓ Student created: student@example.com / student123');
    } else {
      console.log('✓ Student already exists: student@example.com / student123');
    }

    // Create sample teacher
    const teacher = await User.findOne({ email: 'teacher@example.com' });
    if (!teacher) {
      const teacherUser = await User.create({
        name: 'Dr. Jane Teacher',
        email: 'teacher@example.com',
        password: 'teacher123',
        role: 'teacher',
        department: 'Computer Science'
      });
      console.log('✓ Teacher created: teacher@example.com / teacher123');

      // Create a sample course for the teacher
      const course = await Course.create({
        title: 'Introduction to Programming',
        code: 'CS101',
        description: 'Learn the fundamentals of programming with examples and practical exercises.',
        teacher: teacherUser._id,
        enrolledStudents: []
      });
      console.log('✓ Sample course created: CS101 - Introduction to Programming');

      // Create sample material for the course
      await Material.create({
        title: 'Course Syllabus',
        description: 'Overview of topics covered in this course, grading criteria, and important dates.',
        course: course._id,
        teacher: teacherUser._id,
        materialType: 'text'
      });
      console.log('✓ Sample material created: Course Syllabus');

    } else {
      console.log('✓ Teacher already exists: teacher@example.com / teacher123');
    }

    console.log('\n=== Sample Login Credentials ===');
    console.log('\nSTUDENT:');
    console.log('Email: student@example.com');
    console.log('Password: student123');
    console.log('\nTEACHER:');
    console.log('Email: teacher@example.com');
    console.log('Password: teacher123');
    console.log('\nDatabase seeding completed!');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
