const Http = require('http');

const PORT = process.env.PORT || 8888;

const TEMPLATE_HTML = `<html maaa="a">
<head b='aaaa'>  
<style a="adasd">
body div #myid{
	width:100px;
	background-color:#ff5000;
}
body div img{
	width:30px;
}
</style>
</head>
</html>`;

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
			res.end(TEMPLATE_HTML);
		});
};

Http.createServer(messageHandler).listen(PORT);

console.log('server starts on port:', PORT);
