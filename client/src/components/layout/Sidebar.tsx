import { useState, useEffect } from "react";
import { useAppContext } from "@/context/AppContext";
import { useTradingPairs } from "@/hooks/useTradingPairs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowRight, 
  BarChart3, 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Code, 
  CreditCard, 
  Ellipsis, 
  Home, 
  Key, 
  Layers, 
  LineChart, 
  Menu, 
  PlayCircle, 
  Search, 
  Settings, 
  Star, 
  DollarSign, 
  Wallet,
  X 
} from "lucide-react";
import { useLocation } from "wouter";
import { TradingPair } from "@shared/schema";

interface SidebarProps {
  isOpen: boolean;
  isMinimized: boolean;
  onClose: () => void;
  onMinimize: () => void;
}

export default function Sidebar({ isOpen, isMinimized, onClose, onMinimize }: SidebarProps) {
  const [location, navigate] = useLocation();
  const { setSelectedPair, tradingPairs, professionalMode, setProfessionalMode } = useAppContext();
  
  // Define missing properties with default values
  const [selectedBlockchain, setSelectedBlockchain] = useState<string>("Ethereum");
  const [selectedCategory, setSelectedCategory] = useState<string>("Forex");
  const [demoMode, setDemoMode] = useState<boolean>(true);
  const demoBalance = 10000;
  
  // Sidebar section states
  const [marketsOpen, setMarketsOpen] = useState(true);
  const [devToolsOpen, setDevToolsOpen] = useState(false);
  
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
  const toggleMarketsSection = () => setMarketsOpen(!marketsOpen);
  const toggleDevToolsSection = () => setDevToolsOpen(!devToolsOpen);
  
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
    transition-all duration-300 ease-in-out transform
    fixed inset-y-0 left-0 z-30 bg-primary-900 border-r border-primary-700/50
    md:relative md:translate-x-0 md:z-auto
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    ${isMinimized ? "w-[72px]" : "w-72"}
  `;

  const isActive = (path: string) => {
    return location.startsWith(path);
  };
  
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
          {/* Toggle hamburger icon for minimizing */}
          <div className="flex items-center justify-between p-3 pb-1 border-b border-primary-700/50">
            {!isMinimized ? (
              <div className="flex items-center">
                <Wallet className="text-[#f7a600] h-5 w-5 mr-2" />
                <span className="font-semibold text-white">TradePro</span>
              </div>
            ) : (
              <div className="flex justify-center w-full">
                <Wallet className="text-[#f7a600] h-5 w-5" />
              </div>
            )}
            
            {/* Minimize button - only visible on desktop */}
            <button 
              onClick={onMinimize} 
              className="hidden md:flex p-1 text-neutral-400 hover:text-white"
              aria-label={isMinimized ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isMinimized ? (
                <ChevronRight size={16} />
              ) : (
                <ChevronLeft size={16} />
              )}
            </button>
          </div>
          
          {/* Close button for mobile */}
          <div className="md:hidden absolute right-2 top-2">
            <button onClick={onClose} className="p-1 text-neutral-400 hover:text-white">
              <X size={24} />
            </button>
          </div>

          {/* Sidebar content container */}
          <div className="flex flex-col h-full">
            {/* Navigation Section */}
            <div className="p-3">
              <div className="space-y-1">
                <button 
                  onClick={() => navigate('/')}
                  className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${isActive('/') && !isActive('/trading') && !isActive('/api-keys') && !isActive('/algorithmic-trading')
                      ? "bg-primary-700 text-white"
                      : "text-muted-foreground hover:text-white hover:bg-primary-800"}
                  `}
                  title="Dashboard"
                >
                  <Home className={isMinimized ? "mx-auto" : "mr-2"} size={isMinimized ? 20 : 16} />
                  {!isMinimized && <span>Dashboard</span>}
                </button>

                {/* Markets Section (custom collapsible) */}
                <div className="w-full">
                  <button 
                    onClick={toggleMarketsSection}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-white hover:bg-primary-800 transition-colors"
                    title="Markets"
                  >
                    <div className="flex items-center">
                      <LineChart className={isMinimized ? "mx-auto" : "mr-2"} size={isMinimized ? 20 : 16} />
                      {!isMinimized && <span>Markets</span>}
                    </div>
                    {!isMinimized && (marketsOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    ))}
                  </button>
                  
                  {marketsOpen && !isMinimized && (
                    <div className="pl-9 pt-1 pb-1">
                      <div className="space-y-1">
                        {tradingCategories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => handleSelectCategory(category.name)}
                            className={`w-full flex items-center px-3 py-2 rounded-md text-sm transition-colors
                              ${selectedCategory === category.name
                                ? "bg-primary-700/60 text-white"
                                : "text-muted-foreground hover:text-white hover:bg-primary-800/50"}
                            `}
                          >
                            {category.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button 
                  onClick={() => navigate('/api-keys')}
                  className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${isActive('/api-keys')
                      ? "bg-primary-700 text-white"
                      : "text-muted-foreground hover:text-white hover:bg-primary-800"}
                  `}
                  title="API Keys"
                >
                  <Key className={isMinimized ? "mx-auto" : "mr-2"} size={isMinimized ? 20 : 16} />
                  {!isMinimized && <span>API Keys</span>}
                </button>

                <button 
                  onClick={() => navigate('/algorithmic-trading')}
                  className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors
                    ${isActive('/algorithmic-trading')
                      ? "bg-primary-700 text-white"
                      : "text-muted-foreground hover:text-white hover:bg-primary-800"}
                  `}
                  title="Algorithmic Trading"
                >
                  <Code className={isMinimized ? "mx-auto" : "mr-2"} size={isMinimized ? 20 : 16} />
                  {!isMinimized && <span>Algorithmic Trading</span>}
                </button>

                {/* Developer Section (custom collapsible) */}
                <div className="w-full">
                  <button 
                    onClick={toggleDevToolsSection}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-white hover:bg-primary-800 transition-colors"
                    title="Developer"
                  >
                    <div className="flex items-center">
                      <Settings className={isMinimized ? "mx-auto" : "mr-2"} size={isMinimized ? 20 : 16} />
                      {!isMinimized && <span>Developer</span>}
                    </div>
                    {!isMinimized && (devToolsOpen ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    ))}
                  </button>
                  
                  {devToolsOpen && !isMinimized && (
                    <div className="pl-9 pt-1 pb-1">
                      <div className="space-y-1">
                        <button 
                          className="w-full flex items-center px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-white hover:bg-primary-800/50 transition-colors"
                        >
                          WebSocket API
                        </button>
                        <button 
                          className="w-full flex items-center px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-white hover:bg-primary-800/50 transition-colors"
                        >
                          Documentation
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Trading Pairs Search - Hide when minimized */}
            {!isMinimized && (
              <div className="px-3 mb-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search trading pairs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-primary-800/40 border-primary-700/50 focus-visible:ring-1 focus-visible:ring-[#f7a600] focus-visible:ring-offset-0"
                  />
                </div>
              </div>
            )}

            {/* Trading Pairs */}
            {!isMinimized && (
              <div className="flex-1 overflow-y-auto px-3">
                <div className="space-y-1 py-2">
                  <div className="flex items-center justify-between px-3 mb-2">
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {selectedCategory} Pairs
                    </h3>
                    <Badge variant="outline" className="text-xs font-normal px-1.5 py-0 border-primary-700/50">
                      {filteredPairs.length}
                    </Badge>
                  </div>
                  
                  <div className="space-y-0.5">
                    {isLoading ? (
                      <div className="text-center py-4 text-muted-foreground text-sm">Loading pairs...</div>
                    ) : filteredPairs.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground text-sm">No pairs found</div>
                    ) : (
                      filteredPairs.map((pair) => (
                        <button
                          key={pair.id}
                          className={`w-full flex justify-between items-center px-3 py-2 rounded-md hover:bg-primary-800 transition-colors
                            ${isActive(`/trading/${pair.name}`) ? "bg-primary-800/80" : ""}
                          `}
                          onClick={() => handleSelectPair(pair)}
                        >
                          <div className="flex items-center">
                            <Star className={`h-3.5 w-3.5 mr-2 ${
                              isActive(`/trading/${pair.name}`) ? "text-[#f7a600]" : "text-muted-foreground" 
                            }`} />
                            <span className="text-sm font-medium">{pair.name}</span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className={`text-xs font-mono ${pair.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {pair.price.toFixed(4)}
                            </span>
                            <span className={`text-xs font-mono ${pair.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {pair.change24h >= 0 ? '+' : ''}{pair.change24h.toFixed(2)}%
                            </span>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom section - Hide when minimized */}
          {!isMinimized && (
            <div className="border-t border-primary-700/50 pt-3 pb-3 px-3 space-y-3">
              {/* Mode Switcher */}
              <div className="bg-primary-800/40 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Trading Mode</span>
                  <Badge variant={professionalMode ? "default" : "outline"} className={professionalMode ? "bg-[#f7a600] hover:bg-[#f7a600]/90 text-primary-950" : "text-muted-foreground border-primary-700/50"}>
                    {professionalMode ? "Pro" : "Basic"}
                  </Badge>
                </div>
                <div className="flex">
                  <button
                    onClick={() => setProfessionalMode(false)}
                    className={`flex-1 py-1 text-xs rounded-l-md border border-r-0 transition-colors ${!professionalMode 
                      ? "bg-primary-700 text-white border-primary-700" 
                      : "bg-transparent text-muted-foreground border-primary-700/50 hover:bg-primary-800/50"}`}
                  >
                    Basic
                  </button>
                  <button
                    onClick={() => setProfessionalMode(true)}
                    className={`flex-1 py-1 text-xs rounded-r-md border transition-colors ${professionalMode 
                      ? "bg-primary-700 text-white border-primary-700" 
                      : "bg-transparent text-muted-foreground border-primary-700/50 hover:bg-primary-800/50"}`}
                  >
                    Professional
                  </button>
                </div>
              </div>

              {/* Demo Mode */}
              <div className="bg-primary-800/40 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Demo Mode</span>
                  <Switch 
                    checked={demoMode} 
                    onCheckedChange={toggleDemoMode}
                    className={demoMode ? "bg-[#f7a600]" : ""} 
                  />
                </div>
                {demoMode && (
                  <div className="flex items-center justify-between text-sm bg-primary-800/60 rounded-md p-2">
                    <div className="flex items-center">
                      <DollarSign className="h-3.5 w-3.5 mr-1 text-[#f7a600]" />
                      <span className="text-xs">Demo Balance:</span>
                    </div>
                    <span className="font-medium font-mono">${demoBalance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Three lines hamburger when minimized - bottom of sidebar */}
          {isMinimized && (
            <div className="mt-auto mb-4 flex justify-center">
              <button 
                onClick={onMinimize} 
                className="p-2 rounded-md hover:bg-primary-800 text-muted-foreground hover:text-white"
                title="Expand sidebar"
              >
                <div className="flex flex-col gap-1">
                  <div className="w-4 h-0.5 bg-current"></div>
                  <div className="w-4 h-0.5 bg-current"></div>
                  <div className="w-4 h-0.5 bg-current"></div>
                </div>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
