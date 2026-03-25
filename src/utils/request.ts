import axios, { AxiosRequestConfig } from 'axios';

const request = axios.create({
  timeout: 30000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
  }
});

export async function get(url: string, config?: AxiosRequestConfig): Promise<string> {
  const response = await request.get(url, {
    ...config,
    responseType: 'arraybuffer'
  });
  
  const buffer = Buffer.from(response.data, 'binary');
  return buffer.toString('utf8');
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}