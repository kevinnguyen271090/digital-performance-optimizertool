import React from 'react';
import Joyride, { Step, CallBackProps } from 'react-joyride';

interface OnboardingTourProps {
  run: boolean;
  onComplete: () => void;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ run, onComplete }) => {
  const steps: Step[] = [
    {
      target: '#tour-step-1',
      content: 'Chào mừng bạn đến với Avenger Hub! Đây là nơi bạn sẽ quản lý tất cả hiệu suất digital marketing.',
      placement: 'bottom',
      title: 'Chào mừng!',
    },
    {
      target: '#tour-step-2',
      content: 'Để bắt đầu, hãy vào mục "Settings" để kết nối các nền tảng như Google, Meta và các kênh khác.',
      placement: 'right',
      title: 'Kết nối nền tảng',
    },
    {
      target: '[data-testid="kpi-card-sessions"]', // We'll need to add this test-id to the KPICard
      content: 'Sau khi kết nối, tất cả các chỉ số quan trọng (KPIs) sẽ được hiển thị và cập nhật liên tục tại đây.',
      placement: 'bottom',
      title: 'Theo dõi KPIs',
    },
    {
        target: 'body',
        content: 'Bạn đã sẵn sàng để khám phá. Hãy kết nối và tối ưu hóa hiệu suất của bạn!',
        placement: 'center',
        title: 'Bắt đầu thôi!',
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
          arrowColor: '#fff',
          backgroundColor: '#fff',
          primaryColor: '#4f46e5',
          textColor: '#333',
          zIndex: 1000,
        },
        tooltip: {
            borderRadius: '8px',
        },
        buttonNext: {
            borderRadius: '6px',
        },
        buttonBack: {
            marginRight: 'auto',
        }
      }}
      locale={{
        back: 'Trước',
        next: 'Tiếp',
        last: 'Hoàn thành',
        skip: 'Bỏ qua',
      }}
    />
  );
};

export default OnboardingTour; 