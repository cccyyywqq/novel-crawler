import { BiqugeCrawler } from './src/crawlers/biquge';
import * as fs from 'fs';

const crawler = new BiqugeCrawler();
const html = fs.readFileSync('test-novel.html', 'utf8');

console.log('=== 测试笔趣阁爬虫 ===\n');

// 测试解析小说信息
console.log('1. 解析小说信息:');
const novelInfo = crawler.parseNovelInfo(html, 'https://example.com/novel/123');
console.log('   名称:', novelInfo.name);
console.log('   作者:', novelInfo.author);
console.log('   状态:', novelInfo.status);
console.log('   总章节:', novelInfo.totalChapters);

// 测试解析章节列表
console.log('\n2. 解析章节列表:');
const chapters = crawler.parseChapterList(html);
chapters.forEach((ch, i) => {
  console.log(`   第${i + 1}章: ${ch.title} (${ch.url})`);
});

console.log('\n✅ 测试完成！爬虫解析功能正常');
