import React from 'react';
import { BarChart3, Search, Megaphone, LucideProps, Music, ShoppingCart, Store, ShoppingBag, Puzzle } from 'lucide-react';

// Sử dụng icon từ Lucide làm biểu tượng cho các dịch vụ Google
export const GoogleAnalyticsIcon: React.FC<LucideProps> = (props) => (
  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
    <BarChart3 className="w-5 h-5 text-blue-600" {...props} />
  </div>
);

export const GoogleSearchConsoleIcon: React.FC<LucideProps> = (props) => (
  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
    <Search className="w-5 h-5 text-green-600" {...props} />
  </div>
);

export const GoogleAdsIcon: React.FC<LucideProps> = (props) => (
  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
    <Megaphone className="w-5 h-5 text-orange-600" {...props} />
  </div>
);

// Placeholder Icons for other platforms
export const TikTokIcon: React.FC<LucideProps> = (props) => (
    <Music {...props} />
);

export const ShopifyIcon: React.FC<LucideProps> = (props) => (
    <Store {...props} />
);

export const WooCommerceIcon: React.FC<LucideProps> = (props) => (
    <Puzzle {...props} />
);

export const ShopeeIcon: React.FC<LucideProps> = (props) => (
    <ShoppingBag {...props} />
);

export const LazadaIcon: React.FC<LucideProps> = (props) => (
    <ShoppingCart {...props} />
);