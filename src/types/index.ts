export type JsonSheetPathData = {
  blankA?: string;
  blankB?: string;
  key?: string;
  type?: string;
  param?: string;
  required?: string;
  enumItems?: string;
};

export type JsonSheetInfo = {
  title: string;
  version: string;
  description: string;
  servers: string[];
  tags: {
    name: string;
    description: string;
  }[];
};

export type JsonSheet = {
  name: string;
  tag: string;
  command: string;
  version: string;
  api: string;
  method: string;
  description: string;
  response: string;
  status: number;
  data: JsonSheetPathData[];
};

export type JsonObject = {
  type: 'object' | 'array';
  items?: object;
  properties?: object;
  required?: string[];
};

export type Ref = {
  $ref: string;
};

export type JsonComponents = {
  schemas: {
    [key: string]: Partial<JsonObject>;
  };
  parameters: {
    [name: string]: {
      name: string;
      in: 'query' | 'path' | 'header';
      schema: Ref;
    };
  };
  requestBodies: {
    [name: string]: {
      content: {
        'application/json': {
          schema: Ref;
        };
      };
    };
  };
  responses: {
    [name: string]: {
      description: string;
      content: {
        'application/json': {
          schema: Ref;
        };
      };
    };
  };
};
