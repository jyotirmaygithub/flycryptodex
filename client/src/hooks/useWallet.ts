import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

type WalletType = 'phantom' | 'metamask' | 'icpwallet' | null;

export function useWallet() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<WalletType>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const connectPhantom = async () => {
    try {
      setIsConnecting(true);
      
      // Check if Phantom is installed
      const phantom = (window as any).phantom?.solana;
      
      if (!phantom) {
        toast({
          title: "Phantom wallet not found",
          description: "Please install Phantom wallet extension",
          variant: "destructive"
        });
        return false;
      }
      
      // Simulate connection for MVP
      setTimeout(() => {
        const mockAddress = "8xJG2Pg42L5FcZuBUJjrPE3YvH6yKnNZqP9gRwRC5o3h";
        setWalletAddress(mockAddress);
        setWalletType('phantom');
        setIsConnecting(false);
        
        toast({
          title: "Wallet Connected",
          description: `Connected to Phantom wallet: ${mockAddress.slice(0, 6)}...${mockAddress.slice(-4)}`,
        });
      }, 1000);
      
      return true;
    } catch (error) {
      console.error('Error connecting to Phantom wallet:', error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to Phantom wallet",
        variant: "destructive"
      });
      setIsConnecting(false);
      return false;
    }
  };

  const connectMetaMask = async () => {
    try {
      setIsConnecting(true);
      
      // Check if MetaMask is installed
      const ethereum = (window as any).ethereum;
      
      if (!ethereum) {
        toast({
          title: "MetaMask not found",
          description: "Please install MetaMask extension",
          variant: "destructive"
        });
        return false;
      }
      
      // Simulate connection for MVP
      setTimeout(() => {
        const mockAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";
        setWalletAddress(mockAddress);
        setWalletType('metamask');
        setIsConnecting(false);
        
        toast({
          title: "Wallet Connected",
          description: `Connected to MetaMask: ${mockAddress.slice(0, 6)}...${mockAddress.slice(-4)}`,
        });
      }, 1000);
      
      return true;
    } catch (error) {
      console.error('Error connecting to MetaMask:', error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to MetaMask",
        variant: "destructive"
      });
      setIsConnecting(false);
      return false;
    }
  };

  const connectICPWallet = async () => {
    try {
      setIsConnecting(true);
      
      // Simulate connection for MVP
      setTimeout(() => {
        const mockAddress = "rrkah-fqaaa-aaaaa-aaaaq-cai";
        setWalletAddress(mockAddress);
        setWalletType('icpwallet');
        setIsConnecting(false);
        
        toast({
          title: "Wallet Connected",
          description: `Connected to ICP wallet: ${mockAddress.slice(0, 6)}...${mockAddress.slice(-4)}`,
        });
      }, 1000);
      
      return true;
    } catch (error) {
      console.error('Error connecting to ICP wallet:', error);
      toast({
        title: "Connection Failed",
        description: "Could not connect to ICP wallet",
        variant: "destructive"
      });
      setIsConnecting(false);
      return false;
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setWalletType(null);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  return {
    walletAddress,
    walletType,
    isConnecting,
    connectPhantom,
    connectMetaMask,
    connectICPWallet,
    disconnectWallet
  };
}
