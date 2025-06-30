import React, { useState, useRef } from 'react';
import { X, Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface KPIImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (kpis: any[]) => void;
}

interface KPIRow {
  title: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  period: string;
  description?: string;
}

const KPIImportModal: React.FC<KPIImportModalProps> = ({ isOpen, onClose, onImport }) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<KPIRow[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'upload' | 'preview' | 'confirm'>('upload');

  const units = [
    { value: "sessions", label: "Sessions" },
    { value: "revenue", label: "Doanh thu (VNĐ)" },
    { value: "orders", label: "Đơn hàng" },
    { value: "ctr", label: "CTR (%)" },
    { value: "cpa", label: "CPA (VNĐ)" },
    { value: "roas", label: "ROAS (x)" },
    { value: "impressions", label: "Impressions" },
    { value: "clicks", label: "Clicks" },
    { value: "conversions", label: "Chuyển đổi" }
  ];

  const periods = [
    { value: "daily", label: "Hàng ngày" },
    { value: "weekly", label: "Hàng tuần" },
    { value: "monthly", label: "Hàng tháng" },
    { value: "quarterly", label: "Hàng quý" },
    { value: "yearly", label: "Hàng năm" }
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Kiểm tra file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls') && !file.name.endsWith('.csv')) {
      alert('Vui lòng chọn file Excel (.xlsx, .xls) hoặc CSV');
      return;
    }

    setUploadedFile(file);
    setIsProcessing(true);

    try {
      // Parse Excel file
      const XLSX = await import('xlsx');
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          // Validate và parse data
          const parsed = parseExcelData(jsonData);
          setParsedData(parsed.data);
          setValidationErrors(parsed.errors);
          
          if (parsed.errors.length === 0) {
            setStep('preview');
          }
        } catch (error) {
          console.error('Lỗi parse file:', error);
          alert('Lỗi khi đọc file. Vui lòng kiểm tra định dạng file.');
        }
        setIsProcessing(false);
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Lỗi import XLSX:', error);
      alert('Lỗi khi xử lý file. Vui lòng thử lại.');
      setIsProcessing(false);
    }
  };

  const parseExcelData = (jsonData: any[]): { data: KPIRow[], errors: string[] } => {
    const errors: string[] = [];
    const data: KPIRow[] = [];

    // Bỏ qua header row
    const dataRows = jsonData.slice(1);

    dataRows.forEach((row, index) => {
      const rowNumber = index + 2; // +2 vì bỏ header và index bắt đầu từ 0

      if (!row || row.length < 4) {
        errors.push(`Dòng ${rowNumber}: Thiếu dữ liệu`);
        return;
      }

      const [title, targetValue, currentValue, unit, period, description] = row;

      // Validate required fields
      if (!title || typeof title !== 'string') {
        errors.push(`Dòng ${rowNumber}: Tên KPI không hợp lệ`);
        return;
      }

      if (!targetValue || isNaN(Number(targetValue))) {
        errors.push(`Dòng ${rowNumber}: Giá trị mục tiêu không hợp lệ`);
        return;
      }

      if (currentValue && isNaN(Number(currentValue))) {
        errors.push(`Dòng ${rowNumber}: Giá trị hiện tại không hợp lệ`);
        return;
      }

      // Validate unit
      const validUnits = units.map(u => u.value);
      if (!unit || !validUnits.includes(unit.toLowerCase())) {
        errors.push(`Dòng ${rowNumber}: Đơn vị không hợp lệ. Các đơn vị hợp lệ: ${validUnits.join(', ')}`);
        return;
      }

      // Validate period
      const validPeriods = periods.map(p => p.value);
      if (!period || !validPeriods.includes(period.toLowerCase())) {
        errors.push(`Dòng ${rowNumber}: Chu kỳ không hợp lệ. Các chu kỳ hợp lệ: ${validPeriods.join(', ')}`);
        return;
      }

      data.push({
        title: title.trim(),
        targetValue: Number(targetValue),
        currentValue: currentValue ? Number(currentValue) : 0,
        unit: unit.toLowerCase(),
        period: period.toLowerCase(),
        description: description || ''
      });
    });

    return { data, errors };
  };

  const handleConfirmImport = () => {
    if (parsedData.length > 0) {
      onImport(parsedData);
      onClose();
      resetModal();
    }
  };

  const resetModal = () => {
    setUploadedFile(null);
    setParsedData([]);
    setValidationErrors([]);
    setStep('upload');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadTemplate = () => {
    const XLSX = require('xlsx');
    const template = [
      ['Tên KPI', 'Giá trị mục tiêu', 'Giá trị hiện tại', 'Đơn vị', 'Chu kỳ', 'Mô tả'],
      ['Doanh thu tháng', 100000000, 85000000, 'revenue', 'monthly', 'Tổng doanh thu hàng tháng'],
      ['Số đơn hàng', 1000, 850, 'orders', 'monthly', 'Số đơn hàng thành công'],
      ['CTR trung bình', 2.5, 2.1, 'ctr', 'monthly', 'Click-through rate trung bình'],
      ['CPA mục tiêu', 50000, 55000, 'cpa', 'monthly', 'Chi phí mỗi chuyển đổi'],
    ];

    const ws = XLSX.utils.aoa_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'KPI Template');
    XLSX.writeFile(wb, 'kpi_template.xlsx');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Nhập KPI hàng loạt từ Excel
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {step === 'upload' && (
            <div className="space-y-6">
              {/* Template download */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Hướng dẫn sử dụng
                </h3>
                <p className="text-blue-800 dark:text-blue-200 text-sm mb-3">
                  Tải template mẫu và điền dữ liệu theo định dạng. File Excel phải có các cột: Tên KPI, Giá trị mục tiêu, Giá trị hiện tại, Đơn vị, Chu kỳ, Mô tả.
                </p>
                <button
                  onClick={downloadTemplate}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Tải template mẫu
                </button>
              </div>

              {/* File upload */}
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Chọn file Excel hoặc CSV
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Kéo thả file vào đây hoặc click để chọn file
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isProcessing}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 mx-auto"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isProcessing ? 'Đang xử lý...' : 'Chọn file'}
                </button>
              </div>

              {/* Validation errors */}
              {validationErrors.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    <h3 className="font-semibold text-red-800 dark:text-red-200">
                      Lỗi validation ({validationErrors.length})
                    </h3>
                  </div>
                  <ul className="text-red-700 dark:text-red-300 text-sm space-y-1">
                    {validationErrors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {step === 'preview' && (
            <div className="space-y-6">
              {/* Success message */}
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-green-800 dark:text-green-200 font-semibold">
                    Đã parse thành công {parsedData.length} KPI từ file
                  </span>
                </div>
              </div>

              {/* Preview table */}
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 dark:border-gray-700 rounded-lg">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Tên KPI</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Mục tiêu</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Hiện tại</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Đơn vị</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Chu kỳ</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 dark:text-white">Mô tả</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {parsedData.map((kpi, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{kpi.title}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{kpi.targetValue.toLocaleString('vi-VN')}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{kpi.currentValue.toLocaleString('vi-VN')}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{units.find(u => u.value === kpi.unit)?.label || kpi.unit}</td>
                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">{periods.find(p => p.value === kpi.period)?.label || kpi.period}</td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{kpi.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            Hủy
          </button>
          {step === 'preview' && (
            <button
              onClick={handleConfirmImport}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Xác nhận import ({parsedData.length} KPI)
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default KPIImportModal; 