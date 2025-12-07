import { DataEntry, Tag } from '@/types/data';

const ENTRIES_KEY = 'data-manager-entries';
const TAGS_KEY = 'data-manager-tags';

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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function loadEntries(): DataEntry[] {
  try {
    const stored = localStorage.getItem(ENTRIES_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    saveEntries(defaultEntries);
    return defaultEntries;
  } catch {
    return defaultEntries;
  }
}

export function saveEntries(entries: DataEntry[]): void {
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
}

export function loadTags(): Tag[] {
  try {
    const stored = localStorage.getItem(TAGS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    saveTags(defaultTags);
    return defaultTags;
  } catch {
    return defaultTags;
  }
}

export function saveTags(tags: Tag[]): void {
  localStorage.setItem(TAGS_KEY, JSON.stringify(tags));
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function exportToJSON(entries: DataEntry[], tags: Tag[]): string {
  return JSON.stringify({ entries, tags }, null, 2);
}

export function exportToCSV(entries: DataEntry[], tags: Tag[]): string {
  const tagMap = new Map(tags.map(t => [t.id, t.name]));
  
  const headers = ['ID', 'Country', 'Machine ID', 'Description', 'Category', 'Priority', 'Status', 'Tags', 'Created At', 'Updated At'];
  const rows = entries.map(entry => [
    entry.id,
    entry.country,
    `"${entry.machineId.replace(/"/g, '""')}"`,
    `"${entry.description.replace(/"/g, '""')}"`,
    entry.category,
    entry.priority,
    entry.status,
    `"${entry.tags.map(id => tagMap.get(id) || id).join(', ')}"`,
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
