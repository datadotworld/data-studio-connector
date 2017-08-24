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
    var config = {
        configParams: [
            {
                type: 'INFO',
                name: 'intro',
                text: 'Enter the dataset or project URL below ' +
                '(e.g. https://data.world/jonloyens/an-intro-to-dataworld-dataset), ' +
                'and a SQL query to pull the data you need for your report.'
            },
            {
                type: 'TEXTINPUT',
                name: 'dataset',
                displayName: 'Dataset or Project URL',
                helpText: 'Copy and paste the dataset or project URL here.',
                placeholder: 'https://data.world/jonloyens/an-intro-to-dataworld-dataset'
            },
            {
                type: 'TEXTAREA',
                name: 'sqlQuery',
                displayName: 'SQL Query',
                helpText: 'Enter the query to be used for fetching data from data.world.'
            }
        ],
        dateRangeRequired: false
    };
    return config;
}

function getSchema(request) {
    var datasetKey = request.configParams.dataset;
    var sqlQuery = request.configParams.sqlQuery;

    var tableSchema = toTableSchema(sql(datasetKey, sqlQuery)[0]);
    return {'schema': tableSchema};
}

function getData(request) {

    var datasetKey = request.configParams.dataset;
    var sqlQuery = request.configParams.sqlQuery;

    if (request.scriptParams) {
        var lastRefresh = request.scriptParams.lastRefresh;
        var sampleExtraction = request.scriptParams.sampleExtraction;
    }

    var requestFields = request.fields.map(function (field) {
        return field.name;
    });

    return toDataResponse(requestFields, sql(
        datasetKey,
        sqlQuery,
        lastRefresh,
        sampleExtraction
    ));
}

function getAuthType() {
    return {'type': 'OAUTH2'};
}

function isAdminUser() {
    return Session.getActiveUser().getEmail().endsWith('@data.world');
}

function isAuthValid() {
    var service = getOAuthService();
    if (service === null) {
        return false;
    }
    return service.hasAccess();
}

function get3PAuthorizationUrls() {
    var service = getOAuthService();
    if (service == null) {
        return '';
    }
    return service.getAuthorizationUrl();
}

function authCallback(request) {
    var authorized = getOAuthService().handleCallback(request);
    if (authorized) {
        return HtmlService.createHtmlOutput('<script>if (window.top) { window.top.close(); }</script>Success! You can close this tab.');
    } else {
        return HtmlService.createHtmlOutput('Denied. You can close this tab');
    }
}

function resetAuth() {
    var service = getOAuthService()
    service.reset();
}