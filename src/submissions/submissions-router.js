    
const express = require('express')
const path = require('path')
const SubmissionsService = require('./submissions-service')
const { requireAuth } = require('../middleware/jwt-auth')

const submissionsRouter = express.Router()
const jsonBodyParser = express.json()

submissionsRouter
  .route('/')
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const { tw_id, user_id, density, e_long, e_cross, velocity_sound_long, radiation_ratio, sample_length, sample_width, sample_thickness, sample_weight_grams, peak_hz_long_grain, peak_hz_cross_grain, comments } = req.body
    const newSubmission = { tw_id, user_id, density, e_long, e_cross, velocity_sound_long, radiation_ratio, sample_length, sample_width, sample_thickness, sample_weight_grams, peak_hz_long_grain, peak_hz_cross_grain, comments }

    for (const [key, value] of Object.entries(newSubmission))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })

    newSubmission.user_id = req.user.id

    SubmissionsService.insertSubmission(
      req.app.get('db'),
      newSubmission
    )
      .then(submission => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${submission.id}`))
          .json(SubmissionsService.serializeSubmission(submission))
      })
      .catch(next)
    })

    submissionsRouter
    .route('/:submission_id')
    .get(requireAuth, (req, res, next) => {

    })

module.exports = submissionsRouter