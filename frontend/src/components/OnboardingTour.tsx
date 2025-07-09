import React from 'react';
import Joyride, { Step, CallBackProps } from 'react-joyride';
import { Sparkles, TrendingUp, Settings, BarChart3 } from 'lucide-react';

interface OnboardingTourProps {
  run: boolean;
  onComplete: () => void;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ run, onComplete }) => {
  const steps: Step[] = [
    {
      target: '#tour-step-1',
      content: (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Chào mừng đến Avenger Hub!
            </h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Đây là nơi bạn sẽ quản lý tất cả hiệu suất digital marketing một cách thông minh và hiệu quả.
          </p>
        </div>
      ),
      placement: 'bottom',
      title: '🚀 Khởi đầu hành trình',
    },
    {
      target: '#tour-step-2',
      content: (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Kết nối nền tảng
            </h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Vào mục "Settings" để kết nối Google Analytics, Meta Ads và các kênh marketing khác. Dữ liệu sẽ được đồng bộ tự động.
          </p>
        </div>
      ),
      placement: 'right',
      title: '🔗 Thiết lập tích hợp',
    },
    {
      target: '[data-testid="kpi-card-sessions"]',
      content: (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Theo dõi KPIs
            </h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Tất cả chỉ số quan trọng sẽ được hiển thị và cập nhật liên tục. Theo dõi hiệu suất real-time và đưa ra quyết định thông minh.
          </p>
        </div>
      ),
      placement: 'bottom',
      title: '📊 Phân tích dữ liệu',
    },
    {
      target: 'body',
      content: (
        <div className="space-y-3 text-center">
          <div className="flex items-center justify-center space-x-2">
            <TrendingUp className="w-6 h-6 text-purple-500" />
            <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Sẵn sàng tối ưu!
            </h3>
          </div>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Bạn đã sẵn sàng để khám phá và tối ưu hóa hiệu suất marketing. Hãy bắt đầu kết nối và theo dõi ngay!
          </p>
        </div>
      ),
      placement: 'center',
      title: '🎯 Bắt đầu hành trình',
    }
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = ['finished', 'skipped'];

    if (finishedStatuses.includes(status)) {
      onComplete();
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      disableScrollParentFix={true}
      styles={{
        options: {
          arrowColor: 'rgba(255, 255, 255, 0.95)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          primaryColor: '#8b5cf6',
          textColor: '#1f2937',
          zIndex: 1000,
          overlayColor: 'rgba(0, 0, 0, 0.5)',
        },
        tooltip: {
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(139, 92, 246, 0.1)',
          backdropFilter: 'blur(10px)',
        },
        tooltipTitle: {
          fontSize: '18px',
          fontWeight: '700',
          marginBottom: '12px',
        },
        tooltipContent: {
          fontSize: '14px',
          lineHeight: '1.6',
        },
        buttonNext: {
          borderRadius: '12px',
          padding: '12px 24px',
          fontSize: '14px',
          fontWeight: '600',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
          border: 'none',
          color: 'white',
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 14px 0 rgba(139, 92, 246, 0.3)',
        },
        buttonBack: {
          borderRadius: '12px',
          padding: '12px 24px',
          fontSize: '14px',
          fontWeight: '600',
          marginRight: 'auto',
          background: 'rgba(107, 114, 128, 0.1)',
          border: '1px solid rgba(107, 114, 128, 0.2)',
          color: '#6b7280',
          transition: 'all 0.3s ease',
        },
        buttonSkip: {
          borderRadius: '12px',
          padding: '8px 16px',
          fontSize: '12px',
          fontWeight: '500',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          color: '#ef4444',
          transition: 'all 0.3s ease',
        },
        buttonClose: {
          borderRadius: '50%',
          width: '32px',
          height: '32px',
          background: 'rgba(107, 114, 128, 0.1)',
          border: '1px solid rgba(107, 114, 128, 0.2)',
          color: '#6b7280',
          transition: 'all 0.3s ease',
        },
        overlay: {
          backdropFilter: 'blur(4px)',
        },
        spotlight: {
          borderRadius: '12px',
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
        },
      }}
      locale={{
        back: '← Trước',
        next: 'Tiếp →',
        last: '🎉 Hoàn thành',
        skip: '⏭️ Bỏ qua',
        close: '✕',
      }}
    />
  );
};

export default OnboardingTour; 