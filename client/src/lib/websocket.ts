import { MarketData, TradingPair } from "@shared/schema";

type WebSocketMessageHandler = (event: MessageEvent) => void;
type WebSocketStatusHandler = () => void;

// Message types
export type WebSocketMessage = 
  | { type: 'marketData', data: MarketData }
  | { type: 'marketUpdate', pair: string, data: MarketData }
  | { type: 'tradingPairs', data: TradingPair[] }
  | { type: 'error', message: string };

// Client messages
export type ClientMessage = 
  | { type: 'subscribe', pair: string }
  | { type: 'unsubscribe', pair: string };

class WebSocketService {
  private socket: WebSocket | null = null;
  private messageListeners: WebSocketMessageHandler[] = [];
  private connectListeners: WebSocketStatusHandler[] = [];
  private disconnectListeners: WebSocketStatusHandler[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 2000;
  private reconnectTimeoutId: NodeJS.Timeout | null = null;
  private messageQueue: ClientMessage[] = [];
  private isConnecting: boolean = false;

  connect() {
    if (this.socket?.readyState === WebSocket.OPEN || this.isConnecting) {
      return;
    }

    this.isConnecting = true;

    try {
      // Create WebSocket connection
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      // For development in Replit, use direct port
      const wsUrl = `${protocol}//${window.location.hostname}:5000/ws`;
      
      console.log(`Connecting to WebSocket at ${wsUrl}`);
      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log('WebSocket connected successfully');
        this.reconnectAttempts = 0;
        this.isConnecting = false;
        this.notifyConnectListeners();
        
        // Process any queued messages
        this.processMessageQueue();
      };

      this.socket.onmessage = (event) => {
        this.notifyMessageListeners(event);
      };

      this.socket.onclose = () => {
        console.log('WebSocket connection closed');
        this.isConnecting = false;
        this.notifyDisconnectListeners();
        this.attemptReconnect();
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error occurred:', error);
        this.isConnecting = false;
        // The socket will automatically close after an error
      };
    } catch (error) {
      console.error('Error establishing WebSocket connection:', error);
      this.isConnecting = false;
      this.attemptReconnect();
    }
  }

  disconnect() {
    if (this.reconnectTimeoutId) {
      clearTimeout(this.reconnectTimeoutId);
      this.reconnectTimeoutId = null;
    }

    if (this.socket) {
      console.log('Disconnecting WebSocket');
      this.socket.close();
      this.socket = null;
    }
    
    this.isConnecting = false;
  }

  subscribe(pair: string) {
    console.log(`Subscribing to market data for ${pair}`);
    this.sendMessage({
      type: 'subscribe',
      pair
    });
  }

  unsubscribe(pair: string) {
    console.log(`Unsubscribing from market data for ${pair}`);
    this.sendMessage({
      type: 'unsubscribe',
      pair
    });
  }

  sendMessage(message: ClientMessage) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      console.log('Sending WebSocket message:', message);
      this.socket.send(JSON.stringify(message));
    } else {
      console.log('WebSocket not connected. Queueing message:', message);
      this.messageQueue.push(message);
      // Attempt to connect if not already connecting
      this.connect();
    }
  }

  private processMessageQueue() {
    console.log(`Processing message queue (${this.messageQueue.length} messages)`);
    while (this.messageQueue.length > 0 && this.socket?.readyState === WebSocket.OPEN) {
      const message = this.messageQueue.shift();
      if (message) {
        console.log('Sending queued message:', message);
        this.socket.send(JSON.stringify(message));
      }
    }
  }

  onMessage(listener: WebSocketMessageHandler) {
    this.messageListeners.push(listener);
    return () => {
      this.messageListeners = this.messageListeners.filter(l => l !== listener);
    };
  }

  onConnect(listener: WebSocketStatusHandler) {
    this.connectListeners.push(listener);
    
    // If already connected, call the listener immediately
    if (this.isConnected()) {
      try {
        listener();
      } catch (error) {
        console.error('Error in immediate WebSocket connect listener:', error);
      }
    }
    
    return () => {
      this.connectListeners = this.connectListeners.filter(l => l !== listener);
    };
  }

  onDisconnect(listener: WebSocketStatusHandler) {
    this.disconnectListeners.push(listener);
    return () => {
      this.disconnectListeners = this.disconnectListeners.filter(l => l !== listener);
    };
  }

  private notifyMessageListeners(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data);
      console.log('Received WebSocket message:', data);
      
      this.messageListeners.forEach(listener => {
        try {
          listener(event);
        } catch (error) {
          console.error('Error in WebSocket message listener:', error);
        }
      });
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  private notifyConnectListeners() {
    this.connectListeners.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.error('Error in WebSocket connect listener:', error);
      }
    });
  }

  private notifyDisconnectListeners() {
    this.disconnectListeners.forEach(listener => {
      try {
        listener();
      } catch (error) {
        console.error('Error in WebSocket disconnect listener:', error);
      }
    });
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Maximum reconnect attempts reached. Giving up reconnection.');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1);
    
    console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    this.reconnectTimeoutId = setTimeout(() => {
      this.connect();
    }, delay);
  }

  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}

// Create singleton instance
export const webSocketService = new WebSocketService();
