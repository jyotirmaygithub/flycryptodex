import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { z } from "zod";
import { insertOrderSchema, insertUserSchema, insertDemoTradeSchema } from "@shared/schema";

const clients = new Map<string, WebSocket>();
let marketUpdateInterval: NodeJS.Timeout;
let demoTradeMonitoringInterval: NodeJS.Timeout;

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Initialize WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws, req) => {
    const id = Math.random().toString(36).substring(2, 10);
    clients.set(id, ws);
    
    console.log(`Client connected: ${id}`);
    
    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'subscribe') {
          const { pair } = data;
          const marketData = await storage.getMarketData(pair);
          if (marketData) {
            ws.send(JSON.stringify({
              type: 'marketData',
              data: marketData
            }));
          }
        }
      } catch (error) {
        console.error('Error processing WebSocket message:', error);
      }
    });
    
    ws.on('close', () => {
      clients.delete(id);
      console.log(`Client disconnected: ${id}`);
    });
    
    // Send initial trading pairs data
    storage.getTradingPairs().then(pairs => {
      ws.send(JSON.stringify({
        type: 'tradingPairs',
        data: pairs
      }));
    });
  });

  // Start market data update simulation
  startMarketDataUpdates();
  
  // Start auto-liquidation monitoring for demo trades
  startDemoTradeMonitoring();

  // === API Routes ===
  
  // Blockchain routes
  app.get('/api/blockchains', async (req, res) => {
    try {
      const blockchains = await storage.getBlockchains();
      res.json(blockchains);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch blockchains' });
    }
  });

  // Trading category routes
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getTradingCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch trading categories' });
    }
  });

  // Trading pair routes
  app.get('/api/pairs', async (req, res) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      
      const pairs = categoryId 
        ? await storage.getTradingPairsByCategory(categoryId)
        : await storage.getTradingPairs();
        
      res.json(pairs);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch trading pairs' });
    }
  });

  app.get('/api/pairs/:name', async (req, res) => {
    try {
      const pair = await storage.getTradingPairByName(req.params.name);
      if (!pair) {
        return res.status(404).json({ message: 'Trading pair not found' });
      }
      res.json(pair);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch trading pair' });
    }
  });

  // AI recommendation routes
  app.get('/api/recommendations', async (req, res) => {
    try {
      const pairId = parseInt(req.query.pairId as string);
      
      if (!pairId) {
        return res.status(400).json({ message: 'Pair ID is required' });
      }
      
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const recommendations = await storage.getAiRecommendationsByPair(pairId, limit);
      
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch AI recommendations' });
    }
  });

  // Market data routes
  app.get('/api/market', async (req, res) => {
    try {
      const allMarketData = await storage.getAllMarketData();
      res.json(allMarketData);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch market data' });
    }
  });
  
  app.get('/api/market/:pair', async (req, res) => {
    try {
      const marketData = await storage.getMarketData(req.params.pair);
      
      if (!marketData) {
        return res.status(404).json({ message: 'Market data not found for this pair' });
      }
      
      res.json(marketData);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch market data' });
    }
  });

  // Forex news routes
  app.get('/api/news', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const news = await storage.getForexNews(limit);
      
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch forex news' });
    }
  });



  // Order routes
  app.post('/api/orders', async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid order data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create order' });
    }
  });

  app.get('/api/orders', async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      const pairId = req.query.pairId ? parseInt(req.query.pairId as string) : undefined;
      
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      
      const orders = pairId 
        ? await storage.getOrdersByPair(userId, pairId)
        : await storage.getOrders(userId);
        
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch orders' });
    }
  });

  // User routes
  app.post('/api/users', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid user data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create user' });
    }
  });

  app.get('/api/users/wallet/:address', async (req, res) => {
    try {
      const user = await storage.getUserByWalletAddress(req.params.address);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch user' });
    }
  });

  // Demo Trade routes
  app.post('/api/demo-trades', async (req, res) => {
    try {
      const tradeData = insertDemoTradeSchema.parse(req.body);
      
      // Validate additional requirements for crypto perpetual trades
      if (tradeData.type !== 'perpetual') {
        return res.status(400).json({ message: 'Only perpetual demo trades are supported' });
      }
      
      if (tradeData.leverage < 1 || tradeData.leverage > 100) {
        return res.status(400).json({ message: 'Leverage must be between 1 and 100' });
      }
      
      // Check user exists
      const user = await storage.getUser(tradeData.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Check pair exists and is in crypto category
      const pair = await storage.getTradingPair(tradeData.pairId);
      if (!pair) {
        return res.status(404).json({ message: 'Trading pair not found' });
      }
      
      const cryptoCategory = await storage.getTradingCategory(2); // Assuming Crypto is category ID 2
      if (pair.categoryId !== cryptoCategory.id) {
        return res.status(400).json({ message: 'Only crypto perpetual trading pairs are supported for demo trades' });
      }
      
      // Check user has enough balance
      if (user.balance < tradeData.size) {
        return res.status(400).json({ message: 'Insufficient balance' });
      }
      
      // Create the demo trade
      const trade = await storage.createDemoTrade({
        ...tradeData,
        status: 'open'
      });
      
      // Deduct the margin (size) from user balance
      await storage.updateUserBalance(user.id, user.balance - tradeData.size);
      
      res.status(201).json(trade);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid trade data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create demo trade' });
    }
  });

  app.get('/api/demo-trades', async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      const pairId = req.query.pairId ? parseInt(req.query.pairId as string) : undefined;
      
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      
      const trades = pairId 
        ? await storage.getDemoTradesByPair(userId, pairId)
        : await storage.getDemoTrades(userId);
        
      res.json(trades);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch demo trades' });
    }
  });
  
  app.get('/api/demo-trades/open', async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      
      const trades = await storage.getOpenDemoTrades(userId);
      res.json(trades);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch open demo trades' });
    }
  });
  
  app.post('/api/demo-trades/:id/close', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { exitPrice } = req.body;
      
      if (!exitPrice || typeof exitPrice !== 'number') {
        return res.status(400).json({ message: 'Exit price is required' });
      }
      
      const closedTrade = await storage.closeDemoTrade(id, exitPrice);
      
      if (!closedTrade) {
        return res.status(404).json({ message: 'Demo trade not found' });
      }
      
      res.json(closedTrade);
    } catch (error) {
      res.status(500).json({ message: 'Failed to close demo trade' });
    }
  });
  
  app.post('/api/demo-trades/:id/liquidate', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      const liquidatedTrade = await storage.liquidateDemoTrade(id);
      
      if (!liquidatedTrade) {
        return res.status(404).json({ message: 'Demo trade not found' });
      }
      
      res.json(liquidatedTrade);
    } catch (error) {
      res.status(500).json({ message: 'Failed to liquidate demo trade' });
    }
  });

  return httpServer;
}

// Function to simulate market data updates
function startMarketDataUpdates() {
  if (marketUpdateInterval) {
    clearInterval(marketUpdateInterval);
  }

  marketUpdateInterval = setInterval(async () => {
    try {
      // Get all trading pairs
      const pairs = await storage.getTradingPairs();
      
      for (const pair of pairs) {
        // Update price with small random movement
        const priceChange = pair.price * (Math.random() * 0.002 - 0.001);
        const newPrice = pair.price + priceChange;
        
        // Occasional larger change for volatility
        const newChange24h = Math.random() < 0.1 
          ? pair.change24h + (Math.random() * 0.1 - 0.05) 
          : pair.change24h + (Math.random() * 0.02 - 0.01);
          
        // Update pair price
        await storage.updateTradingPairPrice(pair.id, newPrice, newChange24h);
        
        // Get and update market data
        const marketData = await storage.getMarketData(pair.name);
        if (marketData) {
          // Update candlestick
          const lastCandle = marketData.candlesticks[marketData.candlesticks.length - 1];
          const now = Date.now();
          const fiveMinutes = 5 * 60 * 1000;
          
          let updatedCandlesticks = [...marketData.candlesticks];
          
          // If more than 5 minutes have passed, add a new candle
          if (now - lastCandle.time > fiveMinutes) {
            const newCandle = {
              time: now,
              open: lastCandle.close,
              high: Math.max(lastCandle.close, newPrice),
              low: Math.min(lastCandle.close, newPrice),
              close: newPrice,
              volume: Math.random() * 100 + 50
            };
            
            updatedCandlesticks.push(newCandle);
            
            // Keep only the last 100 candles
            if (updatedCandlesticks.length > 100) {
              updatedCandlesticks = updatedCandlesticks.slice(-100);
            }
          } else {
            // Update the current candle
            lastCandle.high = Math.max(lastCandle.high, newPrice);
            lastCandle.low = Math.min(lastCandle.low, newPrice);
            lastCandle.close = newPrice;
            lastCandle.volume += Math.random() * 5;
            
            updatedCandlesticks[updatedCandlesticks.length - 1] = lastCandle;
          }
          
          // Update order book with slight changes
          const orderBook = marketData.orderBook;
          
          // Adjust a few random ask prices
          for (let i = 0; i < 3; i++) {
            const idx = Math.floor(Math.random() * orderBook.asks.length);
            orderBook.asks[idx].size = Math.max(0.1, orderBook.asks[idx].size + (Math.random() * 0.1 - 0.05));
          }
          
          // Adjust a few random bid prices
          for (let i = 0; i < 3; i++) {
            const idx = Math.floor(Math.random() * orderBook.bids.length);
            orderBook.bids[idx].size = Math.max(0.1, orderBook.bids[idx].size + (Math.random() * 0.1 - 0.05));
          }
          
          // Update totals
          let total = 0;
          for (let i = 0; i < orderBook.asks.length; i++) {
            total += orderBook.asks[i].size;
            orderBook.asks[i].total = parseFloat(total.toFixed(2));
          }
          
          total = 0;
          for (let i = 0; i < orderBook.bids.length; i++) {
            total += orderBook.bids[i].size;
            orderBook.bids[i].total = parseFloat(total.toFixed(2));
          }
          
          // Update market data
          await storage.updateMarketData(pair.name, {
            price: newPrice,
            change24h: newChange24h,
            candlesticks: updatedCandlesticks,
            orderBook
          });
          
          // Broadcast to all connected clients
          const updatedMarketData = await storage.getMarketData(pair.name);
          
          clients.forEach((client, id) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'marketUpdate',
                pair: pair.name,
                data: updatedMarketData
              }));
            }
          });
        }
      }
    } catch (error) {
      console.error('Error updating market data:', error);
    }
  }, 2000); // Update every 2 seconds
}

// Function to monitor demo trades for liquidation
function startDemoTradeMonitoring() {
  if (demoTradeMonitoringInterval) {
    clearInterval(demoTradeMonitoringInterval);
  }

  demoTradeMonitoringInterval = setInterval(async () => {
    try {
      // Get all users with open demo trades
      const users = await storage.getUsers();
      
      for (const user of users) {
        // Get open demo trades for this user
        const openTrades = await storage.getOpenDemoTrades(user.id);
        
        if (openTrades.length === 0) continue;
        
        // Check each trade for liquidation
        for (const trade of openTrades) {
          // Get current price for the trading pair
          const pair = await storage.getTradingPair(trade.pairId);
          if (!pair) continue;
          
          // Calculate liquidation price
          let liquidationPrice;
          if (trade.side === 'buy') {
            // For long positions, liquidation is when price drops by 1/leverage of entry price
            liquidationPrice = trade.entryPrice * (1 - 1/trade.leverage);
          } else {
            // For short positions, liquidation is when price rises by 1/leverage of entry price
            liquidationPrice = trade.entryPrice * (1 + 1/trade.leverage);
          }
          
          // Check if current price has crossed liquidation threshold
          const shouldLiquidate = (trade.side === 'buy' && pair.price <= liquidationPrice) || 
                                 (trade.side === 'sell' && pair.price >= liquidationPrice);
          
          if (shouldLiquidate) {
            console.log(`Liquidating trade ${trade.id} for user ${user.id} at price ${pair.price}`);
            await storage.liquidateDemoTrade(trade.id);
            
            // Notify client via WebSocket if they're connected
            clients.forEach((client, id) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: 'tradeLiquidated',
                  userId: user.id,
                  tradeId: trade.id,
                  pair: pair.name,
                  price: pair.price
                }));
              }
            });
          }
        }
      }
    } catch (error) {
      console.error('Error monitoring demo trades:', error);
    }
  }, 5000); // Check every 5 seconds
}
