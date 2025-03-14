import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Newspaper, Clock, Globe, ArrowRight, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface CommodityNewsBoxProps {
  commodityType: string;
}

export default function CommodityNewsBox({ commodityType }: CommodityNewsBoxProps) {
  // In a real implementation, this would fetch news from an API
  // For now, we're using mock data based on the commodity type
  
  const getNewsForCommodity = (type: string) => {
    const newsItems = {
      "GOLD": [
        {
          id: 1,
          title: "Gold surges as inflation concerns persist",
          source: "Financial Times",
          time: "2 hours ago",
          impact: "high",
          url: "#"
        },
        {
          id: 2,
          title: "Central banks increase gold reserves amidst economic uncertainty",
          source: "Bloomberg",
          time: "5 hours ago",
          impact: "medium",
          url: "#"
        },
        {
          id: 3,
          title: "Gold mining output falls 2.3% in Q1 2025",
          source: "Mining Weekly",
          time: "1 day ago",
          impact: "low",
          url: "#"
        }
      ],
      "SILVER": [
        {
          id: 1,
          title: "Silver industrial demand reaches 5-year high",
          source: "Reuters",
          time: "3 hours ago",
          impact: "high",
          url: "#"
        },
        {
          id: 2,
          title: "Silver outperforms gold amid technological sector growth",
          source: "CNBC",
          time: "7 hours ago",
          impact: "medium",
          url: "#"
        },
        {
          id: 3,
          title: "Major new silver deposit discovered in Mexico",
          source: "Mining Journal",
          time: "1 day ago",
          impact: "medium",
          url: "#"
        }
      ],
      "OIL": [
        {
          id: 1,
          title: "OPEC+ announces production cuts amid price pressure",
          source: "Wall Street Journal",
          time: "4 hours ago",
          impact: "high",
          url: "#"
        },
        {
          id: 2,
          title: "US crude inventories fall more than expected",
          source: "Energy Intel",
          time: "8 hours ago",
          impact: "medium",
          url: "#"
        },
        {
          id: 3,
          title: "Major refinery outage impacts diesel production",
          source: "OilPrice",
          time: "1 day ago",
          impact: "medium",
          url: "#"
        }
      ],
      "default": [
        {
          id: 1,
          title: "Commodity markets volatility increases amid global tensions",
          source: "Reuters",
          time: "2 hours ago",
          impact: "medium",
          url: "#"
        },
        {
          id: 2,
          title: "Supply chain disruptions continue to affect commodity prices",
          source: "Bloomberg",
          time: "6 hours ago",
          impact: "medium",
          url: "#"
        },
        {
          id: 3,
          title: "Chinese demand outlook shifts commodity market sentiment",
          source: "Financial Times",
          time: "1 day ago",
          impact: "high",
          url: "#"
        }
      ]
    };
    
    // Extract the base asset from "GOLD/USD" format
    const baseAsset = type.split('/')[0];
    
    // Return news for specific commodity or default
    return newsItems[baseAsset as keyof typeof newsItems] || newsItems.default;
  };
  
  const news = getNewsForCommodity(commodityType);
  
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-500 border-red-500';
      case 'medium':
        return 'text-yellow-500 border-yellow-500';
      case 'low':
        return 'text-green-500 border-green-500';
      default:
        return 'text-blue-500 border-blue-500';
    }
  };

  return (
    <Card className="bg-primary-800 border-primary-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold flex items-center">
          <Newspaper className="mr-2 h-5 w-5 text-accent-500" />
          Market News & Updates
          <Button variant="link" size="sm" className="ml-auto text-accent-400">
            See All News
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {news.map((item) => (
            <div key={item.id} className="group">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-medium group-hover:text-accent-400 transition-colors line-clamp-2">{item.title}</h3>
                <Badge 
                  variant="outline" 
                  className={`ml-2 flex-shrink-0 ${getImpactColor(item.impact)}`}
                >
                  {item.impact}
                </Badge>
              </div>
              
              <div className="flex items-center text-xs text-gray-400 mb-2">
                <Globe className="h-3 w-3 mr-1" />
                <span>{item.source}</span>
                <span className="mx-2">•</span>
                <Clock className="h-3 w-3 mr-1" />
                <span>{item.time}</span>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs pl-0 text-accent-500 hover:text-accent-400"
              >
                Read more
                <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
              
              {item.id < news.length && <Separator className="my-3" />}
            </div>
          ))}
          
          <div className="mt-3 pt-2 border-t border-primary-700">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Economic Calendar</span>
              <Button variant="ghost" size="sm" className="text-accent-500 hover:text-accent-400 text-xs">
                View Calendar
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
            <div className="mt-2 text-sm">
              <div className="flex justify-between items-center py-1">
                <span>US Crude Oil Inventories</span>
                <span className="text-yellow-500">Today 10:30 AM</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span>FOMC Meeting Minutes</span>
                <span>Tomorrow 2:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}