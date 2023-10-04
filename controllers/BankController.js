const models = require('../models')
const Op = require('sequelize').Op
const { caching, delCache } = require('../middlewares/redis')
module.exports = {
    all: (req, res) => {
        models.Bank.all().then(bank => {
            caching('Bank', bank)
            res.status(200).json({
                message: 'Success Read Bank',
                data: bank
            })
        }).catch((err) => {
            res.status(500).json({
                message: 'Something Went Wrong'
            })
        })
    },
    me: (req,res) => {
        const { id } = req.bank
        models.Bank.findOne({
          where: {
            id: id
          }
        }).then(bank => {
          res.status(200).json({
            message: 'Success Read Bank',
            data: bank
          })
        }).catch((err) => {
          res.status(500).json({
            message: 'Something Went Wrong'
          })
        })
    },
    find: (req,res) => {
        const { id } = req.params
        models.Bank.findOne({
          where: {
            id: id
          }
        }).then(bank => {
          res.status(200).json({
            message: 'Success Read Bank',
            data: bank
          })
        }).catch((err) => {
          res.status(500).json({
            message: 'Something Went Wrong'
          })
        })    
    },
    index: (req, res) => {
        let { q, page } = req.query
        if (!q) {
          q = ''
        }
        if (!page) {
          page = 1
        }
        let pagination
        let limit = 5
        let offset = 5
        models.Bank.count({
          where: {
            [Op.or]:[
              { nama_bank: {
                  [Op.like]:`%${q}%`
              }},
              { atas_nama: {
                  [Op.like]: `%${q}`
              }},
              { no_rek: {
                [Op.like]: `%${q}`
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
          return  models.Bank.all({
            where: {
              [Op.or]:[
                { nama_bank: {
                    [Op.like]:`%${q}%`
                }},
                { atas_nama: {
                    [Op.like]: `%${q}`
                }},
                { no_rek: {
                  [Op.like]: `%${q}`
                }},
              ]
            },
            limit,
            offset
          })
        }).then(data => {
          const { pages } = pagination
          res.status(200).json({
            message: 'Success Retrieve All Banks',
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
      const { nama_bank, atas_nama, no_rek } = req.body
      models.Bank.create({
        nama_bank,
        atas_nama,
        no_rek
      }).then((bank) => {
        res.status(201).json({
          message: 'Success Create Bank',
          data: bank
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
      const { nama_bank, atas_nama, no_rek } = req.body
      models.Bank.findOne({
        where: { id: id}
      }).then((bank) => {
        if (bank) {
          bank.update({
            nama_bank,
            atas_nama,
            no_rek
          }).then((updatedBank) => {
            res.status(200).json({
              message: 'Success Update Bank',
              data: bank
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
      models.Bank.findOne({
        where: {
          id: id
        }
      }).then((bank) => {
        bank.destroy().then(() => {
          res.status(200).json({
            message: 'Success Delete Bank',
            data: bank
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
    }
}