import _ from 'lodash';
import { OpenAPIV3 } from 'openapi-types';
import { Schema } from '../types/components/Schema';

export const mapJsonSchemas = (schemas: Schema[]) => {
  return schemas.reduce<OpenAPIV3.ComponentsObject['schemas']>((acc, schema) => {
    const { name, property, items, ...schemaData } = schema;
    if (property) {
      const propertyName = _.camelCase(property);
      const propertyRef = {
        $ref: `#/components/schemas/${property}`,
      };
      if (acc![name]) {
        (acc![name] as OpenAPIV3.NonArraySchemaObject).properties![propertyName] = propertyRef;
      } else {
        Object.assign(schemaData, {
          properties: {
            [propertyName]: propertyRef,
          },
        });
        acc![name] = schemaData as OpenAPIV3.NonArraySchemaObject;
      }
    } else if (items) {
      Object.assign(schemaData, {
        items: { $ref: `#/components/schemas/${items}` },
      });
      acc![name] = schemaData as OpenAPIV3.ArraySchemaObject;
    } else {
      acc![name] = schemaData as OpenAPIV3.NonArraySchemaObject;
    }
    return acc;
  }, {});
};
