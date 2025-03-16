import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import {
  ArrowLeft,
  Code,
  KeyRound,
  RefreshCcw,
  Play,
  BookOpen,
  Shield,
  Copy,
  Clipboard,
  CheckCircle
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";

export default function ApiTrading() {
  const { darkMode } = useAppContext();
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();
  
  const sampleCodeSnippets = {
    javascript: `import axios from 'axios';

const API_KEY = 'your_api_key_here';
const API_SECRET = 'your_api_secret_here';
const BASE_URL = 'https://api.flycrypto.com/v1';

async function createOrder() {
  const timestamp = Date.now().toString();
  const path = '/orders';
  const body = {
    symbol: 'BTC-USDT',
    side: 'buy',
    type: 'limit',
    price: '25000',
    quantity: '0.01',
    timeInForce: 'GTC'
  };
  
  // Create signature
  const signature = createSignature(timestamp, 'POST', path, body, API_SECRET);
  
  try {
    const response = await axios.post(\`\${BASE_URL}\${path}\`, body, {
      headers: {
        'FC-API-KEY': API_KEY,
        'FC-API-TIMESTAMP': timestamp,
        'FC-API-SIGNATURE': signature
      }
    });
    
    console.log('Order created:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

// Call the function
createOrder();`,
    python: `import requests
import time
import hmac
import hashlib
import json

API_KEY = 'your_api_key_here'
API_SECRET = 'your_api_secret_here'
BASE_URL = 'https://api.flycrypto.com/v1'

def create_signature(timestamp, method, path, body, secret):
    message = timestamp + method + path
    if body:
        message += json.dumps(body)
    
    signature = hmac.new(
        bytes(secret, 'utf-8'),
        bytes(message, 'utf-8'),
        hashlib.sha256
    ).hexdigest()
    
    return signature

def create_order():
    timestamp = str(int(time.time() * 1000))
    path = '/orders'
    body = {
        'symbol': 'BTC-USDT',
        'side': 'buy',
        'type': 'limit',
        'price': '25000',
        'quantity': '0.01',
        'timeInForce': 'GTC'
    }
    
    # Create signature
    signature = create_signature(timestamp, 'POST', path, body, API_SECRET)
    
    try:
        response = requests.post(
            BASE_URL + path,
            json=body,
            headers={
                'FC-API-KEY': API_KEY,
                'FC-API-TIMESTAMP': timestamp,
                'FC-API-SIGNATURE': signature
            }
        )
        
        print('Order created:', response.json())
        return response.json()
    except Exception as e:
        print('Error creating order:', e)
        raise e

# Call the function
create_order()`,
    curl: `# Replace with your actual API key and secret
API_KEY="your_api_key_here"
API_SECRET="your_api_secret_here"
TIMESTAMP=$(date +%s000)
METHOD="POST"
PATH="/orders"
BASE_URL="https://api.flycrypto.com/v1"

# Order data
DATA='{"symbol":"BTC-USDT","side":"buy","type":"limit","price":"25000","quantity":"0.01","timeInForce":"GTC"}'

# Create signature
SIGNATURE=$(echo -n "$TIMESTAMP$METHOD$PATH$DATA" | openssl dgst -sha256 -hmac "$API_SECRET" | awk '{print $2}')

# Send the request
curl -X POST "$BASE_URL$PATH" \\
  -H "FC-API-KEY: $API_KEY" \\
  -H "FC-API-TIMESTAMP: $TIMESTAMP" \\
  -H "FC-API-SIGNATURE: $SIGNATURE" \\
  -H "Content-Type: application/json" \\
  -d "$DATA"`
  };

  const copyToClipboard = (text: string, language: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(language);
      toast({
        title: "Copied to clipboard!",
        description: `${language} code has been copied.`,
      });
      
      setTimeout(() => {
        setCopied(null);
      }, 2000);
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0e11] text-white">
      <div className="py-4 px-6 border-b border-[#1a1d24]">
        <div className="max-w-7xl mx-auto">
          <Link href="/" className="flex items-center text-neutral-400 hover:text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
      
      <div className="flex-1 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">API Trading</h1>
            <p className="text-neutral-400">
              Connect directly to our platform APIs for seamless integration and customized trading solutions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <Card className="bybit-card">
              <CardHeader>
                <div className="mb-2 bg-[#f7a600]/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <KeyRound className="h-6 w-6 text-[#f7a600]" />
                </div>
                <CardTitle>API Keys</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-400 mb-4">
                  Create and manage your API keys to securely access the FlyCrypto trading API.
                </p>
                <Button className="bybit-button-primary w-full">
                  Create New Key
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bybit-card">
              <CardHeader>
                <div className="mb-2 bg-[#f7a600]/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <RefreshCcw className="h-6 w-6 text-[#f7a600]" />
                </div>
                <CardTitle>Websocket Feeds</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-400 mb-4">
                  Subscribe to real-time market data and account updates through our WebSocket API.
                </p>
                <Button className="bybit-button-secondary w-full">
                  View Documentation
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bybit-card">
              <CardHeader>
                <div className="mb-2 bg-[#f7a600]/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-[#f7a600]" />
                </div>
                <CardTitle>Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-400 mb-4">
                  Learn about API security best practices and how to keep your access secure.
                </p>
                <Button className="bybit-button-secondary w-full">
                  Security Guidelines
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">API Code Examples</h2>
            
            <Tabs defaultValue="javascript" className="w-full">
              <div className="mb-4">
                <TabsList className="bg-[#181c25]">
                  <TabsTrigger value="javascript" className="data-[state=active]:bg-[#f7a600] data-[state=active]:text-black">JavaScript</TabsTrigger>
                  <TabsTrigger value="python" className="data-[state=active]:bg-[#f7a600] data-[state=active]:text-black">Python</TabsTrigger>
                  <TabsTrigger value="curl" className="data-[state=active]:bg-[#f7a600] data-[state=active]:text-black">cURL</TabsTrigger>
                </TabsList>
              </div>
              
              {Object.entries(sampleCodeSnippets).map(([language, code]) => (
                <TabsContent key={language} value={language} className="relative">
                  <div className="absolute top-4 right-4 z-10">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="bg-[#181c25] border-[#303544] hover:bg-[#303544]"
                      onClick={() => copyToClipboard(code, language)}
                    >
                      {copied === language ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy Code
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="bg-[#181c25] rounded-md p-6 overflow-auto max-h-[500px]">
                    <pre className="text-sm text-[#e0e0e0] font-mono">
                      {code}
                    </pre>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bybit-card">
              <CardHeader>
                <div className="mb-2 bg-[#f7a600]/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <Play className="h-6 w-6 text-[#f7a600]" />
                </div>
                <CardTitle>Getting Started</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-400 mb-4">
                  New to the FlyCrypto API? Learn how to set up your development environment and make your first API call.
                </p>
                <Button className="bybit-button-secondary w-full">
                  Read Guide
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bybit-card">
              <CardHeader>
                <div className="mb-2 bg-[#f7a600]/10 w-12 h-12 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-[#f7a600]" />
                </div>
                <CardTitle>API Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-400 mb-4">
                  Browse the complete API reference documentation with detailed endpoint descriptions and examples.
                </p>
                <Button className="bybit-button-secondary w-full">
                  View Documentation
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}