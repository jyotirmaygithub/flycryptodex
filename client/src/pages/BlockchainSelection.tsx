import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Blockchain } from "@shared/schema";
import {
  Globe,
  Home as HomeIcon,
  ChevronRight,
  Check
} from "lucide-react";
import { SiSolana, SiInternetcomputer, SiEthereum } from "react-icons/si";

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
        return (
          <div className="bg-gradient-to-br from-purple-600 to-blue-500 p-5 rounded-full shadow-lg shadow-purple-500/20">
            <SiSolana className="h-12 w-12 text-white" />
          </div>
        );
      case 'ICP':
        return (
          <div className="bg-gradient-to-br from-indigo-600 to-sky-400 p-5 rounded-full shadow-lg shadow-indigo-500/20">
            <SiInternetcomputer className="h-12 w-12 text-white" />
          </div>
        );
      case 'Base':
        return (
          <div className="bg-gradient-to-br from-blue-700 to-blue-500 p-5 rounded-full shadow-lg shadow-blue-500/20">
            <SiEthereum className="h-12 w-12 text-white" />
          </div>
        );
      default:
        return (
          <div className="bg-gradient-to-br from-gray-700 to-gray-900 p-5 rounded-full">
            <Globe className="h-12 w-12 text-white" />
          </div>
        );
    }
  };

  const handleSelectBlockchain = (id: number) => {
    setSelectedBlockchain(id);
    
    // Save blockchain selection to localStorage
    localStorage.setItem('selectedBlockchainId', id.toString());
    const blockchain = blockchains.find(b => b.id === id);
    localStorage.setItem('selectedBlockchainName', blockchain?.name || '');
    
    // Navigate to category selection
    setTimeout(() => {
      navigate("/select-category");
    }, 300); // Small delay for visual feedback
  };

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
            onClick={() => navigate("/")} 
            variant="ghost"
            className="text-white hover:bg-[#22262f] transition-colors"
            size="sm"
          >
            <HomeIcon className="h-4 w-4 mr-2" />
            Home
          </Button>
        </div>
      </header>
      
      {/* Main Content - Bybit style */}
      <main className="flex-1 py-12 px-4 md:px-8 lg:px-16 flex flex-col">
        <div className="max-w-4xl mx-auto w-full">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-neutral-400 mb-8">
            <span onClick={() => navigate("/")} className="cursor-pointer hover:text-[#f7a600]">Home</span>
            <ChevronRight className="h-3 w-3 mx-2" />
            <span className="text-[#f7a600]">Select Network</span>
          </div>
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#f7a600]/10 text-[#f7a600] font-medium mb-6">
              <Globe className="w-4 h-4 mr-2" />
              Network Selection
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              Choose a <span className="text-[#f7a600]">Blockchain Network</span>
            </h1>
            <p className="text-neutral-400 max-w-2xl mx-auto leading-relaxed">
              Select the blockchain network you want to connect to for trading.
              Each network offers different features, fees, and settlement times.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {blockchains.map((blockchain) => (
              <div 
                key={blockchain.id}
                className={`bybit-card p-6 transition-all duration-300 cursor-pointer hover:shadow-lg 
                  ${selectedBlockchain === blockchain.id 
                    ? 'border-[#f7a600] shadow-[#f7a600]/10' 
                    : 'hover:border-[#f7a600]/50'}`
                }
                onClick={() => handleSelectBlockchain(blockchain.id)}
              >
                <div className="relative">
                  {selectedBlockchain === blockchain.id && (
                    <div className="absolute -right-2 -top-2 bg-[#f7a600] text-white p-1 rounded-full">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                  
                  <div className="flex flex-col items-center text-center">
                    {getBlockchainIcon(blockchain.name)}
                    <h3 className="text-xl font-bold mt-6 mb-3">{blockchain.name}</h3>
                    <p className="text-neutral-400 mb-4 text-sm leading-relaxed">
                      {blockchain.name === 'Solana' && 'Fast, scalable network with low transaction fees. Ideal for high-frequency trading.'}
                      {blockchain.name === 'ICP' && 'Decentralized cloud computing platform with high security and reliability.'}
                      {blockchain.name === 'Base' && 'Ethereum L2 optimized for DeFi applications with enhanced compatibility.'}
                    </p>
                    
                    <div className={`w-full py-2 px-3 rounded-md mt-2 font-medium flex justify-center items-center
                      ${selectedBlockchain === blockchain.id 
                        ? 'bg-[#f7a600] text-white' 
                        : 'bg-[#22262f] text-neutral-300 hover:bg-[#f7a600]/10 hover:text-[#f7a600]'}`
                    }>
                      {selectedBlockchain === blockchain.id ? 'Selected' : 'Select'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center text-neutral-400 text-sm">
            <p>All blockchain networks support the same trading pairs and functionalities.</p>
            <p className="mt-2">Need help? <span className="text-[#f7a600] cursor-pointer">Contact support</span></p>
          </div>
        </div>
      </main>
      
      {/* Footer - Bybit style */}
      <footer className="py-6 px-4 md:px-8 lg:px-16 bg-[#0b0e11] border-t border-[var(--border-color)]">
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