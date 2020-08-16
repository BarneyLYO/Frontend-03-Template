const Net = require('net');
const Request = require('../http-message/request');
const Parser = require('../html/');

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
	//traverse(dom);
})();

function traverse(el) {
	if (!el || !el.children || !el.children.length) return;
	console.log(el);
	const { children } = el;
	children.forEach(traverse);
}
