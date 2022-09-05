// import { OpenAPIV3 } from 'openapi-types';

import _ from 'lodash';
import { JsonComponents, JsonObject, JsonSheet } from '../types';
import {
  sanitizeRowData,
  normalizeString,
  upperCaseFirstLetter,
} from '../utils';

export const mapJsonComponents = (
  sheets: JsonSheet[]
): Array<JsonSheet & { components: JsonComponents }> => {
  return sheets.map(sheet => {
    const { name, status, data, response } = sheet;

    const components: JsonComponents = {
      parameters: {},
      requestBodies: {
        [`${name}RequestBody`]: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: [],
                properties: {},
              },
            },
          },
        },
      },
      responses: {
        [`${status}Response${name}`]: {
          description: response,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: [],
                properties: {},
              },
            },
          },
        },
      },
    };

    let componentInfo: string;
    let objectsStack: JsonObject[] = [];
    let mountingRequestBody = false;
    let mountingResponse = false;

    data.forEach(({ key, ...row }) => {
      const { blankA, blankB, ...rowData } = row;

      if (blankA || blankB) {
        const info = normalizeString((blankA || blankB)!);
        if (['entrada', 'payload_body', 'saida'].includes(info))
          componentInfo = info;
        return;
      }

      if (key === '}' || key === ']') {
        if (objectsStack?.length) {
          objectsStack.pop();
          return;
        }
        if (mountingRequestBody) {
          mountingRequestBody = false;
        }
        return;
      }

      if (!componentInfo || !key || ['{', '['].includes(key) || !rowData.type)
        return;

      const sanitizedData = sanitizeRowData(
        { ...rowData, type: rowData.type },
        key,
        sheet.command
      );
      const { required, ...newData } = sanitizedData;
      if (newData.in) Object.assign(newData, { required });

      if (componentInfo === 'entrada') {
        Object.assign(components.parameters, {
          [upperCaseFirstLetter(key)]: newData,
        });
      } else if (componentInfo === 'payload_body') {
        if (!mountingRequestBody && newData.type === 'object') {
          mountingRequestBody = true;
          return;
        }

        const { schema } =
          components.requestBodies[`${name}RequestBody`].content[
            'application/json'
          ];

        if (objectsStack?.length) {
          const lastObject = objectsStack[objectsStack.length - 1];

          if (required)
            lastObject.required = lastObject.required?.length
              ? [...lastObject.required, key]
              : [key];

          const isArray = lastObject.type === 'array';
          const objectItems = isArray ? 'items' : 'properties';
          lastObject[objectItems] = {
            ...lastObject[objectItems],
            ...(isArray
              ? { type: 'object', properties: { [key]: newData } }
              : { [key]: newData }),
          };
        } else {
          if (required)
            schema.required = schema.required?.length
              ? [...schema.required, key]
              : [key];

          schema.properties = {
            ...schema.properties,
            [key]: newData,
          };
        }

        if (['array', 'object'].includes(newData.type!))
          objectsStack = [...objectsStack, newData as JsonObject];
      } else if (componentInfo === 'saida') {
        if (!mountingResponse && newData.type === 'object') {
          mountingResponse = true;
          mountingRequestBody = false;
          objectsStack = [];
          return;
        }

        const { schema } =
          components.responses[`${status}Response${name}`].content[
            'application/json'
          ];

        if (objectsStack?.length) {
          const lastObject = objectsStack[objectsStack.length - 1];

          if (required)
            lastObject.required = lastObject.required?.length
              ? [...lastObject.required, key]
              : [key];

          const isArray = lastObject.type === 'array';
          const objectItems = isArray ? 'items' : 'properties';
          lastObject[objectItems] = {
            ...lastObject[objectItems],
            ...(isArray
              ? { type: 'object', properties: { [key]: newData } }
              : { [key]: newData }),
          };
        } else {
          if (required)
            schema.required = schema.required?.length
              ? [...schema.required, key]
              : [key];

          schema.properties = {
            ...schema.properties,
            [key]: newData,
          };
        }

        if (['array', 'object'].includes(newData.type!))
          objectsStack = [...objectsStack, newData as JsonObject];
      }
    });

    Object.keys(components.requestBodies).forEach(req => {
      const { schema } =
        components.requestBodies[req].content['application/json'];

      if (_.isEmpty(schema.properties)) delete components.requestBodies[req];
      if (!schema.required?.length) delete schema.required;
    });

    return { ...sheet, components };
  });
};
