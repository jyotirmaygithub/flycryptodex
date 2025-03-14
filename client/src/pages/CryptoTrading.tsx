import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { TradingPair } from "@shared/schema";
import TradingChart from "@/components/trading/TradingChart";
import { useMarketData } from "@/hooks/useMarketData";
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
  BarChart2,
  Search,
  Star,
  RefreshCw
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

function MarketOverview() {
  return (
    <div className="bg-primary-800 p-4 rounded-lg border border-primary-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Market Overview</h3>
        <Button variant="ghost" size="sm" className="text-accent-400 hover:text-accent-300">
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </Button>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-400">BTC Dominance:</span>
          <span>51.3%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-400">24h Volume:</span>
          <span>$89.7B</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-400">Market Cap:</span>
          <span>$2.37T</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-400">BTC Fear & Greed:</span>
          <span className="text-green-500">72 (Greed)</span>
        </div>
      </div>
    </div>
  );
}

function FundingInfo() {
  return (
    <div className="bg-primary-800 p-3 rounded-lg border border-primary-700 h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-sm">Funding Info</h3>
        <div className="flex items-center text-[10px] bg-primary-700 rounded-full px-1.5 py-0.5">
          <Clock className="h-2.5 w-2.5 mr-0.5" />
          <span>Next: 03:12:45</span>
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-neutral-400">Current Rate:</span>
          <span className="text-green-500">+0.0103%</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-neutral-400">Predicted Rate:</span>
          <span className="text-green-500">+0.0089%</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-neutral-400">Interval:</span>
          <span>8 hours</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-neutral-400">8h Avg.:</span>
          <span className="text-green-500">+0.0097%</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-neutral-400">Daily Est.:</span>
          <span className="text-green-500">+0.0291%</span>
        </div>
        <div className="mt-2 bg-blue-900/20 border border-blue-800/30 rounded p-1">
          <p className="text-[10px] text-blue-300">
            <Info className="inline h-2.5 w-2.5 mr-0.5 text-blue-400" />
            Funding payments occur every 8 hours. Longs pay shorts when positive, shorts pay longs when negative.
          </p>
        </div>
      </div>
    </div>
  );
}

function PositionSummary({ pair }: { pair: TradingPair }) {
  return (
    <div className="bg-primary-800 p-3 rounded-lg border border-primary-700 h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-sm">Positions</h3>
        <div className="flex space-x-1">
          <Button variant="ghost" size="sm" className="h-5 px-1.5 text-[10px]">
            History
          </Button>
          <Button variant="ghost" size="sm" className="h-5 px-1.5 text-[10px]">
            Orders
          </Button>
        </div>
      </div>
      
      <div className="p-2 text-center bg-primary-700/50 rounded mb-2">
        <p className="text-neutral-400 text-xs mb-0.5">No active positions</p>
        <p className="text-[10px]">Place an order to open a position</p>
      </div>
      
      <div className="bg-primary-700/30 rounded p-2 mb-2">
        <div className="flex justify-between items-center mb-1">
          <h4 className="text-xs font-medium">Account Summary</h4>
          <span className="text-[10px] bg-green-900/30 text-green-400 px-1.5 py-0.5 rounded">Healthy</span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-neutral-400">Balance:</span>
            <span className="font-mono">$10,000.00</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-neutral-400">Used Margin:</span>
            <span className="font-mono">$0.00</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-neutral-400">Available:</span>
            <span className="font-mono">$10,000.00</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-neutral-400">Margin Ratio:</span>
            <span className="font-mono">0.00%</span>
          </div>
        </div>
      </div>
      
      <div className="rounded border border-primary-700/50 p-2">
        <h4 className="text-xs font-medium mb-1">Recent Activity</h4>
        <div className="space-y-1.5">
          <div className="text-[10px] flex justify-between pb-1 border-b border-primary-700/30">
            <div>
              <div className="font-medium">Deposit</div>
              <div className="text-neutral-400">2023-03-13 14:32</div>
            </div>
            <div className="text-right">
              <div className="text-green-500">+$10,000.00</div>
              <div className="text-neutral-400">Completed</div>
            </div>
          </div>
          <div className="text-xs text-center text-neutral-400">
            <button className="text-[10px] hover:text-accent-400">View more</button>
          </div>
        </div>
      </div>
    </div>
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
    <div className="bg-primary-800 p-3 rounded-lg border border-primary-700 h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-sm">Risk Calculator</h3>
        <div className="text-[10px] bg-blue-900/60 text-blue-300 px-1.5 py-0.5 rounded">
          <AlertCircle className="h-2.5 w-2.5 inline mr-0.5" />
          <span>Calculator</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <div>
          <Label htmlFor="position-size" className="text-xs">Position Size ({pair.baseAsset})</Label>
          <Input 
            id="position-size" 
            type="number" 
            className="bg-primary-700 border-primary-600 h-7 text-xs"
            value={positionSize}
            onChange={(e) => setPositionSize(parseFloat(e.target.value) || 0)}
            step={0.01}
          />
        </div>
        
        <div>
          <div className="flex justify-between mb-1">
            <Label htmlFor="leverage" className="text-xs">Leverage: {leverage}x</Label>
          </div>
          <Slider
            id="leverage"
            min={1}
            max={100}
            step={1}
            value={[leverage]}
            onValueChange={(value) => setLeverage(value[0])}
            className="h-3"
          />
          <div className="flex justify-between text-[10px] text-neutral-400">
            <span>1x</span>
            <span>25x</span>
            <span>50x</span>
            <span>75x</span>
            <span>100x</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-1">
          <Button 
            className={`py-1 text-xs ${side === 'long' ? 'bg-green-600 hover:bg-green-700' : 'bg-primary-700'}`}
            onClick={() => setSide('long')}
          >
            Long
          </Button>
          <Button 
            className={`py-1 text-xs ${side === 'short' ? 'bg-red-600 hover:bg-red-700' : 'bg-primary-700'}`}
            onClick={() => setSide('short')}
          >
            Short
          </Button>
        </div>
        
        <div>
          <Label htmlFor="entry-price" className="text-xs">Entry Price ({pair.quoteAsset})</Label>
          <Input 
            id="entry-price" 
            type="number" 
            className="bg-primary-700 border-primary-600 h-7 text-xs"
            value={entryPrice}
            onChange={(e) => setEntryPrice(parseFloat(e.target.value) || 0)}
          />
        </div>
        
        <div className="p-2 border border-primary-700/50 rounded bg-primary-700/30 mt-1">
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-neutral-400">Liquidation Price:</span>
              <span className="font-semibold text-yellow-500 font-mono">${liquidationPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Position Value:</span>
              <span className="font-mono">${(positionSize * entryPrice).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Required Margin:</span>
              <span className="font-mono">${((positionSize * entryPrice) / leverage).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">Potential PnL at ±5%:</span>
              <span className={`font-mono ${side === 'long' ? 'text-green-500' : 'text-red-500'}`}>
                {side === 'long' ? '+' : '-'}${(positionSize * entryPrice * 0.05 * leverage).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center text-[10px] text-neutral-400 mt-1">
          <p>This tool helps estimate risk based on position parameters</p>
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
    <div className="bg-primary-800 rounded-lg border border-primary-700 p-3 h-full">
      <h3 className="font-semibold text-sm mb-2">Perpetual Contract</h3>
      
      <div className="mb-2">
        <Tabs defaultValue="Market" onValueChange={setOrderType}>
          <TabsList className="grid w-full grid-cols-4 h-7">
            <TabsTrigger className="text-xs py-1" value="Market">Market</TabsTrigger>
            <TabsTrigger className="text-xs py-1" value="Limit">Limit</TabsTrigger>
            <TabsTrigger className="text-xs py-1" value="Stop">Stop</TabsTrigger>
            <TabsTrigger className="text-xs py-1" value="TP/SL">TP/SL</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="mb-2 grid grid-cols-2 gap-2">
        <Button 
          className={`py-2 text-xs ${orderSide === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-primary-700'}`}
          onClick={() => setOrderSide('buy')}
        >
          Long
        </Button>
        <Button 
          className={`py-2 text-xs ${orderSide === 'sell' ? 'bg-red-600 hover:bg-red-700' : 'bg-primary-700'}`}
          onClick={() => setOrderSide('sell')}
        >
          Short
        </Button>
      </div>
      
      <div className="space-y-2 mb-3">
        <div>
          <div className="flex justify-between">
            <Label htmlFor="amount" className="text-xs">Contract Qty</Label>
            <span className="text-xs text-neutral-400">Available: $10,000.00</span>
          </div>
          <div className="relative">
            <Input 
              id="amount" 
              className="bg-primary-700 border-primary-600 h-7 text-xs"
              value={amount} 
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              type="number"
              step={0.001}
            />
            <div className="absolute inset-y-0 right-0 pr-1 flex items-center space-x-0.5">
              <button className="text-[10px] px-1 rounded bg-primary-600 text-neutral-300 hover:bg-primary-500">25%</button>
              <button className="text-[10px] px-1 rounded bg-primary-600 text-neutral-300 hover:bg-primary-500">50%</button>
              <button className="text-[10px] px-1 rounded bg-primary-600 text-neutral-300 hover:bg-primary-500">75%</button>
              <button className="text-[10px] px-1 rounded bg-primary-600 text-neutral-300 hover:bg-primary-500">Max</button>
            </div>
          </div>
          <div className="text-xs text-right mt-0.5 text-neutral-400">
            ≈ ${(amount * pair.price).toLocaleString()}
          </div>
        </div>
        
        {orderType !== 'Market' && (
          <div>
            <Label htmlFor="price" className="text-xs">Price ({pair.quoteAsset})</Label>
            <Input 
              id="price" 
              className="bg-primary-700 border-primary-600 h-7 text-xs"
              value={price} 
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              type="number"
              step={0.01}
            />
          </div>
        )}
        
        {(orderType === 'Stop' || orderType === 'TP/SL') && (
          <div>
            <Label htmlFor="trigger-price" className="text-xs">Trigger Price ({pair.quoteAsset})</Label>
            <Input 
              id="trigger-price" 
              className="bg-primary-700 border-primary-600 h-7 text-xs"
              defaultValue={orderSide === 'buy' ? (pair.price * 1.05).toFixed(2) : (pair.price * 0.95).toFixed(2)}
              type="number"
              step={0.01}
            />
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-1">
            <Switch 
              id="reduceOnly" 
              checked={reduceOnly} 
              onCheckedChange={setReduceOnly}
              className="h-3.5 w-7"
            />
            <Label htmlFor="reduceOnly" className="text-xs">Reduce Only</Label>
          </div>
          
          {orderType === 'Limit' && (
            <div className="flex items-center space-x-1">
              <Switch 
                id="postOnly" 
                checked={postOnly} 
                onCheckedChange={setPostOnly}
                className="h-3.5 w-7"
              />
              <Label htmlFor="postOnly" className="text-xs">Post Only</Label>
            </div>
          )}
        </div>
      </div>
      
      <div className="pt-2 border-t border-primary-700">
        <Button 
          className={`w-full py-2.5 text-xs ${orderSide === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
          onClick={handlePlaceOrder}
        >
          {orderSide === 'buy' ? 'Long / Buy' : 'Short / Sell'} {pair.baseAsset}
        </Button>
      </div>
    </div>
  );
}

function OrderBook({ pair }: { pair: TradingPair }) {
  // Mock order book data
  const maxSize = 5;
  const asks = Array(12).fill(0).map((_, i) => ({
    price: pair.price + (pair.price * 0.0005 * (i + 1)),
    size: Math.random() * maxSize,
    total: 0
  })).map((ask, i, arr) => ({
    ...ask,
    total: arr.slice(0, i + 1).reduce((sum, item) => sum + item.size, 0)
  }));
  
  const bids = Array(12).fill(0).map((_, i) => ({
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

  return (
    <div className="bg-primary-800 rounded-lg border border-primary-700 p-3 h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-sm">Order Book</h3>
        <div className="flex items-center space-x-0.5 text-[10px] bg-primary-700 rounded px-1.5 py-0.5">
          <span className="text-neutral-400">Spread:</span>
          <span className="text-accent-500 font-medium">${(asks[0].price - bids[0].price).toFixed(2)} ({((asks[0].price - bids[0].price) / pair.price * 100).toFixed(3)}%)</span>
        </div>
      </div>
      
      <div className="mb-1 grid grid-cols-4 text-[10px] text-neutral-400">
        <div>Price ({pair.quoteAsset})</div>
        <div className="text-right">Size</div>
        <div className="text-right">Total</div>
        <div></div> {/* For depth visualization */}
      </div>
      
      <div className="space-y-0 max-h-[135px] overflow-y-auto mb-1">
        {asks.slice().reverse().map((ask, index) => (
          <div key={`ask-${index}`} className="grid grid-cols-4 text-[10px] items-center py-0.5">
            <div className="text-red-500 font-mono">${ask.price.toFixed(2)}</div>
            <div className="text-right font-mono">{ask.size.toFixed(3)}</div>
            <div className="text-right font-mono">{ask.total.toFixed(3)}</div>
            <div className="h-full pl-2">
              <div 
                className="h-[2px] bg-red-600/30" 
                style={{ width: `${(ask.total / maxTotal) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="py-1 text-center font-bold text-base border-y border-primary-700 my-1">
        <span className={pair.change24h >= 0 ? 'text-green-500' : 'text-red-500'}>
          ${pair.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
      
      <div className="space-y-0 max-h-[135px] overflow-y-auto">
        {bids.map((bid, index) => (
          <div key={`bid-${index}`} className="grid grid-cols-4 text-[10px] items-center py-0.5">
            <div className="text-green-500 font-mono">${bid.price.toFixed(2)}</div>
            <div className="text-right font-mono">{bid.size.toFixed(3)}</div>
            <div className="text-right font-mono">{bid.total.toFixed(3)}</div>
            <div className="h-full pl-2">
              <div 
                className="h-[2px] bg-green-600/30" 
                style={{ width: `${(bid.total / maxTotal) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-1 pt-1 text-center text-[10px] text-neutral-400 border-t border-primary-700">
        <div className="flex justify-between">
          <button className="hover:text-accent-400">0.1</button>
          <button className="hover:text-accent-400">0.01</button>
          <button className="hover:text-accent-400">0.001</button>
          <button className="hover:text-accent-400">Group</button>
          <button className="hover:text-accent-400">More</button>
        </div>
      </div>
    </div>
  );
}

function MarketInfo({ pair }: { pair: TradingPair }) {
  const [selectedTab, setSelectedTab] = useState<string>("overview");
  
  return (
    <div className="bg-primary-800 rounded-lg border border-primary-700 p-3 h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-sm">Market Data</h3>
        <div className={`text-[10px] px-1.5 py-0.5 rounded ${pair.change24h >= 0 ? 'bg-green-900/30 text-green-500' : 'bg-red-900/30 text-red-500'}`}>
          {pair.change24h >= 0 ? '+' : ''}{pair.change24h}%
        </div>
      </div>
      
      <Tabs defaultValue="overview" onValueChange={setSelectedTab} className="h-full">
        <TabsList className="w-full mb-2 h-7">
          <TabsTrigger value="overview" className="text-xs h-6">Stats</TabsTrigger>
          <TabsTrigger value="details" className="text-xs h-6">Info</TabsTrigger>
          <TabsTrigger value="trades" className="text-xs h-6">Trades</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-2 mt-0 h-[calc(100%-32px)]">
          <div className="bg-primary-700/30 p-2 rounded">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-semibold font-mono">${pair.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              <span className={`text-[10px] font-mono ${pair.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {pair.change24h >= 0 ? '↑' : '↓'} ${(pair.price * Math.abs(pair.change24h) / 100).toFixed(2)}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              <div className="flex justify-between text-[10px]">
                <span className="text-neutral-400">24h High:</span>
                <span className="font-mono">${(pair.price * 1.02).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-[10px]">
                <span className="text-neutral-400">24h Low:</span>
                <span className="font-mono">${(pair.price * 0.98).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-[10px]">
                <span className="text-neutral-400">24h Vol:</span>
                <span className="font-mono">$38.2M</span>
              </div>
              
              <div className="flex justify-between text-[10px]">
                <span className="text-neutral-400">Vol ({pair.baseAsset}):</span>
                <span className="font-mono">{(38200000 / pair.price).toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-primary-700 pt-2">
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400">Open Interest:</span>
                <span className="font-mono">$14.6M</span>
              </div>
              
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400">OI Change (24h):</span>
                <span className="font-mono text-green-500">+5.3%</span>
              </div>
              
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400">Index Price:</span>
                <span className="font-mono">${(pair.price * 0.9995).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400">Mark Price:</span>
                <span className="font-mono">${(pair.price * 1.0002).toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400">Funding Rate:</span>
                <span className="font-mono text-green-500">+0.0103%</span>
              </div>
              
              <div className="flex justify-between text-xs">
                <span className="text-neutral-400">Long/Short Ratio:</span>
                <span className="font-mono">0.94</span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-primary-700 pt-2">
            <div className="text-[10px] flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-neutral-400 mr-1">Long:</span>
                <div className="h-1.5 w-16 bg-green-700/60 rounded-sm"></div>
              </div>
              <div className="flex items-center">
                <span className="text-neutral-400 mr-1">Short:</span>
                <div className="h-1.5 w-17 bg-red-700/60 rounded-sm"></div>
              </div>
              <span className="text-neutral-400">48.7% / 51.3%</span>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="details" className="mt-0 h-[calc(100%-32px)] overflow-y-auto">
          <div className="space-y-2">
            <div className="bg-primary-700/30 p-2 rounded">
              <h4 className="text-xs font-medium mb-1">About {pair.baseAsset}</h4>
              <p className="text-[10px] text-neutral-300 leading-relaxed">
                {pair.baseAsset === 'BTC' ? 
                  'Bitcoin is a decentralized digital currency created in 2009. It follows ideas set out in a whitepaper by the pseudonymous Satoshi Nakamoto.' :
                  `${pair.baseAsset} is a digital asset operating on a blockchain network, used for various applications in the cryptocurrency ecosystem.`
                }
              </p>
            </div>
            
            <div className="bg-primary-700/30 p-2 rounded">
              <h4 className="text-xs font-medium mb-1">Asset Information</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-neutral-400">Market Cap:</span>
                  <span className="font-mono">{pair.baseAsset === 'BTC' ? '$1.18T' : pair.baseAsset === 'ETH' ? '$418B' : '$27.8B'}</span>
                </div>
                
                <div className="flex justify-between text-[10px]">
                  <span className="text-neutral-400">Circulating Supply:</span>
                  <span className="font-mono">{pair.baseAsset === 'BTC' ? '19.37M' : pair.baseAsset === 'ETH' ? '120.27M' : '553.3M'}</span>
                </div>
                
                <div className="flex justify-between text-[10px]">
                  <span className="text-neutral-400">Max Supply:</span>
                  <span className="font-mono">{pair.baseAsset === 'BTC' ? '21M' : 'Unlimited'}</span>
                </div>
                
                <div className="flex justify-between text-[10px]">
                  <span className="text-neutral-400">All-Time High:</span>
                  <span className="font-mono">${pair.baseAsset === 'BTC' ? '69,000' : pair.baseAsset === 'ETH' ? '4,878' : '324'}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-primary-700/30 p-2 rounded">
              <h4 className="text-xs font-medium mb-1">Contract Info</h4>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-neutral-400">Contract Type:</span>
                  <span className="font-mono">Perpetual</span>
                </div>
                
                <div className="flex justify-between text-[10px]">
                  <span className="text-neutral-400">Quote Currency:</span>
                  <span className="font-mono">{pair.quoteAsset}</span>
                </div>
                
                <div className="flex justify-between text-[10px]">
                  <span className="text-neutral-400">Margin:</span>
                  <span className="font-mono">USDT</span>
                </div>
                
                <div className="flex justify-between text-[10px]">
                  <span className="text-neutral-400">Max Leverage:</span>
                  <span className="font-mono">100x</span>
                </div>
                
                <div className="flex justify-between text-[10px]">
                  <span className="text-neutral-400">Tick Size:</span>
                  <span className="font-mono">0.01</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="trades" className="mt-0 h-[calc(100%-32px)] overflow-y-auto">
          <div className="grid grid-cols-4 text-[10px] text-neutral-400 mb-1 py-1 border-b border-primary-700/50">
            <div>Price</div>
            <div className="text-right">Qty</div>
            <div className="text-right">Value</div>
            <div className="text-right">Time</div>
          </div>
          
          {Array(15).fill(0).map((_, i) => {
            const isBuy = Math.random() > 0.5;
            const price = pair.price * (1 + (isBuy ? 1 : -1) * (Math.random() * 0.001));
            const size = (Math.random() * 0.5).toFixed(4);
            const value = (price * parseFloat(size)).toFixed(2);
            const minutes = Math.floor(Math.random() * 10);
            const seconds = Math.floor(Math.random() * 60);
            
            return (
              <div key={i} className="grid grid-cols-4 text-[10px] py-0.5 border-b border-primary-700/20">
                <div className={`font-mono ${isBuy ? 'text-green-500' : 'text-red-500'}`}>
                  ${price.toFixed(2)}
                </div>
                <div className="text-right font-mono">{size}</div>
                <div className="text-right font-mono">${value}</div>
                <div className="text-right text-neutral-400">{minutes}m {seconds}s</div>
              </div>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function CryptoTrading() {
  const { pair: pairParam } = useParams();
  const [, navigate] = useLocation();
  const [currentPair, setCurrentPair] = useState<TradingPair>(cryptoPairs[0]);
  
  // Get market data with our hook
  const { 
    candlesticks, 
    timeFrame, 
    chartType, 
    changeTimeFrame, 
    changeChartType,
    isLoading
  } = useMarketData(currentPair?.name);
  
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

  return (
    <div className="min-h-screen flex flex-col bg-primary-900 text-white">
      {/* Header */}
      <header className="border-b border-primary-700 bg-primary-800 p-4 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-accent-500 text-xl font-bold">Fly<span className="text-white">Crypto</span></span>
          <div className="ml-6 flex space-x-2">
            {cryptoPairs.slice(0, 4).map(pair => (
              <Button
                key={pair.id}
                variant={currentPair.id === pair.id ? "default" : "outline"}
                size="sm"
                className={`text-sm ${currentPair.id === pair.id ? 'bg-accent-500' : ''}`}
                onClick={() => navigate(`/crypto-trading/${encodeURIComponent(pair.name)}`)}
              >
                {pair.name}
              </Button>
            ))}
          </div>
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
      
      <main className="flex-1 p-4 grid grid-cols-12 gap-4 max-w-screen-2xl mx-auto">
        {/* Main Chart */}
        <div className="col-span-12 lg:col-span-8 rounded-lg border border-primary-700 bg-primary-800">
          <div className="p-4 border-b border-primary-700 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold">{currentPair.name}</h1>
              <div className="flex items-center">
                <span className="text-2xl font-mono">${currentPair.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                <span className={`ml-2 px-2 py-1 rounded ${currentPair.change24h >= 0 ? 'bg-green-600/20 text-green-500' : 'bg-red-600/20 text-red-500'}`}>
                  {currentPair.change24h >= 0 ? '+' : ''}{currentPair.change24h}%
                </span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">1H</Button>
              <Button variant="outline" size="sm" className="bg-accent-500/10">4H</Button>
              <Button variant="outline" size="sm">1D</Button>
              <Button variant="outline" size="sm">1W</Button>
            </div>
          </div>
          
          <div className="p-2 h-96">
            <PlaceholderChart />
          </div>
        </div>
        
        {/* Order Form */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          <div className="rounded-lg border border-primary-700 bg-primary-800 p-4">
            <h2 className="text-lg font-bold mb-4">Trade {currentPair.baseAsset}</h2>
            
            <Tabs defaultValue="buy">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="buy" className="bg-green-600/80 data-[state=active]:bg-green-600">Buy</TabsTrigger>
                <TabsTrigger value="sell" className="bg-red-600/80 data-[state=active]:bg-red-600">Sell</TabsTrigger>
              </TabsList>
              
              <TabsContent value="buy" className="mt-0 space-y-4">
                <div>
                  <Label htmlFor="price">Price ({currentPair.quoteAsset})</Label>
                  <Input id="price" className="mt-1 bg-primary-700 border-primary-600" defaultValue={currentPair.price.toFixed(2)} />
                </div>
                
                <div>
                  <Label htmlFor="amount">Amount ({currentPair.baseAsset})</Label>
                  <Input id="amount" className="mt-1 bg-primary-700 border-primary-600" defaultValue="0.01" />
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    <Button variant="outline" size="sm" className="text-xs">25%</Button>
                    <Button variant="outline" size="sm" className="text-xs">50%</Button>
                    <Button variant="outline" size="sm" className="text-xs">75%</Button>
                    <Button variant="outline" size="sm" className="text-xs">100%</Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="total">Total ({currentPair.quoteAsset})</Label>
                  <Input id="total" className="mt-1 bg-primary-700 border-primary-600" defaultValue={(currentPair.price * 0.01).toFixed(2)} />
                </div>
                
                <Button className="w-full mt-4 py-6 bg-green-600 hover:bg-green-700 text-white font-bold">
                  Buy {currentPair.baseAsset}
                </Button>
              </TabsContent>
              
              <TabsContent value="sell" className="mt-0 space-y-4">
                <div>
                  <Label htmlFor="sell-price">Price ({currentPair.quoteAsset})</Label>
                  <Input id="sell-price" className="mt-1 bg-primary-700 border-primary-600" defaultValue={currentPair.price.toFixed(2)} />
                </div>
                
                <div>
                  <Label htmlFor="sell-amount">Amount ({currentPair.baseAsset})</Label>
                  <Input id="sell-amount" className="mt-1 bg-primary-700 border-primary-600" defaultValue="0.01" />
                  <div className="mt-2 grid grid-cols-4 gap-2">
                    <Button variant="outline" size="sm" className="text-xs">25%</Button>
                    <Button variant="outline" size="sm" className="text-xs">50%</Button>
                    <Button variant="outline" size="sm" className="text-xs">75%</Button>
                    <Button variant="outline" size="sm" className="text-xs">100%</Button>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="sell-total">Total ({currentPair.quoteAsset})</Label>
                  <Input id="sell-total" className="mt-1 bg-primary-700 border-primary-600" defaultValue={(currentPair.price * 0.01).toFixed(2)} />
                </div>
                
                <Button className="w-full mt-4 py-6 bg-red-600 hover:bg-red-700 text-white font-bold">
                  Sell {currentPair.baseAsset}
                </Button>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="rounded-lg border border-primary-700 bg-primary-800 p-4">
            <h2 className="text-lg font-bold mb-4">Market Info</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-neutral-400">24h High:</span>
                <span className="font-mono">${(currentPair.price * 1.02).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">24h Low:</span>
                <span className="font-mono">${(currentPair.price * 0.98).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">24h Volume:</span>
                <span className="font-mono">$43.7M</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">24h Change:</span>
                <span className={`font-mono ${currentPair.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {currentPair.change24h >= 0 ? '+' : ''}{currentPair.change24h}%
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Order Book and Recent Trades */}
        <div className="col-span-12 lg:col-span-8 grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-primary-700 bg-primary-800 p-4">
            <h2 className="text-lg font-bold mb-4">Order Book</h2>
            <div className="grid grid-cols-3 text-sm text-neutral-400 mb-2">
              <div>Price ({currentPair.quoteAsset})</div>
              <div className="text-right">Amount ({currentPair.baseAsset})</div>
              <div className="text-right">Total</div>
            </div>
            
            <div className="space-y-1 max-h-[200px] overflow-y-auto mb-2">
              {Array(10).fill(0).map((_, i) => {
                const price = currentPair.price + (currentPair.price * 0.001 * (i + 1));
                const amount = (Math.random() * 2).toFixed(4);
                
                return (
                  <div key={`ask-${i}`} className="grid grid-cols-3 text-sm">
                    <div className="text-red-500">${price.toFixed(2)}</div>
                    <div className="text-right">{amount}</div>
                    <div className="text-right">${(price * parseFloat(amount)).toFixed(2)}</div>
                  </div>
                );
              })}
            </div>
            
            <div className="py-2 my-2 border-y border-primary-700 text-center font-bold">
              <span className={currentPair.change24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                ${currentPair.price.toFixed(2)}
              </span>
            </div>
            
            <div className="space-y-1 max-h-[200px] overflow-y-auto">
              {Array(10).fill(0).map((_, i) => {
                const price = currentPair.price - (currentPair.price * 0.001 * (i + 1));
                const amount = (Math.random() * 2).toFixed(4);
                
                return (
                  <div key={`bid-${i}`} className="grid grid-cols-3 text-sm">
                    <div className="text-green-500">${price.toFixed(2)}</div>
                    <div className="text-right">{amount}</div>
                    <div className="text-right">${(price * parseFloat(amount)).toFixed(2)}</div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="rounded-lg border border-primary-700 bg-primary-800 p-4">
            <h2 className="text-lg font-bold mb-4">Recent Trades</h2>
            <div className="grid grid-cols-4 text-sm text-neutral-400 mb-2">
              <div>Price</div>
              <div className="text-right">Amount</div>
              <div className="text-right">Total</div>
              <div className="text-right">Time</div>
            </div>
            
            <div className="space-y-1 max-h-[420px] overflow-y-auto">
              {Array(20).fill(0).map((_, i) => {
                const isBuy = Math.random() > 0.5;
                const price = currentPair.price * (1 + (isBuy ? 1 : -1) * (Math.random() * 0.001));
                const amount = (Math.random() * 0.5).toFixed(4);
                const total = (price * parseFloat(amount)).toFixed(2);
                const minutes = Math.floor(Math.random() * 10);
                const seconds = Math.floor(Math.random() * 60);
                
                return (
                  <div key={i} className="grid grid-cols-4 text-sm">
                    <div className={isBuy ? 'text-green-500' : 'text-red-500'}>
                      ${price.toFixed(2)}
                    </div>
                    <div className="text-right">{amount}</div>
                    <div className="text-right">${total}</div>
                    <div className="text-right text-neutral-400">{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Your Orders */}
        <div className="col-span-12 rounded-lg border border-primary-700 bg-primary-800 p-4">
          <h2 className="text-lg font-bold mb-4">Your Orders</h2>
          
          <Tabs defaultValue="open">
            <TabsList className="mb-4">
              <TabsTrigger value="open">Open Orders</TabsTrigger>
              <TabsTrigger value="history">Order History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="open" className="mt-0">
              <div className="text-center py-8 text-neutral-400">
                You have no open orders at this time
              </div>
            </TabsContent>
            
            <TabsContent value="history" className="mt-0">
              <div className="text-center py-8 text-neutral-400">
                Your order history will appear here
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}