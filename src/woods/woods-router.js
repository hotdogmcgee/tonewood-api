const express = require('express')
const WoodsService = require('./woods-service')
const { requireAuth } = require('../middleware/jwt-auth')

const woodsRouter = express.Router()

woodsRouter
    .route('/')
    .get((req, res, next) => {
        WoodsService.getAllWoods(req.app.get('db'))
        .then(woods => {
            res.json(WoodsService.serializeWoods(woods))
        })
        .catch(next)
    })


woodsRouter
    .route('/:entry_id')
    .all(requireAuth)
    .all(checkEntryExists)
    .get((req, res) => {
        res.json(WoodsService.serializeWood(res.entry))
    })

/* async/await syntax for promises */
async function checkEntryExists(req, res, next) {
    try {
      const entry = await WoodsService.getById(
        req.app.get('db'),
        req.params.entry_id
      )
  
      if (!entry)
        return res.status(404).json({
          error: `Entry doesn't exist`
        })
  
      res.entry = entry
      next()
    } catch (error) {
      next(error)
    }
  }

module.exports = woodsRouter