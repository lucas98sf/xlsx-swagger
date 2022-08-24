import { OpenAPIV3 } from 'openapi-types';
import { Parameter } from '../types/components/Parameter';

export const mapJsonParameters = (parameters: Parameter[]) => {
  return parameters.reduce<OpenAPIV3.ComponentsObject['parameters']>((acc, param) => {
    const result: OpenAPIV3.ReferenceObject | OpenAPIV3.ParameterObject = {
      in: param.in,
      name: param.name,
      description: param.description,
      required: param.required,
    };
    result.schema = param.$ref
      ? { $ref: `#/components/schemas/${param.$ref}` }
      : {
          type: param.schemaType,
          format: param.schemaFormat,
          example: param.schemaExample,
          pattern: param.schemaPattern,
        };
    acc![param.parameter] = result;
    return acc;
  }, {});
};
