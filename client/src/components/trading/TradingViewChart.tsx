import React, { useEffect, useRef, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CandlestickData } from '@shared/schema';

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
  const [timeframe, setTimeframe] = useState<string>('1h');
  const [chartType, setChartType] = useState<'candlestick' | 'line'>('candlestick');
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);
  
  // Initialize chart with lightweight-charts
  useEffect(() => {
    const initChart = async () => {
      if (!chartContainerRef.current) return;
      
      try {
        // Dynamically import lightweight-charts
        const { createChart } = await import('lightweight-charts');
        
        // Clean up any previous chart
        if (chartRef.current) {
          chartRef.current.remove();
        }
        
        // Determine colors based on theme
        const isDark = theme === 'dark';
        const backgroundColor = isDark ? '#111827' : '#ffffff';
        const textColor = isDark ? '#d1d5db' : '#374151';
        const gridColor = isDark ? '#1f2937' : '#e5e7eb';
        const borderColor = isDark ? '#374151' : '#e5e7eb';
        
        // Create chart
        const chart = createChart(chartContainerRef.current, {
          width: chartContainerRef.current.clientWidth,
          height,
          layout: {
            background: { color: backgroundColor },
            textColor: textColor,
          },
          grid: {
            vertLines: { color: gridColor },
            horzLines: { color: gridColor },
          },
          timeScale: {
            borderColor: borderColor,
            timeVisible: true,
          },
          rightPriceScale: {
            borderColor: borderColor,
          },
        });
        
        chartRef.current = chart;
        
        // Convert data to the format required by lightweight-charts
        const formattedData = candleData.map(candle => ({
          time: Math.floor(candle.time / 1000),
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
        }));
        
        // Add the appropriate series based on chartType
        if (chartType === 'candlestick') {
          const candleSeries = chart.addCandlestickSeries({
            upColor: '#22c55e',
            downColor: '#ef4444',
            borderVisible: false,
            wickUpColor: '#22c55e',
            wickDownColor: '#ef4444',
          });
          
          candleSeries.setData(formattedData);
          seriesRef.current = candleSeries;
        } else {
          const lineSeries = chart.addLineSeries({
            color: '#3b82f6',
            lineWidth: 2,
          });
          
          lineSeries.setData(formattedData.map(d => ({
            time: d.time,
            value: d.close,
          })));
          seriesRef.current = lineSeries;
        }
        
        // Fit chart to show all data
        chart.timeScale().fitContent();
        
        // Handle window resize if autosize is enabled
        const handleResize = () => {
          if (chartRef.current && chartContainerRef.current) {
            chartRef.current.applyOptions({ 
              width: chartContainerRef.current.clientWidth 
            });
            chartRef.current.timeScale().fitContent();
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
      } catch (error) {
        console.error('Error initializing chart:', error);
      }
    };
    
    initChart();
  }, [candleData, chartType, theme, height]);
  
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