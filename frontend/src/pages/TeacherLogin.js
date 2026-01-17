import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Login.css';

const TeacherLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');

  const { login, register, switchRole } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isRegister) {
        await register({ name, email, password, department }, 'teacher');
      } else {
        // Mock login - just switch to teacher role
        await switchRole('teacher');
        await login(email, password, 'teacher');
      }
      navigate('/teacher/dashboard');
    } catch (err) {
      setError('An error occurred');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Teacher {isRegister ? 'Register' : 'Login'}</h1>
        <p className="subtitle">Manage your courses and materials</p>
        <p style={{ fontSize: '12px', color: '#999', textAlign: 'center', marginBottom: '20px' }}>
          (No backend required - click login to continue)
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            {isRegister ? 'Register' : 'Login'}
          </button>
        </form>

        <p className="toggle-text">
          {isRegister ? 'Already have an account? ' : "Don't have an account? "}
          <button
            type="button"
            className="link-btn"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
          >
            {isRegister ? 'Login' : 'Register'}
          </button>
        </p>

        <div className="divider">
          <span>or</span>
        </div>

        <Link to="/login/student" className="link-btn">
          Are you a Student? Login here
        </Link>
      </div>
    </div>
  );
};

export default TeacherLogin;
