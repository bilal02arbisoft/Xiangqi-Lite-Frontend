import { Link } from 'react-router-dom';
import React,{ useEffect, useRef } from 'react';

import './home.css'; 

import singletonWebSocketManager from 'utils/WebSocket';

const Home =  () =>  {
    const wsManagerRef = useRef();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        
        wsManagerRef.current = singletonWebSocketManager.getInstance(
            'ws://localhost:8000/ws/game/', 
            token
        );
        
        wsManagerRef.current.connect();
        
    }, []); 

    return (
        <div className="home-container">
            <header className="header">
                <h1>Welcome to Xiangqi.com!</h1>
            </header>
            <div className="button-container">
                <Link to="/game" className="action-button">
                    <img
                        src="https://d2g1zxtf4l76di.cloudfront.net/images/new-ui/play-online.svg"
                        alt="play-game-icon"
                        className="icon"
                    />
                    Play Game
                </Link>

                <Link to="/globalchat" className="action-button">
                    <img
                        src="https://d2g1zxtf4l76di.cloudfront.net/images/new-ui/chat-icon-sm.svg"
                        alt="chat-icon"
                        className="icon"
                    />
                    Global Chat
                </Link>

                <Link to="/friend" className="action-button">
                    <img
                        src="image.png"
                        alt="friendship-icon"
                        className="icon"
                    />
                    Friendship Management
                </Link>
            </div>
        </div>
    );
}

export default Home;
