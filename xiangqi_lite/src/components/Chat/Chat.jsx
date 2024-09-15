import React, { useState, useContext, useEffect } from 'react';

import './chat.css'; 

import { BoardContext } from 'pages/Game';

const Chat = () => {
  const { wsManagerRef, updateChatMessages, chatMessages, users, useridRef } = useContext(BoardContext);
  const [message, setMessage] = useState('');

  const getFormattedDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  const [currentDate, setCurrentDate] = useState(getFormattedDate());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(getFormattedDate());
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const handleSendMessage = (event) => {
    if (event.key === 'Enter' && message.trim()) {
      event.preventDefault();
      const chatMessage = {
        type: 'game.chat',
        message,
        timestamp: new Date().toISOString(),
        user_id: useridRef.current,
        isSent: 'sent'
      };
      updateChatMessages(chatMessage);
      try {
        wsManagerRef.current.sendMessage(JSON.stringify(chatMessage));
        setMessage('');
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  return (
    <div className="chat-container">
      <div className="date-header">{currentDate}</div>
      <div className="messages-container">
        {chatMessages.map((msg, index) => {
          const user = users[msg.user_id];
          console.log("its user", user);

          return (
            <div key={index} className={`message ${msg.isSent === 'sent' ? 'sent' : 'received'}`}>
              <img
                src={user ? `http://127.0.0.1:8000${user.profile_picture}` : 'default_profile.png'}
                alt="User Profile"
                className="profile-picture"
              />
              <div className="message-contents">
                <div className="message-info">
                  <strong className="username">{user ? user.username : 'Unknown User'}</strong>
                  <p className="message-texts">{msg.message}</p>
                </div>
               
              </div>
              <div className="timestamp">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
            </div>
          );
        })}
      </div>
      <div className="input-container">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleSendMessage}
          placeholder="Message (or /help)"
          rows="1"
        />
      </div>
    </div>
  );
};

export default Chat;
