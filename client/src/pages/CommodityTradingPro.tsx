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
  DollarSign,
  Package,
  Calendar,
  Truck
} from "lucide-react";

// Mock trading pairs for commodities
const commodityPairs = [
  { id: 1, name: 'GOLD/USD', baseAsset: 'GOLD', quoteAsset: 'USD', price: 2345.67, change24h: 0.75, categoryId: 3, isActive: true },
  { id: 2, name: 'SILVER/USD', baseAsset: 'SILVER', quoteAsset: 'USD', price: 27.82, change24h: 1.20, categoryId: 3, isActive: true },
  { id: 3, name: 'OIL/USD', baseAsset: 'OIL', quoteAsset: 'USD', price: 78.45, change24h: -1.50, categoryId: 3, isActive: true },
  { id: 4, name: 'NATGAS/USD', baseAsset: 'NATGAS', quoteAsset: 'USD', price: 2.32, change24h: -0.85, categoryId: 3, isActive: true },
  { id: 5, name: 'COPPER/USD', baseAsset: 'COPPER', quoteAsset: 'USD', price: 4.12, change24h: 0.35, categoryId: 3, isActive: true },
  { id: 6, name: 'WHEAT/USD', baseAsset: 'WHEAT', quoteAsset: 'USD', price: 625.80, change24h: 0.22, categoryId: 3, isActive: true },
];

function ContractSpecifications({ pair }: { pair: TradingPair }) {
  return (
    <div className="rounded-lg border border-primary-700 bg-primary-800">
      <div className="border-b border-primary-700 px-4 py-3 flex items-center justify-between">
        <h3 className="font-medium text-sm flex items-center">
          <Package className="w-4 h-4 mr-2 text-neutral-400" />
          Contract Specifications
        </h3>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <Info className="h-4 w-4 text-neutral-400" />
        </Button>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div className="text-xs text-neutral-400">Trading Unit</div>
          <div className="text-xs">
            {pair.name.includes('GOLD') ? '100 troy ounces' : 
            pair.name.includes('SILVER') ? '5,000 troy ounces' :
            pair.name.includes('OIL') ? '1,000 barrels' :
            pair.name.includes('NATGAS') ? '10,000 mmBtu' :
            pair.name.includes('COPPER') ? '25,000 pounds' : '5,000 bushels'}
          </div>
          
          <div className="text-xs text-neutral-400">Min Price Fluctuation</div>
          <div className="text-xs">
            {pair.name.includes('GOLD') ? '$0.10 per troy ounce' : 
            pair.name.includes('SILVER') ? '$0.005 per troy ounce' :
            pair.name.includes('OIL') ? '$0.01 per barrel' :
            pair.name.includes('NATGAS') ? '$0.001 per mmBtu' :
            pair.name.includes('COPPER') ? '$0.0005 per pound' : '$0.25 per bushel'}
          </div>
          
          <div className="text-xs text-neutral-400">Point Value</div>
          <div className="text-xs">
            {pair.name.includes('GOLD') ? '$10.00' : 
            pair.name.includes('SILVER') ? '$25.00' :
            pair.name.includes('OIL') ? '$10.00' :
            pair.name.includes('NATGAS') ? '$10.00' :
            pair.name.includes('COPPER') ? '$12.50' : '$12.50'}
          </div>
          
          <div className="text-xs text-neutral-400">Settlement Method</div>
          <div className="text-xs">Physical Delivery</div>
        </div>
      </div>
    </div>
  );
}

function DeliverySchedule({ pair }: { pair: TradingPair }) {
  return (
    <div className="rounded-lg border border-primary-700 bg-primary-800">
      <div className="border-b border-primary-700 px-4 py-3 flex items-center justify-between">
        <h3 className="font-medium text-sm flex items-center">
          <Calendar className="w-4 h-4 mr-2 text-neutral-400" />
          Delivery Schedule
        </h3>
      </div>
      
      <div className="p-4">
        <div className="mb-3">
          <h4 className="text-xs text-accent-500 mb-2">Active Contract Month:</h4>
          <div className="bg-primary-700 rounded-md p-2 text-sm">
            June 2025
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-neutral-400">First Notice Day:</div>
            <div>May 31, 2025</div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-neutral-400">Last Trading Day:</div>
            <div>June 27, 2025</div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-neutral-400">Delivery Period:</div>
            <div>June 1-30, 2025</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CommodityOrderForm({ pair }: { pair: TradingPair }) {
  const [orderType, setOrderType] = useState<string>('market');
  const [orderSide, setOrderSide] = useState<string>('buy');
  const [amount, setAmount] = useState<string>('');
  const [price, setPrice] = useState<string>(pair.price.toString());
  const [marginMode, setMarginMode] = useState<'cross' | 'isolated'>('cross');
  const [leverage, setLeverage] = useState<number>(10);
  const [showLiquidationPrice, setShowLiquidationPrice] = useState<boolean>(false);
  
  useEffect(() => {
    setPrice(pair.price.toString());
  }, [pair.price]);

  const handleLeverageChange = (newLeverage: number) => {
    if (newLeverage >= 1 && newLeverage <= 100) {
      setLeverage(newLeverage);
    }
  };

  const handlePlaceOrder = () => {
    // Mock order placement
    console.log("Placing CFD order:", {
      pair: pair.name,
      type: orderType,
      side: orderSide,
      amount: parseFloat(amount),
      price: orderType === 'market' ? pair.price : parseFloat(price),
      leverage: leverage,
      marginMode: marginMode
    });

    // Reset form
    setAmount('');
    setPrice(pair.price.toString());
  };
  
  // Calculate liquidation price (simplified formula)
  const calculateLiquidationPrice = (): string => {
    if (!amount || isNaN(parseFloat(amount))) return "N/A";
    
    const entryPrice = orderType === 'market' ? pair.price : (parseFloat(price) || pair.price);
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
    <div className="rounded-lg border border-primary-700 bg-primary-800">
      <div className="border-b border-primary-700 px-4 py-3">
        <h3 className="font-medium text-sm">Place CFD Order</h3>
      </div>
      
      <div className="p-4">
        <div className="mb-4">
          <Tabs defaultValue="market" onValueChange={(value) => setOrderType(value)}>
            <TabsList className="grid w-full grid-cols-2 h-8">
              <TabsTrigger value="market" className="text-xs">Market</TabsTrigger>
              <TabsTrigger value="limit" className="text-xs">Limit</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="mb-4 grid grid-cols-2 gap-2">
          <Button 
            className={`py-3 text-sm ${orderSide === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-primary-700'}`}
            onClick={() => setOrderSide('buy')}
          >
            Buy / Long
          </Button>
          <Button 
            className={`py-3 text-sm ${orderSide === 'sell' ? 'bg-red-600 hover:bg-red-700' : 'bg-primary-700'}`}
            onClick={() => setOrderSide('sell')}
          >
            Sell / Short
          </Button>
        </div>
        
        <div className="space-y-3 mb-4">
          <div>
            <Label htmlFor="amount" className="text-xs text-neutral-400">Amount</Label>
            <div className="relative mt-1">
              <Input 
                id="amount" 
                className="bg-primary-700 border-primary-600 h-8 pr-12"
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                min={0}
                step={0.01}
                placeholder="0.00"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-400 text-xs">
                Units
              </div>
            </div>
          </div>
            
          {orderType === 'limit' && (
            <div>
              <Label htmlFor="price" className="text-xs text-neutral-400">Limit Price</Label>
              <div className="relative mt-1">
                <Input 
                  id="price" 
                  className="bg-primary-700 border-primary-600 h-8 pr-12"
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)}
                  type="number"
                  min={0}
                  step={0.01}
                  placeholder={pair.price.toString()}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-neutral-400 text-xs">
                  USD
                </div>
              </div>
            </div>
          )}
          
          <div>
            <Label htmlFor="leverage" className="text-xs text-neutral-400">Leverage: {leverage}x</Label>
            <div className="flex items-center mt-1">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleLeverageChange(leverage - 1)}
                disabled={leverage <= 1}
                className="h-7 w-7 p-0"
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
                className="mx-2 bg-primary-700 h-2"
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => handleLeverageChange(leverage + 1)}
                disabled={leverage >= 100}
                className="h-7 w-7 p-0"
              >
                +
              </Button>
            </div>
          </div>
        </div>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-neutral-400">Margin Mode</div>
            <div className="flex items-center space-x-2">
              <span className={`text-xs ${marginMode === 'cross' ? 'text-accent-500' : 'text-neutral-400'}`}>Cross</span>
              <Switch 
                checked={marginMode === 'isolated'} 
                onCheckedChange={checked => setMarginMode(checked ? 'isolated' : 'cross')}
                className="data-[state=checked]:bg-accent-500"
              />
              <span className={`text-xs ${marginMode === 'isolated' ? 'text-accent-500' : 'text-neutral-400'}`}>Isolated</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-xs text-neutral-400">Liquidation Price</div>
            <div className="flex items-center space-x-2">
              <span className="text-xs">
                {showLiquidationPrice ? `$${calculateLiquidationPrice()}` : 'Hidden'}
              </span>
              <Switch 
                checked={showLiquidationPrice} 
                onCheckedChange={setShowLiquidationPrice}
                className="data-[state=checked]:bg-accent-500"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-neutral-400">Estimated Value</div>
            <div className="text-right">
              ${!amount || isNaN(parseFloat(amount)) 
                ? '0.00' 
                : (parseFloat(amount) * (orderType === 'market' ? pair.price : (parseFloat(price) || pair.price))).toFixed(2)}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-neutral-400">Max Position</div>
            <div className="text-right">
              ${!amount || isNaN(parseFloat(amount)) 
                ? '0.00' 
                : (parseFloat(amount) * (orderType === 'market' ? pair.price : (parseFloat(price) || pair.price)) * leverage).toFixed(2)}
            </div>
          </div>
        </div>
        
        <div className="pt-2 border-t border-primary-700">
          <Button 
            className={`w-full py-4 text-sm ${orderSide === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
            onClick={handlePlaceOrder}
            disabled={!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0}
          >
            {orderSide === 'buy' ? 'Buy / Long' : 'Sell / Short'} {pair.name}
            {orderType === 'market' 
              ? ' at Market' 
              : ` at $${parseFloat(price).toFixed(2)}`}
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
          Spread: <span className="text-accent-500 font-medium">${((asks[0].price - bids[0].price)).toFixed(2)}</span>
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
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-700">
          <div className="space-y-[2px]">
            {asks.map((ask, index) => (
              <div key={`ask-${index}`} className="grid grid-cols-3 text-xs px-2 py-1 hover:bg-primary-700">
                <div className="text-red-500">${ask.price.toFixed(2)}</div>
                <div className="text-right">{ask.size.toFixed(1)}</div>
                <div className="text-right">{ask.total.toFixed(1)}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Current price */}
        <div className="py-2 px-2 text-center font-bold text-sm bg-primary-700/50 border-y border-primary-700">
          <span className={pair.change24h >= 0 ? 'text-green-500' : 'text-red-500'}>
            ${pair.price.toFixed(2)}
          </span>
        </div>
        
        {/* Bids (Buys) */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-700">
          <div className="space-y-[2px]">
            {bids.map((bid, index) => (
              <div key={`bid-${index}`} className="grid grid-cols-3 text-xs px-2 py-1 hover:bg-primary-700">
                <div className="text-green-500">${bid.price.toFixed(2)}</div>
                <div className="text-right">{bid.size.toFixed(1)}</div>
                <div className="text-right">{bid.total.toFixed(1)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MarketStatsPanel({ pair }: { pair: TradingPair }) {
  return (
    <div className="rounded-lg border border-primary-700 bg-primary-800">
      <div className="border-b border-primary-700 px-4 py-3">
        <h3 className="font-medium text-sm">Market Statistics</h3>
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
          <div className="text-xs">${(Math.random() * 100000 + 20000).toFixed(0)}</div>
          
          <div className="text-xs text-neutral-400">Open Interest</div>
          <div className="text-xs">{Math.floor(Math.random() * 10000 + 5000)} contracts</div>
          
          <div className="text-xs text-neutral-400">Basis</div>
          <div className="text-xs">+$0.35</div>
        </div>
      </div>
    </div>
  );
}

function OpenPositions() {
  // Mock positions
  const positions = [
    {
      id: 1,
      pair: 'GOLD/USD',
      side: 'buy',
      contracts: 2,
      entryPrice: 2340.50,
      currentPrice: 2345.67,
      pnl: 517.00,
      pnlPercent: 0.22
    }
  ];

  return (
    <div className="rounded-lg border border-primary-700 bg-primary-800">
      <div className="border-b border-primary-700 px-4 py-3 flex items-center justify-between">
        <h3 className="font-medium text-sm">Open Positions</h3>
        <div className="text-sm">
          Total PnL: <span className="text-green-500">$517.00</span>
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
                <th className="p-2 text-left">Contract</th>
                <th className="p-2 text-left">Side</th>
                <th className="p-2 text-right">Qty</th>
                <th className="p-2 text-right">Entry</th>
                <th className="p-2 text-right">Current</th>
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
                  <td className="p-2 text-right">{pos.contracts}</td>
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

function RecentTrades() {
  // Mock recent trades
  const trades = Array(12).fill(0).map((_, i) => ({
    id: i,
    price: 2345.67 + (Math.random() - 0.5) * 5,
    size: Math.floor(Math.random() * 5) + 1,
    time: Date.now() - i * 60000,
    side: Math.random() > 0.5 ? 'buy' : 'sell'
  }));

  return (
    <div className="rounded-lg border border-primary-700 bg-primary-800 h-full">
      <div className="border-b border-primary-700 px-4 py-3">
        <h3 className="font-medium text-sm">Recent Trades</h3>
      </div>
      
      <div className="grid grid-cols-3 text-xs text-neutral-400 p-2 border-b border-primary-700">
        <div>Price</div>
        <div className="text-right">Contracts</div>
        <div className="text-right">Time</div>
      </div>
      
      <div className="max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary-700">
        {trades.map(trade => (
          <div key={trade.id} className="grid grid-cols-3 text-xs p-2 hover:bg-primary-700">
            <div className={trade.side === 'buy' ? 'text-green-500' : 'text-red-500'}>
              ${trade.price.toFixed(2)}
            </div>
            <div className="text-right">
              {trade.size}
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

export default function CommodityTradingPro() {
  const { pair: pairParam } = useParams();
  const [, navigate] = useLocation();
  const [currentPair, setCurrentPair] = useState<TradingPair>(commodityPairs[0]);
  const [candleData, setCandleData] = useState<CandlestickData[]>([]);
  const [timeFrame, setTimeFrame] = useState<string>('1h');
  const [chartType, setChartType] = useState<'candlestick' | 'line' | 'area'>('candlestick');
  
  // Generate mock candle data
  useEffect(() => {
    // Generate candle data when the pair or timeFrame changes
    const data = generateMockCandlestickData(timeFrame, 100);
    // Adjust for commodity price range
    const adjustedData = data.map(candle => ({
      ...candle,
      open: candle.open * currentPair.price,
      high: candle.high * currentPair.price,
      low: candle.low * currentPair.price,
      close: candle.close * currentPair.price
    }));
    setCandleData(adjustedData);
  }, [currentPair.id, timeFrame]);
  
  useEffect(() => {
    // Set the current pair based on URL param or default to first pair
    if (pairParam) {
      const foundPair = commodityPairs.find(p => p.name === decodeURIComponent(pairParam));
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
          
          <Button 
            onClick={() => navigate(`/commodity-trading/${encodeURIComponent(currentPair.name)}`)} 
            variant="outline"
            className="text-accent-500 border-accent-500"
            size="sm"
          >
            <BarChart className="h-4 w-4 mr-2" />
            Basic Mode
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
      
      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="hidden lg:block w-56 border-r border-primary-700 bg-primary-800">
          <div className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-sm">Commodity Futures</h2>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-[2px]">
              {commodityPairs.map(pair => (
                <div key={pair.id} 
                  className={`flex items-center justify-between p-2 rounded hover:bg-primary-700 cursor-pointer ${currentPair.id === pair.id ? 'bg-primary-700 border-l-2 border-accent-500 pl-1' : ''}`}
                  onClick={() => navigate(`/commodity-trading-pro/${encodeURIComponent(pair.name)}`)}
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
                <h1 className="text-xl font-bold mr-2">{currentPair.name} Futures</h1>
                <div className={`text-sm px-2 py-0.5 rounded ${currentPair.change24h >= 0 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                  {currentPair.change24h >= 0 ? '+' : ''}{currentPair.change24h}%
                </div>
                <div className="ml-2 text-lg font-mono">
                  ${currentPair.price.toFixed(2)}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center space-x-1">
                  <Truck className="h-4 w-4 text-neutral-400" />
                  <span className="text-xs text-neutral-400">Delivery Date:</span>
                  <span className="text-xs font-medium">June 27, 2025</span>
                </div>
              </div>
            </div>
            
            {/* Main grid layout */}
            <div className="grid grid-cols-12 gap-4">
              {/* Chart area - spans 9 columns on large screens */}
              <div className="col-span-12 lg:col-span-9">
                <div className="border border-primary-700 bg-primary-800 rounded-lg mb-4">
                  <div className="p-4 border-b border-primary-700 flex justify-between items-center">
                    <h3 className="font-medium text-sm">Price Chart</h3>
                    <div className="flex space-x-2">
                      <div className="flex border border-primary-700 rounded overflow-hidden">
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
                  <TradingViewChart candleData={candleData} pair={currentPair.name} height={500} />
                </div>
                
                <div className="mt-4">
                  <OpenPositions />
                </div>
              </div>
              
              {/* Right sidebar - spans 3 columns on large screens */}
              <div className="col-span-12 lg:col-span-3 space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <CommodityOrderForm pair={currentPair} />
                  <OrderBook pair={currentPair} />
                </div>
              </div>
            </div>
            
            {/* Bottom row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <MarketStatsPanel pair={currentPair} />
              <ContractSpecifications pair={currentPair} />
              <RecentTrades />
            </div>
            
            {/* Additional row */}
            <div className="mt-4">
              <DeliverySchedule pair={currentPair} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}