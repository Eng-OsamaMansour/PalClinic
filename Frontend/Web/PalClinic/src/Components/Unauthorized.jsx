import React from 'react';
import './Unauthorized.css';

function Unauthorized() {
  return (
    <div className="unauthorized-container">
      <div className="unauthorized-box">
        <h1>403</h1>
        <h2>Unauthorized Access</h2>
        <p>You don’t have permission to view this page.</p>
        <a href="/">Go Back Home</a>
      </div>
    </div>
  );
}

export default Unauthorized;