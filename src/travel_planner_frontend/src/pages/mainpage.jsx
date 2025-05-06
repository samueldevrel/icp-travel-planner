import React, { useState } from "react";
import { travel_planner_backend } from "declarations/travel_planner_backend";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Markdown from "react-markdown";
import { useAuth } from "../components/authetication";
import Button from "../components/signup";
import { GoogleGenAI } from "@google/genai";
import { Ai } from "../ai/gemini";

const MainPage = () => {
  const [activeTab, setActiveTab] = useState("search");
  const [user, setUser] = useState("");
  const [userdata, setUserData] = useState([]);
  const [res, setResponse] = useState("");
  const [isloading, setIsLoading] = useState(false);
  const { isAuthenticated, login, principal, logout } = useAuth();
  travel_planner_backend.getAllHistory().then((result) => {
    setUserData(result[0].history);
  });

  travel_planner_backend.registeruser().then((result) => {});

  const handleSubmmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const prompt = `You are a travel expert. Answer the following question with detailed and helpful advice, providing recommendations, tips, and insights tailored to the context and preferences described. Be informative, engaging, and practical.${user}`;

 
    try {
      const ai = new GoogleGenerativeAI(
        process.env.API_KEY
      );
      const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(prompt);
      const response = result.response;

      if (!response) {
        
        return;
      }
      const text = response.text();
      setResponse(text);

      //update users history
      await travel_planner_backend
        .enter_user_search(user, text)
        .then((result) => {
          console.log("result", result);
        });

      //get users history

      const usershistory = await travel_planner_backend
        .getAllHistory()
        .then((result) => {
         
        });
      setUserData(usershistory[0].history);
    } finally {
      setIsLoading(false); // stop loading
    }
  };

  //function to handle history clearing

  const handleHistoryClearing = async () => {
    try {
      await travel_planner_backend.clear_history().then((result) => {});

      //get users history

      const usershistory = await travel_planner_backend
        .getAllHistory()
        .then((result) => {});
      setUserData(usershistory[0].history);
    } catch (err) {
      console.log("clear history", err);
    }
    setResponse("");
    setUser("");
  };
  return (
    <div className="main-container">
      <header className="main-header">
        <div className="logo">Travel AI</div>
        <Button />
      </header>
      {isAuthenticated ? (
        <div className="main-content">
          <nav className="side-navigation">
            <button
              className={`nav-button ${
                activeTab === "history" ? "active" : ""
              }`}
            >
              History
            </button>

            <div className="">
              {userdata.length == 0 ? (
                <>
                  <p className="">no history</p>
                </>
              ) : (
                <div className="">
                  {userdata.map((val, index) => (
                    <p
                      key={index}
                      className="history-item dc"
                      onClick={() => setResponse(val.response)}
                    >
                      {val.request}
                    </p>
                  ))}

                  <button className="" onClick={handleHistoryClearing}>
                    clear all
                  </button>
                </div>
              )}
            </div>
          </nav>

          <div className="content-area">
            {activeTab === "search" && (
              <div className="search-tab">
                <h2>Ask a Travel Question</h2>

                <p className="">
                  <Markdown>{res}</Markdown>
                </p>
                <form action="" onSubmit={handleSubmmit}>
                  <input
                    type="text"
                    disabled={isloading}
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    placeholder="Type your question here..."
                    className="search-input"
                  />
                  <button
                    className="search-button"
                    type="submit"
                    disabled={isloading}
                  >
                    Submit
                  </button>
                </form>
              </div>
            )}
            {activeTab === "history" && (
              <div className="history-tab">
                <h2>Search History</h2>
                <p>No history available.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="no">please log in to continue</div>
      )}
    </div>
  );
};

export default MainPage;
