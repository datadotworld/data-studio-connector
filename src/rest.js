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

function sql(datasetKey, sqlQuery, lastRefresh, sampleExtraction) {
    var params = {
        method: 'post',
        headers: {
            'Accept': 'application/x-ndjson',
            'Authorization': 'Bearer ' + getOAuthService().getAccessToken()
        },
        payload: {
            'query': sqlQuery
        },
        muteHttpExceptions: true
    };

    var lock = LockService.getUserLock();

    try {
        lock.waitLock(180000); //3 minutes lock timeout
    } catch (e) {
        var errorObj = new Error(e.message);
        logConnectorError(errorObj, "Could not obtain lock after 3 minutes. Dataset: " + datasetKey +
            ". Query: " + sqlQuery + ". Auth valid status: " + isAuthValid() + ".");
        throwConnectorError("Server is too busy, please refresh after some time", true);
    }
    var response = UrlFetchApp.fetch(getSqlEndpoint(datasetKey), params);
    lock.releaseLock();
     
    if (response.getResponseCode() === 200) {
        if (sampleExtraction) {
            // Schema extraction includes 1 schema row + 10 rows of data
            return parseNdJson(response.getContentText(), 11);
        } else {
            return parseNdJson(response.getContentText());
        }
    } else {
        if (response.getResponseCode() === 401) {
            resetAuth();
        }

        var errorResponse = null;
        try {
            errorResponse = JSON.parse(response.getContentText());
        } catch (e) {
            errorResponse = {code: response.getResponseCode()};
        }
        var errorObj = new Error(errorResponse.message || errorResponse.code);
        logConnectorError(errorObj, "Unable to execute query. Dataset: " + datasetKey +
            ". Query: " + sqlQuery + ". Auth valid status: " + isAuthValid() + ".");
        throwConnectorError("Unable to execute query (error: " + errorObj.message + "). " +
            "Please check your connection and verify that query is correct.", true);
    }
}

var datasetRegex = /^(https?:\/\/[a-z0-9-.]*data\.world\/)?(.+\/.+)$/;

function getSqlEndpoint(dataset) {
    var match = dataset.match(datasetRegex);
    
    // This error will throw if the regex fails due to varied dataset URLs
    if (match) {
        var normalizedDatasetKey = match[2];

        return 'https://api.data.world/v0/sql/' + normalizedDatasetKey + '?includeTableSchema=true';
    } else {
        console.log("Dataset key extraction failed.");
        return null;
    }
}

function parseNdJson(text, sampleSize) {
    var textLines = text.split(/\r?\n/);

    sampleSize = sampleSize || textLines.length;

    return textLines.slice(0, sampleSize).map(function (line, index) {
        try {
            return JSON.parse(line);
        } catch (error) {
            console.error('Error parsing line ' + (index + 1) + ':', error.message);
            return null; // Return null for lines that fail to parse
        }
    }).filter(function (line) {
        // Filter out null values resulting from parsing errors
        return line !== null;
    });
}
