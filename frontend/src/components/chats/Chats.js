import React, { useState, useEffect } from "react";
import "../../css/style.css";
import { AddChats, getAllChats, getLoggedInUser } from "../../Db.js";

const Chats = () => {
  const [loggedInUser, setLoggedInUser] = useState({});
  const [chatData, setChatData] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    getLoggedInUser().then(responseData => {
      setLoggedInUser(responseData?.user);
      fetchChatData();
    })
  }, [])

  const fetchChatData = async() => {
    try {
      if(loggedInUser){
        const results = await getAllChats();
        if(results){
          setChatData(results);
        }else{
          setChatData([]);
        }
      } 
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSend = async() => {
    if (message.trim() === "") {
      setError("Please enter a message");
      return;
    }

    const dateObj = new Date();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const year = dateObj.getFullYear();
    const dateTime = `${day}-${month}-${year} ${dateObj.toLocaleTimeString()}`;

    const newMessage = {
      username: loggedInUser.name,
      userid: loggedInUser.id,
      message: message
    };

    const result = await AddChats(newMessage);
    if(result){
      fetchChatData();
      setError("");
      setMessage("");
    }else{
      setError(result.message);
    }
    // const updatedChatData = [...chatData, newMessage];
    // localStorage.setItem("chatData", JSON.stringify(updatedChatData));
    // setChatData(updatedChatData);
    
  };

  const handleRefresh = () => {
    fetchChatData();
  };
  // React Fragments
  return (
    <>
      <div className="container-fluid mt-4">
        <h3 className="text-center">Group Chat</h3>
        <hr />
        <ul className="list-group mb-3 chat-list">
          {chatData.map((data, index) => (
            <li
              key={index}
              className={`message-list ${
                data.userid === loggedInUser.id ? "text-right" : "text-left"
              }`}
            >
              <span>
                [{data.datetime}] {data.username}:
              </span>{" "}
              <span>{data.message}</span>
            </li>
          ))}
        </ul>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text">
              <b>
                <span>{loggedInUser.name}</span>
              </b>{" "}
            </span>
          </div>
          <input
            type="text"
            className="form-control chat_box"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="message-buttons">
          <button
            className="btn btn-primary"
            id="send-btn"
            onClick={handleSend}
          >
            Send
          </button>
          <button
            className="btn btn-secondary"
            id="refresh-btn"
            onClick={handleRefresh}
          >
            Refresh
          </button>
          </div>
        </div>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
      </div>
    </>
  );
};

export default Chats;
