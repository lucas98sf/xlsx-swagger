import xlsx from 'xlsx';

const workbook = xlsx.readFile('Template_Swagger_v0.xlsx');

const sheetsAsJson = workbook.SheetNames.map(sheet =>
  xlsx.utils.sheet_to_json(workbook.Sheets[sheet])
);

console.log(sheetsAsJson);
