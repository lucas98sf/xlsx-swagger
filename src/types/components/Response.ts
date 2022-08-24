import { SchemaRef } from '../helpers';

export interface Response {
  name: string;
  description: string;
  content?: SchemaRef;
  header?: SchemaRef;
}
