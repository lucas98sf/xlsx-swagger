import fs from 'fs';
import YAML from 'yaml';
import { mapJsonComponents } from './mappers/mapJsonComponents';
import { mapJsonPaths } from './mappers/mapJsonPaths';
import { sheetsToJson, writeJson } from './mappers/sheetsToJson';
import { validateOpenApiDocument } from './validateOpenApiDocument';

const DEBUG = process.argv.includes('--debug');

const json = sheetsToJson('Onboarding - Contratos.xlsx');
if (DEBUG) writeJson(json, 'sheet-json.json');

const jsonWithComponents = mapJsonComponents(json);
if (DEBUG) writeJson(jsonWithComponents, 'components.json');

const openApiDocument = mapJsonPaths(jsonWithComponents);
if (DEBUG) writeJson(openApiDocument, 'document.json');

validateOpenApiDocument(openApiDocument);

const yaml = new YAML.Document(openApiDocument);
fs.writeFileSync('generated/openapi.yaml', yaml.toString());
console.log('OpenAPI document generated successfully!');
