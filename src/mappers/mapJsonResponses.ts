import _ from 'lodash';
import { OpenAPIV3 } from 'openapi-types';
import { Response } from '../types/components/Response';

export const mapJsonResponses = (responses: Response[]) => {
  return responses.reduce<OpenAPIV3.ComponentsObject['responses']>((acc, resp) => {
    const { name, header, content, ...respData } = resp;
    if (header) {
      const headerName = _.kebabCase(header);
      const headerRef = {
        $ref: `#/components/schemas/${header}`,
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
    if (content) {
      Object.assign(respData, {
        content: {
          'application/json': {
            schema: {
              $ref: `#/components/schemas/${content}`,
            },
          } as OpenAPIV3.MediaTypeObject,
        },
      });
    }
    acc![name] = respData;
    return acc;
  }, {});
};
