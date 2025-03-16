import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import AiStrategyBox from "@/components/trading/AiStrategyBox";
import CommodityNewsBox from "@/components/trading/CommodityNewsBox";
import TradingViewChart from "@/components/trading/TradingViewChart";
import { TradingPair, CandlestickData } from "@shared/schema";
import { generateMockCandlestickData } from "@/lib/mockData";
import { webSocketService } from "@/lib/websocket";
import {
  Home as HomeIcon,
  TrendingUp,
  BarChart4,
  Clock,
  Calendar,
  History,
  Info,
  AlertCircle,
  Package,
  CircleDollarSign,
  Percent,
  Gauge,
  ChevronDown,
  ChevronUp,
  BadgeDollarSign,
  ShieldAlert,
  ExternalLink
} from "lucide-react";

// Mock trading pairs for commodities
const commodityPairs = [
  {
    id: 1,
    name: "GOLD/USD",
    baseAsset: "GOLD",
    quoteAsset: "USD",
    price: 2320.45,
    change24h: 1.25,
    categoryId: 3,
    isActive: true
  },
  {
    id: 2,
    name: "SILVER/USD",
    baseAsset: "SILVER",
    quoteAsset: "USD",
    price: 29.85,
    change24h: 0.75,
    categoryId: 3,
    isActive: true
  },
  {
    id: 3,
    name: "OIL/USD",
    baseAsset: "OIL",
    quoteAsset: "USD",
    price: 78.30,
    change24h: -1.20,
    categoryId: 3,
    isActive: true
  },
  {
    id: 4,
    name: "NATGAS/USD",
    baseAsset: "NATGAS",
    quoteAsset: "USD",
    price: 2.45,
    change24h: -0.5,
    categoryId: 3,
    isActive: true
  },
  {
    id: 5,
    name: "COPPER/USD",
    baseAsset: "COPPER",
    quoteAsset: "USD",
    price: 4.25,
    change24h: 0.35,
    categoryId: 3,
    isActive: true
  },
  {
    id: 6,
    name: "WHEAT/USD",
    baseAsset: "WHEAT",
    quoteAsset: "USD",
    price: 612.75,
    change24h: 0.85,
    categoryId: 3,
    isActive: true
  },
  {
    id: 7,
    name: "CORN/USD",
    baseAsset: "CORN",
    quoteAsset: "USD",
    price: 432.50,
    change24h: -0.65,
    categoryId: 3,
    isActive: true
  }
];

export default function CommodityTrading() {
  const { pair: pairParam } = useParams();
  const [, navigate] = useLocation();
  const [marginMode, setMarginMode] = useState<'cross' | 'isolated'>('cross');
  const [leverage, setLeverage] = useState<number>(10);
  const [currentPair, setCurrentPair] = useState<TradingPair>(commodityPairs[0]);
  const [orderType, setOrderType] = useState<string>('market');
  const [orderSide, setOrderSide] = useState<string>('buy');
  const [amount, setAmount] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [showLiquidationPrice, setShowLiquidationPrice] = useState<boolean>(false);
  const [candleData, setCandleData] = useState<CandlestickData[]>([]);
  const [timeFrame, setTimeFrame] = useState<string>('1h');
  const [chartType, setChartType] = useState<'candlestick' | 'line' | 'area'>('line');

  // Connect to WebSocket when component mounts
  useEffect(() => {
    webSocketService.connect();
    
    // Return cleanup function
    return () => {
      if (currentPair) {
        webSocketService.unsubscribe(currentPair.name);
      }
    };
  }, []);

  useEffect(() => {
    // Get blockchain selection from localStorage
    const blockchainName = localStorage.getItem('selectedBlockchainName');
    if (!blockchainName) {
      navigate("/select-blockchain");
      return;
    }

    // Set the current pair based on URL param or default to first pair
    if (pairParam) {
      const foundPair = commodityPairs.find(p => p.name === decodeURIComponent(pairParam));
      if (foundPair) {
        setCurrentPair(foundPair);
        setPrice(foundPair.price.toString());
      }
    }
  }, [pairParam, navigate]);
  
  // Subscribe to current pair's market data
  useEffect(() => {
    if (currentPair) {
      // Unsubscribe from previous pair if exists
      webSocketService.unsubscribe(currentPair.name);
      // Subscribe to new pair
      webSocketService.subscribe(currentPair.name);
      
      // Setup message handler for market data updates
      const removeListener = webSocketService.onMessage((event) => {
        try {
          // Skip processing if data is not provided or is not a string
          if (!event.data || typeof event.data !== 'string') {
            return;
          }
          
          const message = JSON.parse(event.data);
          // Skip if message type is not what we expect
          if (!message || (message.type !== 'marketData' && message.type !== 'marketUpdate')) {
            return;
          }
          
          // Check if this message is for our current pair
          if (message.pair === currentPair.name || (message.data && message.data.pair === currentPair.name)) {
            // Update candlestick data if available
            const data = message.data || message;
            if (data.candlesticks && Array.isArray(data.candlesticks) && data.candlesticks.length > 0) {
              setCandleData(data.candlesticks);
            }
          }
        } catch (error) {
          // Silently ignore JSON parsing errors - the message might not be for us
          // Only log actual processing errors
          if (error instanceof SyntaxError) {
            console.debug('Received non-JSON message from WebSocket');
          } else {
            console.error('Error processing market data:', error);
          }
        }
      });
      
      return () => {
        removeListener();
      };
    }
  }, [currentPair]);
  
  // Fallback to generate mock candle data when WebSocket data is not available
  useEffect(() => {
    // Generate candlestick data with the current pair and timeframe
    const newData = generateMockCandlestickData(timeFrame, 100);
    
    // Adjust the prices to be centered around the current pair's price
    const scaleFactor = currentPair.price / newData[newData.length - 1].close;
    const adjustedData = newData.map(candle => ({
      ...candle,
      open: candle.open * scaleFactor,
      high: candle.high * scaleFactor,
      low: candle.low * scaleFactor,
      close: candle.close * scaleFactor
    }));
    
    setCandleData(adjustedData);
  }, [currentPair.price, timeFrame]);

  const handleLeverageChange = (newLeverage: number) => {
    if (newLeverage >= 1 && newLeverage <= 100) {
      setLeverage(newLeverage);
    }
  };

  const handlePlaceOrder = () => {
    // Mock order placement
    console.log("Placing CFD order:", {
      pair: currentPair.name,
      type: orderType,
      side: orderSide,
      amount: parseFloat(amount),
      price: orderType === 'market' ? currentPair.price : parseFloat(price),
      leverage: leverage,
      marginMode: marginMode
    });

    // Reset form
    setAmount('');
    setPrice('');
  };
  
  // Calculate liquidation price (simplified formula)
  const calculateLiquidationPrice = (): string => {
    if (!amount || isNaN(parseFloat(amount))) return "N/A";
    
    const entryPrice = orderType === 'market' ? currentPair.price : (parseFloat(price) || currentPair.price);
    const positionSize = parseFloat(amount) * entryPrice;
    const margin = positionSize / leverage;
    const maintenanceMargin = margin * 0.5; // 50% of initial margin as example
    
    let liquidationPrice;
    if (orderSide === 'buy') {
      liquidationPrice = entryPrice * (1 - (margin - maintenanceMargin) / positionSize);
    } else {
      liquidationPrice = entryPrice * (1 + (margin - maintenanceMargin) / positionSize);
    }
    
    return liquidationPrice.toFixed(2);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0e11] text-white">
      {/* Header - Bybit style */}
      <header className="bybit-nav py-3 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-50 backdrop-blur-sm bg-opacity-90 border-b border-[var(--border-color)]">
        <div className="flex items-center">
          <span className="text-[#f7a600] text-xl font-bold">Fly<span className="text-white">Crypto</span></span>
          <div className="ml-6 flex items-center space-x-1">
            <span className="py-1 px-3 bg-[#f7a600]/10 text-[#f7a600] rounded-full text-xs font-semibold">CFD</span>
            <span className="py-1 px-3 bg-[#22262f] text-neutral-300 rounded-full text-xs font-medium">Commodities</span>
          </div>
          <div className="ml-6 hidden md:flex items-center space-x-4">
            <span className="text-neutral-400 text-sm">BTC: <span className="text-[#00c076]">$61,245.30</span></span>
            <span className="text-neutral-400 text-sm">ETH: <span className="text-[#00c076]">$3,145.55</span></span>
            <span className="text-neutral-400 text-sm">Market Cap: <span className="text-white">$2.26T</span></span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="bg-[#22262f] rounded-md p-1 hidden sm:flex items-center">
            <div className="text-xs text-[#f7a600] bg-[#181c25] px-3 py-1 rounded-sm">USD</div>
            <div className="text-xs text-neutral-400 px-3 py-1 rounded-sm">EUR</div>
            <div className="text-xs text-neutral-400 px-3 py-1 rounded-sm">BTC</div>
          </div>
          
          <ThemeToggle />

          <Button 
            onClick={() => navigate("/")} 
            variant="outline"
            className="text-white hover:bg-[#22262f] transition-colors border-[var(--border-color)] text-sm"
            size="sm"
          >
            <HomeIcon className="h-4 w-4 mr-2" />
            Home
          </Button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar - Bybit style */}
        <div className="w-full md:w-64 border-r border-[var(--border-color)] bg-[#181c25] p-4 md:sticky md:top-16 md:h-[calc(100vh-4rem)]">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold mb-3 text-neutral-200">Commodity CFDs</h2>
            <span className="text-xs bg-[#f7a600]/20 text-[#f7a600] rounded-full px-2 py-0.5">0% Commission</span>
          </div>

          <div className="space-y-1 max-h-48 overflow-auto custom-scrollbar mt-2">
            {commodityPairs.map(pair => (
              <div key={pair.id} 
                className={`flex items-center justify-between p-2 rounded hover:bg-[#22262f] cursor-pointer transition-all ${
                  currentPair.id === pair.id 
                    ? 'bg-[#22262f] border-l-2 border-[#f7a600] pl-1' 
                    : ''
                }`}
                onClick={() => navigate(`/commodity-trading/${encodeURIComponent(pair.name)}`)}
              >
                <div className="flex items-center">
                  <Package className="h-4 w-4 text-[#f7a600] mr-2" />
                  <span>{pair.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm">${pair.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                  <div className={pair.change24h >= 0 ? 'text-[#00c076] text-xs flex items-center justify-end' : 'text-[#ff5353] text-xs flex items-center justify-end'}>
                    {pair.change24h >= 0 ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    {Math.abs(pair.change24h)}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-[#22262f] rounded-md border border-[var(--border-color)]">
            <h3 className="font-semibold mb-2 flex items-center text-neutral-200">
              <Info className="h-4 w-4 text-[#f7a600] mr-2" />
              CFD Benefits
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center text-neutral-300">
                <CircleDollarSign className="h-4 w-4 text-[#00c076] mr-2" />
                Trade with Leverage
              </li>
              <li className="flex items-center text-neutral-300">
                <Gauge className="h-4 w-4 text-[#1da2b4] mr-2" />
                No Physical Delivery
              </li>
              <li className="flex items-center text-neutral-300">
                <Percent className="h-4 w-4 text-[#4a4af4] mr-2" />
                Profit from Both Directions
              </li>
              <li className="flex items-center text-neutral-300">
                <TrendingUp className="h-4 w-4 text-[#f7a600] mr-2" />
                Low Capital Requirements
              </li>
            </ul>
          </div>

          <div className="mt-4 p-4 bg-[#22262f] border border-[var(--border-color)] rounded-md">
            <h3 className="font-semibold mb-2 flex items-center text-neutral-200">
              <ShieldAlert className="h-4 w-4 text-[#ff5353] mr-2" />
              Risk Warning
            </h3>
            <p className="text-xs text-neutral-400">
              CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. 78% of retail investor accounts lose money when trading CFDs. Consider if you understand how CFDs work and if you can afford the high risk of losing your money.
            </p>
          </div>
        </div>

        {/* Main Trading Area - Bybit style */}
        <main className="flex-1 p-4">
          {/* Top Trading Bar - Bybit style */}
          <div className="bybit-card p-4 mb-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold flex items-center">
                  <Package className="mr-2 h-6 w-6 text-[#f7a600]" />
                  {currentPair.name} <span className="ml-2 text-xs bg-[#f7a600]/10 text-[#f7a600] px-2 py-1 rounded">CFD</span>
                </h1>
                <p className="text-neutral-400 text-sm mt-1">
                  Contract for Difference | Multiplier: <span className="text-white font-medium">{leverage}x</span>
                </p>
              </div>

              <div className="mt-4 md:mt-0 flex flex-col items-end">
                <div className="flex items-center mb-1">
                  <span className="text-2xl font-bold">${currentPair.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${currentPair.change24h >= 0 ? 'bg-[#00c076]/10 text-[#00c076]' : 'bg-[#ff5353]/10 text-[#ff5353]'}`}>
                    {currentPair.change24h >= 0 ? '+' : ''}{currentPair.change24h}%
                  </span>
                </div>
                <span className="text-xs text-neutral-500">Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Order Form - Bybit style */}
            <div className="bybit-card col-span-1">
              <div className="p-4">
                <h2 className="text-lg font-bold mb-4 text-neutral-200">Place CFD Order</h2>

                <Tabs defaultValue="market" className="mb-4" onValueChange={(value) => setOrderType(value)}>
                  <TabsList className="grid grid-cols-2 bg-[#22262f]">
                    <TabsTrigger value="market" className="data-[state=active]:bg-[#181c25] data-[state=active]:text-white">Market</TabsTrigger>
                    <TabsTrigger value="limit" className="data-[state=active]:bg-[#181c25] data-[state=active]:text-white">Limit</TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="flex mb-4">
                  <Button 
                    className={`flex-1 ${orderSide === 'buy' 
                      ? 'bg-[#16a34a] hover:bg-[#16a34a]/90 text-white' 
                      : 'bg-[#22262f] hover:bg-[#2b313a] text-neutral-300'}`}
                    onClick={() => setOrderSide('buy')}
                  >
                    Buy
                  </Button>
                  <Button 
                    className={`flex-1 ml-2 ${orderSide === 'sell' 
                      ? 'bg-[#dc2626] hover:bg-[#dc2626]/90 text-white' 
                      : 'bg-[#22262f] hover:bg-[#2b313a] text-neutral-300'}`}
                    onClick={() => setOrderSide('sell')}
                  >
                    Sell
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="amount" className="text-neutral-400 text-sm">Amount</Label>
                    <div className="relative">
                      <Input 
                        id="amount" 
                        type="number" 
                        placeholder="0.00" 
                        className="pr-12 bybit-input bg-[#181c25] text-white"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-500">
                        Units
                      </div>
                    </div>
                  </div>

                  {orderType === 'limit' && (
                    <div>
                      <Label htmlFor="price" className="text-neutral-400 text-sm">Price</Label>
                      <div className="relative">
                        <Input 
                          id="price" 
                          type="number" 
                          placeholder={currentPair.price.toString()} 
                          className="pr-12 bybit-input bg-[#181c25] text-white"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-500">
                          USD
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <Label htmlFor="leverage" className="text-neutral-400 text-sm">Leverage</Label>
                      <span className="text-sm font-medium">{leverage}x</span>
                    </div>
                    <div className="flex items-center py-2 px-4 bg-[#181c25] rounded-md">
                      <Button 
                        variant="ghost"
                        size="sm" 
                        className="h-8 w-8 p-0 text-neutral-400 hover:text-white"
                        onClick={() => handleLeverageChange(leverage - 1)}
                        disabled={leverage <= 1}
                      >
                        -
                      </Button>
                      <Input 
                        id="leverage" 
                        type="range" 
                        min="1" 
                        max="100" 
                        value={leverage} 
                        onChange={(e) => handleLeverageChange(parseInt(e.target.value))}
                        className="mx-2 accent-[#f7a600]"
                      />
                      <Button 
                        variant="ghost"
                        size="sm" 
                        className="h-8 w-8 p-0 text-neutral-400 hover:text-white"
                        onClick={() => handleLeverageChange(leverage + 1)}
                        disabled={leverage >= 100}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-400">Margin Mode</span>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="margin-mode" 
                          checked={marginMode === 'cross'} 
                          onCheckedChange={(checked) => setMarginMode(checked ? 'cross' : 'isolated')}
                          className="data-[state=checked]:bg-[#f7a600]"
                        />
                        <Label htmlFor="margin-mode" className="text-sm">{marginMode === 'cross' ? 'Cross' : 'Isolated'}</Label>
                      </div>
                    </div>

                    <div className="px-3 py-2 bg-[#181c25] rounded-md space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-400">Required Margin</span>
                        <span className="font-mono">
                          ${amount && !isNaN(parseFloat(amount)) 
                            ? ((parseFloat(amount) * (orderType === 'limit' ? parseFloat(price) || currentPair.price : currentPair.price)) / leverage).toFixed(2) 
                            : '0.00'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-400">Fees</span>
                        <span className="font-mono text-[#00c076]">$0.00</span>
                      </div>
                    </div>
                    
                    {/* Liquidation Price */}
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="p-0 h-auto text-[#f7a600] text-xs flex items-center"
                      onClick={() => setShowLiquidationPrice(!showLiquidationPrice)}
                    >
                      <ShieldAlert className="h-3 w-3 mr-1" />
                      {showLiquidationPrice ? "Hide" : "Show"} Liquidation Price
                    </Button>
                    
                    {showLiquidationPrice && (
                      <div className="mt-2 p-3 bg-[#181c25] rounded-md text-xs border border-[var(--border-color)]">
                        <div className="flex justify-between items-center">
                          <span className="text-neutral-400">Est. Liquidation Price:</span>
                          <span className={`font-mono ${orderSide === 'buy' ? 'text-[#dc2626]' : 'text-[#16a34a]'}`}>
                            ${calculateLiquidationPrice()}
                          </span>
                        </div>
                        <p className="mt-1 text-neutral-500 text-xs">
                          This is an estimate and may vary based on market conditions.
                        </p>
                      </div>
                    )}
                  </div>

                  <Button 
                    className={`w-full mt-4 ${orderSide === 'buy' 
                      ? 'bg-[#16a34a] hover:bg-[#16a34a]/90' 
                      : 'bg-[#dc2626] hover:bg-[#dc2626]/90'}`}
                    disabled={!amount || parseFloat(amount) <= 0}
                    onClick={handlePlaceOrder}
                  >
                    {orderSide === 'buy' ? 'Buy/Long' : 'Sell/Short'} {currentPair.baseAsset}
                  </Button>
                </div>
              </div>
            </div>

            {/* Price Chart - Bybit style */}
            <div className="col-span-2">
              <div className="bybit-card h-full">
                <div className="p-4 pb-0">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-neutral-200">{currentPair.name} Price Chart</h2>
                    <div className="flex space-x-1">
                      <div className="flex border border-[var(--border-color)] rounded overflow-hidden mr-2">
                        {['1m', '5m', '15m', '1h', '4h', '1d'].map(tf => (
                          <button 
                            key={tf}
                            className={`px-2 py-1 text-xs ${timeFrame === tf 
                              ? 'bg-[#22262f] text-[#f7a600]' 
                              : 'bg-[#181c25] text-neutral-400 hover:bg-[#22262f]'}`}
                            onClick={() => setTimeFrame(tf)}
                          >
                            {tf.toUpperCase()}
                          </button>
                        ))}
                      </div>
                      <div className="flex border border-[var(--border-color)] rounded overflow-hidden">
                        {[
                          { type: 'candlestick', label: 'Candle' },
                          { type: 'line', label: 'Line' },
                          { type: 'area', label: 'Area' }
                        ].map(item => (
                          <button 
                            key={item.type}
                            className={`px-2 py-1 text-xs ${chartType === item.type 
                              ? 'bg-[#22262f] text-[#f7a600]' 
                              : 'bg-[#181c25] text-neutral-400 hover:bg-[#22262f]'}`}
                            onClick={() => setChartType(item.type as any)}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <TradingViewChart 
                    candleData={candleData} 
                    pair={currentPair.name} 
                    height={400} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Market Information - Bybit style */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bybit-card">
              <div className="bybit-card-header">
                <h2 className="bybit-card-title">CFD Contract Specifications</h2>
                <span className="bybit-badge bybit-badge-yellow">Perpetual</span>
              </div>
              <div className="bybit-card-content">
                <div className="space-y-0">
                  <div className="bybit-market-data-row">
                    <span className="bybit-market-data-label">Contract Type</span>
                    <span className="bybit-market-data-value">Contracts for Difference (CFD)</span>
                  </div>
                  <div className="bybit-market-data-row">
                    <span className="bybit-market-data-label">Trading Hours</span>
                    <span className="bybit-market-data-value">24/7</span>
                  </div>
                  <div className="bybit-market-data-row">
                    <span className="bybit-market-data-label">Min Contract Size</span>
                    <span className="bybit-market-data-value">0.01 Units</span>
                  </div>
                  <div className="bybit-market-data-row">
                    <span className="bybit-market-data-label">Max Leverage</span>
                    <span className="bybit-market-data-value">Up to 100x</span>
                  </div>
                  <div className="bybit-market-data-row">
                    <span className="bybit-market-data-label">Spread</span>
                    <span className="bybit-market-data-value">Variable (Market Conditions)</span>
                  </div>
                  <div className="bybit-market-data-row">
                    <span className="bybit-market-data-label">Settlement</span>
                    <span className="bybit-market-data-value">Cash Settlement Only</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bybit-card">
              <div className="bybit-card-header">
                <h2 className="bybit-card-title">Market Information</h2>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-neutral-500 mr-1" /> 
                  <span className="text-xs text-neutral-500">Last updated: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>
              <div className="bybit-card-content">
                <div className="space-y-0">
                  <div className="bybit-market-data-row">
                    <span className="bybit-market-data-label">24h Volume</span>
                    <span className="bybit-market-data-value">$12.5M</span>
                  </div>
                  <div className="bybit-market-data-row">
                    <span className="bybit-market-data-label">24h High</span>
                    <span className="bybit-market-data-value">${(currentPair.price * 1.02).toFixed(2)}</span>
                  </div>
                  <div className="bybit-market-data-row">
                    <span className="bybit-market-data-label">24h Low</span>
                    <span className="bybit-market-data-value">${(currentPair.price * 0.98).toFixed(2)}</span>
                  </div>
                  <div className="bybit-market-data-row">
                    <span className="bybit-market-data-label">Open Interest</span>
                    <span className="bybit-market-data-value">$8.3M</span>
                  </div>
                  <div className="bybit-market-data-row">
                    <span className="bybit-market-data-label">Funding Rate</span>
                    <span className="text-[#00c076] font-medium">+0.01%</span>
                  </div>
                  <div className="bybit-market-data-row">
                    <span className="bybit-market-data-label">Funding Interval</span>
                    <span className="bybit-market-data-value">8 Hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Strategy and News Section - Bybit style */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <AiStrategyBox pairName={currentPair.name} pairId={currentPair.id} />
            <CommodityNewsBox commodityType={currentPair.name} />
          </div>

          {/* Open Positions - Bybit style */}
          <div className="mt-4">
            <div className="bybit-card">
              <div className="bybit-card-header border-b-0">
                <div className="flex items-center space-x-2">
                  <h2 className="bybit-card-title">Positions</h2>
                  <div className="text-xs py-1 px-2 bg-[#f7a600]/10 text-[#f7a600] rounded-sm">CFD</div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs bg-[#22262f] text-neutral-300 py-1 px-2 rounded">Demo Account</span>
                  <Switch 
                    id="hide-zero-positions" 
                    className="data-[state=checked]:bg-[#f7a600] scale-75"
                  />
                  <Label htmlFor="hide-zero-positions" className="text-xs text-neutral-400">Hide Zero</Label>
                </div>
              </div>
              
              <div className="px-4 pb-4">
                <div className="flex items-center border-b border-[var(--border-color)] pb-2 text-xs text-neutral-400">
                  <div className="w-[15%]">Symbol</div>
                  <div className="w-[15%]">Size</div>
                  <div className="w-[15%]">Entry Price</div>
                  <div className="w-[15%]">Mark Price</div>
                  <div className="w-[15%]">Liq. Price</div>
                  <div className="w-[15%]">Margin</div>
                  <div className="w-[10%]">PnL</div>
                </div>
                
                <div className="text-center py-12 text-neutral-400">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>You don't have any open positions yet.</p>
                  <p className="text-xs mt-2 text-neutral-500">Place a trade to get started with commodity CFDs</p>
                  
                  <Button 
                    variant="outline" 
                    className="mt-4 text-xs bg-transparent border-[var(--border-color)] hover:bg-[#22262f] text-neutral-300"
                    size="sm"
                  >
                    <Clock className="h-3 w-3 mr-1" />
                    Position History
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}