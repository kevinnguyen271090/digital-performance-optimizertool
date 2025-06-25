// googleSheetsService.ts
// Service lấy dữ liệu từ Google Sheets API

/**
 * Lấy danh sách sheet trong file Google Sheet
 * @param fileId string
 * @param accessToken string
 */
export async function fetchSheets(fileId: string, accessToken: string): Promise<string[]> {
  // TODO: Gọi Google Sheets API để lấy danh sách sheet
  // Trả về mảng tên sheet
  return [];
}

/**
 * Lấy header (cột) của một sheet
 * @param fileId string
 * @param sheetName string
 * @param accessToken string
 */
export async function fetchSheetHeaders(fileId: string, sheetName: string, accessToken: string): Promise<string[]> {
  // TODO: Gọi Google Sheets API để lấy dòng header đầu tiên
  // Trả về mảng tên cột
  return [];
}

/**
 * Lấy một số dòng dữ liệu mẫu từ sheet
 * @param fileId string
 * @param sheetName string
 * @param accessToken string
 */
export async function fetchSheetSampleData(fileId: string, sheetName: string, accessToken: string, numRows: number = 5): Promise<any[]> {
  // TODO: Gọi Google Sheets API để lấy một số dòng đầu tiên (trừ header)
  // Trả về mảng object {col1: value1, col2: value2, ...}
  return [];
} 