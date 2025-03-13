import React, { useEffect, useRef, useState } from 'react';
import { createChart, CrosshairMode, IChartApi, ISeriesApi, Time } from 'lightweight-charts';
import { CandlestickData } from '@shared/schema';
import { formatCandlestickData } from '@/lib/mockData';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const [timeframe, setTimeframe] = useState<string>('1h');
  const [chartType, setChartType] = useState<'candlestick' | 'line'>('candlestick');
  const lineSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  
  // Format the data for the chart
  const formattedData = formatCandlestickData(candleData);

  // Chart options based on theme
  const getChartOptions = () => {
    const isDark = theme === 'dark';
    
    return {
      width: chartContainerRef.current?.clientWidth || 600,
      height,
      layout: {
        background: {
          color: isDark ? '#111827' : '#ffffff',
        },
        textColor: isDark ? '#d1d5db' : '#374151',
      },
      grid: {
        vertLines: {
          color: isDark ? '#1f2937' : '#e5e7eb',
        },
        horzLines: {
          color: isDark ? '#1f2937' : '#e5e7eb',
        },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          width: 1,
          color: isDark ? '#6b7280' : '#9ca3af',
          style: 0,
        },
        horzLine: {
          width: 1,
          color: isDark ? '#6b7280' : '#9ca3af',
          style: 0,
        },
      },
      timeScale: {
        borderColor: isDark ? '#374151' : '#e5e7eb',
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: isDark ? '#374151' : '#e5e7eb',
      },
      handleScroll: {
        vertTouchDrag: false,
      },
    };
  };

  // Initialize chart
  useEffect(() => {
    if (chartContainerRef.current) {
      chartRef.current = createChart(chartContainerRef.current, getChartOptions());
      
      // Create the series based on chart type
      if (chartType === 'candlestick') {
        candlestickSeriesRef.current = chartRef.current.addCandlestickSeries({
          upColor: '#22c55e',
          downColor: '#ef4444',
          borderVisible: false,
          wickUpColor: '#22c55e',
          wickDownColor: '#ef4444',
        });
        
        candlestickSeriesRef.current.setData(formattedData);
      } else {
        lineSeriesRef.current = chartRef.current.addLineSeries({
          color: '#3b82f6',
          lineWidth: 2,
        });
        
        lineSeriesRef.current.setData(formattedData.map(d => ({
          time: d.time as Time,
          value: d.close,
        })));
      }
      
      // Fit content to display all candles
      chartRef.current.timeScale().fitContent();
      
      // Handle window resize
      const handleResize = () => {
        if (chartRef.current && autosize && chartContainerRef.current) {
          chartRef.current.applyOptions({ 
            width: chartContainerRef.current.clientWidth 
          });
        }
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        if (chartRef.current) {
          chartRef.current.remove();
          chartRef.current = null;
        }
      };
    }
  }, [chartType, theme]);
  
  // Update data when candleData changes
  useEffect(() => {
    if (chartRef.current) {
      if (chartType === 'candlestick' && candlestickSeriesRef.current) {
        candlestickSeriesRef.current.setData(formattedData);
      } else if (chartType === 'line' && lineSeriesRef.current) {
        lineSeriesRef.current.setData(formattedData.map(d => ({
          time: d.time as Time,
          value: d.close,
        })));
      }
      
      chartRef.current.timeScale().fitContent();
    }
  }, [candleData]);
  
  // Change timeframe handler
  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe);
    // In a real implementation, this would fetch new data with the selected timeframe
  };
  
  // Change chart type handler
  const handleChartTypeChange = (newType: 'candlestick' | 'line') => {
    if (newType !== chartType) {
      setChartType(newType);
      
      // Clear the chart and recreate with new type
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    }
  };

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
      
      <div className="w-full" ref={chartContainerRef} style={{ height: `${height}px` }}></div>
    </div>
  );
}