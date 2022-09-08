import { OpenAPIV3 } from 'openapi-types';
import { JsonComponents, JsonSheet, JsonSheetInfo } from '../types';
import { upperCaseFirstLetter } from '../utils';
import {
  defaultResponseErrorSchema,
  defaultResponses,
  defaultResponsesRefs,
} from './defaultResponses';

export const mapJsonPaths = (
  info: JsonSheetInfo,
  sheets: Array<JsonSheet & { components: JsonComponents }>
): OpenAPIV3.Document => {
  return {
    openapi: '3.0.0',
    info: {
      title: info.title,
      version: info.version,
    },
    servers: info.servers.map(server => ({ url: server })),
    tags: info.tags,
    paths: sheets.reduce((paths, sheet) => {
      const { name, version, tag, api, method, description } = sheet;
      const path = api.replace(`${version}/`, '/')!;
      const operationId = `${upperCaseFirstLetter(name)}`;
      const hasAuth: boolean = Object.keys(sheet.components.parameters).some(
        param => param === 'Authorization'
      );
      // eslint-disable-next-line no-param-reassign
      delete sheet.components.parameters.Authorization;

      return {
        ...paths,
        [path]: {
          ...paths[path],
          [method.toLowerCase()]: {
            operationId,
            description,
            tags: [tag],
            parameters: Object.keys(sheet.components.parameters).map(key => ({
              $ref: `#/components/parameters/${key}`,
            })),
            ...(sheet.components.requestBodies[`${name}RequestBody`]
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
              ...defaultResponsesRefs,
            },
            ...(hasAuth
              ? {
                  security: [
                    {
                      authorization: [],
                    },
                  ],
                }
              : {}),
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
          ...defaultResponses,
        },
        schemas: {
          ...acc.schemas,
          ...(components.schemas as Record<string, OpenAPIV3.SchemaObject>),
          ...defaultResponseErrorSchema,
        },
        securitySchemes: {
          authorization: {
            type: 'apiKey',
            name: 'authorization',
            in: 'header',
          },
        },
      };
    }, {} as OpenAPIV3.ComponentsObject),
  };
};
