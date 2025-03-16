import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  BellIcon, 
  Menu, 
  MessageSquare, 
  Wallet as WalletIcon,
  ChevronDown, 
  LogOut, 
  User, 
  Settings,
  HelpCircle,
  Copy
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { useWallet } from "@/hooks/useWallet";
import { useAppContext } from "@/context/AppContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const { walletAddress, isConnecting, connectPhantom, connectMetaMask, connectICPWallet, disconnectWallet } = useWallet();
  const { currentUser } = useAppContext();
  
  // Just call connectPhantom directly for simplicity
  const handleConnectWallet = () => {
    connectPhantom();
  };

  const copyAddressToClipboard = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
    }
  };

  return (
    <header className="border-b border-primary-700/50 bg-primary-900 py-2.5 px-4 sm:px-6 flex items-center justify-between h-14">
      <div className="flex items-center">
        {/* Mobile menu button */}
        <button 
          onClick={toggleSidebar} 
          className="md:hidden mr-4 text-neutral-300 hover:text-white"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <span className="text-[#f7a600] text-xl font-bold">Fly<span className="text-white">Crypto</span></span>
          </div>
        </Link>
      </div>
      
      <div className="flex items-center space-x-2 sm:space-x-4">
        <div className="hidden md:flex items-center space-x-3">
          <button className="text-muted-foreground hover:text-white transition-colors p-1.5 rounded-full hover:bg-primary-800">
            <BellIcon className="h-5 w-5" />
          </button>
          
          <button className="text-muted-foreground hover:text-white transition-colors p-1.5 rounded-full hover:bg-primary-800">
            <MessageSquare className="h-5 w-5" />
          </button>
        </div>
        
        <ThemeToggle />
        
        {walletAddress ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="border-primary-700/70 hover:bg-primary-800 hover:border-primary-700 text-sm font-medium px-3 h-9">
                <WalletIcon className="h-4 w-4 mr-2 text-[#f7a600]" />
                <span className="hidden sm:inline-block mr-1">Wallet:</span>
                <span className="text-[#f7a600]">{walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}</span>
                <ChevronDown className="h-3.5 w-3.5 ml-1.5 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 bg-primary-900 border-primary-700/50">
              <DropdownMenuLabel className="flex flex-col">
                <span className="text-sm font-normal text-muted-foreground">Connected Wallet</span>
                <div className="flex items-center mt-1">
                  <span className="text-sm font-medium truncate">
                    {walletAddress.slice(0, 10)}...{walletAddress.slice(-8)}
                  </span>
                  <button 
                    onClick={copyAddressToClipboard}
                    className="ml-1.5 p-1 rounded-full hover:bg-primary-800"
                  >
                    <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-primary-700/50" />
              
              <DropdownMenuGroup>
                <DropdownMenuItem className="flex items-center cursor-pointer hover:bg-primary-800">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center cursor-pointer hover:bg-primary-800">
                  <Settings className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Wallet Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center cursor-pointer hover:bg-primary-800">
                  <HelpCircle className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Help & Support</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              
              <DropdownMenuSeparator className="bg-primary-700/50" />
              <DropdownMenuItem 
                onClick={disconnectWallet} 
                className="flex text-red-500 cursor-pointer hover:bg-primary-800"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>Disconnect Wallet</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button 
            onClick={handleConnectWallet} 
            size="sm"
            className="bg-[#f7a600] hover:bg-[#f7a600]/90 text-black font-medium h-9"
            disabled={isConnecting}
          >
            <WalletIcon className="h-4 w-4 mr-1.5" />
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </Button>
        )}
        
        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-1.5 rounded-full focus:outline-none" aria-label="User menu">
              <Avatar className="h-8 w-8 border border-primary-700/70">
                <AvatarImage src="/avatar.png" alt="Avatar" />
                <AvatarFallback className="bg-primary-800 text-xs">FC</AvatarFallback>
              </Avatar>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 bg-primary-900 border-primary-700/50">
            <div className="flex items-center p-2.5 gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatar.png" alt="Avatar" />
                <AvatarFallback className="bg-primary-800 text-xs">FC</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Trader</span>
                <span className="text-xs text-muted-foreground">Premium Account</span>
              </div>
            </div>
            <DropdownMenuSeparator className="bg-primary-700/50" />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer hover:bg-primary-800">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-primary-800">
                <Settings className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Settings</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-primary-700/50" />
            <DropdownMenuItem className="cursor-pointer hover:bg-primary-800 text-red-500">
              <LogOut className="h-4 w-4 mr-2" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
