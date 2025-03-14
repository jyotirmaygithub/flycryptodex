import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Brain, TrendingUp, TrendingDown, AlertTriangle, Info, BarChart2, Sparkles } from 'lucide-react';

interface AiStrategyPanelProps {
  pair: string;
  currentPrice: number;
  compact?: boolean;
}

interface Strategy {
  id: number;
  name: string;
  description: string;
  signal: 'buy' | 'sell' | 'neutral';
  confidence: number;
  timeframe: string;
  indicators: string[];
  entryPrice?: number;
  stopLoss?: number;
  takeProfit?: number;
}

export default function AiStrategyPanel({ pair, currentPrice, compact = false }: AiStrategyPanelProps) {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);

  useEffect(() => {
    // Simulate loading AI strategies
    setLoading(true);
    
    // Mock data - in a real app, this would be fetched from an API
    setTimeout(() => {
      const mockStrategies: Strategy[] = [
        {
          id: 1,
          name: 'Momentum Breakout',
          description: 'This strategy identifies breakouts from consolidation patterns with strong volume confirmation.',
          signal: 'buy',
          confidence: 85,
          timeframe: '4h',
          indicators: ['RSI', 'MACD', 'Volume'],
          entryPrice: currentPrice * 1.005,
          stopLoss: currentPrice * 0.98,
          takeProfit: currentPrice * 1.03
        },
        {
          id: 2,
          name: 'Mean Reversion',
          description: 'This strategy looks for price returning to the mean after significant deviations.',
          signal: 'sell',
          confidence: 72,
          timeframe: '1d',
          indicators: ['Bollinger Bands', 'Stochastic', 'ATR'],
          entryPrice: currentPrice * 0.995,
          stopLoss: currentPrice * 1.02,
          takeProfit: currentPrice * 0.97
        },
        {
          id: 3,
          name: 'Trend Follower',
          description: 'This strategy identifies and follows established trends using moving averages and trend indicators.',
          signal: 'buy',
          confidence: 78,
          timeframe: '1h',
          indicators: ['EMA', 'ADX', 'Ichimoku Cloud'],
          entryPrice: currentPrice,
          stopLoss: currentPrice * 0.985,
          takeProfit: currentPrice * 1.025
        }
      ];
      
      setStrategies(mockStrategies);
      setSelectedStrategy(mockStrategies[0]);
      setLoading(false);
    }, 1000);
  }, [currentPrice, pair]);

  if (loading) {
    return (
      <div className="bg-primary-800 rounded-lg border border-primary-700 p-4">
        <div className="flex items-center mb-3">
          <Brain className="h-5 w-5 mr-2 text-accent-500" />
          <h3 className="font-semibold">AI Trading Strategies</h3>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="bg-primary-800 rounded-lg border border-primary-700 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-accent-500" />
            <h3 className="font-semibold">AI Signal</h3>
          </div>
          <Badge variant="outline" className="px-2 py-1 text-xs">
            Beta
          </Badge>
        </div>
        
        <div className="space-y-3">
          {strategies.slice(0, 1).map(strategy => (
            <div key={strategy.id} className="border border-primary-700 rounded-md p-3">
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium">{strategy.name}</div>
                <Badge 
                  className={
                    strategy.signal === 'buy' 
                      ? 'bg-green-600' 
                      : strategy.signal === 'sell' 
                        ? 'bg-red-600' 
                        : 'bg-yellow-600'
                  }
                >
                  {strategy.signal.toUpperCase()}
                </Badge>
              </div>
              
              <div className="text-xs text-neutral-400 mb-2">
                {strategy.description.substring(0, 80)}...
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-xs mt-2">
                <div className="flex flex-col">
                  <span className="text-neutral-400">Entry</span>
                  <span className="font-mono">${strategy.entryPrice?.toLocaleString()}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-neutral-400">Stop Loss</span>
                  <span className="font-mono text-red-500">${strategy.stopLoss?.toLocaleString()}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-neutral-400">Take Profit</span>
                  <span className="font-mono text-green-500">${strategy.takeProfit?.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="mt-2 text-xs">
                <span className="text-neutral-400">Confidence: </span>
                <span className={
                  strategy.confidence > 80 
                    ? 'text-green-500' 
                    : strategy.confidence > 60 
                      ? 'text-yellow-500' 
                      : 'text-red-500'
                }>
                  {strategy.confidence}%
                </span>
              </div>
            </div>
          ))}
          
          <Button variant="outline" size="sm" className="w-full text-xs">
            View All Strategies
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-primary-800 rounded-lg border border-primary-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Brain className="h-5 w-5 mr-2 text-accent-500" />
          <h3 className="font-semibold">AI Trading Strategies</h3>
        </div>
        <Badge variant="outline" className="px-2 py-1">
          Beta
        </Badge>
      </div>
      
      <div className="grid grid-cols-3 gap-3 mb-4">
        {strategies.map(strategy => (
          <Card 
            key={strategy.id}
            className={`p-3 cursor-pointer border-2 transition-all ${
              selectedStrategy?.id === strategy.id 
                ? 'border-accent-500 bg-primary-700' 
                : 'border-transparent hover:border-primary-600'
            }`}
            onClick={() => setSelectedStrategy(strategy)}
          >
            <div className="flex justify-between items-center mb-1">
              <div className="font-medium text-sm">{strategy.name}</div>
              <Badge 
                className={
                  strategy.signal === 'buy' 
                    ? 'bg-green-600' 
                    : strategy.signal === 'sell' 
                      ? 'bg-red-600' 
                      : 'bg-yellow-600'
                }
              >
                {strategy.signal.toUpperCase()}
              </Badge>
            </div>
            <div className="text-xs text-neutral-400">
              {strategy.timeframe} timeframe • {strategy.confidence}% confidence
            </div>
          </Card>
        ))}
      </div>
      
      {selectedStrategy && (
        <div className="border border-primary-700 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium">{selectedStrategy.name}</h4>
            <div className="flex items-center">
              <BarChart2 className="h-4 w-4 mr-1 text-accent-400" />
              <span className="text-sm">{selectedStrategy.timeframe} Timeframe</span>
            </div>
          </div>
          
          <p className="text-sm text-neutral-300 mb-4">
            {selectedStrategy.description}
          </p>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <h5 className="text-sm text-neutral-400 mb-2">Signal Details</h5>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Signal:</span>
                  <Badge 
                    className={
                      selectedStrategy.signal === 'buy' 
                        ? 'bg-green-600' 
                        : selectedStrategy.signal === 'sell' 
                          ? 'bg-red-600' 
                          : 'bg-yellow-600'
                    }
                  >
                    {selectedStrategy.signal === 'buy' ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : selectedStrategy.signal === 'sell' ? (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 mr-1" />
                    )}
                    {selectedStrategy.signal.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Confidence:</span>
                  <div className="flex items-center">
                    <div className="w-24 h-2 bg-primary-700 rounded-full mr-2">
                      <div 
                        className={`h-full rounded-full ${
                          selectedStrategy.confidence > 80 
                            ? 'bg-green-500' 
                            : selectedStrategy.confidence > 60 
                              ? 'bg-yellow-500' 
                              : 'bg-red-500'
                        }`}
                        style={{ width: `${selectedStrategy.confidence}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">
                      {selectedStrategy.confidence}%
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Key Indicators:</span>
                  <div className="flex flex-wrap justify-end gap-1">
                    {selectedStrategy.indicators.map((indicator, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {indicator}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h5 className="text-sm text-neutral-400 mb-2">Entry & Exit Points</h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Current Price:</span>
                  <span className="text-sm font-mono">${currentPrice.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm">Entry Price:</span>
                  <span className="text-sm font-mono">${selectedStrategy.entryPrice?.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm">Stop Loss:</span>
                  <span className="text-sm font-mono text-red-500">${selectedStrategy.stopLoss?.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm">Take Profit:</span>
                  <span className="text-sm font-mono text-green-500">${selectedStrategy.takeProfit?.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm">Risk/Reward Ratio:</span>
                  <span className="text-sm font-medium">
                    1:{((selectedStrategy.takeProfit! - selectedStrategy.entryPrice!) / 
                        (selectedStrategy.entryPrice! - selectedStrategy.stopLoss!)).toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-primary-700">
            <div className="flex items-center text-xs text-neutral-400">
              <Info className="h-3.5 w-3.5 mr-1" />
              This is AI-generated analysis and should not be considered as financial advice.
            </div>
            
            <Button 
              size="sm" 
              className={selectedStrategy.signal === 'buy' ? 'bg-green-600' : 'bg-red-600'}
            >
              Apply Strategy
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}