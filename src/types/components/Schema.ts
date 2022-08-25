import { OpenAPIV3 } from 'openapi-types';
import { SchemaRef } from '../helpers';

export interface Schema {
  name: string;
  type: 'object';
  description?: string;
  property?: 'string';
  property$ref?: SchemaRef;
  propertyType?: OpenAPIV3.NonArraySchemaObjectType;
  propertyDefault?: any;
  propertyPattern?: string;
  propertyExample?: string;
  propertyMinLength?: number;
  propertyMaxLength?: number;
  propertyFormat?: string;
}
