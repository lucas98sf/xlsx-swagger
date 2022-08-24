import { OpenAPIV3 } from 'openapi-types';

export interface Response {
  name: string;
  description?: string;
  content?: string;
  header?: OpenAPIV3.HeaderObject;
  $ref?: string;
}
