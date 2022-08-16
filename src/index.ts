import * as xlsx from 'xlsx';
import { JsonSheet } from './types';

const workbook = xlsx.readFile('Template_Swagger_v0.xlsx');

const sheetsAsJson = Object.entries(workbook.Sheets).reduce((json, [sheet, worksheet]) => {
  const jsonSheet = xlsx.utils.sheet_to_json(worksheet);
  const sheetData = {
    [sheet]: sheet === 'info' ? jsonSheet[0] : jsonSheet,
  };
  Object.assign(json, sheetData);
  return json;
}, {} as JsonSheet);

console.log(JSON.stringify(sheetsAsJson, null, 2));
