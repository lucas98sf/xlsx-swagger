import { Type } from './helpers';

export interface Schema {
  name: string;
  description?: string;
  property: string; // vai virar array de schemas (properties)
  type: Type;
  item?: string; // para arrays e enums
  pattern?: string;
  maxLength?: number;
  minLength?: number;
}
