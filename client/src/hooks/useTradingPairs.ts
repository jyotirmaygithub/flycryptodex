import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TradingPair } from '@shared/schema';
import { useWebSocket } from './useWebSocket';

export function useTradingPairs(categoryId?: number) {
  const [searchQuery, setSearchQuery] = useState('');
  const [pairs, setPairs] = useState<TradingPair[]>([]);
  
  // Get trading pairs from WebSocket
  const { tradingPairs: wsPairs } = useWebSocket();
  
  // Fetch trading pairs from REST API if needed
  const { data: apiPairs, isLoading } = useQuery({
    queryKey: ['/api/pairs', categoryId],
    enabled: wsPairs.length === 0, // Only fetch if WebSocket data is not available
  });
  
  // Combine WebSocket data with REST API data
  useEffect(() => {
    if (wsPairs.length > 0) {
      setPairs(wsPairs);
    } else if (apiPairs) {
      setPairs(apiPairs);
    }
  }, [wsPairs, apiPairs]);
  
  // Filter pairs by category if categoryId is provided
  const filteredByCategory = categoryId 
    ? pairs.filter(pair => pair.categoryId === categoryId)
    : pairs;
  
  // Filter pairs by search query
  const filteredPairs = searchQuery
    ? filteredByCategory.filter(pair => 
        pair.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredByCategory;
  
  return {
    pairs: filteredPairs,
    isLoading,
    searchQuery,
    setSearchQuery
  };
}
