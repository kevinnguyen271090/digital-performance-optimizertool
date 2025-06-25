import React, { useEffect, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

interface FilePickerProps {
  onFileSelect: (file: any) => void;
  onNext: () => void;
  onBack?: () => void;
}

const FilePicker: React.FC<FilePickerProps> = ({ onFileSelect, onNext, onBack }) => {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/drive.readonly',
    onSuccess: async (tokenResponse) => {
      setToken(tokenResponse.access_token);
    },
    onError: () => alert('Lỗi xác thực Google!'),
  });

  useEffect(() => {
    const fetchFiles = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const res = await axios.get(
          'https://www.googleapis.com/drive/v3/files',
          {
            params: {
              q: "mimeType='application/vnd.google-apps.spreadsheet'",
              fields: 'files(id, name)',
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFiles(res.data.files);
      } catch (err) {
        alert('Lỗi khi lấy danh sách file Google Sheets');
      }
      setLoading(false);
    };
    fetchFiles();
  }, [token]);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2 text-black">Chọn file Google Sheets</h3>
      <input
        type="text"
        className="mb-4 px-3 py-2 border rounded w-full text-black"
        placeholder="Tìm kiếm tên file..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {files.length === 0 && !loading && (
        <button
          className="px-3 py-2 bg-blue-600 text-white rounded"
          onClick={() => login()}
        >
          Đăng nhập Google & lấy file
        </button>
      )}
      {loading && <div>Đang tải file...</div>}
      <div className="max-h-96 overflow-y-auto">
        <ul className="mb-4">
          {files
            .filter(file => file.name.toLowerCase().includes(search.toLowerCase()))
            .map((file) => (
              <li key={file.id} className="mb-2">
                <button
                  className="px-3 py-2 border rounded hover:bg-blue-50 w-full text-left text-black"
                  onClick={() => {
                    onFileSelect(file);
                    onNext();
                  }}
                >
                  {file.name}
                </button>
              </li>
            ))}
        </ul>
      </div>
      {onBack && (
        <button className="px-3 py-2 bg-gray-200 rounded mr-2" onClick={onBack}>
          Quay lại
        </button>
      )}
    </div>
  );
};

export default FilePicker; 