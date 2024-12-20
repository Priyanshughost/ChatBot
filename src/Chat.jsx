import React, { useState, useEffect } from 'react'
import Sub from '/src/Sub'
import Response from '/src/Response'
import User from '/src/User'
function Chat() {

  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);

    // Add resize event listener
    window.addEventListener('resize', handleResize);

    // Clean up event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="interface">
      <div className="top">
        <img src="/src/logo2.png" alt="" />
      </div>
      <div className="bot">
        <div className="nav-btns">
        <img
            src="src/f-arrow.svg"
            alt="Show Left"
            onClick={() => setShowLeft(!showLeft)}
          />
          <img
            src="src/b-arrow.svg"
            alt="Show Right"
            onClick={() => setShowRight(!showRight)}
          />
        </div>
        <div className="main">
        <div className={`left ${showLeft ? "f-tX" : "f-t-X"} ${screenWidth > 670 ? "show" : "hide"}`}>
            <div className="title">
              <div className="t-left">
                <img src="src/book.svg" alt="" />
                <h3>Subjects</h3>
              </div>
              <img src="" alt="" />
            </div>
            <div className="list">
              <Sub />
              <Sub />
              <Sub />
              <Sub />
            </div>
          </div>
          <div className="mid">
            <div className="chat">
              <Response />
              <User />
            </div>
            <div className="mssg">
              <input type="text" placeholder='Ask Something' />
              <img src="/src/send.svg" alt="" />
            </div>
          </div>
          <div className={`right ${showRight ? "b-tX show" : "b-t-X hide"}`}>
            <div className="title">
              <div className="t-left">
                <img src="src/rec.svg" alt="" />
                <h3>Recommended Resources</h3>
              </div>
              <img src="" alt="" />
            </div>
            <div className="list">
              <Sub />
              <Sub />
              <Sub />
              <Sub />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat