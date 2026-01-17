import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { mockCourses } from '../data/mockData';
import './Dashboard.css';

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAvailable, setShowAvailable] = useState(false);
  const { user, logout, switchRole } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Use mock data instead of API calls
    const enrolledCourses = mockCourses.filter(course => 
      course.enrolledStudents.some(student => student._id === user.id)
    );
    const available = mockCourses.filter(course => 
      !course.enrolledStudents.some(student => student._id === user.id)
    );
    
    setCourses(enrolledCourses);
    setAvailableCourses(available);
    setLoading(false);
  }, [user]);

  const handleEnroll = (courseId) => {
    // Mock enrollment - just move course from available to enrolled
    const course = availableCourses.find(c => c._id === courseId);
    if (course) {
      course.enrolledStudents.push({ _id: user.id, name: user.name, email: user.email, studentId: user.studentId });
      setCourses([...courses, course]);
      setAvailableCourses(availableCourses.filter(c => c._id !== courseId));
      alert('Successfully enrolled in course!');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="container">
          <h1>Student Dashboard</h1>
          <div className="header-actions">
            <span className="welcome-text">Welcome, {user?.name}</span>
            <button onClick={() => switchRole('teacher')} className="btn btn-secondary" style={{ marginRight: '10px' }}>
              Switch to Teacher
            </button>
            <button onClick={logout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container">
        <div className="dashboard-tabs">
          <button
            className={`tab-btn ${!showAvailable ? 'active' : ''}`}
            onClick={() => setShowAvailable(false)}
          >
            My Courses ({courses.length})
          </button>
          <button
            className={`tab-btn ${showAvailable ? 'active' : ''}`}
            onClick={() => setShowAvailable(true)}
          >
            Available Courses ({availableCourses.length})
          </button>
        </div>

        {!showAvailable ? (
          <div className="courses-grid">
            {courses.length === 0 ? (
              <div className="empty-state">
                <p>You are not enrolled in any courses yet.</p>
                <p>Browse available courses to enroll.</p>
              </div>
            ) : (
              courses.map((course) => (
                <div key={course._id} className="course-card" onClick={() => navigate(`/course/${course._id}`)}>
                  <h3>{course.title}</h3>
                  <p className="course-code">{course.code}</p>
                  <p className="course-description">{course.description}</p>
                  <p className="course-teacher">
                    Teacher: {course.teacher?.name || 'N/A'}
                  </p>
                  <div className="course-meta">
                    <span>Students: {course.enrolledStudents?.length || 0}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="courses-grid">
            {availableCourses.length === 0 ? (
              <div className="empty-state">
                <p>No available courses at the moment.</p>
              </div>
            ) : (
              availableCourses.map((course) => (
                <div key={course._id} className="course-card">
                  <h3>{course.title}</h3>
                  <p className="course-code">{course.code}</p>
                  <p className="course-description">{course.description}</p>
                  <p className="course-teacher">
                    Teacher: {course.teacher?.name || 'N/A'}
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEnroll(course._id)}
                  >
                    Enroll
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
