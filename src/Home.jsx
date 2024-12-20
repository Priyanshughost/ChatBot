import React from 'react';

function Home({ onGetStarted }) {
  return (
    <div className="home">
      <img className="logo2" src="/logo2.png" alt="" />
      <button className="get" onClick={onGetStarted}>
        Get Started
      </button>
    </div>
  );
}

export default Home;
