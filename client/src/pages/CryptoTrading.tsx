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
    <div className="bg-primary-800 p-4 rounded-lg border border-primary-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Funding Info</h3>
        <div className="flex items-center text-xs bg-primary-700 rounded-full px-2 py-1">
          <Clock className="h-3 w-3 mr-1" />
          <span>Next: 03:12:45</span>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-400">Current Rate:</span>
          <span className="text-green-500">+0.0103%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-400">Predicted Rate:</span>
          <span className="text-green-500">+0.0089%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-400">Interval:</span>
          <span>8 hours</span>
        </div>
        <div className="mt-3 text-xs text-neutral-400">
          <p>Funding rates are payments between long and short positions based on market conditions.</p>
        </div>
      </div>
    </div>
  );
}

function PositionSummary({ pair }: { pair: TradingPair }) {
  return (
    <div className="bg-primary-800 p-4 rounded-lg border border-primary-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Position Summary</h3>
        <Button variant="outline" size="sm" className="h-7 text-xs">
          View History
        </Button>
      </div>
      <div className="p-4 text-center bg-primary-700 rounded-lg mb-3">
        <p className="text-neutral-400 text-sm mb-1">No active positions</p>
        <p className="text-xs">Start trading to see your positions here</p>
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">Account Summary</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-400">Available Balance:</span>
            <span>$10,000.00</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-400">Used Margin:</span>
            <span>$0.00</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-400">Margin Ratio:</span>
            <span>0.00%</span>
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
    <div className="bg-primary-800 p-4 rounded-lg border border-primary-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Risk Calculator</h3>
        <div className="text-xs bg-blue-900/60 text-blue-300 px-2 py-1 rounded">
          <AlertCircle className="h-3 w-3 inline mr-1" />
          <span>Educational Tool</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="position-size">Position Size ({pair.baseAsset})</Label>
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
          <div className="flex justify-between text-xs mt-1 text-neutral-400">
            <span>1x</span>
            <span>25x</span>
            <span>50x</span>
            <span>75x</span>
            <span>100x</span>
          </div>
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
          <div className="flex justify-between mb-2">
            <span className="text-neutral-400">Required Margin:</span>
            <span>${((positionSize * entryPrice) / leverage).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-400">Potential PnL at ±5%:</span>
            <span className={side === 'long' ? 'text-green-500' : 'text-red-500'}>
              {side === 'long' ? '+' : '-'}${(positionSize * entryPrice * 0.05 * leverage).toLocaleString()}
            </span>
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
    <div className="bg-primary-800 rounded-lg border border-primary-700 p-4">
      <h3 className="font-semibold mb-4">Spot Order</h3>
      
      <div className="mb-4">
        <Tabs defaultValue="Market" onValueChange={setOrderType}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="Market">Market</TabsTrigger>
            <TabsTrigger value="Limit">Limit</TabsTrigger>
            <TabsTrigger value="Stop">Stop</TabsTrigger>
            <TabsTrigger value="OCO">OCO</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="mb-4 grid grid-cols-2 gap-4">
        <Button 
          className={`py-4 ${orderSide === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-primary-700'}`}
          onClick={() => setOrderSide('buy')}
        >
          Buy {pair.baseAsset}
        </Button>
        <Button 
          className={`py-4 ${orderSide === 'sell' ? 'bg-red-600 hover:bg-red-700' : 'bg-primary-700'}`}
          onClick={() => setOrderSide('sell')}
        >
          Sell {pair.baseAsset}
        </Button>
      </div>
      
      <div className="space-y-4 mb-6">
        <div>
          <Label htmlFor="amount">Amount ({pair.baseAsset})</Label>
          <div className="relative">
            <Input 
              id="amount" 
              className="bg-primary-700 border-primary-600"
              value={amount} 
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              type="number"
              step={0.001}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-1">
              <button className="text-xs text-accent-500 hover:text-accent-300">25%</button>
              <button className="text-xs text-accent-500 hover:text-accent-300">50%</button>
              <button className="text-xs text-accent-500 hover:text-accent-300">75%</button>
              <button className="text-xs text-accent-500 hover:text-accent-300">100%</button>
            </div>
          </div>
          <div className="text-xs text-right mt-1 text-neutral-400">
            ≈ ${(amount * pair.price).toLocaleString()}
          </div>
        </div>
        
        {orderType !== 'Market' && (
          <div>
            <Label htmlFor="price">Price ({pair.quoteAsset})</Label>
            <Input 
              id="price" 
              className="bg-primary-700 border-primary-600"
              value={price} 
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              type="number"
              step={0.01}
            />
          </div>
        )}
        
        {orderType === 'Stop' && (
          <div>
            <Label htmlFor="stop-price">Stop Price ({pair.quoteAsset})</Label>
            <Input 
              id="stop-price" 
              className="bg-primary-700 border-primary-600"
              defaultValue={orderSide === 'buy' ? (pair.price * 1.05).toFixed(2) : (pair.price * 0.95).toFixed(2)}
              type="number"
              step={0.01}
            />
          </div>
        )}
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="reduceOnly" 
              checked={reduceOnly} 
              onCheckedChange={setReduceOnly} 
            />
            <Label htmlFor="reduceOnly" className="text-sm">Reduce Only</Label>
          </div>
          
          {orderType === 'Limit' && (
            <div className="flex items-center space-x-2">
              <Switch 
                id="postOnly" 
                checked={postOnly} 
                onCheckedChange={setPostOnly} 
              />
              <Label htmlFor="postOnly" className="text-sm">Post Only</Label>
            </div>
          )}
        </div>
      </div>
      
      <div className="pt-2 border-t border-primary-700">
        <Button 
          className={`w-full py-5 ${orderSide === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
          onClick={handlePlaceOrder}
        >
          {orderSide === 'buy' ? 'Buy' : 'Sell'} {pair.baseAsset}
        </Button>
      </div>
    </div>
  );
}

function OrderBook({ pair }: { pair: TradingPair }) {
  // Mock order book data
  const maxSize = 5;
  const asks = Array(10).fill(0).map((_, i) => ({
    price: pair.price + (pair.price * 0.0005 * (i + 1)),
    size: Math.random() * maxSize,
    total: 0
  })).map((ask, i, arr) => ({
    ...ask,
    total: arr.slice(0, i + 1).reduce((sum, item) => sum + item.size, 0)
  }));
  
  const bids = Array(10).fill(0).map((_, i) => ({
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
    <div className="bg-primary-800 rounded-lg border border-primary-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Order Book</h3>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-neutral-400">Spread:</span>
          <span className="text-xs text-accent-500 font-medium">${(asks[0].price - bids[0].price).toFixed(2)} ({((asks[0].price - bids[0].price) / pair.price * 100).toFixed(3)}%)</span>
        </div>
      </div>
      
      <div className="mb-2 grid grid-cols-4 text-xs text-neutral-400">
        <div>Price</div>
        <div className="text-right">Size</div>
        <div className="text-right">Total</div>
        <div></div> {/* For depth visualization */}
      </div>
      
      <div className="space-y-1 max-h-[180px] overflow-y-auto mb-2">
        {asks.map((ask, index) => (
          <div key={`ask-${index}`} className="grid grid-cols-4 text-xs items-center">
            <div className="text-red-500">${ask.price.toFixed(2)}</div>
            <div className="text-right">{ask.size.toFixed(3)}</div>
            <div className="text-right">{ask.total.toFixed(3)}</div>
            <div className="h-full pl-2">
              <div 
                className="h-[3px] bg-red-600/30" 
                style={{ width: `${(ask.total / maxTotal) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="py-2 text-center font-bold text-lg border-y border-primary-700 my-2">
        <span className={pair.change24h >= 0 ? 'text-green-500' : 'text-red-500'}>
          ${pair.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
      
      <div className="space-y-1 max-h-[180px] overflow-y-auto">
        {bids.map((bid, index) => (
          <div key={`bid-${index}`} className="grid grid-cols-4 text-xs items-center">
            <div className="text-green-500">${bid.price.toFixed(2)}</div>
            <div className="text-right">{bid.size.toFixed(3)}</div>
            <div className="text-right">{bid.total.toFixed(3)}</div>
            <div className="h-full pl-2">
              <div 
                className="h-[3px] bg-green-600/30" 
                style={{ width: `${(bid.total / maxTotal) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MarketInfo({ pair }: { pair: TradingPair }) {
  const [selectedTab, setSelectedTab] = useState<string>("overview");
  
  return (
    <div className="bg-primary-800 rounded-lg border border-primary-700 p-4">
      <Tabs defaultValue="overview" onValueChange={setSelectedTab}>
        <TabsList className="w-full mb-3">
          <TabsTrigger value="overview">Market</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="trades">Trades</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 mt-0">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-bold">${pair.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              <span className={`px-2 py-1 rounded text-xs ${pair.change24h >= 0 ? 'bg-green-900/40 text-green-500' : 'bg-red-900/40 text-red-500'}`}>
                {pair.change24h >= 0 ? '+' : ''}{pair.change24h}%
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-neutral-400">24h High</div>
              <div>${(pair.price * 1.02).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-neutral-400">24h Low</div>
              <div>${(pair.price * 0.98).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-neutral-400">24h Volume</div>
              <div>$38.2M</div>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-neutral-400">24h Volume ({pair.baseAsset})</div>
              <div>{(38200000 / pair.price).toFixed(2)}</div>
            </div>
          </div>
          
          <div className="pt-3 border-t border-primary-700">
            <h4 className="text-sm font-medium mb-2">Market Indices</h4>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-neutral-400">Open Interest</div>
                <div>$14.6M</div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-neutral-400">Index Price</div>
                <div>${(pair.price * 0.9995).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-neutral-400">Mark Price</div>
                <div>${(pair.price * 1.0002).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-neutral-400">Funding Rate</div>
                <div className="text-green-500">+0.0103%</div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="details" className="mt-0">
          <div className="space-y-3">
            <div className="text-xs">
              <h4 className="font-medium mb-2">About {pair.baseAsset}</h4>
              <p className="text-neutral-300 leading-relaxed">
                {pair.baseAsset === 'BTC' ? 
                  'Bitcoin is a decentralized digital currency created in 2009. It follows ideas set out in a whitepaper by the pseudonymous Satoshi Nakamoto.' :
                  `${pair.baseAsset} is a digital asset operating on a blockchain network, used for various applications in the cryptocurrency ecosystem.`
                }
              </p>
            </div>
            
            <div className="pt-3 border-t border-primary-700">
              <h4 className="text-sm font-medium mb-2">Asset Information</h4>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-neutral-400">Market Cap</div>
                  <div>{pair.baseAsset === 'BTC' ? '$1.18T' : pair.baseAsset === 'ETH' ? '$418B' : '$27.8B'}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-neutral-400">Circulating Supply</div>
                  <div>{pair.baseAsset === 'BTC' ? '19.37M' : pair.baseAsset === 'ETH' ? '120.27M' : '553.3M'}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-neutral-400">Max Supply</div>
                  <div>{pair.baseAsset === 'BTC' ? '21M' : 'Unlimited'}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-neutral-400">All-Time High</div>
                  <div>${pair.baseAsset === 'BTC' ? '69,000' : pair.baseAsset === 'ETH' ? '4,878' : '324'}</div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="trades" className="mt-0">
          <div className="max-h-[250px] overflow-y-auto">
            <div className="grid grid-cols-4 text-xs text-neutral-400 mb-2">
              <div>Price</div>
              <div className="text-right">Size</div>
              <div className="text-right">Value</div>
              <div className="text-right">Time</div>
            </div>
            
            {Array(12).fill(0).map((_, i) => {
              const isBuy = Math.random() > 0.5;
              const price = pair.price * (1 + (isBuy ? 1 : -1) * (Math.random() * 0.001));
              const size = (Math.random() * 0.5).toFixed(4);
              const value = (price * parseFloat(size)).toFixed(2);
              const minutes = Math.floor(Math.random() * 10);
              const seconds = Math.floor(Math.random() * 60);
              
              return (
                <div key={i} className="grid grid-cols-4 text-xs py-1 border-b border-primary-700/50">
                  <div className={isBuy ? 'text-green-500' : 'text-red-500'}>
                    ${price.toFixed(2)}
                  </div>
                  <div className="text-right">{size}</div>
                  <div className="text-right">${value}</div>
                  <div className="text-right text-neutral-400">{minutes}m {seconds}s ago</div>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function CryptoTrading() {
  const { pair: pairParam } = useParams();
  const [, navigate] = useLocation();
  const [marginMode, setMarginMode] = useState<'cross' | 'isolated'>('cross');
  const [leverage, setLeverage] = useState<number>(10);
  const [currentPair, setCurrentPair] = useState<TradingPair>(cryptoPairs[0]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [favorites, setFavorites] = useState<number[]>([1, 2]); // BTC, ETH
  
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
  
  const toggleFavorite = (pairId: number) => {
    if (favorites.includes(pairId)) {
      setFavorites(favorites.filter(id => id !== pairId));
    } else {
      setFavorites([...favorites, pairId]);
    }
  };
  
  const filteredPairs = searchInput 
    ? cryptoPairs.filter(p => 
        p.name.toLowerCase().includes(searchInput.toLowerCase()) || 
        p.baseAsset.toLowerCase().includes(searchInput.toLowerCase())
      )
    : cryptoPairs;

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
        <div className="hidden md:flex flex-col w-64 border-r border-primary-700 bg-primary-800">
          <div className="p-4 border-b border-primary-700">
            <h2 className="font-semibold mb-3">Crypto Market</h2>
            <div className="relative mb-3">
              <Input
                placeholder="Search markets..."
                className="pl-8 bg-primary-700 border-primary-600"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
            </div>
            
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" className="text-xs flex-1">
                All
              </Button>
              <Button size="sm" variant="outline" className="text-xs flex-1">
                Favorites
              </Button>
              <Button size="sm" variant="outline" className="text-xs flex-1">
                Trending
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="p-3 border-b border-primary-700 bg-primary-700/50">
              <div className="grid grid-cols-3 text-xs text-neutral-400">
                <div>Market</div>
                <div className="text-right">Price</div>
                <div className="text-right">24h</div>
              </div>
            </div>
            
            <div className="space-y-1 p-1">
              {filteredPairs.map(pair => (
                <div 
                  key={pair.id} 
                  className={`flex items-center justify-between p-2 rounded hover:bg-primary-700 cursor-pointer ${currentPair.id === pair.id ? 'bg-primary-700 border-l-2 border-accent-500 pl-1' : ''}`}
                  onClick={() => navigate(`/crypto-trading/${encodeURIComponent(pair.name)}`)}
                >
                  <div className="flex items-center">
                    <button
                      className="mr-2 text-neutral-400 hover:text-yellow-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(pair.id);
                      }}
                    >
                      <Star className="h-3 w-3" fill={favorites.includes(pair.id) ? "#EAB308" : "none"} />
                    </button>
                    <span className="text-sm">{pair.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm">${pair.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                    <div className={pair.change24h >= 0 ? 'text-green-500 text-xs' : 'text-red-500 text-xs'}>
                      {pair.change24h >= 0 ? '+' : ''}{pair.change24h}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="p-4 border-t border-primary-700">
            <MarketOverview />
          </div>
        </div>
        
        {/* Main Trading Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Top Trading Bar */}
          <div className="border-b border-primary-700 bg-primary-800 p-3 flex flex-wrap items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-lg font-semibold mr-3">{currentPair.name}</h1>
              <span className="font-mono">${currentPair.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              <span className={`ml-2 text-xs ${currentPair.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {currentPair.change24h >= 0 ? '+' : ''}{currentPair.change24h}%
              </span>
              <Button variant="ghost" size="sm" className="ml-2">
                <Star className="h-4 w-4" fill={favorites.includes(currentPair.id) ? "#EAB308" : "none"} />
              </Button>
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
          
          <div className="flex-1 overflow-auto">
            {/* Chart Area */}
            <TradingChart 
              candlesticks={candlesticks}
              isLoading={isLoading}
              chartType={chartType}
              timeFrame={timeFrame}
              onChangeChartType={changeChartType}
              onChangeTimeFrame={changeTimeFrame}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4">
              {/* Left column */}
              <div className="md:col-span-8 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CryptoOrderForm pair={currentPair} />
                  <OrderBook pair={currentPair} />
                </div>
              </div>
              
              {/* Right column */}
              <div className="md:col-span-4 space-y-4">
                <PositionSummary pair={currentPair} />
                <MarketInfo pair={currentPair} />
                <FundingInfo />
                <LiquidationCalculator pair={currentPair} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}