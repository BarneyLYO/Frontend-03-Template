const Net = require('net');
const Request = require('../http-message/request');
const Response = require('../http-message/response');

let r = new Request({
	port: 8888,
	method: 'POST',
	body: {
		aaaa: 1111
	}
});

r.send()
	.then(d => console.log('data', d))
	.catch(e => console.log(e));
