import { OpenAPIV3 } from 'openapi-types';
import { mapJsonParameters } from './mapJsonParameters';
import { mapJsonSchemas } from './mapJsonSchemas';
import { mapJsonResponses } from './mapJsonResponses';
import { JsonSheet } from '../types/JsonSheet';
import { mapJsonPaths } from './mapJsonPaths';

export const jsonToOpenApiDocument = (json: JsonSheet): OpenAPIV3.Document => ({
  openapi: '3.0.0',
  info: json.info,
  components: {
    schemas: mapJsonSchemas(json.schemas),
    parameters: mapJsonParameters(json.parameters),
    responses: mapJsonResponses(json.responses),
  },
  servers: json.servers,
  tags: json.tags,
  paths: mapJsonPaths(json.path, {
    'path-tags': json['path-tags'],
    'path-parameters': json['path-parameters'],
    'path-requestBody': json['path-requestBody'],
    'path-responses': json['path-responses'],
  }),
});
