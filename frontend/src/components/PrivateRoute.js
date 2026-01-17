import React from 'react';

// Remove authentication requirement - allow all access
const PrivateRoute = ({ children }) => {
  return children;
};

export default PrivateRoute;
