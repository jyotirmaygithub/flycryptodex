import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertOrderSchema, 
  insertUserSchema, 
  insertApiKeySchema, 
  insertTradingStrategySchema 
} from "@shared/schema";

const clients = new Map<string, WebSocket>();
let marketUpdateInterval: NodeJS.Timeout;

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

  // API key routes
  app.get('/api/api-keys', async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      
      const apiKeys = await storage.getApiKeys(userId);
      
      // Don't expose secret keys in the response
      const safeApiKeys = apiKeys.map(key => {
        const { secretKey, ...safeKey } = key;
        return {
          ...safeKey,
          // Replace most of the API key with asterisks, show only last 4 chars
          apiKey: key.apiKey.slice(0, 4) + '****' + key.apiKey.slice(-4)
        };
      });
      
      res.json(safeApiKeys);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch API keys' });
    }
  });
  
  app.post('/api/api-keys', async (req, res) => {
    try {
      const apiKeyData = insertApiKeySchema.parse(req.body);
      
      // Generate API key (in a real app, use a secure random generator)
      const keyId = Math.random().toString(36).substring(2, 10);
      const timestamp = Date.now().toString(36);
      const apiKey = `${keyId}${timestamp}`;
      
      // Generate secret key (in a real app, use a secure random generator)
      const secretKey = Math.random().toString(36).substring(2, 15) + 
                       Math.random().toString(36).substring(2, 15);
      
      const apiKeyWithSecrets = {
        ...apiKeyData,
        apiKey,
        secretKey
      };
      
      const createdApiKey = await storage.createApiKey(apiKeyWithSecrets);
      
      // In the actual response, return the full API key and secret 
      // (this is the only time the full secret will be shown)
      res.status(201).json(createdApiKey);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid API key data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create API key' });
    }
  });
  
  app.patch('/api/api-keys/:id', async (req, res) => {
    try {
      const apiKeyId = parseInt(req.params.id);
      const { isActive } = req.body;
      
      if (isActive === undefined) {
        return res.status(400).json({ message: 'isActive is required' });
      }
      
      const updatedApiKey = await storage.updateApiKey(apiKeyId, isActive);
      
      if (!updatedApiKey) {
        return res.status(404).json({ message: 'API key not found' });
      }
      
      const { secretKey, ...safeKey } = updatedApiKey;
      
      res.json({
        ...safeKey,
        apiKey: updatedApiKey.apiKey.slice(0, 4) + '****' + updatedApiKey.apiKey.slice(-4)
      });
    } catch (error) {
      res.status(500).json({ message: 'Failed to update API key' });
    }
  });
  
  app.delete('/api/api-keys/:id', async (req, res) => {
    try {
      const apiKeyId = parseInt(req.params.id);
      const result = await storage.deleteApiKey(apiKeyId);
      
      if (!result) {
        return res.status(404).json({ message: 'API key not found' });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete API key' });
    }
  });
  
  // Trading strategy routes
  app.get('/api/strategies', async (req, res) => {
    try {
      const userId = parseInt(req.query.userId as string);
      
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
      }
      
      const strategies = await storage.getTradingStrategies(userId);
      res.json(strategies);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch trading strategies' });
    }
  });
  
  app.post('/api/strategies', async (req, res) => {
    try {
      const strategyData = insertTradingStrategySchema.parse(req.body);
      const strategy = await storage.createTradingStrategy(strategyData);
      
      res.status(201).json(strategy);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid strategy data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create trading strategy' });
    }
  });
  
  app.patch('/api/strategies/:id/status', async (req, res) => {
    try {
      const strategyId = parseInt(req.params.id);
      const { isActive } = req.body;
      
      if (isActive === undefined) {
        return res.status(400).json({ message: 'isActive is required' });
      }
      
      const updatedStrategy = await storage.updateTradingStrategy(strategyId, isActive);
      
      if (!updatedStrategy) {
        return res.status(404).json({ message: 'Trading strategy not found' });
      }
      
      res.json(updatedStrategy);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update trading strategy' });
    }
  });
  
  app.patch('/api/strategies/:id/performance', async (req, res) => {
    try {
      const strategyId = parseInt(req.params.id);
      const { performance } = req.body;
      
      if (performance === undefined) {
        return res.status(400).json({ message: 'performance is required' });
      }
      
      const updatedStrategy = await storage.updateTradingStrategyPerformance(strategyId, performance);
      
      if (!updatedStrategy) {
        return res.status(404).json({ message: 'Trading strategy not found' });
      }
      
      res.json(updatedStrategy);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update trading strategy performance' });
    }
  });
  
  app.delete('/api/strategies/:id', async (req, res) => {
    try {
      const strategyId = parseInt(req.params.id);
      const result = await storage.deleteTradingStrategy(strategyId);
      
      if (!result) {
        return res.status(404).json({ message: 'Trading strategy not found' });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete trading strategy' });
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
