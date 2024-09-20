import React, { useState, useContext, useEffect } from 'react';
import './chat.css'; 
import { BoardContext } from 'pages/Game';

const Chat = () => {
  const { 
    wsManagerRef, 
    updateChatMessages, 
    chatMessages, 
    users, 
    useridRef,
    gameIdRef
  } = useContext(BoardContext);
  
  const [message, setMessage] = useState('');

  const getFormattedDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  const [currentDate, setCurrentDate] = useState(getFormattedDate());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(getFormattedDate());
    }, 60000);
    return () => clearInterval(intervalId);
  }, []);

  // useEffect(() => {
  //   const fetchMessages = async () => {
  //     const token = localStorage.getItem('access_token');
  //     if (!token) {
  //       console.error('No access token found in localStorage.');
  //       return;
  //     }

  //     if (!gameIdRef.current) {
  //       console.error('No game ID found.');
  //       return;
  //     }

  //     try {

  //       const url = new URL('http://127.0.0.1:8000/game/messages/');
  //       url.searchParams.append('room_name', gameIdRef.current);

  //       const response = await fetch(url.toString(), {
  //         method: 'GET',
  //         headers: {
  //           'Authorization': `Bearer ${token}`,
  //           'Content-Type': 'application/json'
  //         }
  //       });

  //       if (!response.ok) {
  //         throw new Error(`Error fetching messages: ${response.status} ${response.statusText}`);
  //       }

  //       const data = await response.json();
  //       data.messages.forEach(msg => {
  //         const formattedMessage = {
  //           type: 'game.chat',
  //           message: msg.message,
  //           timestamp: msg.timestamp,
  //           user_id: msg.user_id,
  //           isSent: msg.user_id === useridRef.current ? 'sent' : 'received'
  //         };
  //         updateChatMessages(formattedMessage);
  //       });
  //     } catch (error) {
  //       console.error('Failed to fetch messages:', error);
  //     }
  //   };

  //   fetchMessages();
  // }, [gameIdRef]);

  // Handler for sending messages
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
      // Update chat messages by appending the new message
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
          
          return (
            <div 
              key={index} 
              className={`message ${msg.isSent === 'sent' ? 'sent' : 'received'}`}
            >
              <img
                src={user ? `http://127.0.0.1:8000${user.profile_picture}` : 'default_profile.png'}
                alt="User Profile"
                className="profile-picture"
              />
              <div className="message-contents">
                <div className="message-info">
                  <strong className="username">
                    {user ? user.username : 'Unknown User'}
                  </strong>
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
