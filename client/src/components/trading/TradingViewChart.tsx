import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Line, 
  Bar,
  Area,
  CartesianGrid,
  ReferenceLine,
  Legend
} from 'recharts';
import { CandlestickData } from '@shared/schema';

interface TradingViewChartProps {
  candleData: CandlestickData[];
  pair?: string;
  height?: number;
}

// Format timestamp to readable time
const formatXAxis = (timestamp: number) => {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Custom tooltip component
const CustomTooltip: React.FC<any> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-primary-800 border border-primary-700 p-3 rounded shadow-lg text-xs">
        <p className="text-neutral-400 mb-1">Time: {new Date(data.time).toLocaleString()}</p>
        <p className="text-white">Open: {data.open.toFixed(5)}</p>
        <p className="text-white">High: {data.high.toFixed(5)}</p>
        <p className="text-white">Low: {data.low.toFixed(5)}</p>
        <p className={data.close >= data.open ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
          Close: {data.close.toFixed(5)}
        </p>
        <p className="text-neutral-400 mt-1">Volume: {data.volume.toFixed(2)}</p>
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
      const processedData = candleData.map(candle => ({
        ...candle,
        // Add properties for visualization
        valueRange: candle.high - candle.low,
        openCloseDiff: Math.abs(candle.open - candle.close),
        isIncreasing: candle.close >= candle.open,
        bodyStart: Math.min(candle.open, candle.close),
        bodyEnd: Math.max(candle.open, candle.close),
        wickHeight: candle.high - candle.low,
        bodyHeight: Math.abs(candle.open - candle.close),
        color: candle.close >= candle.open ? '#26a69a' : '#ef5350'
      }));
      setChartData(processedData);
    }
  }, [candleData]);

  return (
    <Card className="h-full border-primary-700 bg-primary-800">
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
        
        <div className="p-4 bg-primary-900" style={{ height: `${height}px` }}>
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'candlestick' ? (
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
                
                {/* High-Low lines (wicks) */}
                {chartData.map((entry, index) => (
                  <ReferenceLine
                    key={`wick-${index}`}
                    segment={[
                      { x: entry.time, y: entry.low },
                      { x: entry.time, y: entry.high }
                    ]}
                    stroke={entry.color}
                    strokeWidth={1}
                    isFront={true}
                  />
                ))}
                
                {/* Candle bodies */}
                <Bar
                  dataKey="openCloseDiff"
                  barSize={8}
                  shape={(props: any) => {
                    const { x, y, width, height, datum } = props;
                    const fill = datum.isIncreasing ? '#26a69a' : '#ef5350';
                    const yStart = datum.isIncreasing ? 
                      y + height - (height * (datum.close - datum.open) / (datum.high - datum.low)) : 
                      y + (height * (datum.open - datum.low) / (datum.high - datum.low));
                    const barHeight = Math.max(1, height * Math.abs(datum.close - datum.open) / (datum.high - datum.low));
                    
                    return (
                      <rect
                        x={x - width / 2}
                        y={datum.isIncreasing ? yStart : y}
                        width={width}
                        height={barHeight}
                        fill={fill}
                        stroke={fill}
                      />
                    );
                  }}
                />
              </ComposedChart>
            ) : (
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
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingViewChart;