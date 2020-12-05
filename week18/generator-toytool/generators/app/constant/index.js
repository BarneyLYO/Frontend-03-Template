const fs = require('fs');
const path = require('path');
const once = require('../util/once');
module.exports = once(() =>
	fs
		.readdirSync(__dirname)
		.filter((n, id) => n !== 'index.js')
		.map(name => require(path.resolve(__dirname, name)))
		.reduce((accu, curr) => {
			return { ...accu, [curr.name]: curr.configs };
		}, {})
);
