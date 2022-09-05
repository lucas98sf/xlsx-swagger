export type JsonSheetPathData = {
  blankA?: string;
  blankB?: string;
  key?: string;
  type?: string;
  param?: string;
  required?: string;
  enumItems?: string;
};

export type JsonSheet = {
  name: string;
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

export type JsonComponents = {
  parameters: {
    [name: string]: {
      name: string;
      in: 'query' | 'path' | 'header';
      schema: JsonObject;
    };
  };
  requestBodies: {
    [name: string]: {
      content: {
        'application/json': {
          schema: JsonObject;
        };
      };
    };
  };
  responses: {
    [name: string]: {
      description: string;
      content: {
        'application/json': {
          schema: JsonObject;
        };
      };
    };
  };
};
