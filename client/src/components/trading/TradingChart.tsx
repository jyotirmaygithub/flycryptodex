import { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Settings, BarChart2, TrendingUp, Activity } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TradingChartProps {
  candlesticks: any[];
  isLoading: boolean;
  chartType: 'candlestick' | 'line' | 'area';
  timeFrame: string;
  onChangeChartType: (type: 'candlestick' | 'line' | 'area') => void;
  onChangeTimeFrame: (timeFrame: string) => void;
}

export default function TradingChart({ 
  candlesticks, 
  isLoading, 
  chartType, 
  timeFrame, 
  onChangeChartType, 
  onChangeTimeFrame 
}: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<any>(null);
  const [chartCreated, setChartCreated] = useState(false);

  // Create chart on mount or when chart type changes
  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Cleanup previous chart instance
    if (chartInstanceRef.current) {
      chartInstanceRef.current.remove();
      chartInstanceRef.current = null;
    }

    // Create chart instance
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: 'rgba(45, 55, 72, 1)' },
        textColor: 'rgba(255, 255, 255, 0.7)',
      },
      grid: {
        vertLines: { color: 'rgba(74, 85, 104, 0.3)' },
        horzLines: { color: 'rgba(74, 85, 104, 0.3)' },
      },
      timeScale: {
        borderColor: 'rgba(74, 85, 104, 0.5)',
        timeVisible: true,
      },
      rightPriceScale: {
        borderColor: 'rgba(74, 85, 104, 0.5)',
      },
    });

    let series;
    
    // Create appropriate series based on chart type
    switch (chartType) {
      case 'candlestick':
        series = chart.addCandlestickSeries({
          upColor: 'rgba(72, 187, 120, 1)',
          downColor: 'rgba(245, 101, 101, 1)',
          borderUpColor: 'rgba(72, 187, 120, 1)',
          borderDownColor: 'rgba(245, 101, 101, 1)',
          wickUpColor: 'rgba(72, 187, 120, 1)',
          wickDownColor: 'rgba(245, 101, 101, 1)',
        });
        
        if (candlesticks.length > 0) {
          series.setData(candlesticks);
        }
        break;
        
      case 'line':
        series = chart.addLineSeries({
          color: 'rgba(66, 153, 225, 1)',
          lineWidth: 2,
        });
        
        if (candlesticks.length > 0) {
          series.setData(
            candlesticks.map(candle => ({
              time: candle.time,
              value: candle.close,
            }))
          );
        }
        break;
        
      case 'area':
        series = chart.addAreaSeries({
          topColor: 'rgba(66, 153, 225, 0.56)',
          bottomColor: 'rgba(66, 153, 225, 0.04)',
          lineColor: 'rgba(66, 153, 225, 1)',
          lineWidth: 2,
        });
        
        if (candlesticks.length > 0) {
          series.setData(
            candlesticks.map(candle => ({
              time: candle.time,
              value: candle.close,
            }))
          );
        }
        break;
    }

    // Fit chart content
    chart.timeScale().fitContent();
    
    // Store chart instance
    chartInstanceRef.current = chart;
    setChartCreated(true);

    // Handle window resize
    const handleResize = () => {
      if (chartContainerRef.current && chartInstanceRef.current) {
        chartInstanceRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [chartType, candlesticks]);

  // Render chart controls and chart
  return (
    <div className="flex-1 p-4 min-h-[400px] relative">
      <div className="absolute inset-0 p-4">
        <div className="h-full rounded-lg bg-primary-800 border border-primary-700 p-4 flex flex-col">
          {/* Chart Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-3">
              <Button
                size="sm"
                variant={chartType === 'candlestick' ? 'default' : 'ghost'}
                className={chartType === 'candlestick' ? 'bg-accent-500 text-white' : 'text-neutral-300 hover:text-white'}
                onClick={() => onChangeChartType('candlestick')}
              >
                <BarChart2 className="h-4 w-4 mr-1" />
                Candlestick
              </Button>
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
                  {tf}
                </Button>
              ))}
            </div>
            
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost" className="text-neutral-400 hover:text-white">
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    Add Indicator
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Drawing Tools
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Chart Settings
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          {/* Chart Content */}
          <div className="flex-1 relative">
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Skeleton className="h-full w-full" />
              </div>
            ) : (
              <div 
                ref={chartContainerRef} 
                className="h-full w-full"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
