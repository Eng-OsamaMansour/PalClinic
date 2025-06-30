import React from 'react';
import './UnderDevelopment.css';
import constructionImage from '../../assets/under_construction.svg';

function UnderDevelopment() {
  return (
    <div className="under-construction">
      <img src={constructionImage} alt="Under Construction" />
      <h1>Coming Soon</h1>
      <p>We’re working hard to launch this page. Stay tuned!</p>
      <div className="spinner"></div>
    </div>
  );
}

export default UnderDevelopment;
