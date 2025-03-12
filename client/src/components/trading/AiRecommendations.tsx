import { useQuery } from '@tanstack/react-query';
import { AiRecommendation } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface AiRecommendationsProps {
  pairId: number;
}

export default function AiRecommendations({ pairId }: AiRecommendationsProps) {
  const { data: recommendations, isLoading } = useQuery({
    queryKey: ['/api/recommendations', { pairId }],
    enabled: !!pairId,
  });
  
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins === 1) return '1m ago';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1h ago';
    if (diffHours < 24) return `${diffHours}h ago`;
    
    return 'over a day ago';
  };
  
  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case 'buy':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'sell':
        return <AlertCircle className="h-4 w-4 text-error" />;
      case 'hold':
      default:
        return <Clock className="h-4 w-4 text-neutral-400" />;
    }
  };
  
  const getSignalClass = (signal: string) => {
    switch (signal) {
      case 'buy':
        return 'border-success';
      case 'sell':
        return 'border-error';
      case 'hold':
      default:
        return 'border-neutral-400';
    }
  };
  
  const getSignalTextClass = (signal: string) => {
    switch (signal) {
      case 'buy':
        return 'text-success';
      case 'sell':
        return 'text-error';
      case 'hold':
      default:
        return '';
    }
  };
  
  return (
    <div className="w-1/2 p-4">
      <div className="rounded-lg bg-primary-800 border border-primary-700 p-4 h-full overflow-y-auto">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-medium">AI Strategy Recommendations</h3>
          <span className="text-xs bg-accent2-500 text-white px-2 py-1 rounded">BETA</span>
        </div>
        
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : !recommendations || recommendations.length === 0 ? (
          <div className="text-center py-6 text-neutral-400">
            No recommendations available
          </div>
        ) : (
          <div className="space-y-3">
            {recommendations.map((recommendation: AiRecommendation) => (
              <div 
                key={recommendation.id} 
                className={`p-2 rounded bg-primary-700 border-l-2 ${getSignalClass(recommendation.signal)}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-xs font-medium flex items-center gap-1 ${getSignalTextClass(recommendation.signal)}`}>
                    {getSignalIcon(recommendation.signal)}
                    {recommendation.signal.toUpperCase()} SIGNAL
                  </span>
                  <span className="text-xs text-neutral-400">
                    {getTimeAgo(recommendation.createdAt)}
                  </span>
                </div>
                <p className="text-xs">{recommendation.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
