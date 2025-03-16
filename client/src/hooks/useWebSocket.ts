import { useEffect, useState, useCallback, useRef } from 'react';
import { webSocketService, WebSocketMessage } from '@/lib/websocket';
import { CandlestickData, MarketData, TradingPair } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

export function useWebSocket(pair?: string) {
  const [connected, setConnected] = useState(false);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [tradingPairs, setTradingPairs] = useState<TradingPair[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Keep track of the current pair for subscription
  const currentPairRef = useRef<string | undefined>(pair);
  
  // Connect WebSocket on component mount
  useEffect(() => {
    webSocketService.connect();
    
    const onConnect = () => {
      setConnected(true);
      setError(null);
      
      // Subscribe to pair if available
      if (currentPairRef.current) {
        webSocketService.subscribe(currentPairRef.current);
      }
    };
    
    const onDisconnect = () => {
      setConnected(false);
      toast({
        title: "Connection Lost",
        description: "Attempting to reconnect to market data...",
        variant: "destructive"
      });
    };
    
    const onMessage = (event: MessageEvent) => {
      try {
        // Skip processing if data is not provided or is not a string
        if (!event.data || typeof event.data !== 'string') {
          return;
        }
        
        let message: WebSocketMessage;
        try {
          message = JSON.parse(event.data) as WebSocketMessage;
          // Skip if message type is not recognized
          if (!message || !message.type) {
            return;
          }
        } catch (parseError) {
          // Silently ignore JSON parsing errors
          if (parseError instanceof SyntaxError) {
            console.debug('Received non-JSON message from WebSocket');
          } else {
            console.error('Error parsing WebSocket message:', parseError);
          }
          return;
        }
        
        switch (message.type) {
          case 'marketData':
            setMarketData(message.data);
            break;
            
          case 'marketUpdate':
            if (message.pair === currentPairRef.current) {
              setMarketData(message.data);
            }
            break;
            
          case 'tradingPairs':
            setTradingPairs(message.data);
            break;
            
          case 'error':
            setError(message.message);
            toast({
              title: "WebSocket Error",
              description: message.message,
              variant: "destructive"
            });
            break;
            
          default:
            console.warn('Unknown WebSocket message type:', message);
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    };
    
    // Register WebSocket event handlers
    const removeConnectListener = webSocketService.onConnect(onConnect);
    const removeDisconnectListener = webSocketService.onDisconnect(onDisconnect);
    const removeMessageListener = webSocketService.onMessage(onMessage);
    
    // Initial connection state
    setConnected(webSocketService.isConnected());
    
    // Cleanup on unmount
    return () => {
      removeConnectListener();
      removeDisconnectListener();
      removeMessageListener();
    };
  }, [toast]);
  
  // Subscribe to new pair when the pair prop changes
  useEffect(() => {
    if (pair === currentPairRef.current) return;
    
    if (connected && currentPairRef.current) {
      // Unsubscribe from previous pair
      webSocketService.unsubscribe(currentPairRef.current);
    }
    
    // Update current pair ref
    currentPairRef.current = pair;
    
    if (connected && pair) {
      // Subscribe to new pair
      webSocketService.subscribe(pair);
    }
  }, [pair, connected]);
  
  // Function to manually subscribe to a pair
  const subscribeToPair = useCallback((pairName: string) => {
    if (pairName === currentPairRef.current) return;
    
    if (connected && currentPairRef.current) {
      webSocketService.unsubscribe(currentPairRef.current);
    }
    
    currentPairRef.current = pairName;
    
    if (connected) {
      webSocketService.subscribe(pairName);
    }
  }, [connected]);
  
  return {
    connected,
    marketData,
    tradingPairs,
    error,
    subscribeToPair
  };
}
