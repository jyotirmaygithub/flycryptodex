import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CandlestickData } from '@shared/schema';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

interface TradingViewChartProps {
  candleData: CandlestickData[];
  height?: number;
  autosize?: boolean;
  theme?: 'light' | 'dark';
}

export default function TradingViewChart({ 
  candleData, 
  height = 500, 
  autosize = true,
  theme = 'dark'
}: TradingViewChartProps) {
  const [timeframe, setTimeframe] = useState<string>('1h');
  const [chartType, setChartType] = useState<'candlestick' | 'line'>('line');
  
  // Format data for recharts
  const formattedData = candleData.map(candle => ({
    time: new Date(candle.time).toLocaleTimeString(),
    open: candle.open,
    high: candle.high,
    low: candle.low,
    close: candle.close,
    value: candle.close,
  }));
  
  // Change timeframe handler
  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe);
    // In a real implementation, this would fetch new data with the selected timeframe
  };
  
  // Change chart type handler
  const handleChartTypeChange = (newType: 'candlestick' | 'line') => {
    if (newType !== chartType) {
      setChartType(newType);
    }
  };

  // Get chart color based on data trend
  const isPositive = formattedData[0]?.close < formattedData[formattedData.length - 1]?.close;
  const chartColor = isPositive ? "#22c55e" : "#ef4444";

  return (
    <div className="rounded-lg border border-primary-700 bg-primary-800 overflow-hidden">
      <div className="flex items-center justify-between p-3 border-b border-primary-700">
        <div className="flex items-center gap-4">
          <div className="flex">
            <button 
              className={`px-3 py-1 ${chartType === 'candlestick' ? 'bg-primary-700 rounded-md' : ''}`}
              onClick={() => handleChartTypeChange('candlestick')}
            >
              Candles
            </button>
            <button 
              className={`px-3 py-1 ${chartType === 'line' ? 'bg-primary-700 rounded-md' : ''}`}
              onClick={() => handleChartTypeChange('line')}
            >
              Line
            </button>
          </div>
          
          <Tabs value={timeframe} onValueChange={handleTimeframeChange}>
            <TabsList className="bg-primary-700 h-8">
              <TabsTrigger value="1m" className="text-xs h-6 px-2">1m</TabsTrigger>
              <TabsTrigger value="5m" className="text-xs h-6 px-2">5m</TabsTrigger>
              <TabsTrigger value="15m" className="text-xs h-6 px-2">15m</TabsTrigger>
              <TabsTrigger value="1h" className="text-xs h-6 px-2">1h</TabsTrigger>
              <TabsTrigger value="4h" className="text-xs h-6 px-2">4h</TabsTrigger>
              <TabsTrigger value="1d" className="text-xs h-6 px-2">1d</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="text-xs px-2 py-1 bg-primary-700 rounded">
            Indicators
          </button>
          <button className="text-xs px-2 py-1 bg-primary-700 rounded">
            Full Screen
          </button>
        </div>
      </div>
      
      <div className="p-4" style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <AreaChart
              data={formattedData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9ca3af" />
              <YAxis 
                stroke="#9ca3af" 
                domain={['auto', 'auto']} 
                tickFormatter={(value) => value.toFixed(2)} 
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  color: '#d1d5db'
                }}
              />
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.2}/>
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={chartColor} 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#chartGradient)" 
              />
            </AreaChart>
          ) : (
            <LineChart
              data={formattedData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9ca3af" />
              <YAxis 
                stroke="#9ca3af" 
                domain={['auto', 'auto']} 
                tickFormatter={(value) => value.toFixed(2)} 
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: '#1f2937', 
                  border: '1px solid #374151',
                  color: '#d1d5db'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="high" 
                stroke="#22c55e" 
                dot={false} 
                strokeWidth={1}
                name="High"
              />
              <Line 
                type="monotone" 
                dataKey="low" 
                stroke="#ef4444" 
                dot={false} 
                strokeWidth={1}
                name="Low"
              />
              <Line 
                type="monotone" 
                dataKey="close" 
                stroke="#3b82f6" 
                dot={false} 
                strokeWidth={2}
                name="Close"
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}