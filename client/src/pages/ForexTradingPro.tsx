import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Switch } from "@/components/ui/switch";
import { Logo } from "@/components/ui/logo";
import { TradingPair, CandlestickData } from "@shared/schema";
import TradingViewChart from "@/components/trading/TradingViewChart";
import { generateMockCandlestickData, generateMockOrderBook } from "@/lib/mockData";
import AiStrategyBox from "@/components/trading/AiStrategyBox";
import ForexNews from "@/components/trading/ForexNews";
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
  MonitorSmartphone,
  Brain
} from "lucide-react";

// Mock trading pairs for forex
const forexPairs = [
  { id: 1, name: 'EUR/USD', baseAsset: 'EUR', quoteAsset: 'USD', price: 1.0921, change24h: 0.15, categoryId: 1, isActive: true },
  { id: 2, name: 'GBP/USD', baseAsset: 'GBP', quoteAsset: 'USD', price: 1.2639, change24h: -0.21, categoryId: 1, isActive: true },
  { id: 3, name: 'USD/JPY', baseAsset: 'USD', quoteAsset: 'JPY', price: 157.89, change24h: 0.32, categoryId: 1, isActive: true },
  { id: 4, name: 'AUD/USD', baseAsset: 'AUD', quoteAsset: 'USD', price: 0.6573, change24h: -0.11, categoryId: 1, isActive: true },
  { id: 5, name: 'USD/CHF', baseAsset: 'USD', quoteAsset: 'CHF', price: 0.9042, change24h: 0.22, categoryId: 1, isActive: true },
  { id: 6, name: 'EUR/GBP', baseAsset: 'EUR', quoteAsset: 'GBP', price: 0.8642, change24h: 0.09, categoryId: 1, isActive: true },
];

function PIPCalculator({ pair }: { pair: TradingPair }) {
  const [amount, setAmount] = useState<number>(1);
  const [pipValue, setPipValue] = useState<number>(0);
  
  useEffect(() => {
    // Calculate PIP value (1 pip is typically 0.0001 for most pairs, 0.01 for JPY pairs)
    const isJPYPair = pair.name.includes('JPY');
    const pipSize = isJPYPair ? 0.01 : 0.0001;
    const calculatedPipValue = amount * 10 * pipSize; // Standard lot size calculation
    setPipValue(parseFloat(calculatedPipValue.toFixed(2)));
  }, [amount, pair]);

  return (
    <div className="rounded-lg border border-primary-700 bg-primary-800 p-4">
      <h3 className="font-medium mb-3 text-sm flex items-center">
        <LineChart className="w-4 h-4 mr-2 text-neutral-400" />
        PIP Calculator
      </h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="amount" className="text-xs text-neutral-400">Trade Size (Lots)</Label>
          <Input 
            id="amount" 
            type="number" 
            className="bg-primary-700 border-primary-600 h-8 mt-1"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            min={0.01}
            step={0.01}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="pip-size" className="text-xs text-neutral-400">PIP Size</Label>
            <div className="bg-primary-700 p-2 text-sm rounded border border-primary-600 mt-1">
              {pair.name.includes('JPY') ? '0.01' : '0.0001'}
            </div>
          </div>
          <div>
            <Label htmlFor="pip-value" className="text-xs text-neutral-400">PIP Value (USD)</Label>
            <div className="bg-primary-700 p-2 text-sm rounded border border-primary-600 font-medium mt-1">
              ${pipValue}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ForexOrderForm({ pair }: { pair: TradingPair }) {
  const [orderType, setOrderType] = useState<string>('Market');
  const [orderSide, setOrderSide] = useState<string>('buy');
  const [amount, setAmount] = useState<number>(0.01);
  const [useStopLoss, setUseStopLoss] = useState<boolean>(false);
  const [stopLossPrice, setStopLossPrice] = useState<number>(0);
  const [useTakeProfit, setUseTakeProfit] = useState<boolean>(false);
  const [takeProfitPrice, setTakeProfitPrice] = useState<number>(0);
  
  useEffect(() => {
    // Set default SL/TP values based on current price and side
    if (orderSide === 'buy') {
      setStopLossPrice(parseFloat((pair.price * 0.99).toFixed(5)));
      setTakeProfitPrice(parseFloat((pair.price * 1.01).toFixed(5)));
    } else {
      setStopLossPrice(parseFloat((pair.price * 1.01).toFixed(5)));
      setTakeProfitPrice(parseFloat((pair.price * 0.99).toFixed(5)));
    }
  }, [orderSide, pair.price]);

  const handlePlaceOrder = () => {
    console.log('Placing order:', {
      pair: pair.name,
      type: orderType,
      side: orderSide,
      amount,
      useStopLoss,
      stopLossPrice: useStopLoss ? stopLossPrice : undefined,
      useTakeProfit,
      takeProfitPrice: useTakeProfit ? takeProfitPrice : undefined
    });
    
    // Here you would call the API to place the order
    alert(`Order placed: ${orderSide.toUpperCase()} ${amount} ${pair.name} at ${pair.price}`);
  };

  return (
    <div className="rounded-lg border border-primary-700 bg-primary-800 shadow-lg">
      <div className="border-b border-primary-700 px-4 py-3 bg-primary-800/80 flex items-center justify-between">
        <h3 className="font-medium text-sm flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-accent-500" />
          Place Order
        </h3>
        <div className="text-xs bg-primary-700 px-2 py-1 rounded">
          Balance: <span className="text-accent-500 font-medium">$10,000.00</span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-4">
          <Tabs defaultValue="Market" onValueChange={setOrderType}>
            <TabsList className="grid w-full grid-cols-4 h-8">
              <TabsTrigger value="Market" className="text-xs">Market</TabsTrigger>
              <TabsTrigger value="Limit" className="text-xs">Limit</TabsTrigger>
              <TabsTrigger value="Stop" className="text-xs">Stop</TabsTrigger>
              <TabsTrigger value="StopLimit" className="text-xs">Stop Limit</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="mb-4 grid grid-cols-2 gap-2">
          <Button 
            className={`py-3 text-sm font-medium ${orderSide === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-primary-700'}`}
            onClick={() => setOrderSide('buy')}
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Buy / Long
          </Button>
          <Button 
            className={`py-3 text-sm font-medium ${orderSide === 'sell' ? 'bg-red-600 hover:bg-red-700' : 'bg-primary-700'}`}
            onClick={() => setOrderSide('sell')}
          >
            <TrendingDown className="w-4 h-4 mr-2" />
            Sell / Short
          </Button>
        </div>
        
        <div className="space-y-3 mb-4">
          <div>
            <Label htmlFor="amount" className="text-xs text-neutral-400">Amount (Lots)</Label>
            <div className="relative mt-1 flex gap-2">
              <Input 
                id="amount" 
                className="bg-primary-700 border-primary-600 h-8"
                value={amount} 
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                type="number"
                min={0.01}
                step={0.01}
              />
              <div className="grid grid-cols-4 gap-1">
                {[0.01, 0.1, 0.5, 1].map(preset => (
                  <Button 
                    key={preset}
                    size="sm" 
                    variant="outline" 
                    className="h-8 text-xs px-1"
                    onClick={() => setAmount(preset)}
                  >
                    {preset}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label htmlFor="stopLoss" className="text-xs text-neutral-400 flex items-center">
                <X className="w-4 h-4 mr-1 text-red-500" />
                Stop Loss
              </Label>
              <Switch 
                id="useStopLoss" 
                checked={useStopLoss} 
                onCheckedChange={setUseStopLoss} 
                className="h-4 w-8"
              />
            </div>
            <div className="flex space-x-2">
              <Input 
                id="stopLoss" 
                className={`bg-primary-700 border-primary-600 h-8 ${!useStopLoss && 'opacity-50'}`}
                value={stopLossPrice} 
                onChange={(e) => setStopLossPrice(parseFloat(e.target.value) || 0)}
                type="number"
                step={0.00001}
                disabled={!useStopLoss}
              />
              <Button 
                variant="outline" 
                size="sm" 
                className={`w-20 h-8 text-xs ${!useStopLoss && 'opacity-50'}`}
                disabled={!useStopLoss}
              >
                {orderSide === 'buy' ? '-100 pips' : '+100 pips'}
              </Button>
            </div>
            {useStopLoss && (
              <div className="text-xs text-red-400 mt-1 flex items-center">
                <span className="bg-red-400/10 px-1.5 py-0.5 rounded">
                  Loss: $${((pair.price - stopLossPrice) * amount * 10000).toFixed(2)}
                </span>
              </div>
            )}
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label htmlFor="takeProfit" className="text-xs text-neutral-400 flex items-center">
                <Check className="w-4 h-4 mr-1 text-green-500" />
                Take Profit
              </Label>
              <Switch 
                id="useTakeProfit" 
                checked={useTakeProfit} 
                onCheckedChange={setUseTakeProfit} 
                className="h-4 w-8"
              />
            </div>
            <div className="flex space-x-2">
              <Input 
                id="takeProfit" 
                className={`bg-primary-700 border-primary-600 h-8 ${!useTakeProfit && 'opacity-50'}`}
                value={takeProfitPrice} 
                onChange={(e) => setTakeProfitPrice(parseFloat(e.target.value) || 0)}
                type="number"
                step={0.00001}
                disabled={!useTakeProfit}
              />
              <Button 
                variant="outline" 
                size="sm" 
                className={`w-20 h-8 text-xs ${!useTakeProfit && 'opacity-50'}`}
                disabled={!useTakeProfit}
              >
                {orderSide === 'buy' ? '+100 pips' : '-100 pips'}
              </Button>
            </div>
            {useTakeProfit && (
              <div className="text-xs text-green-400 mt-1 flex items-center">
                <span className="bg-green-400/10 px-1.5 py-0.5 rounded">
                  Profit: $${((takeProfitPrice - pair.price) * amount * 10000).toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="pt-3 border-t border-primary-700">
          <Button 
            className={`w-full py-4 text-sm font-medium flex items-center justify-center ${orderSide === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
            onClick={handlePlaceOrder}
          >
            {orderSide === 'buy' ? (
              <>
                <TrendingUp className="w-4 h-4 mr-2" />
                Buy {amount} lot{amount !== 1 ? 's' : ''} of {pair.name} @ {pair.price}
              </>
            ) : (
              <>
                <TrendingDown className="w-4 h-4 mr-2" />
                Sell {amount} lot{amount !== 1 ? 's' : ''} of {pair.name} @ {pair.price}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function OrderBook({ pair }: { pair: TradingPair }) {
  // Generate the orderbook with bids and asks
  const { asks, bids } = generateMockOrderBook(pair.price, 12);

  return (
    <div className="rounded-lg border border-primary-700 bg-primary-800 h-full flex flex-col">
      <div className="border-b border-primary-700 px-4 py-3 flex items-center justify-between">
        <h3 className="font-medium text-sm">Order Book</h3>
        <div className="text-xs">
          Spread: <span className="text-accent-500 font-medium">0.6 pips</span>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="grid grid-cols-3 text-xs text-neutral-400 p-2 border-b border-primary-700 bg-primary-800 sticky top-0">
          <div>Price</div>
          <div className="text-right">Size</div>
          <div className="text-right">Total</div>
        </div>
        
        {/* Asks (Sells) */}
        <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-primary-700 max-h-[150px]">
          <div className="space-y-[2px]">
            {asks.map((ask, index) => (
              <div key={`ask-${index}`} className="grid grid-cols-3 text-xs px-2 py-1 hover:bg-primary-700">
                <div className="text-red-500">{ask.price.toFixed(5)}</div>
                <div className="text-right">{ask.size.toFixed(2)}</div>
                <div className="text-right">{ask.total.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Current price */}
        <div className="py-2 px-2 text-center font-bold text-sm bg-primary-700/50 border-y border-primary-700">
          <span className={pair.change24h >= 0 ? 'text-green-500' : 'text-red-500'}>
            {pair.price.toFixed(5)}
          </span>
        </div>
        
        {/* Bids (Buys) */}
        <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-primary-700 max-h-[150px]">
          <div className="space-y-[2px]">
            {bids.map((bid, index) => (
              <div key={`bid-${index}`} className="grid grid-cols-3 text-xs px-2 py-1 hover:bg-primary-700">
                <div className="text-green-500">{bid.price.toFixed(5)}</div>
                <div className="text-right">{bid.size.toFixed(2)}</div>
                <div className="text-right">{bid.total.toFixed(2)}</div>
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
          <div className="text-xs">{(pair.price * 1.005).toFixed(5)}</div>
          
          <div className="text-xs text-neutral-400">24h Low</div>
          <div className="text-xs">{(pair.price * 0.995).toFixed(5)}</div>
          
          <div className="text-xs text-neutral-400">24h Volume</div>
          <div className="text-xs">{Math.floor(Math.random() * 10000) + 5000} lots</div>
          
          <div className="text-xs text-neutral-400">Base Currency</div>
          <div className="text-xs">{pair.baseAsset}</div>
          
          <div className="text-xs text-neutral-400">Quote Currency</div>
          <div className="text-xs">{pair.quoteAsset}</div>
        </div>
      </div>
    </div>
  );
}

function RecentTrades() {
  // Mock recent trades
  const trades = Array(20).fill(0).map((_, i) => ({
    id: i,
    price: 1.0921 + (Math.random() - 0.5) * 0.001,
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
              {trade.price.toFixed(5)}
            </div>
            <div className="text-right">
              {trade.size.toFixed(2)}
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
      pair: 'EUR/USD',
      side: 'buy',
      size: 0.5,
      entryPrice: 1.0915,
      currentPrice: 1.0921,
      pnl: 0.03,
      pnlPercent: 0.05
    },
    {
      id: 2,
      pair: 'GBP/USD',
      side: 'sell',
      size: 0.2,
      entryPrice: 1.2650,
      currentPrice: 1.2639,
      pnl: 0.22,
      pnlPercent: 0.09
    }
  ];

  return (
    <div className="rounded-lg border border-primary-700 bg-primary-800">
      <div className="border-b border-primary-700 px-4 py-3 flex items-center justify-between">
        <h3 className="font-medium text-sm">Open Positions</h3>
        <div className="text-sm">
          Total PnL: <span className="text-green-500">$0.25</span>
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
                  <td className="p-2 text-right">{pos.entryPrice.toFixed(5)}</td>
                  <td className="p-2 text-right">{pos.currentPrice.toFixed(5)}</td>
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

export default function ForexTradingPro() {
  const { pair: pairParam } = useParams();
  const [, navigate] = useLocation();
  const [marginMode, setMarginMode] = useState<'cross' | 'isolated'>('cross');
  const [leverage, setLeverage] = useState<number>(10);
  const [currentPair, setCurrentPair] = useState<TradingPair>(forexPairs[0]);
  const [candleData, setCandleData] = useState<CandlestickData[]>(generateMockCandlestickData('1h', 100));
  const [chartType, setChartType] = useState<'candlestick' | 'line' | 'area'>('candlestick');
  const [timeFrame, setTimeFrame] = useState<string>('1h');
  
  // Generate mock candle data with proper error handling
  useEffect(() => {
    try {
      // Generate candle data when the pair or timeframe changes
      const data = generateMockCandlestickData(timeFrame, 100);
      if (data && Array.isArray(data) && data.length > 0) {
        setCandleData(data);
      } else {
        console.warn("Generated empty candle data, using fallback");
        // Provide a fallback if the data is empty
        setCandleData([{
          time: Date.now(),
          open: 1.0,
          high: 1.1,
          low: 0.9,
          close: 1.0,
          volume: 100
        }]);
      }
    } catch (error) {
      console.error("Error generating candlestick data:", error);
      // Provide a fallback in case of error
      setCandleData([{
        time: Date.now(),
        open: 1.0,
        high: 1.1,
        low: 0.9,
        close: 1.0,
        volume: 100
      }]);
    }
  }, [currentPair.id, timeFrame]);
  
  // Handle chart type and timeframe changes
  const handleChartTypeChange = (type: 'candlestick' | 'line' | 'area') => {
    setChartType(type);
  };
  
  const handleTimeFrameChange = (tf: string) => {
    setTimeFrame(tf);
  };
  
  useEffect(() => {
    // Set the current pair based on URL param or default to first pair
    if (pairParam) {
      const foundPair = forexPairs.find(p => p.name === decodeURIComponent(pairParam));
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
              <h2 className="font-semibold text-sm">Forex Pairs</h2>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-[2px]">
              {forexPairs.map(pair => (
                <div key={pair.id} 
                  className={`flex items-center justify-between p-2 rounded hover:bg-primary-700 cursor-pointer ${currentPair.id === pair.id ? 'bg-primary-700 border-l-2 border-accent-500 pl-1' : ''}`}
                  onClick={() => navigate(`/forex-trading-pro/${encodeURIComponent(pair.name)}`)}
                >
                  <span className="text-sm">{pair.name}</span>
                  <div className="text-right">
                    <div className="font-mono text-xs">{pair.price.toFixed(4)}</div>
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
                <h1 className="text-xl font-bold mr-2">{currentPair.name}</h1>
                <div className={`text-sm px-2 py-0.5 rounded ${currentPair.change24h >= 0 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                  {currentPair.change24h >= 0 ? '+' : ''}{currentPair.change24h}%
                </div>
                <div className="ml-2 text-lg font-mono">
                  {currentPair.price.toFixed(5)}
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <Button 
                  onClick={() => navigate(`/forex-trading/${encodeURIComponent(currentPair.name)}`)}
                  variant="outline"
                  size="sm"
                  className="border-accent-500 text-accent-500 hover:bg-accent-500/10 h-8"
                >
                  <MonitorSmartphone className="w-4 h-4 mr-2" />
                  Switch to Basic Mode
                </Button>
                
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
              {/* Chart area - spans 9 columns on large screens */}
              <div className="col-span-12 lg:col-span-9">
                <div className="relative">
                  {/* Chart controls */}
                  <div className="absolute top-4 right-4 z-10 flex space-x-2">
                    <div className="flex border border-primary-700 rounded overflow-hidden bg-primary-800/90">
                      {['1m', '5m', '15m', '1h', '4h', '1d'].map(tf => (
                        <button 
                          key={tf}
                          className={`px-2 py-1 text-xs ${timeFrame === tf ? 'bg-primary-700' : 'bg-transparent hover:bg-primary-700/50'}`}
                          onClick={() => handleTimeFrameChange(tf)}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                    
                    <div className="flex border border-primary-700 rounded overflow-hidden bg-primary-800/90">
                      {[
                        { type: 'candlestick', label: 'Candle', icon: BarChart },
                        { type: 'line', label: 'Line', icon: LineChart },
                        { type: 'area', label: 'Area', icon: TrendingUp }
                      ].map(item => (
                        <button 
                          key={item.type}
                          className={`px-2 py-1 text-xs flex items-center ${chartType === item.type ? 'bg-primary-700' : 'bg-transparent hover:bg-primary-700/50'}`}
                          onClick={() => handleChartTypeChange(item.type as any)}
                        >
                          <item.icon className="h-3 w-3 mr-1" />
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <TradingViewChart 
                    candleData={candleData} 
                    pair={currentPair.name} 
                    height={500} 
                  />
                </div>
                
                <div className="mt-4">
                  <OpenPositions />
                </div>
              </div>
              
              {/* Right sidebar - spans 3 columns on large screens */}
              <div className="col-span-12 lg:col-span-3 space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <ForexOrderForm pair={currentPair} />
                  <OrderBook pair={currentPair} />
                </div>
              </div>
            </div>
            
            {/* AI Strategy */}
            <div className="mt-4 mb-4">
              <AiStrategyBox pairName={currentPair.name} pairId={currentPair.id} />
            </div>
            
            {/* Bottom row */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
              <div className="md:col-span-4">
                <MarketInfo pair={currentPair} />
              </div>
              <div className="md:col-span-4">
                <PIPCalculator pair={currentPair} />
              </div>
              <div className="md:col-span-4">
                <div className="rounded-lg border border-primary-700 bg-primary-800 overflow-hidden shadow-lg">
                  <ForexNews />
                </div>
              </div>
            </div>
            
            {/* Recent Trades */}
            <div className="mt-4">
              <RecentTrades />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}