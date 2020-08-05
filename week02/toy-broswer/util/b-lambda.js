const pipeline = (...fns) => (...args) => {
	return fns.reduce((result, cur, index) => {
		return index === 0 ? cur(...args) : cur(result);
	}, args);
};

module.exports = {
	pipeline
};
