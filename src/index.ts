import SwaggerParser from '@apidevtools/swagger-parser';
import { mapJsonComponents } from './mappers/mapJsonComponents';
import { mapJsonPaths } from './mappers/mapJsonPaths';
import { sheetsToJson, writeJson } from './mappers/sheetsToJson';
// import { validateOpenApiDocument } from './validateOpenApiDocument';

const DEBUG = true; // process.argv.includes('--debug');

const json = sheetsToJson('Onboarding - Contratos.xlsx');
// if (DEBUG) writeJson(json, 'sheet-json.json');

const jsonWithComponents = mapJsonComponents(json);
if (DEBUG) writeJson(jsonWithComponents, 'components.json');

const openApiDocument = mapJsonPaths(jsonWithComponents);
if (DEBUG) writeJson(openApiDocument, 'document.json');

// validateOpenApiDocument(openApiDocument);

SwaggerParser.parse(openApiDocument)
  .then(document => {
    if (DEBUG) writeJson(document, 'validated-document.json');
  })
  .catch(error => {
    console.error(error);
  });
