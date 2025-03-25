import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { travel_planner_backend } from "declarations/travel_planner_backend";

import { useAuth } from "../auth/authetication";
import AuthButton2 from "../auth/button2";
const MainPage = () => {
  const [activeTab, setActiveTab] = useState("search");
  const [user, setUser] = useState("");
  const [userdata, setUserData] = useState([]);
  const [res, setResponse] = useState("");
  const { isAuthenticated, login, principal, logout } = useAuth();
  travel_planner_backend.getAllHistory().then((result) => {
    setUserData(result[0].history);
  });

  const genAi = new GoogleGenerativeAI(
    process.env.API_KEY
  );
  travel_planner_backend.registeruser().then((result) => {});

  const prompt = `You are a travel expert. Answer the following question with detailed and helpful advice, providing recommendations, tips, and insights tailored to the context and preferences described. Be informative, engaging, and practical.${user}`;

  const handleSubmmit = async (e) => {
    e.preventDefault();

    //lets wrap the functionj in a try catch
    try {
      const model = genAi.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(prompt);
      const response = result.response;

      if (!response) {
        alert("failed");
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
          console.log("history", result);
        });
      setUserData(usershistory[0].history);
    } catch (err) {
      console.log(err, "error catch");
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
      setUser("")
  };
  return (
    <div className="main-container">
      <header className="main-header">
        <div className="logo">Travel AI</div>
        <AuthButton2 />
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

                <p className="">{res}</p>
                <form action="" onSubmit={handleSubmmit}>
                  <input
                    type="text"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    placeholder="Type your question here..."
                    className="search-input"
                  />
                  <button className="search-button" type="submit">
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
