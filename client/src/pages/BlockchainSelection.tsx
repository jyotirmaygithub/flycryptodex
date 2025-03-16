import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Blockchain } from "@shared/schema";
import {
  Globe,
  Home as HomeIcon
} from "lucide-react";
import { SiSolana, SiInternetcomputer, SiCoinbase } from "react-icons/si";

export default function BlockchainSelection() {
  const [, navigate] = useLocation();
  const [selectedBlockchain, setSelectedBlockchain] = useState<number | null>(null);
  
  // Static blockchain data for the MVP
  const blockchains: Blockchain[] = [
    { id: 1, name: 'Solana', isActive: true },
    { id: 2, name: 'ICP', isActive: true },
    { id: 3, name: 'Base', isActive: true }
  ];

  const getBlockchainIcon = (name: string) => {
    switch (name) {
      case 'Solana':
        return <SiSolana className="h-8 w-8 text-accent-500" />;
      case 'ICP':
        return <SiInternetcomputer className="h-8 w-8 text-accent-500" />;
      case 'Base':
        return <SiCoinbase className="h-8 w-8 text-accent-500" />;
      default:
        return <Globe className="h-8 w-8 text-accent-500" />;
    }
  };

  const handleSelectBlockchain = (id: number) => {
    setSelectedBlockchain(id);
    
    // Save blockchain selection to localStorage
    localStorage.setItem('selectedBlockchainId', id.toString());
    const blockchain = blockchains.find(b => b.id === id);
    localStorage.setItem('selectedBlockchainName', blockchain?.name || '');
    
    // Navigate to category selection
    navigate("/select-category");
  };
  
  // Navigation now happens directly in handleSelectBlockchain

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
            onClick={() => navigate("/")} 
            variant="ghost"
            className="text-white"
            size="sm"
          >
            <HomeIcon className="h-4 w-4 mr-2" />
            Home
          </Button>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 py-16 px-4 md:px-8 lg:px-16 flex flex-col">
        <div className="max-w-4xl mx-auto w-full">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Select a <span className="text-accent-500">Blockchain</span>
            </h1>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
              Choose the blockchain network you want to connect to for trading.
              Each blockchain offers different features and fee structures.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {blockchains.map((blockchain) => (
              <Card 
                key={blockchain.id}
                className={`bg-primary-800 border-2 transition-colors cursor-pointer hover:bg-primary-700 ${
                  selectedBlockchain === blockchain.id 
                    ? 'border-accent-500' 
                    : 'border-primary-700'
                }`}
                onClick={() => handleSelectBlockchain(blockchain.id)}
              >
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <div className="mb-4 bg-accent-500/20 w-20 h-20 rounded-full flex items-center justify-center">
                    {getBlockchainIcon(blockchain.name)}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{blockchain.name}</h3>
                  <p className="text-neutral-300 mb-4">
                    {blockchain.name === 'Solana' && 'Fast, scalable network with low transaction fees. Ideal for high-frequency trading.'}
                    {blockchain.name === 'ICP' && 'Decentralized cloud computing platform with high security and reliability.'}
                    {blockchain.name === 'Base' && 'Ethereum L2 optimized for DeFi applications with enhanced compatibility.'}
                  </p>
                  {selectedBlockchain === blockchain.id && (
                    <div className="w-full bg-accent-500/20 py-1 px-2 rounded text-accent-500 mt-2">
                      Selected
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Navigation happens automatically when a blockchain is selected */}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="py-6 px-4 md:px-8 lg:px-16 bg-primary-900 border-t border-primary-700">
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