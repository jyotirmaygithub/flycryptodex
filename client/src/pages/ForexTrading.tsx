import { useState, useEffect, useMemo } from "react";
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
import { generateMockCandlestickData } from "@/lib/mockData";
import ForexNews from "@/components/trading/ForexNews";
import AiStrategyBox from "@/components/trading/AiStrategyBox";
import {
  Home,
  TrendingUp,
  TrendingDown,
  ChevronsUpDown,
  Sliders,
  Clock,
  AlertCircle
} from "lucide-react";

const forexPairs = [
  { id: 1, name: 'EUR/USD', baseAsset: 'EUR', quoteAsset: 'USD', price: 1.0921, change24h: 0.15, categoryId: 1, isActive: true },
  { id: 2, name: 'GBP/USD', baseAsset: 'GBP', quoteAsset: 'USD', price: 1.2639, change24h: -0.21, categoryId: 1, isActive: true },
  { id: 3, name: 'USD/JPY', baseAsset: 'USD', quoteAsset: 'JPY', price: 157.89, change24h: 0.32, categoryId: 1, isActive: true },
  { id: 4, name: 'AUD/USD', baseAsset: 'AUD', quoteAsset: 'USD', price: 0.6573, change24h: -0.11, categoryId: 1, isActive: true },
  { id: 5, name: 'USD/CHF', baseAsset: 'USD', quoteAsset: 'CHF', price: 0.9042, change24h: 0.22, categoryId: 1, isActive: true },
  { id: 6, name: 'EUR/GBP', baseAsset: 'EUR', quoteAsset: 'GBP', price: 0.8642, change24h: 0.09, categoryId: 1, isActive: true },
];

export default function ForexTrading() {
  const { pair: pairParam } = useParams();
  const [, navigate] = useLocation();
  const [currentPair, setCurrentPair] = useState<TradingPair>(forexPairs[0]);
  const [timeFrame, setTimeFrame] = useState<string>('1h');

  const candleData = useMemo(() => {
    try {
      return generateMockCandlestickData(timeFrame, 100);
    } catch (error) {
      console.error("Error generating chart data:", error);
      return [];
    }
  }, [timeFrame, currentPair.name]);

  useEffect(() => {
    const blockchainName = localStorage.getItem('selectedBlockchainName');
    if (!blockchainName) {
      navigate("/select-blockchain");
    }

    if (pairParam) {
      const foundPair = forexPairs.find(p => p.name === decodeURIComponent(pairParam));
      if (foundPair) {
        setCurrentPair(foundPair);
      }
    }
  }, [pairParam, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-900 to-primary-950 text-white">
      <header className="border-b border-primary-700/50 bg-primary-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <span className="text-2xl font-bold bg-gradient-to-r from-accent-400 to-accent-600 text-transparent bg-clip-text">
              FlyCrypto Forex
            </span>
            <nav className="hidden md:flex space-x-4">
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white">
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white">
                <Clock className="w-4 h-4 mr-2" />
                History
              </Button>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={() => navigate("/")}>
              Exit Trading
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left sidebar */}
          <div className="col-span-12 md:col-span-3 lg:col-span-2">
            <Card className="bg-primary-800/50 border-primary-700/50">
              <CardContent className="p-4">
                <h2 className="font-semibold mb-4 text-white/90">Market Watch</h2>
                <div className="space-y-2">
                  {forexPairs.map(pair => (
                    <div
                      key={pair.id}
                      onClick={() => navigate(`/forex-trading/${encodeURIComponent(pair.name)}`)}
                      className={`
                        flex items-center justify-between p-3 rounded-lg
                        cursor-pointer transition-all duration-200
                        ${currentPair.id === pair.id 
                          ? 'bg-accent-500/20 border-l-2 border-accent-500' 
                          : 'hover:bg-primary-700/50'}
                      `}
                    >
                      <span className="font-medium">{pair.name}</span>
                      <div className="text-right">
                        <div className="font-mono">{pair.price.toFixed(4)}</div>
                        <div className={`text-sm ${pair.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {pair.change24h >= 0 ? <TrendingUp className="w-4 h-4 inline" /> : <TrendingDown className="w-4 h-4 inline" />}
                          {pair.change24h.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <div className="col-span-12 md:col-span-9 lg:col-span-7 space-y-6">
            <Card className="bg-primary-800/50 border-primary-700/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold">{currentPair.name}</h1>
                    <div className="flex items-center mt-1">
                      <span className={`text-lg ${currentPair.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {currentPair.price.toFixed(4)}
                      </span>
                      <span className={`ml-2 text-sm ${currentPair.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {currentPair.change24h.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      onClick={() => navigate(`/forex-trading-pro/${encodeURIComponent(currentPair.name)}`)}
                      className="bg-accent-500 hover:bg-accent-600"
                    >
                      <Sliders className="w-4 h-4 mr-2" />
                      Pro Mode
                    </Button>
                  </div>
                </div>

                <div className="h-[400px] mt-4">
                  <TradingViewChart 
                    candleData={candleData}
                    pair={currentPair.name}
                    height={400}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary-800/50 border-primary-700/50">
              <CardContent className="p-4">
                <h2 className="font-semibold mb-4">Quick Trade</h2>
                <Tabs defaultValue="market" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="market">Market</TabsTrigger>
                    <TabsTrigger value="limit">Limit</TabsTrigger>
                  </TabsList>
                  <TabsContent value="market">
                    <div className="grid grid-cols-2 gap-4">
                      <Button className="w-full py-6 bg-green-500 hover:bg-green-600">
                        Buy {currentPair.baseAsset}
                      </Button>
                      <Button className="w-full py-6 bg-red-500 hover:bg-red-600">
                        Sell {currentPair.baseAsset}
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="limit">
                    <div className="space-y-4">
                      <div>
                        <Label>Price</Label>
                        <Input type="number" placeholder="Enter limit price" />
                      </div>
                      <div>
                        <Label>Amount</Label>
                        <Input type="number" placeholder="Enter amount" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Button className="w-full bg-green-500 hover:bg-green-600">
                          Buy Limit
                        </Button>
                        <Button className="w-full bg-red-500 hover:bg-red-600">
                          Sell Limit
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <AiStrategyBox pairName={currentPair.name} pairId={currentPair.id} />
          </div>

          {/* Right sidebar */}
          <div className="col-span-12 lg:col-span-3 space-y-6">
            <Card className="bg-primary-800/50 border-primary-700/50">
              <CardContent className="p-4">
                <h2 className="font-semibold mb-4">Market Overview</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-white/70">24h High</span>
                    <span className="font-mono">{(currentPair.price * 1.02).toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">24h Low</span>
                    <span className="font-mono">{(currentPair.price * 0.98).toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Volume</span>
                    <span className="font-mono">1.2M</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-primary-800/50 border-primary-700/50">
              <CardContent className="p-4">
                <h2 className="font-semibold mb-4">Latest News</h2>
                <ForexNews />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}