import React from 'react';
import { Facebook, BarChart3, Mail, Users, Building } from 'lucide-react';
import { TikTokIcon, ShopifyIcon, ShopeeIcon, LazadaIcon, WooCommerceIcon } from './icons';
import { PlatformCategory } from './types';

export const platformsData: PlatformCategory[] = [
  {
    title: 'Social & Ads Platforms',
    platforms: [
      { 
        id: 'meta', 
        name: 'Meta', 
        description: 'Facebook, Instagram & WhatsApp', 
        icon: <Facebook className="w-6 h-6" />, 
        color: 'bg-blue-600', 
        status: 'available', 
        services: [
          { id: 'fb-pages', name: 'Facebook Pages', description: 'Theo dõi hiệu suất Fanpage', isConnected: false },
          { id: 'ig-business', name: 'Instagram Business', description: 'Analytics và insights Instagram', isConnected: false },
          { id: 'wa-business', name: 'WhatsApp Business', description: 'Tương tác và tin nhắn', isConnected: false },
          { id: 'meta-ads', name: 'Ad Accounts', description: 'Hiệu suất quảng cáo', isConnected: false },
          { id: 'meta-pixel', name: 'Pixels', description: 'Theo dõi chuyển đổi', isConnected: false },
        ] 
      },
      { 
        id: 'google', 
        name: 'Google', 
        description: 'Analytics, Ads, Search & YouTube', 
        icon: <BarChart3 className="w-6 h-6" />, 
        color: 'bg-red-500', 
        status: 'available', 
        services: [
          { id: 'ga4', name: 'Google Analytics 4', description: 'Phân tích website', isConnected: false },
          { id: 'g-ads', name: 'Google Ads', description: 'Hiệu suất quảng cáo PPC', isConnected: false },
          { id: 'g-merchant', name: 'Google Merchant Center', description: 'Phân tích E-commerce', isConnected: false },
          { id: 'gmb', name: 'Google My Business', description: 'Hiệu suất Local SEO', isConnected: false },
          { id: 'gsc', name: 'Search Console', description: 'Hiệu suất SEO', isConnected: false },
          { id: 'youtube', name: 'YouTube Channel', description: 'Phân tích kênh', isConnected: false },
        ] 
      },
      { 
        id: 'tiktok', 
        name: 'TikTok', 
        description: 'Short-form video, ads & shop', 
        icon: <TikTokIcon />, 
        color: 'bg-black', 
        status: 'available', 
        services: [
          { id: 'tiktok-profile', name: 'TikTok Profile (Channel)', description: 'Phân tích kênh và video', isConnected: false },
          { id: 'tiktok-ads', name: 'TikTok Ads Manager', description: 'Hiệu suất quảng cáo', isConnected: false },
          { id: 'tiktok-business', name: 'TikTok Business Center', description: 'Quản lý tài sản', isConnected: false },
          { id: 'tiktok-shop', name: 'TikTok Shop', description: 'Hiệu suất bán hàng', isConnected: false },
          { id: 'tiktok-pixel', name: 'TikTok Pixel', description: 'Theo dõi chuyển đổi', isConnected: false },
        ] 
      },
      { 
        id: 'linkedin', 
        name: 'LinkedIn', 
        description: 'B2B marketing & professional ads', 
        icon: <Building className="w-6 h-6" />, 
        color: 'bg-sky-700', 
        status: 'coming_soon', 
        services: [
          { id: 'linkedin-page', name: 'LinkedIn Pages', description: 'Phân tích trang công ty', isConnected: false },
          { id: 'linkedin-ads', name: 'LinkedIn Ads', description: 'Hiệu suất quảng cáo B2B', isConnected: false },
        ] 
      },
    ]
  },
  {
    title: 'E-commerce Platforms',
    platforms: [
      { 
        id: 'shopify', 
        name: 'Shopify', 
        description: 'Your e-commerce store', 
        icon: <ShopifyIcon />, 
        color: 'bg-green-600', 
        status: 'coming_soon', 
        services: [
          { id: 'shopify-analytics', name: 'Store Analytics', description: 'Doanh thu, đơn hàng, AOV', isConnected: false },
          { id: 'shopify-products', name: 'Products & Inventory', description: 'Hiệu suất sản phẩm', isConnected: false },
          { id: 'shopify-customers', name: 'Orders & Customers', description: 'Phân tích khách hàng', isConnected: false },
        ] 
      },
      { 
        id: 'woocommerce', 
        name: 'WooCommerce', 
        description: 'Your WordPress e-commerce store', 
        icon: <WooCommerceIcon />, 
        color: 'bg-purple-600', 
        status: 'available', 
        services: [
          { id: 'woo-analytics', name: 'Store Analytics', description: 'Doanh thu, đơn hàng, AOV', isConnected: false },
          { id: 'woo-products', name: 'Products & Inventory', description: 'Hiệu suất sản phẩm', isConnected: false },
          { id: 'woo-customers', name: 'Orders & Customers', description: 'Phân tích khách hàng', isConnected: false },
        ] 
      },
    ]
  },
  {
    title: 'E-commerce Marketplaces',
    platforms: [
      { 
        id: 'shopee', 
        name: 'Shopee', 
        description: 'Sàn TMĐT hàng đầu ĐNÁ', 
        icon: <ShopeeIcon />, 
        color: 'bg-orange-600', 
        status: 'coming_soon', 
        services: [
          { id: 'shopee-analytics', name: 'Shop Analytics & Sales', description: 'Doanh thu, đơn hàng, traffic', isConnected: false },
          { id: 'shopee-products', name: 'Product Performance', description: 'Hiệu suất sản phẩm', isConnected: false },
          { id: 'shopee-ads', name: 'Shopee Ads', description: 'Hiệu suất quảng cáo trên sàn', isConnected: false },
        ] 
      },
      { 
        id: 'lazada', 
        name: 'Lazada', 
        description: 'Sàn TMĐT lớn tại ĐNÁ', 
        icon: <LazadaIcon />, 
        color: 'bg-indigo-600', 
        status: 'coming_soon', 
        services: [
          { id: 'lazada-analytics', name: 'Store Analytics & Sales', description: 'Doanh thu, đơn hàng, traffic', isConnected: false },
          { id: 'lazada-products', name: 'Product Performance', description: 'Hiệu suất sản phẩm', isConnected: false },
          { id: 'lazada-ads', name: 'Lazada Ads', description: 'Hiệu suất quảng cáo trên sàn', isConnected: false },
        ] 
      },
    ]
  },
  {
    title: 'Marketing Automation & CRM',
    platforms: [
      { 
        id: 'email', 
        name: 'Email Marketing', 
        description: 'Mailchimp, Klaviyo, etc.', 
        icon: <Mail className="w-6 h-6" />, 
        color: 'bg-yellow-500', 
        status: 'coming_soon', 
        services: [
          { id: 'mailchimp', name: 'Mailchimp', description: 'Kết nối tài khoản Mailchimp', isConnected: false },
          { id: 'klaviyo', name: 'Klaviyo', description: 'Kết nối tài khoản Klaviyo', isConnected: false },
        ] 
      },
      { 
        id: 'crm', 
        name: 'CRM', 
        description: 'HubSpot, Salesforce, etc.', 
        icon: <Users className="w-6 h-6" />, 
        color: 'bg-orange-500', 
        status: 'coming_soon', 
        services: [
          { id: 'hubspot', name: 'HubSpot', description: 'Kết nối tài khoản HubSpot', isConnected: false },
          { id: 'salesforce', name: 'Salesforce', description: 'Kết nối tài khoản Salesforce', isConnected: false },
        ] 
      },
    ]
  }
]; 