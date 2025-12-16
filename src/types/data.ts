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

export interface Store {
  id: string;
  name: string;
  description: string;
}

export interface DataEntry {
  id: string;
  country: string;
  machineId: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'pending' | 'completed' | 'archived' | 'error';
  tags: string[];
  email: 'yes' | 'no';
  auth: 'auto' | 'pass';
  url?: string;
  notes?: string;
  password?: string;
  owner?: string;
  orders?: string;
  stores?: Store[];
  createdAt: string;
  updatedAt: string;
}

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: keyof DataEntry;
  direction: SortDirection;
}
