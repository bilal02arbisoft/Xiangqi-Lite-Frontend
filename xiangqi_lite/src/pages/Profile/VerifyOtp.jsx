import React, { useState } from 'react';

import axios from 'axios';

import { useNavigate } from 'react-router-dom';

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    axios
      .post(
        "http://127.0.0.1:8000/api/verifyotp/",
        { otp },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        },
      )
      .then((response) => {
        setMessage("Email verified successfully!");

        navigate("/profile");
      })
      .catch((error) => {
        setMessage("Error verifying OTP. Please try again.");
        console.error("Error verifying OTP:", error);
      });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-semibold mb-4">Enter OTP</h2>
        <form onSubmit={handleOtpSubmit}>
          <input
            type="text"
            name="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full p-2 mb-4 bg-gray-100 rounded-lg border border-gray-300 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
          >
            Verify OTP
          </button>
        </form>
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default VerifyOtpPage;
