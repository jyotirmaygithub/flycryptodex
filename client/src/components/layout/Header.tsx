import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { useWallet } from "@/hooks/useWallet";
import { TradingLogo, BybitLogo } from "@/components/ui/logo";
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
    <header className="bybit-nav border-b border-[var(--border-color)] bg-[#0b0e11] py-3 px-4 sm:px-6 flex items-center justify-between">
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
            <TradingLogo size={36} />
            <BybitLogo className="ml-2 text-xl" />
          </a>
        </Link>
      </div>
      
      <div className="flex items-center space-x-4">
        <ThemeToggle />
        
        {walletAddress ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-[#f7a600] text-[#f7a600] hover:bg-[#f7a600]/10">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#181c25] border-[var(--border-color)]">
              <DropdownMenuLabel className="text-white">My Wallet</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[var(--border-color)]" />
              <DropdownMenuItem 
                onClick={disconnectWallet} 
                className="text-neutral-300 hover:text-white hover:bg-[#22262f] cursor-pointer"
              >
                Disconnect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button 
            onClick={handleConnectWallet} 
            className="bg-[#f7a600] hover:bg-[#f7a600]/90 text-black font-medium"
            disabled={isConnecting}
          >
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        )}
      </div>
    </header>
  );
}
