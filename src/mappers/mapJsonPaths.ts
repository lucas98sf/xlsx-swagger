import { OpenAPIV3 } from 'openapi-types';
import { JsonComponents, JsonSheet } from '../types';
import { upperCaseFirstLetter } from '../utils';

export const mapJsonPaths = (
  sheets: Array<JsonSheet & { components: JsonComponents }>
): OpenAPIV3.Document => {
  return {
    openapi: '3.0.0',
    info: {
      title: 'APIsXSwagger',
      version: '1.0.0',
    },
    paths: sheets.reduce((paths, sheet) => {
      const { name, version, api, method, description } = sheet;
      const path = api.replace(`${version}/`, '/')!;
      const operationId = `${upperCaseFirstLetter(name)}`;
      return {
        ...paths,
        [path]: {
          ...paths[path],
          [method.toLowerCase()]: {
            operationId,
            description,
            parameters: Object.keys(sheet.components.parameters).map(key => ({
              $ref: `#/components/parameters/${key}`,
            })),
            ...(method.toLowerCase() !== 'get'
              ? {
                  requestBody: {
                    $ref: `#/components/requestBodies/${name}RequestBody`,
                  },
                }
              : {}),
            responses: {
              [sheet.status]: {
                $ref: `#/components/responses/${sheet.status}Response${name}`,
              },
            },
          },
        },
      };
    }, {} as OpenAPIV3.PathsObject),
    components: sheets.reduce((acc, { components }) => {
      return {
        parameters: {
          ...acc.parameters,
          ...(components.parameters as Record<
            string,
            OpenAPIV3.ParameterObject
          >),
        },
        requestBodies: {
          ...acc.requestBodies,
          ...(components.requestBodies as Record<
            string,
            OpenAPIV3.RequestBodyObject
          >),
        },
        responses: {
          ...acc.responses,
          ...(components.responses as Record<string, OpenAPIV3.ResponseObject>),
        },
      };
    }, {} as OpenAPIV3.ComponentsObject),
  };
};
