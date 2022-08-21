import { OpenAPIV3 } from 'openapi-types';
import { Parameter } from '../types/components/Parameter';

export const mapJsonParameter = (parameters: Parameter[]) => {
  return parameters.reduce<OpenAPIV3.ComponentsObject['parameters']>((acc, param) => {
    const { parameter, ...parameterData } = param;
    const result: OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject = { ...parameterData };
    result.schema = parameterData.$ref
      ? { $ref: parameterData.$ref }
      : {
          type: parameterData.schemaType,
          format: parameterData.schemaFormat,
          example: parameterData.schemaExample,
          pattern: parameterData.schemaPattern,
        };
    acc![parameter] = result;
    return acc;
  }, {});
};
