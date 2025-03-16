import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { useTradingPairs } from "@/hooks/useTradingPairs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { CircleCheck, CircleDot, Search, X } from "lucide-react";
import { useLocation } from "wouter";
import { TradingPair } from "@shared/schema";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [, navigate] = useLocation();
  const { setSelectedPair, tradingPairs } = useAppContext();
  
  // Define missing properties with default values
  const [selectedBlockchain, setSelectedBlockchain] = useState<string>("Ethereum");
  const [selectedCategory, setSelectedCategory] = useState<string>("Forex");
  const [demoMode, setDemoMode] = useState<boolean>(true);
  const demoBalance = 10000;
  
  // Sample blockchains and categories for demo
  const blockchains = [
    { id: 1, name: "Ethereum", isActive: true },
    { id: 2, name: "Solana", isActive: true },
    { id: 3, name: "Binance", isActive: true }
  ];
  
  const tradingCategories = [
    { id: 1, name: "Forex", isActive: true },
    { id: 2, name: "Crypto", isActive: true },
    { id: 3, name: "Commodities", isActive: true }
  ];
  
  const toggleDemoMode = () => setDemoMode(!demoMode);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<number | undefined>(undefined);
  
  // Find the active category ID based on selected category name
  useEffect(() => {
    const category = tradingCategories.find(cat => cat.name === selectedCategory);
    setActiveCategoryId(category?.id);
  }, [selectedCategory, tradingCategories]);
  
  // Get trading pairs based on the active category
  const { pairs, isLoading } = useTradingPairs(activeCategoryId);
  
  // Use either the pairs from the hook or the context
  const availablePairs = pairs.length > 0 ? pairs : tradingPairs;
  
  // Filter pairs based on search query
  const filteredPairs = searchQuery
    ? availablePairs.filter(pair => pair.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : availablePairs;
  
  const handleSelectBlockchain = (name: string) => {
    setSelectedBlockchain(name);
  };
  
  const handleSelectCategory = (name: string) => {
    setSelectedCategory(name);
  };
  
  const handleSelectPair = (pair: TradingPair) => {
    setSelectedPair(pair);
    navigate(`/trading/${pair.name}`);
    if (window.innerWidth < 768) {
      onClose(); // Close sidebar on mobile when selecting a pair
    }
  };
  
  const sidebarClasses = `
    transition-transform duration-300 ease-in-out transform
    fixed inset-y-0 left-0 z-30 w-64 bg-primary-800 border-r border-primary-700
    md:relative md:translate-x-0 md:z-auto
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
  `;
  
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={sidebarClasses}>
        <div className="h-full flex flex-col overflow-y-auto">
          {/* Close button for mobile */}
          <div className="md:hidden absolute right-2 top-2">
            <button onClick={onClose} className="p-1 text-neutral-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          
          {/* Blockchain Selection */}
          <div className="p-4 border-b border-primary-700">
            <h2 className="text-sm uppercase tracking-wider text-neutral-400 mb-3">Blockchain</h2>
            <div className="flex flex-col space-y-2">
              {blockchains.map((blockchain) => (
                <button
                  key={blockchain.id}
                  className={`flex items-center p-2 rounded-md ${
                    selectedBlockchain === blockchain.name 
                      ? "bg-accent-500 text-white" 
                      : "hover:bg-primary-700 text-neutral-300"
                  }`}
                  onClick={() => handleSelectBlockchain(blockchain.name)}
                >
                  <span className="w-5 h-5 mr-2 flex items-center justify-center">
                    {selectedBlockchain === blockchain.name ? (
                      <CircleCheck size={16} />
                    ) : (
                      <CircleDot size={16} />
                    )}
                  </span>
                  {blockchain.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Trading Category */}
          <div className="p-4 border-b border-primary-700">
            <h2 className="text-sm uppercase tracking-wider text-neutral-400 mb-3">Trading</h2>
            <div className="flex flex-col space-y-2">
              {tradingCategories.map((category) => (
                <button
                  key={category.id}
                  className={`flex items-center p-2 rounded-md ${
                    selectedCategory === category.name 
                      ? "bg-accent-500 text-white" 
                      : "hover:bg-primary-700 text-neutral-300"
                  }`}
                  onClick={() => handleSelectCategory(category.name)}
                >
                  <span className="w-5 h-5 mr-2 flex items-center justify-center">
                    {selectedCategory === category.name ? (
                      <CircleCheck size={16} />
                    ) : (
                      <CircleDot size={16} />
                    )}
                  </span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Advanced Trading */}
          <div className="p-4 border-b border-primary-700">
            <h2 className="text-sm uppercase tracking-wider text-neutral-400 mb-3">Advanced Trading</h2>
            <div className="flex flex-col space-y-2">
              <button
                className="flex items-center p-2 rounded-md hover:bg-primary-700 text-neutral-300"
                onClick={() => navigate('/api-keys')}
              >
                <span className="w-5 h-5 mr-2 flex items-center justify-center">
                  <CircleDot size={16} />
                </span>
                API Keys
              </button>
              <button
                className="flex items-center p-2 rounded-md hover:bg-primary-700 text-neutral-300"
                onClick={() => navigate('/algorithmic-trading')}
              >
                <span className="w-5 h-5 mr-2 flex items-center justify-center">
                  <CircleDot size={16} />
                </span>
                Algorithmic Trading
              </button>
            </div>
          </div>
          
          {/* Trading Pairs */}
          <div className="p-4 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm uppercase tracking-wider text-neutral-400">Trading Pairs</h2>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-primary-700 text-sm rounded-md px-3 py-1 w-28 h-7 focus:outline-none focus:ring-1 focus:ring-accent-500"
                />
                <Search className="absolute right-2 top-1 h-4 w-4 text-neutral-400" />
              </div>
            </div>
            
            <div className="flex flex-col space-y-1">
              {isLoading ? (
                <div className="text-center py-4 text-neutral-400 text-sm">Loading pairs...</div>
              ) : filteredPairs.length === 0 ? (
                <div className="text-center py-4 text-neutral-400 text-sm">No pairs found</div>
              ) : (
                filteredPairs.map((pair) => (
                  <button
                    key={pair.id}
                    className="flex justify-between items-center p-2 rounded-md hover:bg-primary-700"
                    onClick={() => handleSelectPair(pair)}
                  >
                    <div className="flex items-center">
                      <span className="text-sm font-medium">{pair.name}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-xs font-mono ${pair.change24h >= 0 ? 'text-success' : 'text-error'}`}>
                        {pair.price.toFixed(4)}
                      </span>
                      <span className={`text-xs font-mono ${pair.change24h >= 0 ? 'text-success' : 'text-error'}`}>
                        {pair.change24h >= 0 ? '+' : ''}{pair.change24h.toFixed(2)}%
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
          
          {/* Demo Mode */}
          <div className="p-4 border-t border-primary-700 bg-primary-800">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Demo Mode</span>
              <Switch 
                checked={demoMode} 
                onCheckedChange={toggleDemoMode}
                className={demoMode ? "bg-accent-500" : ""} 
              />
            </div>
            {demoMode && (
              <div className="mt-2 bg-primary-700 rounded-md p-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-neutral-400">Demo Balance</span>
                  <span className="text-sm font-medium font-mono">${demoBalance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
