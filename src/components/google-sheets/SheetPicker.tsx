import React from 'react';

interface SheetPickerProps {
  selectedFile: any;
  onSheetSelect: (sheet: any) => void;
  onNext: () => void;
  onBack: () => void;
}

const SheetPicker: React.FC<SheetPickerProps> = ({ selectedFile, onSheetSelect, onNext, onBack }) => {
  // TODO: Thay bằng danh sách sheet thật từ Google Sheets API
  const mockSheets = [
    { id: 'sheet1', name: 'Sheet1' },
    { id: 'sheet2', name: 'Doanh thu' },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2 text-black">Chọn sheet trong file: <span className="font-normal">{selectedFile?.name}</span></h3>
      <ul className="mb-4">
        {mockSheets.map((sheet) => (
          <li key={sheet.id} className="mb-2">
            <button
              className="px-3 py-2 border rounded hover:bg-blue-50 w-full text-left text-black"
              onClick={() => {
                onSheetSelect(sheet);
                onNext();
              }}
            >
              {sheet.name}
            </button>
          </li>
        ))}
      </ul>
      <button className="px-3 py-2 bg-gray-200 rounded text-black" onClick={onBack}>
        Quay lại
      </button>
    </div>
  );
};

export default SheetPicker; 