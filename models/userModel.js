const con = require('../config/dbConnection');
const queryExecuter = require('../helper/queryExecuter');

module.exports = {
  getUserByEmail: async (email) => {
    let sql = `select * from users where email = '${email}'`;
    return await queryExecuter(con, sql);
  },
  createUser: async (fname, lname, email, activationLink) => {
    var sql = `INSERT INTO users (fname, lname, email, activationLink) VALUES("${fname}","${lname}","${email}","${activationLink}")`;
    return await queryExecuter(con, sql);
  },
  getUserByActivationLink: async (id, activationLink) => {
    var sql = `select * from users where id = ${id} and activationLink = "${activationLink}"`;
    return await queryExecuter(con, sql);
  },
  updatePasswordAndActivateUser: async (id, password) => {
    var sql = `update users set password = "${password}", isActivated = 1 where id = ${id}`;
    return await queryExecuter(con, sql);
  }
};