const Generator = require('yeoman-generator');

module.exports = class extends Generator {

  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);
  }

  async initPackage() {
    let answer = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.appname // Default to current folder name
      }
    ]);

    const pkgJson = {
      "name": answer.name,
      "version": "1.0.0",
      "description": "",
      "main": "generators/app/index.js",
      "scripts": {
        "build": "webpack",
        "test": "mocha --require @babel/register",
        "coverage": "nyc mocha --require @babel/register"
      },
      "keywords": [],
      "author": "",
      "license": "ISC",
      "devDependencies": {
        "webpack": '^4',
        "webpack-cli": "3.3.12",
        "vue-loader": '^15.0.0',
        "vue-template-compiler": '^2.0.0',
        "vue-style-loader": '^4.0.0',
        "css-loader": '*',
        "copy-webpack-plugin": '^6.0.0',
        "@babel/core": "^7.14.0",
        "babel-loader": "^8.2.2",
        "@babel/preset-env": "^7.14.1",
        "@babel/register": "^7.13.16",
        "@istanbuljs/nyc-config-babel": "^3.0.0",
        "babel-plugin-istanbul": "^6.0.0",
        "mocha": "^8.4.0",
        "nyc": "^15.1.0"
      },
      "dependencies": {
        "vue": '^2.0.0'
      }
    };

    // Extend or create package.json file in destination path
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
    this.npmInstall();
    // this.npmInstall(["vue"], {'save-dev': false});
    // this.npmInstall(["webpack", "vue-loader"], {'save-dev': true});

    this.fs.copyTpl(
      this.templatePath('HelloWorld.vue'),
      this.destinationPath('src/HelloWorld.vue'),
      {}
    );
    this.fs.copyTpl(
      this.templatePath('webpack.config.js'),
      this.destinationPath('webpack.config.js'),
      {}
    );
    this.fs.copyTpl(
      this.templatePath('main.js'),
      this.destinationPath('src/main.js'),
      {}
    );
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('src/index.html'),
      {title: answer.name}
    );

    // 测试相关
    this.fs.copyTpl(
      this.templatePath('.babelrc'),
      this.destinationPath('.babelrc'),
      {}
    );
    this.fs.copyTpl(
      this.templatePath('.nycrc'),
      this.destinationPath('.nycrc'),
      {}
    );

    this.fs.copyTpl(
      this.templatePath('sample-test.js'),
      this.destinationPath('test/sample-test.js'),
      {}
    );
  }
};
