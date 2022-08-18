import { Path, PathData } from './Path';
import { Schema, SchemaData } from './Schema';

export interface JsonSheet extends PathData {
  info: Info;
  servers: Server[];
  tags: Tag[];
  parameters: Parameter[];
  schemas: Schema[];
  path: Path[];
  // responses: []; //? usar isso ao invés do path-responses?
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

interface Parameter extends SchemaData {
  parameter: string;
  name: string;
  in: string;
  description: string;
  required: boolean;
}
