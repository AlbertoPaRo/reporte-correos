const sql = require("mssql");
const fs = require("node:fs/promises");
const XLSX = require("xlsx");

function getConfigMSSQL() {
  return {
    user: process.env.USER_DB,
    password: process.env.PASS_DB,
    server: process.env.HOST_DB,
    database: process.env.NAME_DB,
    options: {
      encrypt: false,
      trustServerCertificate: true,
    },
  };
}

async function getQuery(fileName) {
  const data = await fs.readFile(fileName, "utf-8");
  return data;
}

function convertDataToExcel(data, pathFileName) {
  return new Promise((resolve, reject) => {
    try {
      const workbook = XLSX.utils.book_new();
      data.forEach(([name, data]) => {
        const sheetName = name;
        const worksheet = XLSX.utils.json_to_sheet(data.recordset);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      });
      XLSX.writeFile(workbook, pathFileName);
      resolve(true);
    } catch (err) {
      reject(err);
    }
  });
}

const getDataFromQueries = (config, queries) => {
  return new Promise((resolve, reject) => {
    let results;
    sql.connect(config, (err) => {
      if (err) reject(err);
      const request = new sql.Request();
      results = queries.map(([sheetName, queryString]) => {
        return new Promise((resolve, reject) => {
          request.query(queryString, (err, data) => {
            if (err) reject(err);

            resolve([sheetName, data]);
          });
        });
      });
      resolve(results);
    });
  });
};

module.exports = {
  getDataFromQueries,
  convertDataToExcel,
  getQuery,
  getConfigMSSQL,
};
