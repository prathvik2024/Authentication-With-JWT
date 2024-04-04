const con = require('../config/dbConnection');
const queryExecuter = require('../helper/queryExecuter');

module.exports = {
  getUserByEmail : async (email) =>{
    let sql = `select * from users where email = '${email}'`;
    return await queryExecuter(con, sql);
  },
  createUser : async (fname, lname, email, password, activationLink) =>{
    var sql = `INSERT INTO users (fname, lname, email, password, activationLink) VALUES("${fname}","${lname}","${email}","${password}","${activationLink}")`;
    return await queryExecuter(con, sql);
  },
  userActivate : async (id, activationLink)=>{
    var sql = `update users set isActivated = 1 where id = ${id} and activationLink = "${activationLink}"`;
    return await queryExecuter(con, sql);
  }
};