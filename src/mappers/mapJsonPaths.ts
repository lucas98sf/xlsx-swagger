import { OpenAPIV3 } from 'openapi-types';
import { Path, PathData, PathInfo, PathResponse } from '../types/Path';

export const mapJsonPaths = (paths: Path[], pathData: PathData): OpenAPIV3.PathsObject => {
  return paths.reduce<OpenAPIV3.PathsObject>((acc, path) => {
    const isFromPath = (data: PathInfo) => data.api === path.api && data.verb === path.verb;

    const getRef = (dataWithPathInfo: Partial<PathInfo & { ref: string }>) => {
      const { ref } = dataWithPathInfo;
      return { $ref: ref };
    };

    const getPathResponses = (obj: OpenAPIV3.ResponsesObject, res: PathResponse) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { status, ref, api, verb, ...data } = res; // FIXME implementado apenas pra $ref
      const result = { $ref: ref }; // ref ? { $ref: ref } : data;
      return { ...obj, [status || '200']: result };
    };

    const pattern: string = path.api;
    const pathOperation = OpenAPIV3.HttpMethods[path.verb];

    const operationObject = {
      tags: pathData['path-tags'].flatMap(tag => (isFromPath(tag) ? [tag.tag] : [])),
      parameters: pathData['path-parameters'].filter(isFromPath).map(getRef),
      requestBody: pathData['path-requestBody'].filter(isFromPath).map(getRef).shift(),
      responses: pathData['path-responses'].filter(isFromPath).reduce(getPathResponses, {}),
    } as OpenAPIV3.OperationObject;

    return { ...acc, [pattern]: { ...acc[pattern], [pathOperation]: operationObject } };
  }, {});
};
