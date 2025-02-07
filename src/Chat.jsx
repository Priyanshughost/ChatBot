import React, { useState, useEffect, useRef } from "react";
import Sub from "/src/Sub";
import Response from "/src/Response";
import User from "/src/User";

function Chat() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]); // Store chat messages
  const [loading, setLoading] = useState(false); // Loading state
  const [sources, setSources] = useState([]); // Store recommended sources
  const chatContainerRef = useRef(null); // Ref for scrolling

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Function to send message to Tavily API
  const sendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: {
          'Authorization': 'Bearer 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', // Tavily API key
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: message,
          include_answer: "basic", // Get a short LLM-generated answer
          search_depth: "basic",
          max_results: 5
        }),
      });

      if (!res.ok) {
        throw new Error(`API Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      const botReply = data.answer || "I couldn't find an answer. Try a different question.";

      // Extract only the URLs from the response and update sources
      const extractedSources = data.results?.map(result => result.url) || [];
      setSources(extractedSources);

      // Gradual typing effect for bot response
      const newChatHistory = [...chatHistory, { user: message, bot: '' }];
      setChatHistory(newChatHistory);

      let i = 0;
      const typingInterval = setInterval(() => {
        setChatHistory(prevHistory => {
          const updatedHistory = [...prevHistory];
          updatedHistory[updatedHistory.length - 1].bot = botReply.slice(0, i + 1);
          return updatedHistory;
        });
        i++;
        if (i === botReply.length) {
          clearInterval(typingInterval);
          setLoading(false);
        }
      }, 10); // Adjust typing speed here

      setMessage(""); // Clear input field
    } catch (error) {
      console.error("API Error:", error);
      setLoading(false);
    }
  };

  // Effect to automatically scroll to the bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="interface">
      <div className="top">
        <img
          src="https://raw.githubusercontent.com/Priyanshughost/ChatBot/main/src/logo2.png"
          alt="Chatbot Logo"
        />
      </div>
      <div className="bot">
        <div className="nav-btns">
          <img
            src="https://raw.githubusercontent.com/Priyanshughost/ChatBot/main/src/f-arrow.svg"
            alt="Show Left"
            onClick={() => setShowLeft(!showLeft)}
          />
          <img
            src="https://raw.githubusercontent.com/Priyanshughost/ChatBot/main/src/b-arrow.svg"
            alt="Show Right"
            onClick={() => setShowRight(!showRight)}
          />
        </div>
        <div className="main">
          <div
            className={`left ${showLeft ? "f-tX" : "f-t-X"} ${
              screenWidth > 670 ? "show" : "hide"
            }`}
          >
            <div className="title">
              <div className="t-left">
                <img
                  src="https://raw.githubusercontent.com/Priyanshughost/ChatBot/main/src/book.svg"
                  alt="Subjects"
                />
                <h3>Subjects</h3>
              </div>
            </div>
            <div className="list">
              <Sub />
              <Sub />
              <Sub />
              <Sub />
            </div>
          </div>
          <div className="mid">
            <div className="chat" ref={chatContainerRef}>
              {chatHistory.map((chat, index) => (
                <div key={index}>
                  <User message={chat.user} />
                  <Response message={chat.bot} />
                </div>
              ))}
            </div>
            <div className="mssg">
              <input
                type="text"
                placeholder="Ask Something"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />
              <img
                src="https://raw.githubusercontent.com/Priyanshughost/ChatBot/main/src/send.svg"
                alt="Send"
                onClick={sendMessage}
                style={{ cursor: "pointer", opacity: loading ? 0.5 : 1 }}
              />
            </div>
          </div>
          <div className={`right ${showRight ? "b-tX show" : "b-t-X hide"}`}>
            <div className="title">
              <div className="t-left">
                <img
                  src="https://raw.githubusercontent.com/Priyanshughost/ChatBot/main/src/rec.svg"
                  alt="Recommended"
                />
                <h3>Recommended Resources</h3>
              </div>
            </div>
            <div className="list">
              {sources.length > 0 ? (
                sources.map((source, idx) => source && <Sub key={idx} url={source} />)
              ) : (
                <p>Documentation links will be given here</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
