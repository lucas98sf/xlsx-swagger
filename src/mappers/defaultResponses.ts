import { OpenAPIV3 } from 'openapi-types';

export const defaultResponseErrorSchema: Record<
  string,
  OpenAPIV3.SchemaObject
> = {
  ResponseError: {
    type: 'object',
    properties: {
      correlationId: {
        type: 'string',
      },
      traceId: {
        type: 'string',
      },
      error: {
        type: 'object',
        properties: {
          errorCode: {
            type: 'string',
          },
          message: {
            type: 'string',
          },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  },
};

export const defaultResponsesRefs: OpenAPIV3.ResponsesObject = {
  '400': { $ref: '#/components/responses/BadRequest' },
  '401': { $ref: '#/components/responses/Unauthorized' },
  '403': { $ref: '#/components/responses/Forbidden' },
  '404': { $ref: '#/components/responses/NotFound' },
  '422': { $ref: '#/components/responses/UnprocessableEntity' },
  '426': { $ref: '#/components/responses/UpgradeRequired' },
  '500': { $ref: '#/components/responses/InternalServerError' },
  '501': { $ref: '#/components/responses/NotImplemented' },
};

export const defaultResponses: Record<string, OpenAPIV3.ResponseObject> = {
  BadRequest: {
    description:
      'The request was malformed, omitting mandatory attributes, either in the payload or through attributes in the URL',
    content: {
      'application/json; charset=utf-8': {
        schema: {
          $ref: '#/components/schemas/ResponseError',
        },
      },
    },
  },
  Unauthorized: {
    description: 'Missing/Invalid Authentication Header or Invalid Token',
    content: {
      'application/json; charset=utf-8': {
        schema: {
          $ref: '#/components/schemas/ResponseError',
        },
      },
    },
  },
  Forbidden: {
    description:
      'Token is incorrectly scoped or a security policy has been violated',
    content: {
      'application/json; charset=utf-8': {
        schema: {
          $ref: '#/components/schemas/ResponseError',
        },
      },
    },
  },
  NotFound: {
    description:
      'The requested feature does not exist or has not been implemented',
    content: {
      'application/json; charset=utf-8': {
        schema: {
          $ref: '#/components/schemas/ResponseError',
        },
      },
    },
  },
  UnprocessableEntity: {
    description:
      'The request syntax is correct, but it was not possible to process the instructions present',
    content: {
      'application/json; charset=utf-8': {
        schema: {
          $ref: '#/components/schemas/ResponseError',
        },
      },
    },
  },
  UpgradeRequired: {
    description: 'Upgrade required',
    content: {
      'application/json; charset=utf-8': {
        schema: {
          $ref: '#/components/schemas/ResponseError',
        },
      },
    },
  },
  InternalServerError: {
    description: 'An error occurred in the API gateway or microservice',
    content: {
      'application/json; charset=utf-8': {
        schema: {
          $ref: '#/components/schemas/ResponseError',
        },
      },
    },
  },
  NotImplemented: {
    description:
      'The request method is not supported by the server and cannot be handled.',
    content: {
      'application/json; charset=utf-8': {
        schema: {
          $ref: '#/components/schemas/ResponseError',
        },
      },
    },
  },
};
