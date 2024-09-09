import ReconnectingWebSocket from 'reconnecting-websocket';

class WebSocketManager {
  constructor(url, token, onOpenCallback, onMessageCallback, onCloseCallback, onErrorCallback) {
      if (WebSocketManager.instance) {
          return WebSocketManager.instance;
      }

      this.url = `${url}?token=${token}`;
      this.onOpenCallback = onOpenCallback;
      this.onMessageCallback = onMessageCallback;
      this.onCloseCallback = onCloseCallback;
      this.onErrorCallback = onErrorCallback;
      this.ws = null;
      this.isConnected = false;
      this.error = null;

      WebSocketManager.instance = this;
  }

  connect() {
      if (this.ws && this.ws.readyState !== WebSocket.CLOSED) {
          return;
      }

      const options = {
          automaticOpen: true, 
          reconnectInterval: 1000,  
          maxReconnectAttempts: 10,  
          connectionTimeout: 4000,  
      };

      this.ws = new ReconnectingWebSocket(this.url, [], options);

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
  
  const singletonWebSocketManager = (function () {
    let instance;
  
    return {
      getInstance: function (url, token, onOpenCallback, onMessageCallback, onCloseCallback, onErrorCallback) {
        if (!instance) {
          instance = new WebSocketManager(url, token, onOpenCallback, onMessageCallback, onCloseCallback, onErrorCallback);
        }
        return instance;
      }
    };
  })();
  
  export default singletonWebSocketManager;
  