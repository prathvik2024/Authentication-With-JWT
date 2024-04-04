module.exports = queryExecuter = async (con, sql) =>{
    var response = null;
    await new Promise((resolve, reject) => {
        con.query(sql, (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        })
    }).then((result) => {
        response = { status: true, result };
    }).catch((error) => {
        response = { status: false, error };
    })
    return await response;
  }
  
