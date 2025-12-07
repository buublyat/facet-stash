export type TagColor = 
  | 'red' 
  | 'orange' 
  | 'amber' 
  | 'lime' 
  | 'green' 
  | 'teal' 
  | 'cyan' 
  | 'blue' 
  | 'indigo' 
  | 'purple' 
  | 'pink' 
  | 'rose';

export interface Tag {
  id: string;
  name: string;
  color: TagColor;
}

export interface DataEntry {
  id: string;
  country: string;
  machineId: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'pending' | 'completed' | 'archived';
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: keyof DataEntry;
  direction: SortDirection;
}
