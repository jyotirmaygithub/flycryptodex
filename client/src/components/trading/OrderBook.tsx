import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderBook as OrderBookType, Order } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';

interface OrderBookProps {
  orderBook: OrderBookType;
  currentPrice: number;
  change24h: number;
  isLoading: boolean;
  orders?: Order[];
}

export default function OrderBook({ 
  orderBook, 
  currentPrice, 
  change24h, 
  isLoading,
  orders = []
}: OrderBookProps) {
  const [activeTab, setActiveTab] = useState("order-book");
  
  // Format price for display
  const formattedPrice = currentPrice.toFixed(4);
  const priceChangeText = `${change24h >= 0 ? '+' : ''}${change24h.toFixed(2)}%`;
  const isPositiveChange = change24h >= 0;
  
  return (
    <div className="w-80 border-l border-primary-700 flex flex-col">
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Tabs */}
        <Tabs defaultValue="order-book" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="w-full bg-primary-800 border-b border-primary-700">
            <TabsTrigger 
              value="order-book" 
              className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-accent-500"
            >
              Order Book
            </TabsTrigger>
            <TabsTrigger 
              value="positions" 
              className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-accent-500"
            >
              Positions
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-accent-500"
            >
              History
            </TabsTrigger>
          </TabsList>
          
          {/* Order Book Content */}
          <TabsContent value="order-book" className="flex-1 overflow-hidden flex flex-col m-0 p-0">
            {isLoading ? (
              <div className="flex-1 p-4">
                <Skeleton className="h-[400px] w-full" />
              </div>
            ) : (
              <>
                {/* Asks */}
                <div className="flex-1 overflow-y-auto">
                  <div className="sticky top-0 bg-primary-800 p-2 border-b border-primary-700 flex justify-between text-xs text-neutral-400">
                    <span>Price</span>
                    <span>Size</span>
                    <span>Total</span>
                  </div>
                  <div className="overflow-y-auto max-h-[200px]">
                    {orderBook.asks.map((ask, index) => (
                      <div 
                        key={index} 
                        className="flex justify-between text-xs p-2 border-b border-primary-700 hover:bg-primary-700"
                      >
                        <span className="font-mono text-error">{ask.price.toFixed(4)}</span>
                        <span className="font-mono">{ask.size.toFixed(2)}</span>
                        <span className="font-mono">{ask.total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Current price */}
                <div className="p-2 bg-primary-700 border-t border-b border-primary-600 flex justify-between items-center">
                  <span className="font-mono text-lg">{formattedPrice}</span>
                  <span className={`text-xs ${isPositiveChange ? 'text-success' : 'text-error'}`}>
                    {priceChangeText}
                  </span>
                </div>
                
                {/* Bids */}
                <div className="flex-1 overflow-y-auto">
                  <div className="overflow-y-auto max-h-[200px]">
                    {orderBook.bids.map((bid, index) => (
                      <div 
                        key={index} 
                        className="flex justify-between text-xs p-2 border-b border-primary-700 hover:bg-primary-700"
                      >
                        <span className="font-mono text-success">{bid.price.toFixed(4)}</span>
                        <span className="font-mono">{bid.size.toFixed(2)}</span>
                        <span className="font-mono">{bid.total.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </TabsContent>
          
          {/* Positions Tab */}
          <TabsContent value="positions" className="flex-1 m-0 p-4">
            <div className="text-center py-12 text-neutral-400">
              No open positions
            </div>
          </TabsContent>
          
          {/* History Tab */}
          <TabsContent value="history" className="flex-1 overflow-y-auto m-0 p-0">
            {orders.length === 0 ? (
              <div className="text-center py-12 text-neutral-400">
                No order history
              </div>
            ) : (
              <div className="divide-y divide-primary-700">
                {orders.map((order) => (
                  <div key={order.id} className="p-3 hover:bg-primary-700">
                    <div className="flex justify-between mb-1">
                      <span className={`text-xs font-medium ${order.side === 'buy' ? 'text-success' : 'text-error'}`}>
                        {order.side.toUpperCase()} {order.type.toUpperCase()}
                      </span>
                      <span className="text-xs text-neutral-400">
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Size: {order.size}</span>
                      <span>Price: {order.price || 'Market'}</span>
                      <span>Status: {order.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { TradingPair, OrderBook as OrderBookType } from '@shared/schema';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateMockOrderBook } from '@/lib/mockData';

interface OrderBookProps {
  pair: TradingPair;
}

export default function OrderBook({ pair }: OrderBookProps) {
  const [orderBook, setOrderBook] = useState<OrderBookType>({
    asks: [],
    bids: []
  });
  
  // Generate mock order book data
  useEffect(() => {
    const data = generateMockOrderBook(pair.price);
    setOrderBook(data);
    
    // Update order book periodically
    const interval = setInterval(() => {
      const updatedData = generateMockOrderBook(pair.price);
      setOrderBook(updatedData);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [pair.price]);
  
  return (
    <Card className="bg-primary-800 border-primary-700">
      <CardContent className="p-3">
        <h3 className="text-base font-medium mb-2">Order Book</h3>
        
        <Tabs defaultValue="both" className="mb-2">
          <TabsList className="grid grid-cols-3 h-8">
            <TabsTrigger value="buy" className="text-xs h-7">Bids</TabsTrigger>
            <TabsTrigger value="both" className="text-xs h-7">Both</TabsTrigger>
            <TabsTrigger value="sell" className="text-xs h-7">Asks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="buy" className="mt-2">
            <OrderBookTable type="bids" entries={orderBook.bids} />
          </TabsContent>
          
          <TabsContent value="both" className="mt-2">
            <div className="flex flex-col">
              <OrderBookTable type="asks" entries={orderBook.asks.slice().reverse()} />
              <div className="text-center py-2 border-y border-primary-700 my-2">
                <span className="text-accent-500 font-mono">${pair.price.toFixed(2)}</span>
              </div>
              <OrderBookTable type="bids" entries={orderBook.bids} />
            </div>
          </TabsContent>
          
          <TabsContent value="sell" className="mt-2">
            <OrderBookTable type="asks" entries={orderBook.asks} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

interface OrderBookTableProps {
  type: 'asks' | 'bids';
  entries: { price: number; size: number; total: number }[];
}

function OrderBookTable({ type, entries }: OrderBookTableProps) {
  // Find the max total to calculate the depth visualization
  const maxTotal = entries.length > 0 ? Math.max(...entries.map(e => e.total)) : 0;
  
  return (
    <div className="w-full overflow-hidden text-xs">
      <div className="grid grid-cols-3 text-neutral-400 mb-1 px-1">
        <div className="text-left">Price</div>
        <div className="text-right">Size</div>
        <div className="text-right">Total</div>
      </div>
      
      <div className="space-y-0.5 max-h-48 overflow-y-auto custom-scrollbar">
        {entries.map((entry, i) => (
          <div key={i} className="grid grid-cols-3 relative">
            {/* Background bar representing depth */}
            <div 
              className={`absolute right-0 top-0 bottom-0 ${type === 'asks' ? 'bg-red-500/10' : 'bg-green-500/10'}`}
              style={{ width: `${(entry.total / maxTotal) * 100}%` }}
            ></div>
            
            {/* Entry content */}
            <div className={`relative text-left font-mono ${type === 'asks' ? 'text-red-400' : 'text-green-400'}`}>
              ${entry.price.toFixed(2)}
            </div>
            <div className="relative text-right font-mono">{entry.size.toFixed(2)}</div>
            <div className="relative text-right font-mono">{entry.total.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
