import { Chapter } from '../models/chapter';
import { Novel } from '../models/novel';

export abstract class BaseCrawler {
  abstract getSourceName(): string;
  abstract parseNovelInfo(html: string, url: string): Partial<Novel>;
  abstract parseChapterList(html: string): Chapter[];
  abstract parseChapterContent(html: string): string;
  
  generateId(url: string): string {
    return Buffer.from(url).toString('base64').substring(0, 16);
  }
}