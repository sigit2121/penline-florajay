const models = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Op = require('sequelize').Op
const { caching, delCache } = require('../middlewares/redis')

module.exports = {
  all: (req,res) => {
    models.User.all().then(user => {
      caching('User', user)
      res.status(200).json({
        message: 'Success Read User',
        data: user
      })
    }).catch((err) => {
      res.status(500).json({
        message: 'Something Went Wrong'
      })
    })
  },
  me: (req,res) => {
    const { id } = req.user
    models.User.findOne({
      where: {
        id: id
      }
    }).then(user => {
      res.status(200).json({
        message: 'Success Read User',
        data: user
      })
    }).catch((err) => {
      res.status(500).json({
        message: 'Something Went Wrong'
      })
    })

  },
  find: (req,res) => {
    const { id } = req.params
    models.User.findOne({
      where: {
        id: id
      }
    }).then(user => {
      res.status(200).json({
        message: 'Success Read User',
        data: user
      })
    }).catch((err) => {
      res.status(500).json({
        message: 'Something Went Wrong'
      })
    })

  },
  index: (req,res) => {
    let { q, page } = req.query
    if (!q) {
      q = ''
    }
    if (!page) {
      page = 1
    }
    let pagination
    let limit = 10
    let offset = 0
    models.User.count({
      where: {
        [Op.or]: [
          { username: {
            [Op.like]: `%${q}%`
          }},
          { name: {
            [Op.like]: `%${q}%`
          }},
        ]
      },
    }).then((count) => {
      let pages = Math.ceil(count / limit)
      offset = limit * (page - 1)
      pagination = {
        limit,
        offset,
        pages,
        page
      }
      return pagination
    }).then(pagination => {
      const { limit, offset} = pagination
      return  models.User.all({
        where: {
          [Op.or]: [
            { username: {
              [Op.like]: `%${q}%`
            }},
            { name: {
              [Op.like]: `%${q}%`
            }},
          ]
        },
        limit,
        offset
      })
    }).then(data => {
      const { pages } = pagination
      res.status(200).json({
        message: 'Success Retrieve All Users',
        data: {
          data,
          pages
        }
      })
    }).catch((err) => {
      res.status(500).json({
        message: 'Something Went Wrong'
      })
    })

  },
  create: (req, res) => {
    const { username, password, name, role} = req.body
    const hashPassword = bcrypt.hashSync(password, 10);
    models.User.create({
      username,
      password: hashPassword,
      name,
      role
    }).then((user) => {
      delCache('User')
      res.status(201).json({
        message: 'Success Create User',
        data: user
      })
    }).catch((err) => {
      if (err.errors[0].message) {
        const message = err.errors[0].message
        res.status(403).json({
          message: message,
        })
      } else {
        res.status(500).json({
          message: 'Something Went Wrong',
        })
      }
    })

  },
  update: (req, res) => {
    const { id } = req.params
    const { username, password, name, role} = req.body
    const hashPassword = bcrypt.hashSync(password, 10);
    models.User.findOne({
      where: { id: id}
    }).then((user) => {
      if (user) {
        user.update({
          username,
          password: hashPassword,
          name,
          role
        }).then((updatedUser) => {
          delCache('User')
          res.status(200).json({
            message: 'Success Update User',
            data: user
          })
        }).catch((err) => {
          if (err.errors[0].message) {
            const message = err.errors[0].message
            res.status(403).json({
              message: message,
            })
          } else {
            res.status(500).json({
              message: 'Something Went Wrong',
            })
          }
        })
      } else {
        res.status(404).json({
          message: 'User Not Found',
        })
      }
    }).catch((err) => {
      if (err.errors[0].message) {
        const message = err.errors[0].message
        res.status(403).json({
          message: message,
        })
      } else {
        res.status(500).json({
          message: 'Something Went Wrong',
        })
      }
    })
  },
  destroy: (req, res) => {
    const { id } = req.params
    models.User.findOne({
      where: {
        id: id
      }
    }).then((user) => {
      delCache('User')
      user.destroy().then(() => {
        res.status(200).json({
          message: 'Success Delete User',
          data: user
        })
      }).catch((err) => {
        res.status(500).json({
          message: 'Something Went Wrong',
        })
      })
    }).catch((err) => {
      res.status(500).json({
        message: 'Something Went Wrong',
      })
    })
  },
  signin: (req,res) => {
    const { username, password} = req.body
    console.log(req.body)
    models.User.findOne({
      where: {
        username: username
      }
    }).then(user => {
      if (user) {
        const checkPassword = bcrypt.compareSync(password, user.password); // true
        if (checkPassword) {
          const token = jwt.sign({ user:{
            id: user.id,
            username: user.username
          } }, 'secret');
          res.status(200).json({
            message: 'Success Signin',
            data: { token, role: user.role  }
          })
        } else {
          res.status(403).json({
            message: 'Invalid Signin',
          })
        }
      } else {
          res.status(403).json({
            message: 'Invalid Signin',
          })
      }
    })
  }
};
