import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FriendsPage = () => {
  const [activeTab, setActiveTab] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('access_token');

   
    axios.get('http://127.0.0.1:8000/friendship/friends/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    })
    .then(response => {
      setFriends(response.data);
    })
    .catch(error => {
      console.error('Error fetching friends:', error);
    });
    axios.get('http://127.0.0.1:8000/friendship/requests/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    })
    .then(response => {
      setFriendRequests(response.data);
    })
    .catch(error => {
      console.error('Error fetching friend requests:', error);
    });
  }, []);

  const handleAccept = (request) => {
    const token = localStorage.getItem('access_token');
    const { from_user: { username } } = request;

    axios.post('http://127.0.0.1:8000/friendship/respond-request/', 
      
      { from_user: username ,
        action: 'accepted'
      }, 
      
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    )
    .then(response => {
      setFriendRequests(prevRequests => prevRequests.filter(req => req.from_user.username !== username));
      const newFriend = {
        username: request.username,
        email: request.email,
        profile: {
          bio: request.profile.bio,
          rating: request.profile.rating,
          profile_picture: request.profile.profile_picture,
        },
        since: request.since,
        is_email_verified: request.is_email_verified,
      };
      setFriends(prevFriends => [...prevFriends, newFriend]);
    })
    .catch(error => {
      console.error('Error accepting friend request:', error);
    });
  };

  const handleReject = (username) => {
    const token = localStorage.getItem('access_token');
    axios.post('http://127.0.0.1:8000/friendship/respond-request/', {
      from_user: username,
      action:'rejected'
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    })
    .then(response => {
      setFriendRequests(prevRequests => prevRequests.filter(request => request.username !== username));
    })
    .catch(error => {
      console.error('Error rejecting friend request:', error);
    });
  };

  const handleSearch = () => {
    const token = localStorage.getItem('access_token');
    axios.get(`http://127.0.0.1:8000/friendship/users/search/?query=${searchQuery}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    })
    .then(response => {
      setSearchResults(response.data);
    })
    .catch(error => {
      console.error('Error searching users:', error);
    });
  };

  const handleSendRequest = (username) => {
    const token = localStorage.getItem('access_token');
    axios.post('http://127.0.0.1:8000/friendship/send-request/', {
      username: username,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    })
    .then(response => {
      console.log('Friend request sent:', response.data);
      setSearchResults(prevResults => prevResults.filter(result => result.username !== username));
    })
    .catch(error => {
      console.error('Error sending friend request:', error);
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center" style={{ backgroundColor: 'transparent' }}>
      <div className="w-full max-w-4xl p-8" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
        
        <div className="flex justify-between mb-8">
          <button 
            onClick={() => setActiveTab('friends')} 
            className={`text-2xl font-bold pb-2 ${activeTab === 'friends' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-700'}`}
          >
            Friends
          </button>
          <button 
            onClick={() => setActiveTab('requests')} 
            className={`text-2xl font-bold pb-2 ${activeTab === 'requests' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-700'}`}
          >
            Friend Requests
          </button>
          <button 
            onClick={() => setActiveTab('search')} 
            className={`text-2xl font-bold pb-2 ${activeTab === 'search' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-700'}`}
          >
            Search Users
          </button>
        </div>

       
        {activeTab === 'friends' && (
          <div className="mb-12">
            {friends.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {friends.map((friend, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex justify-center items-center overflow-hidden">
                      {friend.profile.profile_picture ? (
                        <img src={`http://127.0.0.1:8000${friend.profile.profile_picture}`} alt={friend.username} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-white text-sm">No Image</span>
                      )}
                    </div>
                    <span>{friend.username}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600">No friends</p>
            )}
          </div>
        )}

        
        {activeTab === 'requests' && (
          <div>
            {friendRequests.length > 0 ? (
              friendRequests.map((request, index) => (
                <div key={index} className="bg-white p-4 rounded-lg shadow-lg mb-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gray-300 flex justify-center items-center overflow-hidden">
                        {request.from_user.profile.profile_picture ? (
                          <img src={`http://127.0.0.1:8000${request.from_user.profile.profile_picture}`} alt={request.username} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white text-sm">No Image</span>
                        )}
                      </div>
                      <span>{request.username}</span>
                    </div>
                    <div className="space-x-2">
                      <button 
                        onClick={() => handleAccept(request)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 focus:outline-none"
                      >
                        Accept
                      </button>
                      <button 
                        onClick={() => handleReject(request.username)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 focus:outline-none"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600">No friend requests</p>
            )}
          </div>
        )}

        
        {activeTab === 'search' && (
          <div>
            <div className="mb-4">
              <input 
                type="text" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                placeholder="Search for users..." 
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-blue-500"
              />
              <button 
                onClick={handleSearch} 
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
              >
                Search
              </button>
            </div>
            <div>
              {searchResults.length > 0 ? (
                searchResults.map((user, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg shadow-lg mb-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-gray-300 flex justify-center items-center overflow-hidden">
                          {user.profile.profile_picture ? (
                            <img src={`http://127.0.0.1:8000${user.profile.profile_picture}`} alt={user.username} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-white text-sm">No Image</span>
                          )}
                        </div>
                        <span>{user.username}</span>
                      </div>
                      <button 
                        onClick={() => handleSendRequest(user.username)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 focus:outline-none"
                      >
                        Send Request
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-600">No users found</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;
