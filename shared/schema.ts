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
