import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import AuthButton from "../auth/authbutton";
import { travel_planner_backend } from "declarations/travel_planner_backend";
import { useQueryCall, useUpdateCall } from "@ic-reactor/react";
import { useAuth } from "../auth/authetication";
const MainPage = () => {
  const [activeTab, setActiveTab] = useState("search");
  const [user, setUser] = useState("");
  const [res, setResponse] = useState("");
  const { isAuthenticated, login, principal, logout } = useAuth();
  const genAi = new GoogleGenerativeAI(
    ""
  );
  travel_planner_backend.registeruser().then((result) => {});

  const { data: count, refetch } = useQueryCall({
    functionName: "getAllHistory",
  });
  console.log("count", count);

  const prompt = `You are a travel expert. Answer the following question with detailed and helpful advice, providing recommendations, tips, and insights tailored to the context and preferences described. Be informative, engaging, and practical.${user} should be less than 300 words`;
  
  const handleSubmmit = async (e) => {
    e.preventDefault();
    const model = genAi.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    setResponse(text);
    travel_planner_backend.enter_user_search("data","there").then((result) => {
      console.log("result",result)
    });

  };
  return (
    <div className="main-container">
      <header className="main-header">
        <div className="logo">Travel AI</div>
        <AuthButton />
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
            {/* 
             <div className="">
    
               {
                count.length==1?(
                  <>
                    <p className="">no history</p>
                  </>
                ):(
                  <div className=""></div>
                )
              }
             </div> */}
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
