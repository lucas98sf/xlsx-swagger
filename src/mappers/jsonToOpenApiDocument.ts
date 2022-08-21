import { OpenAPIV3 } from 'openapi-types';
import { mapJsonParameter } from './mapJsonParameters';
import { JsonSheet } from '../types/JsonSheet';
import { mapJsonPaths } from './mapJsonPaths';

export const jsonToOpenApiDocument = (json: JsonSheet): OpenAPIV3.Document => ({
  openapi: '3.0.0',
  info: json.info,
  components: {
    // FIXME talvez padronizar para usar sempre components
    // TODO maperar components
    // schemas: json.schemas,
    parameters: mapJsonParameter(json.parameters),
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
