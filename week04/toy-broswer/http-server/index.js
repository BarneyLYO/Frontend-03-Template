const Http = require('http');

const PORT = process.env.PORT || 8888;

const TEMPLATE_HTML = `<html maaa="a">
<head b='aaaa'>  
<style a="adasd">
body{
	width:100px;
	background-color:#ff5000;
}
body div{
	width:30px;
}

#myid{
	width:100px;
}

.a{
	height:1px;
}

div > a#myid {}

</style>
</head>
<body>
	<div class='a'>
		<a id="myid">sadasdsa</a>
	</div>
</body>
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
