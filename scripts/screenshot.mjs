import { chromium } from 'playwright';

const ARTICLE_ID = process.argv[2] || '61435c3880115e46739a7d5d';
const browser = await chromium.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto('http://127.0.0.1:3000/', { waitUntil: 'networkidle' });
await page.waitForTimeout(2500); // let fonts / typewriter / canvas settle
await page.screenshot({ path: '/tmp/shot-home.png', fullPage: true });
console.log('home shot done');

await page.goto(`http://127.0.0.1:3000/article/${ARTICLE_ID}`, { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.screenshot({ path: '/tmp/shot-article.png', fullPage: true });
console.log('article shot done');

// 留言板：内容很长，只截视口顶部
await page.goto('http://127.0.0.1:3000/message', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);
await page.screenshot({ path: '/tmp/shot-message.png' });
console.log('message shot done');

await browser.close();
