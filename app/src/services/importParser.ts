import * as XLSX from 'xlsx';
import Papa from 'papaparse';

const MAX_ROWS = 5000; // FR-008: Maximum allowed rows per import
const FIVE_MB = 5;
const ONE_KB = 1024;
const MAX_FILE_SIZE = FIVE_MB * ONE_KB * ONE_KB; // 5MB

export interface ParseResult {
  data: Record<string, unknown>[];
  fileName: string;
  rowCount: number;
}

export interface ParseError {
  message: string;
  code: 'CORRUPTED_FILE' | 'TOO_MANY_ROWS' | 'EMPTY_FILE' | 'UNSUPPORTED_FORMAT' | 'FILE_TOO_LARGE';
}

/**
 * Parse a CSV or Excel file into an array of objects
 * @param file - The file to parse
 * @returns ParseResult with data array and metadata
 * @throws ParseError if file is corrupted, too large, or unsupported
 */
export async function parseFile(file: File): Promise<ParseResult> {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw { message: 'File is too large (max 5MB)', code: 'FILE_TOO_LARGE' } as ParseError;
  }

  const isCsv = file.name.toLowerCase().endsWith('.csv') || file.type === 'text/csv';

  if (isCsv) {
    return parseCsv(file);
  } else {
    return parseExcel(file);
  }
}

/**
 * Parse CSV file using PapaParse
 */
async function parseCsv(file: File): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: results => {
        const jsonData = results.data as Record<string, unknown>[];

        if (jsonData.length === 0) {
          reject({ message: 'File contains no data rows', code: 'EMPTY_FILE' } as ParseError);
          return;
        }

        if (jsonData.length > MAX_ROWS) {
          reject({
            message: `File exceeds maximum allowed rows (${MAX_ROWS}). Found ${jsonData.length} rows.`,
            code: 'TOO_MANY_ROWS',
          } as ParseError);
          return;
        }

        resolve({
          data: jsonData,
          fileName: file.name,
          rowCount: jsonData.length,
        });
      },
      error: error => {
        reject({
          message: `CSV parsing error: ${error.message}`,
          code: 'CORRUPTED_FILE',
        } as ParseError);
      },
    });
  });
}

/**
 * Parse Excel file using SheetJS
 */
async function parseExcel(file: File): Promise<ParseResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = e => {
      try {
        const data = e.target?.result;
        if (!data) {
          reject({ message: 'File is empty', code: 'EMPTY_FILE' } as ParseError);
          return;
        }

        // Parse the file using SheetJS
        const workbook = XLSX.read(data, { type: 'binary' });

        // Get the first sheet
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
          reject({ message: 'No sheets found in file', code: 'EMPTY_FILE' } as ParseError);
          return;
        }

        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) {
          reject({ message: 'Sheet not found', code: 'EMPTY_FILE' } as ParseError);
          return;
        }

        // Convert sheet to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          defval: '', // Default value for empty cells
          raw: false, // Convert dates to strings
        }) as Record<string, unknown>[];

        // Validate row count
        if (jsonData.length > MAX_ROWS) {
          reject({
            message: `File exceeds maximum allowed rows (${MAX_ROWS}). Found ${jsonData.length} rows.`,
            code: 'TOO_MANY_ROWS',
          } as ParseError);
          return;
        }

        if (jsonData.length === 0) {
          reject({ message: 'File contains no data rows', code: 'EMPTY_FILE' } as ParseError);
          return;
        }

        resolve({
          data: jsonData,
          fileName: file.name,
          rowCount: jsonData.length,
        });
      } catch (error) {
        console.error('Excel parsing error:', error);
        reject({
          message: 'Failed to parse Excel file. The file may be corrupted.',
          code: 'CORRUPTED_FILE',
        } as ParseError);
      }
    };

    reader.onerror = () => {
      reject({
        message: 'Failed to read file',
        code: 'CORRUPTED_FILE',
      } as ParseError);
    };

    reader.readAsBinaryString(file);
  });
}

/**
 * Export data to file
 * @param data - Array of objects to export
 * @param fileName - Name of the file (without extension)
 * @param format - 'csv' or 'xlsx'
 */
export function exportToFile(
  data: Record<string, unknown>[],
  fileName: string,
  format: 'csv' | 'xlsx' = 'xlsx'
): void {
  if (format === 'csv') {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  }
}
