import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { 
  ArrowLeft, 
  Code, 
  Settings, 
  RefreshCcw, 
  PieChart,
  BarChart, 
  TrendingUp,
  ChevronRight,
  History,
  Bot,
  LineChart,
  Activity
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { Badge } from "@/components/ui/badge";

export default function AlgoTrading() {
  const { darkMode } = useAppContext();
  const [activeTab, setActiveTab] = useState("strategies");
  
  const strategies = [
    {
      id: 1,
      name: "TrendFollower",
      status: "active",
      profit: "+2.3%",
      timeframe: "1h",
      description: "Uses moving averages to detect and follow market trends",
      runningTime: "3d 5h",
      indicators: ["EMA", "RSI", "MACD"]
    },
    {
      id: 2,
      name: "GridTrader",
      status: "inactive",
      profit: "+11.5%",
      timeframe: "4h",
      description: "Places buy and sell orders at regular price intervals",
      runningTime: "2w 3d",
      indicators: ["Bollinger Bands", "Volume"]
    },
    {
      id: 3,
      name: "MeanReversion",
      status: "active",
      profit: "-1.2%",
      timeframe: "15m",
      description: "Trades when price deviates from its average value",
      runningTime: "1d 12h",
      indicators: ["Bollinger Bands", "VWAP", "ATR"]
    }
  ];
  
  const botTemplates = [
    {
      id: 1,
      name: "Momentum Trader",
      category: "Trend Following",
      complexity: "Medium",
      pairs: ["BTC/USDT", "ETH/USDT"],
      description: "Captures short-term price momentum using RSI and MACD"
    },
    {
      id: 2,
      name: "Scalping Bot",
      category: "High Frequency",
      complexity: "Advanced",
      pairs: ["BTC/USDT", "ETH/USDT", "SOL/USDT"],
      description: "Executes rapid trades to profit from small price movements"
    },
    {
      id: 3,
      name: "DCA Bot",
      category: "Passive",
      complexity: "Beginner",
      pairs: ["All pairs"],
      description: "Automated Dollar Cost Averaging strategy for accumulation"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0e11] text-white">
      <div className="py-4 px-6 border-b border-[#1a1d24]">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="flex items-center text-neutral-400 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
      
      <div className="flex-1 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Algo Trading</h1>
            <p className="text-neutral-400">
              Deploy automated trading strategies with our advanced algorithmic trading tools.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <Card className="bybit-card">
              <CardHeader>
                <div className="mb-2 bg-[#f7a600]/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Bot className="h-6 w-6 text-[#f7a600]" />
                </div>
                <CardTitle>Trading Bots</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-400 mb-4">
                  Create and deploy custom trading bots with no coding required.
                </p>
                <Button className="bybit-button-primary w-full">
                  Create New Bot
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bybit-card">
              <CardHeader>
                <div className="mb-2 bg-[#f7a600]/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <LineChart className="h-6 w-6 text-[#f7a600]" />
                </div>
                <CardTitle>Strategy Builder</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-400 mb-4">
                  Design custom trading strategies using our visual strategy builder.
                </p>
                <Button className="bybit-button-secondary w-full">
                  Create Strategy
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bybit-card">
              <CardHeader>
                <div className="mb-2 bg-[#f7a600]/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Activity className="h-6 w-6 text-[#f7a600]" />
                </div>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-400 mb-4">
                  Track and analyze the performance of your automated trading strategies.
                </p>
                <Button className="bybit-button-secondary w-full">
                  View Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-12">
            <Tabs defaultValue="strategies" className="w-full">
              <div className="mb-4">
                <TabsList className="bg-[#181c25]">
                  <TabsTrigger value="strategies" className="data-[state=active]:bg-[#f7a600] data-[state=active]:text-black">My Strategies</TabsTrigger>
                  <TabsTrigger value="templates" className="data-[state=active]:bg-[#f7a600] data-[state=active]:text-black">Bot Templates</TabsTrigger>
                  <TabsTrigger value="backtest" className="data-[state=active]:bg-[#f7a600] data-[state=active]:text-black">Backtesting</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="strategies">
                <div className="bg-[#181c25] rounded-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Active Strategies</h2>
                    <Button className="bybit-button-primary">
                      New Strategy
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {strategies.map((strategy) => (
                      <div key={strategy.id} className="bg-[#0b0e11] rounded-md p-4 border border-[#303544]">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold">{strategy.name}</h3>
                              <Badge className={`text-xs ${strategy.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-neutral-500/20 text-neutral-400'}`}>
                                {strategy.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-neutral-400">{strategy.description}</p>
                          </div>
                          <div className={`text-lg font-bold ${strategy.profit.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                            {strategy.profit}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                          <div>
                            <p className="text-neutral-400">Timeframe</p>
                            <p>{strategy.timeframe}</p>
                          </div>
                          <div>
                            <p className="text-neutral-400">Running Time</p>
                            <p>{strategy.runningTime}</p>
                          </div>
                          <div>
                            <p className="text-neutral-400">Indicators</p>
                            <p>{strategy.indicators.join(", ")}</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-end mt-4">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-neutral-400 hover:text-white border-[#303544] hover:bg-[#303544]"
                          >
                            View Details
                            <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="templates">
                <div className="bg-[#181c25] rounded-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Bot Templates</h2>
                    <div className="flex gap-2">
                      <Button variant="outline" className="border-[#303544] hover:bg-[#303544]">
                        <Settings className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                      <Button className="bybit-button-primary">
                        Create Custom Template
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {botTemplates.map((template) => (
                      <div key={template.id} className="bg-[#0b0e11] rounded-md p-4 border border-[#303544]">
                        <div className="mb-2">
                          <h3 className="font-bold">{template.name}</h3>
                          <p className="text-sm text-neutral-400">{template.description}</p>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                          <div>
                            <p className="text-neutral-400">Category</p>
                            <p>{template.category}</p>
                          </div>
                          <div>
                            <p className="text-neutral-400">Complexity</p>
                            <p>{template.complexity}</p>
                          </div>
                          <div>
                            <p className="text-neutral-400">Pairs</p>
                            <p>{template.pairs.length > 1 ? `${template.pairs.length} pairs` : template.pairs[0]}</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-end mt-4">
                          <Button 
                            className="bybit-button-primary"
                            size="sm"
                          >
                            Use Template
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="backtest">
                <div className="bg-[#181c25] rounded-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Backtest Your Strategies</h2>
                    <Button className="bybit-button-primary">
                      New Backtest
                    </Button>
                  </div>
                  
                  <div className="text-center py-12">
                    <History className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
                    <h3 className="text-lg font-bold mb-2">No Backtest Results</h3>
                    <p className="text-neutral-400 mb-6">
                      You haven't run any backtests yet. Create a strategy and test its performance against historical data.
                    </p>
                    <Button className="bybit-button-primary">
                      Run Your First Backtest
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bybit-card">
              <CardHeader>
                <div className="mb-2 bg-[#f7a600]/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-[#f7a600]" />
                </div>
                <CardTitle>Strategy Marketplace</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-400 mb-4">
                  Browse and purchase pre-built strategies developed by professional traders.
                </p>
                <Button className="bybit-button-secondary w-full">
                  Explore Marketplace
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bybit-card">
              <CardHeader>
                <div className="mb-2 bg-[#f7a600]/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <BarChart className="h-6 w-6 text-[#f7a600]" />
                </div>
                <CardTitle>Learn Algo Trading</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-400 mb-4">
                  Access educational resources and tutorials on algorithmic trading strategies.
                </p>
                <Button className="bybit-button-secondary w-full">
                  View Tutorials
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}