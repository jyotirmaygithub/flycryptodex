import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Trading from "@/pages/Trading";
import BlockchainSelection from "@/pages/BlockchainSelection";
import CategorySelection from "@/pages/CategorySelection";
import ForexTrading from "@/pages/ForexTrading";
import CryptoTrading from "@/pages/CryptoTrading";
import CommodityTrading from "@/pages/CommodityTrading";
import ForexTradingPro from "@/pages/ForexTradingPro";
import CryptoTradingPro from "@/pages/CryptoTradingPro";
import CommodityTradingPro from "@/pages/CommodityTradingPro";
import ApiKeys from "@/pages/ApiKeys";
import AlgorithmicTrading from "@/pages/AlgorithmicTrading";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/select-blockchain" component={BlockchainSelection} />
      <Route path="/select-category" component={CategorySelection} />
      <Route path="/trading/:pair?" component={Trading} />
      
      {/* Original trading interfaces */}
      <Route path="/forex-trading/:pair?" component={ForexTrading} />
      <Route path="/crypto-trading/:pair?" component={CryptoTrading} />
      <Route path="/commodity-trading/:pair?" component={CommodityTrading} />
      
      {/* Professional trading interfaces with TradingView charts */}
      <Route path="/forex-trading-pro/:pair?" component={ForexTradingPro} />
      <Route path="/crypto-trading-pro/:pair?" component={CryptoTradingPro} />
      {/* Commodity Pro mode disabled per user request */}
      
      {/* API Trading and Algorithmic Trading */}
      <Route path="/api-keys" component={ApiKeys} />
      <Route path="/algorithmic-trading" component={AlgorithmicTrading} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Router />
      <Toaster />
    </div>
  );
}

export default App;
