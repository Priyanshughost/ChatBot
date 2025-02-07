import React, { useState, useEffect, useRef } from "react";
import Sub from "/src/Sub";
import Response from "/src/Response";
import User from "/src/User";

function Chat() {
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sources, setSources] = useState([]);
  const chatContainerRef = useRef(null);

  // Function to send message to Tavily API
  const sendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: {
          'Authorization': 'Bearer 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',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: message,
          include_answer: "basic",
          search_depth: "basic",
          max_results: 5
        }),
      });

      if (!res.ok) {
        throw new Error(`API Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      console.log("Tavily API Response:", data); // Logs full API response

      const extractedSources = data.results?.map(result => result.url) || [];
      console.log("Extracted Sources:", extractedSources); // Logs extracted URLs

      setSources(extractedSources);
      setChatHistory(prev => [...prev, { user: message, bot: data.answer || "No answer found." }]);
      setMessage(""); 
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  return (
    <div className="interface">
      <div className="bot">
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
      </div>
    </div>
  );
}

export default Chat;
