import { Schema } from './Schema';
import { Parameter, Path, PathData } from './Path';

export interface JsonSheet extends PathData {
  info: Info;
  servers: Server[];
  tags: Tag[];
  schemas: Schema[];
  parameters: Parameter[];
  path: Path[];
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
