/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"], // Modern display font
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
        '8xl': ['6rem', { lineHeight: '1' }],
        '9xl': ['8rem', { lineHeight: '1' }],
      },
      colors: {
        // Primary & Accent
        primary: {
          DEFAULT: '#1E40AF', // Xanh dương đậm
          dark: '#93C5FD',    // Xanh dương sáng cho dark mode
        },
        accent: {
          DEFAULT: '#22D3EE', // Xanh ngọc
          light: '#5EEAD4',   // Accent sáng
        },
        // Gradient tím-hồng cho điểm nhấn
        gradientFrom: '#a21caf', // purple-600
        gradientTo: '#ec4899',   // pink-600
        // Trạng thái
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        // Nền & UI
        background: {
          light: '#F9FAFB', // Nền chính light
          dark: '#111827',  // Nền chính dark
        },
        card: {
          light: '#FFFFFF',
          dark: '#1F2937',
        },
        sidebar: {
          light: '#FFFFFF',
          dark: '#111827',
        },
        header: {
          light: '#FFFFFF',
          dark: '#1F2937',
        },
        filterbar: {
          light: '#F3F4F6',
          dark: '#374151',
        },
        tooltip: {
          light: '#374151', // Nền tooltip light
          dark: '#E5E7EB',  // Nền tooltip dark
        },
        skeleton: {
          light: '#E5E7EB',
          dark: '#374151',
        },
        border: {
          light: '#E5E7EB',
          dark: '#374151',
        },
        // Text
        text: {
          main: {
            light: '#111827',
            dark: '#F9FAFB',
          },
          secondary: {
            light: '#374151',
            dark: '#D1D5DB',
          },
        },
        // Hover
        hover: {
          light: '#1E3A8A',
          dark: '#60A5FA',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-in': 'bounceIn 0.6s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        slideIn: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.3)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '70%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #667eea, 0 0 10px #667eea, 0 0 15px #667eea' },
          '100%': { boxShadow: '0 0 10px #667eea, 0 0 20px #667eea, 0 0 30px #667eea' },
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'strong': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 2px 10px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

