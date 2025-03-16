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
    <Card className="bg-primary-800 border-primary-700 h-full">
      <CardContent className="p-2">
        <div className="flex justify-between items-center mb-1">
          <h3 className="text-sm font-medium">Order Book</h3>
          <span className="text-accent-500 font-mono text-sm">${pair.price.toFixed(2)}</span>
        </div>
        
        <Tabs defaultValue="both" className="mb-1">
          <TabsList className="grid grid-cols-3 h-7">
            <TabsTrigger value="buy" className="text-xs h-6">Bids</TabsTrigger>
            <TabsTrigger value="both" className="text-xs h-6">Both</TabsTrigger>
            <TabsTrigger value="sell" className="text-xs h-6">Asks</TabsTrigger>
          </TabsList>
          
          <TabsContent value="buy" className="mt-1">
            <OrderBookTable type="bids" entries={orderBook.bids} />
          </TabsContent>
          
          <TabsContent value="both" className="mt-1">
            <div className="flex flex-col">
              <OrderBookTable type="asks" entries={orderBook.asks.slice().reverse()} />
              <div className="text-center py-1 border-y border-primary-700 my-1">
                <span className="text-accent-500 font-mono text-xs">${pair.price.toFixed(2)}</span>
              </div>
              <OrderBookTable type="bids" entries={orderBook.bids} />
            </div>
          </TabsContent>
          
          <TabsContent value="sell" className="mt-1">
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
      <div className="grid grid-cols-3 text-neutral-400 mb-0.5 px-1">
        <div className="text-left text-[10px]">Price</div>
        <div className="text-right text-[10px]">Size</div>
        <div className="text-right text-[10px]">Total</div>
      </div>
      
      <div className="space-y-0 max-h-[180px] overflow-y-auto custom-scrollbar">
        {entries.map((entry, i) => (
          <div key={i} className="grid grid-cols-3 relative py-0.5">
            {/* Background bar representing depth */}
            <div 
              className={`absolute right-0 top-0 bottom-0 ${type === 'asks' ? 'bg-red-500/10' : 'bg-green-500/10'}`}
              style={{ width: `${(entry.total / maxTotal) * 100}%` }}
            ></div>
            
            {/* Entry content */}
            <div className={`relative text-left font-mono text-[11px] ${type === 'asks' ? 'text-red-400' : 'text-green-400'}`}>
              ${entry.price.toFixed(2)}
            </div>
            <div className="relative text-right font-mono text-[11px]">{entry.size.toFixed(2)}</div>
            <div className="relative text-right font-mono text-[11px]">{entry.total.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}