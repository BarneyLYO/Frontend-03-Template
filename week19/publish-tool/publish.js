let http = require('http');
let fs = require('fs');
let archiver = require('archiver');
let cp = require('child_process');
let qs = require('querystring');

// 1. 打开 https://github.com/login/oauth/authorize
// cp.exec(
// 	`start chrome https://github.com/login/oauth/authorize?client_id=Iv1.3745b8a8cc9a685c`
// );
cp.exec(
	`open -a "Google Chrome" https://github.com/login/oauth/authorize?client_id=Iv1.3745b8a8cc9a685c`
);

//3 创建server 接受token， 点击发布
http
	.createServer((req, res) => {
		const query = qs.parse(req.url.match(/^\/\?([\s\S]+)$/)[1]);
		publish(query.token, server);
	})
	.listen(8083);

function publish(token, server) {
	let request = http.request(
		{
			hostname: '127.0.0.1',
			port: 8082,
			method: 'post',
			path: `/publish?token=${token}`,
			headers: {
				'Content-Type': 'application/octet-stream'
			}
		},
		response => {
			console.log(response.toString());
		}
	);

	const archive = archiver('zip', {
		zlib: { level: 9 }
	});

	archive.directory('./sample/', false);

	archive.finalize();

	archive.pipe(request);
}
