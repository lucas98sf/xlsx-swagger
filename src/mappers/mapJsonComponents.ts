// import { OpenAPIV3 } from 'openapi-types';

// import _ from 'lodash';
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
                // required: [],
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
                // required: [],
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

      const newData = sanitizeRowData(
        { ...rowData, type: rowData.type },
        key,
        sheet.command
      );
      const { type, required } = newData;

      if (componentInfo === 'entrada') {
        Object.assign(components.parameters, {
          [upperCaseFirstLetter(key)]: newData,
        });
      } else if (componentInfo === 'payload_body') {
        if (!mountingRequestBody) {
          if (type === 'object') {
            mountingRequestBody = true;
          }
          return;
        }

        const { schema } =
          components.requestBodies[`${name}RequestBody`].content[
            'application/json'
          ];

        /// //////////////////////////
        if (type === 'array' || type === 'object') {
          if (objectsStack?.length) {
            const lastObject = objectsStack[objectsStack.length - 1];

            const objectItems =
              lastObject.type === 'object' ? 'properties' : 'items';

            lastObject[objectItems] = {
              ...lastObject[objectItems],
              [key]: newData,
            };

            objectsStack.push(newData as JsonObject);
          } else {
            schema.properties = {
              ...schema.properties,
              [key]: newData,
            };

            objectsStack = [newData as JsonObject];
          }
        } else if (objectsStack?.length) {
          const lastObject = objectsStack[objectsStack.length - 1];

          const objectItems =
            lastObject.type === 'object' ? 'properties' : 'items';

          lastObject[objectItems] = {
            ...lastObject[objectItems],
            [key]: newData,
          };
        } else {
          schema.properties = {
            ...schema.properties,
            [key]: newData,
          };
        }
        /// //////////////////////////
      } else if (componentInfo === 'saida') {
        if (!mountingResponse) {
          if (type === 'object') {
            mountingResponse = true;
            mountingRequestBody = false;
            objectsStack = [];
          }
          return;
        }

        const { schema } =
          components.responses[`${status}Response${name}`].content[
            'application/json'
          ];

        /// //////////////////////////
        if (type === 'array' || type === 'object') {
          if (objectsStack?.length) {
            const lastObject = objectsStack[objectsStack.length - 1];

            const objectItems =
              lastObject.type === 'object' ? 'properties' : 'items';

            lastObject[objectItems] = {
              ...lastObject[objectItems],
              [key]: newData,
            };

            objectsStack.push(newData as JsonObject);
          } else {
            schema.properties = {
              ...schema.properties,
              [key]: newData,
            };

            objectsStack = [newData as JsonObject];
          }
        } else if (objectsStack?.length) {
          const lastObject = objectsStack[objectsStack.length - 1];

          const objectItems =
            lastObject.type === 'object' ? 'properties' : 'items';

          lastObject[objectItems] = {
            ...lastObject[objectItems],
            [key]: newData,
          };
        } else {
          schema.properties = {
            ...schema.properties,
            [key]: newData,
          };
        }
        /// //////////////////////////
      }
    });
    return { ...sheet, components };
  });
};
