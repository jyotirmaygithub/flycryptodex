import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, Activity, Clock } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface SimpleChartProps {
  data: any[];
  isLoading: boolean;
  chartType: 'line' | 'area';
  timeFrame: string;
  onChangeChartType: (type: 'line' | 'area') => void;
  onChangeTimeFrame: (timeFrame: string) => void;
}

export default function SimpleChart({ 
  data, 
  isLoading, 
  chartType, 
  timeFrame, 
  onChangeChartType, 
  onChangeTimeFrame 
}: SimpleChartProps) {
  // Format data for recharts
  const formattedData = data.map(candle => ({
    time: new Date(candle.time * 1000).toLocaleTimeString(),
    price: candle.close,
    open: candle.open,
    high: candle.high,
    low: candle.low,
  }));

  // Render different chart types based on selection
  const renderChart = () => {
    if (isLoading) {
      return <Skeleton className="h-full w-full" />;
    }

    if (chartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formattedData}>
            <XAxis dataKey="time" />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="price"
              stroke="rgba(66, 153, 225, 1)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      );
    } else {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={formattedData}>
            <XAxis dataKey="time" />
            <YAxis domain={['auto', 'auto']} />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="price"
              stroke="rgba(66, 153, 225, 1)"
              fill="rgba(66, 153, 225, 0.5)"
            />
          </AreaChart>
        </ResponsiveContainer>
      );
    }
  };
  
  return (
    <div className="flex-1 p-4 min-h-[400px] relative">
      <div className="absolute inset-0 p-4">
        <div className="h-full rounded-lg bg-primary-800 border border-primary-700 p-4 flex flex-col">
          {/* Chart Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-3">
              <Button
                size="sm"
                variant={chartType === 'line' ? 'default' : 'ghost'}
                className={chartType === 'line' ? 'bg-accent-500 text-white' : 'text-neutral-300 hover:text-white'}
                onClick={() => onChangeChartType('line')}
              >
                <TrendingUp className="h-4 w-4 mr-1" />
                Line
              </Button>
              <Button
                size="sm"
                variant={chartType === 'area' ? 'default' : 'ghost'}
                className={chartType === 'area' ? 'bg-accent-500 text-white' : 'text-neutral-300 hover:text-white'}
                onClick={() => onChangeChartType('area')}
              >
                <Activity className="h-4 w-4 mr-1" />
                Area
              </Button>
            </div>
            
            <div className="flex space-x-3">
              {['1m', '5m', '15m', '1h', '4h', '1d'].map((tf) => (
                <Button
                  key={tf}
                  size="sm"
                  variant={timeFrame === tf ? 'default' : 'outline'}
                  className={timeFrame === tf ? 'bg-accent-500 text-white' : 'bg-primary-700 hover:bg-primary-600'}
                  onClick={() => onChangeTimeFrame(tf)}
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {tf}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Chart Content */}
          <div className="flex-1 relative">
            {renderChart()}
          </div>
        </div>
      </div>
    </div>
  );
}