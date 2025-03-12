import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { useWallet } from "@/hooks/useWallet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const { walletAddress, isConnecting, connectPhantom, connectMetaMask, connectICPWallet, disconnectWallet } = useWallet();
  const { selectedBlockchain } = useAppContext();

  const handleConnectWallet = () => {
    switch (selectedBlockchain) {
      case 'Solana':
        connectPhantom();
        break;
      case 'Base':
        connectMetaMask();
        break;
      case 'ICP':
        connectICPWallet();
        break;
      default:
        connectPhantom();
    }
  };

  return (
    <header className="border-b border-primary-700 bg-primary-800 py-3 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center">
        {/* Mobile menu button */}
        <button 
          onClick={toggleSidebar} 
          className="md:hidden mr-4 text-neutral-300 hover:text-white"
        >
          <Menu className="h-6 w-6" />
        </button>
        
        <Link href="/">
          <a className="flex items-center">
            <span className="text-accent-500 text-xl font-bold">Fly<span className="text-white">Crypto</span></span>
          </a>
        </Link>
      </div>
      
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        
        {walletAddress ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-accent-500 text-accent-500">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Wallet</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={disconnectWallet}>Disconnect</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button 
            onClick={handleConnectWallet} 
            className="bg-accent-500 hover:bg-accent-600 text-white"
            disabled={isConnecting}
          >
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        )}
      </div>
    </header>
  );
}
