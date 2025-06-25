import React from 'react';
import { X, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

interface WooCommerceGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WooCommerceGuideModal: React.FC<WooCommerceGuideModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = React.useState(0);

  const steps = [
    {
      title: "Bước 1: Mở cài đặt nâng cao",
      description: "Từ thanh công cụ WordPress, đi đến WooCommerce > Settings > Advanced.",
      image: "https://www.businessbloomer.com/wp-content/uploads/2022/02/Screenshot-2022-02-14-at-22.18.32.png",
      instructions: [
        "Đăng nhập vào WordPress Admin Panel.",
        "Ở thanh công cụ bên trái, chọn 'WooCommerce', sau đó chọn 'Settings'.",
        "Trong trang Settings, chọn tab 'Advanced'."
      ]
    },
    {
      title: "Bước 2: Truy cập REST API",
      description: "Trong trang Advanced, tìm và nhấn vào mục REST API.",
      image: "https://www.businessbloomer.com/wp-content/uploads/2022/02/Screenshot-2022-02-14-at-22.18.42.png",
      instructions: [
        "Trong trang Advanced settings, nhấn vào link 'REST API'.",
        "Nhấn vào nút 'Add key' hoặc 'Create an API key'."
      ]
    },
    {
      title: "Bước 3: Tạo API Key",
      description: "Điền thông tin và cấp quyền cho API key.",
      image: "https://www.businessbloomer.com/wp-content/uploads/2022/02/Screenshot-2022-02-14-at-22.19.01.png",
      instructions: [
        "Ở phần 'Description', đặt tên key, ví dụ: 'Digital Performance Optimizer'.",
        "Ở phần 'Permissions', chọn 'Read/Write'.",
        "Nhấn nút 'Generate API key'."
      ]
    },
    {
      title: "Bước 4: Sao chép thông tin key",
      description: "Sao chép Consumer Key và Consumer Secret để sử dụng.",
      image: "https://www.businessbloomer.com/wp-content/uploads/2022/02/Screenshot-2022-02-14-at-22.19.11.png",
      instructions: [
        "Sao chép 'Consumer Key' (bắt đầu bằng ck_).",
        "Sao chép 'Consumer Secret' (bắt đầu bằng cs_).",
        "Lưu ý: Consumer Secret chỉ hiển thị một lần duy nhất!",
        "Dán 2 key này vào form kết nối của ứng dụng."
      ]
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Hướng dẫn tạo WooCommerce API Keys
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {/* Step indicator */}
          <div className="flex items-center justify-center mb-6">
            {steps.map((_, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index <= currentStep 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                }`}>
                  {index < currentStep ? <CheckCircle size={16} /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    index < currentStep ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Current step content */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {steps[currentStep].title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {steps[currentStep].description}
            </p>
          </div>

          {/* Image */}
          <div className="mb-6">
            <img
              src={steps[currentStep].image}
              alt={steps[currentStep].title}
              className="w-full h-64 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
            />
          </div>

          {/* Instructions */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              Hướng dẫn chi tiết:
            </h4>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
              {steps[currentStep].instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center px-4 py-2 rounded-md ${
              currentStep === 0
                ? 'bg-gray-200 dark:bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
            }`}
          >
            <ChevronLeft size={16} className="mr-2" />
            Trước
          </button>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            {currentStep + 1} / {steps.length}
          </div>

          <button
            onClick={currentStep === steps.length - 1 ? onClose : nextStep}
            className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            {currentStep === steps.length - 1 ? (
              <>
                Hoàn thành
                <CheckCircle size={16} className="ml-2" />
              </>
            ) : (
              <>
                Tiếp theo
                <ChevronRight size={16} className="ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WooCommerceGuideModal; 