const Http = require('http');

const PORT = process.env.PORT || 8888;

const TEMPLATE_HTML = `<html>
        <head>
          <style>
          #container{
            width:500px;
            height:300px;
            display:flex;
            background-color:rgb(255,255,255)
          }
          #container .c2{
            width:200px;
            height:100px;
            background-color:rgb(255,0,0)
          }
          #container .c1{
            flex:1;
            background-color:rgb(123,111,23)
          }
          </style>
        </head>
        <body>
          <div id="container">
            <div class="c1"></div>
            <div class="c2"></div>
          </div>
        </body>
      </html>
      `;

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
