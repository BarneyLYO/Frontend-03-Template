const Net = require('net');
const Images = require('images');

const Request = require('../http-message/request');
const Parser = require('../html/');

const REG_RGB = /rgb\((\d+),(\d+),(\d+)\)/;
function render(viewport, element) {
	if (element.style) {
		var img = Images(element.style.width, element.style.height);
		if (element.style['background-color']) {
			let color = element.style['background-color'] || 'rgb(0,0,0)';
			color.match(REG_RGB);
			let r = Number(RegExp.$1);
			let g = Number(RegExp.$2);
			let b = Number(RegExp.$3);
			img.fill(r, g, b);
			viewport.draw(img, element.style.left || 0, element.style.top || 0);
		}
	}
	if (element.children) {
		for (var child of element.children) {
			render(viewport, child);
		}
	}
}

void (async function() {
	let request = new Request({
		port: 8888,
		host: '127.0.0.1',
		method: 'POST',
		header: {
			['X-Foo2']: 'customed'
		},
		body: {
			aaaa: 1111
		}
	});

	let response = await request.send();
	let dom = Parser.parseHTML(response.body);
	let viewport = Images(999, 999);
	render(viewport, dom);
	viewport.save('viewport' + Math.random() + '.jpg');
})();

function traverse(el) {
	if (!el || !el.children || !el.children.length) return;
	console.log(el);
	const { children } = el;
	children.forEach(traverse);
}
