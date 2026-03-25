import * as cron from 'node-cron';
import { DownloaderService } from './downloader';
import { StorageService } from './storage';

export class SchedulerService {
  private downloader: DownloaderService;
  private storage: StorageService;
  private tasks: Map<string, cron.ScheduledTask>;

  constructor(storage: StorageService, downloader: DownloaderService) {
    this.storage = storage;
    this.downloader = downloader;
    this.tasks = new Map();
  }

  startUpdateCheck(cronExpression: string = '0 */2 * * *'): void {
    const task = cron.schedule(cronExpression, async () => {
      console.log('\n=== 开始定时检查更新 ===');
      console.log(`时间: ${new Date().toLocaleString()}`);
      
      try {
        const config = await this.storage.loadConfig();
        
        for (const novel of config.novels) {
          try {
            const newChapters = await this.downloader.checkUpdates(novel.id);
            
            if (newChapters.length > 0) {
              console.log(`下载新章节: ${novel.name}`);
              await this.downloader.downloadNovel(novel.id, novel.totalChapters - newChapters.length);
            }
          } catch (error) {
            console.error(`检查失败: ${novel.name}`, error);
          }
        }
      } catch (error) {
        console.error('定时任务执行失败:', error);
      }
      
      console.log('=== 定时检查完成 ===\n');
    }, {
      scheduled: true,
      timezone: 'Asia/Shanghai'
    });

    this.tasks.set('updateCheck', task);
    console.log(`定时更新服务已启动 (${cronExpression})`);
  }

  stopAll(): void {
    for (const [name, task] of this.tasks) {
      task.stop();
      console.log(`定时任务已停止: ${name}`);
    }
    this.tasks.clear();
  }

  stop(name: string): boolean {
    const task = this.tasks.get(name);
    if (task) {
      task.stop();
      this.tasks.delete(name);
      console.log(`定时任务已停止: ${name}`);
      return true;
    }
    return false;
  }
}