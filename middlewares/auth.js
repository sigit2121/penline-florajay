const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const models = require('../models');

module.exports = {

  auth: (req,res,next) => {
    try {
      const decoded = jwt.verify(req.headers.token, 'secret');
      if(decoded){
        req.user = decoded.user
        next();
      } else {
        res.status(403).json({
          message: "Invalid Token"
        });
      }
    } catch(err) {
        res.status(403).json({
          message: "Invalid Token"
        });
    }
  },
  otoritas: (req, res, next) => {
    models.Otoritas.findOne({
      where: {
        name: req.headers.otoritas
      }
    }).then(otoritas => {
      if (otoritas) {
        models.OtoritasUser.findOne({
          where: {
            user: req.user.id,
            otoritas: otoritas.id
          }
        }).then((otoritasUser) => {
          if (otoritasUser) {
            next()
          } else {
            res.status(403).json({
              message: "Not Have Authorization"
            })
          }
        })
      } else {
        res.status(403).json({
          message: "Not Have Authorization"
        })
      }
    })

  }
}
