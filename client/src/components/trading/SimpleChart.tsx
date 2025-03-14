import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, Activity, Clock } from 'lucide-react';

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
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || isLoading || !data.length) return;

    const container = chartRef.current;
    container.innerHTML = '';

    // Load library dynamically to avoid TypeScript issues
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/lightweight-charts/dist/lightweight-charts.standalone.production.js';
    script.async = true;
    
    script.onload = () => {
      // @ts-ignore - we're using the global LightweightCharts object
      const { createChart } = window.LightweightCharts;
      
      const chart = createChart(container, {
        width: container.clientWidth,
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
      
      // Create series based on chart type
      if (chartType === 'line') {
        series = chart.addLineSeries({
          color: 'rgba(66, 153, 225, 1)',
          lineWidth: 2,
        });
      } else {
        series = chart.addAreaSeries({
          topColor: 'rgba(66, 153, 225, 0.56)',
          bottomColor: 'rgba(66, 153, 225, 0.04)',
          lineColor: 'rgba(66, 153, 225, 1)',
          lineWidth: 2,
        });
      }
      
      const lineData = data.map(candle => ({
        time: candle.time,
        value: candle.close,
      }));
      
      series.setData(lineData);
      chart.timeScale().fitContent();
      
      // Handle window resize
      const handleResize = () => {
        chart.applyOptions({
          width: container.clientWidth,
        });
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();
      };
    };
    
    document.head.appendChild(script);
    
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [data, chartType, isLoading]);
  
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
            {isLoading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Skeleton className="h-full w-full" />
              </div>
            ) : (
              <div 
                ref={chartRef} 
                className="h-full w-full"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}