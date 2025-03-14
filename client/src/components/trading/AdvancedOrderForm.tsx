import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { TradingPair } from '@shared/schema';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Sliders, 
  AlertCircle, 
  Info,
  Calculator 
} from 'lucide-react';

interface AdvancedOrderFormProps {
  pair: TradingPair;
}

export default function AdvancedOrderForm({ pair }: AdvancedOrderFormProps) {
  // Order form state
  const [orderType, setOrderType] = useState<string>('Limit');
  const [orderSide, setOrderSide] = useState<string>('buy');
  const [amount, setAmount] = useState<number>(0.01);
  const [price, setPrice] = useState<number>(pair.price);
  const [stopPrice, setStopPrice] = useState<number>(pair.price * 0.95);
  const [takeProfitPrice, setTakeProfitPrice] = useState<number>(pair.price * 1.05);
  const [reduceOnly, setReduceOnly] = useState<boolean>(false);
  const [postOnly, setPostOnly] = useState<boolean>(false);
  const [tpslOrder, setTpslOrder] = useState<boolean>(false);
  const [leverage, setLeverage] = useState<number>(10);
  const [marginMode, setMarginMode] = useState<'cross' | 'isolated'>('cross');
  const [timeInForce, setTimeInForce] = useState<string>('GTC');
  
  // Calculations
  const positionValue = amount * pair.price;
  const requiredMargin = positionValue / leverage;
  const fees = positionValue * 0.0006; // 0.06% trading fee
  const liquidationPrice = orderSide === 'buy' 
    ? pair.price * (1 - (1 / leverage) * 0.9) 
    : pair.price * (1 + (1 / leverage) * 0.9);
  
  const handlePlaceOrder = () => {
    console.log('Placing order:', {
      pair: pair.name,
      type: orderType,
      side: orderSide,
      amount,
      price: orderType !== 'Market' ? price : undefined,
      stopPrice: tpslOrder ? stopPrice : undefined,
      takeProfitPrice: tpslOrder ? takeProfitPrice : undefined,
      reduceOnly,
      postOnly,
      timeInForce,
      leverage,
      marginMode
    });
    
    // Here you would call the API to place the order
    alert(`Order placed: ${orderSide.toUpperCase()} ${amount} ${pair.name} at ${orderType === 'Market' ? 'market price' : '$' + price}`);
  };

  return (
    <div className="bg-primary-800 rounded-lg border border-primary-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Place Order</h3>
        <div className="flex items-center space-x-2">
          <div className="flex items-center border border-primary-600 rounded-md overflow-hidden">
            <Button 
              size="sm"
              variant={marginMode === "cross" ? "default" : "outline"}
              className={marginMode === "cross" ? "bg-accent-500 text-white rounded-none" : "rounded-none"}
              onClick={() => setMarginMode("cross")}
            >
              Cross
            </Button>
            <Button 
              size="sm"
              variant={marginMode === "isolated" ? "default" : "outline"}
              className={marginMode === "isolated" ? "bg-accent-500 text-white rounded-none" : "rounded-none"}
              onClick={() => setMarginMode("isolated")}
            >
              Isolated
            </Button>
          </div>
          <Select 
            value={leverage.toString()} 
            onValueChange={(val) => setLeverage(Number(val))}
          >
            <SelectTrigger className="w-20 h-8 bg-primary-700 border-primary-600">
              <SelectValue placeholder="10x" />
            </SelectTrigger>
            <SelectContent className="bg-primary-800 border-primary-600">
              <SelectItem value="1">1x</SelectItem>
              <SelectItem value="2">2x</SelectItem>
              <SelectItem value="5">5x</SelectItem>
              <SelectItem value="10">10x</SelectItem>
              <SelectItem value="25">25x</SelectItem>
              <SelectItem value="50">50x</SelectItem>
              <SelectItem value="100">100x</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="mb-4">
        <Tabs defaultValue={orderType} onValueChange={setOrderType}>
          <TabsList className="grid w-full grid-cols-4 bg-primary-700">
            <TabsTrigger value="Limit">Limit</TabsTrigger>
            <TabsTrigger value="Market">Market</TabsTrigger>
            <TabsTrigger value="Stop">Stop</TabsTrigger>
            <TabsTrigger value="StopLimit">Stop Limit</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="mb-4 grid grid-cols-2 gap-2">
        <Button 
          className={`py-3 ${orderSide === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-primary-700'}`}
          onClick={() => setOrderSide('buy')}
        >
          <ChevronUp className="h-4 w-4 mr-1" />
          Long
        </Button>
        <Button 
          className={`py-3 ${orderSide === 'sell' ? 'bg-red-600 hover:bg-red-700' : 'bg-primary-700'}`}
          onClick={() => setOrderSide('sell')}
        >
          <ChevronDown className="h-4 w-4 mr-1" />
          Short
        </Button>
      </div>
      
      <div className="space-y-4 mb-4">
        <div>
          <div className="flex justify-between">
            <Label htmlFor="amount">Amount ({pair.baseAsset})</Label>
            <div className="flex space-x-2 text-xs">
              <button className="text-accent-500 hover:text-accent-300">25%</button>
              <button className="text-accent-500 hover:text-accent-300">50%</button>
              <button className="text-accent-500 hover:text-accent-300">75%</button>
              <button className="text-accent-500 hover:text-accent-300">100%</button>
            </div>
          </div>
          <Input 
            id="amount" 
            className="bg-primary-700 border-primary-600 mt-1"
            value={amount} 
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            type="number"
            step={0.001}
          />
          <div className="text-xs text-right mt-1 text-neutral-400">
            ≈ ${(amount * pair.price).toLocaleString()}
          </div>
        </div>
        
        {orderType !== 'Market' && (
          <div>
            <Label htmlFor="price">Price (USD)</Label>
            <Input 
              id="price" 
              className="bg-primary-700 border-primary-600 mt-1"
              value={price} 
              onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
              type="number"
              step={0.01}
            />
            <div className="flex justify-between text-xs mt-1">
              <span>Mark: ${pair.price.toLocaleString()}</span>
              <span className="text-neutral-400">
                {orderSide === 'buy' ? '-' : '+'}${Math.abs(((price - pair.price) / pair.price) * 100).toFixed(2)}%
              </span>
            </div>
          </div>
        )}
        
        {(orderType === 'Stop' || orderType === 'StopLimit') && (
          <div>
            <Label htmlFor="stopPrice">Trigger Price (USD)</Label>
            <Input 
              id="stopPrice" 
              className="bg-primary-700 border-primary-600 mt-1"
              value={stopPrice} 
              onChange={(e) => setStopPrice(parseFloat(e.target.value) || 0)}
              type="number"
              step={0.01}
            />
          </div>
        )}
        
        <div className="pt-2 border-t border-primary-700 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch 
                id="tpslOrder" 
                checked={tpslOrder} 
                onCheckedChange={setTpslOrder}
              />
              <Label htmlFor="tpslOrder" className="text-sm">Take Profit / Stop Loss</Label>
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-accent-500">
              <Calculator className="h-3.5 w-3.5 mr-1" />
              Calculator
            </Button>
          </div>
          
          {tpslOrder && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="takeProfitPrice" className="text-sm">Take Profit</Label>
                <Input 
                  id="takeProfitPrice" 
                  className="bg-primary-700 border-primary-600 mt-1 text-sm h-8"
                  value={takeProfitPrice} 
                  onChange={(e) => setTakeProfitPrice(parseFloat(e.target.value) || 0)}
                  type="number"
                  step={0.01}
                />
                <div className="text-xs text-right mt-1 text-green-500">
                  +${(Math.abs(takeProfitPrice - pair.price) * amount).toFixed(2)}
                </div>
              </div>
              <div>
                <Label htmlFor="stopLossPrice" className="text-sm">Stop Loss</Label>
                <Input 
                  id="stopLossPrice" 
                  className="bg-primary-700 border-primary-600 mt-1 text-sm h-8"
                  value={stopPrice} 
                  onChange={(e) => setStopPrice(parseFloat(e.target.value) || 0)}
                  type="number"
                  step={0.01}
                />
                <div className="text-xs text-right mt-1 text-red-500">
                  -${(Math.abs(stopPrice - pair.price) * amount).toFixed(2)}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-between text-sm border-t border-primary-700 pt-3">
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 w-full">
            <span className="text-neutral-400">Order Value:</span>
            <span className="text-right">${positionValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            
            <span className="text-neutral-400">Required Margin:</span>
            <span className="text-right">${requiredMargin.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            
            <span className="text-neutral-400">Fees:</span>
            <span className="text-right">${fees.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            
            <span className="text-neutral-400">Liquidation Price:</span>
            <span className="text-right text-yellow-500">${liquidationPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 border-t border-primary-700 pt-3">
          <div className="flex items-center space-x-2">
            <Switch 
              id="reduceOnly" 
              checked={reduceOnly} 
              onCheckedChange={setReduceOnly} 
            />
            <Label htmlFor="reduceOnly" className="text-sm">Reduce Only</Label>
          </div>
          
          {orderType === 'Limit' && (
            <div className="flex items-center space-x-2">
              <Switch 
                id="postOnly" 
                checked={postOnly} 
                onCheckedChange={setPostOnly} 
              />
              <Label htmlFor="postOnly" className="text-sm">Post Only</Label>
            </div>
          )}
          
          <Select 
            value={timeInForce} 
            onValueChange={setTimeInForce}
          >
            <SelectTrigger className="w-24 h-8 text-xs bg-primary-700 border-primary-600">
              <SelectValue placeholder="GTC" />
            </SelectTrigger>
            <SelectContent className="bg-primary-800 border-primary-600">
              <SelectItem value="GTC">GTC</SelectItem>
              <SelectItem value="IOC">IOC</SelectItem>
              <SelectItem value="FOK">FOK</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="text-xs text-neutral-400 flex items-center">
            <Info className="h-3.5 w-3.5 mr-1" />
            <div className="tooltip">
              GTC: Good Till Cancel
              <br/>IOC: Immediate or Cancel
              <br/>FOK: Fill or Kill
            </div>
          </div>
        </div>
      </div>
      
      <Button 
        className={`w-full py-4 text-lg font-semibold ${orderSide === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
        onClick={handlePlaceOrder}
      >
        {orderSide === 'buy' ? 'Buy / Long' : 'Sell / Short'} {pair.baseAsset}
      </Button>
    </div>
  );
}