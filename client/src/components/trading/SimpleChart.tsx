import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ReferenceLine
} from 'recharts';
import { 
  Card, 
  CardContent 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Button 
} from '@/components/ui/button';
import { 
  Skeleton 
} from '@/components/ui/skeleton';
import { formatCandlestickData } from '@/lib/mockData';

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
  // Format the timestamp for the tooltip
  const formatXAxis = (tickItem: number) => {
    return new Date(tickItem).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Custom tooltip content
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-primary-800 border border-primary-700 p-2 rounded shadow-lg">
          <p className="text-xs text-neutral-400">
            {new Date(label).toLocaleDateString() + ' ' + new Date(label).toLocaleTimeString()}
          </p>
          <p className="text-sm font-semibold">${payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  // Prepare the data for recharts
  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map(item => ({
      time: item.time * 1000, // Convert to milliseconds for JavaScript Date
      price: item.close,
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume
    }));
  }, [data]);

  if (isLoading) {
    return (
      <Card className="w-full h-80 border-primary-700 bg-primary-800">
        <CardContent className="p-0">
          <Skeleton className="w-full h-80" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border-primary-700 bg-primary-800 overflow-hidden">
      <div className="flex items-center justify-between border-b border-primary-700 p-3">
        <div className="flex space-x-1">
          <Button 
            variant={chartType === 'line' ? 'default' : 'outline'} 
            size="sm" 
            className="h-7"
            onClick={() => onChangeChartType('line')}
          >
            Line
          </Button>
          <Button 
            variant={chartType === 'area' ? 'default' : 'outline'} 
            size="sm" 
            className="h-7"
            onClick={() => onChangeChartType('area')}
          >
            Area
          </Button>
        </div>

        <Tabs defaultValue={timeFrame} onValueChange={onChangeTimeFrame}>
          <TabsList className="bg-primary-700">
            <TabsTrigger className="text-xs px-2 py-1" value="1m">1m</TabsTrigger>
            <TabsTrigger className="text-xs px-2 py-1" value="5m">5m</TabsTrigger>
            <TabsTrigger className="text-xs px-2 py-1" value="15m">15m</TabsTrigger>
            <TabsTrigger className="text-xs px-2 py-1" value="1h">1h</TabsTrigger>
            <TabsTrigger className="text-xs px-2 py-1" value="4h">4h</TabsTrigger>
            <TabsTrigger className="text-xs px-2 py-1" value="1d">1d</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <CardContent className="p-0 h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'line' ? (
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <XAxis 
                dataKey="time" 
                tickFormatter={formatXAxis} 
                domain={['auto', 'auto']}
                type="number"
                scale="time"
                tick={{ fontSize: 10, fill: '#9ca3af' }}
              />
              <YAxis 
                domain={['auto', 'auto']} 
                tickFormatter={(value) => `$${value.toFixed(0)}`}
                orientation="right"
                tick={{ fontSize: 10, fill: '#9ca3af' }}
              />
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={chartData[chartData.length - 1]?.close} stroke="#6366f1" strokeDasharray="3 3" />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#6366f1" 
                dot={false} 
                strokeWidth={2}
                activeDot={{ r: 5, stroke: "#4f46e5", strokeWidth: 1, fill: "#818cf8" }}
              />
            </LineChart>
          ) : (
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <XAxis 
                dataKey="time" 
                tickFormatter={formatXAxis} 
                domain={['auto', 'auto']}
                type="number"
                scale="time"
                tick={{ fontSize: 10, fill: '#9ca3af' }}
              />
              <YAxis 
                domain={['auto', 'auto']} 
                tickFormatter={(value) => `$${value.toFixed(0)}`}
                orientation="right"
                tick={{ fontSize: 10, fill: '#9ca3af' }}
              />
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke="#6366f1" 
                fill="url(#colorGradient)" 
                dot={false}
                activeDot={{ r: 5, stroke: "#4f46e5", strokeWidth: 1, fill: "#818cf8" }}
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
            </AreaChart>
          )}
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}