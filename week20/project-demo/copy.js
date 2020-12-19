const fs = require('fs');
const path = require('path');

const source = path.resolve(__dirname, 'pre-commit');
const dest = path.resolve(__dirname, '.git', 'hooks', 'pre-commit');

const log = console.log;

fs.copyFile(
	source,
	dest,
	() => (log('copy ', source, 'to', dest), fs.chmodSync(dest, 0o777))
);
