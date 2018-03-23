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

function getConfig(request) {
    console.log("getConfig start");
    var config = {
        configParams: [
            {
                type: 'INFO',
                name: 'intro',
                text: 'Enter the dataset or project URL below and a SQL query to pull ' +
                'the data you need for your report. Looking for inspiration? Check ' +
                'out this example: https://datastudio.google.com/open/0BzNwSTjlzSe8Umw1bmQ4UGVobVU'
            },
            {
                type: 'TEXTINPUT',
                name: 'dataset',
                displayName: 'Dataset or Project URL',
                helpText: 'Copy and paste the dataset or project URL here (e.g. https://data.world/jonloyens/intermediate-data-world).',
                placeholder: 'https://data.world/jonloyens/an-intro-to-dataworld-dataset'
            },
            {
                type: 'TEXTAREA',
                name: 'sqlQuery',
                displayName: 'SQL Query (max 10Mb)',
                helpText: 'Enter the query to be used for fetching data from data.world (e.g. SELECT * FROM shootingscitystate). Use aggregations if needed to limit resulting data to 10Mb (Google Data Studio\'s limit)'
            }
        ],
        dateRangeRequired: false
    };
    console.log("getConfig end");
    return config;
}

function getSchema(request) {
    console.log("getSchema start");
    var datasetKey = request.configParams.dataset;
    var sqlQuery = request.configParams.sqlQuery;

    var tableSchema = toTableSchema(sql(datasetKey, sqlQuery)[0]);

    console.log("getSchema end");
    return {'schema': tableSchema};
}

function getData(request) {
    console.log("getData start");
    var datasetKey = request.configParams.dataset;
    var sqlQuery = request.configParams.sqlQuery;

    if (request.scriptParams) {
        var lastRefresh = request.scriptParams.lastRefresh;
        var sampleExtraction = request.scriptParams.sampleExtraction;
    }

    var requestFields = request.fields.map(function (field) {
        return field.name;
    });

    var dataResponse = toDataResponse(requestFields, sql(
        datasetKey,
        sqlQuery,
        lastRefresh,
        sampleExtraction
    ));

    console.log("getData end");
    return dataResponse;
}

function getAuthType() {
    console.log("getAuthType call");
    return {'type': 'OAUTH2'};
}

function isAdminUser() {
    console.log("getAdminUser start");
    var userEmail = Session.getActiveUser().getEmail();
    var isAdmin = (userEmail && (userEmail.indexOf("@data.world") !== -1 ||
        userEmail === "rafael.truman@gmail.com"));
    console.log("getAdminUser end");
    return isAdmin;
}

function isAuthValid() {
    console.log("isAuthValid start");
    var service = getOAuthService();
    if (service === null) {
        console.log("isAuthValid end - no auth service");
        return false;
    }
    var hasAccess = service.hasAccess();
    console.log("isAuthValid end");
    return hasAccess;
}

function get3PAuthorizationUrls() {
    console.log("get3PAuthorizationUrls start");
    var service = getOAuthService();
    if (service === null) {
        console.log("get3PAuthorizationUrls end - no auth service");
        return '';
    }
    var authorizationUrl = service.getAuthorizationUrl();
    console.log("get3PAuthorizationUrls end");
    return authorizationUrl;
}

function authCallback(request) {
    console.log("authCallback start");
    var authorized = getOAuthService().handleCallback(request);
    if (authorized) {
        console.log("authCallback end - authorized");
        return HtmlService.createHtmlOutput('<script>if (window.top) { window.top.close(); }</script>Success! You can close this tab.');
    } else {
        console.log("authCallback end - not authorized");
        return HtmlService.createHtmlOutput('Denied. You can close this tab');
    }
}

function resetAuth() {
    console.log("resetAuth start");
    var service =  OAuth2.createService('dw')
        .setPropertyStore(PropertiesService.getUserProperties());
    if (service !== null) {
        service.reset();
    }
    console.log("resetAuth end");
}
