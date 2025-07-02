// Export all types from sub-modules
export * from './goals';
export * from './dashboard';

// Enterprise types
export * from './enterprise';

// Common types used across the application
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  created_at: string;
  updated_at: string;
}

export interface Connection {
  id: string;
  user_id: string;
  platform: string;
  service?: string;
  status: 'connected' | 'disconnected' | 'error';
  credentials: any;
  metadata?: any;
  account_details?: any;
  created_at: string;
  updated_at: string;
  last_connected?: string;
}

export interface Platform {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  status: 'connected' | 'disconnected' | 'error';
  services?: string[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  scopes: string[];
  icon: React.ComponentType<any>;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
  label?: string;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }[];
}

export interface KPIMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
  format: 'currency' | 'number' | 'percentage';
  platform?: string;
  channel?: string;
}

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  target_value: number;
  current_value: number;
  unit: string;
  deadline: string;
  status: 'active' | 'completed' | 'overdue';
  category: 'revenue' | 'conversion' | 'traffic' | 'engagement';
  created_at: string;
  updated_at: string;
} 