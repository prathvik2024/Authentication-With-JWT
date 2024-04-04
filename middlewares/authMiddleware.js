const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) =>{
    const token = req.cookies.auth_token;
    if(!token){
        return res.status(401).json({status:false, error:"Unathorized!"});
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, user)=>{
        if(err){
            return res.status(403).json({status:false, error:"Invalid token!"})
        }
        req.user = user;
        next();
    }) 
}

module.exports = authenticateToken;