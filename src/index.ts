import fs from 'fs';
import YAML from 'yaml';
import { mapJsonComponents } from './mappers/mapJsonComponents';
import { mapJsonPaths } from './mappers/mapJsonPaths';
import { sheetsToJson, writeJson } from './mappers/sheetsToJson';
import { validateOpenApiDocument } from './validateOpenApiDocument';

const DEBUG = process.argv.includes('--debug');

const [info, json] = sheetsToJson('Onboarding - Contratos.xlsx');
if (DEBUG) {
  writeJson(info, 'sheet-info.json');
  writeJson(json, 'sheet-json.json');
}

const jsonWithComponents = mapJsonComponents(json);
if (DEBUG) writeJson(jsonWithComponents, 'components.json');

const openApiDocument = mapJsonPaths(info, jsonWithComponents);
if (DEBUG) writeJson(openApiDocument, 'document.json');

validateOpenApiDocument(openApiDocument);

fs.writeFileSync(
  'generated/openapi.yaml',
  YAML.stringify(openApiDocument, {
    aliasDuplicateObjects: false,
    sortMapEntries: true,
  })
);
console.log('OpenAPI document generated successfully!');
