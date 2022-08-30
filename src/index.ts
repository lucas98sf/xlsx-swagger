// import SwaggerParser from '@apidevtools/swagger-parser';
import { sheetsToJson, writeJson } from './mappers/sheetsToJson';
// import { validateOpenApiDocument } from './validateOpenApiDocument';

const DEBUG = true; // process.argv.includes('--debug');

const json = sheetsToJson('Onboarding - Contratos.xlsx');
if (DEBUG) writeJson(json, 'sheet-json.json');

// const openApiDocument = jsonToOpenApiDocument(json);
// if (DEBUG) writeJson(openApiDocument, 'document.json');

// validateOpenApiDocument(openApiDocument);

// SwaggerParser.parse(openApiDocument)
//   .then(document => {
//     if (DEBUG) writeJson(document, 'validated-document.json');
//   })
//   .catch(error => {
//     console.error(error);
//   });
