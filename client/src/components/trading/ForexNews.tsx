import { useQuery } from '@tanstack/react-query';
import { ForexNews as ForexNewsType } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export default function ForexNews() {
  const { data: news, isLoading } = useQuery({
    queryKey: ['/api/news'],
  });
  
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
  
  return (
    <div className="h-56 border-t border-primary-700 overflow-hidden">
      <div className="p-2 border-b border-primary-700 flex justify-between items-center bg-primary-800">
        <h3 className="text-sm font-medium">Forex News</h3>
        <Button variant="ghost" size="sm" className="text-xs text-neutral-400 hover:text-white">
          More
        </Button>
      </div>
      
      <div className="overflow-y-auto h-[calc(100%-36px)] p-2 space-y-3">
        {isLoading ? (
          <>
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </>
        ) : !news || news.length === 0 ? (
          <div className="text-center py-6 text-neutral-400">
            No forex news available
          </div>
        ) : (
          news.map((item: ForexNewsType) => (
            <div key={item.id} className="rounded bg-primary-800 p-2 text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium">{item.title}</span>
                <span className="text-neutral-400">{getTimeAgo(item.createdAt)}</span>
              </div>
              <p className="text-neutral-300">{item.content}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
