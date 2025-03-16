import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  DollarSign,
  Package,
  Home as HomeIcon,
  ArrowLeft,
  BarChart3,
  LineChart
} from "lucide-react";
import { Bitcoin } from "lucide-react";

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
      route: '/forex-trading', 
      proRoute: '/forex-trading-pro',
      icon: <DollarSign className="h-6 w-6 text-accent-500" />, 
      description: 'Trade major, minor and exotic currency pairs with tight spreads and SL/TP features.' 
    },
    { 
      id: 2, 
      name: 'Crypto Perpetuals', 
      route: '/crypto-trading', 
      proRoute: '/crypto-trading-pro',
      icon: <Bitcoin className="h-6 w-6 text-accent-500" />, 
      description: 'Trade perpetual futures on major cryptocurrencies with up to 100x leverage.' 
    },
    { 
      id: 3, 
      name: 'Commodity Trading', 
      route: '/commodity-trading', 
      proRoute: '/commodity-trading-pro',
      icon: <Package className="h-6 w-6 text-accent-500" />, 
      description: 'Trade gold, silver, oil and other commodities with competitive pricing.' 
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
    
    // Navigate to the appropriate trading page immediately
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
  };
  
  // Navigation now happens directly in handleSelectCategory

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
          <div className="text-center mb-4">
            <div className="inline-block bg-primary-800 px-4 py-2 rounded-full text-accent-500 font-medium mb-6">
              Selected Network: <span className="text-white font-bold">{blockchainName}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Select a <span className="text-accent-500">Trading Category</span>
            </h1>
            <p className="text-lg text-neutral-300 max-w-2xl mx-auto mb-12">
              Choose the type of market you want to trade on. Each category offers
              specialized tools and features designed for that market.
            </p>
          </div>
          
          {/* Interface Mode Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-primary-800 rounded-lg p-3 flex items-center">
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <BarChart3 className={`h-4 w-4 ${!useProfessionalMode ? 'text-accent-500' : 'text-neutral-400'}`} />
                  <span className={`text-sm ${!useProfessionalMode ? 'text-white font-medium' : 'text-neutral-400'}`}>Basic Interface</span>
                </div>
                
                <Switch 
                  checked={useProfessionalMode} 
                  onCheckedChange={setUseProfessionalMode}
                  className="data-[state=checked]:bg-accent-500"
                  disabled={selectedCategory === 'Commodity Trading'}
                />
                
                <div className="flex items-center space-x-2">
                  <LineChart className={`h-4 w-4 ${useProfessionalMode ? 'text-accent-500' : 'text-neutral-400'}`} />
                  <span className={`text-sm ${useProfessionalMode ? 'text-white font-medium' : 'text-neutral-400'}`}>Professional Interface</span>
                </div>
                
                {selectedCategory === 'Commodity Trading' && (
                  <div className="ml-2 text-xs text-amber-500">
                    * Pro mode not available for Commodity Trading
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {categories.map((category) => (
              <Card 
                key={category.id}
                className={`bg-primary-800 border-2 transition-colors cursor-pointer hover:bg-primary-700 ${
                  selectedCategory === category.name 
                    ? 'border-accent-500' 
                    : 'border-primary-700'
                }`}
                onClick={() => handleSelectCategory(category.name)}
              >
                <CardContent className="pt-6">
                  <div className="mb-4 bg-accent-500/20 w-12 h-12 rounded-lg flex items-center justify-center">
                    {category.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                  <p className="text-neutral-300 mb-4">
                    {category.description}
                  </p>
                  {selectedCategory === category.name && (
                    <div className="w-full bg-accent-500/20 py-1 px-2 rounded text-accent-500 mt-2 text-center">
                      Selected
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-start">
            <Button 
              onClick={() => navigate("/select-blockchain")} 
              variant="outline"
              className="border-accent-500 text-accent-500 hover:bg-accent-500/10"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Back to Networks
            </Button>
          </div>
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