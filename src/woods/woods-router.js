const path = require('path')
const express = require('express')
const WoodsService = require('./woods-service')
const { requireAuth } = require('../middleware/jwt-auth')

const woodsRouter = express.Router()
const jsonBodyParser = express.json()

woodsRouter
    .route('/')
    .get((req, res, next) => {
        const { sort } = req.query

        // if(sort) {
        //   if(!['common_name'].includes(sort)) {
        //     return res.
        //       status(400)
        //       .send('Sort must have common_name');
        //   }
        // }
        // WoodsService.getAllWoods(req.app.get('db'))
        // .then(woods => {

        //   if(sort) {
        //     woods
        //       .sort((a, b) => {
        //         return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
        //     }); 
        //   }  
        //     res.json(WoodsService.serializeWoods(woods))
        // })
        res.send('hello')
        // .catch(next)
    })


woodsRouter
    .route('/')
    //auth back in
    .post( jsonBodyParser, (req, res, next) => {
      const { genus, species, common_name, user_id } = req.body
      const newWood = { genus, species, common_name, user_id }

      for(const [key, value] of Object.entries(newWood)) {
        if (value == null) {
            return res.status(400).json({
                error: { message: `Missing '${key}' in request body`}
            })
        }
    }

    //how do i get user 
    // newWood.user_id = req.user.id

    WoodsService.insertWood(
      req.app.get('db'),
            newWood
        )
            .then(wood => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl + `/${wood.id}`))
                    .json(WoodsService.serializeWood(wood))
            })
            .catch(next)
    })



woodsRouter
    .route('/:entry_id')
    // .all(requireAuth)
    .all(checkEntryExists)
    .get((req, res) => {
        res.json(WoodsService.serializeWood(res.entry))
    })

woodsRouter
    .route('/:entry_id/submissions')
    // .all(requireAuth)
    .all(checkEntryExists)
    .get((req, res, next) => {
      WoodsService.getSubmissionsForWood(
        req.app.get('db'),
        req.params.entry_id
      )
      .then(subs => {
        res.json(subs.map(WoodsService.serializeWoodSubmission))
      })
      .catch(next)
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