import SwaggerParser from '@apidevtools/swagger-parser';
import { jsonToOpenApiDocument, sheetsToJson, writeJson } from './mappers';
import { validateOpenApiDocument } from './validateOpenApiDocument';

const DEBUG = process.argv.includes('--debug');

const json = sheetsToJson('Template_Swagger_v0.xlsx');
if (DEBUG) writeJson(json, 'sheet-json.json');

const openApiDocument = jsonToOpenApiDocument(json);
if (DEBUG) writeJson(openApiDocument, 'document.json');

validateOpenApiDocument(openApiDocument);

SwaggerParser.parse(openApiDocument)
  .then(document => {
    if (DEBUG) writeJson(document, 'validated-document.json');
  })
  .catch(error => {
    console.error(error);
  });
