export function add(a, b) {
	return a + b;
}

export function mul(a, b) {
	return a * b;
}

// exports.add = add;
// exports.mul = mul;

//module.exports = add;
/**
 * the reason module.exports should be use is because
 * mocha is use for the node testing
 * so if we want to use es6 module we should use
 * babel/register model for intime compilation
 * and when testing use:
 * mocha --require @babel.register //global
 *
 * ./node_modules/.bin/mocha and blabla
 * also you can put those thing into package.json
 * and since package.json will automatically append the command with ./node-modules/.bin/xxx
 * so....
 *
 * mocha dont have code coverage tool so you will have to integrate with another tools
 * for instance nyc(istanbuljs)
 */

//export default add;
