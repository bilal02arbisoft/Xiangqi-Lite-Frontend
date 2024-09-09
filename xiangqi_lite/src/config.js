const config = {
  BACKEND_HTTP_URL:
    process.env.REACT_APP_BACKEND_HTTP_URL || "http://127.0.0.1:8000",
  BACKEND_WS_URL: process.env.REACT_APP_BACKEND_WS_URL || "ws://127.0.0.1:8000",
};

export default config;
