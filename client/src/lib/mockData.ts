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
import { CandlestickData, OrderBook, OrderBookEntry } from "@shared/schema";

/**
 * Generates mock candlestick data
 * @param timeframe The timeframe for the candles
 * @param count Number of candles to generate
 * @returns Array of candlestick data
 */
export function generateMockCandlestickData(timeframe: string, count: number): CandlestickData[] {
  const now = Date.now();
  const data: CandlestickData[] = [];
  
  // Calculate time interval based on timeframe
  let interval: number;
  switch (timeframe) {
    case '1m':
      interval = 60 * 1000; // 1 minute
      break;
    case '5m':
      interval = 5 * 60 * 1000; // 5 minutes
      break;
    case '15m':
      interval = 15 * 60 * 1000; // 15 minutes
      break;
    case '1h':
      interval = 60 * 60 * 1000; // 1 hour
      break;
    case '4h':
      interval = 4 * 60 * 60 * 1000; // 4 hours
      break;
    case '1d':
      interval = 24 * 60 * 60 * 1000; // 1 day
      break;
    default:
      interval = 60 * 60 * 1000; // 1 hour
  }
  
  // Base price and volatility
  let basePrice = 1.0;
  const volatility = 0.02; // 2% volatility
  
  for (let i = 0; i < count; i++) {
    // Time for this candle
    const time = now - (count - i) * interval;
    
    // Random price movement (more realistic with Brownian motion)
    const changePercent = (Math.random() - 0.5) * volatility;
    const change = basePrice * changePercent;
    
    // Calculate candle values
    let open = basePrice;
    let close = basePrice + change;
    
    // Update base price for next candle
    basePrice = close;
    
    // Random high and low with appropriate constraints
    const high = Math.max(open, close) + Math.random() * Math.abs(change) * 0.5;
    const low = Math.min(open, close) - Math.random() * Math.abs(change) * 0.5;
    
    // Random volume (higher for larger price movements)
    const volume = 50 + Math.random() * 150 * (1 + Math.abs(changePercent) * 10);
    
    data.push({
      time,
      open,
      high,
      low,
      close,
      volume
    });
  }
  
  return data;
}

/**
 * Generates a mock order book
 * @param currentPrice The current price to center the order book around
 * @param depth Number of levels to generate on each side
 * @returns Order book with asks and bids
 */
export function generateMockOrderBook(currentPrice: number, depth: number = 10): OrderBook {
  const asks: OrderBookEntry[] = [];
  const bids: OrderBookEntry[] = [];
  
  // Spread percentage
  const spreadPercent = 0.0005; // 0.05%
  
  // Ask prices (higher than current price)
  const lowestAsk = currentPrice * (1 + spreadPercent);
  let askTotal = 0;
  
  for (let i = 0; i < depth; i++) {
    const price = lowestAsk * (1 + i * 0.001);
    const size = Math.random() * 20 + 5;
    askTotal += size;
    
    asks.push({
      price,
      size,
      total: parseFloat(askTotal.toFixed(2))
    });
  }
  
  // Sort asks by price ascending
  asks.sort((a, b) => a.price - b.price);
  
  // Bid prices (lower than current price)
  const highestBid = currentPrice * (1 - spreadPercent);
  let bidTotal = 0;
  
  for (let i = 0; i < depth; i++) {
    const price = highestBid * (1 - i * 0.001);
    const size = Math.random() * 20 + 5;
    bidTotal += size;
    
    bids.push({
      price,
      size,
      total: parseFloat(bidTotal.toFixed(2))
    });
  }
  
  // Sort bids by price descending
  bids.sort((a, b) => b.price - a.price);
  
  return { asks, bids };
}
