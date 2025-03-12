import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { TradingPair, Blockchain, TradingCategory } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

interface AppContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  selectedBlockchain: string;
  setSelectedBlockchain: (blockchain: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  demoMode: boolean;
  toggleDemoMode: () => void;
  demoBalance: number;
  updateDemoBalance: (amount: number) => void;
  walletAddress: string | null;
  connectWallet: () => void;
  disconnectWallet: () => void;
  isLoading: boolean;
  blockchains: Blockchain[];
  tradingCategories: TradingCategory[];
  tradingPairs: TradingPair[];
  selectedPair: TradingPair | null;
  setSelectedPair: (pair: TradingPair | null) => void;
  marginMode: 'cross' | 'isolated';
  setMarginMode: (mode: 'cross' | 'isolated') => void;
  leverage: number;
  setLeverage: (leverage: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(true);
  const [selectedBlockchain, setSelectedBlockchain] = useState('Solana');
  const [selectedCategory, setSelectedCategory] = useState('Forex Derivatives');
  const [demoMode, setDemoMode] = useState(true);
  const [demoBalance, setDemoBalance] = useState(10000);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [selectedPair, setSelectedPair] = useState<TradingPair | null>(null);
  const [marginMode, setMarginMode] = useState<'cross' | 'isolated'>('cross');
  const [leverage, setLeverage] = useState(50);

  // Fetch blockchains
  const { data: blockchains = [], isLoading: isLoadingBlockchains } = useQuery({
    queryKey: ['/api/blockchains'],
    queryFn: async () => {
      try {
        // For the MVP, return mock blockchains since the backend isn't fully set up
        return [
          { id: 1, name: 'Solana', isActive: true },
          { id: 2, name: 'ICP', isActive: true },
          { id: 3, name: 'Base', isActive: true }
        ] as Blockchain[];
      } catch (error) {
        console.error('Error fetching blockchains:', error);
        return [];
      }
    }
  });

  // Fetch trading categories
  const { data: tradingCategories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['/api/categories'],
    queryFn: async () => {
      try {
        // For the MVP, return mock categories since the backend isn't fully set up
        return [
          { id: 1, name: 'Forex Derivatives', isActive: true },
          { id: 2, name: 'Crypto Derivatives', isActive: true },
          { id: 3, name: 'Commodity Derivatives', isActive: true }
        ] as TradingCategory[];
      } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
      }
    }
  });

  // Fetch trading pairs
  const { data: tradingPairs = [], isLoading: isLoadingPairs } = useQuery({
    queryKey: ['/api/pairs'],
    queryFn: async () => {
      try {
        // For the MVP, return mock pairs since the backend isn't fully set up
        return [
          { id: 1, name: 'EUR/USD', baseAsset: 'EUR', quoteAsset: 'USD', price: 1.09, change24h: 0.02, categoryId: 1, isActive: true },
          { id: 2, name: 'BTC/USD', baseAsset: 'BTC', quoteAsset: 'USD', price: 62150, change24h: -1.2, categoryId: 2, isActive: true },
          { id: 3, name: 'ETH/USD', baseAsset: 'ETH', quoteAsset: 'USD', price: 3120, change24h: 0.8, categoryId: 2, isActive: true },
          { id: 4, name: 'GOLD/USD', baseAsset: 'GOLD', quoteAsset: 'USD', price: 2360, change24h: 0.5, categoryId: 3, isActive: true }
        ] as TradingPair[];
      } catch (error) {
        console.error('Error fetching pairs:', error);
        return [];
      }
    }
  });

  const isLoading = isLoadingBlockchains || isLoadingCategories || isLoadingPairs;

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
      return newMode;
    });
  };

  // Apply dark mode by default
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDemoMode = () => {
    setDemoMode(prev => !prev);
    toast({
      title: demoMode ? "Demo Mode Disabled" : "Demo Mode Enabled",
      description: demoMode ? "Trading with real assets." : "Practice trading with virtual balance.",
    });
  };

  const updateDemoBalance = (amount: number) => {
    setDemoBalance(prev => prev + amount);
  };

  const connectWallet = () => {
    // Simulated wallet connection for the MVP
    toast({
      title: "Wallet connection coming soon",
      description: "This feature will be available in the next update.",
    });
    // In a real implementation, we would connect to actual wallets
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected.",
    });
  };

  return (
    <AppContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        selectedBlockchain,
        setSelectedBlockchain,
        selectedCategory,
        setSelectedCategory,
        demoMode,
        toggleDemoMode,
        demoBalance,
        updateDemoBalance,
        walletAddress,
        connectWallet,
        disconnectWallet,
        isLoading,
        blockchains,
        tradingCategories,
        tradingPairs,
        selectedPair,
        setSelectedPair,
        marginMode,
        setMarginMode,
        leverage,
        setLeverage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
