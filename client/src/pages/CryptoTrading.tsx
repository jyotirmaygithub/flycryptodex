import { useState, useEffect, useMemo } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { TradingPair } from "@shared/schema";
import { CandlestickData } from "@shared/schema";
import { generateMockCandlestickData } from "@/lib/mockData";
import SimpleChart from "@/components/trading/SimpleChart";
import TradingViewChart from "@/components/trading/TradingViewChart";
import AiStrategyPanel from "@/components/trading/AiStrategyPanel";
import {
  Home as HomeIcon,
  TrendingUp,
  TrendingDown,
  ChevronsUpDown,
  Sliders,
  LineChart,
  Clock,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Info,
  Bell,
  Settings,
  User,
  HelpCircle,
  AreaChart,
  CandlestickChart,
  PieChart,
  Wallet,
  Search,
  History,
  Bookmark,
  CheckCircle,
  AlertTriangle,
  BarChart2,
  DollarSign,
  ArrowRight,
  ArrowDownRight,
  ArrowUpRight,
  Star,
  StarOff,
  Zap,
  RefreshCw,
  Globe
} from "lucide-react";

// Mock trading pairs for crypto
const cryptoPairs = [
  { id: 1, name: 'BTC/USD', baseAsset: 'BTC', quoteAsset: 'USD', price: 61485.23, change24h: 2.34, categoryId: 2, isActive: true },
  { id: 2, name: 'ETH/USD', baseAsset: 'ETH', quoteAsset: 'USD', price: 3482.78, change24h: 1.56, categoryId: 2, isActive: true },
  { id: 3, name: 'SOL/USD', baseAsset: 'SOL', quoteAsset: 'USD', price: 142.35, change24h: 4.27, categoryId: 2, isActive: true },
  { id: 4, name: 'BNB/USD', baseAsset: 'BNB', quoteAsset: 'USD', price: 612.48, change24h: -0.82, categoryId: 2, isActive: true },
  { id: 5, name: 'XRP/USD', baseAsset: 'XRP', quoteAsset: 'USD', price: 0.5672, change24h: -1.23, categoryId: 2, isActive: true },
  { id: 6, name: 'ADA/USD', baseAsset: 'ADA', quoteAsset: 'USD', price: 0.4821, change24h: 0.94, categoryId: 2, isActive: true },
];

// Mock chart component
const PlaceholderChart = () => {
  return (
    <div className="w-full h-96 bg-primary-800 rounded-lg border border-primary-700 flex items-center justify-center mb-4">
      <TrendingUp className="w-16 h-16 text-accent-500 opacity-20" />
    </div>
  );
}

function FundingInfo() {
  return (
    <Card className="border-primary-700 bg-primary-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center">
          <Clock className="h-4 w-4 mr-2 text-accent-500" />
          Funding Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-primary-700 rounded-md p-3 text-center">
            <div className="text-xs text-neutral-400 mb-1">Current Rate</div>
            <div className="text-green-500 font-semibold">+0.0103%</div>
          </div>
          
          <div className="bg-primary-700 rounded-md p-3 text-center">
            <div className="text-xs text-neutral-400 mb-1">Next Funding</div>
            <div className="font-mono">03:12:45</div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-400">Funding Interval:</span>
            <span>8 hours</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-400">Est. APR:</span>
            <span className="text-green-500">+12.68%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-400">Predicted Rate:</span>
            <span className="text-green-500">+0.0115%</span>
          </div>
        </div>
        
        <div className="pt-2 border-t border-primary-700">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-xs text-neutral-400 flex items-start">
                  <AlertCircle className="h-3 w-3 mr-1.5 mt-0.5 flex-shrink-0" />
                  <span>
                    Funding rates are payments between long and short positions. When the rate is positive, 
                    longs pay shorts.
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="w-64 p-3">
                <p className="text-xs mb-2">
                  Funding rates help keep the perpetual contract price in line with the index price.
                </p>
                <p className="text-xs">
                  Positive rates indicate that long positions are more popular, so they pay short positions 
                  to balance the market.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
}

function LiquidationCalculator({ pair }: { pair: TradingPair }) {
  const [positionSize, setPositionSize] = useState<number>(0.1);
  const [leverage, setLeverage] = useState<number>(10);
  const [side, setSide] = useState<'long' | 'short'>('long');
  const [entryPrice, setEntryPrice] = useState<number>(pair.price);
  const [liquidationPrice, setLiquidationPrice] = useState<number>(0);
  
  useEffect(() => {
    // Calculate liquidation price
    // For a long position: liq = entry * (1 - initial margin / leverage)
    // For a short position: liq = entry * (1 + initial margin / leverage)
    const initialMargin = 1 / leverage; // As a decimal
    if (side === 'long') {
      const liqPrice = entryPrice * (1 - initialMargin);
      setLiquidationPrice(parseFloat(liqPrice.toFixed(2)));
    } else {
      const liqPrice = entryPrice * (1 + initialMargin);
      setLiquidationPrice(parseFloat(liqPrice.toFixed(2)));
    }
  }, [positionSize, leverage, side, entryPrice]);

  return (
    <div className="bg-primary-800 p-4 rounded-lg border border-primary-700">
      <h3 className="font-medium mb-3">Liquidation Calculator</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="position-size">Position Size (BTC)</Label>
          <Input 
            id="position-size" 
            type="number" 
            className="bg-primary-700 border-primary-600"
            value={positionSize}
            onChange={(e) => setPositionSize(parseFloat(e.target.value) || 0)}
            step={0.01}
          />
        </div>
        
        <div>
          <div className="flex justify-between mb-2">
            <Label htmlFor="leverage">Leverage: {leverage}x</Label>
          </div>
          <Slider
            id="leverage"
            min={1}
            max={100}
            step={1}
            value={[leverage]}
            onValueChange={(value) => setLeverage(value[0])}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-2">
          <Button 
            className={`py-2 ${side === 'long' ? 'bg-green-600 hover:bg-green-700' : 'bg-primary-700'}`}
            onClick={() => setSide('long')}
          >
            Long
          </Button>
          <Button 
            className={`py-2 ${side === 'short' ? 'bg-red-600 hover:bg-red-700' : 'bg-primary-700'}`}
            onClick={() => setSide('short')}
          >
            Short
          </Button>
        </div>
        
        <div>
          <Label htmlFor="entry-price">Entry Price</Label>
          <Input 
            id="entry-price" 
            type="number" 
            className="bg-primary-700 border-primary-600"
            value={entryPrice}
            onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
          />
        </div>
        
        <div className="pt-2 border-t border-primary-700">
          <div className="flex justify-between mb-2">
            <span className="text-neutral-400">Liquidation Price:</span>
            <span className="font-semibold text-yellow-500">${liquidationPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-neutral-400">Position Value:</span>
            <span>${(positionSize * entryPrice).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Required Margin:</span>
            <span>${((positionSize * entryPrice) / leverage).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CryptoOrderForm({ pair }: { pair: TradingPair }) {
  const [orderType, setOrderType] = useState<string>('Market');
  const [orderSide, setOrderSide] = useState<string>('buy');
  const [amount, setAmount] = useState<number>(0.01);
  const [price, setPrice] = useState<number>(pair.price);
  const [reduceOnly, setReduceOnly] = useState<boolean>(false);
  const [postOnly, setPostOnly] = useState<boolean>(false);
  
  // Calculate the estimated cost/value
  const estimatedValue = useMemo(() => {
    return amount * (orderType === 'Market' ? pair.price : price);
  }, [amount, orderType, pair.price, price]);
  
  // Preset amount percentages
  const setAmountPercentage = (percentage: number) => {
    // Assuming max available is 1 BTC for simplicity
    const maxAvailable = 1;
    setAmount(parseFloat((maxAvailable * percentage / 100).toFixed(8)));
  };

  const handlePlaceOrder = () => {
    console.log('Placing order:', {
      pair: pair.name,
      type: orderType,
      side: orderSide,
      amount,
      price: orderType !== 'Market' ? price : undefined,
      reduceOnly,
      postOnly
    });
    
    // Here you would call the API to place the order
    alert(`Order placed: ${orderSide.toUpperCase()} ${amount} ${pair.name} at ${orderType === 'Market' ? 'market price' : price}`);
  };

  return (
    <Card className="border-primary-700 bg-primary-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-center">
          <span>Trade {pair.name}</span>
          <Badge variant="outline" className="font-normal text-xs">
            Balance: 1.0 {pair.baseAsset}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="Market" onValueChange={setOrderType} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-2">
            <TabsTrigger value="Market">Market</TabsTrigger>
            <TabsTrigger value="Limit">Limit</TabsTrigger>
            <TabsTrigger value="Stop">Stop</TabsTrigger>
          </TabsList>
          
          <div className="grid grid-cols-2 gap-3 mt-4">
            <Button 
              className={`py-5 ${orderSide === 'buy' 
                ? 'bg-green-600 hover:bg-green-700 text-white' 
                : 'bg-primary-700 hover:bg-primary-600'}`}
              onClick={() => setOrderSide('buy')}
            >
              <ArrowUpRight className={`mr-2 h-4 w-4 ${orderSide === 'buy' ? 'opacity-100' : 'opacity-50'}`} />
              Buy / Long
            </Button>
            <Button 
              className={`py-5 ${orderSide === 'sell' 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-primary-700 hover:bg-primary-600'}`}
              onClick={() => setOrderSide('sell')}
            >
              <ArrowDownRight className={`mr-2 h-4 w-4 ${orderSide === 'sell' ? 'opacity-100' : 'opacity-50'}`} />
              Sell / Short
            </Button>
          </div>
          
          <div className="space-y-4 mt-4">
            <div>
              <div className="flex justify-between mb-1.5">
                <Label htmlFor="amount" className="text-sm">Amount ({pair.baseAsset})</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-xs text-neutral-400 flex items-center cursor-help">
                        <HelpCircle className="h-3 w-3 mr-1" />
                        Available: 1.0 {pair.baseAsset}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-60 text-xs">
                        This is the maximum amount you can trade with your current balance.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="relative">
                <Input 
                  id="amount" 
                  className="bg-primary-700 border-primary-600 pr-16"
                  value={amount} 
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  type="number"
                  step={0.0001}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <span className="text-xs font-medium text-neutral-400">{pair.baseAsset}</span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-2">
                <Button size="sm" variant="ghost" className="text-xs py-0 h-7 bg-primary-700 hover:bg-primary-600" onClick={() => setAmountPercentage(25)}>25%</Button>
                <Button size="sm" variant="ghost" className="text-xs py-0 h-7 bg-primary-700 hover:bg-primary-600" onClick={() => setAmountPercentage(50)}>50%</Button>
                <Button size="sm" variant="ghost" className="text-xs py-0 h-7 bg-primary-700 hover:bg-primary-600" onClick={() => setAmountPercentage(75)}>75%</Button>
                <Button size="sm" variant="ghost" className="text-xs py-0 h-7 bg-primary-700 hover:bg-primary-600" onClick={() => setAmountPercentage(100)}>Max</Button>
              </div>
              <div className="text-xs text-right mt-2 text-neutral-400 flex items-center justify-end">
                <DollarSign className="h-3 w-3 mr-1" />
                Value: ${estimatedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            
            {orderType !== 'Market' && (
              <div>
                <div className="flex justify-between mb-1.5">
                  <Label htmlFor="price" className="text-sm">Price ({pair.quoteAsset})</Label>
                  <span className="text-xs text-neutral-400">Current: ${pair.price.toLocaleString()}</span>
                </div>
                <div className="relative">
                  <Input 
                    id="price" 
                    className="bg-primary-700 border-primary-600 pr-16"
                    value={price} 
                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                    type="number"
                    step={0.01}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <span className="text-xs font-medium text-neutral-400">{pair.quoteAsset}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="reduceOnly" 
                  checked={reduceOnly} 
                  onCheckedChange={setReduceOnly} 
                />
                <Label htmlFor="reduceOnly" className="text-sm cursor-pointer">Reduce Only</Label>
              </div>
              
              {orderType === 'Limit' && (
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="postOnly" 
                    checked={postOnly} 
                    onCheckedChange={setPostOnly} 
                  />
                  <Label htmlFor="postOnly" className="text-sm cursor-pointer">Post Only</Label>
                </div>
              )}
            </div>
          </div>
        </Tabs>
      </CardContent>
      <CardFooter className="pt-2 border-t border-primary-700">
        <Button 
          className={`w-full py-5 flex items-center justify-center ${
            orderSide === 'buy' 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
          onClick={handlePlaceOrder}
        >
          {orderSide === 'buy' 
            ? <><ArrowUpRight className="mr-2 h-4 w-4" /> Buy {amount} {pair.baseAsset}</> 
            : <><ArrowDownRight className="mr-2 h-4 w-4" /> Sell {amount} {pair.baseAsset}</>
          }
        </Button>
      </CardFooter>
    </Card>
  );
}

function OrderBook({ pair }: { pair: TradingPair }) {
  // Mock order book data
  const maxSize = 5;
  const asks = Array(8).fill(0).map((_, i) => ({
    price: pair.price + (pair.price * 0.0005 * (i + 1)),
    size: Math.random() * maxSize,
    total: 0
  })).map((ask, i, arr) => ({
    ...ask,
    total: arr.slice(0, i + 1).reduce((sum, item) => sum + item.size, 0)
  })).reverse(); // Reverse to show highest ask at bottom
  
  const bids = Array(8).fill(0).map((_, i) => ({
    price: pair.price - (pair.price * 0.0005 * (i + 1)),
    size: Math.random() * maxSize,
    total: 0
  })).map((bid, i, arr) => ({
    ...bid,
    total: arr.slice(0, i + 1).reduce((sum, item) => sum + item.size, 0)
  }));

  // Max total for visualization
  const maxTotal = Math.max(
    asks[asks.length - 1]?.total || 0,
    bids[bids.length - 1]?.total || 0
  );
  
  // Calculate spread
  const spread = asks[asks.length - 1].price - bids[0].price;
  const spreadPercentage = (spread / pair.price) * 100;

  return (
    <Card className="border-primary-700 bg-primary-800">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center space-x-2">
          <BarChart2 className="h-4 w-4 mr-1.5 text-accent-500" />
          <span>Order Book</span>
        </CardTitle>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-primary-700 text-xs">
            Spread: ${spread.toFixed(2)} ({spreadPercentage.toFixed(3)}%)
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="px-4 pt-1 pb-2 border-b border-primary-700 grid grid-cols-4 text-xs text-neutral-400">
          <div>Price ({pair.quoteAsset})</div>
          <div className="text-right">Size ({pair.baseAsset})</div>
          <div className="text-right">Total</div>
          <div></div> {/* For depth visualization */}
        </div>
        
        <div className="px-4 py-2 space-y-1 max-h-[150px] overflow-y-auto">
          {asks.map((ask, index) => (
            <div key={`ask-${index}`} className="grid grid-cols-4 text-sm items-center">
              <div className="text-red-500">${ask.price.toFixed(2)}</div>
              <div className="text-right">{ask.size.toFixed(3)}</div>
              <div className="text-right">{ask.total.toFixed(3)}</div>
              <div className="h-full pl-2">
                <div 
                  className="h-2 bg-red-600/30" 
                  style={{ width: `${(ask.total / maxTotal) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="px-4 py-2 border-t border-b border-primary-700 text-center">
          <span className={`text-xl font-bold ${pair.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            ${pair.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className={`ml-2 text-xs ${pair.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {pair.change24h >= 0 ? '▲' : '▼'} {Math.abs(pair.change24h).toFixed(2)}%
          </span>
        </div>
        
        <div className="px-4 py-2 space-y-1 max-h-[150px] overflow-y-auto">
          {bids.map((bid, index) => (
            <div key={`bid-${index}`} className="grid grid-cols-4 text-sm items-center">
              <div className="text-green-500">${bid.price.toFixed(2)}</div>
              <div className="text-right">{bid.size.toFixed(3)}</div>
              <div className="text-right">{bid.total.toFixed(3)}</div>
              <div className="h-full pl-2">
                <div 
                  className="h-2 bg-green-600/30" 
                  style={{ width: `${(bid.total / maxTotal) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-2 pb-3 text-xs text-neutral-400 justify-between border-t border-primary-700">
        <div className="flex items-center">
          <RefreshCw className="h-3 w-3 mr-1.5" />
          <span>Auto-refreshing</span>
        </div>
        <Button size="sm" variant="ghost" className="h-6 px-2 py-0 text-xs">
          <Globe className="h-3 w-3 mr-1" />
          Show All
        </Button>
      </CardFooter>
    </Card>
  );
}

function MarketInfo({ pair }: { pair: TradingPair }) {
  return (
    <div className="bg-primary-800 rounded-lg border border-primary-700 p-4">
      <h3 className="font-semibold mb-4">Market Information</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-neutral-400">24h Change</div>
          <div className={pair.change24h >= 0 ? 'text-green-500' : 'text-red-500'}>
            {pair.change24h >= 0 ? '+' : ''}{pair.change24h}%
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-neutral-400">24h High</div>
          <div>${(pair.price * 1.02).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-neutral-400">24h Low</div>
          <div>${(pair.price * 0.98).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-neutral-400">24h Volume</div>
          <div>$38.2M</div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-neutral-400">Open Interest</div>
          <div>$14.6M</div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-neutral-400">Index Price</div>
          <div>${(pair.price * 0.9995).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
        </div>
      </div>
    </div>
  );
}

export default function CryptoTrading() {
  const { pair: pairParam } = useParams();
  const [, navigate] = useLocation();
  const [marginMode, setMarginMode] = useState<'cross' | 'isolated'>('cross');
  const [leverage, setLeverage] = useState<number>(10);
  const [currentPair, setCurrentPair] = useState<TradingPair>(cryptoPairs[0]);
  const [chartType, setChartType] = useState<'candlestick' | 'line' | 'area'>('line');
  const [timeFrame, setTimeFrame] = useState<string>('1h');
  const [candleData, setCandleData] = useState<CandlestickData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Get blockchain selection from localStorage
    const blockchainName = localStorage.getItem('selectedBlockchainName');
    if (!blockchainName) {
      navigate("/select-blockchain");
    }
    
    // Set the current pair based on URL param or default to first pair
    if (pairParam) {
      const foundPair = cryptoPairs.find(p => p.name === decodeURIComponent(pairParam));
      if (foundPair) {
        setCurrentPair(foundPair);
      }
    }
  }, [pairParam, navigate]);
  
  // Generate mock candlestick data for the selected pair
  useEffect(() => {
    setIsLoading(true);
    try {
      const data = generateMockCandlestickData(timeFrame, 100);
      setCandleData(data);
    } finally {
      setIsLoading(false);
    }
  }, [currentPair, timeFrame]);

  return (
    <div className="min-h-screen flex flex-col bg-primary-900 text-white">
      {/* Header */}
      <header className="border-b border-primary-700 bg-primary-800 py-3 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-accent-500 text-xl font-bold">Fly<span className="text-white">Crypto</span></span>
        </div>
        
        <div className="flex items-center space-x-4">
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
      
      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="hidden md:block w-64 border-r border-primary-700 bg-primary-800 p-4">
          <h2 className="font-semibold mb-3">Crypto Perpetuals</h2>
          <div className="space-y-2">
            {cryptoPairs.map(pair => (
              <div key={pair.id} 
                className={`flex items-center justify-between p-2 rounded hover:bg-primary-700 cursor-pointer ${currentPair.id === pair.id ? 'bg-primary-700 border-l-2 border-accent-500 pl-1' : ''}`}
                onClick={() => navigate(`/crypto-trading/${encodeURIComponent(pair.name)}`)}
              >
                <span>{pair.name}</span>
                <div className="text-right">
                  <div className="font-mono">${pair.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                  <div className={pair.change24h >= 0 ? 'text-green-500 text-xs' : 'text-red-500 text-xs'}>
                    {pair.change24h >= 0 ? '+' : ''}{pair.change24h}%
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-primary-700 rounded-lg">
            <h3 className="font-semibold mb-2">Perpetual Features</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Info className="h-4 w-4 text-blue-500 mr-2" />
                Funding Rate: <span className="text-green-500 ml-1">+0.0103%</span>
              </li>
              <li className="flex items-center">
                <Info className="h-4 w-4 text-blue-500 mr-2" />
                Liquidation Protection
              </li>
              <li className="flex items-center">
                <Info className="h-4 w-4 text-blue-500 mr-2" />
                Up to 100x Leverage
              </li>
              <li className="flex items-center">
                <Info className="h-4 w-4 text-blue-500 mr-2" />
                Mark Price: <span className="ml-1">${currentPair.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Main Trading Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Top Trading Bar */}
          <div className="border-b border-primary-700 bg-primary-800 p-3 flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-lg font-semibold mr-3">{currentPair.name}</h1>
              <span className="font-mono">${currentPair.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              <span className={`ml-2 text-xs ${currentPair.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {currentPair.change24h >= 0 ? '+' : ''}{currentPair.change24h}%
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm">Margin:</span>
                <div className="flex rounded-md bg-primary-700 p-1">
                  <Button 
                    size="sm"
                    variant={marginMode === "cross" ? "default" : "ghost"}
                    className={marginMode === "cross" ? "bg-accent-500 text-white" : "text-neutral-300"}
                    onClick={() => setMarginMode("cross")}
                  >
                    Cross
                  </Button>
                  <Button 
                    size="sm"
                    variant={marginMode === "isolated" ? "default" : "ghost"}
                    className={marginMode === "isolated" ? "bg-accent-500 text-white" : "text-neutral-300"}
                    onClick={() => setMarginMode("isolated")}
                  >
                    Isolated
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm">Leverage:</span>
                <select 
                  className="bg-primary-700 rounded border-none text-sm p-1"
                  value={leverage}
                  onChange={(e) => setLeverage(Number(e.target.value))}
                >
                  <option value="5">5x</option>
                  <option value="10">10x</option>
                  <option value="20">20x</option>
                  <option value="50">50x</option>
                  <option value="100">100x</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="flex flex-1 overflow-auto p-4">
            {/* Chart Area */}
            <div className="flex-1 flex flex-col">
              <SimpleChart 
                data={candleData}
                isLoading={isLoading}
                chartType={chartType === 'candlestick' ? 'line' : chartType}
                timeFrame={timeFrame}
                onChangeChartType={(type) => setChartType(type)}
                onChangeTimeFrame={setTimeFrame}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Left column */}
                <div className="md:col-span-8 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <CryptoOrderForm pair={currentPair} />
                    <OrderBook pair={currentPair} />
                  </div>
                </div>
                
                {/* Right column */}
                <div className="md:col-span-4 space-y-4">
                  <Card className="border-primary-700 bg-primary-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <Star className="h-5 w-5 text-yellow-500" />
                        <span>Market Overview</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-neutral-400">Market Status</span>
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                            <CheckCircle className="mr-1 h-3 w-3" /> Active
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-neutral-400">24h Volume</span>
                          <span className="font-medium">$38.2M</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-neutral-400">Market Cap</span>
                          <span className="font-medium">$1.2T</span>
                        </div>
                        <Separator className="my-2 bg-primary-700" />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-neutral-400">Perpetual Type</span>
                          <span className="font-medium">USD-M</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <AiStrategyPanel pair={currentPair.name} currentPrice={currentPair.price} compact={true} />
                  <FundingInfo />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}