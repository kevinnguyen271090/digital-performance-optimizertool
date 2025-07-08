import React from 'react';
import { Heart, Share2, MessageCircle, Bookmark, MousePointer } from 'lucide-react';

interface ChannelDetailEngagementProps {
  engagement?: {
    likes: number;
    shares: number;
    comments: number;
    saves: number;
    clicks: number;
  };
}

const ChannelDetailEngagement: React.FC<ChannelDetailEngagementProps> = ({
  engagement
}) => {
  if (!engagement) {
    return (
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Engagement Metrics
        </h3>
        <div className="text-center py-8 text-gray-500">
          Engagement data not available
        </div>
      </div>
    );
  }

  const engagementMetrics = [
    { name: 'Likes', value: engagement.likes, icon: <Heart className="w-5 h-5" />, color: '#EF4444' },
    { name: 'Shares', value: engagement.shares, icon: <Share2 className="w-5 h-5" />, color: '#3B82F6' },
    { name: 'Comments', value: engagement.comments, icon: <MessageCircle className="w-5 h-5" />, color: '#10B981' },
    { name: 'Saves', value: engagement.saves, icon: <Bookmark className="w-5 h-5" />, color: '#F59E0B' },
    { name: 'Clicks', value: engagement.clicks, icon: <MousePointer className="w-5 h-5" />, color: '#8B5CF6' }
  ];

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Engagement Metrics
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {engagementMetrics.map((metric, index) => (
          <div key={index} className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${metric.color}20` }}>
                <div style={{ color: metric.color }}>
                  {metric.icon}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">{metric.name}</h4>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{metric.value.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChannelDetailEngagement; 