import _ from 'lodash';
import { OpenAPIV3 } from 'openapi-types';
import { Response } from '../types/components/Response';

export const mapJsonResponses = (responses: Response[]) => {
  return responses.reduce<OpenAPIV3.ComponentsObject['responses']>((acc, resp) => {
    const { name, header$ref, content$ref, ...respData } = resp;
    if (header$ref) {
      const headerName = _.kebabCase(header$ref);
      const headerRef = {
        $ref: `#/components/schemas/${header$ref}`,
      };
      if (acc![name]) {
        (acc![name] as OpenAPIV3.ResponseObject).headers![headerName] = headerRef;
        return acc;
      }
      Object.assign(respData, {
        headers: {
          [headerName]: headerRef,
        },
      });
    }
    if (content$ref) {
      Object.assign(respData, {
        content: {
          'application/json': {
            schema: {
              $ref: `#/components/schemas/${content$ref}`,
            },
          } as OpenAPIV3.MediaTypeObject,
        },
      });
    }
    acc![name] = respData;
    return acc;
  }, {});
};
