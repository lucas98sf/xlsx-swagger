import { OpenAPIV3 } from 'openapi-types';
import { Parameter } from '../types/components/Parameter';

export const mapJsonParameters = (parameters: Parameter[]) => {
  return parameters.reduce<OpenAPIV3.ComponentsObject['parameters']>((acc, param) => {
    const result: OpenAPIV3.ParameterObject = {
      in: param.in,
      name: param.name,
      description: param.description,
      required: param.required,
    };
    result.schema = param.schema$ref
      ? { $ref: `#/components/schemas/${param.schema$ref}` }
      : {
          type: param.schemaType,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          default: param.schemaDefault,
          pattern: param.schemaPattern,
          maxLength: param.schemaMaxLength,
          format: param.schemaFormat,
          example: param.schemaExample,
        };
    acc![param.parameter] = result;
    return acc;
  }, {});
};
