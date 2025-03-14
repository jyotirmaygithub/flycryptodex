import { pgTable, text, serial, integer, boolean, jsonb, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  walletAddress: text("wallet_address"),
  isDemo: boolean("is_demo").default(true).notNull(),
  balance: real("balance").default(10000).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const blockchains = pgTable("blockchains", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const tradingCategories = pgTable("trading_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const tradingPairs = pgTable("trading_pairs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  baseAsset: text("base_asset").notNull(),
  quoteAsset: text("quote_asset").notNull(),
  price: real("price").notNull(),
  change24h: real("change_24h").notNull(),
  categoryId: integer("category_id").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  pairId: integer("pair_id").notNull(),
  type: text("type").notNull(), // "market", "limit", "stop", "stop_limit"
  side: text("side").notNull(), // "buy", "sell"
  price: real("price"),
  size: real("size").notNull(),
  status: text("status").notNull(), // "open", "filled", "canceled"
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const aiRecommendations = pgTable("ai_recommendations", {
  id: serial("id").primaryKey(),
  pairId: integer("pair_id").notNull(),
  signal: text("signal").notNull(), // "buy", "sell", "hold"
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const forexNews = pgTable("forex_news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertBlockchainSchema = createInsertSchema(blockchains).omit({ id: true });
export const insertTradingCategorySchema = createInsertSchema(tradingCategories).omit({ id: true });
export const insertTradingPairSchema = createInsertSchema(tradingPairs).omit({ id: true });
export const insertOrderSchema = createInsertSchema(orders).omit({ id: true, createdAt: true });
export const insertAiRecommendationSchema = createInsertSchema(aiRecommendations).omit({ id: true, createdAt: true });
export const insertForexNewsSchema = createInsertSchema(forexNews).omit({ id: true, createdAt: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertBlockchain = z.infer<typeof insertBlockchainSchema>;
export type InsertTradingCategory = z.infer<typeof insertTradingCategorySchema>;
export type InsertTradingPair = z.infer<typeof insertTradingPairSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertAiRecommendation = z.infer<typeof insertAiRecommendationSchema>;
export type InsertForexNews = z.infer<typeof insertForexNewsSchema>;

export type User = typeof users.$inferSelect;
export type Blockchain = typeof blockchains.$inferSelect;
export type TradingCategory = typeof tradingCategories.$inferSelect;
export type TradingPair = typeof tradingPairs.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type AiRecommendation = typeof aiRecommendations.$inferSelect;
export type ForexNews = typeof forexNews.$inferSelect;

// Candlestick data type for WebSocket
export type CandlestickData = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type OrderBookEntry = {
  price: number;
  size: number;
  total: number;
};

export type OrderBook = {
  asks: OrderBookEntry[];
  bids: OrderBookEntry[];
};

export type MarketData = {
  pair: string;
  price: number;
  change24h: number;
  orderBook: OrderBook;
  candlesticks: CandlestickData[];
};
import { z } from "zod";

// Blockchain schema
export const blockchainSchema = z.object({
  id: z.number(),
  name: z.string(),
  icon: z.string(),
  description: z.string(),
});

export type Blockchain = z.infer<typeof blockchainSchema>;

// Trading category schema
export const tradingCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
});

export type TradingCategory = z.infer<typeof tradingCategorySchema>;

// Trading pair schema
export const tradingPairSchema = z.object({
  id: z.number(),
  name: z.string(),
  base: z.string(),
  quote: z.string(),
  price: z.number(),
  change24h: z.number(),
  volume24h: z.number(),
  marketCap: z.number().optional(),
  categoryId: z.number(),
  icon: z.string().optional(),
});

export type TradingPair = z.infer<typeof tradingPairSchema>;

// Candlestick data schema
export const candlestickSchema = z.object({
  time: z.number(), // timestamp in milliseconds
  open: z.number(),
  high: z.number(),
  low: z.number(),
  close: z.number(),
  volume: z.number(),
});

export type CandlestickData = z.infer<typeof candlestickSchema>;

// Order book entry schema
export const orderBookEntrySchema = z.object({
  price: z.number(),
  size: z.number(),
  total: z.number(),
});

export type OrderBookEntry = z.infer<typeof orderBookEntrySchema>;

// Order book schema
export const orderBookSchema = z.object({
  asks: z.array(orderBookEntrySchema),
  bids: z.array(orderBookEntrySchema),
});

export type OrderBook = z.infer<typeof orderBookSchema>;

// Market data schema
export const marketDataSchema = z.object({
  pair: z.string(),
  price: z.number(),
  change24h: z.number(),
  volume24h: z.number().optional(),
  high24h: z.number().optional(),
  low24h: z.number().optional(),
  candlesticks: z.array(candlestickSchema),
  orderBook: orderBookSchema,
});

export type MarketData = z.infer<typeof marketDataSchema>;

// User schema
export const userSchema = z.object({
  id: z.number(),
  email: z.string().email().optional(),
  username: z.string().optional(),
  walletAddress: z.string(),
  password: z.string().optional(),
  avatar: z.string().optional(),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
});

export type User = z.infer<typeof userSchema>;

// Order schema
export const orderSchema = z.object({
  id: z.number(),
  userId: z.number(),
  pairId: z.number(),
  pairName: z.string(),
  type: z.enum(["Market", "Limit", "Stop", "StopLimit"]),
  side: z.enum(["buy", "sell"]),
  amount: z.number(),
  price: z.number().optional(),
  stopPrice: z.number().optional(),
  status: z.enum(["open", "closed", "cancelled", "filled", "partially_filled"]),
  filledAmount: z.number().default(0),
  filledPrice: z.number().optional(),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
  closedAt: z.date().or(z.string()).optional(),
  postOnly: z.boolean().optional(),
  reduceOnly: z.boolean().optional(),
});

export type Order = z.infer<typeof orderSchema>;

// AI recommendation schema
export const aiRecommendationSchema = z.object({
  id: z.number(),
  pairId: z.number(),
  pairName: z.string(),
  recommendation: z.enum(["buy", "sell", "hold"]),
  confidence: z.number(),
  description: z.string(),
  createdAt: z.date().or(z.string()),
});

export type AiRecommendation = z.infer<typeof aiRecommendationSchema>;

// Forex news schema
export const forexNewsSchema = z.object({
  id: z.number(),
  title: z.string(),
  summary: z.string(),
  content: z.string(),
  source: z.string(),
  url: z.string().optional(),
  imageUrl: z.string().optional(),
  publishedAt: z.date().or(z.string()),
  sentiment: z.enum(["positive", "negative", "neutral"]).optional(),
});

export type ForexNews = z.infer<typeof forexNewsSchema>;

// Input schema for creating a new user
export const insertUserSchema = userSchema.omit({ id: true, createdAt: true, updatedAt: true });

// Input schema for creating a new order
export const insertOrderSchema = orderSchema.omit({ 
  id: true, 
  status: true, 
  filledAmount: true, 
  filledPrice: true, 
  createdAt: true, 
  updatedAt: true, 
  closedAt: true 
});
