import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Switch } from "@/components/ui/switch";
import {
  ArrowRight,
  Package,
  Home as HomeIcon,
  ArrowLeft,
  BarChart3,
  LineChart,
  ChevronRight,
  Check
} from "lucide-react";
import { SiBitcoin, SiCoinmarketcap, SiGoldmansachs } from "react-icons/si";
import { BsBank } from "react-icons/bs";

export default function CategorySelection() {
  const [, navigate] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [blockchainName, setBlockchainName] = useState<string>("");
  const [useProfessionalMode, setUseProfessionalMode] = useState<boolean>(true);
  
  useEffect(() => {
    // Get blockchain selection from localStorage
    const blockchainName = localStorage.getItem('selectedBlockchainName');
    if (!blockchainName) {
      navigate("/select-blockchain");
    } else {
      setBlockchainName(blockchainName);
    }
  }, [navigate]);

  // Trading categories
  const categories = [
    { 
      id: 1, 
      name: 'Forex Derivatives', 
      shortName: 'Forex',
      route: '/forex-trading', 
      proRoute: '/forex-trading-pro',
      icon: <BsBank className="h-6 w-6 text-[#1da2b4]" />, 
      description: 'Trade major, minor and exotic currency pairs with tight spreads and SL/TP features.',
      bgColor: 'bg-[#1da2b4]/20',
      pairs: '50+ pairs'
    },
    { 
      id: 2, 
      name: 'Crypto Perpetuals', 
      shortName: 'Crypto',
      route: '/crypto-trading', 
      proRoute: '/crypto-trading-pro',
      icon: <SiBitcoin className="h-6 w-6 text-[#4a4af4]" />, 
      description: 'Trade perpetual futures on major cryptocurrencies with up to 100x leverage.',
      bgColor: 'bg-[#4a4af4]/20',
      pairs: '100+ coins'
    },
    { 
      id: 3, 
      name: 'Commodity Trading', 
      shortName: 'Commodities',
      route: '/commodity-trading', 
      proRoute: '/commodity-trading-pro',
      icon: <SiGoldmansachs className="h-6 w-6 text-[#f7a600]" />, 
      description: 'Trade gold, silver, oil and other commodities with competitive pricing.',
      bgColor: 'bg-[#f7a600]/20',
      pairs: '30+ commodities'
    }
  ];

  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
    
    // Force professional mode to be off for Commodity Trading
    if (categoryName === 'Commodity Trading') {
      setUseProfessionalMode(false);
    }
    
    // Save category selection to localStorage
    localStorage.setItem('selectedCategory', categoryName);
    localStorage.setItem('useProfessionalMode', String(categoryName === 'Commodity Trading' ? false : useProfessionalMode));
    
    // Navigate to the appropriate trading page after a small delay for UI feedback
    setTimeout(() => {
      const category = categories.find(c => c.name === categoryName);
      if (category) {
        // Special handling for Commodity Trading (no pro mode)
        if (category.name === 'Commodity Trading') {
          navigate(category.route);
          return;
        }
        
        // For other categories, use pro route if professional mode is enabled
        const route = useProfessionalMode ? category.proRoute : category.route;
        navigate(route);
      }
    }, 300);
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
            <span onClick={() => navigate("/select-blockchain")} className="cursor-pointer hover:text-[#f7a600]">Select Network</span>
            <ChevronRight className="h-3 w-3 mx-2" />
            <span className="text-[#f7a600]">Trading Category</span>
          </div>
          
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-md bg-[#181c25] text-white font-medium mb-6">
              Network: <span className="text-[#f7a600] ml-2 font-bold">{blockchainName}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Select Trading <span className="text-[#f7a600]">Category</span>
            </h1>
            <p className="text-neutral-400 max-w-3xl leading-relaxed">
              Choose the type of market you want to trade on. Each category offers
              specialized tools and features designed for that market.
            </p>
          </div>
          
          {/* Interface Mode Toggle - Bybit style */}
          <div className="flex justify-center mb-10">
            <div className="bybit-card py-3 px-4 flex items-center">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <BarChart3 className={`h-4 w-4 ${!useProfessionalMode ? 'text-[#f7a600]' : 'text-neutral-400'}`} />
                  <span className={`text-sm font-medium ${!useProfessionalMode ? 'text-white' : 'text-neutral-400'}`}>Basic Mode</span>
                </div>
                
                <Switch 
                  checked={useProfessionalMode} 
                  onCheckedChange={setUseProfessionalMode}
                  className="data-[state=checked]:bg-[#f7a600]"
                  disabled={selectedCategory === 'Commodity Trading'}
                />
                
                <div className="flex items-center space-x-2">
                  <LineChart className={`h-4 w-4 ${useProfessionalMode ? 'text-[#f7a600]' : 'text-neutral-400'}`} />
                  <span className={`text-sm font-medium ${useProfessionalMode ? 'text-white' : 'text-neutral-400'}`}>Pro Mode</span>
                </div>
                
                {selectedCategory === 'Commodity Trading' && (
                  <div className="ml-2 text-xs text-amber-500 bg-amber-500/10 px-2 py-1 rounded">
                    Pro mode unavailable for Commodities
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {categories.map((category) => (
              <div 
                key={category.id}
                className={`bybit-card p-6 hover:shadow-lg transition-all duration-300 cursor-pointer relative 
                  ${selectedCategory === category.name 
                    ? 'border-[#f7a600] shadow-[#f7a600]/10' 
                    : 'hover:border-[#f7a600]/50'}`
                }
                onClick={() => handleSelectCategory(category.name)}
              >
                {selectedCategory === category.name && (
                  <div className="absolute -right-2 -top-2 bg-[#f7a600] text-white p-1 rounded-full z-10">
                    <Check className="h-4 w-4" />
                  </div>
                )}
                
                <div className="mb-4">
                  <div className={`${category.bgColor} w-12 h-12 rounded-lg flex items-center justify-center`}>
                    {category.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-2">{category.shortName}</h3>
                <p className="text-neutral-400 mb-4 text-sm">
                  {category.description}
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-neutral-500">{category.pairs}</span>
                  
                  <div className={`py-1 px-3 rounded text-sm font-medium 
                    ${selectedCategory === category.name 
                      ? 'bg-[#f7a600] text-white' 
                      : 'bg-[#22262f] text-neutral-300 hover:bg-[#f7a600]/10 hover:text-[#f7a600]'}`
                  }>
                    {selectedCategory === category.name ? 'Selected' : 'Select'}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-start">
            <Button 
              onClick={() => navigate("/select-blockchain")} 
              variant="outline"
              className="border-[#f7a600] text-[#f7a600] hover:bg-[#f7a600]/10"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Networks
            </Button>
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