// import { OpenAPIV3 } from 'openapi-types';

export interface JsonSheet {
  info: Info;
  servers: Server[];
  tags: Tag[];
  parameters: Parameter[];
  schemas: Schema[];
  responses: [];
  path: Path[];
  'path-tags': PathTags[];
  'path-requestBody': PathRequestBody[];
  'path-parameters': PathParameter[];
  'path-responses': PathResponse[];
}

type Verb = 'GET' | 'PUT' | 'POST' | 'DELETE' | 'PATCH';
type Type = 'boolean' | 'object' | 'number' | 'string' | 'integer' | 'array';

interface Info {
  title: string;
  description: string;
  version: string;
}

interface Server {
  url: string;
  description: string;
}

interface Tag {
  name: string;
  description: string;
}

interface Parameter {
  parameter: string;
  name: string;
  in: string;
  description: string;
  required: boolean;
  'schema-type': string;
  'schema-pattern': string;
  'schema-maxLenght': number;
}

interface Schema {
  property: string;
  type: Type;
  description: string;
}

interface Path {
  api: string;
  verb: Verb;
  summary: string;
  description: string;
}

interface PathTags {
  api: string;
  verb: Verb;
  tags: string;
}

interface PathRequestBody {
  api: string;
  verb: Verb;
  ref?: string;
}

interface PathParameter {
  api: string;
  verb: Verb;
  ref?: string;
}

interface PathResponse {
  api: string;
  verb: Verb;
  ref?: string;
  property: string;
  type: Type;
  description: string;
  property_1?: string;
  type_1?: string;
  description_1?: string;
  property_2?: string;
  type_2?: string;
  description_2?: string;
  property_3?: string;
  type_3?: string;
  description_3?: string;
  property_4?: string;
  type_4?: string;
  description_4?: string;
  property_5?: string;
  type_5?: string;
  description_5?: string;
}
