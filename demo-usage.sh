#!/bin/bash
# 小说爬虫使用演示

echo "====================================="
echo "   小说爬虫程序 - 使用演示"
echo "====================================="
echo ""

# 显示当前状态
echo "【当前状态】"
echo "追踪的小说列表:"
npm run list --silent
echo ""

# 使用说明
echo "【使用步骤】"
echo ""
echo "第1步: 添加小说"
echo "-----------------------------------"
echo "命令: npm run add <小说目录页URL>"
echo ""
echo "示例URL格式:"
echo "  - https://www.biquge.com/book/12345/"
echo "  - https://www.biqiuge.com/book/12345/"
echo "  - https://www.biquge5200.com/book/12345/"
echo ""
echo "提示: 请将URL替换为真实的小说目录页地址"
echo ""

echo "第2步: 查看小说列表"
echo "-----------------------------------"
echo "命令: npm run list"
echo "说明: 显示所有已添加的小说及其信息"
echo ""

echo "第3步: 下载小说"
echo "-----------------------------------"
echo "命令: npm run crawl        # 下载所有小说"
echo "命令: npm run crawl <ID>   # 下载指定小说"
echo "说明: 章节将保存在 novels/小说名/ 目录下"
echo ""

echo "第4步: 检查更新"
echo "-----------------------------------"
echo "命令: npm run update"
echo "说明: 检查所有小说是否有新章节，有则自动下载"
echo ""

echo "第5步: 启动定时服务（可选）"
echo "-----------------------------------"
echo "命令: npm run start"
echo "说明: 后台运行，每2小时自动检查更新"
echo "停止: 按 Ctrl+C"
echo ""

echo "【其他命令】"
echo "-----------------------------------"
echo "npm run remove <ID>  # 移除指定小说"
echo "npm run help         # 显示帮助信息"
echo ""

echo "【数据存储】"
echo "-----------------------------------"
echo "config/novels.json    - 小说配置"
echo "chapters/<ID>.json    - 章节元数据"
echo "novels/<小说名>/      - 章节内容(TXT)"
echo ""

echo "====================================="
echo "   准备好了吗？开始你的爬虫之旅吧！"
echo "====================================="
