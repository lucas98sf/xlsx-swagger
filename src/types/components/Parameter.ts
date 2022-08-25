import { OpenAPIV3 } from 'openapi-types';
import { SchemaRef } from '../helpers';

export type Parameter = {
  parameter: string;
  name: string;
  in: string;
  description: string;
  required: boolean;
  schema$ref?: SchemaRef;
  schemaType?: OpenAPIV3.NonArraySchemaObjectType;
  schemaDefault?: any;
  schemaPattern?: string;
  schemaMaxLength?: number;
  schemaFormat?: string;
  schemaExample?: string;
};
