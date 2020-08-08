const HEADERS = require('../static/headers');
const METHODS = require('../static/methods');
const DEFAULT = require('../static/default');
const Reponse = require('./response');
const Fs = require('fs');

const Net = require('net');

class Request {
	constructor(config = {}) {
		const {
			method = METHODS.GET,
			path = DEFAULT.PATH,
			port = DEFAULT.PORT,
			host = DEFAULT.LOCAL_HOST,
			headers = {},
			body = {}
		} = config;

		this.method = method;
		this.path = path;
		this.port = port;
		this.host = host;
		this.body = body;
		this.headers = headers;
		this.processHeaderAndBody();
	}

	processHeaderAndBody() {
		let { CONTENT_TYPE, CONTENT_LENGHT } = HEADERS;
		let body_text = '';

		if (!this.headers[CONTENT_TYPE.KEY]) {
			this.headers[CONTENT_TYPE.KEY] = CONTENT_TYPE.VAL.FORM_ENCODED;
		}

		switch (this.headers[CONTENT_TYPE.KEY]) {
			case CONTENT_TYPE.VAL.FORM_ENCODED:
				body_text = Object.keys(this.body)
					.map(k => `${k}=${encodeURIComponent(this.body[k])}`)
					.join('&');
				break;

			case CONTENT_TYPE.VAL.JSON:
				body_text = JSON.stringify(this.body);
				break;
		}

		this.headers[CONTENT_LENGHT.KEY] = body_text.length;
		this.bodyText = body_text;
	}

	toString() {
		const request_line =
			this.method + ' ' + this.path + ' ' + 'HTTP/1.1' + '\r';
		const headers_lines = Object.keys(this.headers)
			.map(k => k + ': ' + this.headers[k])
			.join('\r\n');
		const req = `${request_line}
${headers_lines}\r\n
${this.bodyText}`;
		console.log(req);
		return req;
	}

	send(conn) {
		return new Promise((res, rej) => {
			const parser = new Reponse.Parser();
			if (conn) {
				conn.write(this.toString());
			}
			//
			else {
				conn = Net.createConnection(
					{
						host: this.host,
						port: this.port
					},
					() => conn.write(this.toString())
				);
			}
			conn.on('data', data => {
				console.log('received', data.toString());
				parser.receive(data.toString());
				if (parser.isFinished) {
					res(parser.response);
					conn.end();
				}
			});

			conn.on('error', e => (rej(e), console.log('e', e)));
		});
	}
}

module.exports = Request;
