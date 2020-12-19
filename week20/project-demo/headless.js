const puppeteer = require('puppeteer');

(async () => {
	const broswer = await puppeteer.launch();
	const page = await broswer.newPage();
	await page.goto(
		'http://127.0.0.1:5500/Geekbang_homework/Frontend-03-Template/week16/project/jsx/dist/main.html'
	);
	const el = await page.$('div');
	const element = await el.asElement().boxModel();
	console.log(element);
})();
