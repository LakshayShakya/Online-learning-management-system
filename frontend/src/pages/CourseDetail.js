import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { mockCourses, mockMaterials } from '../data/mockData';
import './CourseDetail.css';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMaterialForm, setShowMaterialForm] = useState(false);
  const [materialForm, setMaterialForm] = useState({
    title: '',
    description: '',
    linkUrl: '',
    materialType: 'text',
    file: null
  });

  useEffect(() => {
    // Use mock data instead of API calls
    const foundCourse = mockCourses.find(c => c._id === id);
    if (foundCourse) {
      setCourse(foundCourse);
      setMaterials(mockMaterials[id] || []);
    } else {
      alert('Course not found');
      navigate(user?.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard');
    }
    setLoading(false);
  }, [id, navigate, user]);

  const handleMaterialSubmit = (e) => {
    e.preventDefault();
    // Mock material creation - add to local state
    const newMaterial = {
      _id: Date.now().toString(),
      title: materialForm.title,
      description: materialForm.description,
      course: { _id: id },
      teacher: { _id: user.id, name: user.name, email: user.email },
      linkUrl: materialForm.linkUrl || null,
      materialType: materialForm.materialType || 'text',
      createdAt: new Date().toISOString()
    };
    setMaterials([...materials, newMaterial]);
    setMaterialForm({
      title: '',
      description: '',
      linkUrl: '',
      materialType: 'text',
      file: null
    });
    setShowMaterialForm(false);
    alert('Material added successfully! (Mock - changes not saved)');
  };

  const handleDeleteMaterial = (materialId) => {
    if (!window.confirm('Are you sure you want to delete this material?')) {
      return;
    }
    setMaterials(materials.filter(m => m._id !== materialId));
    alert('Material deleted successfully! (Mock - changes not saved)');
  };

  const getFileUrl = (fileUrl) => {
    if (fileUrl && fileUrl.startsWith('http')) return fileUrl;
    return fileUrl ? `http://localhost:5000${fileUrl}` : '#';
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!course) {
    return <div className="error">Course not found</div>;
  }

  const isTeacher = user?.role === 'teacher';

  return (
    <div className="course-detail">
      <header className="course-header">
        <div className="container">
          <button onClick={() => navigate(-1)} className="btn btn-secondary">
            ← Back
          </button>
          <h1>{course.title}</h1>
          <p className="course-code">{course.code}</p>
          <p className="course-description">{course.description}</p>
        </div>
      </header>

      <main className="container">
        {isTeacher && (
          <div className="material-actions">
            <button
              className="btn btn-primary"
              onClick={() => setShowMaterialForm(!showMaterialForm)}
            >
              {showMaterialForm ? 'Cancel' : '+ Add Material'}
            </button>
          </div>
        )}

        {showMaterialForm && isTeacher && (
          <div className="card">
            <h2>Add New Material</h2>
            <form onSubmit={handleMaterialSubmit}>
              <div className="form-group">
                <label>Material Type</label>
                <select
                  value={materialForm.materialType}
                  onChange={(e) =>
                    setMaterialForm({ ...materialForm, materialType: e.target.value })
                  }
                >
                  <option value="text">Text</option>
                  <option value="file">File</option>
                  <option value="link">Link</option>
                </select>
              </div>

              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={materialForm.title}
                  onChange={(e) =>
                    setMaterialForm({ ...materialForm, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={materialForm.description}
                  onChange={(e) =>
                    setMaterialForm({ ...materialForm, description: e.target.value })
                  }
                />
              </div>

              {materialForm.materialType === 'file' && (
                <div className="form-group">
                  <label>Upload File</label>
                  <input
                    type="file"
                    onChange={(e) =>
                      setMaterialForm({ ...materialForm, file: e.target.files[0] })
                    }
                    disabled
                  />
                  <small style={{ color: '#666' }}>(File upload disabled in mock mode)</small>
                </div>
              )}

              {materialForm.materialType === 'link' && (
                <div className="form-group">
                  <label>Link URL</label>
                  <input
                    type="url"
                    value={materialForm.linkUrl}
                    onChange={(e) =>
                      setMaterialForm({ ...materialForm, linkUrl: e.target.value })
                    }
                    required
                    placeholder="https://example.com"
                  />
                </div>
              )}

              <button type="submit" className="btn btn-success">
                Add Material
              </button>
            </form>
          </div>
        )}

        <div className="materials-section">
          <h2>Learning Materials ({materials.length})</h2>
          {materials.length === 0 ? (
            <div className="empty-state">
              <p>No materials available yet.</p>
              {isTeacher && <p>Add materials to help your students learn.</p>}
            </div>
          ) : (
            <div className="materials-list">
              {materials.map((material) => (
                <div key={material._id} className="material-card">
                  <div className="material-header">
                    <h3>{material.title}</h3>
                    {isTeacher && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteMaterial(material._id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  {material.description && (
                    <p className="material-description">{material.description}</p>
                  )}
                  <div className="material-content">
                    {material.materialType === 'file' && material.fileUrl && (
                      <a
                        href={getFileUrl(material.fileUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                      >
                        📎 Download {material.fileName || 'File'}
                      </a>
                    )}
                    {material.materialType === 'link' && material.linkUrl && (
                      <a
                        href={material.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                      >
                        🔗 Open Link
                      </a>
                    )}
                    {material.materialType === 'text' && (
                      <div className="material-text">
                        <p>{material.description || 'No content available'}</p>
                      </div>
                    )}
                  </div>
                  <p className="material-date">
                    Added: {new Date(material.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CourseDetail;
