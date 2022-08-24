import { OpenAPIV3 } from 'openapi-types';
import { SchemaRef } from '../helpers';

export type Parameter = {
  parameter: string;
  name: string;
  in: string;
  description: string;
  required: boolean;
  $ref?: SchemaRef;
  schemaType?: OpenAPIV3.NonArraySchemaObjectType;
  schemaFormat?: string;
  schemaExample?: string;
  schemaPattern?: string;
};
