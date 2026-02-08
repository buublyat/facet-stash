import { DataEntry, Tag, Sheet } from '@/types/data';

const SHEETS_KEY = 'data-manager-sheets';
const ACTIVE_SHEET_KEY = 'data-manager-active-sheet';

export const defaultTags: Tag[] = [
  { id: '1', name: 'Important', color: 'red' },
  { id: '2', name: 'Work', color: 'blue' },
  { id: '3', name: 'Personal', color: 'purple' },
  { id: '4', name: 'Urgent', color: 'orange' },
  { id: '5', name: 'Review', color: 'amber' },
  { id: '6', name: 'Done', color: 'green' },
];

export const defaultEntries: DataEntry[] = [
  {
    id: '1',
    country: 'US',
    machineId: 'SRV-2024-001',
    description: 'Complete the API documentation for the new features',
    category: 'Documentation',
    priority: 'high',
    status: 'active',
    tags: ['1', '2'],
    email: 'yes',
    auth: 'auto',
    url: 'https://api.example.com',
    notes: 'Primary server for API docs',
    password: 'admin123',
    owner: 'John Doe',
    orders: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    country: 'DE',
    machineId: 'SRV-2024-002',
    description: 'Review the new dashboard designs with the team',
    category: 'Meetings',
    priority: 'medium',
    status: 'pending',
    tags: ['2', '5'],
    email: 'no',
    auth: 'pass',
    url: 'https://dashboard.example.de',
    notes: 'Design review server',
    owner: 'Anna Schmidt',
    orders: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    country: 'JP',
    machineId: 'SRV-2024-003',
    description: 'Fix the authentication bug reported by users',
    category: 'Development',
    priority: 'high',
    status: 'active',
    tags: ['1', '4'],
    email: 'yes',
    auth: 'auto',
    notes: 'Auth service instance',
    owner: 'Yuki Tanaka',
    orders: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    country: 'GB',
    machineId: 'SRV-2024-004',
    description: 'Prepare the weekly progress report',
    category: 'Reports',
    priority: 'low',
    status: 'completed',
    tags: ['2', '6'],
    email: 'no',
    auth: 'pass',
    url: 'https://reports.example.co.uk',
    owner: 'James Wilson',
    orders: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const defaultSheet: Sheet = {
  id: 'default',
  name: 'Main',
  entries: defaultEntries,
  tags: defaultTags,
  createdAt: new Date().toISOString(),
};

// Sheet management
export function loadSheets(): Sheet[] {
  try {
    const stored = localStorage.getItem(SHEETS_KEY);
    if (stored) {
      const sheets: Sheet[] = JSON.parse(stored);
      // Migrate sheets that don't have tags property
      return sheets.map(sheet => ({
        ...sheet,
        tags: sheet.tags || defaultTags,
      }));
    }
    // Migrate from old entries + tags format if exists
    const oldEntries = localStorage.getItem('data-manager-entries');
    const oldTags = localStorage.getItem('data-manager-tags');
    if (oldEntries) {
      const migratedSheet: Sheet = {
        id: 'default',
        name: 'Main',
        entries: JSON.parse(oldEntries),
        tags: oldTags ? JSON.parse(oldTags) : defaultTags,
        createdAt: new Date().toISOString(),
      };
      saveSheets([migratedSheet]);
      localStorage.removeItem('data-manager-entries');
      localStorage.removeItem('data-manager-tags');
      return [migratedSheet];
    }
    saveSheets([defaultSheet]);
    return [defaultSheet];
  } catch {
    return [defaultSheet];
  }
}

export function saveSheets(sheets: Sheet[]): void {
  localStorage.setItem(SHEETS_KEY, JSON.stringify(sheets));
}

export function loadActiveSheetId(): string {
  try {
    return localStorage.getItem(ACTIVE_SHEET_KEY) || 'default';
  } catch {
    return 'default';
  }
}

export function saveActiveSheetId(sheetId: string): void {
  localStorage.setItem(ACTIVE_SHEET_KEY, sheetId);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function exportToJSON(entries: DataEntry[], tags: Tag[]): string {
  return JSON.stringify({ entries, tags }, null, 2);
}

export function exportToCSV(entries: DataEntry[], tags: Tag[]): string {
  const tagMap = new Map(tags.map(t => [t.id, t.name]));
  
  const headers = ['ID', 'Country', 'Machine ID', 'Description', 'Category', 'Priority', 'Status', 'Tags', 'Email', 'Auth', 'URL', 'Owner', 'Notes', 'Orders', 'Created At', 'Updated At'];
  const rows = entries.map(entry => [
    entry.id,
    entry.country,
    `"${entry.machineId.replace(/"/g, '""')}"`,
    `"${entry.description.replace(/"/g, '""')}"`,
    entry.category,
    entry.priority,
    entry.status,
    `"${entry.tags.map(id => tagMap.get(id) || id).join(', ')}"`,
    entry.email,
    entry.auth,
    entry.url || '',
    entry.owner || '',
    `"${(entry.notes || '').replace(/"/g, '""')}"`,
    `"${(entry.orders || '').replace(/"/g, '""')}"`,
    entry.createdAt,
    entry.updatedAt,
  ]);
  
  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}

export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
