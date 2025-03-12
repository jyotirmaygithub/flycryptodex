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
  Package
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
    <div className="min-h-screen flex flex-col bg-primary-900 text-white">
      {/* Header */}
      <header className="border-b border-primary-700 bg-primary-800 py-3 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-accent-500 text-xl font-bold">Fly<span className="text-white">Crypto</span></span>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          
          <Button 
            onClick={() => navigate("/select-blockchain")} 
            className="bg-accent-500 hover:bg-accent-600 text-white"
          >
            Dashboard
          </Button>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-primary-900">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Trade Forex, Crypto & Commodities on a 
                <span className="text-accent-500"> Decentralized</span> Exchange
              </h1>
              <p className="text-lg text-neutral-300 mb-8">
                FlyCrypto DEX offers secure, high-leverage trading with AI-powered strategy recommendations,
                real-time market data, and advanced charting tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleGetStarted} 
                  className="bg-accent-500 hover:bg-accent-600 text-white text-lg py-6 px-8"
                >
                  Start Demo Trading
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  onClick={() => navigate("/select-blockchain")} 
                  variant="outline" 
                  className="text-accent-500 border-accent-500 hover:bg-accent-500/10 text-lg py-6 px-8"
                >
                  <Wallet className="mr-2 h-5 w-5" />
                  Connect Wallet
                </Button>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative">
                <div className="w-[350px] h-[350px] bg-accent-500/20 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                <div className="relative z-10">
                  <BarChart2 className="h-[300px] w-[300px] text-accent-500" strokeWidth={1} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-primary-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Premium Trading Features
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-primary-700 border-primary-600">
              <CardContent className="pt-6">
                <div className="mb-4 bg-accent-500/20 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Zap className="h-6 w-6 text-accent-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Lightning Fast Execution</h3>
                <p className="text-neutral-300">
                  Execute trades with millisecond precision on our high-performance trading infrastructure.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-primary-700 border-primary-600">
              <CardContent className="pt-6">
                <div className="mb-4 bg-accent-500/20 w-12 h-12 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-accent-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">AI-Powered Strategies</h3>
                <p className="text-neutral-300">
                  Get intelligent trade recommendations based on real-time market analysis and advanced algorithms.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-primary-700 border-primary-600">
              <CardContent className="pt-6">
                <div className="mb-4 bg-accent-500/20 w-12 h-12 rounded-lg flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6 text-accent-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Secure & Decentralized</h3>
                <p className="text-neutral-300">
                  Trade with confidence on our secure platform with non-custodial wallet integration.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Trading Categories */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-primary-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-center">
            Multiple Markets, One Platform
          </h2>
          <p className="text-center text-neutral-300 mb-12 max-w-2xl mx-auto">
            Choose from a variety of trading categories all with up to 100x leverage
            and advanced trading tools.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-primary-800 border-primary-700 hover:border-accent-500 transition-colors cursor-pointer" onClick={() => handleSelectTrading("Forex Derivatives")}>
              <CardContent className="pt-6">
                <div className="mb-4 bg-accent-500/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-accent-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Forex Derivatives</h3>
                <p className="text-neutral-300 mb-4">
                  Trade major, minor and exotic currency pairs with tight spreads and deep liquidity.
                </p>
                <Button variant="ghost" className="pl-0 text-accent-500">
                  Start Trading <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-primary-800 border-primary-700 hover:border-accent-500 transition-colors cursor-pointer" onClick={() => handleSelectTrading("Crypto Derivatives")}>
              <CardContent className="pt-6">
                <div className="mb-4 bg-accent-500/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Bitcoin className="h-6 w-6 text-accent-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Crypto Derivatives</h3>
                <p className="text-neutral-300 mb-4">
                  Trade perpetual futures on major cryptocurrencies with up to 100x leverage.
                </p>
                <Button variant="ghost" className="pl-0 text-accent-500">
                  Start Trading <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-primary-800 border-primary-700 hover:border-accent-500 transition-colors cursor-pointer" onClick={() => handleSelectTrading("Commodity Trading")}>
              <CardContent className="pt-6">
                <div className="mb-4 bg-accent-500/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-accent-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">Commodity Trading</h3>
                <p className="text-neutral-300 mb-4">
                  Trade gold, silver, oil and other commodities with competitive pricing.
                </p>
                <Button variant="ghost" className="pl-0 text-accent-500">
                  Start Trading <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Blockchain Support */}
      <section className="py-16 px-4 md:px-8 lg:px-16 bg-primary-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Supported Blockchains
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blockchains.map((blockchain) => (
              <Card 
                key={blockchain.id}
                className="bg-primary-700 border-primary-600 hover:border-accent-500 transition-colors cursor-pointer"
                onClick={() => navigate("/select-blockchain")}
              >
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="mb-4 bg-accent-500/20 w-16 h-16 rounded-full flex items-center justify-center">
                    <Globe className="h-8 w-8 text-accent-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{blockchain.name}</h3>
                  <p className="text-neutral-300">
                    Trade on the {blockchain.name} blockchain with fast settlements and low fees.
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 px-4 md:px-8 lg:px-16 bg-primary-900 border-t border-primary-700">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <span className="text-accent-500 text-xl font-bold">Fly<span className="text-white">Crypto</span></span>
          </div>
          
          <div className="text-neutral-400 text-sm">
            © {new Date().getFullYear()} FlyCrypto DEX. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
