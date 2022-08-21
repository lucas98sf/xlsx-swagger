import { OpenAPIV3 } from 'openapi-types';

export type Parameter = {
  parameter: string;
  name: string;
  in: string;
  description: string;
  required: boolean;
  $ref?: string;
  schemaType?: OpenAPIV3.NonArraySchemaObjectType;
  schemaFormat?: string;
  schemaExample?: string;
  schemaPattern?: string;
};
