import { Type } from './helpers';

export interface Schema {
  property: string;
  type: Type;
  description: string;
}

export interface SchemaData {
  'schema-type': string;
  'schema-pattern': string;
  'schema-maxLenght': number;
}
