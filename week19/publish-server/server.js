const http = require('http');
const https = require('https');
const fs = require('fs');
const unzipper = require('unzipper');
const qs = require('querystring');

// 2. auth route
function auth(req, res) {
	let query = qs.parse(req.url.match(/^\/auth\?([\s\S]+)$/)[1]);
	getToken(query.code, info => {
		console.log(info);
		res.write(
			`<a href="http://localhost:8083/?token=${info.access_token}">publish</a>`
		);
		res.end();
	});
}

function getToken(code, cb) {
	let req = https.request(
		{
			hostname: 'github.com',
			path: `/login/oauth/access_token?code=${code}&client_id=Iv1.3745b8a8cc9a685c&client_secret=a3e9cde133a83776f2c39c038437ab3d20c87dfb`,
			port: 443,
			method: 'POST'
		},
		res => {
			let body = '';
			res.on('data', chunk => {
				body += chunk.toString();
			});
			res.on('end', () => {
				cb(qs.parse(body));
			});
		}
	);
	req.end();
}

function publish(req, res) {
	let query = qs.parse(req.url.match(/^\/publish\?([\s\S]+)$/)[1]);
	if (query.token) {
		getUser(query.token, function(userInfo) {
			if (userInfo.login === 'BarneyLYO') {
				req.pipe(unzipper.Extract({ path: '../server/public/' }));
				req.on('end', () => {
					res.end('sucess');
				});
				return;
			}
			req.on('end', () => {
				res.end('you dont have permission');
			});
		});
	}
}

function getUser(token, cb) {
	const req = https.request(
		{
			hostname: 'api.github.com',
			path: `/user`,
			port: 443,
			method: 'get',
			headers: {
				Authorization: `token ${token}`,
				'User-Agent':
					'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36'
			}
		},
		res => {
			let body = '';
			res.on('data', chunk => {
				body += chunk.toString();
			});
			res.on('end', () => {
				cb(JSON.parse(body));
			});
		}
	);
	req.end();
}

http
	.createServer((req, res) => {
		if (req.url.match(/^\/auth\?/)) return auth(req, res);
		if (req.url.match(/^\/publish\?/)) return publish(req, res);
	})
	.listen(8082);
