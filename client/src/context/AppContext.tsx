import React, { createContext, useContext, useState, useEffect } from 'react';
import { TradingPair } from '@shared/schema';

// Define the context type
interface AppContextType {
  tradingPairs: TradingPair[];
  setTradingPairs: React.Dispatch<React.SetStateAction<TradingPair[]>>;
  selectedPair: string;
  setSelectedPair: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isConnected: boolean;
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
}

// Create the context with default values
const AppContext = createContext<AppContextType>({
  tradingPairs: [],
  setTradingPairs: () => {},
  selectedPair: 'BTC/USD',
  setSelectedPair: () => {},
  isLoading: false,
  setIsLoading: () => {},
  isConnected: false,
  setIsConnected: () => {},
});

// Provider component
export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [tradingPairs, setTradingPairs] = useState<TradingPair[]>([]);
  const [selectedPair, setSelectedPair] = useState<string>('BTC/USD');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  return (
    <AppContext.Provider
      value={{
        tradingPairs,
        setTradingPairs,
        selectedPair,
        setSelectedPair,
        isLoading,
        setIsLoading,
        isConnected,
        setIsConnected,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => useContext(AppContext);