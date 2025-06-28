#!/bin/bash

# Digital Performance Optimizer - Setup Script
# Hướng dẫn setup tự động cho dự án

echo "🚀 Digital Performance Optimizer - Setup Script"
echo "================================================"

# Kiểm tra Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js chưa được cài đặt. Vui lòng cài đặt Node.js 18+"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version phải >= 18. Hiện tại: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Kiểm tra npm/yarn
if command -v yarn &> /dev/null; then
    PACKAGE_MANAGER="yarn"
    echo "✅ Sử dụng Yarn"
elif command -v npm &> /dev/null; then
    PACKAGE_MANAGER="npm"
    echo "✅ Sử dụng npm"
else
    echo "❌ Chưa cài đặt npm hoặc yarn"
    exit 1
fi

# Tạo .env.local nếu chưa có
if [ ! -f .env.local ]; then
    echo "📝 Tạo file .env.local..."
    cat > .env.local << EOF
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
VITE_GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret

# Meta (Facebook) OAuth Configuration
VITE_META_APP_ID=your_meta_app_id
VITE_META_APP_SECRET=your_meta_app_secret

# TikTok OAuth Configuration
VITE_TIKTOK_CLIENT_KEY=your_tiktok_client_key
VITE_TIKTOK_CLIENT_SECRET=your_tiktok_client_secret

# WooCommerce Configuration
VITE_WOOCOMMERCE_CONSUMER_KEY=your_woocommerce_consumer_key
VITE_WOOCOMMERCE_CONSUMER_SECRET=your_woocommerce_consumer_secret

# Application Configuration
VITE_APP_NAME=Digital Performance Optimizer
VITE_APP_VERSION=1.0.0
VITE_APP_ENV=development

# API Configuration
VITE_API_BASE_URL=http://localhost:5173
VITE_API_TIMEOUT=30000

# Feature Flags
VITE_ENABLE_GOOGLE_ANALYTICS=true
VITE_ENABLE_META_ADS=true
VITE_ENABLE_TIKTOK_ADS=true
VITE_ENABLE_WOOCOMMERCE=true
VITE_ENABLE_AI_INSIGHTS=false

# Development Configuration
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug
EOF
    echo "✅ Đã tạo file .env.local"
else
    echo "✅ File .env.local đã tồn tại"
fi

# Install dependencies
echo "📦 Cài đặt dependencies..."
$PACKAGE_MANAGER install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies đã được cài đặt thành công"
else
    echo "❌ Lỗi khi cài đặt dependencies"
    exit 1
fi

# Kiểm tra Supabase CLI
if ! command -v supabase &> /dev/null; then
    echo "⚠️  Supabase CLI chưa được cài đặt"
    echo "📋 Hướng dẫn cài đặt Supabase CLI:"
    echo "   npm install -g supabase"
    echo "   hoặc"
    echo "   yarn global add supabase"
else
    echo "✅ Supabase CLI đã được cài đặt"
fi

echo ""
echo "🎉 Setup hoàn tất!"
echo ""
echo "📋 Các bước tiếp theo:"
echo "1. Cập nhật file .env.local với thông tin thực tế"
echo "2. Setup Supabase project (xem docs/SETUP_GUIDE.md)"
echo "3. Tạo OAuth apps cho Google, Meta, TikTok"
echo "4. Chạy 'npm run dev' để khởi động development server"
echo ""
echo "📚 Tài liệu:"
echo "- Setup Guide: docs/SETUP_GUIDE.md"
echo "- Planning: docs/PLANNING.md"
echo "- README: README.md"
echo ""
echo "🚀 Chạy lệnh sau để khởi động:"
echo "   npm run dev" 