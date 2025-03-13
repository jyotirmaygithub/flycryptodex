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