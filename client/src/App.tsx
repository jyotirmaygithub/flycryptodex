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

// Import MainLayout
import MainLayout from "@/components/layout/MainLayout";

// This custom component handles the layout wrapping
const LayoutWrapper = ({ children }: { children: React.ReactNode }) => (
  <MainLayout>{children}</MainLayout>
);

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => (
        <LayoutWrapper>
          <Home />
        </LayoutWrapper>
      )} />
      <Route path="/select-blockchain" component={() => (
        <LayoutWrapper>
          <BlockchainSelection />
        </LayoutWrapper>
      )} />
      <Route path="/select-category" component={() => (
        <LayoutWrapper>
          <CategorySelection />
        </LayoutWrapper>
      )} />
      <Route path="/trading/:pair?" component={() => (
        <LayoutWrapper>
          <Trading />
        </LayoutWrapper>
      )} />
      
      {/* Original trading interfaces */}
      <Route path="/forex-trading/:pair?" component={() => (
        <LayoutWrapper>
          <ForexTrading />
        </LayoutWrapper>
      )} />
      <Route path="/crypto-trading/:pair?" component={() => (
        <LayoutWrapper>
          <CryptoTrading />
        </LayoutWrapper>
      )} />
      <Route path="/commodity-trading/:pair?" component={() => (
        <LayoutWrapper>
          <CommodityTrading />
        </LayoutWrapper>
      )} />
      
      {/* Professional trading interfaces with TradingView charts */}
      <Route path="/forex-trading-pro/:pair?" component={() => (
        <LayoutWrapper>
          <ForexTradingPro />
        </LayoutWrapper>
      )} />
      <Route path="/crypto-trading-pro/:pair?" component={() => (
        <LayoutWrapper>
          <CryptoTradingPro />
        </LayoutWrapper>
      )} />
      {/* Commodity Pro mode disabled per user request */}
      
      {/* API Trading and Algorithmic Trading */}
      <Route path="/api-keys" component={() => (
        <LayoutWrapper>
          <ApiKeys />
        </LayoutWrapper>
      )} />
      <Route path="/algorithmic-trading" component={() => (
        <LayoutWrapper>
          <AlgorithmicTrading />
        </LayoutWrapper>
      )} />
      
      <Route component={() => (
        <LayoutWrapper>
          <NotFound />
        </LayoutWrapper>
      )} />
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
