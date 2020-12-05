//mocha is for node js, so require
const assert = require('assert');
//const add = require('../add');
//import add from '../add';
// const fun = require('../add');
const parse = require('../src/html/index');

const eql = assert.equal;
const parseTagAndRun = (tag, fn) => {
	let tree = parse.parseHTML(tag);
	fn(tree);
	parse.cleanCache();
};

describe('html parse testing', () => {
	describe('direct call', () => {
		it('<a href="//time"></a>', () => {
			parseTagAndRun('<a href="//time"></a>', tree => {
				const top = tree.children[0];
				eql(top.tagName, 'a');
				eql(top.attributes.length, 1);
			});
		});

		it('<a></a>', () => {
			parseTagAndRun('<a></a>', tree => {
				const top = tree.children[0];
				eql(top.tagName, 'a');
				eql(top.attributes.length, 0);
			});
		});

		it('<a href ></a>', () => {
			parseTagAndRun('<a href ></a>', tree => {
				const top = tree.children[0];
				eql(top.tagName, 'a');
				eql(top.attributes.length, 1);
			});
		});

		it('<a href="true"></a>', () => {
			parseTagAndRun('<a href="true"></a>', tree => {
				const top = tree.children[0];
				eql(top.tagName, 'a');
				eql(top.attributes.length, 1);
			});
		});

		it('<a href="true"/>', () => {
			parseTagAndRun('<a href="true"/>', tree => {
				const top = tree.children[0];
				eql(top.tagName, 'a');
				eql(top.attributes.length, 1);
			});
		});

		it("<a href='true' />", () => {
			parseTagAndRun("<a href='true'/>", tree => {
				const top = tree.children[0];
				eql(top.tagName, 'a');
				eql(top.attributes.length, 1);
			});
		});

		it('<a href="true" />', () => {
			parseTagAndRun('<a href="true" />', tree => {
				const top = tree.children[0];
				eql(top.tagName, 'a');
				eql(top.attributes.length, 1);
			});
		});

		it('<a href="true"dasda />', () => {
			parseTagAndRun('<a href="true"dsad />', tree => {
				tree.children[0];
			});
		});

		it('<a href=true/>', () => {
			parseTagAndRun('<a href=true/>', tree => {
				const top = tree.children[0];
			});
		});

		it('<a href=true />', () => {
			parseTagAndRun('<a href=true />', tree => {
				const top = tree.children[0];
			});
		});

		it('<a href=true /', () => {
			parseTagAndRun('<a href=true /', tree => {
				const top = tree.children[0];
			});
		});

		it("<a href= 'true'/>", () => {
			parseTagAndRun("<a href= 'true'/>", tree => {
				const top = tree.children[0];
				eql(top.tagName, 'a');
				eql(top.attributes.length, 1);
			});
		});

		it("<a href=/'true'/>", () => {
			parseTagAndRun("<a href=/'true'/>", tree => {
				tree.children[0];
			});
		});

		it('<a > </a>', () => {
			parseTagAndRun('<a > </a>', tree => {
				const top = tree.children[0];
				eql(top.tagName, 'a');
				eql(top.attributes.length, 0);
			});
		});

		it('<a  > </a>', () => {
			parseTagAndRun('<a  > </a>', tree => {
				const top = tree.children[0];
				eql(top.tagName, 'a');
				eql(top.attributes.length, 0);
			});
		});

		it('<a  = > </a>', () => {
			parseTagAndRun('<a = > </a>', tree => {
				assert.throws(() => {
					const top = tree.children[0];
				}, 'before attribute dont allow =');
			});
		});

		it('<a />', () => {
			parseTagAndRun('<a />', tree => {
				const top = tree.children[0];
				eql(top.tagName, 'a');
				eql(top.attributes.length, 0);
			});
		});

		it('<a/>', () => {
			parseTagAndRun('<a/>', tree => {
				const top = tree.children[0];
				eql(top.tagName, 'a');
				eql(top.attributes.length, 0);
			});
		});

		it('<A>hjjkh</A>', () => {
			parseTagAndRun('<A>hjjkh</A>', tree => {
				const top = tree.children[0];
				eql(top.tagName, 'A');
				eql(top.attributes.length, 0);
			});
		});

		it('<A>hjjkh', () => {
			parseTagAndRun('<A>hjjkh', tree => {
				const top = tree.children[0];
				eql(top.tagName, 'A');
				eql(top.attributes.length, 0);
			});
		});

		it('<', () => {
			parseTagAndRun('<', tree => {
				const top = tree.children[0];
				assert.equal(top, undefined);
			});
		});

		it('<>', () => {
			parseTagAndRun('<>', tree => {
				const top = tree.children[0];
			});
		});
		it('<></>', () => {
			parseTagAndRun('<></>', tree => {
				const top = tree.children[0];
			});
		});

		it('<a-a>', () => {
			parseTagAndRun('<a-a>', tree => {
				const top = tree.children[0];
			});
		});

		it('<a-a  >', () => {
			parseTagAndRun('<a-a>', tree => {
				const top = tree.children[0];
			});
		});
	});
});
