import React from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

// Modern Heading Components
export const H1: React.FC<TypographyProps> = ({ children, className }) => (
  <h1 className={cn(
    "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight",
    "bg-gradient-to-r from-primary via-accent to-purple-600 bg-clip-text text-transparent",
    "animate-fade-in",
    className
  )}>
    {children}
  </h1>
);

export const H2: React.FC<TypographyProps> = ({ children, className }) => (
  <h2 className={cn(
    "text-3xl md:text-4xl font-bold tracking-tight",
    "text-gray-900 dark:text-white",
    "animate-slide-up",
    className
  )}>
    {children}
  </h2>
);

export const H3: React.FC<TypographyProps> = ({ children, className }) => (
  <h3 className={cn(
    "text-2xl md:text-3xl font-semibold",
    "text-gray-800 dark:text-gray-100",
    "animate-fade-in",
    className
  )}>
    {children}
  </h3>
);

export const H4: React.FC<TypographyProps> = ({ children, className }) => (
  <h4 className={cn(
    "text-xl md:text-2xl font-semibold",
    "text-gray-700 dark:text-gray-200",
    className
  )}>
    {children}
  </h4>
);

// Modern Text Components
export const Lead: React.FC<TypographyProps> = ({ children, className }) => (
  <p className={cn(
    "text-xl md:text-2xl leading-relaxed",
    "text-gray-600 dark:text-gray-300",
    "animate-fade-in",
    className
  )}>
    {children}
  </p>
);

export const Large: React.FC<TypographyProps> = ({ children, className }) => (
  <p className={cn(
    "text-lg md:text-xl",
    "text-gray-700 dark:text-gray-200",
    className
  )}>
    {children}
  </p>
);

export const Small: React.FC<TypographyProps> = ({ children, className }) => (
  <p className={cn(
    "text-sm md:text-base",
    "text-gray-500 dark:text-gray-400",
    className
  )}>
    {children}
  </p>
);

export const Muted: React.FC<TypographyProps> = ({ children, className }) => (
  <p className={cn(
    "text-sm text-muted-foreground",
    "animate-fade-in",
    className
  )}>
    {children}
  </p>
);

// Modern Gradient Text Component
export const GradientText: React.FC<TypographyProps & { gradient?: 'primary' | 'secondary' | 'success' | 'warning' }> = ({ 
  children, 
  className, 
  gradient = 'primary' 
}) => {
  const gradientClasses = {
    primary: "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent",
    secondary: "bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent",
    success: "bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent",
    warning: "bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent",
  };

  return (
    <span className={cn(
      "font-bold",
      gradientClasses[gradient],
      "animate-glow",
      className
    )}>
      {children}
    </span>
  );
};

// Modern Code Text
export const Code: React.FC<TypographyProps> = ({ children, className }) => (
  <code className={cn(
    "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm",
    "bg-gray-100 dark:bg-gray-800",
    "text-gray-900 dark:text-gray-100",
    "animate-bounce-in",
    className
  )}>
    {children}
  </code>
);

// Modern List Components
export const List: React.FC<TypographyProps> = ({ children, className }) => (
  <ul className={cn(
    "my-6 ml-6 list-disc [&>li]:mt-2",
    "text-gray-700 dark:text-gray-200",
    className
  )}>
    {children}
  </ul>
);

export const InlineCode: React.FC<TypographyProps> = ({ children, className }) => (
  <code className={cn(
    "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
    "bg-gray-100 dark:bg-gray-800",
    "text-gray-900 dark:text-gray-100",
    className
  )}>
    {children}
  </code>
);

// Modern Quote Component
export const Blockquote: React.FC<TypographyProps> = ({ children, className }) => (
  <blockquote className={cn(
    "mt-6 border-l-4 border-primary pl-6 italic",
    "text-gray-700 dark:text-gray-200",
    "animate-slide-in",
    className
  )}>
    {children}
  </blockquote>
);