import * as xlsx from 'xlsx';
import fs from 'fs';

// type JsonSheet = {}

export const writeJson = (json: object, outputFile: string) => {
  const logsFolder = `${process.cwd()}/logs/`;
  if (!fs.existsSync(logsFolder)) fs.mkdirSync(logsFolder);
  const prettyJson = JSON.stringify(json, null, 2);
  console.log(prettyJson);
  fs.writeFileSync(logsFolder + outputFile, prettyJson);
};

export const sheetsToJson = (filename: string) => {
  try {
    const workbook = xlsx.readFile(filename);
    // validateSheet({

    const paths = xlsx.utils.sheet_to_json(workbook.Sheets.APIsXSwagger, {
      blankrows: false,
      header: [
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
          c: 7,
          r: 500,
        },
      },
    });
    delete workbook.Sheets.APIsXSwagger;
    // console.log(paths);

    const data = Object.entries(workbook.Sheets).reduce((json, [sheet, worksheet]) => {
      return {
        ...json,
        [sheet]: xlsx.utils.sheet_to_json(worksheet, {
          blankrows: false,
          raw: true,
          header: [
            'key', // campo,
            'type', // tipo,
            'param', // Header/Payload/QueryString/PathParam,
            'required', // Obrigatorio?,
            'enum', // Enum
          ],
          range: {
            s: {
              c: 2,
              r: 3,
            },
            e: {
              c: 6,
              r: 500,
            },
          },
        }),
      };
    }, {});
    // console.log(data);

    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    const result = paths.map((path, idx) => ({ ...path, data: Object.entries(data)[idx][1] })); // paths.map(path => ({ ...path, data: data[path.command] }));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result;
  } catch (error: unknown) {
    console.error('Erro no excel:', (error as Error).message.split('\n')[0]);
    throw error;
  }
};
