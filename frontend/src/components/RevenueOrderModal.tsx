import React, { useState } from "react";

interface RevenueOrderModalProps {
  onFinish: () => void;
}

const RevenueOrderModal: React.FC<RevenueOrderModalProps> = ({ onFinish }) => {
  const [revenue, setRevenue] = useState("");
  const [orders, setOrders] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setError("");
    if (!revenue || !orders) {
      setError("Vui lòng nhập đầy đủ doanh thu và số đơn hàng.");
      return;
    }
    if (isNaN(Number(revenue)) || isNaN(Number(orders)) || Number(revenue) <= 0 || Number(orders) <= 0) {
      setError("Giá trị phải là số dương.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      localStorage.setItem("revenue", revenue);
      localStorage.setItem("orders", orders);
      setLoading(false);
      onFinish();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-white/90 flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-2 text-primary">Nhập Doanh thu & Đơn hàng</h2>
        <p className="mb-4 text-gray-500 text-center">Vui lòng nhập doanh thu và số đơn hàng gần nhất để dashboard hoạt động chính xác.</p>
        <input
          className="w-full border rounded-lg px-4 py-2 mb-2 focus:outline-accent"
          placeholder="Doanh thu (VNĐ)"
          value={revenue}
          onChange={e => setRevenue(e.target.value)}
          disabled={loading}
          type="number"
          min={0}
        />
        <input
          className="w-full border rounded-lg px-4 py-2 mb-2 focus:outline-accent"
          placeholder="Số đơn hàng"
          value={orders}
          onChange={e => setOrders(e.target.value)}
          disabled={loading}
          type="number"
          min={0}
        />
        {error && <div className="text-danger text-sm mb-2">{error}</div>}
        <button
          className="w-full bg-accent text-white rounded-lg py-2 font-semibold mt-2 hover:bg-accent/90 transition"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Đang lưu..." : "Lưu & Tiếp tục"}
        </button>
      </div>
    </div>
  );
};

export default RevenueOrderModal; 