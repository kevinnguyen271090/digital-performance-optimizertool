import React, { useState } from 'react';
import FilePicker from './FilePicker';
import SheetPicker from './SheetPicker';
import Preview from './Preview';
import Mapping from './Mapping';

// Các bước của flow Google Sheets
export enum GoogleSheetsStep {
  FilePicker = 'FilePicker',
  SheetPicker = 'SheetPicker',
  Preview = 'Preview',
  Mapping = 'Mapping',
  Confirm = 'Confirm',
}

interface GoogleSheetsConnectorProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (data: any) => void;
}

const GoogleSheetsConnector: React.FC<GoogleSheetsConnectorProps> = ({ open, onClose, onSuccess }) => {
  const [step, setStep] = useState<GoogleSheetsStep>(GoogleSheetsStep.FilePicker);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [selectedSheet, setSelectedSheet] = useState<any>(null);
  const [mapping, setMapping] = useState<any>({});

  // Render từng bước
  const renderStep = () => {
    switch (step) {
      case GoogleSheetsStep.FilePicker:
        return (
          <FilePicker
            onFileSelect={(file) => setSelectedFile(file)}
            onNext={() => setStep(GoogleSheetsStep.SheetPicker)}
          />
        );
      case GoogleSheetsStep.SheetPicker:
        return (
          <SheetPicker
            selectedFile={selectedFile}
            onSheetSelect={(sheet) => setSelectedSheet(sheet)}
            onNext={() => setStep(GoogleSheetsStep.Preview)}
            onBack={() => setStep(GoogleSheetsStep.FilePicker)}
          />
        );
      case GoogleSheetsStep.Preview:
        return (
          <Preview
            onNext={() => setStep(GoogleSheetsStep.Mapping)}
            onBack={() => setStep(GoogleSheetsStep.SheetPicker)}
          />
        );
      case GoogleSheetsStep.Mapping:
        return (
          <Mapping
            mapping={mapping}
            onMappingChange={setMapping}
            onNext={() => setStep(GoogleSheetsStep.Confirm)}
            onBack={() => setStep(GoogleSheetsStep.Preview)}
          />
        );
      case GoogleSheetsStep.Confirm:
        return (
          <div>
            <h3 className="text-lg font-semibold mb-2 text-black">Xác nhận import dữ liệu</h3>
            <div className="mb-4 text-black">Bạn đã hoàn tất các bước. Nhấn Xác nhận để hoàn thành.</div>
            <button
              className="px-4 py-2 bg-green-600 text-white rounded mr-2"
              onClick={() => onSuccess({ file: selectedFile, sheet: selectedSheet, mapping })}
            >
              Xác nhận
            </button>
            <button className="px-4 py-2 bg-gray-200 rounded text-black" onClick={() => setStep(GoogleSheetsStep.Mapping)}>
              Quay lại
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
        <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4 text-black">Kết nối Google Sheets</h2>
        {renderStep()}
      </div>
    </div>
  );
};

export default GoogleSheetsConnector; 