import { OpenAPIV3 } from 'openapi-types';
import { JsonSheet } from '../types';
import { mapJsonPaths } from './mapJsonPaths';

export const jsonToOpenApiDocument = (json: JsonSheet): OpenAPIV3.Document => ({
  openapi: '3.0.0',
  info: json.info,
  components: {
    // FIXME talvez padronizar para usar sempre components
    // TODO maperar components
    // schemas: json.schemas,
  },
  servers: json.servers,
  tags: json.tags,
  paths: mapJsonPaths(json.path, {
    'path-tags': json['path-tags'],
    'path-parameters': json['path-parameters'],
    'path-requestBody': json['path-requestBody'],
    'path-responses': json['path-responses'],
    parameters: json.parameters,
  }),
});
