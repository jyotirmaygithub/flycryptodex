import { CandlestickData, OrderBookEntry, OrderBook } from "@shared/schema";

/**
 * Generates mock candlestick data
 * @param timeframe The timeframe for the candles
 * @param count Number of candles to generate
 * @returns Array of candlestick data
 */
export function generateMockCandlestickData(timeframe: string, count = 100): CandlestickData[] {
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