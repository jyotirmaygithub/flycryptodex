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
