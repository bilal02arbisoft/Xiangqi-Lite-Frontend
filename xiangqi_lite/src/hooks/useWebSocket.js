class WebSocketManager {
    constructor(url, token, onOpenCallback, onMessageCallback, onCloseCallback, onErrorCallback) {
      this.url = `${url}?token=${token}`;
      this.onOpenCallback = onOpenCallback;
      this.onMessageCallback = onMessageCallback;
      this.onCloseCallback = onCloseCallback;
      this.onErrorCallback = onErrorCallback;
      this.ws = null;
      this.isConnected = false;
      this.error = null;
    }
  
    connect() {
      if (this.ws && this.ws.readyState !== WebSocket.CLOSED) {
        return; // Prevents multiple connections
      }
  
      this.ws = new WebSocket(this.url);
  
      this.ws.onopen = () => {
        console.log('WebSocket connection opened');
        this.isConnected = true;
        if (this.onOpenCallback) this.onOpenCallback(this.ws);
      };
  
      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (this.onMessageCallback) this.onMessageCallback(data);
      };
  
      this.ws.onclose = () => {
        console.log('WebSocket connection closed');
        this.isConnected = false;
        this.ws = null;
        if (this.onCloseCallback) this.onCloseCallback();
      };
  
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.error = 'WebSocket connection error';
        if (this.onErrorCallback) this.onErrorCallback(error);
      };
    }
  
    sendMessage(message) {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(message);
      } else {
        console.error('WebSocket is not open.');
      }
    }
  
    closeConnection() {
      if (this.ws) {
        this.ws.close();
      }
    }
  }
  
  export default WebSocketManager;
  