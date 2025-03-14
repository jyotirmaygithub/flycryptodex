import { CandlestickData, OrderBookEntry, OrderBook } from "@shared/schema";

/**
 * Generates mock candlestick data
 * @param timeframe The timeframe for the candles
 * @param count Number of candles to generate
 * @returns Array of candlestick data
 */
export function generateMockCandlestickData(timeframe: string, count = 100): CandlestickData[] {
  try {
    // Validate inputs and provide defaults for invalid values
    const validTimeframe = ['1m', '5m', '15m', '1h', '4h', '1d'].includes(timeframe) ? timeframe : '1h';
    const validCount = Math.max(1, Math.min(count || 100, 1000)); // Ensure count is between 1 and 1000
    const now = Date.now();
    const data: CandlestickData[] = [];
    
    // Calculate time interval based on timeframe
    let interval: number;
    switch (validTimeframe) {
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
        interval = 60 * 60 * 1000; // 1 hour as default
    }
    
    // Base price and volatility (ensure positive values)
    let basePrice = 1.0;
    const volatility = 0.02; // 2% volatility
    
    for (let i = 0; i < validCount; i++) {
      try {
        // Time for this candle (ensure it's a valid number)
        const time = now - (validCount - i) * interval;
        
        // Random price movement (more realistic with Brownian motion)
        const changePercent = (Math.random() - 0.5) * volatility;
        const change = basePrice * changePercent;
        
        // Calculate candle values with safety checks
        const open = Math.max(0.01, basePrice);
        const close = Math.max(0.01, basePrice + change);
        
        // Update base price for next candle
        basePrice = close;
        
        // Random high and low with appropriate constraints
        // Ensure high is greater than both open and close
        const highOffset = Math.abs(Math.random() * Math.abs(change) * 0.5);
        const high = Math.max(open, close) + Math.max(0.00001, highOffset);
        
        // Ensure low is less than both open and close
        const lowOffset = Math.abs(Math.random() * Math.abs(change) * 0.5);
        const low = Math.min(open, close) - Math.max(0.00001, lowOffset);
        
        // Random volume (higher for larger price movements)
        const volume = Math.max(1, 50 + Math.random() * 150 * (1 + Math.abs(changePercent) * 10));
        
        // Validate that all values are numeric and finite before adding
        if (
          Number.isFinite(time) && 
          Number.isFinite(open) && 
          Number.isFinite(high) && 
          Number.isFinite(low) && 
          Number.isFinite(close) && 
          Number.isFinite(volume) &&
          high >= Math.max(open, close) &&
          low <= Math.min(open, close)
        ) {
          data.push({
            time,
            open,
            high,
            low,
            close,
            volume,
          });
        } else {
          // If validation fails, add a safe default candle
          data.push({
            time: Number.isFinite(time) ? time : now - i * interval,
            open: 1.0,
            high: 1.05,
            low: 0.95,
            close: 1.02,
            volume: 100,
          });
        }
      } catch (error) {
        console.error(`Error generating candle at index ${i}:`, error);
        // Add a safe default candle
        data.push({
          time: now - i * interval,
          open: 1.0,
          high: 1.05,
          low: 0.95,
          close: 1.02,
          volume: 100,
        });
      }
    }
    
    // Ensure we return at least one candle even if generation failed
    if (data.length === 0) {
      data.push({
        time: now,
        open: 1.0,
        high: 1.05,
        low: 0.95,
        close: 1.02,
        volume: 100
      });
    }
    
    return data;
  } catch (error) {
    console.error("Error generating mock candlestick data:", error);
    // Return a minimal fallback dataset if anything goes wrong
    return [
      {
        time: Date.now(),
        open: 1.0,
        high: 1.05,
        low: 0.95,
        close: 1.02,
        volume: 100
      }
    ];
  }
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
  try {
    // Validate inputs
    const validPrice = Number.isFinite(currentPrice) && currentPrice > 0 ? currentPrice : 1.0;
    const validDepth = Number.isFinite(depth) && depth > 0 ? Math.min(depth, 50) : 10;
    
    const asks: OrderBookEntry[] = [];
    const bids: OrderBookEntry[] = [];
    
    // Spread percentage
    const spreadPercent = 0.0005; // 0.05%
    
    // Ask prices (higher than current price)
    const lowestAsk = validPrice * (1 + spreadPercent);
    let askTotal = 0;
    
    for (let i = 0; i < validDepth; i++) {
      try {
        const priceIncrement = 1 + i * 0.001;
        const price = lowestAsk * priceIncrement;
        
        // Ensure price is valid
        if (!Number.isFinite(price) || price <= 0) {
          continue;
        }
        
        const size = Math.max(0.1, Math.random() * 20 + 5);
        askTotal += size;
        
        asks.push({
          price,
          size,
          total: parseFloat(askTotal.toFixed(2))
        });
      } catch (error) {
        console.error(`Error generating ask at index ${i}:`, error);
      }
    }
    
    // Sort asks by price ascending
    asks.sort((a, b) => a.price - b.price);
    
    // Bid prices (lower than current price)
    const highestBid = validPrice * (1 - spreadPercent);
    let bidTotal = 0;
    
    for (let i = 0; i < validDepth; i++) {
      try {
        const priceDecrement = 1 - i * 0.001;
        const price = highestBid * priceDecrement;
        
        // Ensure price is valid
        if (!Number.isFinite(price) || price <= 0) {
          continue;
        }
        
        const size = Math.max(0.1, Math.random() * 20 + 5);
        bidTotal += size;
        
        bids.push({
          price,
          size,
          total: parseFloat(bidTotal.toFixed(2))
        });
      } catch (error) {
        console.error(`Error generating bid at index ${i}:`, error);
      }
    }
    
    // Sort bids by price descending
    bids.sort((a, b) => b.price - a.price);
    
    // Ensure we have at least one ask and one bid
    if (asks.length === 0) {
      asks.push({
        price: validPrice * 1.001,
        size: 10,
        total: 10
      });
    }
    
    if (bids.length === 0) {
      bids.push({
        price: validPrice * 0.999,
        size: 10,
        total: 10
      });
    }
    
    return { asks, bids };
  } catch (error) {
    console.error("Error generating mock order book:", error);
    
    // Return a minimal valid order book as fallback
    return {
      asks: [
        { price: 1.001, size: 10, total: 10 },
        { price: 1.002, size: 15, total: 25 }
      ],
      bids: [
        { price: 0.999, size: 10, total: 10 },
        { price: 0.998, size: 15, total: 25 }
      ]
    };
  }
}