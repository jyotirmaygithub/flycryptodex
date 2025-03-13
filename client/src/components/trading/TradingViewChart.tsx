import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { Card } from '@/components/ui/card';

interface TradingViewChartProps {
  data: any[];
  height?: number;
}

export default function TradingViewChart({ data = [], height = 400 }: TradingViewChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const [isChartReady, setIsChartReady] = useState(false);

  useEffect(() => {
    if (chartContainerRef.current && !chartRef.current) {
      try {
        // Create the chart instance
        const chart = createChart(chartContainerRef.current, {
          layout: {
            background: { type: ColorType.Solid, color: 'transparent' },
            textColor: '#d1d5db',
          },
          grid: {
            vertLines: { color: 'rgba(42, 46, 57, 0.5)' },
            horzLines: { color: 'rgba(42, 46, 57, 0.5)' },
          },
          width: chartContainerRef.current.clientWidth,
          height: height,
          timeScale: {
            timeVisible: true,
            secondsVisible: false,
          },
        });

        // Store the chart reference
        chartRef.current = chart;

        // Create series for candlestick data
        const candlestickSeries = chart.addCandlestickSeries({
          upColor: '#26a69a',
          downColor: '#ef5350',
          borderVisible: false,
          wickUpColor: '#26a69a',
          wickDownColor: '#ef5350',
        });

        // Set the data if available
        if (data && data.length > 0) {
          candlestickSeries.setData(data);
        }

        // Make chart responsive
        const handleResize = () => {
          if (chartRef.current && chartContainerRef.current) {
            chartRef.current.applyOptions({ 
              width: chartContainerRef.current.clientWidth 
            });
          }
        };

        window.addEventListener('resize', handleResize);
        setIsChartReady(true);

        // Cleanup
        return () => {
          window.removeEventListener('resize', handleResize);
          if (chartRef.current) {
            chartRef.current.remove();
            chartRef.current = null;
          }
        };
      } catch (error) {
        console.error("Error initializing chart:", error);
      }
    }
  }, [height]);

  // Update data when it changes
  useEffect(() => {
    if (chartRef.current && data && data.length > 0) {
      try {
        const series = chartRef.current.series()[0];
        if (series) {
          series.setData(data);
        }
      } catch (error) {
        console.error("Error updating chart data:", error);
      }
    }
  }, [data]);

  return (
    <Card className="bg-primary-800 border-primary-700 p-0 overflow-hidden">
      <div 
        ref={chartContainerRef} 
        className="w-full" 
        style={{ height: `${height}px` }}
      >
        {!isChartReady && (
          <div className="flex items-center justify-center h-full w-full bg-primary-800">
            <p className="text-neutral-400">Loading chart...</p>
          </div>
        )}
      </div>
    </Card>
  );
}