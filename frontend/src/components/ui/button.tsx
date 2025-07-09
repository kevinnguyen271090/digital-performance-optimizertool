import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow hover:from-purple-700 hover:to-pink-700 hover:shadow-medium active:scale-95",
        destructive: "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-sm hover:from-red-600 hover:to-pink-600 hover:shadow-medium active:scale-95",
        outline: "border-2 border-purple-500 text-purple-600 bg-white dark:bg-gray-800 rounded-lg hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 hover:text-white hover:border-transparent transition-all duration-200",
        secondary: "bg-white dark:bg-gray-800 text-purple-600 border border-purple-500 shadow-sm hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 active:scale-95",
        ghost: "bg-transparent text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 active:scale-95",
        link: "text-purple-600 underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-soft hover:from-purple-700 hover:to-pink-700 hover:shadow-medium active:scale-95 transition-all duration-300",
        gradientSuccess: "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-soft hover:from-green-600 hover:to-emerald-600 hover:shadow-medium active:scale-95 transition-all duration-300",
        gradientWarning: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-soft hover:from-yellow-600 hover:to-orange-600 hover:shadow-medium active:scale-95 transition-all duration-300",
        gradientDanger: "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-soft hover:from-red-600 hover:to-pink-600 hover:shadow-medium active:scale-95 transition-all duration-300",
        glass: "bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-soft hover:bg-white/20 hover:shadow-medium active:scale-95",
        outlineGradient: "border-2 border-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-border text-gray-700 dark:text-gray-200 hover:from-purple-700 hover:to-pink-700 hover:shadow-medium active:scale-95",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-md px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "gradient",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, icon, iconPosition = 'left', children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && (
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        
        {!loading && icon && iconPosition === 'left' && (
          <span className="mr-2">{icon}</span>
        )}
        
        {children}
        
        {!loading && icon && iconPosition === 'right' && (
          <span className="ml-2">{icon}</span>
        )}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants } 