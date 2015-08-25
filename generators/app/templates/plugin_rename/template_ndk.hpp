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

#ifndef <%= projectName %>_NDK_HPP_
#define <%= projectName %>_NDK_HPP_

#include <string>
#include <pthread.h>

class <%= projectName %>_JS;

namespace webworks {

class <%= projectName %>_NDK {
public:
	explicit <%= projectName %>_NDK(<%= projectName %>_JS *parent = NULL);
	virtual ~<%= projectName %>_NDK();

	// The extension methods are defined here
	std::string <%= projectCamel %>Test();

	std::string <%= projectCamel %>Test(const std::string& inputString);

	std::string get<%= projectName %>Property();

	void set<%= projectName %>Property(const std::string& inputString);

	void <%= projectCamel %>TestAsync(const std::string& callbackId, const std::string& inputString);

	std::string <%= projectCamel %>StartThread(const std::string& callbackId);

	std::string <%= projectCamel %>StopThread();

	bool isThreadHalt();

	void <%= projectCamel %>ThreadCallback();

private:
	<%= projectName %>_JS *m_pParent;
	int <%= projectCamel %>Property;
	int <%= projectCamel %>ThreadCount;
	bool threadHalt;
	std::string threadCallbackId;
	pthread_t m_thread;
	pthread_cond_t cond;
	pthread_mutex_t mutex;
};

} // namespace webworks

#endif /* <%= projectName %>_NDK_HPP_ */
