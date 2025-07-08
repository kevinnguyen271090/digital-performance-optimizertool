# VITE CONFIGURATION

## 🚀 **Vite Build Tool Setup**

### **Tổng quan:**
- **Build Tool**: Vite 5.x (latest)
- **Framework**: React 18 + TypeScript
- **CSS**: Tailwind CSS
- **Development**: Hot Module Replacement (HMR)
- **Production**: Optimized builds

## 📁 **Project Structure**

```
frontend/
├── src/
│   ├── components/          # React components
│   ├── pages/              # Page components
│   ├── utils/              # Utility functions
│   ├── constants/          # Constants & configs
│   ├── hooks/              # Custom hooks
│   ├── types/              # TypeScript types
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # Entry point
│   └── index.css          # Global styles
├── public/                 # Static assets
├── index.html             # HTML template
├── package.json           # Dependencies
├── vite.config.ts         # Vite configuration
├── tsconfig.json          # TypeScript config
├── tailwind.config.js     # Tailwind config
└── .env                   # Environment variables
```

## ⚙️ **Vite Configuration**

### **vite.config.ts:**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@constants': path.resolve(__dirname, './src/constants'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@types': path.resolve(__dirname, './src/types'),
    },
  },
  server: {
    port: 3000,
    host: true,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          charts: ['recharts'],
          icons: ['lucide-react'],
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})
```

### **TypeScript Configuration:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@pages/*": ["src/pages/*"],
      "@utils/*": ["src/utils/*"],
      "@constants/*": ["src/constants/*"],
      "@hooks/*": ["src/hooks/*"],
      "@types/*": ["src/types/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## 🎨 **Tailwind CSS Configuration**

### **tailwind.config.js:**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}
```

## 📦 **Package.json Scripts**

### **Development:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext ts,tsx --fix",
    "type-check": "tsc --noEmit"
  }
}
```

## 🔧 **Environment Variables**

### **.env:**
```env
# API Configuration
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_DEBUG_MODE=false
VITE_ENABLE_MOCK_DATA=true

# Build Configuration
VITE_APP_NAME=Digital Performance Optimizer
VITE_APP_VERSION=1.0.0
```

## 🚀 **Development Commands**

### **Start Development Server:**
```bash
npm run dev
# http://localhost:3000
```

### **Build for Production:**
```bash
npm run build
# Creates dist/ folder
```

### **Preview Production Build:**
```bash
npm run preview
# http://localhost:4173
```

### **Type Checking:**
```bash
npm run type-check
# TypeScript compilation check
```

### **Linting:**
```bash
npm run lint
# ESLint check
npm run lint:fix
# ESLint auto-fix
```

## 📊 **Performance Optimizations**

### **Bundle Analysis:**
```bash
# Install bundle analyzer
npm install --save-dev rollup-plugin-visualizer

# Add to vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
    }),
  ],
})
```

### **Code Splitting:**
```typescript
// Manual chunks in vite.config.ts
rollupOptions: {
  output: {
    manualChunks: {
      vendor: ['react', 'react-dom'],
      router: ['react-router-dom'],
      charts: ['recharts'],
      icons: ['lucide-react'],
    },
  },
},
```

### **Tree Shaking:**
- ✅ Automatic tree shaking
- ✅ Dead code elimination
- ✅ Unused exports removal

## 🔍 **Development Tools**

### **React DevTools:**
- Browser extension for React debugging
- Component tree inspection
- Props and state monitoring

### **Vite DevTools:**
- Hot Module Replacement (HMR)
- Fast refresh for React components
- Error overlay with stack traces

### **TypeScript:**
- Real-time type checking
- IntelliSense support
- Error detection

## 🧪 **Testing Setup**

### **Vitest Configuration:**
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
```

### **Test Scripts:**
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:run": "vitest run"
  }
}
```

## 🚀 **Deployment Configuration**

### **Vercel Deployment:**
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### **Docker Configuration:**
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "preview"]
```

## 📈 **Performance Metrics**

### **Build Performance:**
- **Development Start**: < 2s
- **Hot Reload**: < 100ms
- **Production Build**: < 30s
- **Bundle Size**: < 500KB

### **Runtime Performance:**
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Memory Usage**: < 50MB
- **CPU Usage**: < 10%

## ✅ **Best Practices**

### **Code Organization:**
- ✅ Modular component structure
- ✅ TypeScript strict mode
- ✅ ESLint + Prettier
- ✅ Conventional commits

### **Performance:**
- ✅ Code splitting
- ✅ Tree shaking
- ✅ Lazy loading
- ✅ Bundle optimization

### **Development:**
- ✅ Hot Module Replacement
- ✅ Fast refresh
- ✅ Error overlay
- ✅ Source maps

---

**Vite Version**: 5.x
**React Version**: 18.x
**TypeScript Version**: 5.x
**Build Tool**: ✅ **OPTIMIZED**
**Development Experience**: ✅ **EXCELLENT** 