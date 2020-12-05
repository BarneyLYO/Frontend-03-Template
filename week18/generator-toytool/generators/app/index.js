const Generator = require('yeoman-generator');
const ResourceLoader = require('./constant/index');

module.exports = class extends Generator {
	constructor(args, opts) {
		super(args, opts);
	}

	initGenerator() {
		const log = this.log;
		log('Loading Resource......');
		this['settings'] = ResourceLoader(this);
		log('Loading Finised');
	}

	async initPKG() {
		const { PROMPTS, BUILD_DEPENDENCIES, DEV_DEPENDENCIES } = this.settings;
		this.answer = await this.prompt({
			...PROMPTS.name,
			['default']: this.appname
		});

		const pkgs = {
			name: this.answer.name,
			version: '1.0.0',
			description: '',
			main: 'generators/app/index.js',
			scripts: {
				test: 'mocha --require @babel/register',
				coverage: 'nyc mocha',
				build: 'webpack'
			},
			author: '',
			license: 'ISC',
			dependencies: {},
			devDependencies: {}
		};
		this.fs.extendJSON(this.destinationPath('package.json'), pkgs, true);
		this.npmInstall(BUILD_DEPENDENCIES, { 'save-dev': false });
		this.npmInstall(DEV_DEPENDENCIES, { 'save-dev': true });
	}

	copyFiles() {
		this.fs.copyTpl(
			this.templatePath('index.html'),
			this.destinationPath('src/index.html'),
			{ title: this.answer.name }
		);
		this.fs.copyTpl(
			this.templatePath('HelloWorld.vue'),
			this.destinationPath('src/HelloWorld.vue')
		);
		this.fs.copyTpl(
			this.templatePath('webpack.config.js'),
			this.destinationPath('webpack.config.js')
		);
		this.fs.copyTpl(
			this.templatePath('main.js'),
			this.destinationPath('src/main.js')
		);
		this.fs.copyTpl(
			this.templatePath('.babelrc'),
			this.destinationPath('.babelrc')
		);
		this.fs.copyTpl(
			this.templatePath('sample-test.js'),
			this.destinationPath('test/sample-test.js')
		);
		this.fs.copyTpl(
			this.templatePath('.nycrc'),
			this.destinationPath('.nycrc')
		);
	}
};
