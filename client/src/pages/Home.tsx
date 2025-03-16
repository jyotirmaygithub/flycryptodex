import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  BarChart2,
  Wallet,
  Globe,
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowRight,
  DollarSign,
  Bitcoin,
  Package,
  LineChart,
  ChevronRight
} from "lucide-react";

export default function Home() {
  const [, navigate] = useLocation();
  
  const handleGetStarted = () => {
    navigate("/select-blockchain");
  };
  
  const handleSelectTrading = (category: string) => {
    // First go to blockchain selection
    navigate("/select-blockchain", { state: { nextCategory: category } });
  };

  // Static blockchain data for the MVP
  const blockchains = [
    { id: 1, name: 'Solana' },
    { id: 2, name: 'ICP' },
    { id: 3, name: 'Base' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0e11] text-white">
      {/* Header - Bybit style */}
      <header className="bybit-nav py-3 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-[#f7a600] text-xl font-bold">Fly<span className="text-white">Crypto</span></span>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          <Button 
            onClick={() => navigate("/select-blockchain")} 
            className="bybit-button-primary px-4 py-2"
          >
            Dashboard
          </Button>
        </div>
      </header>
      
      {/* Hero Section - Bybit style */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-[#0b0e11] border-b border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Trade Crypto, Forex & Commodities with 
                <span className="text-[#f7a600]"> Powerful Tools</span>
              </h1>
              <p className="text-lg text-neutral-300 mb-8">
                FlyCrypto offers a professional trading experience with advanced charting, 
                AI-powered insights, and multi-market trading all on one platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleGetStarted} 
                  className="bybit-button-primary text-lg py-6 px-8"
                >
                  Start Trading Now
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  onClick={() => navigate("/select-blockchain")} 
                  variant="outline" 
                  className="border-[#f7a600] text-[#f7a600] hover:bg-[#f7a600]/10 text-lg py-6 px-8"
                >
                  <Wallet className="mr-2 h-5 w-5" />
                  Connect Wallet
                </Button>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="w-[350px] h-[350px] bg-[#f7a600]/10 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                <div className="relative z-10">
                  <LineChart className="h-[300px] w-[300px] text-[#f7a600]" strokeWidth={1} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Banner - Bybit style */}
      <section className="py-8 bg-[#181c25] border-y border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 px-4">
          <div className="text-center">
            <p className="text-neutral-400 text-sm">24h Trading Volume</p>
            <p className="text-2xl font-bold">$12.4B</p>
          </div>
          <div className="text-center">
            <p className="text-neutral-400 text-sm">Open Interest</p>
            <p className="text-2xl font-bold">$8.7B</p>
          </div>
          <div className="text-center">
            <p className="text-neutral-400 text-sm">Active Traders</p>
            <p className="text-2xl font-bold">125K+</p>
          </div>
          <div className="text-center">
            <p className="text-neutral-400 text-sm">Available Markets</p>
            <p className="text-2xl font-bold">180+</p>
          </div>
        </div>
      </section>
      
      {/* Features - Bybit style */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-[#0b0e11]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center">
            Trade Like a Professional
          </h2>
          <p className="text-center text-neutral-400 mb-12 max-w-2xl mx-auto">
            Experience next-generation trading with our powerful platform
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bybit-card p-6 hover:border-[#f7a600] transition-colors">
              <div className="mb-4 bg-[#f7a600]/10 w-12 h-12 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-[#f7a600]" />
              </div>
              <h3 className="text-xl font-bold mb-2">API Trading</h3>
              <p className="text-neutral-400">
                Connect directly to our platform APIs for seamless integration and customized trading solutions.
              </p>
            </div>
            
            <div className="bybit-card p-6 hover:border-[#f7a600] transition-colors">
              <div className="mb-4 bg-[#f7a600]/10 w-12 h-12 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-[#f7a600]" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI-Powered Strategies</h3>
              <p className="text-neutral-400">
                Get intelligent trade recommendations based on real-time market analysis.
              </p>
            </div>
            
            <div className="bybit-card p-6 hover:border-[#f7a600] transition-colors">
              <div className="mb-4 bg-[#f7a600]/10 w-12 h-12 rounded-lg flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-[#f7a600]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Algo Trading</h3>
              <p className="text-neutral-400">
                Deploy automated trading strategies with our advanced algorithmic trading tools.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Trading Categories - Bybit style */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-[#181c25]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center">
            Multiple Markets, One Platform
          </h2>
          <p className="text-center text-neutral-400 mb-12 max-w-2xl mx-auto">
            Trade across different markets with advanced tools and deep liquidity
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bybit-card p-6 hover:shadow-lg hover:border-[#f7a600] transition-all cursor-pointer" 
              onClick={() => handleSelectTrading("Forex Derivatives")}>
              <div className="mb-4 bg-[#1da2b4]/20 w-12 h-12 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-[#1da2b4]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Forex</h3>
              <p className="text-neutral-400 mb-4">
                Trade major, minor and exotic currency pairs with tight spreads and deep liquidity.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-neutral-500">50+ pairs</span>
                <ChevronRight className="h-5 w-5 text-[#f7a600]" />
              </div>
            </div>
            
            <div className="bybit-card p-6 hover:shadow-lg hover:border-[#f7a600] transition-all cursor-pointer" 
              onClick={() => handleSelectTrading("Crypto Derivatives")}>
              <div className="mb-4 bg-[#4a4af4]/20 w-12 h-12 rounded-lg flex items-center justify-center">
                <Bitcoin className="h-6 w-6 text-[#4a4af4]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Crypto</h3>
              <p className="text-neutral-400 mb-4">
                Trade perpetual futures on major cryptocurrencies with up to 100x leverage.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-neutral-500">100+ coins</span>
                <ChevronRight className="h-5 w-5 text-[#f7a600]" />
              </div>
            </div>
            
            <div className="bybit-card p-6 hover:shadow-lg hover:border-[#f7a600] transition-all cursor-pointer" 
              onClick={() => handleSelectTrading("Commodity Trading")}>
              <div className="mb-4 bg-[#f7a600]/20 w-12 h-12 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-[#f7a600]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Commodities</h3>
              <p className="text-neutral-400 mb-4">
                Trade gold, silver, oil and other commodities with competitive pricing.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-neutral-500">30+ commodities</span>
                <ChevronRight className="h-5 w-5 text-[#f7a600]" />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Blockchain Support - Bybit style */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-[#0b0e11]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center">
            Supported Blockchains
          </h2>
          <p className="text-center text-neutral-400 mb-12 max-w-2xl mx-auto">
            Connect your wallet from multiple blockchain networks
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blockchains.map((blockchain) => (
              <div 
                key={blockchain.id}
                className="bybit-card p-6 flex flex-col items-center text-center hover:border-[#f7a600] transition-colors cursor-pointer"
                onClick={() => navigate("/select-blockchain")}
              >
                <div className="mb-4 bg-[#f7a600]/10 w-16 h-16 rounded-full flex items-center justify-center">
                  <Globe className="h-8 w-8 text-[#f7a600]" />
                </div>
                <h3 className="text-xl font-bold mb-2">{blockchain.name}</h3>
                <p className="text-neutral-400">
                  Trade on the {blockchain.name} blockchain with fast settlements and low fees.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Banner - Bybit style */}
      <section className="py-12 px-4 md:px-8 lg:px-16 bg-[#181c25] border-y border-[var(--border-color)]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start trading?</h2>
          <p className="text-neutral-400 mb-8 max-w-2xl mx-auto">
            Join thousands of traders and experience the most powerful trading platform
          </p>
          <Button 
            onClick={handleGetStarted} 
            className="bybit-button-primary text-lg py-6 px-10"
          >
            Start Trading Now
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
      
      {/* Footer - Bybit style */}
      <footer className="py-8 px-4 md:px-8 lg:px-16 bg-[#0b0e11] border-t border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-[#f7a600] text-xl font-bold">Fly<span className="text-white">Crypto</span></span>
          </div>
          
          <div className="text-neutral-500 text-sm">
            © {new Date().getFullYear()} FlyCrypto. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
