import { BaseCrawler } from '../crawlers/base';
import { BiqugeCrawler } from '../crawlers/biquge';
import { Novel } from '../models/novel';
import { Chapter, ChapterList } from '../models/chapter';
import { StorageService } from './storage';
import { get, delay } from '../utils/request';

export class DownloaderService {
  private crawlers: Map<string, BaseCrawler>;
  private storage: StorageService;
  private requestDelay: number = 1000;

  constructor(storage: StorageService) {
    this.storage = storage;
    this.crawlers = new Map([
      ['biquge', new BiqugeCrawler()]
    ]);
  }

  getCrawler(source: string = 'biquge'): BaseCrawler {
    const crawler = this.crawlers.get(source);
    if (!crawler) {
      throw new Error(`Unknown crawler source: ${source}`);
    }
    return crawler;
  }

  async addNovel(url: string, source: string = 'biquge'): Promise<Novel> {
    const crawler = this.getCrawler(source);
    
    console.log(`正在获取小说信息: ${url}`);
    const html = await get(url);
    const novelInfo = crawler.parseNovelInfo(html, url);
    
    const novel: Novel = {
      id: novelInfo.id || crawler.generateId(url),
      name: novelInfo.name || '未知小说',
      author: novelInfo.author || '未知作者',
      url,
      totalChapters: novelInfo.totalChapters || 0,
      lastUpdate: novelInfo.lastUpdate || new Date().toISOString(),
      status: novelInfo.status || 'unknown',
      createdAt: novelInfo.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await this.storage.addNovel(novel);
    
    const chapters = crawler.parseChapterList(html);
    const chapterList: ChapterList = {
      novelId: novel.id,
      chapters,
      updatedAt: new Date().toISOString()
    };
    await this.storage.saveChapterList(chapterList);

    console.log(`小说添加成功: ${novel.name} (共${novel.totalChapters}章)`);
    return novel;
  }

  async downloadNovel(novelId: string, startFrom: number = 0): Promise<void> {
    const config = await this.storage.loadConfig();
    const novel = config.novels.find(n => n.id === novelId);
    
    if (!novel) {
      throw new Error(`Novel not found: ${novelId}`);
    }

    const chapterList = await this.storage.loadChapterList(novelId);
    if (!chapterList) {
      throw new Error(`Chapter list not found: ${novelId}`);
    }

    console.log(`\n开始下载: ${novel.name}`);
    console.log(`总章节: ${chapterList.chapters.length}`);

    const crawler = this.getCrawler('biquge');
    
    for (let i = startFrom; i < chapterList.chapters.length; i++) {
      const chapter = chapterList.chapters[i];
      
      if (chapter.crawled) {
        console.log(`[${i + 1}/${chapterList.chapters.length}] 跳过已下载: ${chapter.title}`);
        continue;
      }

      try {
        console.log(`[${i + 1}/${chapterList.chapters.length}] 正在下载: ${chapter.title}`);
        
        const html = await get(chapter.url);
        const content = crawler.parseChapterContent(html);
        
        await this.storage.saveChapter(novel.name, chapter.title, content);
        
        chapter.crawled = true;
        chapter.content = content;
        chapter.crawledAt = new Date().toISOString();
        
        if ((i + 1) % 10 === 0) {
          await this.storage.saveChapterList(chapterList);
        }
        
        await delay(this.requestDelay);
        
      } catch (error) {
        console.error(`下载失败: ${chapter.title}`, error);
        await delay(3000);
      }
    }

    chapterList.updatedAt = new Date().toISOString();
    await this.storage.saveChapterList(chapterList);
    
    novel.updatedAt = new Date().toISOString();
    await this.storage.updateNovel(novel);
    
    console.log(`\n下载完成: ${novel.name}`);
  }

  async checkUpdates(novelId: string): Promise<Chapter[]> {
    const config = await this.storage.loadConfig();
    const novel = config.novels.find(n => n.id === novelId);
    
    if (!novel) {
      throw new Error(`Novel not found: ${novelId}`);
    }

    console.log(`检查更新: ${novel.name}`);
    
    const html = await get(novel.url);
    const crawler = this.getCrawler('biquge');
    const newChapters = crawler.parseChapterList(html);
    
    const oldChapterList = await this.storage.loadChapterList(novelId);
    if (!oldChapterList) {
      return newChapters;
    }

    const oldCount = oldChapterList.chapters.length;
    const newCount = newChapters.length;
    
    if (newCount > oldCount) {
      console.log(`发现新章节: ${newCount - oldCount} 章`);
      
      const addedChapters = newChapters.slice(oldCount);
      oldChapterList.chapters.push(...addedChapters);
      oldChapterList.updatedAt = new Date().toISOString();
      
      await this.storage.saveChapterList(oldChapterList);
      
      novel.totalChapters = newCount;
      novel.lastUpdate = new Date().toISOString();
      novel.updatedAt = new Date().toISOString();
      await this.storage.updateNovel(novel);
      
      return addedChapters;
    }
    
    console.log(`无新章节`);
    return [];
  }
}