import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  Line, 
  Bar,
  Area,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import { CandlestickData } from '@shared/schema';

interface TradingViewChartProps {
  candleData: CandlestickData[];
  pair?: string;
  height?: number;
  width?: string;
}

// Format timestamp to readable time
const formatXAxis = (timestamp: number) => {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-primary-800 border border-primary-700 p-2 rounded shadow-lg text-xs">
        <p className="text-neutral-400">Time: {new Date(data.time).toLocaleString()}</p>
        <p className="text-white">Open: ${data.open.toFixed(2)}</p>
        <p className="text-white">High: ${data.high.toFixed(2)}</p>
        <p className="text-white">Low: ${data.low.toFixed(2)}</p>
        <p className={data.close >= data.open ? "text-green-500" : "text-red-500"}>
          Close: ${data.close.toFixed(2)}
        </p>
        <p className="text-neutral-400">Volume: {data.volume.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

const TradingViewChart: React.FC<TradingViewChartProps> = ({ 
  candleData = [], 
  pair = 'BTC/USD',
  height = 500
}) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartType, setChartType] = useState<'candlestick' | 'line' | 'area'>('candlestick');
  const [timeFrame, setTimeFrame] = useState<string>('1h');

  useEffect(() => {
    if (candleData.length > 0) {
      setChartData(candleData.map(candle => ({
        ...candle,
        // Add a value to represent the candlestick
        valueRange: candle.high - candle.low,
        openCloseDiff: Math.abs(candle.open - candle.close),
        isIncreasing: candle.close >= candle.open,
      })));
    }
  }, [candleData]);

  // Chart specific settings
  const getColor = (isIncreasing: boolean) => isIncreasing ? '#26a69a' : '#ef5350';

  return (
    <Card className="h-full">
      <CardContent className="p-0">
        <div className="chart-header p-3 border-b border-primary-700 flex items-center justify-between">
          <h3 className="text-lg font-medium">{pair}</h3>
          
          <div className="flex space-x-2">
            <div className="flex border border-primary-700 rounded overflow-hidden">
              {['1m', '5m', '15m', '1h', '4h', '1d'].map(tf => (
                <button 
                  key={tf}
                  className={`px-2 py-1 text-xs ${timeFrame === tf ? 'bg-primary-700' : 'bg-primary-800 hover:bg-primary-700/50'}`}
                  onClick={() => setTimeFrame(tf)}
                >
                  {tf}
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
        
        <div className="p-4 bg-primary-800" style={{ height: `${height}px` }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2B2B43" />
              <XAxis 
                dataKey="time" 
                tickFormatter={formatXAxis} 
                minTickGap={50}
                stroke="#666"
              />
              <YAxis 
                domain={['auto', 'auto']} 
                tickCount={10} 
                stroke="#666"
                orientation="right"
              />
              <Tooltip content={<CustomTooltip />} />
              
              {chartType === 'line' && (
                <Line
                  type="monotone"
                  dataKey="close"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={false}
                />
              )}
              
              {chartType === 'area' && (
                <Area
                  type="monotone"
                  dataKey="close"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.2}
                />
              )}
              
              {chartType === 'candlestick' && (
                <>
                  {/* Wicks */}
                  {chartData.map((entry, index) => (
                    <ReferenceLine
                      key={`wick-${index}`}
                      x={index}
                      segment={[
                        { x: index, y: entry.low },
                        { x: index, y: entry.high }
                      ]}
                      stroke={getColor(entry.isIncreasing)}
                      strokeWidth={1}
                      ifOverflow="extendDomain"
                    />
                  ))}
                  
                  {/* Candle bodies */}
                  <Bar
                    dataKey="openCloseDiff"
                    barSize={8}
                    fill={(entry) => getColor(entry.isIncreasing)}
                    stroke={(entry) => getColor(entry.isIncreasing)}
                    minPointSize={5}
                  />
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingViewChart;