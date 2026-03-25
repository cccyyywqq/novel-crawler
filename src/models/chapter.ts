export interface Chapter {
  index: number;
  title: string;
  url: string;
  content?: string;
  crawled: boolean;
  crawledAt?: string;
}

export interface ChapterList {
  novelId: string;
  chapters: Chapter[];
  updatedAt: string;
}