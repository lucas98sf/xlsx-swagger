import _ from 'lodash';
import { JsonComponents, JsonObject, JsonSheet } from '../types';
import {
  sanitizeRowData,
  normalizeString,
  upperCaseFirstLetter,
} from '../utils';

type ComponentsInfo = {
  info: {
    componentType?: string | undefined;
    objectsStack: JsonObject[];
    isMountingRequest: boolean;
    isMountingResponse: boolean;
  };
};

const removeEmptyObjects = (
  components: JsonComponents & ComponentsInfo
): JsonComponents => {
  const { info, ...componentsData } = components;
  Object.keys(componentsData.schemas).forEach(key => {
    const schema = componentsData.schemas[key];

    if (_.isEmpty(schema.properties)) {
      delete componentsData.schemas[key];
      delete componentsData.requestBodies[key];
      delete componentsData.responses[key];
    }
    if (!schema.required?.length) delete schema.required;
  });
  return componentsData;
};

export const mapJsonComponents = (
  sheets: JsonSheet[]
): Array<JsonSheet & { components: JsonComponents }> => {
  return sheets.map(sheet => {
    const { name, status, data, response } = sheet;

    const initialComponentsData: JsonComponents & ComponentsInfo = {
      parameters: {},
      requestBodies: {
        [`${name}RequestBody`]: {
          content: {
            'application/json': {
              schema: { $ref: `#/components/schemas/${name}RequestBody` },
            },
          },
        },
      },
      responses: {
        [`${status}Response${name}`]: {
          description: response,
          content: {
            'application/json': {
              schema: { $ref: `#/components/schemas/${status}Response${name}` },
            },
          },
        },
      },
      schemas: {
        [`${name}RequestBody`]: {},
        [`${status}Response${name}`]: {},
      },
      info: {
        isMountingRequest: false,
        isMountingResponse: false,
        componentType: undefined,
        objectsStack: [],
      },
    };

    const components = data.reduce((acc, { key, ...row }) => {
      const { blankA, blankB, ...rowData } = row;
      const { componentType, objectsStack } = acc.info;

      if (blankA || blankB) {
        const info = normalizeString((blankA || blankB)!);
        if (['entrada', 'payload_body', 'saida'].includes(info))
          acc.info.componentType = info;
        return acc;
      }

      if (key === '}' || key === ']') {
        if (objectsStack?.length) objectsStack.pop();
        return acc;
      }

      if (!componentType || !key || ['{', '['].includes(key) || !rowData.type)
        return acc;

      const sanitizedData = sanitizeRowData(
        { ...rowData, type: rowData.type },
        key,
        sheet.command
      );
      const { required, ...newData } = sanitizedData;
      if (newData.in) Object.assign(newData, { required });

      const handleContentType = (
        schemaType: 'entrada' | 'payload_body' | 'saida'
      ) => {
        if (schemaType === 'entrada') {
          Object.assign(acc.parameters, {
            [upperCaseFirstLetter(key)]: newData,
          });
          return;
        }

        const populateSchema = (schema: JsonObject) => {
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
              // eslint-disable-next-line no-param-reassign
              schema.required = schema.required?.length
                ? [...schema.required, key]
                : [key];

            // eslint-disable-next-line no-param-reassign
            schema.properties = {
              ...schema.properties,
              [key]: newData,
            };
          }

          if (['array', 'object'].includes(newData.type!))
            acc.info.objectsStack = [...objectsStack, newData as JsonObject];
        };

        if (schemaType === 'payload_body') {
          const schema = acc.schemas[`${name}RequestBody`];

          // ignore object name
          if (!acc.info.isMountingRequest && rowData.type === 'object') {
            acc.info.isMountingResponse = false;
            acc.info.isMountingRequest = true;
            return;
          }

          populateSchema(schema as JsonObject);
        }

        if (schemaType === 'saida') {
          const schema = acc.schemas[`${status}Response${name}`];

          // ignore object name
          if (!acc.info.isMountingResponse && rowData.type === 'object') {
            acc.info.isMountingRequest = false;
            acc.info.isMountingResponse = true;
            return;
          }

          populateSchema(schema as JsonObject);
        }
      };

      handleContentType(componentType as 'entrada' | 'payload_body' | 'saida');
      return acc;
    }, initialComponentsData);

    return { ...sheet, components: removeEmptyObjects(components) };
  });
};
