import { useEffect, useState } from 'react';
import './App.css'
import Chat from '/src/Chat.jsx'
import Home from '/src/Home.jsx'
function App() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isChatVisible, setIsChatVisible] = useState(false);
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="container">
      <div
        className="ball"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      ></div>
      {isChatVisible ? (
        <Chat />
      ) : (
        <Home onGetStarted={() => setIsChatVisible(true)} />
      )}
    </div>
  )
}

export default App
