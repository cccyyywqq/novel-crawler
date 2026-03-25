import { BaseCrawler } from './base';
import { Novel } from '../models/novel';
import { Chapter } from '../models/chapter';
import { parseHtml, cleanContent, extractText } from '../utils/parser';

export class BiqugeCrawler extends BaseCrawler {
  getSourceName(): string {
    return '笔趣阁';
  }

  parseNovelInfo(html: string, url: string): Partial<Novel> {
    const $ = parseHtml(html);
    
    const name = extractText($, '#info h1').replace(/全文免费阅读.*/, '').trim();
    const authorText = $('#info p').eq(0).text();
    const author = authorText.replace(/作\s*者[：:]/, '').trim();
    
    const statusText = $('#info p').eq(2).text();
    const status = statusText.includes('完结') ? 'completed' : 
                   statusText.includes('连载') ? 'ongoing' : 'unknown';
    
    const lastUpdateText = $('#info p').eq(3).text();
    const lastUpdate = lastUpdateText.replace(/最后更新[：:]/, '').trim();
    
    let totalChapters = 0;
    $('#list dl dd a').each((i, el) => {
      totalChapters++;
    });

    return {
      id: this.generateId(url),
      name,
      author,
      url,
      totalChapters,
      status,
      lastUpdate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  parseChapterList(html: string): Chapter[] {
    const $ = parseHtml(html);
    const chapters: Chapter[] = [];
    
    let index = 0;
    $('#list dl dd a').each((i, el) => {
      const $el = $(el);
      const title = $el.text().trim();
      let chapterUrl = $el.attr('href') || '';
      
      if (chapterUrl && !chapterUrl.startsWith('http')) {
        const baseUrl = $('#list dl dd a').first().attr('href');
        if (baseUrl) {
          const urlObj = new URL(baseUrl, 'http://example.com');
          chapterUrl = `${urlObj.protocol}//${urlObj.host}${chapterUrl}`;
        }
      }
      
      chapters.push({
        index: index++,
        title,
        url: chapterUrl,
        crawled: false
      });
    });

    return chapters;
  }

  parseChapterContent(html: string): string {
    const $ = parseHtml(html);
    
    let content = '';
    
    const $content = $('#content');
    if ($content.length) {
      $content.find('div, script, style, .adsbygoogle').remove();
      content = $content.html() || '';
    }
    
    if (!content) {
      const $content2 = $('.content');
      if ($content2.length) {
        $content2.find('div, script, style').remove();
        content = $content2.html() || '';
      }
    }
    
    content = cleanContent(content);
    
    return content;
  }
}