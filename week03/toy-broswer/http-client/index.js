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
	console.log(dom);
})();
