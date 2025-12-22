/**
 *
 */
export function toCsv(
  data: Record<string, unknown>[],
  columns: { key: string; label: string }[],
  filename: string
) {
  const getNestedValue = (obj: Record<string, unknown>, path: string) => {
    return path
      .split('.')
      .reduce((acc: unknown, part: string) => (acc as Record<string, unknown>)?.[part], obj);
  };

  const header = columns.map(c => c.label).join(',');
  const rows = data.map(row => {
    return columns
      .map(c => {
        const value = getNestedValue(row, c.key);
        const stringValue = value === null || value === undefined ? '' : String(value);
        return `"${stringValue.replace(/"/g, '""')}"`;
      })
      .join(',');
  });

  const csv = [header, ...rows].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
