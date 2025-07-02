export interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: string;
  effort: string;
  category: string;
  priority: "high" | "medium" | "low";
  isTried?: boolean;
}

export const mockRecommendations: Recommendation[] = [
  {
    id: "rec-1",
    title: "Tối ưu hóa Targeting",
    description: "CPA của bạn đang cao hơn 30% so với mục tiêu. Có thể do targeting quá rộng hoặc không đúng đối tượng. Hãy phân tích lại đối tượng khách hàng tiềm năng và tạo custom audience dựa trên hành vi mua hàng.",
    impact: "Cao",
    effort: "Trung bình",
    category: "Quảng cáo",
    priority: "high",
    isTried: false
  },
  {
    id: "rec-2", 
    title: "Cải thiện Landing Page",
    description: "CTR từ quảng cáo đến website đang thấp (2.1%), có thể do landing page không hấp dẫn hoặc không phù hợp với quảng cáo. Cần tối ưu hóa headline, copy và thêm social proof.",
    impact: "Trung bình",
    effort: "Thấp",
    category: "Website",
    priority: "medium",
    isTried: true
  },
  {
    id: "rec-3",
    title: "Tăng Budget cho Campaign hiệu quả",
    description: "Campaign 'Summer Sale' có ROAS cao nhất (6.2x) nhưng budget chỉ chiếm 15% tổng ngân sách. Nên tăng budget và mở rộng targeting cho campaign này.",
    impact: "Cao",
    effort: "Thấp",
    category: "Quảng cáo",
    priority: "medium",
    isTried: false
  },
  {
    id: "rec-4",
    title: "Tối ưu hóa Ad Copy",
    description: "Ad copy hiện tại chưa tạo được sự khác biệt. Cần A/B test các phiên bản khác nhau để tìm ra message hiệu quả nhất.",
    impact: "Trung bình",
    effort: "Thấp",
    category: "Quảng cáo",
    priority: "low",
    isTried: false
  },
  {
    id: "rec-5",
    title: "Cải thiện Mobile Experience",
    description: "Tỷ lệ bounce rate trên mobile cao hơn desktop 40%. Cần tối ưu hóa trải nghiệm mobile để giảm bounce rate.",
    impact: "Cao",
    effort: "Cao",
    category: "Website",
    priority: "high",
    isTried: false
  }
]; 