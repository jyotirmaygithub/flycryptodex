import React, { useState } from 'react';
import { useNavigate } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { Switch } from '@/components/ui/switch';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/context/AppContext';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Copy, 
  Plus, 
  Key, 
  Trash2, 
  Eye, 
  EyeOff,
  Calendar,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Shield,
  ShieldAlert
} from 'lucide-react';

type ApiKey = {
  id: number;
  name: string;
  apiKey: string;
  secretKey?: string;
  permissions: string;
  ipWhitelist: string | null;
  isActive: boolean;
  lastUsed: string | null;
  createdAt: string;
};

type CreateApiKeyRequest = {
  name: string;
  userId: number;
  permissions: string;
  ipWhitelist?: string;
  isActive: boolean;
};

export default function ApiKeys() {
  const navigate = useNavigate();
  const { currentUser } = useAppContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [newKeyName, setNewKeyName] = useState('');
  const [readPermission, setReadPermission] = useState(true);
  const [tradePermission, setTradePermission] = useState(false);
  const [withdrawPermission, setWithdrawPermission] = useState(false);
  const [ipWhitelist, setIpWhitelist] = useState('');
  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [apiKeyToDelete, setApiKeyToDelete] = useState<number | null>(null);
  const [newKeyData, setNewKeyData] = useState<ApiKey | null>(null);
  
  const userId = currentUser?.id || 1; // Fallback for demo
  
  // Load API keys
  const { data: apiKeys, isLoading } = useQuery({
    queryKey: ['/api/api-keys', userId],
    queryFn: () => apiRequest<ApiKey[]>(`/api/api-keys?userId=${userId}`),
    enabled: !!userId,
  });
  
  // Create new API key
  const createApiKeyMutation = useMutation({
    mutationFn: (apiKeyData: CreateApiKeyRequest) => 
      apiRequest<ApiKey>('/api/api-keys', {
        method: 'POST',
        body: JSON.stringify(apiKeyData),
      }),
    onSuccess: (data) => {
      setNewKeyData(data);
      queryClient.invalidateQueries({ queryKey: ['/api/api-keys', userId] });
      resetForm();
      setShowNewKeyDialog(false);
      
      toast({
        title: "API Key Created",
        description: "Your new API key has been created. Save your secret key now, you won't be able to see it again.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Creating API Key",
        description: "There was a problem creating your API key. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Update API key status
  const updateApiKeyMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number, isActive: boolean }) => 
      apiRequest<ApiKey>(`/api/api-keys/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/api-keys', userId] });
      toast({
        title: "API Key Updated",
        description: "The API key status has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Updating API Key",
        description: "There was a problem updating your API key. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  // Delete API key
  const deleteApiKeyMutation = useMutation({
    mutationFn: (id: number) => 
      apiRequest<void>(`/api/api-keys/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/api-keys', userId] });
      setApiKeyToDelete(null);
      toast({
        title: "API Key Deleted",
        description: "The API key has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Deleting API Key",
        description: "There was a problem deleting your API key. Please try again.",
        variant: "destructive",
      });
    }
  });
  
  const handleCreateApiKey = () => {
    if (!newKeyName) {
      toast({
        title: "Name Required",
        description: "Please provide a name for your API key.",
        variant: "destructive",
      });
      return;
    }
    
    // Build permissions string
    const permissions = [
      readPermission ? 'read' : '',
      tradePermission ? 'trade' : '',
      withdrawPermission ? 'withdraw' : '',
    ].filter(Boolean).join(',');
    
    if (!permissions) {
      toast({
        title: "Permissions Required",
        description: "Please select at least one permission for your API key.",
        variant: "destructive",
      });
      return;
    }
    
    createApiKeyMutation.mutate({
      name: newKeyName,
      userId,
      permissions,
      ipWhitelist: ipWhitelist || undefined,
      isActive: true
    });
  };
  
  const handleToggleKeyStatus = (id: number, currentStatus: boolean) => {
    updateApiKeyMutation.mutate({ 
      id, 
      isActive: !currentStatus 
    });
  };
  
  const handleDeleteKey = (id: number) => {
    setApiKeyToDelete(id);
  };
  
  const confirmDeleteKey = () => {
    if (apiKeyToDelete) {
      deleteApiKeyMutation.mutate(apiKeyToDelete);
    }
  };
  
  const resetForm = () => {
    setNewKeyName('');
    setReadPermission(true);
    setTradePermission(false);
    setWithdrawPermission(false);
    setIpWhitelist('');
  };
  
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard.`,
    });
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };
  
  const getPermissionBadges = (permissions: string) => {
    const permArray = permissions.split(',');
    
    return (
      <div className="flex gap-1">
        {permArray.includes('read') && (
          <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
            Read
          </Badge>
        )}
        {permArray.includes('trade') && (
          <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
            Trade
          </Badge>
        )}
        {permArray.includes('withdraw') && (
          <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
            Withdraw
          </Badge>
        )}
      </div>
    );
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">API Keys</h1>
          <p className="text-muted-foreground">Manage your API keys for automated trading</p>
        </div>
        <Button 
          onClick={() => setShowNewKeyDialog(true)}
          className="bg-[#f7a600] hover:bg-[#f7a600]/90 text-black"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New API Key
        </Button>
      </div>
      
      <Card className="bg-primary-800/50 border-primary-700/50">
        <CardHeader>
          <CardTitle>Your API Keys</CardTitle>
          <CardDescription>
            Use these keys to authenticate your API requests for automated trading
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : apiKeys && apiKeys.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-primary-700/30 hover:bg-primary-800/80">
                  <TableHead>Name</TableHead>
                  <TableHead>API Key</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((key) => (
                  <TableRow key={key.id} className="border-primary-700/30 hover:bg-primary-800/80">
                    <TableCell className="font-medium">{key.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-sm">{key.apiKey}</span>
                        <button 
                          onClick={() => copyToClipboard(key.apiKey, 'API Key')}
                          className="text-primary-400 hover:text-primary-300"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell>{getPermissionBadges(key.permissions)}</TableCell>
                    <TableCell>{formatDate(key.createdAt)}</TableCell>
                    <TableCell>{formatDate(key.lastUsed)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Switch
                          checked={key.isActive}
                          onCheckedChange={() => handleToggleKeyStatus(key.id, key.isActive)}
                          className="mr-2"
                        />
                        <span className={key.isActive ? "text-green-500" : "text-red-500"}>
                          {key.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteKey(key.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>You don't have any API keys yet.</p>
              <p>Create one to get started with automated trading.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t border-primary-700/30 px-6 py-4 bg-primary-800/30">
          <div className="flex items-start space-x-2 text-xs text-muted-foreground">
            <ShieldAlert className="h-4 w-4 mt-0.5 flex-shrink-0 text-yellow-500" />
            <div>
              <p><strong>Security Tips:</strong></p>
              <ul className="list-disc pl-4 space-y-1 mt-1">
                <li>Never share your API keys with anyone</li>
                <li>Use IP whitelisting for added security</li>
                <li>Only grant necessary permissions for each API key</li>
                <li>Revoke unused API keys to reduce security risks</li>
              </ul>
            </div>
          </div>
        </CardFooter>
      </Card>
      
      {/* Create New API Key Dialog */}
      <Dialog open={showNewKeyDialog} onOpenChange={setShowNewKeyDialog}>
        <DialogContent className="bg-primary-800 border-primary-700">
          <DialogHeader>
            <DialogTitle>Create New API Key</DialogTitle>
            <DialogDescription>
              Create a new API key to use with automated trading systems.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="keyName">API Key Name</Label>
              <Input
                id="keyName"
                placeholder="Trading Bot 1"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="bg-primary-900/50 border-primary-700"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="readPermission" 
                    checked={readPermission}
                    onCheckedChange={(checked) => setReadPermission(checked === true)}
                  />
                  <Label htmlFor="readPermission" className="cursor-pointer">
                    Read (View market data, orders, and account info)
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="tradePermission" 
                    checked={tradePermission}
                    onCheckedChange={(checked) => setTradePermission(checked === true)}
                  />
                  <Label htmlFor="tradePermission" className="cursor-pointer">
                    Trade (Place and manage orders)
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="withdrawPermission" 
                    checked={withdrawPermission}
                    onCheckedChange={(checked) => setWithdrawPermission(checked === true)}
                  />
                  <Label htmlFor="withdrawPermission" className="cursor-pointer">
                    Withdraw (Move funds between accounts)
                  </Label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ipWhitelist">IP Whitelist (Optional)</Label>
              <Input
                id="ipWhitelist"
                placeholder="10.0.0.1, 192.168.1.1"
                value={ipWhitelist}
                onChange={(e) => setIpWhitelist(e.target.value)}
                className="bg-primary-900/50 border-primary-700"
              />
              <p className="text-xs text-muted-foreground">
                Separate multiple IPs with commas. Leave empty to allow all IPs.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewKeyDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateApiKey}
              className="bg-[#f7a600] hover:bg-[#f7a600]/90 text-black"
              disabled={createApiKeyMutation.isPending}
            >
              {createApiKeyMutation.isPending && (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              )}
              Create API Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Show API Key Details Dialog */}
      <Dialog open={!!newKeyData} onOpenChange={(open) => !open && setNewKeyData(null)}>
        <DialogContent className="bg-primary-800 border-primary-700">
          <DialogHeader>
            <DialogTitle>API Key Created Successfully</DialogTitle>
            <DialogDescription>
              Save your API key and secret key now. The secret key will not be shown again.
            </DialogDescription>
          </DialogHeader>
          
          {newKeyData && (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <div className="flex">
                  <Input
                    id="apiKey"
                    value={newKeyData.apiKey}
                    readOnly
                    className="bg-primary-900/50 border-primary-700 font-mono"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(newKeyData.apiKey, 'API Key')}
                    className="ml-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="secretKey">Secret Key</Label>
                <div className="flex">
                  <Input
                    id="secretKey"
                    type={showSecretKey ? "text" : "password"}
                    value={newKeyData.secretKey || ''}
                    readOnly
                    className="bg-primary-900/50 border-primary-700 font-mono"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                    className="ml-2"
                  >
                    {showSecretKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(newKeyData.secretKey || '', 'Secret Key')}
                    className="ml-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="rounded-md bg-yellow-500/20 p-4 border border-yellow-500/30 text-yellow-200">
                <div className="flex">
                  <ShieldAlert className="h-5 w-5 text-yellow-500 mr-2" />
                  <div>
                    <h3 className="font-semibold text-yellow-400">Important Security Notice</h3>
                    <p className="text-sm">
                      Your secret key is only shown once. Please save it securely. If you lose it, you'll need to create a new API key.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              onClick={() => setNewKeyData(null)}
              className="bg-[#f7a600] hover:bg-[#f7a600]/90 text-black"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              I've Saved My Keys
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!apiKeyToDelete} onOpenChange={(open) => !open && setApiKeyToDelete(null)}>
        <AlertDialogContent className="bg-primary-800 border-primary-700">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the API key
              and revoke access for any applications using it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteKey}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete API Key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}