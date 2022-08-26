import { OpenAPIV3 } from 'openapi-types';
import { SchemaRef } from '../helpers';

export interface Schema {
  schema: string;
  type: 'object';
  description?: string;
  property?: 'string';
  property$ref?: SchemaRef;
  propertyRequired?: boolean;
  propertyType?: OpenAPIV3.NonArraySchemaObjectType;
  propertyDescription?: string;
  propertyFormat?: string;
  propertyPattern?: string;
  propertyExample?: string;
  propertyDefault?: any;
  propertyMaxLength?: number;
  propertyMinLength?: number;
}
