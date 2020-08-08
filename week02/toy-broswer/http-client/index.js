const Net = require('net');
const Request = require('../http-message/request');
const Response = require('../http-message/response');

let r = new Request({
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

r.send()
	.then(d => console.log('data', d))
	.catch(e => console.log(e));
