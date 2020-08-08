class Parser {
	static STATE = {
		WAITING_STATUS_LINE: 0,
		WAITING_STATUS_LINE_END: 1,
		WAITING_HEADER_NAME: 2,
		WAITING_HEADER_SPACE: 3,
		WAITING_HEADER_VALUE: 4,
		WAITING_HEADER_LINE_END: 5,
		WAITING_HEADER_BLOCK_END: 6,
		WAITING_BODY: 7
	};

	static REGEX_HEAD_LINE = /HTTP\/1.1 ([0-9]+) ([\s\S]+)/;

	constructor() {
		this.current = Parser.STATE.WAITING_STATUS_LINE;
		this.statusLine = '';
		this.headers = {};
		this.headerName = '';
		this.headerValue = '';
		this.bodyParser = null;
	}

	get isFinished() {
		return this.bodyParser && this.bodyParser.isFinished;
	}

	get response() {
		this.statusLine.match(this.REGEX_HEAD_LINE);
		return {
			statusCode: RegExp.$1,
			statusText: RegExp.$2,
			headers: this.headers,
			body: this.bodyParser.content.join('')
		};
	}

	receive(str) {
		for (let c of String(str)) {
			this.receiveChar(c);
		}
	}

	receiveChar(char) {
		let state = Parser.STATE;

		switch (this.current) {
			case state.WAITING_STATUS_LINE:
				if (char === '\r') {
					this.current = state.WAITING_STATUS_LINE_END;
				}
				//still in status line
				else {
					this.statusLine += char;
				}
				break;

			case state.WAITING_STATUS_LINE_END:
				if (char === '\n') {
					this.current = state.WAITING_HEADER_NAME;
				}
				break;

			case state.WAITING_HEADER_NAME:
				if (char === ':') {
					this.current = state.WAITING_HEADER_SPACE;
				}
				//
				else if (char === '\r') {
					this.current = state.WAITING_HEADER_BLOCK_END;
				}
				//
				else {
					this.headerName += char;
				}
				break;

			case state.WAITING_HEADER_SPACE:
				if (char === ' ') {
					this.current = state.WAITING_HEADER_VALUE;
				}
				break;

			case state.WAITING_HEADER_VALUE:
				if (char === '\r') {
					this.current = state.WAITING_HEADER_LINE_END;
					this.headers[this.headerName] = this.headerValue;
					this.headerName = '';
					this.headerValue = '';
				}
				//
				else {
					this.headerValue += char;
				}
				break;

			case state.WAITING_HEADER_LINE_END:
				if (char === '\n') {
					this.current = state.WAITING_HEADER_NAME;
				}
				break;

			case state.WAITING_HEADER_BLOCK_END:
				if (char === '\n') {
					this.current = state.WAITING_BODY;
					if (this.headers['Transfer-Encoding'] === 'chunked') {
						this.bodyParser = new TrunckedBodyParser();
					}
				}
				break;

			case state.WAITING_BODY:
				this.bodyParser.receiveChar(char);
				break;
		}
	}
}

class TrunckedBodyParser {
	static STATE = {
		WAITING_LENGTH: 0,
		WAITING_LENGTH_LINE_END: 1,
		READING_TRUNK: 2,
		WAITING_NEW_LINE: 3,
		WAITING_NEW_LINE_END: 4
	};

	constructor() {
		this.length = 0;
		this.content = [];
		this.isFinished = false;
		this.current = TrunckedBodyParser.STATE.WAITING_LENGTH;
	}

	receiveChar(char) {
		const state = TrunckedBodyParser.STATE;

		switch (this.current) {
			case state.WAITING_LENGTH:
				if (char === '\r') {
					if (this.length === 0) {
						this.isFinished = true;
					}
					this.current = state.WAITING_LENGTH_LINE_END;
				}
				//
				else {
					this.length *= 16;
					this.length += parseInt(char, 16);
				}
				break;
			case state.WAITING_LENGTH_LINE_END:
				if (char === '\n') {
					this.current = state.READING_TRUNK;
				}
				break;
			case state.READING_TRUNK:
				this.content.push(char);
				this.length--;
				if (this.length === 0) {
					this.current = state.WAITING_NEW_LINE;
				}
				break;
			case state.WAITING_NEW_LINE:
				if (char === '\r') {
					this.current = state.WAITING_NEW_LINE_END;
				}
				break;
			case state.WAITING_NEW_LINE_END:
				if (char === '\n') {
					this.current = this.WAITING_LENGTH;
				}
				break;
		}
	}
}
module.exports = {
	Parser
};
