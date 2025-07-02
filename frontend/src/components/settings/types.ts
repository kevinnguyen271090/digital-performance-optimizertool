export interface Service {
  id: string;
  name: string;
  description: string;
  isConnected: boolean;
}

export interface Platform {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  services: Service[];
  status: 'available' | 'coming_soon' | 'connected' | 'expired' | 'error';
}

export interface PlatformCategory {
  title: string;
  platforms: Platform[];
} 