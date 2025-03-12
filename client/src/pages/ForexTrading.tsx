import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Switch } from "@/components/ui/switch";
import { TradingPair } from "@shared/schema";
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
  AlertCircle
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

// Mock chart component
function PlaceholderChart() {
  return (
    <div className="w-full h-96 bg-primary-800 rounded-lg border border-primary-700 flex items-center justify-center mb-4">
      <TrendingUp className="w-16 h-16 text-accent-500 opacity-20" />
    </div>
  );
}

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
    <div className="bg-primary-800 p-4 rounded-lg border border-primary-700">
      <h3 className="font-medium mb-3">PIP Calculator</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="amount">Trade Size (Lots)</Label>
          <Input 
            id="amount" 
            type="number" 
            className="bg-primary-700 border-primary-600"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            min={0.01}
            step={0.01}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="pip-size">PIP Size</Label>
            <div className="bg-primary-700 p-2 rounded border border-primary-600">
              {pair.name.includes('JPY') ? '0.01' : '0.0001'}
            </div>
          </div>
          <div>
            <Label htmlFor="pip-value">PIP Value (USD)</Label>
            <div className="bg-primary-700 p-2 rounded border border-primary-600 font-medium">
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
    <div className="bg-primary-800 rounded-lg border border-primary-700 p-4">
      <h3 className="font-semibold mb-4">Place Order</h3>
      
      <div className="mb-4">
        <Tabs defaultValue="Market" onValueChange={setOrderType}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="Market">Market</TabsTrigger>
            <TabsTrigger value="Limit">Limit</TabsTrigger>
            <TabsTrigger value="Stop">Stop</TabsTrigger>
            <TabsTrigger value="StopLimit">Stop Limit</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="mb-4 grid grid-cols-2 gap-4">
        <Button 
          className={`py-4 ${orderSide === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-primary-700'}`}
          onClick={() => setOrderSide('buy')}
        >
          Buy / Long
        </Button>
        <Button 
          className={`py-4 ${orderSide === 'sell' ? 'bg-red-600 hover:bg-red-700' : 'bg-primary-700'}`}
          onClick={() => setOrderSide('sell')}
        >
          Sell / Short
        </Button>
      </div>
      
      <div className="space-y-4 mb-6">
        <div>
          <Label htmlFor="amount">Amount (Lots)</Label>
          <div className="relative">
            <Input 
              id="amount" 
              className="bg-primary-700 border-primary-600"
              value={amount} 
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              type="number"
              min={0.01}
              step={0.01}
            />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="stopLoss">Stop Loss</Label>
            <Switch 
              id="useStopLoss" 
              checked={useStopLoss} 
              onCheckedChange={setUseStopLoss} 
            />
          </div>
          <div className="flex space-x-2">
            <Input 
              id="stopLoss" 
              className={`bg-primary-700 border-primary-600 ${!useStopLoss && 'opacity-50'}`}
              value={stopLossPrice} 
              onChange={(e) => setStopLossPrice(parseFloat(e.target.value) || 0)}
              type="number"
              step={0.00001}
              disabled={!useStopLoss}
            />
            <Button 
              variant="outline" 
              size="sm" 
              className={`w-24 ${!useStopLoss && 'opacity-50'}`}
              disabled={!useStopLoss}
            >
              {orderSide === 'buy' ? '-100 pips' : '+100 pips'}
            </Button>
          </div>
          {useStopLoss && (
            <div className="text-xs text-muted-foreground mt-1">
              {orderSide === 'buy' 
                ? `Loss: $${((pair.price - stopLossPrice) * amount * 10000).toFixed(2)}` 
                : `Loss: $${((stopLossPrice - pair.price) * amount * 10000).toFixed(2)}`}
            </div>
          )}
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="takeProfit">Take Profit</Label>
            <Switch 
              id="useTakeProfit" 
              checked={useTakeProfit} 
              onCheckedChange={setUseTakeProfit} 
            />
          </div>
          <div className="flex space-x-2">
            <Input 
              id="takeProfit" 
              className={`bg-primary-700 border-primary-600 ${!useTakeProfit && 'opacity-50'}`}
              value={takeProfitPrice} 
              onChange={(e) => setTakeProfitPrice(parseFloat(e.target.value) || 0)}
              type="number"
              step={0.00001}
              disabled={!useTakeProfit}
            />
            <Button 
              variant="outline" 
              size="sm" 
              className={`w-24 ${!useTakeProfit && 'opacity-50'}`}
              disabled={!useTakeProfit}
            >
              {orderSide === 'buy' ? '+100 pips' : '-100 pips'}
            </Button>
          </div>
          {useTakeProfit && (
            <div className="text-xs text-muted-foreground mt-1">
              {orderSide === 'buy' 
                ? `Profit: $${((takeProfitPrice - pair.price) * amount * 10000).toFixed(2)}` 
                : `Profit: $${((pair.price - takeProfitPrice) * amount * 10000).toFixed(2)}`}
            </div>
          )}
        </div>
      </div>
      
      <div className="pt-2 border-t border-primary-700">
        <Button 
          className={`w-full py-6 ${orderSide === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
          onClick={handlePlaceOrder}
        >
          {orderSide === 'buy' ? 'Buy / Long' : 'Sell / Short'} {pair.name} @ {pair.price}
        </Button>
      </div>
    </div>
  );
}

function OrderBook({ pair }: { pair: TradingPair }) {
  // Mock order book data
  const asks = Array(10).fill(0).map((_, i) => ({
    price: pair.price + (0.0001 * (i + 1)),
    size: Math.random() * 5 + 0.5,
    total: 0
  })).map((ask, i, arr) => ({
    ...ask,
    total: arr.slice(0, i + 1).reduce((sum, item) => sum + item.size, 0)
  }));
  
  const bids = Array(10).fill(0).map((_, i) => ({
    price: pair.price - (0.0001 * (i + 1)),
    size: Math.random() * 5 + 0.5,
    total: 0
  })).map((bid, i, arr) => ({
    ...bid,
    total: arr.slice(0, i + 1).reduce((sum, item) => sum + item.size, 0)
  }));

  return (
    <div className="bg-primary-800 rounded-lg border border-primary-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Order Book</h3>
        <div className="text-sm">
          Spread: <span className="text-accent-500 font-medium">0.6 pips</span>
        </div>
      </div>
      
      <div className="mb-2 grid grid-cols-3 text-xs text-neutral-400">
        <div>Price</div>
        <div className="text-right">Size</div>
        <div className="text-right">Total</div>
      </div>
      
      <div className="space-y-1 max-h-[200px] overflow-y-auto mb-2">
        {asks.map((ask, index) => (
          <div key={`ask-${index}`} className="grid grid-cols-3 text-sm">
            <div className="text-red-500">{ask.price.toFixed(5)}</div>
            <div className="text-right">{ask.size.toFixed(2)}</div>
            <div className="text-right">{ask.total.toFixed(2)}</div>
          </div>
        ))}
      </div>
      
      <div className="py-2 text-center font-bold text-lg">
        <span className={pair.change24h >= 0 ? 'text-green-500' : 'text-red-500'}>
          {pair.price.toFixed(5)}
        </span>
      </div>
      
      <div className="space-y-1 max-h-[200px] overflow-y-auto">
        {bids.map((bid, index) => (
          <div key={`bid-${index}`} className="grid grid-cols-3 text-sm">
            <div className="text-green-500">{bid.price.toFixed(5)}</div>
            <div className="text-right">{bid.size.toFixed(2)}</div>
            <div className="text-right">{bid.total.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
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
          <div>{(pair.price * 1.005).toFixed(5)}</div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-neutral-400">24h Low</div>
          <div>{(pair.price * 0.995).toFixed(5)}</div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-neutral-400">24h Volume</div>
          <div>{Math.floor(Math.random() * 10000) + 5000} lots</div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-neutral-400">Base Currency</div>
          <div>{pair.baseAsset}</div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-neutral-400">Quote Currency</div>
          <div>{pair.quoteAsset}</div>
        </div>
      </div>
    </div>
  );
}

export default function ForexTrading() {
  const { pair: pairParam } = useParams();
  const [, navigate] = useLocation();
  const [marginMode, setMarginMode] = useState<'cross' | 'isolated'>('cross');
  const [leverage, setLeverage] = useState<number>(10);
  const [currentPair, setCurrentPair] = useState<TradingPair>(forexPairs[0]);
  
  useEffect(() => {
    // Get blockchain selection from localStorage
    const blockchainName = localStorage.getItem('selectedBlockchainName');
    if (!blockchainName) {
      navigate("/select-blockchain");
    }
    
    // Set the current pair based on URL param or default to first pair
    if (pairParam) {
      const foundPair = forexPairs.find(p => p.name === decodeURIComponent(pairParam));
      if (foundPair) {
        setCurrentPair(foundPair);
      }
    }
  }, [pairParam, navigate]);

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
          <h2 className="font-semibold mb-3">Forex Pairs</h2>
          <div className="space-y-2">
            {forexPairs.map(pair => (
              <div key={pair.id} 
                className={`flex items-center justify-between p-2 rounded hover:bg-primary-700 cursor-pointer ${currentPair.id === pair.id ? 'bg-primary-700 border-l-2 border-accent-500 pl-1' : ''}`}
                onClick={() => window.location.href = `/forex-trading/${encodeURIComponent(pair.name)}`}
              >
                <span>{pair.name}</span>
                <div className="text-right">
                  <div className="font-mono">{pair.price.toFixed(4)}</div>
                  <div className={pair.change24h >= 0 ? 'text-green-500 text-xs' : 'text-red-500 text-xs'}>
                    {pair.change24h >= 0 ? '+' : ''}{pair.change24h}%
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-primary-700 rounded-lg">
            <h3 className="font-semibold mb-2">Forex Trading Features</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                Stop Loss & Take Profit
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                PIP Value Calculator
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                Lot Size Management
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                Margin Requirements
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
              <span className="font-mono">{currentPair.price.toFixed(5)}</span>
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
              <PlaceholderChart />
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Left column */}
                <div className="md:col-span-8 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ForexOrderForm pair={currentPair} />
                    <OrderBook pair={currentPair} />
                  </div>
                </div>
                
                {/* Right column */}
                <div className="md:col-span-4 space-y-4">
                  <PIPCalculator pair={currentPair} />
                  <MarketInfo pair={currentPair} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}