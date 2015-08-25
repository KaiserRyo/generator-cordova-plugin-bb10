/*
   Copyright 2015 BlackBerry Limited.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

var generators = require('yeoman-generator');
var _ = require('lodash');

module.exports = generators.Base.extend({
	// note: arguments and options should be defined in the constructor.
	constructor: function () {
		generators.Base.apply(this, arguments);

		this.argument('argproject', { type: String, required: false });
		this.argument('argname', { type: String, required: false });
		this.argument('argbase', { type: String, required: false });
	},

	initializing: function() {
        this.log("This will generate a BB10 Cordova Plugin. It accepts some arguments in this order: <project name> <plugin name> <api root>");
    },

	prompting: {
		promptProject: function () {
			var self = this;
			var done = this.async();
			this.prompt({
				type    : 'input',
				name    : 'project',
				message : 'Your project name (ie: SamplePlugin)',
				default : _.capitalize(this.argproject || this.appname) // Default to argument, or current folder name
			}, function (answers) {
				self.projectName = answers.project;
				done();
	  		}.bind(this));
		},
		promptName: function () {
			var self = this;
			var done = this.async();
			this.prompt({
				type    : 'input',
				name    : 'name',
				message : 'Your plugin name (ie: cordova-plugin-name)',
				default : _.kebabCase(this.argname || this.appname) // Default to argument, or current folder name
			}, function (answers) {
				self.pluginName = answers.name;
				done();
	  		}.bind(this));
		},
		promptBase: function () {
			var self = this;
			var done = this.async();
	  		this.prompt({
				type    : 'input',
				name    : 'base',
				message : 'Your plugin object root (ie: part after cordova.plugins....)',
				default : this.argbase || "plugin" // Default to argument, or just use text
			}, function (answers) {
				self.apiBase = answers.base;
				done();
	  		}.bind(this));
	  	},
	  	promptAuthor: function () {
			var self = this;
			var done = this.async();
	  		this.prompt({
				type    : 'input',
				name    : 'author',
				message : 'Author name',
				store   : true
			}, function (answers) {
				self.author = answers.author;
				done();
	  		}.bind(this));
	  	}
	},
	writing: {
		copyBasicTemplate: function () {
			var replacements = {
				projectName: _.capitalize(this.projectName),
				projectLower: _.snakeCase(this.projectName),
				projectCamel: _.camelCase(this.projectName),
				pluginName: _.kebabCase(this.pluginName),
				apiBase: this.apiBase,
				author: this.author
			};
			this.log('Creating a BB10 Cordova Plugin named ' + replacements.pluginName);
			this.log('at ' + this.destinationRoot());
			this.log('The Native project will be called ' + replacements.projectName);
			this.log('Access in apps will be through cordova.plugins.' + replacements.apiBase);
			this.fs.copyTpl(
				this.templatePath('plugin/**'),
				this.destinationPath('plugin'),
				replacements
			);
			this.fs.copyTpl(
				this.templatePath('plugin/src/blackberry10/native/.project'),
				this.destinationPath('plugin/src/blackberry10/native/.project'),
				replacements
			);
			this.fs.copyTpl(
				this.templatePath('plugin/src/blackberry10/native/.cproject'),
				this.destinationPath('plugin/src/blackberry10/native/.cproject'),
				replacements
			);
			// Copy and rename native template files
			this.fs.copyTpl(
				this.templatePath('plugin_rename/template_js.hpp'),
				this.destinationPath('plugin/src/blackberry10/native/src/'+ replacements.projectLower +'_js.hpp'),
				replacements
			);
			this.fs.copyTpl(
				this.templatePath('plugin_rename/template_js.cpp'),
				this.destinationPath('plugin/src/blackberry10/native/src/'+ replacements.projectLower +'_js.cpp'),
				replacements
			);
			this.fs.copyTpl(
				this.templatePath('plugin_rename/template_ndk.hpp'),
				this.destinationPath('plugin/src/blackberry10/native/src/'+ replacements.projectLower +'_ndk.hpp'),
				replacements
			);
			this.fs.copyTpl(
				this.templatePath('plugin_rename/template_ndk.cpp'),
				this.destinationPath('plugin/src/blackberry10/native/src/'+ replacements.projectLower +'_ndk.cpp'),
				replacements
			);
			// Copy sample files (js first then images separately)
			this.fs.copyTpl(
				this.templatePath('sample/**'),
				this.destinationPath('sample'),
				replacements);
			this.fs.copy(
				this.templatePath('sample_imgs/**'),
				this.destinationPath('sample/www'));
			// Copy readme files
			this.fs.copyTpl(
				this.templatePath('readme/README.md'),
				this.destinationPath('README.md'),
				replacements);
			this.fs.copy(
				this.templatePath('readme/*.png'),
				this.destinationRoot());
		}
	}
});
