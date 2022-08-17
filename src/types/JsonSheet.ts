// import { OpenAPIV3 } from 'openapi-types';

type Verb = 'GET' | 'PUT' | 'POST' | 'DELETE' | 'PATCH';
type Type = 'boolean' | 'object' | 'number' | 'string' | 'integer' | 'array';

export interface JsonSheet {
  info: Info;
  servers: Server[];
  tags: Tag[];
  parameters: Parameter[];
  schemas: Schema[];
  // responses: []; //? usar isso ao invés do path-responses?
  path: Path[];
  'path-tags': PathTags[];
  'path-requestBody': PathRequestBody[];
  'path-parameters': PathParameter[];
  'path-responses': PathResponse[];
}

export type PathData = PathTags | PathRequestBody | PathParameter | PathResponse;

export interface Path {
  api: string;
  verb: Verb;
  summary: string;
  description: string;
}

export interface PathResponse {
  api: string;
  verb: Verb;
  ref: string; // FIXME usar apenas ref?
  property?: string;
  type?: Type;
  description?: string;
  status?: number; // TODO adicionar no excel
}

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

interface PathTags {
  api: string;
  verb: Verb;
  tags: string; // FIXME deveria ser 'tag'?
}

interface PathRequestBody {
  api: string;
  verb: Verb;
  ref: string;
}

interface PathParameter {
  api: string;
  verb: Verb;
  ref: string;
}
