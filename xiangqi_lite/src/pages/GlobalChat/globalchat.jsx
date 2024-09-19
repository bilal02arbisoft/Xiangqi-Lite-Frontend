
import axios from 'axios';
import React, { useEffect, useRef } from 'react';
import useState from 'react-usestateref';

import './globalchat.css';

import singletonWebSocketManager from 'utils/WebSocket';

const GlobalChat = () => {
    const getFormattedDate = () => {
        const options = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date().toLocaleDateString('en-US', options);
    };

    const [, setMessages, LatestMessages] = useState([]);
    const [, setProfiles, LatestProfiles] = useState({});
    const [inputMessage, setInputMessage] = useState('');
    const [currentDate] = useState(getFormattedDate());
    const [lastId, setLastId] = useState(null);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const isFetchingRef = useRef(false);
    const wsManagerRef = useRef(null);

    const fetchUserProfiles = async (userIds) => {
        if (userIds.length === 0) return;

        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.post(
                'http://127.0.0.1:8000/api/details/',
                {
                    user_ids: userIds 
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            const { profiles } = response.data;

            const profilesMap = {};
            profiles.forEach((profile) => {
                const { user_id, username, profile_picture } = profile;
                console.log("Profile",profile)
                profilesMap[user_id] = { username, profile_picture };
            });

            setProfiles((prevProfiles) => ({
                ...prevProfiles,
                ...profilesMap,
            }));
        } catch (error) {
            console.error('Error fetching profiles:', error);
        }
    };

    const fetchMessages = async (loadMore = false) => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;

        try {
            const params = { room_name: 'global_chat' };
            if (loadMore && lastId) {
                params.last_id = lastId;
            }
            const token = localStorage.getItem('access_token');
            const response = await axios.get('http://127.0.0.1:8000/game/messages/', {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: params
            });
            const newMessages = response.data.messages;
            if (newMessages.length === 0) {
                setHasMoreMessages(false);
            } else {
                const userIds = newMessages
                    .map((msg) => msg.user_id)
                    .filter((id, index, self) => id && self.indexOf(id) === index);

               
                const profilesToFetch = userIds.filter((id) => !LatestProfiles.current[id]);
                await fetchUserProfiles(profilesToFetch);
                const updatedMessages = loadMore
                    ? [...newMessages, ...LatestMessages.current]
                    : [...LatestMessages.current, ...newMessages];
                updatedMessages.sort((a, b) => a.id - b.id);

                setMessages(updatedMessages);

                const oldestMessage = updatedMessages[0];
                setLastId(oldestMessage.id);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            isFetchingRef.current = false;
        }
    };

    const handleWebSocketMessage = async (data) => {
        if (data.type === 'chat.message') {
            const message = data.message;
            setMessages((prevMessages) => [...prevMessages, data]);

            if (!LatestProfiles.current[data.user_id]) {
              
                await fetchUserProfiles([data.user_id]);
            }
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
       
        fetchMessages();
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

    const renderMessages = () => {
        return LatestMessages.current.map((message) => {
            const profile = LatestProfiles.current[message.user_id];

            return (
                <div key={message.id} className="message">
                    <img
                        src={profile ? `http://127.0.0.1:8000${profile.profile_picture}` : 'default_profile.png'}
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
                {hasMoreMessages && (
                    <button onClick={() => fetchMessages(true)} className="load-more-button">
                        Load More
                    </button>
                )}
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
