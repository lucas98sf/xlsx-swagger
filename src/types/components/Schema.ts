import { OpenAPIV3 } from 'openapi-types';
import { SchemaRef } from '../helpers';

export interface Schema {
  name: string;
  type: OpenAPIV3.NonArraySchemaObjectType | 'array';
  description?: string;
  property?: SchemaRef; // vai virar array de schemas (properties)
  items?: SchemaRef; // para arrays e enums
  pattern?: string;
  maxLength?: number;
  minLength?: number;
}
