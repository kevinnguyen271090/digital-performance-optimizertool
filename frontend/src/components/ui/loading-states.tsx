import React from 'react';
import { Skeleton } from './skeleton';

// Modern Page Loading
export const PageLoading: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
    <div className="text-center space-y-6">
      <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center animate-pulse">
        <svg className="w-10 h-10 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-6 w-48 mx-auto" />
        <Skeleton className="h-4 w-32 mx-auto" />
      </div>
    </div>
  </div>
);

// Modern Dashboard Loading
export const DashboardLoading: React.FC = () => (
  <div className="space-y-6 animate-fade-in">
    {/* Header Skeleton */}
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-96" />
    </div>

    {/* KPI Cards Skeleton */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      ))}
    </div>

    {/* Charts Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-soft">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-8 w-20 rounded-lg" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="mt-6 flex space-x-2">
            {Array.from({ length: 7 }).map((_, j) => (
              <Skeleton key={j} className="h-32 w-8 rounded-full" />
            ))}
          </div>
        </div>
      ))}
    </div>

    {/* Table Skeleton */}
    <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-soft">
      <div className="flex items-center justify-between mb-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-4 w-8" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Modern Chart Loading
export const ChartLoading: React.FC = () => (
  <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-soft">
    <div className="flex items-center justify-between mb-6">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-8 w-20 rounded-lg" />
    </div>
    <div className="space-y-4">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-5/6" />
    </div>
    <div className="mt-6 flex space-x-2">
      {Array.from({ length: 7 }).map((_, i) => (
        <Skeleton key={i} className="h-32 w-8 rounded-full" />
      ))}
    </div>
  </div>
);

// Modern Table Loading
export const TableLoading: React.FC = () => (
  <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 shadow-soft">
    <div className="flex items-center justify-between mb-6">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-8 w-24 rounded-lg" />
    </div>
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  </div>
);

// Modern Modal Loading
export const ModalLoading: React.FC = () => (
  <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
    <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-3xl shadow-strong w-full max-w-md mx-4 border border-gray-200/50 dark:border-gray-700/50">
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="flex justify-end space-x-3">
          <Skeleton className="h-10 w-20 rounded-xl" />
          <Skeleton className="h-10 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  </div>
);

// Modern Spinner
export const ModernSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-purple-500`} />
    </div>
  );
};

// Modern Progress Bar
export const ModernProgressBar: React.FC<{ progress: number; label?: string }> = ({ progress, label }) => (
  <div className="space-y-2">
    {label && (
      <div className="flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
        <span className="font-medium text-gray-900 dark:text-white">{progress}%</span>
      </div>
    )}
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
      <div 
        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  </div>
); 