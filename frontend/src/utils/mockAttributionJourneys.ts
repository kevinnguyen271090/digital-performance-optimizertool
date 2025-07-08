export interface AttributionJourney {
  id: string;
  steps: string[]; // các kênh đi qua theo thứ tự
  conversionChannel: string; // kênh chuyển đổi cuối cùng
}

export const mockAttributionJourneys: AttributionJourney[] = [
  // Hành trình đơn giản
  { id: '1', steps: ['Google', 'Facebook', 'Email'], conversionChannel: 'Email' },
  { id: '2', steps: ['Facebook', 'Google', 'Direct', 'Email'], conversionChannel: 'Email' },
  { id: '3', steps: ['Direct', 'Google', 'Facebook', 'Email'], conversionChannel: 'Email' },
  { id: '4', steps: ['Google', 'Email'], conversionChannel: 'Email' },
  { id: '5', steps: ['Facebook', 'Email'], conversionChannel: 'Email' },
  { id: '6', steps: ['Google'], conversionChannel: 'Google' },
  { id: '7', steps: ['Email'], conversionChannel: 'Email' },
  // Hành trình phức tạp, nhiều nhánh
  { id: '8', steps: ['Google', 'Facebook', 'Google', 'Email'], conversionChannel: 'Email' },
  { id: '9', steps: ['Direct', 'Google', 'Facebook', 'Google', 'Email'], conversionChannel: 'Email' },
  { id: '10', steps: ['Facebook', 'Google', 'Direct', 'Facebook', 'Email'], conversionChannel: 'Email' },
  { id: '11', steps: ['Google', 'Direct', 'Facebook', 'Email'], conversionChannel: 'Email' },
  { id: '12', steps: ['Direct', 'Google', 'Direct', 'Email'], conversionChannel: 'Email' },
  { id: '13', steps: ['Google', 'Facebook', 'Direct', 'Google', 'Email'], conversionChannel: 'Email' },
  { id: '14', steps: ['Email', 'Google', 'Facebook', 'Direct', 'Email'], conversionChannel: 'Email' },
  // Hành trình có lặp lại kênh
  { id: '15', steps: ['Google', 'Google', 'Facebook', 'Email'], conversionChannel: 'Email' },
  { id: '16', steps: ['Facebook', 'Facebook', 'Google', 'Email'], conversionChannel: 'Email' },
  { id: '17', steps: ['Direct', 'Direct', 'Email'], conversionChannel: 'Email' },
  // Hành trình dài, nhiều bước
  { id: '18', steps: ['Google', 'Facebook', 'Direct', 'Google', 'Facebook', 'Email'], conversionChannel: 'Email' },
  { id: '19', steps: ['Direct', 'Google', 'Facebook', 'Direct', 'Google', 'Email'], conversionChannel: 'Email' },
  { id: '20', steps: ['Facebook', 'Google', 'Direct', 'Facebook', 'Google', 'Email'], conversionChannel: 'Email' },
  // Hành trình có kênh mới
  { id: '21', steps: ['Google', 'Zalo', 'Email'], conversionChannel: 'Email' },
  { id: '22', steps: ['Zalo', 'Google', 'Facebook', 'Email'], conversionChannel: 'Email' },
  { id: '23', steps: ['Direct', 'Zalo', 'Google', 'Email'], conversionChannel: 'Email' },
  { id: '24', steps: ['Zalo', 'Direct', 'Email'], conversionChannel: 'Email' },
  // Hành trình ngắn
  { id: '25', steps: ['Google', 'Email'], conversionChannel: 'Email' },
  { id: '26', steps: ['Facebook', 'Email'], conversionChannel: 'Email' },
  { id: '27', steps: ['Zalo', 'Email'], conversionChannel: 'Email' },
  { id: '28', steps: ['Direct', 'Email'], conversionChannel: 'Email' },
  // Hành trình chỉ 1 bước
  { id: '29', steps: ['Google'], conversionChannel: 'Google' },
  { id: '30', steps: ['Email'], conversionChannel: 'Email' },
]; 