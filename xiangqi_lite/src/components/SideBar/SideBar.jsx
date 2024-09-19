// src/components/Sidebar.jsx
import { Link, useNavigate } from 'react-router-dom';
import React from 'react';
import './SideBar.css'; // We'll create this CSS file next

const Sidebar = () => {
    const navigate = useNavigate();

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
        <aside className="sidebar">
            <div className="sidebar-content">
                <Link to="/profile" className="sidebar-button" aria-label="Profile">
                    Profile
                </Link>
                <button onClick={handleLogout} className="sidebar-button" aria-label="Logout">
                    Logout
                </button>
                <Link to="/" className="sidebar-button" aria-label="home">
                    Home
                </Link>
            </div>
        </aside>
    );
}

export default Sidebar;
