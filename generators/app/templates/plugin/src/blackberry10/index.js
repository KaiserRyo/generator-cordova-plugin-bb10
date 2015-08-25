/*
* Copyright (c) 2013 BlackBerry Limited
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

var <%= projectLower %>,
	resultObjs = {},
	threadCallback = null,
   _utils = require("../../lib/utils");

module.exports = {

	// Code can be declared and used outside the module.exports object,
	// but any functions to be called by client.js need to be declared
	// here in this object.

	// These methods call into JNEXT.<%= projectName %> which handles the
	// communication through the JNEXT plugin to <%= projectLower %>_js.cpp
	<%= projectCamel %>Test: function (success, fail, args, env) {
		var result = new PluginResult(args, env);
		result.ok(<%= projectCamel %>.getInstance().<%= projectCamel %>Test(), false);
	},
	<%= projectCamel %>TestInput: function (success, fail, args, env) {
		var result = new PluginResult(args, env);
		args = JSON.parse(decodeURIComponent(args["input"]));
		result.ok(<%= projectCamel %>.getInstance().<%= projectCamel %>TestInput(result.callbackId, args), false);
	},
	// Asynchronous function calls into the plugin and returns
	<%= projectCamel %>TestAsync: function (success, fail, args, env) {
		var result = new PluginResult(args, env);
		resultObjs[result.callbackId] = result;
		args = JSON.parse(decodeURIComponent(args["input"]));
		<%= projectCamel %>.getInstance().<%= projectCamel %>TestAsync(result.callbackId, args);
		result.noResult(true);
	},
	<%= projectCamel %>Property: function (success, fail, args, env) {
		var result = new PluginResult(args, env);
		var value;
		if (args && args["value"]) {
			value = JSON.parse(decodeURIComponent(args["value"]));
			<%= projectCamel %>.getInstance().<%= projectCamel %>Property(result.callbackId, value);
			result.noResult(false);
		} else {
			result.ok(<%= projectCamel %>.getInstance().<%= projectCamel %>Property(), false);
		}
	},
	// Thread methods to start and stop
	<%= projectCamel %>StartThread: function (success, fail, args, env) {
		var result = new PluginResult(args, env);
		if (!threadCallback) {
			threadCallback = result.callbackId;
			resultObjs[result.callbackId] = result;
			result.ok(<%= projectCamel %>.getInstance().<%= projectCamel %>StartThread(result.callbackId), true);
		} else {
			result.error(<%= projectCamel %>.getInstance().<%= projectCamel %>StartThread(result.callbackId), false);
		}
	},
	<%= projectCamel %>StopThread: function (success, fail, args, env) {
		var result = new PluginResult(args, env);
		if (!threadCallback) {
			result.error("Thread is not running", false);
		} else {
			delete resultObjs[threadCallback];
			threadCallback = null;
			result.ok(<%= projectCamel %>.getInstance().<%= projectCamel %>StopThread(), false);
		}
	}
};

///////////////////////////////////////////////////////////////////
// JavaScript wrapper for JNEXT plugin for connection
///////////////////////////////////////////////////////////////////

JNEXT.<%= projectName %> = function () {
	var self = this,
		hasInstance = false;

	self.getId = function () {
		return self.m_id;
	};

	self.init = function () {
		if (!JNEXT.require("lib<%= projectName %>")) {
			return false;
		}

		self.m_id = JNEXT.createObject("lib<%= projectName %>.<%= projectName %>_JS");

		if (self.m_id === "") {
			return false;
		}

		JNEXT.registerEvents(self);
	};

	// ************************
	// Enter your methods here
	// ************************

	// calls into InvokeMethod(string command) in <%= projectLower %>_js.cpp
	self.<%= projectCamel %>Test = function () {
		return JNEXT.invoke(self.m_id, "<%= projectCamel %>Test");
	};
	self.<%= projectCamel %>TestInput = function (callbackId, input) {
		return JNEXT.invoke(self.m_id, "<%= projectCamel %>TestInput " + callbackId + " " + input);
	};
	self.<%= projectCamel %>TestAsync = function (callbackId, input) {
		return JNEXT.invoke(self.m_id, "<%= projectCamel %>TestAsync " + callbackId + " " + JSON.stringify(input));
	};
	self.<%= projectCamel %>Property = function (callbackId, value) {
		if (value) {
			return JNEXT.invoke(self.m_id, "<%= projectCamel %>Property " + callbackId + " " + value);
		} else {
			return JNEXT.invoke(self.m_id, "<%= projectCamel %>Property");
		}
	};
	// Fired by the Event framework (used by asynchronous callbacks)
	self.onEvent = function (strData) {
		var arData = strData.split(" "),
			callbackId = arData[0],
			result = resultObjs[callbackId],
			data = arData.slice(1, arData.length).join(" ");

		if (result) {
			if (callbackId != threadCallback) {
				result.callbackOk(data, false);
				delete resultObjs[callbackId];
			} else {
				result.callbackOk(data, true);
			}
		}
	};

	// Thread methods
	self.<%= projectCamel %>StartThread = function (callbackId) {
		return JNEXT.invoke(self.m_id, "<%= projectCamel %>StartThread " + callbackId);
	};
	self.<%= projectCamel %>StopThread = function () {
		return JNEXT.invoke(self.m_id, "<%= projectCamel %>StopThread");
	};

	// ************************
	// End of methods to edit
	// ************************
	self.m_id = "";

	self.getInstance = function () {
		if (!hasInstance) {
			hasInstance = true;
			self.init();
		}
		return self;
	};

};

<%= projectCamel %> = new JNEXT.<%= projectName %>();
