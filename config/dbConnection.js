const mysql = require('mysql');
require('dotenv').config();

try {
    const con = mysql.createConnection({
        host: process.env.HOST,
        user: process.env.SQL_USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
    });
    
    con.connect((err)=>{
        if(err){
            throw err;
        }else{
            console.log("Database connected!!");
        }
    });
    module.exports = con;
} catch (error) {
    console.log(error);
}
