import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { mockCourses } from '../data/mockData';
import './Dashboard.css';

const TeacherDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: ''
  });
  const { user, logout, switchRole } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Use mock data - filter courses by teacher
    const teacherCourses = mockCourses.filter(course => course.teacher._id === user.id);
    setCourses(teacherCourses);
    setLoading(false);
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock course creation - add to local state
    const newCourse = {
      _id: Date.now().toString(),
      title: formData.title,
      code: formData.code.toUpperCase(),
      description: formData.description,
      teacher: {
        _id: user.id,
        name: user.name,
        email: user.email
      },
      enrolledStudents: [],
      createdAt: new Date().toISOString()
    };
    setCourses([...courses, newCourse]);
    setFormData({ title: '', description: '', code: '' });
    setShowForm(false);
    alert('Course created successfully! (Mock - changes not saved)');
  };

  const handleDelete = (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }
    setCourses(courses.filter(c => c._id !== courseId));
    alert('Course deleted successfully! (Mock - changes not saved)');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="container">
          <h1>Teacher Dashboard</h1>
          <div className="header-actions">
            <span className="welcome-text">Welcome, {user?.name}</span>
            <button onClick={() => switchRole('student')} className="btn btn-secondary" style={{ marginRight: '10px' }}>
              Switch to Student
            </button>
            <button onClick={logout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container">
        <div className="dashboard-actions">
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : '+ Create New Course'}
          </button>
        </div>

        {showForm && (
          <div className="card">
            <h2>Create New Course</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Course Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Course Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  required
                  placeholder="e.g., CS101"
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>
              <button type="submit" className="btn btn-success">
                Create Course
              </button>
            </form>
          </div>
        )}

        <div className="courses-grid">
          {courses.length === 0 ? (
            <div className="empty-state">
              <p>You haven't created any courses yet.</p>
              <p>Click "Create New Course" to get started.</p>
            </div>
          ) : (
            courses.map((course) => (
              <div key={course._id} className="course-card">
                <div className="course-header">
                  <h3>{course.title}</h3>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(course._id)}
                  >
                    Delete
                  </button>
                </div>
                <p className="course-code">{course.code}</p>
                <p className="course-description">{course.description}</p>
                <div className="course-meta">
                  <span>Students: {course.enrolledStudents?.length || 0}</span>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/course/${course._id}`)}
                >
                  Manage Course
                </button>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
