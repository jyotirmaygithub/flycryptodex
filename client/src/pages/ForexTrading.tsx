import { useState, useEffect, useMemo } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { TradingPair, CandlestickData } from "@shared/schema";
import TradingViewChart from "@/components/trading/TradingViewChart";
import { generateMockCandlestickData } from "@/lib/mockData";
import ForexNews from "@/components/trading/ForexNews";
import AiStrategyBox from "@/components/trading/AiStrategyBox";
import { useWallet } from "@/hooks/useWallet";
import {
  Home,
  TrendingUp,
  TrendingDown,
  ChevronUp,
  ChevronDown,
  Sliders,
  Clock,
  RefreshCw,
  Globe,
  BarChart2,
  DollarSign,
  ArrowRight,
  ArrowDownRight,
  ArrowUpRight,
  Info,
  Star,
  StarOff,
  ChevronLeft,
  ChevronRight,
  Zap,
  Bell,
  Settings,
  User,
  HelpCircle,
  AreaChart,
  CandlestickChart,
  LineChart,
  PieChart,
  Wallet,
  Search,
  History,
  Bookmark,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

const forexPairs = [
  { id: 1, name: 'EUR/USD', baseAsset: 'EUR', quoteAsset: 'USD', price: 1.0921, change24h: 0.15, categoryId: 1, isActive: true },
  { id: 2, name: 'GBP/USD', baseAsset: 'GBP', quoteAsset: 'USD', price: 1.2639, change24h: -0.21, categoryId: 1, isActive: true },
  { id: 3, name: 'USD/JPY', baseAsset: 'USD', quoteAsset: 'JPY', price: 157.89, change24h: 0.32, categoryId: 1, isActive: true },
  { id: 4, name: 'AUD/USD', baseAsset: 'AUD', quoteAsset: 'USD', price: 0.6573, change24h: -0.11, categoryId: 1, isActive: true },
  { id: 5, name: 'USD/CHF', baseAsset: 'USD', quoteAsset: 'CHF', price: 0.9042, change24h: 0.22, categoryId: 1, isActive: true },
  { id: 6, name: 'EUR/GBP', baseAsset: 'EUR', quoteAsset: 'GBP', price: 0.8642, change24h: 0.09, categoryId: 1, isActive: true },
];

// Popular trading amounts by lot size
const lotSizes = [0.01, 0.05, 0.1, 0.5, 1.0];

// Chart timeframes
const timeFrames = [
  { value: '5m', label: '5m' },
  { value: '15m', label: '15m' },
  { value: '1h', label: '1H' },
  { value: '4h', label: '4H' },
  { value: '1d', label: 'D' },
  { value: '1w', label: 'W' },
];

export default function ForexTrading() {
  const { pair: pairParam } = useParams();
  const [, navigate] = useLocation();
  const [currentPair, setCurrentPair] = useState<TradingPair>(forexPairs[0]);
  const [timeFrame, setTimeFrame] = useState<string>('1h');
  const [chartType, setChartType] = useState<'candlestick' | 'line' | 'area'>('candlestick');
  const [lotSize, setLotSize] = useState<number>(0.1);
  const [price, setPrice] = useState<number>(0);
  const [amount, setAmount] = useState<number>(0);
  const [favoriteList, setFavoriteList] = useState<number[]>([1, 2]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const { walletAddress, isConnecting, connectPhantom, connectMetaMask, connectICPWallet, disconnectWallet } = useWallet();

  const candleData = useMemo(() => {
    try {
      return generateMockCandlestickData(timeFrame, 100);
    } catch (error) {
      console.error("Error generating chart data:", error);
      return [];
    }
  }, [timeFrame, currentPair.name]);

  useEffect(() => {
    const blockchainName = localStorage.getItem('selectedBlockchainName');
    if (!blockchainName) {
      navigate("/select-blockchain");
    }

    if (pairParam) {
      const foundPair = forexPairs.find(p => p.name === decodeURIComponent(pairParam));
      if (foundPair) {
        setCurrentPair(foundPair);
        setPrice(foundPair.price);
      }
    }
  }, [pairParam, navigate]);

  const toggleFavorite = (pairId: number) => {
    if (favoriteList.includes(pairId)) {
      setFavoriteList(favoriteList.filter(id => id !== pairId));
    } else {
      setFavoriteList([...favoriteList, pairId]);
    }
  };

  const visiblePairs = showFavoritesOnly 
    ? forexPairs.filter(pair => favoriteList.includes(pair.id))
    : forexPairs;

  const handleLotSizeSelect = (size: number) => {
    setLotSize(size);
    setAmount(size);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-900 to-primary-950 text-white">
      {/* Header with navigation */}
      <header className="border-b border-primary-700/50 bg-primary-900/70 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          {/* Top navigation bar */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-6">
              <div className="relative flex items-center">
                <span className="text-2xl font-bold flex items-center gap-2">
                  <span className="bg-gradient-to-r from-accent-400 to-accent-600 text-transparent bg-clip-text">
                    FlyCrypto
                  </span>
                  <Badge variant="outline" className="uppercase text-xs font-bold tracking-wider bg-green-500/10 text-green-400 border-green-500/30">
                    Live
                  </Badge>
                </span>
              </div>
              <div className="hidden md:flex items-center space-x-2 bg-primary-950/50 rounded-lg p-1">
                <div className="relative">
                  <Search className="h-3.5 w-3.5 text-neutral-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
                  <Input 
                    placeholder="Search markets..." 
                    className="h-8 bg-transparent border-none text-sm w-48 pl-8 focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
                      <Bell className="h-5 w-5 text-neutral-400" />
                      <span className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-red-500 rounded-full border-2 border-primary-900"></span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notifications</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              {walletAddress ? (
                <Button 
                  variant="outline" 
                  className="border-[#f7a600] text-[#f7a600] hover:bg-[#f7a600]/10 bg-[#f7a600]/5 font-medium"
                  size="sm"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </Button>
              ) : (
                <Button 
                  onClick={() => {
                    // Connect to the appropriate wallet based on the blockchain selected
                    const blockchainId = localStorage.getItem('selectedBlockchainId');
                    
                    if (blockchainId === '1') {
                      // Solana network selected
                      connectPhantom();
                    } else if (blockchainId === '2') {
                      // ICP network selected
                      connectICPWallet();
                    } else if (blockchainId === '3') {
                      // Base (Ethereum L2) selected
                      connectMetaMask();
                    } else {
                      // Default to MetaMask if no blockchain selected
                      connectMetaMask();
                    }
                  }}
                  className="bg-[#f7a600] hover:bg-[#f7a600]/90 text-black font-medium"
                  size="sm"
                  disabled={isConnecting}
                >
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                  <Wallet className="ml-2 h-4 w-4" />
                </Button>
              )}
              
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8 border border-primary-700">
                  <AvatarFallback className="bg-primary-800 text-accent-500">JD</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
          
          {/* Bottom navigation bar */}
          <div className="flex items-center justify-between pt-1">
            <nav className="flex space-x-1">
              <Button variant="ghost" size="sm" className="h-8 rounded-md text-white/80 hover:text-white hover:bg-primary-800">
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button variant="ghost" size="sm" className="h-8 rounded-md text-accent-500 hover:text-accent-400 hover:bg-primary-800">
                <BarChart2 className="w-4 h-4 mr-2" />
                Trading
              </Button>
              <Button variant="ghost" size="sm" className="h-8 rounded-md text-white/80 hover:text-white hover:bg-primary-800">
                <History className="w-4 h-4 mr-2" />
                History
              </Button>
              <Button variant="ghost" size="sm" className="h-8 rounded-md text-white/80 hover:text-white hover:bg-primary-800">
                <Bookmark className="w-4 h-4 mr-2" />
                Watchlist
              </Button>
              <Button variant="ghost" size="sm" className="h-8 rounded-md text-white/80 hover:text-white hover:bg-primary-800">
                <Globe className="w-4 h-4 mr-2" />
                Markets
              </Button>
            </nav>
            
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md hover:bg-primary-800">
                      <HelpCircle className="h-4 w-4 text-neutral-400" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Help & Support</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md hover:bg-primary-800">
                      <Settings className="h-4 w-4 text-neutral-400" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Settings</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <ThemeToggle />
              
              <Button 
                onClick={() => navigate(`/forex-trading-pro/${encodeURIComponent(currentPair.name)}`)}
                variant="outline" 
                size="sm" 
                className="bg-accent-500/10 text-accent-500 border-accent-500/20 hover:bg-accent-500/20"
              >
                <Sliders className="w-4 h-4 mr-2" />
                Pro Mode
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/")}
                className="text-neutral-400 hover:text-white hover:bg-primary-800"
              >
                Exit
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left sidebar - Market Watch */}
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <Card className="bg-primary-800/50 border-primary-700/50 overflow-hidden">
              <CardHeader className="p-4 pb-2 space-y-0">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-medium flex items-center">
                    <BarChart2 className="h-4 w-4 mr-2 text-accent-500" />
                    Market Watch
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full hover:bg-primary-700"
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  >
                    {showFavoritesOnly ? (
                      <Star className="h-4 w-4 text-yellow-400" />
                    ) : (
                      <Star className="h-4 w-4 text-neutral-400" />
                    )}
                  </Button>
                </div>
                <div className="flex justify-between items-center pt-2 text-xs text-neutral-400">
                  <span>Symbol</span>
                  <span>Price</span>
                </div>
              </CardHeader>
              <Separator className="bg-primary-700/50" />
              <div className="max-h-[calc(100vh-400px)] overflow-y-auto p-0 scrollbar-thin">
                {visiblePairs.map(pair => (
                  <div
                    key={pair.id}
                    className={`
                      group flex items-center justify-between p-3 
                      cursor-pointer transition-all duration-200
                      hover:bg-primary-700/30 border-l-2
                      ${currentPair.id === pair.id 
                        ? 'border-accent-500 bg-accent-500/10' 
                        : 'border-transparent'}
                    `}
                    onClick={() => navigate(`/forex-trading/${encodeURIComponent(pair.name)}`)}
                  >
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 rounded-full p-0 opacity-0 group-hover:opacity-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(pair.id);
                        }}
                      >
                        {favoriteList.includes(pair.id) ? (
                          <Star className="h-3 w-3 text-yellow-400" />
                        ) : (
                          <StarOff className="h-3 w-3 text-neutral-400" />
                        )}
                      </Button>
                      <span className="font-medium text-sm">{pair.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm">{pair.price.toFixed(4)}</div>
                      <div className={`text-xs flex items-center justify-end mt-0.5 ${pair.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {pair.change24h >= 0 ? (
                          <ArrowUpRight className="w-3 h-3 mr-0.5" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 mr-0.5" />
                        )}
                        {Math.abs(pair.change24h).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <CardFooter className="p-2 bg-primary-800/80 border-t border-primary-700/50 flex justify-center">
                <Button variant="ghost" size="sm" className="text-xs text-neutral-400 hover:text-accent-500 w-full">
                  View All Markets <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Main content - Chart and Order Form */}
          <div className="col-span-12 md:col-span-9 lg:col-span-7 space-y-6">
            <Card className="bg-primary-800/50 border-primary-700/50 overflow-hidden">
              <CardHeader className="p-4 pb-0 border-b border-primary-700/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold">{currentPair.name}</h2>
                        <Badge variant="outline" className="font-normal bg-accent-500/10 text-accent-400 border-accent-500/30">
                          Forex
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-lg font-mono ${currentPair.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {currentPair.price.toFixed(4)}
                        </span>
                        <span className={`flex items-center text-sm ${currentPair.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {currentPair.change24h >= 0 ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                          {Math.abs(currentPair.change24h).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex bg-primary-900/70 rounded-md overflow-hidden">
                      {timeFrames.map((tf) => (
                        <Button
                          key={tf.value}
                          variant="ghost"
                          size="sm"
                          className={`px-2 py-1 h-8 rounded-none ${
                            timeFrame === tf.value
                              ? 'bg-accent-500 text-primary-900 hover:bg-accent-600 hover:text-primary-900'
                              : 'text-neutral-400 hover:bg-primary-800 hover:text-white'
                          }`}
                          onClick={() => setTimeFrame(tf.value)}
                        >
                          {tf.label}
                        </Button>
                      ))}
                    </div>
                    
                    <div className="flex bg-primary-900/70 rounded-md overflow-hidden">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`h-8 w-8 rounded-none ${
                                chartType === 'candlestick'
                                  ? 'bg-accent-500/20 text-accent-400'
                                  : 'text-neutral-400 hover:bg-primary-800 hover:text-white'
                              }`}
                              onClick={() => setChartType('candlestick')}
                            >
                              <CandlestickChart className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <p>Candlestick</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`h-8 w-8 rounded-none ${
                                chartType === 'line'
                                  ? 'bg-accent-500/20 text-accent-400'
                                  : 'text-neutral-400 hover:bg-primary-800 hover:text-white'
                              }`}
                              onClick={() => setChartType('line')}
                            >
                              <LineChart className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <p>Line</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`h-8 w-8 rounded-none ${
                                chartType === 'area'
                                  ? 'bg-accent-500/20 text-accent-400'
                                  : 'text-neutral-400 hover:bg-primary-800 hover:text-white'
                              }`}
                              onClick={() => setChartType('area')}
                            >
                              <AreaChart className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="bottom">
                            <p>Area</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 rounded-full hover:bg-primary-700"
                    >
                      <RefreshCw className="h-4 w-4 text-neutral-400" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 relative">
                {/* Chart Stats Overlay */}
                <div className="absolute top-3 left-3 z-10 bg-primary-900/70 border border-primary-700/50 rounded-md p-2 backdrop-blur-sm flex flex-col space-y-1">
                  <div className="text-xs text-neutral-400 flex items-center justify-between gap-6">
                    <span>Open</span>
                    <span className="font-mono text-white">{(currentPair.price * 0.998).toFixed(4)}</span>
                  </div>
                  <div className="text-xs text-neutral-400 flex items-center justify-between gap-6">
                    <span>High</span>
                    <span className="font-mono text-green-400">{(currentPair.price * 1.003).toFixed(4)}</span>
                  </div>
                  <div className="text-xs text-neutral-400 flex items-center justify-between gap-6">
                    <span>Low</span>
                    <span className="font-mono text-red-400">{(currentPair.price * 0.997).toFixed(4)}</span>
                  </div>
                  <div className="text-xs text-neutral-400 flex items-center justify-between gap-6">
                    <span>Close</span>
                    <span className="font-mono text-white">{currentPair.price.toFixed(4)}</span>
                  </div>
                </div>
                
                {/* Chart Indicators */}
                <div className="absolute top-3 right-3 z-10">
                  <Badge className="bg-primary-900/70 border-primary-700/50 text-xs backdrop-blur-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-neutral-400">MA</span>
                      <span className="text-accent-400">21</span>
                      <span className="text-green-400">50</span>
                      <span className="text-blue-400">200</span>
                    </div>
                  </Badge>
                </div>
                
                <div className="h-[380px] mt-0">
                  {chartType === 'candlestick' && (
                    <TradingViewChart 
                      candleData={candleData}
                      pair={currentPair.name}
                      height={380}
                    />
                  )}
                  {chartType === 'line' && (
                    <TradingViewChart 
                      candleData={candleData}
                      pair={currentPair.name}
                      height={380}
                    />
                  )}
                  {chartType === 'area' && (
                    <TradingViewChart 
                      candleData={candleData}
                      pair={currentPair.name}
                      height={380}
                    />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Trade Form Card */}
            <Card className="bg-primary-800/50 border-primary-700/50 overflow-hidden">
              <CardHeader className="p-4 pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-medium flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-accent-500" />
                  Quick Trade
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Tabs defaultValue="market" className="w-full">
                  <TabsList className="mb-4 bg-primary-900/40 p-1">
                    <TabsTrigger value="market" className="data-[state=active]:bg-accent-500 data-[state=active]:text-primary-950">
                      Market
                    </TabsTrigger>
                    <TabsTrigger value="limit" className="data-[state=active]:bg-accent-500 data-[state=active]:text-primary-950">
                      Limit
                    </TabsTrigger>
                    <TabsTrigger value="stop" className="data-[state=active]:bg-accent-500 data-[state=active]:text-primary-950">
                      Stop
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Market Order Form */}
                  <TabsContent value="market" className="mt-0">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-2">
                            <Label htmlFor="lot-size" className="text-sm flex items-center gap-1">
                              Lot Size 
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-4 w-4 rounded-full hover:bg-primary-700"
                              >
                                <Info className="h-3 w-3 text-neutral-400" />
                              </Button>
                            </Label>
                            <span className="text-sm text-neutral-400">{lotSize} lots</span>
                          </div>
                          <div>
                            <div className="flex gap-2 mb-2">
                              {lotSizes.map((size) => (
                                <Button
                                  key={size}
                                  variant="outline"
                                  size="sm"
                                  className={`px-2 py-1 h-7 text-xs flex-1 ${
                                    lotSize === size
                                      ? 'bg-accent-500/20 border-accent-500 text-accent-400'
                                      : 'bg-primary-900/50 border-primary-700 text-neutral-300'
                                  }`}
                                  onClick={() => handleLotSizeSelect(size)}
                                >
                                  {size}
                                </Button>
                              ))}
                            </div>
                            <Slider 
                              value={[lotSize]} 
                              min={0.01} 
                              max={2} 
                              step={0.01} 
                              onValueChange={(values) => setLotSize(values[0])}
                              className="my-5"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-2">
                            <Label className="text-sm">Estimated Value</Label>
                            <span className="text-sm font-mono">
                              ${(lotSize * 100000 * currentPair.price).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })}
                            </span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <Label className="text-sm">Spread</Label>
                            <span className="text-sm font-mono">1.2 pips</span>
                          </div>
                          <div className="flex justify-between">
                            <Label className="text-sm">Leverage</Label>
                            <span className="text-sm font-mono">1:30</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col justify-between gap-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-primary-900/50 rounded-md p-3 border border-primary-700/50">
                            <div className="text-xs text-neutral-400 mb-1">Bid</div>
                            <div className="text-green-400 font-mono text-xl">
                              {(currentPair.price - 0.0002).toFixed(4)}
                            </div>
                          </div>
                          <div className="bg-primary-900/50 rounded-md p-3 border border-primary-700/50">
                            <div className="text-xs text-neutral-400 mb-1">Ask</div>
                            <div className="text-red-400 font-mono text-xl">
                              {(currentPair.price + 0.0002).toFixed(4)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <Button 
                            size="lg" 
                            className="w-full py-7 bg-green-500 hover:bg-green-600 rounded-md flex items-center justify-center gap-2"
                          >
                            <Zap className="w-5 h-5" />
                            Buy {currentPair.baseAsset}
                          </Button>
                          <Button 
                            size="lg" 
                            className="w-full py-7 bg-red-500 hover:bg-red-600 rounded-md flex items-center justify-center gap-2"
                          >
                            <Zap className="w-5 h-5" />
                            Sell {currentPair.baseAsset}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Limit Order Form */}
                  <TabsContent value="limit" className="mt-0 space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm mb-2 block">Limit Price</Label>
                          <Input 
                            type="number" 
                            placeholder="Enter limit price" 
                            value={price || ''} 
                            onChange={(e) => setPrice(Number(e.target.value))}
                            className="bg-primary-900/50 border-primary-700"
                          />
                          <div className="flex justify-between mt-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs text-neutral-400 hover:text-white px-2"
                              onClick={() => setPrice(currentPair.price - 0.001)}
                            >
                              -0.0010
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs text-accent-500 hover:text-accent-400 px-2"
                              onClick={() => setPrice(currentPair.price)}
                            >
                              Market
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs text-neutral-400 hover:text-white px-2"
                              onClick={() => setPrice(currentPair.price + 0.001)}
                            >
                              +0.0010
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-2">
                            <Label htmlFor="lot-size" className="text-sm flex items-center gap-1">
                              Lot Size 
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-4 w-4 rounded-full hover:bg-primary-700"
                              >
                                <Info className="h-3 w-3 text-neutral-400" />
                              </Button>
                            </Label>
                            <span className="text-sm text-neutral-400">{lotSize} lots</span>
                          </div>
                          <div>
                            <div className="flex gap-2 mb-2">
                              {lotSizes.map((size) => (
                                <Button
                                  key={size}
                                  variant="outline"
                                  size="sm"
                                  className={`px-2 py-1 h-7 text-xs flex-1 ${
                                    lotSize === size
                                      ? 'bg-accent-500/20 border-accent-500 text-accent-400'
                                      : 'bg-primary-900/50 border-primary-700 text-neutral-300'
                                  }`}
                                  onClick={() => handleLotSizeSelect(size)}
                                >
                                  {size}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-2">
                            <Label className="text-sm">Estimated Value</Label>
                            <span className="text-sm font-mono">
                              ${(lotSize * 100000 * (price || currentPair.price)).toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col justify-between gap-4">
                        <div className="bg-primary-900/50 rounded-md p-3 border border-primary-700/50">
                          <div className="text-xs text-neutral-400 mb-1">Current Price</div>
                          <div className="font-mono text-xl flex items-center justify-between">
                            <span>{currentPair.price.toFixed(4)}</span>
                            <Badge 
                              variant="outline" 
                              className={`${
                                (price || currentPair.price) > currentPair.price 
                                  ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                                  : 'bg-green-500/10 text-green-400 border-green-500/20'
                              }`}
                            >
                              {(price || currentPair.price) > currentPair.price ? 'Above Market' : 'Below Market'}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <Button 
                            size="lg" 
                            className="w-full py-6 bg-green-500 hover:bg-green-600 rounded-md"
                          >
                            Buy Limit
                          </Button>
                          <Button 
                            size="lg" 
                            className="w-full py-6 bg-red-500 hover:bg-red-600 rounded-md"
                          >
                            Sell Limit
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  {/* Stop Order Form */}
                  <TabsContent value="stop" className="mt-0 space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm mb-2 block">Stop Price</Label>
                          <Input 
                            type="number" 
                            placeholder="Enter stop price" 
                            value={price || ''} 
                            onChange={(e) => setPrice(Number(e.target.value))}
                            className="bg-primary-900/50 border-primary-700"
                          />
                          <div className="flex justify-between mt-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs text-neutral-400 hover:text-white px-2"
                              onClick={() => setPrice(currentPair.price - 0.001)}
                            >
                              -0.0010
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs text-accent-500 hover:text-accent-400 px-2"
                              onClick={() => setPrice(currentPair.price)}
                            >
                              Market
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-xs text-neutral-400 hover:text-white px-2"
                              onClick={() => setPrice(currentPair.price + 0.001)}
                            >
                              +0.0010
                            </Button>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-2">
                            <Label htmlFor="lot-size" className="text-sm flex items-center gap-1">
                              Lot Size 
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-4 w-4 rounded-full hover:bg-primary-700"
                              >
                                <Info className="h-3 w-3 text-neutral-400" />
                              </Button>
                            </Label>
                            <span className="text-sm text-neutral-400">{lotSize} lots</span>
                          </div>
                          <div>
                            <div className="flex gap-2 mb-2">
                              {lotSizes.map((size) => (
                                <Button
                                  key={size}
                                  variant="outline"
                                  size="sm"
                                  className={`px-2 py-1 h-7 text-xs flex-1 ${
                                    lotSize === size
                                      ? 'bg-accent-500/20 border-accent-500 text-accent-400'
                                      : 'bg-primary-900/50 border-primary-700 text-neutral-300'
                                  }`}
                                  onClick={() => handleLotSizeSelect(size)}
                                >
                                  {size}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col justify-between gap-4">
                        <div className="bg-primary-900/50 rounded-md p-3 border border-primary-700/50">
                          <div className="text-xs text-neutral-400 mb-1">Current Price</div>
                          <div className="font-mono text-xl flex items-center justify-between">
                            <span>{currentPair.price.toFixed(4)}</span>
                            <Badge 
                              variant="outline" 
                              className={`${
                                (price || currentPair.price) > currentPair.price 
                                  ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                                  : 'bg-green-500/10 text-green-400 border-green-500/20'
                              }`}
                            >
                              {(price || currentPair.price) > currentPair.price ? 'Above Market' : 'Below Market'}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <Button 
                            size="lg" 
                            className="w-full py-6 bg-green-500 hover:bg-green-600 rounded-md"
                          >
                            Buy Stop
                          </Button>
                          <Button 
                            size="lg" 
                            className="w-full py-6 bg-red-500 hover:bg-red-600 rounded-md"
                          >
                            Sell Stop
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right sidebar - Market Overview and Forex News */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            <Card className="bg-primary-800/50 border-primary-700/50 overflow-hidden">
              <CardHeader className="p-4 pb-2 space-y-0">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-medium flex items-center">
                    <BarChart2 className="h-4 w-4 mr-2 text-accent-500" />
                    Market Overview
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full hover:bg-primary-700"
                  >
                    <RefreshCw className="h-3.5 w-3.5 text-neutral-400" />
                  </Button>
                </div>
              </CardHeader>
              <Separator className="bg-primary-700/50" />
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 rounded-md bg-primary-900/40">
                    <span className="text-white/70 text-sm">24h High</span>
                    <span className="font-mono text-green-400">{(currentPair.price * 1.02).toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-md bg-primary-900/40">
                    <span className="text-white/70 text-sm">24h Low</span>
                    <span className="font-mono text-red-400">{(currentPair.price * 0.98).toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-md bg-primary-900/40">
                    <span className="text-white/70 text-sm">24h Volume</span>
                    <span className="font-mono">$1.24M</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-md bg-primary-900/40">
                    <span className="text-white/70 text-sm">Pip Value</span>
                    <span className="font-mono">$10.00</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-md bg-primary-900/40">
                    <span className="text-white/70 text-sm">Swap Long</span>
                    <span className="font-mono text-green-400">+0.15%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-md bg-primary-900/40">
                    <span className="text-white/70 text-sm">Swap Short</span>
                    <span className="font-mono text-red-400">-0.23%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary-800/50 border-primary-700/50 overflow-hidden">
              <CardHeader className="p-4 pb-2 space-y-0">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-medium flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-accent-500" />
                    Forex News
                  </CardTitle>
                </div>
              </CardHeader>
              <Separator className="bg-primary-700/50" />
              <ForexNews />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}