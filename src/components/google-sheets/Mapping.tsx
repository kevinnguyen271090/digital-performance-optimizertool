import React from 'react';

interface MappingProps {
  mapping: any;
  onMappingChange: (mapping: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const Mapping: React.FC<MappingProps> = ({ mapping, onMappingChange, onNext, onBack }) => {
  // TODO: Thay bằng mapping thật, hiện tại dùng mock
  const mockColumns = ['Tên', 'Doanh thu'];
  const mockFields = ['Họ tên', 'Giá trị'];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2 text-black">Mapping cột dữ liệu</h3>
      <div className="mb-4 text-black">
        {mockFields.map((field) => (
          <div key={field} className="mb-2 flex items-center ">
            <span className="w-32">{field}</span>
            <select
              className="border rounded px-2 py-1 ml-2"
              value={mapping?.[field] || ''}
              onChange={(e) => onMappingChange({ ...mapping, [field]: e.target.value })}
            >
              <option value="">Chọn cột...</option>
              {mockColumns.map((col) => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>
        ))}
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

export default Mapping; 