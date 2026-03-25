export interface Novel {
  id: string;
  name: string;
  author: string;
  url: string;
  totalChapters: number;
  lastUpdate: string;
  status: 'ongoing' | 'completed' | 'unknown';
  createdAt: string;
  updatedAt: string;
}

export interface NovelConfig {
  novels: Novel[];
}