let Generator = require('yeoman-generator');
module.exports = class extends Generator {
	constructor(args, opts) {
		super(args, opts);

		this.option('babel'); // allow babel to be passed in
	}
	// YEOMAN 会顺次的执行一个class里面的方法
	method1() {
		this.log('method 1 just ran');
	}

	async method2() {
		this.log('method 2 just ran');
		const answers = await this.prompt([
			{
				type: 'input',
				name: 'name',
				message: 'your project name',
				default: this.appname
			},
			{
				type: 'confirm',
				name: 'cool',
				message: 'would you like to make a cool feature?'
			}
		]);

		this.log('app name', answers.name);
		this.log('cool feature', answers.cool);
	}

	z() {
		this.log('zzz');
	}

	a() {
		this.log('aaaaa');
	}

	writing() {
		console.log('copy template');
		const tplPath = this.templatePath('index.html');
		const desPath = this.destinationPath('public/index.html');
		this.fs.copyTpl(tplPath, desPath, { title: 'templating with Yeoman' });
	}

	initPkg() {
		const pkg = {
			devDependencies: {
				eslint: '^3.15.0'
			},
			dependencies: {
				react: '^16.2.0'
			}
		};

		this.fs.extendJSON(this.destinationPath('package.json'), pkg, true);
	}

	install() {
		this.log('假装我是npm install');
		//this.npmInstall()
	}
};
