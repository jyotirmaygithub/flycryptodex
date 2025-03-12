import { useState } from "react";
import { useParams, Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, BarChart, Wallet, Settings } from "lucide-react";
import { TradingPair } from "@shared/schema";

// Placeholder components for trading UI
function PlaceholderChart() {
  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-primary-800 border border-primary-700 rounded-md m-4">
      <div className="text-center">
        <BarChart className="h-16 w-16 text-accent-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold mb-2">Trading Charts</h2>
        <p className="text-neutral-400 max-w-md">
          Advanced charting with multiple timeframes and indicators will be displayed here.
          Choose from candlesticks, line, or area charts.
        </p>
      </div>
    </div>
  );
}

function PlaceholderOrderForm() {
  return (
    <div className="p-4 bg-primary-800 border border-primary-700 rounded-md m-4">
      <h2 className="text-lg font-semibold mb-3">Place Order</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Button className="bg-success hover:bg-success/90 text-white">Buy / Long</Button>
        <Button className="bg-error hover:bg-error/90 text-white">Sell / Short</Button>
      </div>
      <div className="text-sm text-neutral-400 mt-2">
        Trade with up to 100x leverage on our secure platform
      </div>
    </div>
  );
}

function PlaceholderInfo() {
  return (
    <div className="p-4 bg-primary-800 border border-primary-700 rounded-md m-4">
      <h2 className="text-lg font-semibold mb-3">Market Information</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-neutral-400">24h Volume</span>
          <span className="font-mono">$45,678,901</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-400">Open Interest</span>
          <span className="font-mono">$12,345,678</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-400">Funding Rate</span>
          <span className="font-mono text-success">+0.01%</span>
        </div>
      </div>
    </div>
  );
}

export default function Trading() {
  const { pair } = useParams();
  const [marginMode, setMarginMode] = useState<'cross' | 'isolated'>('cross');
  const [leverage, setLeverage] = useState(50);
  
  // Static trading pairs for initial display
  const tradingPairs: TradingPair[] = [
    { id: 1, name: 'EUR/USD', baseAsset: 'EUR', quoteAsset: 'USD', price: 1.09, change24h: 0.02, categoryId: 1, isActive: true },
    { id: 2, name: 'BTC/USD', baseAsset: 'BTC', quoteAsset: 'USD', price: 62150, change24h: -1.2, categoryId: 2, isActive: true },
    { id: 3, name: 'ETH/USD', baseAsset: 'ETH', quoteAsset: 'USD', price: 3120, change24h: 0.8, categoryId: 2, isActive: true }
  ];
  
  // Default to the first pair if none selected
  const currentPair = pair 
    ? tradingPairs.find(p => p.name === decodeURIComponent(pair)) || tradingPairs[0]
    : tradingPairs[0];
  
  return (
    <div className="min-h-screen flex flex-col bg-primary-900 text-white">
      {/* Header */}
      <header className="border-b border-primary-700 bg-primary-800 py-3 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mr-2">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>
          <span className="text-accent-500 text-xl font-bold">Fly<span className="text-white">Crypto</span></span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Wallet className="h-4 w-4 mr-1" />
            Connect Wallet
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>
      
      {/* Trading Interface */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar / Asset List */}
        <div className="hidden md:block w-64 border-r border-primary-700 bg-primary-800 p-4">
          <h2 className="font-semibold mb-3">Trading Pairs</h2>
          <div className="space-y-2">
            {tradingPairs.map(pair => (
              <div key={pair.id} 
                className={`flex items-center justify-between p-2 rounded hover:bg-primary-700 cursor-pointer ${currentPair.id === pair.id ? 'bg-primary-700 border-l-2 border-accent-500 pl-1' : ''}`}
                onClick={() => window.location.href = `/trading/${encodeURIComponent(pair.name)}`}
              >
                <span>{pair.name}</span>
                <div className="text-right">
                  <div className="font-mono">{pair.price}</div>
                  <div className={pair.change24h >= 0 ? 'text-success text-xs' : 'text-error text-xs'}>
                    {pair.change24h >= 0 ? '+' : ''}{pair.change24h}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Main Trading Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Top Trading Bar */}
          <div className="border-b border-primary-700 bg-primary-800 p-3 flex items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-lg font-semibold mr-3">{currentPair.name}</h1>
              <span className="font-mono">${currentPair.price}</span>
              <span className={`ml-2 text-xs ${currentPair.change24h >= 0 ? 'text-success' : 'text-error'}`}>
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
          
          <div className="flex flex-1 overflow-auto">
            {/* Chart Area */}
            <div className="flex-1 flex flex-col">
              <PlaceholderChart />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PlaceholderOrderForm />
                <PlaceholderInfo />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
