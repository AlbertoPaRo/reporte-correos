const { ExcelHandle, ReportExcelHandle } = require("../src/ExcelHandle");
const { Workbook } = require("exceljs");

describe("Excel Handle suite test", () => {
  it("create workbook", () => {
    const excelHandle = new ExcelHandle();

    expect(excelHandle.createWorkBook()).toBeInstanceOf(Workbook);
  });
  it("create worksheet", () => {
    const excelHandle = new ExcelHandle();
    const wb = excelHandle.createWorkBook();
    const name = "My sheet";

    expect(
      excelHandle.addWorkSheet({ workbook: wb, nameSheet: name })
    ).toBeInstanceOf(Object);
  });
  it("id worksheet", () => {
    const excelHandle = new ExcelHandle();
    const sheet1 = "My Sheet 1";
    const wb1 = excelHandle.createWorkBook();
    const sheet2 = "My sheet 2";
    const sheet3 = "My sheet C";

    expect(wb1).toBeInstanceOf(Workbook);
    expect(
      excelHandle.addWorkSheet({ workbook: wb1, nameSheet: sheet1 }).sheet.id
    ).toBe(1);
    expect(
      excelHandle.addWorkSheet({ workbook: wb1, nameSheet: sheet2 }).sheet.id
    ).toBe(2);
    expect(
      excelHandle.addWorkSheet({ workbook: wb1, nameSheet: sheet3 }).sheet.id
    ).toBe(3);
  });

  it("fail add workSheet", () => {
    const excelHandle = new ExcelHandle();
    const sheet1 = "My Sheet 1";
    const wb = excelHandle.createWorkBook();
    expect(wb).toBeInstanceOf(Workbook);
    expect(async () =>
      excelHandle.addWorkSheet({ nameSheet: sheet1 })
    ).rejects.toThrowError("workbook not exists");
  });

  it("Add Rows to WorkSheet", async () => {
    const excelHandle = new ExcelHandle();
    const wb = excelHandle.createWorkBook();
    const { sheet } = excelHandle.addWorkSheet({
      workbook: wb,
      sheetName: "First Data",
    });
    const data = require("../Persons.json");
    const result = await excelHandle.addRows(sheet, data);
    expect(result).toBe(true);
  });

  it("Write File WorkBook", async () => {
    const excelHandle = new ExcelHandle();
    const wb = excelHandle.createWorkBook();
    const { sheet } = excelHandle.addWorkSheet({
      workbook: wb,
      sheetName: "First Data",
    });
    const data = require("../Persons.json");
    await excelHandle.addRows(sheet, data);
    const flag = await excelHandle.writeFile(wb, "./test2.xlsx");
    expect(flag).toBeTruthy();
  });

  it("Write File WorkBook from scratching", async () => {
    const excelHandle = new ExcelHandle();
    const sheetName = "Data";
    const fileName = "./test.xlsx";
    const data = require("../Persons.json");
    const wb = await excelHandle.handleData(sheetName, data, fileName);
    expect(wb).toBeInstanceOf(Workbook);
  });

  it("get headers from sheet", () => {
    const excelHandle = new ExcelHandle();
    const wb = excelHandle.createWorkBook();
    const { sheet } = excelHandle.addWorkSheet({
      workbook: wb,
      sheetName: "First Data",
    });
    const data = require("../Persons.json");
    excelHandle.addRows(sheet, data);
    expect(excelHandle.getHeaders(sheet, 1)).toBeInstanceOf(Array);
  });

  it("get cell by name", () => {
    const excelHandle = new ExcelHandle();
    const wb = excelHandle.createWorkBook();
    const { sheet } = excelHandle.addWorkSheet({
      workbook: wb,
      sheetName: "First Data",
    });
    const data = require("../Persons.json");
    excelHandle.addRows(sheet, data);
    const result = excelHandle.getCellByName(sheet, ["first_name", "email"]);
    console.log(result);
    expect(result).toBeTruthy();
  });

  it("get values by cell headers", () => {
    const excelHandle = new ReportExcelHandle();
    const wb = excelHandle.createWorkBook();
    const { sheet } = excelHandle.addWorkSheet({
      workbook: wb,
      sheetName: "First Data",
    });
    const data = require("../Persons.json");
    excelHandle.addRows(sheet, data);
    const cells = excelHandle.getCellByName(sheet, ["gender", "email"]);
    expect(excelHandle.levelPercentage(sheet, cells)).toBeTruthy();
    expect(excelHandle.writeFile(wb, "./test3.xlsx"));
  });
});
