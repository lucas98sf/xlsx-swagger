import SwaggerParser from '@apidevtools/swagger-parser';
import { OpenAPIV3 } from 'openapi-types';

export const validateOpenApiDocument = (document: OpenAPIV3.Document) =>
  SwaggerParser.validate(document, { resolve: { external: false } }, (err, api) => {
    if (err) console.error(err);
    else console.log(api);
  });
