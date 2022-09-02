import * as xlsx from 'xlsx';
import fs from 'fs';
import { JsonSheet } from '../types';
// import { OpenAPIV3 } from 'openapi-types';
// type JsonSheet = {}

export const writeJson = (json: object, outputFile: string) => {
  const logsFolder = `${process.cwd()}/logs/`;
  if (!fs.existsSync(logsFolder)) fs.mkdirSync(logsFolder);
  const prettyJson = JSON.stringify(json, null, 2);
  // console.log(prettyJson);
  fs.writeFileSync(logsFolder + outputFile, prettyJson);
};

export const sheetsToJson = (filename: string): JsonSheet[] => {
  try {
    const workbook = xlsx.readFile(filename);
    // validateSheet({

    workbook.Workbook?.Sheets?.forEach(sheetProp => {
      if (sheetProp?.Hidden && sheetProp?.Hidden > 0 && sheetProp.name) {
        // console.log('deleted hidden sheet:', sheetProp.name);
        // console.log(workbook.Sheets[sheetProp.name]);
        delete workbook.Sheets[sheetProp.name];
      }
    });

    const paths = xlsx.utils.sheet_to_json(workbook.Sheets.APIsXSwagger, {
      blankrows: false,
      skipHidden: true,
      header: [
        'name', // 'NOME'
        'command', // 'COMANDO',
        'version', // 'VERSÃO',
        'api', // 'API',
        'method', // 'MÉTODO',
        'description', // 'DESCRIÇÃO API',
        'response', // 'RETORNO SUCESSO',
        'status', // 'STATUS RETORNO',
      ],
      range: {
        s: {
          c: 1,
          r: 2,
        },
        e: {
          c: 8,
          r: 500,
        },
      },
    });
    delete workbook.Sheets.APIsXSwagger;
    // console.log(paths);

    const data = Object.entries(workbook.Sheets).reduce(
      (json, [sheet, worksheet]) => {
        return {
          ...json,
          [sheet]: xlsx.utils.sheet_to_json(worksheet, {
            blankrows: false,
            skipHidden: true,
            // raw: true,
            header: [
              'blankA',
              'blankB',
              'key', // campo,
              'type', // tipo,
              'param', // Header/Payload/QueryString/PathParam,
              'required', // Obrigatorio?,
              'enumItems', // Enum
            ],
            range: {
              s: {
                c: 0,
                r: 2,
              },
              e: {
                c: 6,
                r: 500,
              },
            },
          }),
        };
      },
      {}
    );
    // console.log(data);

    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const result = paths.map((path: xlsx.WorkSheet, idx) => ({
      ...path,
      data: Object.entries(data)[idx][1],
    })); // paths.map(path => ({ ...path, data: data[path.command] }));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result as JsonSheet[];
  } catch (error: unknown) {
    console.error('Erro no excel:', (error as Error).message.split('\n')[0]);
    throw error;
  }
};
