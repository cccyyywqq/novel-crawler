#!/usr/bin/env node

import * as path from 'path';
import { StorageService } from './services/storage';
import { DownloaderService } from './services/downloader';
import { SchedulerService } from './services/scheduler';

const baseDir = path.join(__dirname, '..');

async function main() {
  const command = process.argv[2];
  const args = process.argv.slice(3);

  const storage = new StorageService(baseDir);
  await storage.init();

  const downloader = new DownloaderService(storage);
  const scheduler = new SchedulerService(storage, downloader);

  switch (command) {
    case 'add':
      if (args.length === 0) {
        console.log('用法: npm run add <小说目录页URL>');
        console.log('\n示例:');
        console.log('  npm run add https://www.biquge.com/book/12345/');
        process.exit(1);
      }
      await downloader.addNovel(args[0]);
      break;

    case 'crawl':
      const config = await storage.loadConfig();
      if (config.novels.length === 0) {
        console.log('没有追踪的小说，请先添加小说');
        console.log('用法: npm run add <小说目录页URL>');
        process.exit(1);
      }

      const novelId = args[0];
      if (novelId) {
        await downloader.downloadNovel(novelId);
      } else {
        for (const novel of config.novels) {
          try {
            await downloader.downloadNovel(novel.id);
          } catch (error) {
            console.error(`下载失败: ${novel.name}`, error);
          }
        }
      }
      break;

    case 'update':
      const updateConfig = await storage.loadConfig();
      for (const novel of updateConfig.novels) {
        try {
          const newChapters = await downloader.checkUpdates(novel.id);
          if (newChapters.length > 0) {
            await downloader.downloadNovel(novel.id, novel.totalChapters - newChapters.length);
          }
        } catch (error) {
          console.error(`更新失败: ${novel.name}`, error);
        }
      }
      break;

    case 'list':
      const listConfig = await storage.loadConfig();
      if (listConfig.novels.length === 0) {
        console.log('没有追踪的小说');
        break;
      }

      console.log('\n追踪的小说列表:');
      console.log('='.repeat(80));
      for (const novel of listConfig.novels) {
        console.log(`ID: ${novel.id}`);
        console.log(`名称: ${novel.name}`);
        console.log(`作者: ${novel.author}`);
        console.log(`章节: ${novel.totalChapters}`);
        console.log(`状态: ${novel.status === 'completed' ? '已完结' : novel.status === 'ongoing' ? '连载中' : '未知'}`);
        console.log(`最后更新: ${novel.lastUpdate}`);
        console.log('-'.repeat(80));
      }
      break;

    case 'remove':
      if (args.length === 0) {
        console.log('用法: npm run remove <小说ID>');
        const removeConfig = await storage.loadConfig();
        console.log('\n可用ID:');
        for (const novel of removeConfig.novels) {
          console.log(`  ${novel.id} - ${novel.name}`);
        }
        process.exit(1);
      }
      await storage.removeNovel(args[0]);
      console.log(`已移除小说: ${args[0]}`);
      break;

    case 'start':
      console.log('启动定时更新服务...');
      scheduler.startUpdateCheck('0 */2 * * *');
      
      console.log('\n按 Ctrl+C 停止服务');
      
      process.on('SIGINT', () => {
        console.log('\n正在停止服务...');
        scheduler.stopAll();
        process.exit(0);
      });
      
      break;

    case 'help':
    default:
      console.log(`
小说爬虫程序

用法:
  npm run add <URL>      添加小说
  npm run crawl [ID]     下载小说 (可选指定ID)
  npm run update         检查并下载更新
  npm run list           列出所有追踪的小说
  npm run remove <ID>    移除小说
  npm run start          启动定时更新服务

示例:
  npm run add https://www.biquge.com/book/12345/
  npm run crawl
  npm run start
      `);
      break;
  }
}

main().catch(error => {
  console.error('程序错误:', error);
  process.exit(1);
});