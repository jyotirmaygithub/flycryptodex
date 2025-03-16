import { useQuery } from '@tanstack/react-query';
import { ForexNews as ForexNewsType } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ExternalLink, Clock, Globe, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ForexNews() {
  const { data: news, isLoading, refetch } = useQuery<ForexNewsType[]>({
    queryKey: ['/api/news'],
  });
  
  // Ensure news is always an array
  const newsItems = Array.isArray(news) ? news : [];
  
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffHours = Math.round(diffMs / 3600000);
    
    if (diffHours < 1) return 'Less than 1h ago';
    if (diffHours === 1) return '1h ago';
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  // Function to determine news impact level and associated styles
  const getImpactLevel = (title: string) => {
    const impactTitle = title.toLowerCase();
    
    if (impactTitle.includes('rate') || impactTitle.includes('fed') || impactTitle.includes('ecb')) {
      return {
        level: 'High',
        color: 'text-red-400',
        bgColor: 'bg-red-400/10',
        icon: <AlertCircle className="h-3 w-3 mr-1" />
      };
    } else if (impactTitle.includes('inflation') || impactTitle.includes('employment') || impactTitle.includes('gdp')) {
      return {
        level: 'Medium',
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-400/10',
        icon: <TrendingUp className="h-3 w-3 mr-1" />
      };
    } else {
      return {
        level: 'Low',
        color: 'text-blue-400',
        bgColor: 'bg-blue-400/10',
        icon: <Globe className="h-3 w-3 mr-1" />
      };
    }
  };
  
  return (
    <div className="h-80 border-t border-primary-700 overflow-hidden">
      <div className="p-3 border-b border-primary-700 flex justify-between items-center bg-primary-800/80">
        <h3 className="text-sm font-medium flex items-center">
          <Globe className="h-4 w-4 mr-2 text-accent-500" />
          Forex News
        </h3>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full hover:bg-primary-700"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-3.5 w-3.5 text-neutral-400" />
          </Button>
          <Button variant="ghost" size="sm" className="text-xs text-neutral-400 hover:text-white">
            View All <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </div>
      
      <div className="overflow-y-auto h-[calc(100%-48px)] p-3 space-y-3">
        {isLoading ? (
          <>
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </>
        ) : newsItems.length === 0 ? (
          <div className="text-center py-12 text-neutral-400 flex flex-col items-center">
            <AlertCircle className="h-8 w-8 mb-2 text-neutral-500" />
            <p>No forex news available</p>
          </div>
        ) : (
          newsItems.map((item: ForexNewsType) => {
            const impact = getImpactLevel(item.title);
            
            return (
              <div key={item.id} className="rounded-lg border border-primary-700 bg-primary-800/50 p-3 text-xs hover:bg-primary-700/50 transition-colors">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-sm">{item.title}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`${impact.color} ${impact.bgColor} border-none px-1.5 py-0.5 h-5 flex items-center`}>
                      {impact.icon}
                      {impact.level}
                    </Badge>
                    <span className="text-neutral-400 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {getTimeAgo(item.createdAt)}
                    </span>
                  </div>
                </div>
                <p className="text-neutral-300 line-clamp-2">{item.content}</p>
                
                <div className="mt-2 flex justify-end">
                  <Button variant="ghost" size="sm" className="h-6 px-2 py-0 text-xs text-accent-500 hover:text-accent-400">
                    Read more <ExternalLink className="h-2.5 w-2.5 ml-1" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
