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
import {
  Home as HomeIcon,
  TrendingUp,
  BarChart4,
  Clock,
  Calendar,
  Info,
  AlertCircle,
  Package,
  CircleDollarSign,
  Percent,
  Gauge,
  ChevronDown,
  ChevronUp,
  BadgeDollarSign,
  ShieldAlert
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

  useEffect(() => {
    // Get blockchain selection from localStorage
    const blockchainName = localStorage.getItem('selectedBlockchainName');
    if (!blockchainName) {
      navigate("/select-blockchain");
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
  
  // Generate candlestick data when pair or timeframe changes
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
    <div className="min-h-screen flex flex-col bg-primary-900 text-white">
      {/* Header */}
      <header className="border-b border-primary-700 bg-primary-800 py-3 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-50 backdrop-blur-sm bg-opacity-80">
        <div className="flex items-center">
          <span className="text-accent-500 text-xl font-bold">Fly<span className="text-white">Crypto</span></span>
          <span className="ml-4 py-1 px-3 bg-accent-500/20 text-accent-500 rounded-full text-xs font-semibold">CFD Trading</span>
        </div>

        <div className="flex items-center space-x-4">
          <Button 
            onClick={() => navigate(`/commodity-trading-pro/${encodeURIComponent(currentPair.name)}`)} 
            variant="outline"
            className="text-accent-500 border-accent-500"
            size="sm"
          >
            <BarChart4 className="h-4 w-4 mr-2" />
            Pro Mode
          </Button>

          <ThemeToggle />

          <Button 
            onClick={() => navigate("/")} 
            variant="ghost"
            className="text-white"
            size="sm"
          >
            <HomeIcon className="h-4 w-4 mr-2" />
            Home
          </Button>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-64 border-r border-primary-700 bg-primary-800 p-4 md:sticky md:top-16 md:h-[calc(100vh-4rem)]">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold mb-3">Commodity CFDs</h2>
            <span className="text-xs bg-accent-600/20 text-accent-400 rounded-full px-2 py-0.5">0% Commission</span>
          </div>

          <div className="space-y-2 max-h-48 overflow-auto custom-scrollbar">
            {commodityPairs.map(pair => (
              <div key={pair.id} 
                className={`flex items-center justify-between p-2 rounded hover:bg-primary-700 cursor-pointer transition-all ${currentPair.id === pair.id ? 'bg-primary-700 border-l-2 border-accent-500 pl-1' : ''}`}
                onClick={() => navigate(`/commodity-trading/${encodeURIComponent(pair.name)}`)}
              >
                <div className="flex items-center">
                  <Package className="h-4 w-4 text-accent-500 mr-2" />
                  <span>{pair.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-mono">${pair.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                  <div className={pair.change24h >= 0 ? 'text-green-500 text-xs flex items-center' : 'text-red-500 text-xs flex items-center'}>
                    {pair.change24h >= 0 ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    {Math.abs(pair.change24h)}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-primary-700 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center">
              <Info className="h-4 w-4 text-accent-500 mr-2" />
              CFD Benefits
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <CircleDollarSign className="h-4 w-4 text-green-500 mr-2" />
                Trade with Leverage
              </li>
              <li className="flex items-center">
                <Gauge className="h-4 w-4 text-blue-500 mr-2" />
                No Physical Delivery
              </li>
              <li className="flex items-center">
                <Percent className="h-4 w-4 text-purple-500 mr-2" />
                Profit from Both Directions
              </li>
              <li className="flex items-center">
                <TrendingUp className="h-4 w-4 text-orange-500 mr-2" />
                Low Capital Requirements
              </li>
            </ul>
          </div>

          <div className="mt-4 p-4 bg-gradient-to-r from-accent-500/20 to-primary-700 rounded-lg">
            <h3 className="font-semibold mb-2">Risk Warning</h3>
            <p className="text-xs text-neutral-300">
              CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage. 78% of retail investor accounts lose money when trading CFDs. Consider if you understand how CFDs work and if you can afford the high risk of losing your money.
            </p>
          </div>
        </div>

        {/* Main Trading Area */}
        <main className="flex-1 p-4">
          {/* Top Trading Bar */}
          <div className="bg-primary-800 p-4 rounded-lg mb-4 border border-primary-700">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold flex items-center">
                  <Package className="mr-2 h-6 w-6 text-accent-500" />
                  {currentPair.name} <span className="ml-2 text-sm bg-primary-700 px-2 py-1 rounded">CFD</span>
                </h1>
                <p className="text-neutral-300 text-sm mt-1">
                  Contract for Difference | Multiplier: {leverage}x
                </p>
              </div>

              <div className="mt-4 md:mt-0 flex flex-col items-end">
                <div className="flex items-center mb-1">
                  <span className="text-2xl font-bold">${currentPair.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${currentPair.change24h >= 0 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                    {currentPair.change24h >= 0 ? '+' : ''}{currentPair.change24h}%
                  </span>
                </div>
                <span className="text-xs text-neutral-400">Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Order Form */}
            <Card className="bg-primary-800 border-primary-700 col-span-1">
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4">Place CFD Order</h2>

                <Tabs defaultValue="market" className="mb-4" onValueChange={(value) => setOrderType(value)}>
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="market">Market</TabsTrigger>
                    <TabsTrigger value="limit">Limit</TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="flex mb-4">
                  <Button 
                    className={`flex-1 ${orderSide === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-primary-700'}`}
                    onClick={() => setOrderSide('buy')}
                  >
                    Buy
                  </Button>
                  <Button 
                    className={`flex-1 ml-2 ${orderSide === 'sell' ? 'bg-red-600 hover:bg-red-700' : 'bg-primary-700'}`}
                    onClick={() => setOrderSide('sell')}
                  >
                    Sell
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <div className="relative">
                      <Input 
                        id="amount" 
                        type="number" 
                        placeholder="0.00" 
                        className="pr-12"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-400">
                        Units
                      </div>
                    </div>
                  </div>

                  {orderType === 'limit' && (
                    <div>
                      <Label htmlFor="price">Price</Label>
                      <div className="relative">
                        <Input 
                          id="price" 
                          type="number" 
                          placeholder={currentPair.price.toString()} 
                          className="pr-12"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-400">
                          USD
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="leverage">Leverage: {leverage}x</Label>
                    <div className="flex items-center">
                      <Button 
                        variant="outline" 
                        size="sm" 
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
                        className="mx-2"
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleLeverageChange(leverage + 1)}
                        disabled={leverage >= 100}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-neutral-400">Margin Mode</span>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="margin-mode" 
                          checked={marginMode === 'cross'} 
                          onCheckedChange={(checked) => setMarginMode(checked ? 'cross' : 'isolated')}
                        />
                        <Label htmlFor="margin-mode">{marginMode === 'cross' ? 'Cross' : 'Isolated'}</Label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span className="text-neutral-400">Required Margin</span>
                      <span className="font-mono">
                        ${amount && !isNaN(parseFloat(amount)) 
                          ? ((parseFloat(amount) * (orderType === 'limit' ? parseFloat(price) || currentPair.price : currentPair.price)) / leverage).toFixed(2) 
                          : '0.00'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mb-2 text-sm">
                      <span className="text-neutral-400">Fees</span>
                      <span className="font-mono text-green-500">$0.00</span>
                    </div>
                    
                    {/* Liquidation Price */}
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="p-0 h-auto text-accent-400 text-xs flex items-center"
                      onClick={() => setShowLiquidationPrice(!showLiquidationPrice)}
                    >
                      <ShieldAlert className="h-3 w-3 mr-1" />
                      {showLiquidationPrice ? "Hide" : "Show"} Liquidation Price
                    </Button>
                    
                    {showLiquidationPrice && (
                      <div className="mt-2 p-2 bg-primary-700/60 rounded-md border border-primary-600 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="text-neutral-400">Estimated Liquidation Price:</span>
                          <span className={`font-mono ${orderSide === 'buy' ? 'text-red-500' : 'text-green-500'}`}>
                            ${calculateLiquidationPrice()}
                          </span>
                        </div>
                        <p className="mt-1 text-neutral-500 text-xs">
                          This price is estimated and may vary based on market volatility and margin requirements.
                        </p>
                      </div>
                    )}
                  </div>

                  <Button 
                    className={`w-full mt-4 ${orderSide === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                    disabled={!amount || parseFloat(amount) <= 0}
                    onClick={handlePlaceOrder}
                  >
                    {orderSide === 'buy' ? 'Buy' : 'Sell'} {currentPair.baseAsset} CFD
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Price Chart */}
            <div className="col-span-2">
              <Card className="bg-primary-800 border-primary-700 h-full">
                <CardContent className="pt-4 px-4 pb-0">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{currentPair.name} Price Chart</h2>
                    <div className="flex space-x-1">
                      <div className="flex border border-primary-700 rounded overflow-hidden mr-2">
                        {['1m', '5m', '15m', '1h', '4h', '1d'].map(tf => (
                          <button 
                            key={tf}
                            className={`px-2 py-1 text-xs ${timeFrame === tf ? 'bg-primary-700' : 'bg-primary-800 hover:bg-primary-700/50'}`}
                            onClick={() => setTimeFrame(tf)}
                          >
                            {tf.toUpperCase()}
                          </button>
                        ))}
                      </div>
                      <div className="flex border border-primary-700 rounded overflow-hidden">
                        {[
                          { type: 'candlestick', label: 'Candle' },
                          { type: 'line', label: 'Line' },
                          { type: 'area', label: 'Area' }
                        ].map(item => (
                          <button 
                            key={item.type}
                            className={`px-2 py-1 text-xs ${chartType === item.type ? 'bg-primary-700' : 'bg-primary-800 hover:bg-primary-700/50'}`}
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
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Market Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card className="bg-primary-800 border-primary-700">
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4">CFD Contract Specifications</h2>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-primary-700">
                    <span className="text-neutral-400">Contract Type</span>
                    <span>Contracts for Difference (CFD)</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-primary-700">
                    <span className="text-neutral-400">Trading Hours</span>
                    <span>24/7</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-primary-700">
                    <span className="text-neutral-400">Min Contract Size</span>
                    <span>0.01 Units</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-primary-700">
                    <span className="text-neutral-400">Max Leverage</span>
                    <span>Up to 100x</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-primary-700">
                    <span className="text-neutral-400">Spread</span>
                    <span>Variable (Market Conditions)</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-neutral-400">Settlement</span>
                    <span>Cash Settlement Only</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary-800 border-primary-700">
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4">Market Information</h2>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-primary-700">
                    <span className="text-neutral-400">24h Volume</span>
                    <span>$12.5M</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-primary-700">
                    <span className="text-neutral-400">24h High</span>
                    <span>${(currentPair.price * 1.02).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-primary-700">
                    <span className="text-neutral-400">24h Low</span>
                    <span>${(currentPair.price * 0.98).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-primary-700">
                    <span className="text-neutral-400">Open Interest</span>
                    <span>$8.3M</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-primary-700">
                    <span className="text-neutral-400">Funding Rate</span>
                    <span className="text-green-500">+0.01%</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-neutral-400">Funding Interval</span>
                    <span>8 Hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Strategy and News Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <AiStrategyBox pairName={currentPair.name} pairId={currentPair.id} />
            <CommodityNewsBox commodityType={currentPair.name} />
          </div>

          {/* Open Positions */}
          <div className="grid grid-cols-1 gap-4 mt-4">
            <Card className="bg-primary-800 border-primary-700">
              <CardContent className="pt-6">
                <h2 className="text-xl font-bold mb-4">Your Open CFD Positions</h2>
                <div className="text-center py-8 text-neutral-400">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>You don't have any open positions yet.</p>
                  <p className="text-sm mt-2">Place a trade to get started!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}