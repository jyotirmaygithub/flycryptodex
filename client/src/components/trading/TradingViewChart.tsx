import React, { useRef, useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts';

interface CandlestickData {
  time: string | number;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface TradingViewChartProps {
  data: CandlestickData[];
  pair: string;
  height?: number;
  width?: string;
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({ 
  data = [], 
  pair = 'BTC/USD',
  height = 500,
  width = '100%'
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<IChartApi | null>(null);
  const [series, setSeries] = useState<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (chartContainerRef.current && !chart) {
      try {
        const newChart = createChart(chartContainerRef.current, {
          width: chartContainerRef.current.clientWidth,
          height: height,
          layout: {
            background: { type: 'solid', color: '#1A1A1A' },
            textColor: '#DDD',
          },
          grid: {
            vertLines: { color: '#2B2B43' },
            horzLines: { color: '#2B2B43' },
          },
          crosshair: {
            mode: 0,
          },
          timeScale: {
            timeVisible: true,
            secondsVisible: false,
          },
        });

        const newSeries = newChart.addCandlestickSeries({
          upColor: '#26a69a',
          downColor: '#ef5350',
          borderVisible: false,
          wickUpColor: '#26a69a',
          wickDownColor: '#ef5350',
        });

        setChart(newChart);
        setSeries(newSeries);

        // Handle window resize
        const handleResize = () => {
          if (chartContainerRef.current && newChart) {
            newChart.applyOptions({ 
              width: chartContainerRef.current.clientWidth 
            });
          }
        };

        window.addEventListener('resize', handleResize);

        return () => {
          window.removeEventListener('resize', handleResize);
          if (newChart) {
            newChart.remove();
          }
        };
      } catch (error) {
        console.error("Error initializing chart:", error);
      }
    }
  }, []);

  // Update chart data when data changes
  useEffect(() => {
    if (series && data && data.length > 0) {
      try {
        series.setData(data);
      } catch (error) {
        console.error("Error updating chart data:", error);
      }
    }
  }, [series, data]);

  return (
    <Card className="h-full">
      <CardContent className="p-0">
        <div className="chart-header p-3 border-b border-primary-700">
          <h3 className="text-lg font-medium">{pair}</h3>
        </div>
        <div
          ref={chartContainerRef}
          style={{ width, height: `${height}px` }}
        />
      </CardContent>
    </Card>
  );
};

export default TradingViewChart;
import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi } from 'lightweight-charts';
import { CandlestickData } from '@shared/schema';

interface TradingViewChartProps {
  candlesticks: CandlestickData[];
  height?: number;
  width?: string;
}

const TradingViewChart: React.FC<TradingViewChartProps> = ({ 
  candlesticks, 
  height = 400, 
  width = '100%' 
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    if (chartContainerRef.current && !chartRef.current) {
      try {
        // Initialize chart
        const chart = createChart(chartContainerRef.current, {
          layout: {
            background: { type: ColorType.Solid, color: 'transparent' },
            textColor: '#d1d5db',
          },
          width: chartContainerRef.current.clientWidth,
          height: height,
          grid: {
            vertLines: {
              color: 'rgba(42, 46, 57, 0.6)',
            },
            horzLines: {
              color: 'rgba(42, 46, 57, 0.6)',
            },
          },
          timeScale: {
            timeVisible: true,
            secondsVisible: false,
          },
        });

        // Create the candlestick series
        const candlestickSeries = chart.addCandlestickSeries({
          upColor: '#22c55e',
          downColor: '#ef4444',
          borderVisible: false,
          wickUpColor: '#22c55e',
          wickDownColor: '#ef4444',
        });

        // Store references
        chartRef.current = chart;
        seriesRef.current = candlestickSeries;

        // Format the candlestick data to match the expected format
        const formattedData = candlesticks.map(candle => ({
          time: candle.time / 1000, // Convert milliseconds to seconds for the chart
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
        }));

        // Set the data
        candlestickSeries.setData(formattedData);

        // Fit content if there's data
        if (formattedData.length > 0) {
          chart.timeScale().fitContent();
        }

        // Handle resizing
        const handleResize = () => {
          if (chartContainerRef.current && chartRef.current) {
            chartRef.current.applyOptions({ 
              width: chartContainerRef.current.clientWidth 
            });
          }
        };

        window.addEventListener('resize', handleResize);

        return () => {
          window.removeEventListener('resize', handleResize);
          chart.remove();
          chartRef.current = null;
          seriesRef.current = null;
        };
      } catch (error) {
        console.error("Error initializing chart:", error);
      }
    }
  }, [height]);

  // Update data when candlesticks change
  useEffect(() => {
    if (seriesRef.current && candlesticks.length > 0) {
      try {
        const formattedData = candlesticks.map(candle => ({
          time: candle.time / 1000, // Convert milliseconds to seconds for the chart
          open: candle.open,
          high: candle.high,
          low: candle.low,
          close: candle.close,
        }));

        seriesRef.current.setData(formattedData);
        
        if (chartRef.current) {
          chartRef.current.timeScale().fitContent();
        }
      } catch (error) {
        console.error("Error updating chart data:", error);
      }
    }
  }, [candlesticks]);

  return (
    <div 
      ref={chartContainerRef} 
      style={{ width, height: `${height}px` }}
      className="relative overflow-hidden"
    />
  );
};

export default TradingViewChart;
