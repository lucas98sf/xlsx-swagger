import { OpenAPIV3 } from 'openapi-types';

export type HttpVerb = 'GET' | 'PUT' | 'POST' | 'DELETE' | 'PATCH';
export type Type = OpenAPIV3.NonArraySchemaObjectType | 'array';
