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
  ReferenceArea,
  Legend,
  TooltipProps
} from 'recharts';
import { CandlestickData } from '@shared/schema';

// Enhanced type for processed candle data
interface ProcessedCandleData extends CandlestickData {
  valueRange: number;
  openCloseDiff: number;
  isIncreasing: boolean;
  bodyStart: number;
  bodyEnd: number;
  wickHeight: number;
  bodyHeight: number;
  color: string;
}

interface TradingViewChartProps {
  candleData: CandlestickData[];
  pair?: string;
  height?: number;
}

// Props for the Custom Bar shape renderer
interface CandleBarShapeProps {
  x: number;
  y: number;
  width: number;
  height: number;
  datum: ProcessedCandleData;
}

// Typed custom shape renderer that always returns an SVG element
const CandleBarShape = (props: CandleBarShapeProps) => {
  const { x, y, width, height, datum } = props;
  
  // Safety check to make sure datum and its properties exist
  if (!datum || typeof datum.close === 'undefined' || typeof datum.open === 'undefined') {
    return (
      <rect
        x={x}
        y={y}
        width={2}
        height={2}
        fill="#666"
      />
    );
  }
  
  // Determine if candle is up or down
  const isUp = datum.close >= datum.open;
  const color = isUp ? '#26a69a' : '#ef5350';

  // Calculate dimensions for the candle body
  const adjustedWidth = Math.max(width || 0, 3); // Min width of 3px for visibility
  const adjustedHeight = Math.max(height || 0, 2); // Min height of 2px for visibility
  
  // Calculate position for the candle wick
  const wickX = x; // Center of the candle
  const wickTop = y - adjustedHeight / 2 - (datum.high - datum.bodyEnd); // Top of wick
  const wickBottom = y + adjustedHeight / 2 + (datum.bodyStart - datum.low); // Bottom of wick
  const wickHeight = wickBottom - wickTop;
  
  return (
    <g>
      {/* Candle body */}
      <rect
        x={x - adjustedWidth / 2}
        y={y - adjustedHeight / 2}
        width={adjustedWidth}
        height={adjustedHeight}
        fill={color}
        stroke={color}
      />
      
      {/* Candle wick - rendered as a thin line */}
      {wickHeight > 0 && (
        <line
          x1={wickX}
          y1={wickTop}
          x2={wickX}
          y2={wickBottom}
          stroke={color}
          strokeWidth={1}
        />
      )}
    </g>
  );
};

// Format timestamp to readable time
const formatXAxis = (timestamp: number) => {
  if (!timestamp) return '';
  try {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return '';
  }
};

// Custom tooltip component with proper types
const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    try {
      const data = payload[0].payload as ProcessedCandleData;
      
      // Check if we have all required fields
      if (!data || !data.time || typeof data.open !== 'number' || 
          typeof data.high !== 'number' || typeof data.low !== 'number' || 
          typeof data.close !== 'number' || typeof data.volume !== 'number') {
        return null;
      }
      
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
    } catch (e) {
      console.error("Error rendering tooltip:", e);
      return null;
    }
  }
  return null;
};

const TradingViewChart: React.FC<TradingViewChartProps> = ({ 
  candleData = [], 
  pair = 'BTC/USD',
  height = 500
}) => {
  const [chartData, setChartData] = useState<ProcessedCandleData[]>([]);
  const [chartType, setChartType] = useState<'candlestick' | 'line' | 'area'>('candlestick');
  const [timeFrame, setTimeFrame] = useState<string>('1h');

  useEffect(() => {
    if (candleData && Array.isArray(candleData) && candleData.length > 0) {
      try {
        const processedData = candleData
          .filter(candle => (
            candle && 
            typeof candle.open === 'number' &&
            typeof candle.high === 'number' &&
            typeof candle.low === 'number' &&
            typeof candle.close === 'number'
          ))
          .map(candle => {
            // Calculate derived values with safety checks
            const openCloseDiff = Math.max(0.0001, Math.abs(candle.open - candle.close));
            
            return {
              ...candle,
              // Add properties for visualization with fallbacks for calculations
              valueRange: Math.max(0.001, candle.high - candle.low),
              openCloseDiff: openCloseDiff,
              isIncreasing: candle.close >= candle.open,
              bodyStart: Math.min(candle.open, candle.close),
              bodyEnd: Math.max(candle.open, candle.close),
              wickHeight: Math.max(0.001, candle.high - candle.low),
              bodyHeight: openCloseDiff,
              color: candle.close >= candle.open ? '#26a69a' : '#ef5350'
            };
          }) as ProcessedCandleData[];
        
        if (processedData.length > 0) {
          setChartData(processedData);
        } else {
          console.warn("Filtered data is empty, using default data");
          // Create a minimal default dataset
          const defaultData = Array.from({ length: 5 }, (_, i) => ({
            time: Date.now() - i * 3600000,
            open: 1.0 + i * 0.01,
            high: 1.05 + i * 0.01,
            low: 0.95 + i * 0.01,
            close: 1.02 + i * 0.01,
            volume: 100,
            valueRange: 0.1,
            openCloseDiff: 0.02,
            isIncreasing: true,
            bodyStart: 1.0 + i * 0.01,
            bodyEnd: 1.02 + i * 0.01,
            wickHeight: 0.1,
            bodyHeight: 0.02,
            color: '#26a69a'
          } as ProcessedCandleData));
          setChartData(defaultData);
        }
      } catch (error) {
        console.error("Error processing candle data:", error);
        setChartData([]);
      }
    } else {
      console.warn("No valid candle data provided");
      setChartData([]);
    }
  }, [candleData]);

  // Render a message if no data is available
  if (!chartData.length) {
    return (
      <Card className="h-full border-primary-700 bg-primary-800">
        <CardContent className="flex items-center justify-center h-full">
          <p className="text-gray-400">No chart data available</p>
        </CardContent>
      </Card>
    );
  }

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
            <ComposedChart
              data={chartData}
              margin={{ top: 20, right: 40, left: 20, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2B2B43" />
              <XAxis 
                dataKey="time" 
                tickFormatter={formatXAxis} 
                minTickGap={50}
                stroke="#666"
                height={40}
                tickSize={8}
                padding={{ left: 20, right: 20 }}
              />
              <YAxis 
                domain={['auto', 'auto']} 
                tickCount={10} 
                stroke="#666"
                orientation="right"
                width={60}
                tickSize={8}
                padding={{ top: 20, bottom: 20 }}
                tickFormatter={(value) => value.toFixed(3)}
              />
              <Tooltip content={<CustomTooltip />} />
              
              {chartType === 'candlestick' && (
                <>
                  <Line
                    dataKey="high"
                    stroke="transparent"
                    dot={false}
                  />
                  <Line
                    dataKey="low"
                    stroke="transparent"
                    dot={false}
                  />
                  <Bar
                    dataKey="openCloseDiff"
                    barSize={8} 
                    shape={(props: any) => {
                      return <CandleBarShape {...props} />;
                    }}
                    isAnimationActive={false}
                  />
                </>
              )}
              
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
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradingViewChart;