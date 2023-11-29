
const sql = require('mssql');

async function login(phoneNum, password, type) {
  try {
    const request = new sql.Request();
    request.input('SDT', sql.VarChar, phoneNum);
    request.input('MATKHAU', sql.VarChar, password);

    const result = await request.execute('SP_LOGIN_KHACHHANG'); // Replace 'sp_login' with the name of your stored procedure
    console.log(result.recordset);
    return result.recordset;
  } catch (error) {
        console.error('Error executing stored procedure:', error);
        throw error;
  } finally {
    sql.close();
  }
}

module.exports = {
  login
};
