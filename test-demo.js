// 测试演示脚本
console.log('\n=== 小说爬虫程序使用演示 ===\n');

console.log('步骤 1: 添加小说');
console.log('命令: npm run add https://www.biquge.com/book/12345/');
console.log('说明: 将小说添加到追踪列表\n');

console.log('步骤 2: 查看小说列表');
console.log('命令: npm run list');
console.log('说明: 查看所有已添加的小说\n');

console.log('步骤 3: 下载小说');
console.log('命令: npm run crawl');
console.log('说明: 下载所有小说的最新章节\n');

console.log('步骤 4: 检查更新');
console.log('命令: npm run update');
console.log('说明: 检查是否有新章节并下载\n');

console.log('步骤 5: 启动定时服务');
console.log('命令: npm run start');
console.log('说明: 启动后台服务，每2小时自动检查更新\n');

console.log('='.repeat(50));
console.log('\n提示: 请准备一个真实的笔趣阁小说目录页URL');
console.log('例如: https://www.biquge.com/book/12345/\n');
