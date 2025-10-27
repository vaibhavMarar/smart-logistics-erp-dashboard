const sql = require('mssql');

const config = {
  user: 'print_admin',
  password: 'Vaibhavm2136',
  server: 'localhost',
  database: 'Masters',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

sql.connect(config).then(pool => {
  return pool.request().query('SELECT TOP 1 * FROM CustomerMaster');
}).then(result => {
  console.log(result.recordset);
  sql.close();
}).catch(err => {
  console.error('Test DB connection error:', err);
});
