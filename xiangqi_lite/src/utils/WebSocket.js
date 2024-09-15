import ReconnectingWebSocket from 'reconnecting-websocket';

class WebSocketManager {
  constructor(url, token) {
    if (WebSocketManager.instance) {
      return WebSocketManager.instance;
    }

    this.url = `${url}?token=${token}`;
    this.ws = null;
    this.isConnected = false;
    this.error = null;

    this.openListeners = [];
    this.messageListeners = [];
    this.closeListeners = [];
    this.errorListeners = [];

    WebSocketManager.instance = this;
  }

  connect() {
    if (this.ws && this.ws.readyState !== WebSocket.CLOSED) {
        console.log("returning from here")
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
      // Call each open listener, passing the WebSocket object to the callback
      this.openListeners.forEach((callback) => callback(this.ws));
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.messageListeners.forEach((callback) => callback(data));
    };

    this.ws.onclose = () => {
      console.log('WebSocket connection closed');
      this.isConnected = false;
      this.ws = null;
      this.closeListeners.forEach((callback) => callback());
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.error = 'WebSocket connection error';
      this.errorListeners.forEach((callback) => callback(error));
    };
  }

  addOpenListener(callback) {
    this.openListeners.push(callback);
  }

  addMessageListener(callback) {
    this.messageListeners.push(callback);
  }

  addCloseListener(callback) {
    this.closeListeners.push(callback);
  }

  addErrorListener(callback) {
    this.errorListeners.push(callback);
  }

  removeOpenListener(callback) {
    this.openListeners = this.openListeners.filter((listener) => listener !== callback);
  }

  removeMessageListener(callback) {
    this.messageListeners = this.messageListeners.filter((listener) => listener !== callback);
  }

  removeCloseListener(callback) {
    this.closeListeners = this.closeListeners.filter((listener) => listener !== callback);
  }

  removeErrorListener(callback) {
    this.errorListeners = this.errorListeners.filter((listener) => listener !== callback);
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
    getInstance: function (url, token) {
      if (!instance) {
        instance = new WebSocketManager(url, token);
        console.log("Created")
      }
      return instance;
    },
  };
})();

export default singletonWebSocketManager;
