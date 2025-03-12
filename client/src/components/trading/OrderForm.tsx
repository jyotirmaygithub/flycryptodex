import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/context/AppContext';
import { apiRequest } from '@/lib/queryClient';
import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface OrderFormProps {
  pairName: string;
  pairId: number;
  currentPrice: number;
}

type OrderType = 'Market' | 'Limit' | 'Stop' | 'Stop Limit';
type OrderSide = 'buy' | 'sell';

export default function OrderForm({ pairName, pairId, currentPrice }: OrderFormProps) {
  const { toast } = useToast();
  const { demoMode, demoBalance, updateDemoBalance, walletAddress } = useAppContext();
  
  const [orderType, setOrderType] = useState<OrderType>('Market');
  const [size, setSize] = useState('0.01');
  const [price, setPrice] = useState(currentPrice.toString());
  const [stopPrice, setStopPrice] = useState(currentPrice.toString());
  
  // Order placement mutation
  const { mutate: placeOrder, isPending } = useMutation({
    mutationFn: async ({ side, type, size, price }: { side: OrderSide, type: string, size: number, price?: number }) => {
      // Create demo user if needed in demo mode
      if (demoMode && !walletAddress) {
        const randomId = Math.floor(Math.random() * 1000000);
        await apiRequest('POST', '/api/users', {
          username: `demo_user_${randomId}`,
          password: 'demo_password',
          isDemo: true,
          balance: demoBalance
        });
      }
      
      // Create the order
      return apiRequest('POST', '/api/orders', {
        userId: 1, // Demo user ID
        pairId,
        type: type.toLowerCase().replace(' ', '_'),
        side,
        price: type === 'Market' ? undefined : parseFloat(price!.toString()),
        size: parseFloat(size.toString()),
        status: 'open'
      });
    },
    onSuccess: (_, variables) => {
      const { side, size, price } = variables;
      const orderValue = size * (price || currentPrice);
      
      toast({
        title: 'Order Placed',
        description: `${side.toUpperCase()} ${size} ${pairName} at ${price || 'market price'}`
      });
      
      // Update demo balance if in demo mode
      if (demoMode) {
        updateDemoBalance(side === 'buy' ? -orderValue : orderValue);
      }
    },
    onError: (error) => {
      toast({
        title: 'Order Failed',
        description: error instanceof Error ? error.message : 'Failed to place order',
        variant: 'destructive'
      });
    }
  });
  
  const handlePlaceOrder = (side: OrderSide) => {
    if (!demoMode && !walletAddress) {
      toast({
        title: 'Wallet Required',
        description: 'Please connect your wallet or enable demo mode to place orders',
        variant: 'destructive'
      });
      return;
    }
    
    const sizeValue = parseFloat(size);
    if (isNaN(sizeValue) || sizeValue <= 0) {
      toast({
        title: 'Invalid Size',
        description: 'Please enter a valid size value',
        variant: 'destructive'
      });
      return;
    }
    
    // For limit and stop orders, validate price
    if (orderType !== 'Market') {
      const priceValue = parseFloat(price);
      if (isNaN(priceValue) || priceValue <= 0) {
        toast({
          title: 'Invalid Price',
          description: 'Please enter a valid price value',
          variant: 'destructive'
        });
        return;
      }
    }
    
    placeOrder({
      side,
      type: orderType,
      size: sizeValue,
      price: orderType !== 'Market' ? parseFloat(price) : undefined
    });
  };
  
  return (
    <div className="w-1/2 border-r border-primary-700 p-4">
      <div className="rounded-lg bg-primary-800 border border-primary-700 p-4 h-full">
        <h3 className="text-sm font-medium mb-3">Place Order</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-neutral-400 mb-1">Type</Label>
            <Select 
              value={orderType} 
              onValueChange={(value) => setOrderType(value as OrderType)}
            >
              <SelectTrigger className="bg-primary-700">
                <SelectValue placeholder="Order Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Market">Market</SelectItem>
                <SelectItem value="Limit">Limit</SelectItem>
                <SelectItem value="Stop">Stop</SelectItem>
                <SelectItem value="Stop Limit">Stop Limit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-xs text-neutral-400 mb-1">Size</Label>
            <Input 
              type="text" 
              value={size} 
              onChange={(e) => setSize(e.target.value)}
              className="bg-primary-700"
            />
          </div>
          
          {orderType === 'Limit' || orderType === 'Stop Limit' ? (
            <div className="col-span-2">
              <Label className="text-xs text-neutral-400 mb-1">Price</Label>
              <Input 
                type="text" 
                value={price} 
                onChange={(e) => setPrice(e.target.value)}
                className="bg-primary-700"
              />
            </div>
          ) : null}
          
          {orderType === 'Stop' || orderType === 'Stop Limit' ? (
            <div className="col-span-2">
              <Label className="text-xs text-neutral-400 mb-1">Stop Price</Label>
              <Input 
                type="text" 
                value={stopPrice} 
                onChange={(e) => setStopPrice(e.target.value)}
                className="bg-primary-700"
              />
            </div>
          ) : null}
          
          <div className="col-span-2">
            <div className="flex -mx-1">
              <div className="px-1 w-1/2">
                <Button 
                  className="w-full bg-success hover:bg-success/80 text-white"
                  onClick={() => handlePlaceOrder('buy')}
                  disabled={isPending}
                >
                  Buy
                </Button>
              </div>
              <div className="px-1 w-1/2">
                <Button 
                  className="w-full bg-error hover:bg-error/80 text-white"
                  onClick={() => handlePlaceOrder('sell')}
                  disabled={isPending}
                >
                  Sell
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
