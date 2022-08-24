import { SchemaRef, Type } from '../helpers';

export interface Schema {
  name: string;
  description?: string;
  property: SchemaRef; // vai virar array de schemas (properties)
  type: Type;
  item?: string; // para arrays e enums
  pattern?: string;
  maxLength?: number;
  minLength?: number;
}
