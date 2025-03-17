import {
  users, blockchains, tradingCategories, tradingPairs, orders, demoTrades, aiRecommendations, forexNews,
  type User, type InsertUser, type Blockchain, type InsertBlockchain,
  type TradingCategory, type InsertTradingCategory, type TradingPair, type InsertTradingPair,
  type Order, type InsertOrder, type DemoTrade, type InsertDemoTrade,
  type AiRecommendation, type InsertAiRecommendation,
  type ForexNews, type InsertForexNews,
  type MarketData, type CandlestickData, type OrderBook
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUsers(): Promise<User[]>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUserByWalletAddress(address: string): Promise<User | undefined>;
  updateUserBalance(userId: number, newBalance: number): Promise<User | undefined>;

  // Blockchain operations
  getBlockchains(): Promise<Blockchain[]>;
  getBlockchain(id: number): Promise<Blockchain | undefined>;
  createBlockchain(blockchain: InsertBlockchain): Promise<Blockchain>;

  // Trading category operations
  getTradingCategories(): Promise<TradingCategory[]>;
  getTradingCategory(id: number): Promise<TradingCategory | undefined>;
  createTradingCategory(category: InsertTradingCategory): Promise<TradingCategory>;

  // Trading pair operations
  getTradingPairs(): Promise<TradingPair[]>;
  getTradingPairsByCategory(categoryId: number): Promise<TradingPair[]>;
  getTradingPair(id: number): Promise<TradingPair | undefined>;
  getTradingPairByName(name: string): Promise<TradingPair | undefined>;
  createTradingPair(pair: InsertTradingPair): Promise<TradingPair>;
  updateTradingPairPrice(id: number, price: number, change24h: number): Promise<TradingPair | undefined>;

  // Order operations
  getOrders(userId: number): Promise<Order[]>;
  getOrdersByPair(userId: number, pairId: number): Promise<Order[]>;
  getOrder(id: number): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;

  // Demo Trade operations
  getDemoTrades(userId: number): Promise<DemoTrade[]>;
  getDemoTradesByPair(userId: number, pairId: number): Promise<DemoTrade[]>;
  getOpenDemoTrades(userId: number): Promise<DemoTrade[]>;
  createDemoTrade(trade: InsertDemoTrade): Promise<DemoTrade>;
  closeDemoTrade(id: number, exitPrice: number): Promise<DemoTrade | undefined>;
  liquidateDemoTrade(id: number): Promise<DemoTrade | undefined>;

  // AI recommendation operations
  getAiRecommendationsByPair(pairId: number, limit?: number): Promise<AiRecommendation[]>;
  createAiRecommendation(recommendation: InsertAiRecommendation): Promise<AiRecommendation>;

  // Forex news operations
  getForexNews(limit?: number): Promise<ForexNews[]>;
  createForexNews(news: InsertForexNews): Promise<ForexNews>;

  // Market data
  getMarketData(pair: string): Promise<MarketData | undefined>;
  getAllMarketData(): Promise<Record<string, MarketData>>;
  updateMarketData(pair: string, data: Partial<MarketData>): Promise<MarketData | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private blockchains: Map<number, Blockchain>;
  private tradingCategories: Map<number, TradingCategory>;
  private tradingPairs: Map<number, TradingPair>;
  private orders: Map<number, Order>;
  private demoTrades: Map<number, DemoTrade>;
  private aiRecommendations: Map<number, AiRecommendation>;
  private forexNews: Map<number, ForexNews>;
  private marketData: Map<string, MarketData>;
  
  private userId: number;
  private blockchainId: number;
  private categoryId: number;
  private pairId: number;
  private orderId: number;
  private demoTradeId: number;
  private recommendationId: number;
  private newsId: number;

  constructor() {
    this.users = new Map();
    this.blockchains = new Map();
    this.tradingCategories = new Map();
    this.tradingPairs = new Map();
    this.orders = new Map();
    this.demoTrades = new Map();
    this.aiRecommendations = new Map();
    this.forexNews = new Map();
    this.marketData = new Map();
    
    this.userId = 1;
    this.blockchainId = 1;
    this.categoryId = 1;
    this.pairId = 1;
    this.orderId = 1;
    this.demoTradeId = 1;
    this.recommendationId = 1;
    this.newsId = 1;
    
    // Initialize with default data
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create default demo user
    this.createUser({
      username: "demo_user",
      password: "demo_password",
      isDemo: true,
      balance: 10000,
      walletAddress: null
    });
    
    // Add default blockchains
    const solana = this.createBlockchain({ name: "Solana", isActive: true });
    const icp = this.createBlockchain({ name: "ICP", isActive: true });
    const base = this.createBlockchain({ name: "Base", isActive: true });

    // Add default trading categories
    const forex = this.createTradingCategory({ name: "Forex Derivatives", isActive: true });
    const crypto = this.createTradingCategory({ name: "Crypto Derivatives", isActive: true });
    const commodity = this.createTradingCategory({ name: "Commodity Trading", isActive: true });

    // Add default trading pairs for Forex
    const eurUsd = this.createTradingPair({
      name: "EUR/USD",
      baseAsset: "EUR",
      quoteAsset: "USD",
      price: 1.0721,
      change24h: 0.21,
      categoryId: forex.id,
      isActive: true
    });
    
    // Add default trading pairs for Crypto
    const btcUsd = this.createTradingPair({
      name: "BTC/USD",
      baseAsset: "BTC",
      quoteAsset: "USD",
      price: 68547.32,
      change24h: 2.34,
      categoryId: crypto.id,
      isActive: true
    });
    
    const ethUsd = this.createTradingPair({
      name: "ETH/USD",
      baseAsset: "ETH",
      quoteAsset: "USD",
      price: 3921.15,
      change24h: 1.87,
      categoryId: crypto.id,
      isActive: true
    });
    
    const solUsd = this.createTradingPair({
      name: "SOL/USD",
      baseAsset: "SOL",
      quoteAsset: "USD",
      price: 172.38,
      change24h: 3.42,
      categoryId: crypto.id,
      isActive: true
    });

    this.createTradingPair({
      name: "GBP/USD",
      baseAsset: "GBP",
      quoteAsset: "USD",
      price: 1.2647,
      change24h: -0.13,
      categoryId: forex.id,
      isActive: true
    });

    this.createTradingPair({
      name: "USD/JPY",
      baseAsset: "USD",
      quoteAsset: "JPY",
      price: 149.87,
      change24h: 0.35,
      categoryId: forex.id,
      isActive: true
    });

    this.createTradingPair({
      name: "USD/CHF",
      baseAsset: "USD",
      quoteAsset: "CHF",
      price: 0.8823,
      change24h: -0.09,
      categoryId: forex.id,
      isActive: true
    });

    this.createTradingPair({
      name: "AUD/USD",
      baseAsset: "AUD",
      quoteAsset: "USD",
      price: 0.6594,
      change24h: 0.18,
      categoryId: forex.id,
      isActive: true
    });

    // Add default AI recommendations
    this.createAiRecommendation({
      pairId: eurUsd.id,
      signal: "buy",
      message: "RSI indicates oversold conditions. Consider a long position with a 15 pip stop loss."
    });

    this.createAiRecommendation({
      pairId: eurUsd.id,
      signal: "hold",
      message: "Price consolidating near support, wait for clearer directional movement."
    });

    this.createAiRecommendation({
      pairId: eurUsd.id,
      signal: "sell",
      message: "MACD crossing below signal line with divergence forming on price peaks."
    });

    // Add default forex news
    this.createForexNews({
      title: "ECB Rate Decision",
      content: "ECB keeps rates unchanged as expected. Euro showing strength against dollar."
    });

    this.createForexNews({
      title: "US Jobless Claims",
      content: "Initial jobless claims lower than forecast, signaling continued labor market strength."
    });

    this.createForexNews({
      title: "UK GDP Growth",
      content: "UK GDP expands 0.2% in Q1, slightly beating expectations of 0.1% growth."
    });

    // Initialize market data for EUR/USD
    const mockOrderBook: OrderBook = {
      asks: [
        { price: 1.0735, size: 0.25, total: 0.25 },
        { price: 1.0734, size: 0.42, total: 0.67 },
        { price: 1.0733, size: 0.18, total: 0.85 },
        { price: 1.0732, size: 0.56, total: 1.41 },
        { price: 1.0731, size: 0.37, total: 1.78 },
        { price: 1.0730, size: 0.89, total: 2.67 },
        { price: 1.0729, size: 0.22, total: 2.89 },
        { price: 1.0728, size: 0.65, total: 3.54 },
        { price: 1.0727, size: 0.33, total: 3.87 },
        { price: 1.0726, size: 0.47, total: 4.34 },
      ],
      bids: [
        { price: 1.0720, size: 0.52, total: 0.52 },
        { price: 1.0719, size: 0.28, total: 0.80 },
        { price: 1.0718, size: 0.43, total: 1.23 },
        { price: 1.0717, size: 0.61, total: 1.84 },
        { price: 1.0716, size: 0.34, total: 2.18 },
        { price: 1.0715, size: 0.77, total: 2.95 },
        { price: 1.0714, size: 0.26, total: 3.21 },
        { price: 1.0713, size: 0.48, total: 3.69 },
        { price: 1.0712, size: 0.38, total: 4.07 },
        { price: 1.0711, size: 0.58, total: 4.65 },
      ]
    };

    // Create mock candlestick data
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    const mockCandlesticks: CandlestickData[] = Array.from({ length: 30 }).map((_, i) => {
      const time = now - (30 - i) * fiveMinutes;
      const basePrice = 1.07 + Math.random() * 0.01;
      const high = basePrice + Math.random() * 0.002;
      const low = basePrice - Math.random() * 0.002;
      return {
        time,
        open: basePrice,
        high,
        low,
        close: basePrice + (Math.random() - 0.5) * 0.001,
        volume: Math.random() * 100 + 50
      };
    });

    this.marketData.set("EUR/USD", {
      pair: "EUR/USD",
      price: 1.0721,
      change24h: 0.21,
      orderBook: mockOrderBook,
      candlesticks: mockCandlesticks
    });
    
    // Initialize market data for BTC/USD
    this.marketData.set("BTC/USD", {
      pair: "BTC/USD",
      price: 68547.32,
      change24h: 2.34,
      orderBook: {
        asks: Array.from({ length: 10 }).map((_, i) => ({
          price: 68547.32 + (i + 1) * 10,
          size: Math.random() * 2 + 0.1,
          total: 0 // Will be calculated
        })),
        bids: Array.from({ length: 10 }).map((_, i) => ({
          price: 68547.32 - (i + 1) * 10,
          size: Math.random() * 2 + 0.1,
          total: 0 // Will be calculated
        }))
      },
      candlesticks: Array.from({ length: 30 }).map((_, i) => {
        const time = now - (30 - i) * fiveMinutes;
        const basePrice = 68500 + Math.random() * 200;
        const high = basePrice + Math.random() * 50;
        const low = basePrice - Math.random() * 50;
        return {
          time,
          open: basePrice,
          high,
          low,
          close: basePrice + (Math.random() - 0.5) * 30,
          volume: Math.random() * 10 + 2
        };
      })
    });
    
    // Initialize market data for ETH/USD
    this.marketData.set("ETH/USD", {
      pair: "ETH/USD",
      price: 3921.15,
      change24h: 1.87,
      orderBook: {
        asks: Array.from({ length: 10 }).map((_, i) => ({
          price: 3921.15 + (i + 1) * 1,
          size: Math.random() * 5 + 0.5,
          total: 0 // Will be calculated
        })),
        bids: Array.from({ length: 10 }).map((_, i) => ({
          price: 3921.15 - (i + 1) * 1,
          size: Math.random() * 5 + 0.5,
          total: 0 // Will be calculated
        }))
      },
      candlesticks: Array.from({ length: 30 }).map((_, i) => {
        const time = now - (30 - i) * fiveMinutes;
        const basePrice = 3900 + Math.random() * 50;
        const high = basePrice + Math.random() * 10;
        const low = basePrice - Math.random() * 10;
        return {
          time,
          open: basePrice,
          high,
          low,
          close: basePrice + (Math.random() - 0.5) * 5,
          volume: Math.random() * 20 + 5
        };
      })
    });
    
    // Initialize market data for SOL/USD
    this.marketData.set("SOL/USD", {
      pair: "SOL/USD",
      price: 172.38,
      change24h: 3.42,
      orderBook: {
        asks: Array.from({ length: 10 }).map((_, i) => ({
          price: 172.38 + (i + 1) * 0.2,
          size: Math.random() * 10 + 1,
          total: 0 // Will be calculated
        })),
        bids: Array.from({ length: 10 }).map((_, i) => ({
          price: 172.38 - (i + 1) * 0.2,
          size: Math.random() * 10 + 1,
          total: 0 // Will be calculated
        }))
      },
      candlesticks: Array.from({ length: 30 }).map((_, i) => {
        const time = now - (30 - i) * fiveMinutes;
        const basePrice = 170 + Math.random() * 5;
        const high = basePrice + Math.random() * 1;
        const low = basePrice - Math.random() * 1;
        return {
          time,
          open: basePrice,
          high,
          low,
          close: basePrice + (Math.random() - 0.5) * 0.5,
          volume: Math.random() * 50 + 10
        };
      })
    });
  }

  // User methods
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }
  
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }

  async getUserByWalletAddress(address: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.walletAddress === address,
    );
  }

  async updateUserBalance(userId: number, newBalance: number): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    const updatedUser = { ...user, balance: newBalance };
    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  // Blockchain methods
  async getBlockchains(): Promise<Blockchain[]> {
    return Array.from(this.blockchains.values());
  }

  async getBlockchain(id: number): Promise<Blockchain | undefined> {
    return this.blockchains.get(id);
  }

  async createBlockchain(blockchain: InsertBlockchain): Promise<Blockchain> {
    const id = this.blockchainId++;
    const newBlockchain: Blockchain = { ...blockchain, id };
    this.blockchains.set(id, newBlockchain);
    return newBlockchain;
  }

  // Trading category methods
  async getTradingCategories(): Promise<TradingCategory[]> {
    return Array.from(this.tradingCategories.values());
  }

  async getTradingCategory(id: number): Promise<TradingCategory | undefined> {
    return this.tradingCategories.get(id);
  }

  async createTradingCategory(category: InsertTradingCategory): Promise<TradingCategory> {
    const id = this.categoryId++;
    const newCategory: TradingCategory = { ...category, id };
    this.tradingCategories.set(id, newCategory);
    return newCategory;
  }

  // Trading pair methods
  async getTradingPairs(): Promise<TradingPair[]> {
    return Array.from(this.tradingPairs.values());
  }

  async getTradingPairsByCategory(categoryId: number): Promise<TradingPair[]> {
    return Array.from(this.tradingPairs.values()).filter(
      (pair) => pair.categoryId === categoryId
    );
  }

  async getTradingPair(id: number): Promise<TradingPair | undefined> {
    return this.tradingPairs.get(id);
  }

  async getTradingPairByName(name: string): Promise<TradingPair | undefined> {
    return Array.from(this.tradingPairs.values()).find(
      (pair) => pair.name === name
    );
  }

  async createTradingPair(pair: InsertTradingPair): Promise<TradingPair> {
    const id = this.pairId++;
    const newPair: TradingPair = { ...pair, id };
    this.tradingPairs.set(id, newPair);
    return newPair;
  }

  async updateTradingPairPrice(id: number, price: number, change24h: number): Promise<TradingPair | undefined> {
    const pair = this.tradingPairs.get(id);
    if (!pair) return undefined;
    
    const updatedPair = { ...pair, price, change24h };
    this.tradingPairs.set(id, updatedPair);
    return updatedPair;
  }

  // Order methods
  async getOrders(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId
    );
  }

  async getOrdersByPair(userId: number, pairId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId && order.pairId === pairId
    );
  }

  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.orderId++;
    const createdAt = new Date();
    const newOrder: Order = { ...order, id, createdAt };
    this.orders.set(id, newOrder);
    return newOrder;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Demo trade methods
  async getDemoTrades(userId: number): Promise<DemoTrade[]> {
    return Array.from(this.demoTrades.values()).filter(
      (trade) => trade.userId === userId
    );
  }

  async getDemoTradesByPair(userId: number, pairId: number): Promise<DemoTrade[]> {
    return Array.from(this.demoTrades.values()).filter(
      (trade) => trade.userId === userId && trade.pairId === pairId
    );
  }

  async getOpenDemoTrades(userId: number): Promise<DemoTrade[]> {
    return Array.from(this.demoTrades.values()).filter(
      (trade) => trade.userId === userId && trade.status === "open"
    );
  }

  async createDemoTrade(trade: InsertDemoTrade): Promise<DemoTrade> {
    const id = this.demoTradeId++;
    const createdAt = new Date();
    const newTrade: DemoTrade = { 
      ...trade, 
      id, 
      createdAt, 
      exitPrice: null, 
      pnl: null, 
      closedAt: null 
    };
    this.demoTrades.set(id, newTrade);
    return newTrade;
  }

  async closeDemoTrade(id: number, exitPrice: number): Promise<DemoTrade | undefined> {
    const trade = this.demoTrades.get(id);
    if (!trade) return undefined;
    
    const closedAt = new Date();
    let pnl = 0;
    
    // Calculate PNL based on side and leverage
    if (trade.side === "buy") {
      pnl = (exitPrice - trade.entryPrice) / trade.entryPrice * trade.size * trade.leverage;
    } else {
      pnl = (trade.entryPrice - exitPrice) / trade.entryPrice * trade.size * trade.leverage;
    }
    
    // Round to 2 decimal places
    pnl = Math.round(pnl * 100) / 100;
    
    const updatedTrade: DemoTrade = { 
      ...trade, 
      exitPrice, 
      pnl, 
      status: "closed",
      closedAt 
    };
    
    this.demoTrades.set(id, updatedTrade);
    
    // Update user balance
    const user = await this.getUser(trade.userId);
    if (user) {
      const newBalance = user.balance + pnl;
      await this.updateUserBalance(user.id, newBalance);
    }
    
    return updatedTrade;
  }

  async liquidateDemoTrade(id: number): Promise<DemoTrade | undefined> {
    const trade = this.demoTrades.get(id);
    if (!trade) return undefined;
    
    const closedAt = new Date();
    
    // Calculate liquidation price (full loss of position)
    const pnl = -trade.size;
    
    // Determine liquidation price
    let exitPrice;
    if (trade.side === "buy") {
      // For long positions, liquidation is when price drops by 1/leverage of entry price
      exitPrice = trade.entryPrice * (1 - 1/trade.leverage);
    } else {
      // For short positions, liquidation is when price rises by 1/leverage of entry price
      exitPrice = trade.entryPrice * (1 + 1/trade.leverage);
    }
    
    const updatedTrade: DemoTrade = { 
      ...trade, 
      exitPrice, 
      pnl, 
      status: "liquidated",
      closedAt 
    };
    
    this.demoTrades.set(id, updatedTrade);
    
    // Update user balance
    const user = await this.getUser(trade.userId);
    if (user) {
      const newBalance = user.balance + pnl;
      await this.updateUserBalance(user.id, newBalance);
    }
    
    return updatedTrade;
  }

  // AI recommendation methods
  async getAiRecommendationsByPair(pairId: number, limit = 10): Promise<AiRecommendation[]> {
    return Array.from(this.aiRecommendations.values())
      .filter((rec) => rec.pairId === pairId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async createAiRecommendation(recommendation: InsertAiRecommendation): Promise<AiRecommendation> {
    const id = this.recommendationId++;
    const createdAt = new Date();
    const newRecommendation: AiRecommendation = { ...recommendation, id, createdAt };
    this.aiRecommendations.set(id, newRecommendation);
    return newRecommendation;
  }

  // Forex news methods
  async getForexNews(limit = 10): Promise<ForexNews[]> {
    return Array.from(this.forexNews.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async createForexNews(news: InsertForexNews): Promise<ForexNews> {
    const id = this.newsId++;
    const createdAt = new Date();
    const newNews: ForexNews = { ...news, id, createdAt };
    this.forexNews.set(id, newNews);
    return newNews;
  }

  // Market data methods
  async getMarketData(pair: string): Promise<MarketData | undefined> {
    return this.marketData.get(pair);
  }

  async getAllMarketData(): Promise<Record<string, MarketData>> {
    return Object.fromEntries(this.marketData);
  }

  async updateMarketData(pair: string, data: Partial<MarketData>): Promise<MarketData | undefined> {
    const currentData = this.marketData.get(pair);
    if (!currentData) return undefined;
    
    const updatedData = { ...currentData, ...data };
    this.marketData.set(pair, updatedData);
    return updatedData;
  }
}

export const storage = new MemStorage();
