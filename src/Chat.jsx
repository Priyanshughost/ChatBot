import React, { useState, useEffect, useRef } from "react";
import Sub from "/src/Sub";
import Response from "/src/Response";
import User from "/src/User";
import axios from "axios";

const YOUTUBE_API_KEY = "AIzaSyAgAdQJyB38N_Re6zN5pgNXQu3HJYml6IA"; // Replace with your actual API key
const YOUTUBE_BASE_URL = "https://www.googleapis.com/youtube/v3/search";

function Chat() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sources, setSources] = useState([]);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const searchYouTube = async (query) => {
    if (!query) return;
    try {
      const response = await axios.get(YOUTUBE_BASE_URL, {
        params: {
          q: query,
          part: "snippet",
          type: "video",
          maxResults: 5,
          key: YOUTUBE_API_KEY,
        },
      });

      const videoLinks = response.data.items.map(
        (video) => `https://www.youtube.com/watch?v=${video.id.videoId}`
      );
      console.log("YouTube Video Links:", videoLinks);
    } catch (error) {
      console.error("Error fetching YouTube data:", error);
    }
  };

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
      const botReply = data.answer || "I couldn't find an answer. Try a different question.";

      const newChatHistory = [...chatHistory, { user: message, bot: '' }];
      setChatHistory(newChatHistory);

      setSources(data.results || []);

      if (data.results.length > 0) {
        const queryForYouTube = data.results[0].title;
        console.log("Searching YouTube for:", queryForYouTube);
        searchYouTube(queryForYouTube);
      }

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
      }, 30);

      setMessage("");
    } catch (error) {
      console.error("API Error:", error);
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
              <Sub title="Maths" />
              <Sub title="Science" />
              <Sub title="History" />
              <Sub title="Computer Science" />
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
                sources.map((source, idx) => (
                  <Sub key={idx} title={source.title} url={source.url} />
                ))
              ) : (
                <p>No recommended resources yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
