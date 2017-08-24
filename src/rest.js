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

var cachedResponseLastRefresh = null;
var cachedResponse = null;

function sql(datasetKey, sqlQuery, lastRefresh, sampleExtraction) {
    if (!(lastRefresh && cachedResponseLastRefresh) ||
        (lastRefresh > cachedResponseLastRefresh)) {
        var params = {
            'method': 'post',
            'headers': {
                'Accept': 'application/x-ndjson',
                'Authorization': 'Bearer ' + getOAuthService().getAccessToken()
            },
            'payload': {
                'query': sqlQuery
            }
        };

        var response = UrlFetchApp.fetch(getSqlEndpoint(datasetKey), params);
        if (response.getResponseCode() === 200) {
            cachedResponse = response;
            cachedResponseLastRefresh = lastRefresh;
        }
    }

    if (sampleExtraction) {
        // Schema extraction includes 1 schema row + 10 rows of data
        return parseNdJson(cachedResponse.getContentText(), 11);
    } else {
        return parseNdJson(cachedResponse.getContentText());
    }
}

var datasetRegex = /^(https?:\/\/data\.world\/)?(.+\/.+)$/;

function getSqlEndpoint(dataset) {
    var normalizedDatasetKey = dataset.match(datasetRegex)[2];
    return 'https://api.data.world/v0/sql/' + normalizedDatasetKey + '?includeTableSchema=true';
}

function parseNdJson(text, sampleSize) {
    var textLines = text.split(/\r?\n/);

    sampleSize = sampleSize || textLines.length;

    return textLines.slice(0, sampleSize).map(JSON.parse);
}