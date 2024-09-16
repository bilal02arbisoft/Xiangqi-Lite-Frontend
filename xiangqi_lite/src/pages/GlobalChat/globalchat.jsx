import axios from 'axios';
import React, { useEffect, useRef } from 'react';
import useState from 'react-usestateref';

import './globalchat.css';  

import singletonWebSocketManager from 'utils/WebSocket';

import config from 'config';

const GlobalChat = () => {
    const getFormattedDate = () => {
        const options = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date().toLocaleDateString('en-US', options);
      };

    const [, setMessages, LatestMessages] = useState([]);  
    const [, setProfiles, LatestProfiles ] = useState({});  
    const [inputMessage, setInputMessage] = useState('');  
    const wsManagerRef = useRef(null);  
    const [currentDate,] = useState(getFormattedDate());

    const handleWebSocketMessage = (data) => {
        if (data.type === 'chat.message') {
            setMessages((prevMessages) => [...prevMessages, data]);
        }
         else if (data.type === 'chat.userprofile') {
            const { user_id, username, profile_picture } = data.message;
            setProfiles((prevProfiles) => ({
                ...prevProfiles,
                [user_id]: { username, profile_picture: profile_picture },
            }));
        }
    };

    const sendMessage = () => {
        if (wsManagerRef.current && wsManagerRef.current.ws.readyState === WebSocket.OPEN && inputMessage.trim()) {
            const chatMessage = {
                type: 'chat.message',
                message: inputMessage.trim(),
            };
            wsManagerRef.current.sendMessage(JSON.stringify(chatMessage));  
            setInputMessage(''); 
        }
    };

    const handleWebSocketOpen = (ws) => {
        const chatJoinMessage = {
            type: 'chat.join',
        };
        ws.send(JSON.stringify(chatJoinMessage)); 
    };

    useEffect(() => {
        wsManagerRef.current = singletonWebSocketManager.getInstance();
        wsManagerRef.current.addMessageListener(handleWebSocketMessage);

        handleWebSocketOpen(wsManagerRef.current.ws);

        return () => {
            if (wsManagerRef.current) {
                wsManagerRef.current.removeMessageListener(handleWebSocketMessage);
                wsManagerRef.current.removeOpenListener(handleWebSocketOpen);
            }
        };
    }, []);

    const fetchUserProfile = async (user_id) => {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get(`${config.BACKEND_HTTP_URL}/api/details/${user_id}/`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            const profile = response.data;
            
            setProfiles((prevProfiles) => ({
                ...prevProfiles,
                [user_id]: profile,
            }));
            
            return profile;
        } catch (error) {
            console.error(`Error fetching profile for user ${user_id}:`, error);
            return null;
        }
    };

    const renderMessages = () => {
        return LatestMessages.current.map((message, index) => {
            const profile = LatestProfiles.current[message.user_id];
            if (!profile) {
                fetchUserProfile(message.user_id).then(fetchedProfile => {
                    if (fetchedProfile) {
                        setMessages([...LatestMessages.current]);
                    }
                });
            }
            return (
                <div key={index} className={`message`}>
                    <img
                        src={profile ? `${config.BACKEND_HTTP_URL}${profile.profile_picture}` : 'default_profile.png'}
                        alt="User Profile"
                        className="profile-picture"
                    />
                    <div className="message-contents">
                        <div className="message-info">
                            <strong className="username">{profile ? profile.username : 'Unknown User'}</strong>
                            <p className="message-texts">{message.message}</p>
                        </div>
                    </div>
                    <div className="timestamp">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
            );
        });
    };
    

    return (
        <div className="global-chat-container">
            <header className="chat-header">Global Chat</header>

            <div className="chat-window">
            <div className="date-header">{currentDate}</div>

                {renderMessages()}
            </div>

            <div className="chat-input-container">
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="chat-input"
                    maxLength={255}
                />
                <div className="chat-controls">
                    <span className="char-counter">{inputMessage.length}/255</span>
                    <button onClick={sendMessage} className="chat-send-button">Send</button>
                </div>
            </div>
        </div>
    );
};

export default GlobalChat;
