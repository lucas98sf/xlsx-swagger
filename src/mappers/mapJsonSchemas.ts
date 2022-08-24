import _ from 'lodash';
import { OpenAPIV3 } from 'openapi-types';
import { Schema } from '../types/components/Schema';

export const mapJsonParameter = (schemas: Schema[]) => {
  return schemas.reduce<{
    [key: string]: OpenAPIV3.SchemaObject;
  }>((acc, schema) => {
    if (acc[schema.name].properties && schema.property) {
      acc[schema.name].properties![_.camelCase(schema.property)] = {
        $ref: `#/components/schemas/${schema.property}`,
      };
    } else {
      acc[schema.name] = {
        type: 'object',
        properties: { [schema.property]: { $ref: schema.property } },
      };
    }
    return acc;
  }, {});
};
