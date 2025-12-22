import { describe, it, expect, vi } from 'vitest';
import { parseFile } from './importParser';
import * as XLSX from 'xlsx';

const RANDOM_NUMBER = 5001;

// Mock XLSX
vi.mock('xlsx', () => {
  return {
    read: vi.fn(),
    utils: {
      sheet_to_json: vi.fn(),
      book_new: vi.fn(),
      json_to_sheet: vi.fn(),
      book_append_sheet: vi.fn(),
      writeFile: vi.fn(),
    },
  };
});

describe('importParser', () => {
  // Mock FileReader
  const mockFileReader = {
    readAsBinaryString: vi.fn(),
    onload: vi.fn(),
    onerror: vi.fn(),
    result: 'mock-content',
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Reset FileReader mock
    global.FileReader = vi.fn(() => mockFileReader) as any;

    // Default successful read setup
    mockFileReader.readAsBinaryString.mockImplementation(function (this: any) {
      // Trigger onload immediately
      this.onload({ target: { result: 'mock-content' } });
    });
  });

  it('should parse valid file within limit', async () => {
    // Setup XLSX mock to return valid data
    const mockWorkbook = {
      SheetNames: ['Sheet1'],
      Sheets: { Sheet1: {} },
    };
    (XLSX.read as any).mockReturnValue(mockWorkbook);

    const mockData = Array(10).fill({ name: 'Test' });
    (XLSX.utils.sheet_to_json as any).mockReturnValue(mockData);

    const file = new File([''], 'test.csv');
    const result = await parseFile(file);

    expect(result.data).toHaveLength(10);
    expect(result.rowCount).toBe(10);
  });

  it('should reject file exceeding 5000 rows (T027)', async () => {
    // Setup XLSX mock to return > 5000 rows
    const mockWorkbook = {
      SheetNames: ['Sheet1'],
      Sheets: { Sheet1: {} },
    };
    (XLSX.read as any).mockReturnValue(mockWorkbook);

    // 5001 rows
    const mockData = Array(RANDOM_NUMBER).fill({ name: 'Test' });
    (XLSX.utils.sheet_to_json as any).mockReturnValue(mockData);

    const file = new File([''], 'large.csv');

    await expect(parseFile(file)).rejects.toMatchObject({
      code: 'TOO_MANY_ROWS',
    });
  });

  it('should reject empty file', async () => {
    // Setup FileReader to return null result or empty
    mockFileReader.readAsBinaryString.mockImplementation(function (this: any) {
      this.onload({ target: { result: null } });
    });

    const file = new File([''], 'empty.csv');

    await expect(parseFile(file)).rejects.toMatchObject({
      code: 'EMPTY_FILE',
    });
  });

  it('should handle corrupted file / parsing error (T026)', async () => {
    // Setup XLSX read to throw error
    (XLSX.read as any).mockImplementation(() => {
      throw new Error('Parsing failed');
    });

    const file = new File([''], 'corrupt.xlsx');

    await expect(parseFile(file)).rejects.toMatchObject({
      code: 'CORRUPTED_FILE',
    });
  });

  it('should handle FileReader error', async () => {
    mockFileReader.readAsBinaryString.mockImplementation(function (this: any) {
      this.onerror();
    });

    const file = new File([''], 'error.csv');

    await expect(parseFile(file)).rejects.toMatchObject({
      code: 'CORRUPTED_FILE',
    });
  });
});
