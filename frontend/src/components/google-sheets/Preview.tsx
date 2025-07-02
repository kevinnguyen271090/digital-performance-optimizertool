import React from 'react';

interface PreviewProps {
  previewData?: any[];
  onNext: () => void;
  onBack: () => void;
}

const Preview: React.FC<PreviewProps> = ({ previewData = [], onNext, onBack }) => {
  // Hiển thị dữ liệu mẫu hoặc dữ liệu thật
  const columns = previewData.length > 0 ? Object.keys(previewData[0]) : [];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2 text-black">Xem trước dữ liệu</h3>
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full border">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col} className="border px-2 py-1 bg-gray-100">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {previewData.map((row, idx) => (
              <tr key={idx}>
                {columns.map((col) => (
                  <td key={col} className="border px-2 py-1">{row[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <button className="px-3 py-2 bg-gray-200 rounded mr-2 text-black" onClick={onBack}>
          Quay lại
        </button>
        <button className="px-3 py-2 bg-blue-600 text-white rounded" onClick={onNext}>
          Tiếp tục
        </button>
      </div>
    </div>
  );
};

export default Preview; 