import { Link, useNavigate } from 'react-router-dom';
import React, { useEffect, useRef } from 'react';

import './home.css'; 

import singletonWebSocketManager from 'utils/WebSocket';
import Sidebar from 'components/SideBar';


const Home = () => {
    const wsManagerRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        
        wsManagerRef.current = singletonWebSocketManager.getInstance(
            'ws://localhost:8000/ws/game/', 
            token
        ); 
        wsManagerRef.current.connect();
        
  
        return () => {
            if (wsManagerRef.current) {
       
            }
        };
    }, []); 

    const handleLogout = async () => {
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');

        try {
            const response = await fetch('http://localhost:8000/api/auth/logout/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    access_token: accessToken,
                    refresh_token: refreshToken,
                }),
            });

            if (response.ok) {
                // Logout successful
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                navigate('/auth/login');
            } else {
                // Handle errors (e.g., display a message)
                const errorData = await response.json();
                console.error('Logout failed:', errorData);
                alert('Logout failed. Please try again.');
            }
        } catch (error) {
            console.error('An error occurred during logout:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <div className="home-container">
             <div className='sidebar'>
                <Sidebar></Sidebar>
                </div>
          
            <main className="main-content">
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
            </main>
        </div>
    );
}

export default Home;
