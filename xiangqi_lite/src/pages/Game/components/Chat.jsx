import React, { useState, useContext } from 'react';
import { BoardContext } from 'pages/Game/BoardPage';

const Chat = () => {
    const { wsManagerRef, updateChatMessages, chatMessages, setChatMessages } = useContext(BoardContext);
    const [message, setMessage] = useState('');

    const handleSendMessage = () => {
        if (message.trim()) {
            const chatMessage = {
                type: 'game.chat',
                message,
                timestamp: new Date().toISOString(),
                username: 'You', 
                isSent: 'sent'
            };
            try {
                wsManagerRef.current.sendMessage(JSON.stringify(chatMessage));
                updateChatMessages(chatMessage);
                setMessage('');
            } catch (error) {
                console.error('Failed to send message:', error);
            }
        }
    };

    return (
        <div className="chat-container">
            <div className="messages-container">
                {chatMessages.map((msg, index) => (
                    <div key={index} className={`message ${msg.isSent=='sent' ? 'sent' : 'received'}`}>
                        <strong>{msg.username || 'Unknown User'}</strong>: {msg.message || 'No message provided'}
                        <div className="timestamp">
                            {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'No timestamp'}
                        </div>
                    </div>
                ))}
            </div>
            <div className="input-container">
                <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message"
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
}    

export default Chat;
