const CONTENT_TYPE = 'Content-Type';
const CONTENT_LENGTH = 'Content-Length';

const METHODS = {
	GET: 'GET',
	POST: 'POST'
};

const DEFAULT_PORT = 80;

const DEFAULT_PATH = '/';

const pipeline = (...fns) => (...args) => {
	return fns.reduce((result, cur, index) => {
		return index === 0 ? cur(...args) : cur(result);
	}, args);
};

const processBasicConfig = config => {
	const {
		method = METHODS.GET,
		host = null,
		port = DEFAULT_PORT,
		path = DEFAULT_PATH
	} = config;

	if (!host) {
		throw TypeError('host must specify');
	}

	return {
		...config,
		method,
		host,
		port,
		path
	};
};
const processInner = config => {
	const { headers = {}, body = {} } = config;
	let body_text = '';

	if (!headers[CONTENT_TYPE]) {
		headers[CONTENT_TYPE] = 'application/x-www-form-urlencoded';
	}

	if (headers[CONTENT_TYPE] === 'application/json') {
		body_text = JSON.stringify(body);
	}
	//
	else if (headers[CONTENT_TYPE] === 'application/x-www-form-urlencoded') {
		body_text = Object.keys(body)
			.map(k => `${k}=${encodeURIComponent(body[k])}`)
			.join('&');
	}

	headers[CONTENT_LENGTH] = body_text.length;
	return {
		...config,
		headers,
		body_text
	};
};

const gennerateHttpRequest = config =>
	pipeline(processBasicConfig, processInner)(config);

console.log(gennerateHttpRequest({ host: '127.0.0.1' }));
