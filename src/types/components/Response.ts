import { SchemaRef } from '../helpers';

export interface Response {
  name: string;
  description: string;
  content$ref?: SchemaRef;
  header$ref?: SchemaRef;
}
