const jwt = require('jsonwebtoken');

module.exports.verifyJwtToken = (req, res, next) => {
       jwt.verify(req.params.to, process.env.JWT_SECRET,
           (err, decoded) => {
               if (err)
                   return res.status(500).send({ auth: false, message: 'Token authentication failed.' });
               else {
                   req._id = decoded._id;
                   next();
               }
           }
       )
}