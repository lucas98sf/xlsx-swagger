import { OpenAPIV3 } from 'openapi-types';

export type HttpVerb = 'GET' | 'PUT' | 'POST' | 'DELETE' | 'PATCH';
export type Type = OpenAPIV3.NonArraySchemaObjectType | 'array';
export type SchemaRef = `#/components/schemas/${string}`;
export type ParameterRef = `#/components/parameters/${string}`;
export type ResponseRef = `#/components/responses/${string}`;
