import { createContext, useContext, useState, useEffect } from 'react';
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
  tradingPairs: TradingPair[];
  setTradingPairs: React.Dispatch<React.SetStateAction<TradingPair[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isConnected: boolean;
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
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
  tradingPairs: [],
  setTradingPairs: () => {},
  isLoading: false,
  setIsLoading: () => {},
  isConnected: false,
  setIsConnected: () => {},
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
  const [tradingPairs, setTradingPairs] = useState<TradingPair[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);

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
    tradingPairs,
    setTradingPairs,
    isLoading,
    setIsLoading,
    isConnected,
    setIsConnected,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};