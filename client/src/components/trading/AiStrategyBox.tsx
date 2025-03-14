import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Brain, TrendingUp, TrendingDown, BarChart4, Target, RefreshCw } from "lucide-react";

interface AiStrategyBoxProps {
  pairName: string;
  pairId: number;
}

export default function AiStrategyBox({ pairName, pairId }: AiStrategyBoxProps) {
  // In a real implementation, this would fetch strategies from an API
  // For now, we're using mock data
  
  const strategies = [
    {
      id: 1,
      name: "Momentum Breakout",
      confidence: 78,
      direction: "bullish",
      timeframe: "4h",
      description: "Price breakout with increased volume supports upward momentum"
    },
    {
      id: 2,
      name: "Support Level Bounce",
      confidence: 65,
      direction: "bullish",
      timeframe: "1d",
      description: "Price approaching key support level with RSI oversold"
    },
    {
      id: 3,
      name: "Resistance Zone",
      confidence: 72,
      direction: "bearish",
      timeframe: "2h",
      description: "Price reached major resistance with bearish divergence"
    }
  ];

  return (
    <Card className="bg-primary-800 border-primary-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center">
          <Brain className="mr-2 h-5 w-5 text-accent-500" />
          AI Trading Strategies
          <Button variant="outline" size="sm" className="ml-auto">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {strategies.map((strategy) => (
            <div 
              key={strategy.id} 
              className="p-3 bg-primary-700 rounded-lg border border-primary-600 hover:border-accent-500 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  {strategy.direction === "bullish" ? (
                    <TrendingUp className="h-4 w-4 text-green-500 mr-2" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500 mr-2" />
                  )}
                  <span className="font-medium">{strategy.name}</span>
                </div>
                <Badge 
                  variant="outline" 
                  className={strategy.direction === "bullish" ? "text-green-500 border-green-500" : "text-red-500 border-red-500"}
                >
                  {strategy.direction}
                </Badge>
              </div>
              
              <div className="text-sm text-gray-300 mb-2">
                {strategy.description}
              </div>
              
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <div className="flex items-center">
                  <BarChart4 className="h-3 w-3 mr-1" />
                  <span>{strategy.timeframe} timeframe</span>
                </div>
                <div className="flex items-center">
                  <Target className="h-3 w-3 mr-1" />
                  <span>Confidence</span>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="h-2 flex-1 bg-primary-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      strategy.confidence >= 70 
                        ? "bg-green-500" 
                        : strategy.confidence >= 50 
                          ? "bg-yellow-500" 
                          : "bg-red-500"
                    }`}
                    style={{ width: `${strategy.confidence}%` }}
                  />
                </div>
                <span className="ml-2 text-sm font-medium">{strategy.confidence}%</span>
              </div>
            </div>
          ))}
          
          <div className="mt-2 flex justify-center">
            <Button variant="outline" size="sm" className="w-full text-accent-500 border-accent-500">
              View More Strategies
            </Button>
          </div>
          
          <div className="bg-primary-700/50 p-2 rounded-md mt-2 flex items-start border border-primary-600">
            <AlertCircle className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-300">
              AI strategies are generated based on technical analysis and historical patterns. 
              Always conduct your own research before making trading decisions.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}