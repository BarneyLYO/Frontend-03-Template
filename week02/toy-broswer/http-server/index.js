const Http = require('http');

const PORT = process.env.PORT || 8888;

const CONTENT_TYPE = {
	name: 'Content-Type',
	values: {
		HTML: 'text/html'
	}
};

const messageHandler = (req, res) => {
	let body = [];
	req
		.on('error', console.log)
		.on('data', chunk => {
			console.log('c', chunk);
			body.push(Buffer.from(chunk));
		})
		.on('end', () => {
			body = Buffer.concat(body).toString();
			res.writeHead(200, { [CONTENT_TYPE.name]: CONTENT_TYPE.values.HTML });
			res.end('Hello, its me you looking for ?\n');
		});
};

Http.createServer(messageHandler).listen(PORT);

console.log('server starts on port:', PORT);
