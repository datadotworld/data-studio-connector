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

function toDataResponse(requestFields, rows) {
    var fullTableSchema = toTableSchema(rows[0]);

    var filteredTableSchema = [];
    fullTableSchema.forEach(function (field) {
        if (requestFields.indexOf(field.name) > -1) {
            filteredTableSchema.push(field);
        }
    });

    var filteredFieldNames = []
    filteredTableSchema.forEach(function (field) {
        filteredFieldNames.push(field.name);
    });

    var tableData = rows.slice(1);
    return {
        'schema': filteredTableSchema,
        'rows': tableData.map(function (row) {
            return toRowResponse(filteredFieldNames, row);
        })
    };
}

function toRowResponse(fieldNames, row) {
    return {
        'values': fieldNames.map(function (field) {
            return row[field];
        })
    };
}

function toTableSchema(schemaRow) {
    return schemaRow.fields.map(toField);
}

function toField(tableSchemaField) {
    switch (tableSchemaField.type) {
        case 'boolean':
            ftype = 'BOOLEAN';
            break;
        case 'number':
        case 'integer':
            ftype = 'NUMBER';
            break;
        default:
            ftype = 'STRING';
    }

    return {
        'name': tableSchemaField.name,
        'label': tableSchemaField.title ? tableSchemaField.title : tableSchemaField.name,
        'dataType': ftype
    }
}