const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Material = require('../models/Material');
const Course = require('../models/Course');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/materials';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Get all materials for a course
router.get('/course/:courseId', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if user has access to this course
    if (req.user.role === 'student' && !course.enrolledStudents.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not enrolled in this course' });
    }

    if (req.user.role === 'teacher' && course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view materials for this course' });
    }

    const materials = await Material.find({ course: req.params.courseId })
      .populate('teacher', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: materials.length,
      data: materials
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching materials', error: error.message });
  }
});

// Get single material
router.get('/:id', protect, async (req, res) => {
  try {
    const material = await Material.findById(req.params.id)
      .populate('course')
      .populate('teacher', 'name email');

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    const course = await Course.findById(material.course._id);

    // Check access
    if (req.user.role === 'student' && !course.enrolledStudents.includes(req.user._id)) {
      return res.status(403).json({ message: 'Not enrolled in this course' });
    }

    if (req.user.role === 'teacher' && course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({
      success: true,
      data: material
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching material', error: error.message });
  }
});

// Create material (teacher only) - with file upload
router.post('/', protect, authorize('teacher'), upload.single('file'), async (req, res) => {
  try {
    const { title, description, courseId, linkUrl, materialType } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to add materials to this course' });
    }

    let fileUrl = null;
    let fileName = null;
    let fileType = null;

    if (req.file) {
      fileUrl = `/uploads/materials/${req.file.filename}`;
      fileName = req.file.originalname;
      fileType = req.file.mimetype;
    }

    const material = await Material.create({
      title,
      description,
      course: courseId,
      teacher: req.user._id,
      fileUrl,
      fileName,
      fileType,
      linkUrl: linkUrl || null,
      materialType: materialType || (req.file ? 'file' : (linkUrl ? 'link' : 'text'))
    });

    const populatedMaterial = await Material.findById(material._id)
      .populate('teacher', 'name email');

    res.status(201).json({
      success: true,
      data: populatedMaterial
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating material', error: error.message });
  }
});

// Update material (teacher only)
router.put('/:id', protect, authorize('teacher'), upload.single('file'), async (req, res) => {
  try {
    let material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    if (material.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this material' });
    }

    // Handle file update
    if (req.file) {
      // Delete old file if exists
      if (material.fileUrl) {
        const oldFilePath = path.join(__dirname, '..', material.fileUrl);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }

      material.fileUrl = `/uploads/materials/${req.file.filename}`;
      material.fileName = req.file.originalname;
      material.fileType = req.file.mimetype;
      material.materialType = 'file';
    }

    if (req.body.title) material.title = req.body.title;
    if (req.body.description !== undefined) material.description = req.body.description;
    if (req.body.linkUrl) {
      material.linkUrl = req.body.linkUrl;
      material.materialType = 'link';
    }

    await material.save();

    const updatedMaterial = await Material.findById(material._id)
      .populate('teacher', 'name email');

    res.json({
      success: true,
      data: updatedMaterial
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating material', error: error.message });
  }
});

// Delete material (teacher only)
router.delete('/:id', protect, authorize('teacher'), async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    if (material.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this material' });
    }

    // Delete file if exists
    if (material.fileUrl) {
      const filePath = path.join(__dirname, '..', material.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await material.deleteOne();

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting material', error: error.message });
  }
});

module.exports = router;
