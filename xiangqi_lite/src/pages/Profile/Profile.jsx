import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

const ProfileEditPage = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [rating, setRating] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [country, setCountry] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [skillLevel, setSkillLevel] = useState('');
  const [message, setMessage] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [originalData, setOriginalData] = useState({});
  const [friends, setFriends] = useState([]); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      axios.get('http://127.0.0.1:8000/api/profile/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
        .then(response => {
          const profileData = response.data;
          setEmail(profileData.email);
          setUsername(profileData.username);
          setIsEmailVerified(profileData.is_email_verified);
          setBio(profileData.profile.bio);
          setRating(profileData.profile.rating);
          setProfilePicture(profileData.profile.profile_picture);
          setCountry(profileData.profile.country);
          setSkillLevel(profileData.profile.skill_level);
          setProfilePictureUrl(profileData.profile.profile_picture ? `http://127.0.0.1:8000${profileData.profile.profile_picture}` : '');
          setOriginalData({
            username: profileData.username,
            bio: profileData.profile.bio,
            rating: profileData.profile.rating,
            country: profileData.profile.country,
            skill_level: profileData.profile.skill_level,
            profile_picture: profileData.profile.profile_picture,
          });
        })
        .catch(error => {
          console.error('Error fetching profile:', error);
        });

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
    } else {
      console.error('No token found, cannot authenticate the request');
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setProfilePictureUrl(URL.createObjectURL(file));
    }
  };

  const handleRequestOtp = () => {
    const token = localStorage.getItem('access_token');
    axios.post('http://127.0.0.1:8000/api/requestotp/', {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    })
      .then(response => {
        console.log('OTP sent successfully');
        window.location.href = '/verify-otp';
      })
      .catch(error => {
        console.error('Error requesting OTP:', error);
      });
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    if (username !== originalData.username) formData.append('username', username);
    if (bio !== originalData.bio) formData.append('profile.bio', bio);
    if (rating !== originalData.rating) formData.append('profile.rating', rating);
    if (country !== originalData.country) formData.append('profile.country', country);
    if (skillLevel !== originalData.skill_level) formData.append('profile.skill_level', skillLevel);

    if (profilePicture && profilePicture !== originalData.profile_picture) {
      formData.append('profile.profile_picture', profilePicture, profilePicture.name);
    }

    const token = localStorage.getItem('access_token');
    axios.put('http://127.0.0.1:8000/api/profile/', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    })
      .then(response => {
        setMessage(response.data.message);
        const updatedProfile = response.data.Profile;
        setOriginalData({
          username: updatedProfile.username,
          bio: updatedProfile.profile.bio || '',
          rating: updatedProfile.profile.rating || '',
          country: updatedProfile.profile.country || '',
          skill_level: updatedProfile.profile.skill_level || '',
          profile_picture: updatedProfile.profile.profile_picture || '',
        });
        setProfilePictureUrl(updatedProfile.profile.profile_picture ? `http://127.0.0.1:8000${updatedProfile.profile.profile_picture}` : '');
      })
      .catch(error => {
        console.error('Error updating profile:', error);
        setMessage('Error updating profile. Please try again.');
      });
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      const token = localStorage.getItem('access_token');
      axios.delete('http://127.0.0.1:8000/api/delete/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      })
        .then(response => {
          console.log('Account deleted successfully:', response.data);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          navigate('/auth/signup');
        })
        .catch(error => {
          console.error('Error deleting account:', error);
        });
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center ">
      <div className=" p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <div className="flex items-center mb-6">
          <div className="w-24 h-24 rounded-full flex justify-center items-center text-4xl text-white overflow-hidden">
            {profilePictureUrl ? (
              <img src={profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span>No Profile Picture</span>
            )}
          </div>
          <div className="ml-6">
            <h2 className="text-2xl font-semibold">{username}</h2>
            <p className="text-gray-500">Rating: {rating}</p>
            <input 
              type="file" 
              id="profile_picture" 
              accept="image/png, image/jpeg" 
              onChange={handleImageChange} 
              className="mt-2" 
            />
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Profile</h3>
          {isEmailVerified ? (
            <p className="text-green-500 mb-2">Your email is verified.</p>
          ) : (
            <p className="text-red-500 mb-2">
              This email is not verified.{' '}
              <a href="#" onClick={handleRequestOtp} className="text-blue-600 underline">
                Verify!
              </a>
            </p>
          )}
          <input 
            type="email" 
            name="email" 
            value={email} 
            disabled
            className="w-full p-2 mb-4 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none"
          />
          <input 
            type="text" 
            name="username" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 mb-4 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none"
          />

          <select 
            name="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full p-2 mb-4 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none"
          >
            <option>Pakistan</option>
            <option>USA</option>
            <option>Other</option>
          </select>
          
          <textarea 
            name="bio"
            placeholder="Bio" 
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-2 mb-4 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none"
            rows="5"
          />
          <select 
            name="skill_level"
            value={skillLevel}
            onChange={(e) => setSkillLevel(e.target.value)}
            className="w-full p-2 mb-4 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none"
          >
            <option value="newbie">Newbie</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>
        </div>

        <div className="mb-8">
  <h3 className="text-xl font-bold mb-4">Friends</h3>
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
          <div>
            <span>{friend.username}</span>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <p>You have no friends yet.</p>
  )}
</div>
<div className="flex justify-between mt-8">
  <button 
    onClick={handleSaveChanges}
    className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none mr-4"
  >
    Save Changes
  </button>
  <button 
    onClick={handleDeleteAccount}
    className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 focus:outline-none ml-4"
  >
    Delete Account
  </button>
</div>
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default ProfileEditPage;
