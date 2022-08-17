import * as xlsx from 'xlsx';
import fs from 'fs';
import SwaggerParser from '@apidevtools/swagger-parser';
import { OpenAPIV3 } from 'openapi-types';
import validateSheet, { JsonSheet } from './types/JsonSheet.validator';
import { PathData, PathResponse } from './types/JsonSheet';

const workbook = xlsx.readFile('Template_Swagger_v0.xlsx');

try {
  const sheetsAsJson = validateSheet(
    Object.entries(workbook.Sheets).reduce((json, [sheet, worksheet]) => {
      const jsonSheet = xlsx.utils.sheet_to_json(worksheet);
      const sheetData = {
        [sheet]: sheet === 'info' ? jsonSheet[0] : jsonSheet,
      };
      Object.assign(json, sheetData);
      return json;
    }, {})
  );
  // console.log(JSON.stringify(sheetsAsJson, null, 2));
  fs.writeFileSync('output.json', JSON.stringify(sheetsAsJson, null, 2));
} catch (error: unknown) {
  console.error('Erro no excel:', (error as Error).message.split('\n')[0]);
  process.exit(1);
}

const json = JSON.parse(fs.readFileSync('output.json', 'utf8')) as JsonSheet;

const paths = json.path.reduce<OpenAPIV3.PathsObject>((acc, path) => {
  const isFromPath = (data: PathData) => data.api === path.api && data.verb === path.verb;

  const getRef = (dataWithPathInfo: Partial<PathData & { ref: string }>) => {
    const { ref } = dataWithPathInfo;
    return { $ref: ref };
  };

  const getPathResponses = (obj: OpenAPIV3.ResponsesObject, res: PathResponse) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { status, ref, api, verb, ...data } = res; // FIXME implementado apenas pra $ref
    const result = { $ref: ref }; // ref ? { $ref: ref } : data;
    return { ...obj, [status || '200']: result };
  };

  const pattern: string = path.api;
  const pathOperation = OpenAPIV3.HttpMethods[path.verb];

  const operationObject = {
    summary: path.summary,
    description: path.description,
    tags: json['path-tags'].flatMap(tag => (isFromPath(tag) ? [tag.tags] : [])),
    parameters: json['path-parameters'].filter(isFromPath).map(getRef),
    requestBody: json['path-requestBody'].filter(isFromPath).map(getRef).shift(),
    responses: json['path-responses'].filter(isFromPath).reduce(getPathResponses, {}),
  } as OpenAPIV3.OperationObject;

  return { ...acc, [pattern]: { ...acc[pattern], [pathOperation]: operationObject } };
}, {});

const mappedJson: OpenAPIV3.Document = {
  openapi: '3.0.0',
  info: json.info,
  components: {
    // FIXME talvez padronizar para usar sempre components
    // TODO maperar components
    // schemas: json.schemas,
    // parameters: json.parameters,
  },
  servers: json.servers,
  tags: json.tags,
  paths,
};

console.log(JSON.stringify(mappedJson, null, 2));

SwaggerParser.validate(mappedJson, { resolve: { external: false } }, (err, api) => {
  if (err) {
    console.error(err);
  } else {
    console.log(api);
    // console.log('API name: %s, Version: %s', api.info.title, api.info.version);
  }
});
