import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from './useWebSocket';
import { CandlestickData, MarketData, OrderBook } from '@shared/schema';
import { useQuery } from '@tanstack/react-query';
import { formatCandlestickData } from '@/lib/mockData';

type TimeFrame = '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
type ChartType = 'candlestick' | 'line' | 'area';

export function useMarketData(pair?: string) {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('5m');
  const [chartType, setChartType] = useState<ChartType>('candlestick');
  const { connected, marketData, error: wsError, subscribeToPair } = useWebSocket(pair);

  // Fetch initial market data using REST API
  const { data: initialMarketData, error: fetchError, isLoading } = useQuery({
    queryKey: ['/api/market', pair],
    queryFn: async () => {
      if (!pair) return null;
      const response = await fetch(`/api/market/${pair}`);
      if (!response.ok) {
        throw new Error('Failed to fetch market data');
      }
      return response.json();
    },
    enabled: !!pair && !connected, // Only fetch if not connected via WebSocket
  });

  // Combine WebSocket data with REST API data
  const combinedMarketData = marketData || initialMarketData || null;
  const formattedCandlesticks = combinedMarketData ? formatCandlestickData(combinedMarketData.candlesticks) : [];
  
  const error = wsError || (fetchError ? (fetchError as Error).message : null);

  // Calculate stats for display
  const stats = combinedMarketData ? {
    price: combinedMarketData.price.toFixed(4),
    change24h: combinedMarketData.change24h.toFixed(2),
    isPositive: combinedMarketData.change24h >= 0
  } : null;

  // Format price and change for display
  const formattedPrice = stats?.price || '-';
  const formattedChange = stats ? `${stats.isPositive ? '+' : ''}${stats.change24h}%` : '-';

  // Change timeframe
  const changeTimeFrame = useCallback((newTimeFrame: TimeFrame) => {
    setTimeFrame(newTimeFrame);
  }, []);

  // Change chart type
  const changeChartType = useCallback((newChartType: ChartType) => {
    setChartType(newChartType);
  }, []);

  // Subscribe to a different pair
  const changePair = useCallback((newPair: string) => {
    subscribeToPair(newPair);
  }, [subscribeToPair]);

  return {
    isLoading,
    connected,
    error,
    marketData: combinedMarketData,
    candlesticks: formattedCandlesticks,
    orderBook: combinedMarketData?.orderBook || { asks: [], bids: [] },
    timeFrame,
    chartType,
    stats: {
      price: formattedPrice,
      change: formattedChange,
      isPositive: stats?.isPositive ?? true
    },
    changeTimeFrame,
    changeChartType,
    changePair
  };
}
