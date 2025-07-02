import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Search, TrendingUp, FileText, Settings, BarChart2, ArrowRight } from "lucide-react";
import SearchBar from "./SearchBar";

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: "dashboard" | "recommendation" | "report" | "setting";
  path: string;
  icon: React.ReactNode;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = React.memo(({ isOpen, onClose }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Mock search data - wrap in useMemo to prevent recreation on every render
  const searchData = useMemo((): SearchResult[] => [
    // Dashboard items
    {
      id: "dashboard-kpi",
      title: "KPI Dashboard",
      description: "Xem tổng quan các chỉ số hiệu suất",
      type: "dashboard" as const,
      path: "/",
      icon: <BarChart2 className="w-4 h-4" />
    },
    {
      id: "dashboard-sessions",
      title: "Sessions",
      description: "Số phiên truy cập website",
      type: "dashboard" as const,
      path: "/",
      icon: <BarChart2 className="w-4 h-4" />
    },
    // Recommendations
    {
      id: "rec-targeting",
      title: "Tối ưu hóa Targeting",
      description: "Cải thiện targeting để giảm CPA",
      type: "recommendation" as const,
      path: "/recommendations",
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      id: "rec-landing",
      title: "Cải thiện Landing Page",
      description: "Tăng CTR từ quảng cáo",
      type: "recommendation" as const,
      path: "/recommendations",
      icon: <TrendingUp className="w-4 h-4" />
    },
    // Reports
    {
      id: "report-weekly",
      title: "Báo cáo tuần",
      description: "Báo cáo hiệu suất tuần trước",
      type: "report" as const,
      path: "/reports",
      icon: <FileText className="w-4 h-4" />
    },
    // Settings
    {
      id: "settings-connections",
      title: "Kết nối dữ liệu",
      description: "Quản lý kết nối GA4 và Meta Ads",
      type: "setting" as const,
      path: "/settings",
      icon: <Settings className="w-4 h-4" />
    }
  ], []);

  // Memoize search results
  const filteredResults = useMemo(() => {
    if (!query.trim()) return [];
    return searchData.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, searchData]);

  // Update results when filtered results change
  useEffect(() => {
    setResults(filteredResults);
    setSelectedIndex(0);
  }, [filteredResults]);

  // Memoize onClose to prevent unnecessary re-renders
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < results.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : results.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (results[selectedIndex]) {
            window.location.href = results[selectedIndex].path;
            handleClose();
          }
          break;
        case "Escape":
          e.preventDefault();
          handleClose();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, results, selectedIndex, handleClose]);

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "dashboard": return "Dashboard";
      case "recommendation": return "Recommendation";
      case "report": return "Report";
      case "setting": return "Setting";
      default: return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "dashboard": return "bg-blue-100 text-blue-800";
      case "recommendation": return "bg-green-100 text-green-800";
      case "report": return "bg-purple-100 text-purple-800";
      case "setting": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-start justify-center min-h-screen pt-16 px-4">
        <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
        <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-96 overflow-hidden">
          {/* Search Input */}
          <div className="p-4 border-b dark:border-gray-700">
            <SearchBar
              placeholder="Tìm kiếm dashboard, recommendations, reports..."
              onSearch={setQuery}
              showShortcut={false}
            />
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto">
            {query && results.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Không tìm thấy kết quả cho "{query}"</p>
              </div>
            )}

            {query && results.length > 0 && (
              <div className="py-2">
                {results.map((result, index) => (
                  <a
                    key={result.id}
                    href={result.path}
                    onClick={handleClose}
                    className={`flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition ${
                      index === selectedIndex ? "bg-gray-50 dark:bg-gray-700" : ""
                    }`}
                  >
                    <div className="flex-shrink-0 text-gray-400">
                      {result.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {result.title}
                        </p>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(result.type)}`}>
                          {getTypeLabel(result.type)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {result.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-gray-400">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </a>
                ))}
              </div>
            )}

            {!query && (
              <div className="p-8 text-center text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Bắt đầu gõ để tìm kiếm</p>
                <div className="mt-4 flex items-center justify-center space-x-4 text-xs text-gray-400">
                  <span>↑↓ để di chuyển</span>
                  <span>Enter để chọn</span>
                  <span>Esc để đóng</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default SearchModal; 