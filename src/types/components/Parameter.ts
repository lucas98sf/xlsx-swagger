import { OpenAPIV3 } from 'openapi-types';
import { ParameterRef } from '../helpers';

export type Parameter = {
  parameter: string;
  name: string;
  in: string;
  description: string;
  required: boolean;
  $ref?: ParameterRef;
  schemaType?: OpenAPIV3.NonArraySchemaObjectType;
  schemaFormat?: string;
  schemaExample?: string;
  schemaPattern?: string;
};
