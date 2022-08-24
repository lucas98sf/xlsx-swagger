import { OpenAPIV3 } from 'openapi-types';
import {
  Path,
  PathData,
  PathInfo,
  PathParameter,
  PathRequestBody,
  PathResponse,
} from '../types/Path';

export const mapJsonPaths = (paths: Path[], pathData: PathData): OpenAPIV3.PathsObject => {
  return paths.reduce<OpenAPIV3.PathsObject>((acc, path) => {
    const isFromPath = (data: PathInfo) => data.api === path.api && data.verb === path.verb;

    const getPathParameters = (dataWithPathInfo: PathRequestBody | PathParameter) => {
      const { $ref } = dataWithPathInfo;
      return { $ref: `#/components/parameters/${$ref}` };
    };

    const getPathResquestBodies = (dataWithPathInfo: PathRequestBody | PathParameter) => {
      const { $ref } = dataWithPathInfo;
      return { $ref: `#/components/schemas/${$ref}` };
    };

    const getPathResponses = (obj: OpenAPIV3.ResponsesObject, res: PathResponse) => {
      const { status, $ref } = res;
      const result = { $ref: `#/components/responses/${$ref}` };
      return { ...obj, [status || '200']: result };
    };

    const pattern: string = path.api;
    const pathOperation = OpenAPIV3.HttpMethods[path.verb];

    const operationObject = {
      tags: pathData['path-tags'].flatMap(tag => (isFromPath(tag) ? [tag.tag] : [])),
      parameters: pathData['path-parameters'].filter(isFromPath).map(getPathParameters),
      requestBody: pathData['path-requestBody']
        .filter(isFromPath)
        .map(getPathResquestBodies)
        .shift(),
      responses: pathData['path-responses'].filter(isFromPath).reduce(getPathResponses, {}),
    } as OpenAPIV3.OperationObject;

    return { ...acc, [pattern]: { ...acc[pattern], [pathOperation]: operationObject } };
  }, {});
};
