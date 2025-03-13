import React, { useEffect, useRef, useState } from 'react';
import { CandlestickData } from '@shared/schema';
import { Card } from '@/components/ui/card';

interface TradingViewChartProps {
  candleData: CandlestickData[];
  height?: number;
}

export default function TradingViewChart({ candleData, height = 400 }: TradingViewChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [isChartReady, setIsChartReady] = useState(false);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    // We'll dynamically import the library to ensure it loads properly
    let chart: any;
    let candleSeries: any;

    async function initializeChart() {
      try {
        // Try to import the library
        const LightweightCharts = await import('lightweight-charts');

        if (!chartContainerRef.current) return;

        // Clear previous chart if exists
        chartContainerRef.current.innerHTML = '';

        // Create new chart
        chart = LightweightCharts.createChart(chartContainerRef.current, {
          width: chartContainerRef.current.clientWidth,
          height: height,
          layout: {
            background: { color: 'transparent' },
            textColor: '#d1d5db',
          },
          grid: {
            vertLines: { color: 'rgba(42, 46, 57, 0.5)' },
            horzLines: { color: 'rgba(42, 46, 57, 0.5)' },
          },
          timeScale: {
            borderColor: 'rgba(42, 46, 57, 0.8)',
          },
          crosshair: {
            vertLine: {
              color: '#5d6b98',
              width: 1,
              style: 0,
              labelBackgroundColor: '#5d6b98',
            },
            horzLine: {
              color: '#5d6b98',
              width: 1,
              style: 0,
              labelBackgroundColor: '#5d6b98',
            },
          },
        });

        // Add candlestick series
        candleSeries = chart.addCandlestickSeries({
          upColor: '#4ade80',
          downColor: '#f43f5e',
          borderVisible: false,
          wickUpColor: '#4ade80',
          wickDownColor: '#f43f5e',
        });

        // Set data
        candleSeries.setData(candleData);

        // Handle resizing
        const handleResize = () => {
          if (chart && chartContainerRef.current) {
            chart.applyOptions({ 
              width: chartContainerRef.current.clientWidth,
              height: height 
            });
          }
        };

        window.addEventListener('resize', handleResize);

        // Store references
        chartRef.current = chart;
        setIsChartReady(true);

        return () => {
          window.removeEventListener('resize', handleResize);
          if (chart) {
            chart.remove();
          }
        };
      } catch (error) {
        console.error("Error initializing chart:", error);
        // Display fallback chart
        setIsChartReady(false);
      }
    }

    initializeChart();

    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [height]);

  // Update chart data when it changes
  useEffect(() => {
    if (isChartReady && chartRef.current && candleData.length > 0) {
      try {
        const series = chartRef.current.series()[0];
        if (series) {
          series.setData(candleData);

          // Fit content to visible range
          chartRef.current.timeScale().fitContent();
        }
      } catch (error) {
        console.error("Error updating chart data:", error);
      }
    }
  }, [candleData, isChartReady]);

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