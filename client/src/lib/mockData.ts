import { CandlestickData, OrderBookEntry } from "@shared/schema";

// Generate mock candlestick data for different timeframes
export function generateMockCandlestickData(timeframe: string, count = 100): CandlestickData[] {
  const now = Date.now();
  const candlesticks: CandlestickData[] = [];
  
  let timeframeMs: number;
  switch (timeframe) {
    case '1m': timeframeMs = 60 * 1000; break;
    case '5m': timeframeMs = 5 * 60 * 1000; break;
    case '15m': timeframeMs = 15 * 60 * 1000; break;
    case '1h': timeframeMs = 60 * 60 * 1000; break;
    case '4h': timeframeMs = 4 * 60 * 60 * 1000; break;
    case '1d': timeframeMs = 24 * 60 * 60 * 1000; break;
    default: timeframeMs = 5 * 60 * 1000; // Default to 5m
  }
  
  let price = 1.07 + Math.random() * 0.01; // Starting price around 1.07-1.08
  
  for (let i = 0; i < count; i++) {
    const time = now - (count - i) * timeframeMs;
    
    // Random walk
    const changePercent = (Math.random() - 0.5) * 0.002; // -0.1% to +0.1%
    price = price * (1 + changePercent);
    
    const open = price;
    // For more realistic candles, make high/low further from open/close
    const high = open + open * (Math.random() * 0.001);
    const low = open - open * (Math.random() * 0.001);
    const close = open + open * (Math.random() - 0.5) * 0.001;
    
    candlesticks.push({
      time,
      open,
      high,
      low,
      close,
      volume: Math.random() * 100 + 50
    });
  }
  
  return candlesticks;
}

// Convert candlestick data to the format expected by lightweight-charts
export function formatCandlestickData(data: CandlestickData[]) {
  return data.map(candle => ({
    time: candle.time / 1000, // Convert to seconds for lightweight-charts
    open: candle.open,
    high: candle.high,
    low: candle.low,
    close: candle.close,
    volume: candle.volume
  }));
}

// Simulate order book data
export function generateMockOrderBook(
  currentPrice: number,
  depth: number = 10
): { asks: OrderBookEntry[], bids: OrderBookEntry[] } {
  const asks: OrderBookEntry[] = [];
  const bids: OrderBookEntry[] = [];
  
  // Generate asks (sell orders) above current price
  let askTotal = 0;
  for (let i = 0; i < depth; i++) {
    const price = currentPrice + (i + 1) * 0.0001;
    const size = Math.random() * 0.7 + 0.2; // Random size between 0.2 and 0.9
    askTotal += size;
    
    asks.push({
      price: parseFloat(price.toFixed(4)),
      size: parseFloat(size.toFixed(2)),
      total: parseFloat(askTotal.toFixed(2))
    });
  }
  
  // Generate bids (buy orders) below current price
  let bidTotal = 0;
  for (let i = 0; i < depth; i++) {
    const price = currentPrice - (i + 1) * 0.0001;
    const size = Math.random() * 0.7 + 0.2; // Random size between 0.2 and 0.9
    bidTotal += size;
    
    bids.push({
      price: parseFloat(price.toFixed(4)),
      size: parseFloat(size.toFixed(2)),
      total: parseFloat(bidTotal.toFixed(2))
    });
  }
  
  return { asks, bids };
}
