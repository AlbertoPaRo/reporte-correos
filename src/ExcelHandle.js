const ExcelJS = require("exceljs");

class ExcelHandle {
  constructor() {}

  addWorkSheet({ workbook, sheetName }) {
    if (!workbook) throw new Error("workbook not exists");
    const sheet = workbook.addWorksheet(sheetName);
    return { sheet };
  }

  createWorkBook() {
    const workbook = new ExcelJS.Workbook();
    return workbook;
  }

  addRows(sheet, data) {
    const cols = Object.keys(data[0]).map((prop) => {
      return {
        header: prop,
        key: prop,
        width: 45,
      };
    });
    sheet.columns = cols;
    sheet.addRows(data);
    return true;
  }

  async writeFile(workbook, fileName) {
    await workbook.xlsx.writeFile(fileName);
    return true;
  }

  async handleData(sheetName, data, fileName) {
    const wb = new ExcelJS.Workbook();
    const sheet = wb.addWorksheet(sheetName);
    const cols = Object.keys(data[0]).map((prop) => {
      return {
        header: prop,
        key: prop,
        width: prop.length,
      };
    });
    sheet.columns = cols;
    sheet.addRows(data);
    await wb.xlsx.writeFile(fileName);
    return wb;
  }

  getCellByName(worksheet, headers) {
    const result = [];
    const row = worksheet.getRow(1);
    for (let i = 1; i < row.values.length; i++) {
      const cell = row.getCell(i);
      result.push({ ...cell });
    }
    return result.filter((cell) => headers.includes(cell._column._header));
  }

  getHeaders(worksheet, index) {
    const result = [];

    const row = worksheet.getRow(index);

    if (row === null || !row.values || !row.values.length) return [];

    for (let i = 1; i < row.values.length; i++) {
      const cell = row.getCell(i);
      result.push(cell.text);
    }
    return result;
  }
}

class ReportExcelHandle extends ExcelHandle {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
  }

  levelPercentage(worksheet, cells) {
    const result = {};
    const getColor = (value) => {
      if (value.toLowerCase() === "male") return "#ff0000";
      if (value.toLowerCase() === "female") return "#00ff00";
      return "#00ffff";

      //  if(value>=100) return  "#3ed140"
      //  if(value<100 && value>=79) return "#faed15"
      //  return "#e53004"
    };

    cells.forEach((item) => {
      const col = worksheet.getColumn(item._column._number);
      col.eachCell(function (cell, rowNumber) {
        const model = cell._value.model;
        const value = model.value;
        const color = getColor(value);
        const addr = cell._address;
        const borderColor = "#000000".slice(1);

        const borderType = { style: "thin", color: { argb: borderColor } };

        if (model.value !== item._column._header) {
          result[item._column._header] ??= [];
          result[item._column._header].push({ ...model });
          worksheet.getCell(addr).fill = {
            type: "pattern",
            pattern: "darkVertical",
            fgColor: { argb: color.slice(1) },
          };

          worksheet.getCell(addr).border = {
            top: borderType,
            left: borderType,
            bottom: borderType,
            right: borderType,
          };
        }
      });
    });
    console.log(result);
    return result;
  }
}

module.exports = {
  ExcelHandle,
  ReportExcelHandle,
};
