import React, { useEffect, useRef } from 'react';
import useState from 'react-usestateref';
import singletonWebSocketManager from 'utils/WebSocket';
import PlayerCard from 'components/PlayerCard'; 
import './globalchat.css';  
import axios from 'axios';

const GlobalChat = () => {
    const [, setMessages, LatestMessages] = useState([]);  
    const [, setProfiles, LatestProfiles ] = useState({});  
    const [inputMessage, setInputMessage] = useState('');  
    const wsManagerRef = useRef(null);  

    
    const handleWebSocketMessage = (data) => {
        if (data.type === 'chat.message') {
            console.log("Sving messages", data)
           
            setMessages((prevMessages) => [...prevMessages, data]);
        } else if (data.type === 'chat.userprofile') {
           
            const { user_id, username, profile_picture } = data.message;
            setProfiles((prevProfiles) => ({
                ...prevProfiles,
                [user_id]: { username, profile_picture: profile_picture },
            }));
         console.log("message recieved",data.message)
         console.log("Profile here",LatestProfiles.current)
         console.log("User id",user_id)
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
            const response = await axios.get(`http://127.0.0.1:8000/api/details/${user_id}/`,
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
            console.log("Profiles so far",LatestProfiles.current)
            const profile = LatestProfiles.current[message.user_id]; 
            if (!profile) {
                fetchUserProfile(message.user_id).then(fetchedProfile => {
                    if (fetchedProfile) {
                        setMessages([...LatestMessages.current]);
                        
                    }
                });
            }
            console.log("Profile details:",LatestProfiles.current)
            return (
                <div key={index} className="chat-message-container">
                    {profile && <PlayerCard player={profile} />}
                    <div className="message-content">
                        <div className="message-text">{message.message}</div>
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="global-chat-container">
            <header className="chat-header">Global Chat</header>

            <div className="chat-window">
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
