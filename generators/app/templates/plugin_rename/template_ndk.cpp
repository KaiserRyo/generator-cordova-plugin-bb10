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
#include <sstream>
#include <json/reader.h>
#include <json/writer.h>
#include <pthread.h>
#include "<%= projectLower %>_ndk.hpp"
#include "<%= projectLower %>_js.hpp"

namespace webworks {

<%= projectName %>_NDK::<%= projectName %>_NDK(<%= projectName %>_JS *parent):
	m_pParent(parent),
	<%= projectCamel %>Property(50),
	<%= projectCamel %>ThreadCount(1),
	threadHalt(true),
	m_thread(0) {
		cond  = PTHREAD_COND_INITIALIZER;
		mutex = PTHREAD_MUTEX_INITIALIZER;
		m_pParent->getLog()->info("<%= projectName %> Created");
}

<%= projectName %>_NDK::~<%= projectName %>_NDK() {
}

// These methods are the true native code we intend to reach from WebWorks
std::string <%= projectName %>_NDK::<%= projectCamel %>Test() {
	m_pParent->getLog()->debug("testString");
	return "<%= projectName %> Test Function";
}

// Take in input and return a value
std::string <%= projectName %>_NDK::<%= projectCamel %>Test(const std::string& inputString) {
	m_pParent->getLog()->debug("testStringInput");
	return "<%= projectName %> Test Function, got: " + inputString;
}

// Get an integer property
std::string <%= projectName %>_NDK::get<%= projectName %>Property() {
	m_pParent->getLog()->debug("get<%= projectName %>Property");
	stringstream ss;
	ss << <%= projectCamel %>Property;
	return ss.str();
}

// set an integer property
void <%= projectName %>_NDK::set<%= projectName %>Property(const std::string& inputString) {
	m_pParent->getLog()->debug("set<%= projectName %>Property");
	<%= projectCamel %>Property = (int) strtoul(inputString.c_str(), NULL, 10);
}

// Asynchronous callback with JSON data input and output
void <%= projectName %>_NDK::<%= projectCamel %>TestAsync(const std::string& callbackId, const std::string& inputString) {
	m_pParent->getLog()->debug("Async Test");
	// Parse the arg string as JSON
	Json::FastWriter writer;
	Json::Reader reader;
	Json::Value root;
	bool parse = reader.parse(inputString, root);

	if (!parse) {
		m_pParent->getLog()->error("Parse Error");
		Json::Value error;
		error["result"] = "Cannot parse JSON object";
		m_pParent->NotifyEvent(callbackId + " " + writer.write(error));
	} else {
		root["result"] = root["value1"].asInt() + root["value2"].asInt();
		m_pParent->NotifyEvent(callbackId + " " + writer.write(root));
	}
}

// Thread functions
// The following functions are for controlling a Thread in the extension

// The actual thread (must appear before the startThread method)
// Loops and runs the callback method
void* <%= projectName %>Thread(void* parent) {
	<%= projectName %>_NDK *pParent = static_cast<<%= projectName %>_NDK *>(parent);

	// Loop calls the callback function and continues until stop is set
	while (!pParent->isThreadHalt()) {
		sleep(1);
		pParent-><%= projectCamel %>ThreadCallback();
	}

	return NULL;
}

// Starts the thread and returns a message on status
std::string <%= projectName %>_NDK::<%= projectCamel %>StartThread(const std::string& callbackId) {
	if (!m_thread) {
		int rc;
	    rc = pthread_mutex_lock(&mutex);
	    threadHalt = false;
	    rc = pthread_cond_signal(&cond);
	    rc = pthread_mutex_unlock(&mutex);

		pthread_attr_t thread_attr;
		pthread_attr_init(&thread_attr);
		pthread_attr_setdetachstate(&thread_attr, PTHREAD_CREATE_JOINABLE);

		pthread_create(&m_thread, &thread_attr, <%= projectName %>Thread,
				static_cast<void *>(this));
		pthread_attr_destroy(&thread_attr);
		threadCallbackId = callbackId;
		m_pParent->getLog()->info("Thread Started");
		return "Thread Started";
	} else {
		m_pParent->getLog()->warn("Thread Started but already running");
		return "Thread Running";
	}
}

// Sets the stop value
std::string <%= projectName %>_NDK::<%= projectCamel %>StopThread() {
	int rc;
	// Request thread to set prevent sleep to false and terminate
	rc = pthread_mutex_lock(&mutex);
	threadHalt = true;
	rc = pthread_cond_signal(&cond);
	rc = pthread_mutex_unlock(&mutex);

    // Wait for the thread to terminate.
    void *exit_status;
    rc = pthread_join(m_thread, &exit_status) ;

	// Clean conditional variable and mutex
	pthread_cond_destroy(&cond);
	pthread_mutex_destroy(&mutex);

	m_thread = 0;
	threadHalt = true;
	m_pParent->getLog()->info("Thread Stopped");
	return "Thread stopped";
}

// The callback method that sends an event through JNEXT
void <%= projectName %>_NDK::<%= projectCamel %>ThreadCallback() {
	Json::FastWriter writer;
	Json::Value root;
	root["threadCount"] = <%= projectCamel %>ThreadCount++;
	m_pParent->NotifyEvent(threadCallbackId + " " + writer.write(root));
}

// getter for the stop value
bool <%= projectName %>_NDK::isThreadHalt() {
	int rc;
	bool isThreadHalt;
	rc = pthread_mutex_lock(&mutex);
	isThreadHalt = threadHalt;
	rc = pthread_mutex_unlock(&mutex);
	return isThreadHalt;
}

} /* namespace webworks */
