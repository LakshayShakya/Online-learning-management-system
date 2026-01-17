const express = require('express');
const Course = require('../models/Course');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all courses (for students and teachers)
router.get('/', protect, async (req, res) => {
  try {
    let courses;
    
    if (req.user.role === 'teacher') {
      courses = await Course.find({ teacher: req.user._id })
        .populate('teacher', 'name email')
        .populate('enrolledStudents', 'name email studentId');
    } else {
      courses = await Course.find({ enrolledStudents: req.user._id })
        .populate('teacher', 'name email')
        .populate('enrolledStudents', 'name email studentId');
    }

    res.json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
});

// Get all available courses (for students to enroll)
router.get('/available', protect, authorize('student'), async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('teacher', 'name email department')
      .select('-enrolledStudents');

    res.json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching available courses', error: error.message });
  }
});

// Create course (teacher only)
router.post('/', protect, authorize('teacher'), async (req, res) => {
  try {
    const { title, description, code } = req.body;

    const course = await Course.create({
      title,
      description,
      code: code.toUpperCase(),
      teacher: req.user._id,
      enrolledStudents: []
    });

    const populatedCourse = await Course.findById(course._id)
      .populate('teacher', 'name email');

    res.status(201).json({
      success: true,
      data: populatedCourse
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating course', error: error.message });
  }
});

// Get single course
router.get('/:id', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('teacher', 'name email department')
      .populate('enrolledStudents', 'name email studentId');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course', error: error.message });
  }
});

// Update course (teacher only)
router.put('/:id', protect, authorize('teacher'), async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this course' });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('teacher', 'name email');

    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating course', error: error.message });
  }
});

// Delete course (teacher only)
router.delete('/:id', protect, authorize('teacher'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    await course.deleteOne();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting course', error: error.message });
  }
});

// Enroll in course (student only)
router.post('/:id/enroll', protect, authorize('student'), async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.enrolledStudents.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    course.enrolledStudents.push(req.user._id);
    await course.save();

    const updatedCourse = await Course.findById(req.params.id)
      .populate('teacher', 'name email')
      .populate('enrolledStudents', 'name email studentId');

    res.json({
      success: true,
      data: updatedCourse
    });
  } catch (error) {
    res.status(500).json({ message: 'Error enrolling in course', error: error.message });
  }
});

module.exports = router;
