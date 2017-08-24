/*
 * Copyright 2017 data.world, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function getOAuthService() {
    // Create a new service with the given name. The name will be used when
    // persisting the authorized token, so ensure it is unique within the
    // scope of the property store.
    return OAuth2.createService('dw')

    // Set the endpoint URLs, which are the same for all Google services.
        .setAuthorizationBaseUrl('https://data.world/oauth/authorize')
        .setTokenUrl('https://data.world/oauth/access_token')

        // Set the client ID and secret, from the Google Developers Console.
        .setClientId('datastudio')
        .setClientSecret('Wa*&#33;edada4up')

        // Set the name of the callback function in the script referenced
        // above that should be invoked to complete the OAuth flow.
        .setCallbackFunction('authCallback')

        // Set the property store where authorized tokens should be persisted.
        .setPropertyStore(PropertiesService.getUserProperties())

        // Set the scopes to request (space-separated for Google services).
        .setScope('user_api_read');
}