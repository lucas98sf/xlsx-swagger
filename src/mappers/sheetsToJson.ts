// @ts-nocheck
import * as xlsx from 'xlsx';
import fs from 'fs';
import { JsonSheet, JsonSheetInfo } from '../types';

export const writeJson = (json: object, outputFile: string) => {
  const logsFolder = `${process.cwd()}/logs/`;
  if (!fs.existsSync(logsFolder)) fs.mkdirSync(logsFolder);
  const prettyJson = JSON.stringify(json, null, 2);
  fs.writeFileSync(logsFolder + outputFile, prettyJson);
};

export const sheetsToJson = (
  filename: string
): [JsonSheetInfo, JsonSheet[]] => {
  try {
    const workbook = xlsx.readFile(filename);

    workbook.Workbook?.Sheets?.forEach(sheetProp => {
      if (sheetProp?.Hidden && sheetProp?.Hidden > 0 && sheetProp.name) {
        console.log('Deleted hidden sheet:', sheetProp.name);
        delete workbook.Sheets[sheetProp.name];
      }
    });

    const sheetInfo = xlsx.utils.sheet_to_json(workbook.Sheets.Info, {
      blankrows: false,
      skipHidden: true,
      header: [
        'title', // TÍTULO
        'version', // VERSÃO
        'description', // DESCRIÇÃO
        'servers', // SERVIDORES
        'tags', // TAGS
        'tagDescription', // DESCRIÇÃO TAGS
      ],
      range: {
        s: {
          c: 1,
          r: 2,
        },
        e: {
          c: 6,
          r: 500,
        },
      },
    });
    delete workbook.Sheets.Info;

    const info: JsonSheetInfo = {
      /* eslint-disable @typescript-eslint/no-unsafe-assignment */
      title: sheetInfo[0].title,
      version: sheetInfo[0].version,
      description: sheetInfo[0].description,
      servers: sheetInfo.flatMap(row => (row.servers as string) || []),
      tags: sheetInfo.map(row => ({
        name: row.tags,
        description: row.tagDescription,
      })),
      /* eslint-enable @typescript-eslint/no-unsafe-assignment */
    } as unknown as JsonSheetInfo;

    const paths = xlsx.utils.sheet_to_json(workbook.Sheets.APIsXSwagger, {
      blankrows: false,
      skipHidden: true,
      header: [
        'name', // 'NOME'
        'tag', // 'TAG'
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
          c: 9,
          r: 500,
        },
      },
    });
    delete workbook.Sheets.APIsXSwagger;

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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const result: JsonSheet[] = paths.map((path: xlsx.WorkSheet, idx) => ({
      ...path,
      data: Object.entries(data)[idx][1],
    }));

    return [info, result];
  } catch (error: unknown) {
    console.error('Erro no excel:', (error as Error).message.split('\n')[0]);
    throw error;
  }
};
