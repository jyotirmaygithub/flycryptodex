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
import React, { createContext, useContext, useState, useEffect } from 'react';
import { TradingPair, User } from '@shared/schema';

interface AppContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  selectedPair: TradingPair | null;
  setSelectedPair: (pair: TradingPair | null) => void;
  professionalMode: boolean;
  setProfessionalMode: (value: boolean) => void;
  walletConnected: boolean;
  setWalletConnected: (value: boolean) => void;
  walletAddress: string;
  setWalletAddress: (address: string) => void;
}

const defaultContext: AppContextType = {
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  currentUser: null,
  setCurrentUser: () => {},
  darkMode: true,
  setDarkMode: () => {},
  selectedPair: null,
  setSelectedPair: () => {},
  professionalMode: false,
  setProfessionalMode: () => {},
  walletConnected: false,
  setWalletConnected: () => {},
  walletAddress: '',
  setWalletAddress: () => {},
};

const AppContext = createContext<AppContextType>(defaultContext);

export const useAppContext = () => useContext(AppContext);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [selectedPair, setSelectedPair] = useState<TradingPair | null>(null);
  const [professionalMode, setProfessionalMode] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  // Load preferences from localStorage on component mount
  useEffect(() => {
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode !== null) {
      setDarkMode(storedDarkMode === 'true');
    }

    const storedProfessionalMode = localStorage.getItem('professionalMode');
    if (storedProfessionalMode !== null) {
      setProfessionalMode(storedProfessionalMode === 'true');
    }

    const storedWalletAddress = localStorage.getItem('walletAddress');
    if (storedWalletAddress) {
      setWalletAddress(storedWalletAddress);
      setWalletConnected(true);
    }
  }, []);

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('professionalMode', professionalMode.toString());
  }, [professionalMode]);

  useEffect(() => {
    if (walletAddress) {
      localStorage.setItem('walletAddress', walletAddress);
    }
  }, [walletAddress]);

  const value = {
    isAuthenticated,
    setIsAuthenticated,
    currentUser,
    setCurrentUser,
    darkMode,
    setDarkMode,
    selectedPair,
    setSelectedPair,
    professionalMode,
    setProfessionalMode,
    walletConnected,
    setWalletConnected,
    walletAddress,
    setWalletAddress,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
