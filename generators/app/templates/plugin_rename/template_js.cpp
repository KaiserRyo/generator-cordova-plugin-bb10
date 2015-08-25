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

#include <string>
#include "../public/tokenizer.h"
#include "<%= projectLower %>_js.hpp"
#include "<%= projectLower %>_ndk.hpp"

using namespace std;

/**
 * Default constructor.
 */
<%= projectName %>_JS::<%= projectName %>_JS(const std::string& id) :
		m_id(id) {
	m_pLogger = new webworks::Logger("<%= projectName %>_JS", this);
	m_p<%= projectName %>Controller = new webworks::<%= projectName %>_NDK(this);
}

/**
 * <%= projectName %>_JS destructor.
 */
<%= projectName %>_JS::~<%= projectName %>_JS() {
	if (m_p<%= projectName %>Controller)
		delete m_p<%= projectName %>Controller;
	if (m_pLogger)
		delete m_pLogger;
}

webworks::Logger* <%= projectName %>_JS::getLog() {
	return m_pLogger;
}

/**
 * This method returns the list of objects implemented by this native
 * extension.
 */
char* onGetObjList() {
	static char name[] = "<%= projectName %>_JS";
	return name;
}

/**
 * This method is used by JNext to instantiate the <%= projectName %>_JS object when
 * an object is created on the JavaScript server side.
 */
JSExt* onCreateObject(const string& className, const string& id) {
	if (className == "<%= projectName %>_JS") {
		return new <%= projectName %>_JS(id);
	}

	return NULL;
}

/**
 * Method used by JNext to determine if the object can be deleted.
 */
bool <%= projectName %>_JS::CanDelete() {
	return true;
}

/**
 * It will be called from JNext JavaScript side with passed string.
 * This method implements the interface for the JavaScript to native binding
 * for invoking native code. This method is triggered when JNext.invoke is
 * called on the JavaScript side with this native objects id.
 */
string <%= projectName %>_JS::InvokeMethod(const string& command) {
	// format must be: "command callbackId params"
	size_t commandIndex = command.find_first_of(" ");
	std::string strCommand = command.substr(0, commandIndex);
	size_t callbackIndex = command.find_first_of(" ", commandIndex + 1);
	std::string callbackId = command.substr(commandIndex + 1, callbackIndex - commandIndex - 1);
	std::string arg = command.substr(callbackIndex + 1, command.length());

	// based on the command given, run the appropriate method in <%= projectLower %>_ndk.cpp
	if (strCommand == "<%= projectCamel %>Test") {
		return m_p<%= projectName %>Controller-><%= projectCamel %>Test();
	} else if (strCommand == "<%= projectCamel %>TestInput") {
		return m_p<%= projectName %>Controller-><%= projectCamel %>Test(arg);
	} else if (strCommand == "<%= projectCamel %>Property") {
		// if arg exists we are setting property
		if (arg != strCommand) {
			m_p<%= projectName %>Controller->set<%= projectName %>Property(arg);
		} else {
			return m_p<%= projectName %>Controller->get<%= projectName %>Property();
		}
	} else if (strCommand == "<%= projectCamel %>TestAsync") {
		m_p<%= projectName %>Controller-><%= projectCamel %>TestAsync(callbackId, arg);
	} else if (strCommand == "<%= projectCamel %>StartThread") {
		return m_p<%= projectName %>Controller-><%= projectCamel %>StartThread(callbackId);
	} else if (strCommand == "<%= projectCamel %>StopThread") {
		return m_p<%= projectName %>Controller-><%= projectCamel %>StopThread();
	}

	strCommand.append(";");
	strCommand.append(command);
	return strCommand;
}

// Notifies JavaScript of an event
void <%= projectName %>_JS::NotifyEvent(const std::string& event) {
	std::string eventString = m_id + " ";
	eventString.append(event);
	SendPluginEvent(eventString.c_str(), m_pContext);
}
