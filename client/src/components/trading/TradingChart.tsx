import { useEffect, useRef, useState } from 'react';
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
  const [chartReady, setChartReady] = useState(false);

  useEffect(() => {
    if (!chartContainerRef.current || isLoading || candlesticks.length === 0) return;

    // Clean up any previous chart instance
    const container = chartContainerRef.current;
    container.innerHTML = '';

    // Dynamically import the chart library to avoid TypeScript errors
    import('lightweight-charts').then(({ createChart }) => {
      // Create chart
      const chart = createChart(container, {
        width: container.clientWidth,
        height: 400,
        layout: {
          background: { color: 'rgba(30, 41, 59, 1)' }, // Darker background
          textColor: 'rgba(255, 255, 255, 0.8)', // Brighter text
        },
        grid: {
          vertLines: { color: 'rgba(51, 65, 85, 0.3)' }, // Slightly brighter grid
          horzLines: { color: 'rgba(51, 65, 85, 0.3)' },
        },
        timeScale: {
          borderColor: 'rgba(51, 65, 85, 0.6)', // Brighter border
          timeVisible: true,
        },
        rightPriceScale: {
          borderColor: 'rgba(51, 65, 85, 0.6)',
        },
      });
      
      // Create series based on chart type
      let series;
      
      if (chartType === 'candlestick') {
        series = chart.addSeries('candlestick', {
          upColor: 'rgba(0, 199, 180, 1)', // FlyKrypto teal for up candles
          downColor: 'rgba(255, 98, 98, 1)', // Bright red for down candles
          borderUpColor: 'rgba(0, 199, 180, 1)',
          borderDownColor: 'rgba(255, 98, 98, 1)',
          wickUpColor: 'rgba(0, 199, 180, 1)',
          wickDownColor: 'rgba(255, 98, 98, 1)',
        });
        
        if (candlesticks.length > 0) {
          series.setData(candlesticks);
        }
      } else if (chartType === 'line') {
        series = chart.addSeries('line', {
          color: 'rgba(0, 199, 180, 1)', // FlyKrypto teal
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
      } else {
        series = chart.addSeries('area', {
          topColor: 'rgba(0, 199, 180, 0.4)', // FlyKrypto teal with opacity
          bottomColor: 'rgba(0, 199, 180, 0.05)', // FlyKrypto teal with low opacity
          lineColor: 'rgba(0, 199, 180, 1)', // FlyKrypto teal
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
      }

      // Fit chart to content
      chart.timeScale().fitContent();
      
      // Handle window resize
      const handleResize = () => {
        if (container) {
          chart.applyOptions({
            width: container.clientWidth,
          });
        }
      };

      window.addEventListener('resize', handleResize);
      setChartReady(true);
      
      // Clean up on component unmount or when dependencies change
      return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();
      };
    }).catch(err => {
      console.error('Failed to load chart library:', err);
    });
    
  }, [candlesticks, chartType, isLoading]);

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
                className={chartType === 'candlestick' ? 'bg-[#00C7B4] text-white' : 'text-neutral-300 hover:text-white'}
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
