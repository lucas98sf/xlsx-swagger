import * as xlsx from 'xlsx';
import fs from 'fs';
import validateSheet, { JsonSheet } from '../types/JsonSheet.validator';

export const sheetsToJson = (filename: string): JsonSheet => {
  try {
    const workbook = xlsx.readFile(filename);

    const sheetsAsJson = validateSheet(
      Object.entries(workbook.Sheets).reduce((json, [sheet, worksheet]) => {
        const jsonSheet = xlsx.utils.sheet_to_json(worksheet);
        const sheetData = {
          [sheet]: sheet === 'info' ? jsonSheet[0] : jsonSheet,
        };
        Object.assign(json, sheetData);
        return json;
      }, {})
    );
    // console.log(JSON.stringify(sheetsAsJson, null, 2));
    return sheetsAsJson;
  } catch (error: unknown) {
    console.error('Erro no excel:', (error as Error).message.split('\n')[0]);
    throw error;
  }
};

export const writeJson = (json: object, outputFile: string) => {
  const logsFolder = `${process.cwd()}/logs/`;
  if (!fs.existsSync(logsFolder)) fs.mkdirSync(logsFolder);
  const prettyJson = JSON.stringify(json, null, 2);
  console.log(prettyJson);
  fs.writeFileSync(logsFolder + outputFile, prettyJson);
};
