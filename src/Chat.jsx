import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Function to send message to Groq API
  const sendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "mixtral-8x7b-32768", // Ensure this model is supported
          messages: [{ role: "user", content: message }],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (!res.ok) {
        throw new Error(`API Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      const botReply = data.choices[0].message.content;

      setChatHistory([...chatHistory, { user: message, bot: botReply }]);
      setMessage(""); // Clear input field
    } catch (error) {
      console.error("API Error:", error);
    }

    setLoading(false);
  };

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
            <div className="chat">
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
              <Sub />
              <Sub />
              <Sub />
              <Sub />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
