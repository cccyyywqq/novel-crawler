import * as fs from 'fs-extra';
import * as path from 'path';
import { Novel, NovelConfig } from '../models/novel';
import { Chapter, ChapterList } from '../models/chapter';

export class StorageService {
  private configPath: string;
  private novelsDir: string;
  private chaptersDir: string;

  constructor(baseDir: string = process.cwd()) {
    this.configPath = path.join(baseDir, 'config', 'novels.json');
    this.novelsDir = path.join(baseDir, 'novels');
    this.chaptersDir = path.join(baseDir, 'chapters');
  }

  async init(): Promise<void> {
    await fs.ensureDir(path.dirname(this.configPath));
    await fs.ensureDir(this.novelsDir);
    await fs.ensureDir(this.chaptersDir);

    if (!(await fs.pathExists(this.configPath))) {
      await this.saveConfig({ novels: [] });
    }
  }

  async loadConfig(): Promise<NovelConfig> {
    const config = await fs.readJson(this.configPath);
    return config;
  }

  async saveConfig(config: NovelConfig): Promise<void> {
    await fs.writeJson(this.configPath, config, { spaces: 2 });
  }

  async addNovel(novel: Novel): Promise<void> {
    const config = await this.loadConfig();
    const exists = config.novels.find(n => n.id === novel.id);
    if (!exists) {
      config.novels.push(novel);
      await this.saveConfig(config);
    }
  }

  async removeNovel(novelId: string): Promise<void> {
    const config = await this.loadConfig();
    config.novels = config.novels.filter(n => n.id !== novelId);
    await this.saveConfig(config);
  }

  async updateNovel(novel: Novel): Promise<void> {
    const config = await this.loadConfig();
    const index = config.novels.findIndex(n => n.id === novel.id);
    if (index >= 0) {
      config.novels[index] = novel;
      await this.saveConfig(config);
    }
  }

  async loadChapterList(novelId: string): Promise<ChapterList | null> {
    const filePath = path.join(this.chaptersDir, `${novelId}.json`);
    if (await fs.pathExists(filePath)) {
      return await fs.readJson(filePath);
    }
    return null;
  }

  async saveChapterList(chapterList: ChapterList): Promise<void> {
    const filePath = path.join(this.chaptersDir, `${chapterList.novelId}.json`);
    await fs.writeJson(filePath, chapterList, { spaces: 2 });
  }

  async saveChapter(novelName: string, chapterTitle: string, content: string): Promise<void> {
    const novelDir = path.join(this.novelsDir, this.sanitizeFilename(novelName));
    await fs.ensureDir(novelDir);
    
    const fileName = this.sanitizeFilename(chapterTitle) + '.txt';
    const filePath = path.join(novelDir, fileName);
    
    await fs.writeFile(filePath, content, 'utf8');
  }

  async getNovelDir(novelName: string): Promise<string> {
    const novelDir = path.join(this.novelsDir, this.sanitizeFilename(novelName));
    await fs.ensureDir(novelDir);
    return novelDir;
  }

  private sanitizeFilename(name: string): string {
    return name.replace(/[<>:"/\\|?*]/g, '_');
  }
}