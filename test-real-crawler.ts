import axios from 'axios';

async function testBiqugeSites() {
  const sites = [
    'https://www.biquge.com/',
    'https://www.biqiuge.com/',
    'https://www.biquge5200.com/',
    'https://www.xbiquge.so/',
    'https://www.biquge.cn/'
  ];
  
  console.log('测试可访问的笔趣阁网站...\n');
  
  for (const site of sites) {
    try {
      const response = await axios.get(site, {
        timeout: 5000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      console.log(`✅ ${site} - 状态码: ${response.status}`);
    } catch (error: any) {
      console.log(`❌ ${site} - ${error.message}`);
    }
  }
}

testBiqugeSites();
