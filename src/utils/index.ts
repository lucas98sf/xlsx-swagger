import { JsonSheetPathData } from '../types';

export const sanitizeString = (str: string) =>
  str
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/(\r\t\n)/g, '')
    .trim();

export const upperCaseFirstLetter = (str: string) =>
  sanitizeString(str).charAt(0).toUpperCase() + sanitizeString(str).slice(1);

export const normalizeString = (str: string) =>
  sanitizeString(str).toLowerCase().replace(/\s/g, '_');

export const splitEnumToArray = (str: string) =>
  sanitizeString(str)
    .toUpperCase()
    .replace(/;\s+/g, ';')
    .trim()
    .replace(/[-\s]/g, '_')
    .replace(/;$/g, '')
    .split(';');

export const stringToBoolean = (str: string) =>
  ['sim', 'true'].includes(normalizeString(str));

type TypeAndFormat = {
  type: string;
  format?: string;
  enum?: string[];
  properties?: Record<string, unknown>;
  items?: Record<string, unknown>;
};
export const getTypeAndFormat = (
  type: string,
  sheetName: string,
  enumItems?: string
): TypeAndFormat => {
  switch (normalizeString(type)) {
    case 'string':
      return {
        type: 'string',
      };
    case 'number':
      return {
        type: 'number',
      };
    case 'boolean':
      return {
        type: 'boolean',
      };
    case 'object':
    case 'objeto':
      return {
        type: 'object',
        properties: {},
      };
    case 'int':
    case 'integer':
      return {
        type: 'integer',
      };
    case 'int32':
      return {
        type: 'integer',
        format: 'int32',
      };
    case 'int64':
      return {
        type: 'integer',
        format: 'int64',
      };
    case 'array':
      return {
        type: 'array',
        items: {},
      };
    case 'double':
      return {
        type: 'number',
        format: 'double',
      };
    case 'float':
      return {
        type: 'number',
        format: 'float',
      };
    case 'datetime':
    case 'datatime':
    case 'date_time':
    case 'data_time':
      return {
        type: 'string',
        format: 'date-time',
      };
    case 'date':
    case 'data':
      return {
        type: 'string',
        format: 'date',
      };
    case 'enum':
      if (!enumItems?.length)
        throw new Error(
          `Enum items are required, but not found at sheet '${sheetName}'`
        );
      return {
        type: 'string',
        enum: splitEnumToArray(enumItems),
      };
    default:
      throw new Error(`Couldn't parse type: ${type}, at sheet '${sheetName}'`);
  }
};

export const getParamType = (param: string, sheetName: string) => {
  switch (normalizeString(param)) {
    case 'path':
    case 'pathparam':
    case 'path_param':
      return 'path';
    case 'query':
    case 'querystring':
    case 'query_string':
      return 'query';
    case 'header':
      return 'header';
    default:
      throw new Error(
        `Couldn't parse param: ${param}, at sheet '${sheetName}'`
      );
  }
};

type SanitizedRowData = {
  required?: boolean;
  in?: string;
  name?: string;
  schema?: Partial<TypeAndFormat>;
} & Partial<TypeAndFormat>;
export const sanitizeRowData = (
  rowData: Omit<JsonSheetPathData, 'blankA' | 'blankB'> & { type: string },
  key: string,
  sheetName: string
): SanitizedRowData => {
  const { type, enumItems } = rowData;

  const typeAndFormat = getTypeAndFormat(type, sheetName, enumItems);

  const result: SanitizedRowData = {
    required: rowData.required ? stringToBoolean(rowData.required) : false,
  };

  if (rowData.param)
    Object.assign(result, {
      in: getParamType(rowData.param, sheetName),
      name: sanitizeString(key),
      schema: typeAndFormat,
    });
  else {
    Object.assign(result, typeAndFormat);
  }

  return result;
};
