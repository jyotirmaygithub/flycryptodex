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
  BarChart4,
  Clock,
  Calendar,
  Info,
  AlertCircle
} from "lucide-react";

// Mock trading pairs for commodities
const commodityPairs = [
  { id: 1, name: 'GOLD/USD', baseAsset: 'XAU', quoteAsset: 'USD', price: 2384.56, change24h: 0.42, categoryId: 3, isActive: true },
  { id: 2, name: 'SILVER/USD', baseAsset: 'XAG', quoteAsset: 'USD', price: 28.12, change24h: 0.81, categoryId: 3, isActive: true },
  { id: 3, name: 'OIL/USD', baseAsset: 'OIL', quoteAsset: 'USD', price: 78.35, change24h: -1.23, categoryId: 3, isActive: true },
  { id: 4, name: 'NAT_GAS/USD', baseAsset: 'NG', quoteAsset: 'USD', price: 2.15, change24h: 1.54, categoryId: 3, isActive: true },
  { id: 5, name: 'COPPER/USD', baseAsset: 'COPPER', quoteAsset: 'USD', price: 4.28, change24h: 0.22, categoryId: 3, isActive: true },
  { id: 6, name: 'WHEAT/USD', baseAsset: 'WHEAT', quoteAsset: 'USD', price: 612.75, change24h: -0.75, categoryId: 3, isActive: true },
];

// Mock chart component
function PlaceholderChart() {
  return (
    <div className="w-full h-96 bg-primary-800 rounded-lg border border-primary-700 flex items-center justify-center mb-4">
      <TrendingUp className="w-16 h-16 text-accent-500 opacity-20" />
    </div>
  );
}

function ContractSpecifications({ pair }: { pair: TradingPair }) {
  // Mock contract specifications based on commodity type
  const specs = {
    'GOLD/USD': {
      contractSize: '100 troy oz',
      minTick: '$0.10',
      value: '$10 per $0.10',
      margin: '5%',
      tradingHours: '23/5',
      delivery: 'Cash settled',
      expiry: 'Last trading day of month'
    },
    'SILVER/USD': {
      contractSize: '5000 troy oz',
      minTick: '$0.005',
      value: '$25 per $0.005',
      margin: '5%',
      tradingHours: '23/5',
      delivery: 'Cash settled',
      expiry: 'Last trading day of month'
    },
    'OIL/USD': {
      contractSize: '1000 barrels',
      minTick: '$0.01',
      value: '$10 per $0.01',
      margin: '8%',
      tradingHours: '23/5',
      delivery: 'Cash settled',
      expiry: '20th calendar day of month'
    },
    'NAT_GAS/USD': {
      contractSize: '10,000 MMBtu',
      minTick: '$0.001',
      value: '$10 per $0.001',
      margin: '10%',
      tradingHours: '23/5',
      delivery: 'Cash settled',
      expiry: '3rd business day prior to month'
    },
    'COPPER/USD': {
      contractSize: '25,000 lbs',
      minTick: '$0.005',
      value: '$125 per $0.005',
      margin: '6%',
      tradingHours: '23/5',
      delivery: 'Cash settled',
      expiry: 'Last trading day of month'
    },
    'WHEAT/USD': {
      contractSize: '5,000 bushels',
      minTick: '$0.25',
      value: '$12.50 per $0.25',
      margin: '7%',
      tradingHours: '23/5',
      delivery: 'Cash settled',
      expiry: '15th calendar day of month'
    }
  };
  
  const currentSpecs = specs[pair.name as keyof typeof specs] || {
    contractSize: 'Varies',
    minTick: 'Varies',
    value: 'Varies',
    margin: 'Varies',
    tradingHours: '23/5',
    delivery: 'Cash settled',
    expiry: 'Varies'
  };

  return (
    <div className="bg-primary-800 p-4 rounded-lg border border-primary-700">
      <h3 className="font-medium mb-3">Contract Specifications</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-400">Contract Size:</span>
          <span>{currentSpecs.contractSize}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-400">Min. Price Tick:</span>
          <span>{currentSpecs.minTick}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-400">Tick Value:</span>
          <span>{currentSpecs.value}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-400">Initial Margin:</span>
          <span>{currentSpecs.margin}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-400">Trading Hours:</span>
          <span>{currentSpecs.tradingHours}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-400">Settlement:</span>
          <span>{currentSpecs.delivery}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-400">Expiry:</span>
          <span>{currentSpecs.expiry}</span>
        </div>
      </div>
    </div>
  );
}

function DeliverySchedule({ pair }: { pair: TradingPair }) {
  // Mock future contract months
  const futureMonths = [
    { month: "May 2025", status: "active", price: pair.price * 0.995 },
    { month: "June 2025", status: "active", price: pair.price * 1.01 },
    { month: "July 2025", status: "active", price: pair.price * 1.02 },
    { month: "August 2025", status: "active", price: pair.price * 1.025 },
    { month: "September 2025", status: "active", price: pair.price * 1.03 }
  ];

  return (
    <div className="bg-primary-800 p-4 rounded-lg border border-primary-700">
      <h3 className="font-medium mb-3">Future Contracts</h3>
      <div className="space-y-1">
        {futureMonths.map((contract, index) => (
          <div key={`contract-${index}`} className="flex justify-between items-center p-2 rounded-lg hover:bg-primary-700 cursor-pointer">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-accent-500 mr-2" />
              <span>{contract.month}</span>
            </div>
            <div className="text-right">
              <div>${contract.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <div className="text-xs text-neutral-400">
                {index === 0 ? "Current" : `+${((contract.price / pair.price - 1) * 100).toFixed(2)}%`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CommodityOrderForm({ pair }: { pair: TradingPair }) {
  const [orderType, setOrderType] = useState<string>('Market');
  const [orderSide, setOrderSide] = useState<string>('buy');
  const [amount, setAmount] = useState<number>(1);
  const [price, setPrice] = useState<number>(pair.price);
  const [expiryMonth, setExpiryMonth] = useState<string>("May 2025");
  const [goodUntilCanceled, setGoodUntilCanceled] = useState<boolean>(true);
  
  const handlePlaceOrder = () => {
    console.log('Placing order:', {
      pair: pair.name,
      type: orderType,
      side: orderSide,
      amount,
      price: orderType !== 'Market' ? price : undefined,
      expiryMonth,
      goodUntilCanceled
    });
    
    // Here you would call the API to place the order
    alert(`Order placed: ${orderSide.toUpperCase()} ${amount} ${pair.name} ${expiryMonth} at ${orderType === 'Market' ? 'market price' : '$' + price}`);
  };

  return (
    <div className="bg-primary-800 rounded-lg border border-primary-700 p-4">
      <h3 className="font-semibold mb-4">Place Order</h3>
      
      <div className="mb-4">
        <Tabs defaultValue="Market" onValueChange={setOrderType}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="Market">Market</TabsTrigger>
            <TabsTrigger value="Limit">Limit</TabsTrigger>
            <TabsTrigger value="Stop">Stop</TabsTrigger>
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
          <Label htmlFor="amount">Contracts</Label>
          <Input 
            id="amount" 
            className="bg-primary-700 border-primary-600"
            value={amount} 
            onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
            type="number"
            min={1}
            step={1}
          />
          <div className="text-xs text-right mt-1 text-neutral-400">
            Notional: ${(amount * pair.price).toLocaleString()}
          </div>
        </div>
        
        {orderType !== 'Market' && (
          <div>
            <Label htmlFor="price">Price</Label>
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
        
        <div>
          <Label htmlFor="expiry" className="mb-2 block">Contract Month</Label>
          <select 
            id="expiry"
            className="w-full bg-primary-700 border-primary-600 rounded p-2"
            value={expiryMonth}
            onChange={(e) => setExpiryMonth(e.target.value)}
          >
            <option value="May 2025">May 2025</option>
            <option value="June 2025">June 2025</option>
            <option value="July 2025">July 2025</option>
            <option value="August 2025">August 2025</option>
            <option value="September 2025">September 2025</option>
          </select>
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="goodUntilCanceled" 
            checked={goodUntilCanceled} 
            onCheckedChange={setGoodUntilCanceled} 
          />
          <Label htmlFor="goodUntilCanceled" className="text-sm">Good Until Canceled (GTC)</Label>
        </div>
      </div>
      
      <div className="pt-2 border-t border-primary-700">
        <Button 
          className={`w-full py-6 ${orderSide === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
          onClick={handlePlaceOrder}
        >
          {orderSide === 'buy' ? 'Buy / Long' : 'Sell / Short'} {pair.name} {expiryMonth}
        </Button>
      </div>
    </div>
  );
}

function MarketStatsPanel({ pair }: { pair: TradingPair }) {
  // Mock market data
  const data = {
    'GOLD/USD': {
      inventory: '8.2M oz',
      totalValue: '$19.6B',
      volatility: 'Medium',
      majorProducers: 'China, Australia, Russia',
      majorConsumers: 'Jewelry, Tech, Investment'
    },
    'SILVER/USD': {
      inventory: '54.3M oz',
      totalValue: '$1.5B',
      volatility: 'High',
      majorProducers: 'Mexico, Peru, China',
      majorConsumers: 'Industrial, Tech, Investment'
    },
    'OIL/USD': {
      inventory: '427.1M barrels',
      totalValue: '$33.5B',
      volatility: 'High',
      majorProducers: 'USA, Saudi Arabia, Russia',
      majorConsumers: 'Transportation, Industry, Power'
    },
    'NAT_GAS/USD': {
      inventory: '2.9T cubic feet',
      totalValue: '$6.2B',
      volatility: 'Very High',
      majorProducers: 'USA, Russia, Iran',
      majorConsumers: 'Power, Heating, Industry'
    },
    'COPPER/USD': {
      inventory: '214.3K tonnes',
      totalValue: '$917.2M',
      volatility: 'Medium',
      majorProducers: 'Chile, Peru, China',
      majorConsumers: 'Construction, Electrical, Transport'
    },
    'WHEAT/USD': {
      inventory: '324.2M bushels',
      totalValue: '$1.98B',
      volatility: 'Medium-High',
      majorProducers: 'China, India, Russia',
      majorConsumers: 'Food, Animal Feed, Biofuel'
    }
  };
  
  const currentStats = data[pair.name as keyof typeof data] || {
    inventory: 'Unknown',
    totalValue: 'Unknown',
    volatility: 'Unknown',
    majorProducers: 'Unknown',
    majorConsumers: 'Unknown'
  };

  return (
    <div className="bg-primary-800 rounded-lg border border-primary-700 p-4">
      <h3 className="font-semibold mb-4">Market Overview</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-neutral-400">Inventory Levels</div>
          <div>{currentStats.inventory}</div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-neutral-400">Total Market Value</div>
          <div>{currentStats.totalValue}</div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-neutral-400">Price Volatility</div>
          <div>{currentStats.volatility}</div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-neutral-400">Major Producers</div>
          <div>{currentStats.majorProducers}</div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-neutral-400">Major Consumers</div>
          <div>{currentStats.majorConsumers}</div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-neutral-400">24h High</div>
          <div>${(pair.price * 1.01).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-neutral-400">24h Low</div>
          <div>${(pair.price * 0.99).toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
        </div>
      </div>
    </div>
  );
}

export default function CommodityTrading() {
  const { pair: pairParam } = useParams();
  const [, navigate] = useLocation();
  const [marginMode, setMarginMode] = useState<'cross' | 'isolated'>('cross');
  const [leverage, setLeverage] = useState<number>(10);
  const [currentPair, setCurrentPair] = useState<TradingPair>(commodityPairs[0]);
  
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
          <h2 className="font-semibold mb-3">Commodity Futures</h2>
          <div className="space-y-2">
            {commodityPairs.map(pair => (
              <div key={pair.id} 
                className={`flex items-center justify-between p-2 rounded hover:bg-primary-700 cursor-pointer ${currentPair.id === pair.id ? 'bg-primary-700 border-l-2 border-accent-500 pl-1' : ''}`}
                onClick={() => window.location.href = `/commodity-trading/${encodeURIComponent(pair.name)}`}
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
            <h3 className="font-semibold mb-2">Commodity Features</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Info className="h-4 w-4 text-blue-500 mr-2" />
                Multiple Future Contracts
              </li>
              <li className="flex items-center">
                <Info className="h-4 w-4 text-blue-500 mr-2" />
                Contract Specifications
              </li>
              <li className="flex items-center">
                <Info className="h-4 w-4 text-blue-500 mr-2" />
                Physical Delivery Options
              </li>
              <li className="flex items-center">
                <Info className="h-4 w-4 text-blue-500 mr-2" />
                Roll-over Support
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
                  <option value="2">2x</option>
                  <option value="5">5x</option>
                  <option value="10">10x</option>
                  <option value="20">20x</option>
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
                    <CommodityOrderForm pair={currentPair} />
                    <MarketStatsPanel pair={currentPair} />
                  </div>
                </div>
                
                {/* Right column */}
                <div className="md:col-span-4 space-y-4">
                  <DeliverySchedule pair={currentPair} />
                  <ContractSpecifications pair={currentPair} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}