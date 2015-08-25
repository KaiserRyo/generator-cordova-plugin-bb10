# Yeoman Generator for BB10 Cordova Plugins

This is a Yeoman generator that will create the basic scaffolding for a BB10 Cordova plugin. The generator will create a native C++ project, and the Cordova plugin pieces that access it, and a sample app that calls the plugin methods. The methods will be examples that show various ways to call from JavaScript into C++.

### Yeoman and Generator Installation

Install Yeoman globally from NPM:

```
	npm install -g yo
```

Install the generator globally as well

```
	npm install -g generator-cordova-plugin-bb10
```

### Running the Generator

The generator will prompt for 4 values when run, and you can pass in some of them on the command line

1. __Project Name__ - the overall name of the plugin which is used in the native project and in API calls.
2. __Plugin Name__ - the ID of the plugin which is used in the application, and when publishing or retrieving it from NPM. This is typically in the form: cordova-plugin-***
3. __API Root__ - this is the root object that all the JavaScript methods will be contained in. The name used will be added into the cordova.plugins object.
4. __Author name__ - this value will be saved so you only have to enter it one time.

Run the generator like so, in the directory where you want to generate the new plugin and sample:

```
	yo cordova-plugin-bb10 <project name> <plugin name> <api root>
```

You will be prompted to confirm all four values.

### Next Steps

After generation, before you can test the plugin, you first need to build the native code. Detailed instructions are in the README file that was generated, but the basics are to import it as an existing project into Momentics, and build the _device_ and _simulator_ configurations.

Finally, run the sample so it builds to your device:

```
	cordova run
```

Checkout the generated README for an explanation of all the methods and how to use them.
