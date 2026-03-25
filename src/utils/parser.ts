import * as cheerio from 'cheerio';

export function parseHtml(html: string): cheerio.CheerioAPI {
  return cheerio.load(html);
}

export function cleanContent(content: string): string {
  return content
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<(?!br|p|\/p)[^>]+>/gi, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function extractText($: cheerio.CheerioAPI, selector: string): string {
  return $(selector).text().trim();
}

export function extractAttr($: cheerio.CheerioAPI, selector: string, attr: string): string {
  return $(selector).attr(attr) || '';
}