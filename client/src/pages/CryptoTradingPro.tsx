import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Switch } from "@/components/ui/switch";
import { TradingPair, CandlestickData } from "@shared/schema";
import TradingViewChart from "@/components/trading/TradingViewChart";
import AdvancedOrderForm from "@/components/trading/AdvancedOrderForm";
import AiStrategyPanel from "@/components/trading/AiStrategyPanel";
import { generateMockCandlestickData, generateMockOrderBook } from "@/lib/mockData";
import {
  Home as HomeIcon,
  TrendingUp,
  TrendingDown,
  ChevronsUpDown,
  Sliders,
  LineChart,
  Clock,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  BarChart,
  Wallet,
  Users,
  Info,
  DollarSign
} from "lucide-react";

// Mock trading pairs for crypto
const cryptoPairs = [
  { id: 1, name: 'BTC/USD', baseAsset: 'BTC', quoteAsset: 'USD', price: 65420.75, change24h: 2.35, categoryId: 2, isActive: true },
  { id: 2, name: 'ETH/USD', baseAsset: 'ETH', quoteAsset: 'USD', price: 3456.89, change24h: 1.75, categoryId: 2, isActive: true },
  { id: 3, name: 'SOL/USD', baseAsset: 'SOL', quoteAsset: 'USD', price: 142.65, change24h: 3.45, categoryId: 2, isActive: true },
  { id: 4, name: 'XRP/USD', baseAsset: 'XRP', quoteAsset: 'USD', price: 0.5423, change24h: -1.25, categoryId: 2, isActive: true },
  { id: 5, name: 'ADA/USD', baseAsset: 'ADA', quoteAsset: 'USD', price: 0.4521, change24h: 0.87, categoryId: 2, isActive: true },
  { id: 6, name: 'DOGE/USD', baseAsset: 'DOGE', quoteAsset: 'USD', price: 0.1234, change24h: -2.15, categoryId: 2, isActive: true },
];

function FundingInfo({ pair }: { pair: TradingPair }) {
  return (
    <div className="rounded-lg border border-primary-700 bg-primary-800">
      <div className="border-b border-primary-700 px-4 py-3 flex items-center justify-between">
        <h3 className="font-medium text-sm flex items-center">
          <DollarSign className="w-4 h-4 mr-2 text-neutral-400" />
          Funding Info
        </h3>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <Info className="h-4 w-4 text-neutral-400" />
        </Button>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div className="text-xs text-neutral-400">Next Funding</div>
          <div className="text-xs">{new Date(Date.now() + 3600000).toLocaleTimeString()}</div>
          
          <div className="text-xs text-neutral-400">Funding Rate</div>
          <div className="text-xs text-green-500">+0.01%</div>
          
          <div className="text-xs text-neutral-400">Predicted Rate</div>
          <div className="text-xs text-green-500">+0.008%</div>
          
          <div className="text-xs text-neutral-400">8h Funding</div>
          <div className="text-xs text-green-500">+0.024%</div>
        </div>
      </div>
    </div>
  );
}

function LiquidationCalculator({ pair }: { pair: TradingPair }) {
  const [position, setPosition] = useState<'long' | 'short'>('long');
  const [size, setSize] = useState<number>(0.01);
  const [leverage, setLeverage] = useState<number>(10);
  const [entryPrice, setEntryPrice] = useState<number>(pair.price);
  const [liquidationPrice, setLiquidationPrice] = useState<number>(0);
  
  useEffect(() => {
    // Calculate liquidation price based on position, size, leverage, and entry price
    const margin = (size * entryPrice) / leverage;
    const maintenanceMargin = margin * 0.5; // Simplified calculation
    
    if (position === 'long') {
      const liqPrice = entryPrice * (1 - (1 / leverage) * 0.85); // Simplified formula
      setLiquidationPrice(parseFloat(liqPrice.toFixed(2)));
    } else {
      const liqPrice = entryPrice * (1 + (1 / leverage) * 0.85); // Simplified formula
      setLiquidationPrice(parseFloat(liqPrice.toFixed(2)));
    }
  }, [position, size, leverage, entryPrice]);
  
  return (
    <div className="rounded-lg border border-primary-700 bg-primary-800">
      <div className="border-b border-primary-700 px-4 py-3">
        <h3 className="font-medium text-sm flex items-center">
          <AlertCircle className="w-4 h-4 mr-2 text-neutral-400" />
          Liquidation Calculator
        </h3>
      </div>
      
      <div className="p-4">
        <div className="mb-3">
          <Tabs value={position} onValueChange={(value) => setPosition(value as 'long' | 'short')}>
            <TabsList className="w-full grid grid-cols-2 h-8">
              <TabsTrigger value="long" className="text-xs">Long</TabsTrigger>
              <TabsTrigger value="short" className="text-xs">Short</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="space-y-3">
          <div>
            <Label htmlFor="size" className="text-xs text-neutral-400">Position Size</Label>
            <Input
              id="size"
              className="bg-primary-700 border-primary-600 h-8 mt-1"
              value={size}
              onChange={(e) => setSize(parseFloat(e.target.value) || 0)}
              type="number"
              min={0.001}
              step={0.001}
            />
          </div>
          
          <div>
            <Label htmlFor="leverage" className="text-xs text-neutral-400">Leverage</Label>
            <select
              id="leverage"
              className="w-full bg-primary-700 border border-primary-600 rounded px-2 py-1 text-sm h-8 mt-1"
              value={leverage}
              onChange={(e) => setLeverage(parseInt(e.target.value))}
            >
              {[1, 2, 3, 5, 10, 20, 50, 100].map(lev => (
                <option key={lev} value={lev}>{lev}x</option>
              ))}
            </select>
          </div>
          
          <div>
            <Label htmlFor="entryPrice" className="text-xs text-neutral-400">Entry Price</Label>
            <Input
              id="entryPrice"
              className="bg-primary-700 border-primary-600 h-8 mt-1"
              value={entryPrice}
              onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
              type="number"
              min={0}
              step={0.01}
            />
          </div>
          
          <div className="pt-2 border-t border-primary-700 mt-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-neutral-400">Liquidation Price</span>
              <span className="text-sm font-semibold text-red-500">${liquidationPrice.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-neutral-400">Price Distance</span>
              <span className="text-xs">
                {position === 'long' 
                  ? `${((entryPrice - liquidationPrice) / entryPrice * 100).toFixed(2)}%` 
                  : `${((liquidationPrice - entryPrice) / entryPrice * 100).toFixed(2)}%`}
              </span>
            </div>
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
  const [usePostOnly, setUsePostOnly] = useState<boolean>(false);
  const [useReduceOnly, setUseReduceOnly] = useState<boolean>(false);
  
  useEffect(() => {
    setPrice(pair.price);
  }, [pair.price]);

  const handlePlaceOrder = () => {
    console.log('Placing order:', {
      pair: pair.name,
      type: orderType,
      side: orderSide,
      amount,
      price: orderType !== 'Market' ? price : undefined,
      postOnly: usePostOnly,
      reduceOnly: useReduceOnly
    });
    
    // Here you would call the API to place the order
    alert(`Order placed: ${orderSide.toUpperCase()} ${amount} ${pair.name} at ${orderType === 'Market' ? 'market price' : '$' + price}`);
  };

  return (
    <div className="rounded-lg border border-primary-700 bg-primary-800 h-full flex flex-col">
      <div className="border-b border-primary-700 px-2 py-2">
        <h3 className="font-medium text-xs">Place Order</h3>
      </div>
      
      <div className="p-3 flex-1 flex flex-col">
        <div className="mb-2">
          <Tabs defaultValue="Market" onValueChange={setOrderType}>
            <TabsList className="grid w-full grid-cols-3 h-7">
              <TabsTrigger value="Market" className="text-xs h-6 px-1">Market</TabsTrigger>
              <TabsTrigger value="Limit" className="text-xs h-6 px-1">Limit</TabsTrigger>
              <TabsTrigger value="Stop" className="text-xs h-6 px-1">Stop</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="mb-2 grid grid-cols-2 gap-1">
          <Button 
            className={`h-8 text-xs px-2 ${orderSide === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-primary-700'}`}
            onClick={() => setOrderSide('buy')}
          >
            Buy / Long
          </Button>
          <Button 
            className={`h-8 text-xs px-2 ${orderSide === 'sell' ? 'bg-red-600 hover:bg-red-700' : 'bg-primary-700'}`}
            onClick={() => setOrderSide('sell')}
          >
            Sell / Short
          </Button>
        </div>
        
        <div className="space-y-2 mb-2">
          {orderType !== 'Market' && (
            <div>
              <Label htmlFor="price" className="text-xs text-neutral-400">Limit Price</Label>
              <div className="relative mt-1">
                <Input 
                  id="price" 
                  className="bg-primary-700 border-primary-600 h-7 text-xs"
                  value={price} 
                  onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                  type="number"
                  min={0}
                  step={0.01}
                />
              </div>
            </div>
          )}
          
          <div>
            <Label htmlFor="amount" className="text-xs text-neutral-400">Amount</Label>
            <div className="relative mt-1">
              <Input 
                id="amount" 
                className="bg-primary-700 border-primary-600 h-7 text-xs"
                value={amount} 
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                type="number"
                min={0.001}
                step={0.001}
              />
            </div>
          </div>
          
          <div className="flex gap-2 justify-between">
            <div className="flex items-center">
              <Switch 
                id="postOnly" 
                checked={usePostOnly} 
                onCheckedChange={setUsePostOnly} 
                className="h-3 w-6"
                disabled={orderType === 'Market'}
              />
              <Label 
                htmlFor="postOnly" 
                className="ml-1 text-[10px] text-neutral-400"
              >
                Post Only
              </Label>
            </div>
            
            <div className="flex items-center">
              <Switch 
                id="reduceOnly" 
                checked={useReduceOnly} 
                onCheckedChange={setUseReduceOnly} 
                className="h-3 w-6"
              />
              <Label 
                htmlFor="reduceOnly" 
                className="ml-1 text-[10px] text-neutral-400"
              >
                Reduce Only
              </Label>
            </div>
          </div>
        </div>
        
        <div className="space-y-1 mb-3 border-t border-primary-700/50 pt-2">
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="text-neutral-400">Cost</div>
            <div className="text-right">${(amount * pair.price).toFixed(2)}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div className="text-neutral-400">Max Position</div>
            <div className="text-right">${(amount * pair.price * 10).toFixed(2)}</div>
          </div>
        </div>
        
        <div className="mt-auto">
          <Button 
            className={`w-full py-2 text-xs ${orderSide === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
            onClick={handlePlaceOrder}
          >
            {orderSide === 'buy' ? 'Buy / Long' : 'Sell / Short'} {pair.baseAsset}
          </Button>
        </div>
      </div>
    </div>
  );
}

function OrderBook({ pair }: { pair: TradingPair }) {
  // Generate the orderbook with bids and asks
  const { asks, bids } = generateMockOrderBook(pair.price, 8);

  return (
    <div className="rounded-lg border border-primary-700 bg-primary-800 h-full flex flex-col">
      <div className="border-b border-primary-700 px-2 py-2 flex items-center justify-between">
        <h3 className="font-medium text-xs">Order Book</h3>
        <div className="text-xs">
          Spread: <span className="text-accent-500 font-medium">${((asks[0].price - bids[0].price) * 100).toFixed(2)}</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="grid grid-cols-3 text-xs text-neutral-400 p-1 border-b border-primary-700 bg-primary-800 sticky top-0">
          <div>Price</div>
          <div className="text-right">Size</div>
          <div className="text-right">Total</div>
        </div>
        
        {/* Asks (Sells) */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-700">
          <div>
            {asks.map((ask, index) => (
              <div 
                key={`ask-${index}`} 
                className="grid grid-cols-3 text-xs px-2 py-[3px] hover:bg-primary-700 border-b border-primary-700/20"
                style={{
                  background: `linear-gradient(to left, rgba(239, 68, 68, 0.05) ${Math.min(ask.total * 20, 100)}%, transparent 0%)`
                }}
              >
                <div className="text-red-500">${ask.price.toFixed(2)}</div>
                <div className="text-right">{ask.size.toFixed(3)}</div>
                <div className="text-right text-neutral-400">{ask.total.toFixed(3)}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Current price */}
        <div className="py-1 px-2 text-center font-medium text-xs bg-primary-700/50 border-y border-primary-700">
          <span className={pair.change24h >= 0 ? 'text-green-500' : 'text-red-500'}>
            ${pair.price.toFixed(2)}
          </span>
          <span className="text-xs text-neutral-400 ml-2">
            {pair.change24h >= 0 ? '↑' : '↓'} {Math.abs(pair.change24h).toFixed(2)}%
          </span>
        </div>
        
        {/* Bids (Buys) */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-700">
          <div>
            {bids.map((bid, index) => (
              <div 
                key={`bid-${index}`} 
                className="grid grid-cols-3 text-xs px-2 py-[3px] hover:bg-primary-700 border-b border-primary-700/20"
                style={{
                  background: `linear-gradient(to left, rgba(34, 197, 94, 0.05) ${Math.min(bid.total * 20, 100)}%, transparent 0%)`
                }}
              >
                <div className="text-green-500">${bid.price.toFixed(2)}</div>
                <div className="text-right">{bid.size.toFixed(3)}</div>
                <div className="text-right text-neutral-400">{bid.total.toFixed(3)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MarketInfo({ pair }: { pair: TradingPair }) {
  return (
    <div className="rounded-lg border border-primary-700 bg-primary-800">
      <div className="border-b border-primary-700 px-4 py-3">
        <h3 className="font-medium text-sm">Market Information</h3>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div className="text-xs text-neutral-400">24h Change</div>
          <div className={`text-xs ${pair.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {pair.change24h >= 0 ? '+' : ''}{pair.change24h}%
          </div>
          
          <div className="text-xs text-neutral-400">24h High</div>
          <div className="text-xs">${(pair.price * 1.02).toFixed(2)}</div>
          
          <div className="text-xs text-neutral-400">24h Low</div>
          <div className="text-xs">${(pair.price * 0.98).toFixed(2)}</div>
          
          <div className="text-xs text-neutral-400">24h Volume</div>
          <div className="text-xs">${(Math.random() * 1000000 + 100000).toFixed(2)}</div>
          
          <div className="text-xs text-neutral-400">Open Interest</div>
          <div className="text-xs">${(Math.random() * 5000000 + 1000000).toFixed(2)}</div>
          
          <div className="text-xs text-neutral-400">Funding Rate</div>
          <div className="text-xs text-green-500">+0.01%</div>
        </div>
      </div>
    </div>
  );
}

function RecentTrades() {
  // Mock recent trades
  const trades = Array(20).fill(0).map((_, i) => ({
    id: i,
    price: 65420.75 + (Math.random() - 0.5) * 100,
    size: Math.random() * 0.5 + 0.1,
    time: Date.now() - i * 30000,
    side: Math.random() > 0.5 ? 'buy' : 'sell'
  }));

  return (
    <div className="rounded-lg border border-primary-700 bg-primary-800 h-full">
      <div className="border-b border-primary-700 px-4 py-3">
        <h3 className="font-medium text-sm">Recent Trades</h3>
      </div>
      
      <div className="grid grid-cols-3 text-xs text-neutral-400 p-2 border-b border-primary-700">
        <div>Price</div>
        <div className="text-right">Size</div>
        <div className="text-right">Time</div>
      </div>
      
      <div className="max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary-700">
        {trades.map(trade => (
          <div key={trade.id} className="grid grid-cols-3 text-xs p-2 hover:bg-primary-700">
            <div className={trade.side === 'buy' ? 'text-green-500' : 'text-red-500'}>
              ${trade.price.toFixed(2)}
            </div>
            <div className="text-right">
              {trade.size.toFixed(3)}
            </div>
            <div className="text-right text-neutral-400">
              {new Date(trade.time).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OpenPositions() {
  // Mock positions
  const positions = [
    {
      id: 1,
      pair: 'BTC/USD',
      side: 'buy',
      size: 0.1,
      entryPrice: 64500.75,
      currentPrice: 65420.75,
      pnl: 92.00,
      pnlPercent: 1.42
    }
  ];

  return (
    <div className="rounded-lg border border-primary-700 bg-primary-800">
      <div className="border-b border-primary-700 px-4 py-3 flex items-center justify-between">
        <h3 className="font-medium text-sm">Open Positions</h3>
        <div className="text-sm">
          Total PnL: <span className="text-green-500">$92.00</span>
        </div>
      </div>
      
      {positions.length === 0 ? (
        <div className="p-8 text-center text-neutral-400 text-sm">
          No open positions
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-neutral-400 border-b border-primary-700">
                <th className="p-2 text-left">Pair</th>
                <th className="p-2 text-left">Side</th>
                <th className="p-2 text-right">Size</th>
                <th className="p-2 text-right">Entry</th>
                <th className="p-2 text-right">Price</th>
                <th className="p-2 text-right">PnL</th>
                <th className="p-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {positions.map(pos => (
                <tr key={pos.id} className="border-b border-primary-700 hover:bg-primary-700/50">
                  <td className="p-2">{pos.pair}</td>
                  <td className={`p-2 ${pos.side === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
                    {pos.side.toUpperCase()}
                  </td>
                  <td className="p-2 text-right">{pos.size}</td>
                  <td className="p-2 text-right">${pos.entryPrice.toFixed(2)}</td>
                  <td className="p-2 text-right">${pos.currentPrice.toFixed(2)}</td>
                  <td className={`p-2 text-right ${pos.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    ${pos.pnl.toFixed(2)} ({pos.pnlPercent.toFixed(2)}%)
                  </td>
                  <td className="p-2 text-right">
                    <Button variant="outline" size="sm" className="h-6 text-xs px-2">
                      Close
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function CryptoTradingPro() {
  const { pair: pairParam } = useParams();
  const [, navigate] = useLocation();
  const [marginMode, setMarginMode] = useState<'cross' | 'isolated'>('cross');
  const [leverage, setLeverage] = useState<number>(10);
  const [currentPair, setCurrentPair] = useState<TradingPair>(cryptoPairs[0]);
  const [candleData, setCandleData] = useState<CandlestickData[]>([]);
  const [timeframe, setTimeframe] = useState<string>('1h');
  
  // Generate mock candle data
  useEffect(() => {
    // Generate candle data when the pair or timeframe changes
    const data = generateMockCandlestickData(timeframe, 100);
    // Adjust for crypto price range
    const adjustedData = data.map(candle => ({
      ...candle,
      open: candle.open * currentPair.price * 10,
      high: candle.high * currentPair.price * 10,
      low: candle.low * currentPair.price * 10,
      close: candle.close * currentPair.price * 10
    }));
    setCandleData(adjustedData);
  }, [currentPair.id, timeframe]);
  
  useEffect(() => {
    // Set the current pair based on URL param or default to first pair
    if (pairParam) {
      const foundPair = cryptoPairs.find(p => p.name === decodeURIComponent(pairParam));
      if (foundPair) {
        setCurrentPair(foundPair);
      }
    }
  }, [pairParam]);

  return (
    <div className="min-h-screen flex flex-col bg-primary-900 text-white">
      {/* Header */}
      <header className="border-b border-primary-700 bg-primary-800 py-2 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-accent-500 text-xl font-bold">Fly<span className="text-white">Crypto</span></span>
          
          <div className="hidden md:flex ml-8 space-x-1">
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 text-sm"
              onClick={() => navigate("/select-blockchain")}
            >
              Markets
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 text-sm"
            >
              Trade
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 text-sm"
            >
              Portfolio
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-1">
            <div className="bg-primary-700 rounded-lg py-1 px-3 flex items-center">
              <Wallet className="h-4 w-4 mr-2 text-neutral-400" />
              <span className="text-sm">$10,000.00</span>
            </div>
            
            <div className="bg-accent-500/20 rounded-lg py-1 px-3 text-accent-500">
              <span className="text-sm">Demo Account</span>
            </div>
          </div>
          
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
        <div className="hidden lg:block w-56 border-r border-primary-700 bg-primary-800">
          <div className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-sm">Crypto Pairs</h2>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-[2px]">
              {cryptoPairs.map(pair => (
                <div key={pair.id} 
                  className={`flex items-center justify-between p-2 rounded hover:bg-primary-700 cursor-pointer ${currentPair.id === pair.id ? 'bg-primary-700 border-l-2 border-accent-500 pl-1' : ''}`}
                  onClick={() => navigate(`/crypto-trading-pro/${encodeURIComponent(pair.name)}`)}
                >
                  <span className="text-sm">{pair.name}</span>
                  <div className="text-right">
                    <div className="font-mono text-xs">${pair.price.toFixed(2)}</div>
                    <div className={pair.change24h >= 0 ? 'text-green-500 text-xs' : 'text-red-500 text-xs'}>
                      {pair.change24h >= 0 ? '+' : ''}{pair.change24h}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <div className="p-4">
            {/* Top bar with pair info */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center">
                <h1 className="text-xl font-bold mr-2">{currentPair.name} Perpetual</h1>
                <div className={`text-sm px-2 py-0.5 rounded ${currentPair.change24h >= 0 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                  {currentPair.change24h >= 0 ? '+' : ''}{currentPair.change24h}%
                </div>
                <div className="ml-2 text-lg font-mono">
                  ${currentPair.price.toFixed(2)}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <Label className="mr-2 text-sm text-neutral-400">Margin</Label>
                  <Tabs defaultValue={marginMode} onValueChange={(value) => setMarginMode(value as 'cross' | 'isolated')}>
                    <TabsList className="bg-primary-700 h-8">
                      <TabsTrigger value="cross" className="text-xs h-6 px-2">Cross</TabsTrigger>
                      <TabsTrigger value="isolated" className="text-xs h-6 px-2">Isolated</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                <div className="flex items-center">
                  <Label className="mr-2 text-sm text-neutral-400">Leverage</Label>
                  <select 
                    className="bg-primary-700 border border-primary-600 rounded px-2 py-1 text-sm h-8"
                    value={leverage}
                    onChange={(e) => setLeverage(parseInt(e.target.value))}
                  >
                    {[1, 2, 3, 5, 10, 20, 50, 100].map(lev => (
                      <option key={lev} value={lev}>{lev}x</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Main grid layout */}
            <div className="grid grid-cols-12 gap-4">
              {/* Chart area - spans 8 columns on large screens */}
              <div className="col-span-12 lg:col-span-8">
                <TradingViewChart candleData={candleData} pair={currentPair.name} height={500} />
                
                <div className="mt-4">
                  <OpenPositions />
                </div>
              </div>
              
              {/* Right sidebar - spans 4 columns on large screens */}
              <div className="col-span-12 lg:col-span-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                  <div className="sm:col-span-1 lg:col-span-1">
                    <CryptoOrderForm pair={currentPair} />
                  </div>
                  <div className="sm:col-span-1 lg:col-span-1 h-[280px]">
                    <OrderBook pair={currentPair} />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <MarketInfo pair={currentPair} />
              <FundingInfo pair={currentPair} />
              <RecentTrades />
            </div>
            
            {/* Additional row for liquidation calculator */}
            <div className="mt-4">
              <LiquidationCalculator pair={currentPair} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}