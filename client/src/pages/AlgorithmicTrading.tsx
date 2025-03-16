import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useAppContext } from '@/context/AppContext';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Trash2, 
  Edit,
  Play,
  Pause,
  BarChart4,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Code,
  Layers,
  Settings,
  LineChart,
  Cpu,
  Award,
  BookTemplate,
  ChevronRight,
  ChevronDown,
  AlertTriangle,
  Check
} from 'lucide-react';
import type { TradingPair } from '@shared/schema';

type TradingStrategy = {
  id: number;
  name: string;
  description: string | null;
  type: string;
  config: Record<string, any>;
  pairIds: string;
  isActive: boolean;
  lastRun: string | null;
  performance: number | null;
  createdAt: string;
};

type CreateStrategyRequest = {
  name: string;
  description?: string;
  userId: number;
  type: string;
  config: Record<string, any>;
  pairIds: string;
  isActive: boolean;
};

const strategyTemplates = [
  {
    id: 'moving-average-crossover',
    name: 'Moving Average Crossover',
    description: 'A classic trend-following strategy that buys when a faster moving average crosses above a slower one and sells when it crosses below.',
    type: 'template',
    tags: ['Trend Following', 'Beginner'],
    config: {
      fastPeriod: 10,
      slowPeriod: 30,
      signalPeriod: 9,
      positionSize: 0.1,
      stopLoss: 0.02,
      takeProfit: 0.05
    }
  },
  {
    id: 'rsi-reversal',
    name: 'RSI Reversal Strategy',
    description: 'A mean-reversion strategy that looks for overbought and oversold conditions using the Relative Strength Index (RSI) indicator.',
    type: 'template',
    tags: ['Mean Reversion', 'Intermediate'],
    config: {
      rsiPeriod: 14,
      oversoldThreshold: 30,
      overboughtThreshold: 70,
      positionSize: 0.1,
      stopLoss: 0.03,
      takeProfit: 0.06
    }
  },
  {
    id: 'bollinger-band-breakout',
    name: 'Bollinger Band Breakout',
    description: 'A volatility-based strategy that signals entries when price breaks out of the Bollinger Bands, indicating strong momentum.',
    type: 'template',
    tags: ['Volatility', 'Intermediate'],
    config: {
      period: 20,
      deviations: 2,
      positionSize: 0.15,
      stopLoss: 0.04,
      takeProfit: 0.08
    }
  },
  {
    id: 'macd-divergence',
    name: 'MACD Divergence',
    description: 'An advanced strategy that looks for divergences between price and the MACD indicator to predict potential reversals.',
    type: 'template',
    tags: ['Trend Reversal', 'Advanced'],
    config: {
      fastPeriod: 12,
      slowPeriod: 26,
      signalPeriod: 9,
      positionSize: 0.1,
      stopLoss: 0.05,
      takeProfit: 0.15
    }
  },
];

export default function AlgorithmicTrading() {
  const [, navigate] = useLocation();
  const { currentUser } = useAppContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [showNewStrategyDialog, setShowNewStrategyDialog] = useState(false);
  const [strategyToDelete, setStrategyToDelete] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('active-strategies');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  
  // New strategy form state
  const [newStrategyName, setNewStrategyName] = useState('');
  const [newStrategyDescription, setNewStrategyDescription] = useState('');
  const [selectedPairs, setSelectedPairs] = useState<string[]>([]);
  const [strategyType, setStrategyType] = useState('template');
  const [strategyConfig, setStrategyConfig] = useState<Record<string, any>>({});
  
  const userId = currentUser?.id || 1; // Fallback for demo
  
  // Load trading strategies
  const { data: strategies, isLoading: isLoadingStrategies } = useQuery({
    queryKey: ['/api/strategies', userId],
    enabled: !!userId,
  });
  
  // Load trading pairs for selection
  const { data: tradingPairs, isLoading: isLoadingPairs } = useQuery({
    queryKey: ['/api/pairs'],
  });
  
  // Create new strategy
  const createStrategyMutation = useMutation({
    mutationFn: (strategyData: CreateStrategyRequest) => 
      apiRequest('POST', '/api/strategies', strategyData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/strategies', userId] });
      resetForm();
      setShowNewStrategyDialog(false);
      
      toast({
        title: "Strategy Created",
        description: "Your trading strategy has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Creating Strategy",
        description: "There was a problem creating your strategy. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Update strategy status
  const updateStrategyStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number, isActive: boolean }) => 
      apiRequest('PATCH', `/api/strategies/${id}/status`, { isActive }),
    onSuccess: async (data) => {
      const jsonData = await data.json();
      queryClient.invalidateQueries({ queryKey: ['/api/strategies', userId] });
      toast({
        title: `Strategy ${jsonData.isActive ? 'Activated' : 'Paused'}`,
        description: `The trading strategy has been ${jsonData.isActive ? 'activated' : 'paused'} successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error Updating Strategy",
        description: "There was a problem updating your strategy. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Delete strategy
  const deleteStrategyMutation = useMutation({
    mutationFn: (id: number) => 
      apiRequest('DELETE', `/api/strategies/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/strategies', userId] });
      setStrategyToDelete(null);
      toast({
        title: "Strategy Deleted",
        description: "The trading strategy has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Deleting Strategy",
        description: "There was a problem deleting your strategy. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const handleCreateStrategy = () => {
    if (!newStrategyName) {
      toast({
        title: "Name Required",
        description: "Please provide a name for your trading strategy.",
        variant: "destructive",
      });
      return;
    }
    
    if (selectedPairs.length === 0) {
      toast({
        title: "Trading Pairs Required",
        description: "Please select at least one trading pair for your strategy.",
        variant: "destructive",
      });
      return;
    }
    
    const pairIdsString = selectedPairs.join(',');
    
    createStrategyMutation.mutate({
      name: newStrategyName,
      description: newStrategyDescription || undefined,
      userId,
      type: strategyType,
      config: strategyConfig,
      pairIds: pairIdsString,
      isActive: false
    });
  };
  
  const handleToggleStrategy = (id: number, currentStatus: boolean) => {
    updateStrategyStatusMutation.mutate({ 
      id, 
      isActive: !currentStatus 
    });
  };
  
  const handleDeleteStrategy = (id: number) => {
    setStrategyToDelete(id);
  };
  
  const confirmDeleteStrategy = () => {
    if (strategyToDelete) {
      deleteStrategyMutation.mutate(strategyToDelete);
    }
  };
  
  const selectTemplate = (templateId: string) => {
    const template = strategyTemplates.find(t => t.id === templateId);
    if (template) {
      setNewStrategyName(template.name);
      setNewStrategyDescription(template.description);
      setStrategyType('template');
      setStrategyConfig(template.config);
      setSelectedTemplate(templateId);
    }
  };
  
  const resetForm = () => {
    setNewStrategyName('');
    setNewStrategyDescription('');
    setSelectedPairs([]);
    setStrategyType('template');
    setStrategyConfig({});
    setSelectedTemplate(null);
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };
  
  const getPairNames = (pairIdsString: string): string => {
    if (!tradingPairs) return pairIdsString;
    
    const pairIds = pairIdsString.split(',').map(id => parseInt(id.trim()));
    const names = pairIds.map(id => {
      const pair = tradingPairs.find(p => p.id === id);
      return pair ? pair.name : `Pair #${id}`;
    });
    
    return names.join(', ');
  };
  
  const renderPairSelection = () => {
    if (!tradingPairs) return <div className="text-muted-foreground">Loading trading pairs...</div>;
    
    return (
      <div className="grid grid-cols-2 gap-2 mt-2">
        {tradingPairs.map(pair => (
          <div 
            key={pair.id}
            className={`
              p-2 border rounded-md flex items-center justify-between cursor-pointer
              transition-colors
              ${selectedPairs.includes(pair.id.toString()) 
                ? 'bg-primary-700 border-primary-600'
                : 'bg-primary-900/50 border-primary-800 hover:bg-primary-800'}
            `}
            onClick={() => {
              if (selectedPairs.includes(pair.id.toString())) {
                setSelectedPairs(selectedPairs.filter(id => id !== pair.id.toString()));
              } else {
                setSelectedPairs([...selectedPairs, pair.id.toString()]);
              }
            }}
          >
            <div className="flex items-center">
              <span className="font-medium">{pair.name}</span>
              <span className="ml-2 text-xs text-muted-foreground">
                {pair.baseAsset}/{pair.quoteAsset}
              </span>
            </div>
            {selectedPairs.includes(pair.id.toString()) && (
              <Check className="h-4 w-4 text-green-500" />
            )}
          </div>
        ))}
      </div>
    );
  };
  
  const renderConfigPanel = () => {
    if (strategyType !== 'template' || !selectedTemplate) {
      return (
        <div className="bg-primary-900/50 border border-primary-800 rounded-md p-4 mt-4">
          <div className="text-center py-4">
            <Code className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-muted-foreground">Select a template to configure parameters</p>
          </div>
        </div>
      );
    }
    
    const template = strategyTemplates.find(t => t.id === selectedTemplate);
    if (!template) return null;
    
    return (
      <div className="bg-primary-900/50 border border-primary-800 rounded-md p-4 mt-4">
        <h3 className="font-medium mb-3">Strategy Parameters</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(template.config).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <Label htmlFor={key} className="capitalize">
                {key.replace(/([A-Z])/g, ' $1')
                  .replace(/^./, (str) => str.toUpperCase())
                  .replace(/([a-z])([A-Z])/g, '$1 $2')}
              </Label>
              <Input
                id={key}
                type={typeof value === 'number' ? 'number' : 'text'}
                value={strategyConfig[key] !== undefined ? strategyConfig[key] : value}
                onChange={(e) => {
                  const newValue = e.target.type === 'number' 
                    ? parseFloat(e.target.value) 
                    : e.target.value;
                  
                  setStrategyConfig({
                    ...strategyConfig,
                    [key]: newValue
                  });
                }}
                className="bg-primary-950 border-primary-800"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Algorithmic Trading</h1>
          <p className="text-muted-foreground">Create and manage automated trading strategies</p>
        </div>
        <Button
          onClick={() => setShowNewStrategyDialog(true)} 
          className="bg-[#f7a600] hover:bg-[#f7a600]/90 text-black"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Strategy
        </Button>
      </div>
      
      <Tabs defaultValue="active-strategies" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-primary-900/50 border border-primary-800">
          <TabsTrigger value="active-strategies" className="data-[state=active]:bg-primary-800">
            Active Strategies
          </TabsTrigger>
          <TabsTrigger value="all-strategies" className="data-[state=active]:bg-primary-800">
            All Strategies
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-primary-800">
            Strategy Templates
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active-strategies">
          <Card className="bg-primary-800/50 border-primary-700/50">
            <CardHeader>
              <CardTitle>Active Trading Strategies</CardTitle>
              <CardDescription>
                Currently running automated strategies
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingStrategies ? (
                <div className="flex justify-center py-4">
                  <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : strategies && strategies.filter(s => s.isActive).length > 0 ? (
                <div className="space-y-4">
                  {strategies.filter(s => s.isActive).map(strategy => (
                    <div 
                      key={strategy.id}
                      className="bg-primary-900/70 border border-primary-700/30 rounded-lg overflow-hidden"
                    >
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-lg flex items-center">
                              <Badge className="mr-2 bg-green-600 text-white hover:bg-green-700">
                                Active
                              </Badge>
                              {strategy.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {strategy.description || 'No description provided'}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleToggleStrategy(strategy.id, strategy.isActive)}
                                    className="text-yellow-500 hover:text-yellow-600 hover:bg-yellow-500/10"
                                  >
                                    <Pause className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Pause Strategy</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-blue-500 hover:text-blue-600 hover:bg-blue-500/10"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Edit Strategy</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteStrategy(strategy.id)}
                                    className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Delete Strategy</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          <div>
                            <h4 className="text-xs uppercase text-muted-foreground mb-1 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              Last Run
                            </h4>
                            <p className="text-sm">
                              {formatDate(strategy.lastRun)}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-xs uppercase text-muted-foreground mb-1 flex items-center">
                              <BarChart4 className="h-3 w-3 mr-1" />
                              Performance
                            </h4>
                            <p className={`text-sm font-medium ${
                              strategy.performance === null ? 'text-muted-foreground' :
                              strategy.performance >= 0 ? 'text-green-500' : 'text-red-500'
                            }`}>
                              {strategy.performance === null ? 'No data yet' : (
                                <span className="flex items-center">
                                  {strategy.performance >= 0 ? (
                                    <ArrowUpRight className="h-3 w-3 mr-1" />
                                  ) : (
                                    <ArrowDownRight className="h-3 w-3 mr-1" />
                                  )}
                                  {Math.abs(strategy.performance).toFixed(2)}%
                                </span>
                              )}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-xs uppercase text-muted-foreground mb-1 flex items-center">
                              <Layers className="h-3 w-3 mr-1" />
                              Trading Pairs
                            </h4>
                            <p className="text-sm">
                              {getPairNames(strategy.pairIds)}
                            </p>
                          </div>
                        </div>
                        
                        {strategy.performance !== null && (
                          <div className="mt-4">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span>Performance</span>
                              <span className={strategy.performance >= 0 ? 'text-green-500' : 'text-red-500'}>
                                {strategy.performance.toFixed(2)}%
                              </span>
                            </div>
                            <Progress 
                              value={50 + (strategy.performance * 2)} 
                              max={100}
                              className="h-1.5 bg-primary-700"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Play className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>You don't have any active strategies</p>
                  <p>Activate a strategy or create a new one to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="all-strategies">
          <Card className="bg-primary-800/50 border-primary-700/50">
            <CardHeader>
              <CardTitle>All Trading Strategies</CardTitle>
              <CardDescription>
                Manage all your algorithmic trading strategies
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingStrategies ? (
                <div className="flex justify-center py-4">
                  <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : strategies && strategies.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="border-primary-700/30 hover:bg-primary-800/80">
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Trading Pairs</TableHead>
                      <TableHead>Performance</TableHead>
                      <TableHead>Last Run</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {strategies.map((strategy) => (
                      <TableRow key={strategy.id} className="border-primary-700/30 hover:bg-primary-800/80">
                        <TableCell>
                          <div className="font-medium">{strategy.name}</div>
                          <div className="text-xs text-muted-foreground">{strategy.description || 'No description'}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`
                            ${strategy.type === 'template' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                              strategy.type === 'custom' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                              'bg-green-500/10 text-green-400 border-green-500/30'}
                          `}>
                            {strategy.type.charAt(0).toUpperCase() + strategy.type.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{getPairNames(strategy.pairIds)}</TableCell>
                        <TableCell>
                          {strategy.performance === null ? (
                            <span className="text-muted-foreground">No data</span>
                          ) : (
                            <span className={`flex items-center ${strategy.performance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {strategy.performance >= 0 ? (
                                <ArrowUpRight className="h-4 w-4 mr-1" />
                              ) : (
                                <ArrowDownRight className="h-4 w-4 mr-1" />
                              )}
                              {Math.abs(strategy.performance).toFixed(2)}%
                            </span>
                          )}
                        </TableCell>
                        <TableCell>{formatDate(strategy.lastRun)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Switch
                              checked={strategy.isActive}
                              onCheckedChange={() => handleToggleStrategy(strategy.id, strategy.isActive)}
                              className="mr-2"
                            />
                            <span className={strategy.isActive ? "text-green-500" : "text-muted-foreground"}>
                              {strategy.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-blue-500 hover:text-blue-600 hover:bg-blue-500/10"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteStrategy(strategy.id)}
                              className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>You don't have any trading strategies yet</p>
                  <p>Create a new strategy to get started with algorithmic trading</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates">
          <Card className="bg-primary-800/50 border-primary-700/50">
            <CardHeader>
              <CardTitle>Strategy Templates</CardTitle>
              <CardDescription>
                Pre-built algorithmic trading strategies you can customize and deploy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {strategyTemplates.map(template => (
                  <motion.div
                    key={template.id}
                    className="bg-primary-900/70 border border-primary-700/30 rounded-lg overflow-hidden cursor-pointer"
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                    onClick={() => {
                      setShowNewStrategyDialog(true);
                      selectTemplate(template.id);
                    }}
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-lg">{template.name}</h3>
                        <div className="flex space-x-1">
                          {template.tags.map(tag => (
                            <Badge 
                              key={tag} 
                              variant="outline" 
                              className="bg-primary-800/70 text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {template.description}
                      </p>
                      
                      <div className="mt-4 pt-4 border-t border-primary-700/30">
                        <div className="text-xs text-muted-foreground flex justify-between">
                          <span className="flex items-center">
                            <Settings className="h-3 w-3 mr-1" />
                            {Object.keys(template.config).length} parameters
                          </span>
                          <span className="text-[#f7a600]">Use Template</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Create New Strategy Dialog */}
      <Dialog open={showNewStrategyDialog} onOpenChange={setShowNewStrategyDialog}>
        <DialogContent className="bg-primary-800 border-primary-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Trading Strategy</DialogTitle>
            <DialogDescription>
              Configure your automated trading strategy
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="strategyName">Strategy Name</Label>
                <Input
                  id="strategyName"
                  placeholder="Moving Average Crossover"
                  value={newStrategyName}
                  onChange={(e) => setNewStrategyName(e.target.value)}
                  className="bg-primary-900/50 border-primary-700"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="strategyDescription">Description (Optional)</Label>
                <Textarea
                  id="strategyDescription"
                  placeholder="Briefly describe what this strategy does"
                  value={newStrategyDescription}
                  onChange={(e) => setNewStrategyDescription(e.target.value)}
                  className="bg-primary-900/50 border-primary-700 min-h-[100px]"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="strategyType">Strategy Type</Label>
                <Select
                  value={strategyType}
                  onValueChange={setStrategyType}
                >
                  <SelectTrigger className="bg-primary-900/50 border-primary-700">
                    <SelectValue placeholder="Select strategy type" />
                  </SelectTrigger>
                  <SelectContent className="bg-primary-800 border-primary-700">
                    <SelectItem value="template">Template-Based</SelectItem>
                    <SelectItem value="indicator">Indicator-Based</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {strategyType === 'template' && (
                <div className="space-y-2">
                  <Label>Select Template</Label>
                  <div className="bg-primary-900/50 border border-primary-700 rounded-md overflow-hidden">
                    {strategyTemplates.map(template => (
                      <div 
                        key={template.id}
                        className={`
                          flex items-center justify-between p-3 cursor-pointer border-l-2
                          ${selectedTemplate === template.id 
                            ? 'border-[#f7a600] bg-[#f7a600]/10' 
                            : 'border-transparent hover:bg-primary-700/30'}
                        `}
                        onClick={() => selectTemplate(template.id)}
                      >
                        <div>
                          <h4 className="font-medium text-sm">{template.name}</h4>
                          <p className="text-xs text-muted-foreground">{template.tags.join(', ')}</p>
                        </div>
                        {selectedTemplate === template.id && (
                          <CheckCircle2 className="h-4 w-4 text-[#f7a600]" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tradingPairs">Trading Pairs</Label>
                <p className="text-xs text-muted-foreground">Select the trading pairs this strategy will operate on</p>
                {renderPairSelection()}
              </div>
              
              {renderConfigPanel()}
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowNewStrategyDialog(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateStrategy}
              className="bg-[#f7a600] hover:bg-[#f7a600]/90 text-black"
              disabled={createStrategyMutation.isPending}
            >
              {createStrategyMutation.isPending && (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              )}
              Create Strategy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!strategyToDelete} onOpenChange={(open) => !open && setStrategyToDelete(null)}>
        <AlertDialogContent className="bg-primary-800 border-primary-700">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the trading strategy
              and stop any active trades associated with it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteStrategy}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Strategy
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}