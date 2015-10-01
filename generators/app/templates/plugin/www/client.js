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

var _self = {},
	_ID = "<%= pluginName %>",
	exec = cordova.require("cordova/exec");

	// These methods are called by your App's JavaScript
	// They make WebWorks function calls to the methods
	// in the index.js of the Extension

function invokeCallback(callback, args) {
	if (callback && typeof callback === "function") {
		callback(args);
	}
}

	// Simple Synchronous test function to get a string

	_self.<%= projectCamel %>Test = function (onSuccess, onFail) {
		exec(function (result) {
			invokeCallback(onSuccess, result);
		}, function(error) {
			invokeCallback(onFail, error);
		}, _ID, "<%= projectCamel %>Test", null);
	};

	_self.<%= projectCamel %>TestInput = function (input, onSuccess, onFail) {
		exec(function (result) {
			invokeCallback(onSuccess, result);
		}, function(error) {
			invokeCallback(onFail, error);
		}, _ID, "<%= projectCamel %>TestInput", { input: input });
	};

	// Asynchronous with sending and returning a JSON object
	_self.<%= projectCamel %>TestAsync = function (input, callback) {
		var success = function (data, response) {
				var json = JSON.parse(data);
				callback(json);
			},
			fail = function (data, response) {
				console.log("Error: " + data);
			};
		exec(success, fail, _ID, "<%= projectCamel %>TestAsync", { input: input });
	};

	// Define a property on the extension object
	// Omit the getter or setter as needed to restrict the property
	Object.defineProperty(_self, "<%= projectCamel %>Property", {
		get: function () {
			var result,
				success = function (data, response) {
					result = data;
				},
				fail = function (data, response) {
					console.log("Error: " + data);
				};
			exec(success, fail, _ID, "<%= projectCamel %>Property", null);
			return result;
		},
		set: function (arg) {
			var result,
				success = function (data, response) {
					result = data;
				},
				fail = function (data, response) {
					console.log("Error: " + data);
				};
			exec(success, fail, _ID, "<%= projectCamel %>Property", {"value": arg });
			return result;
		}
	});

	_self.<%= projectCamel %>StartThread = function (callback) {
		var success = function (data, response) {
				callback(data);
			},
			fail = function (data, response) {
				console.log("Error: " + data);
			};
		exec(success, fail, _ID, "<%= projectCamel %>StartThread", null);
	};

	_self.<%= projectCamel %>StopThread = function (callback) {
			success = function (data, response) {
				callback(data);
			},
			fail = function (data, response) {
				console.log("Error: " + data);
			};
		exec(success, fail, _ID, "<%= projectCamel %>StopThread", null);
	};

module.exports = _self;
