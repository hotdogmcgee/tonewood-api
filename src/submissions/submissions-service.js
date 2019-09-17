const xss = require('xss')

const SubmissionsService = {
  getAllSubmissions(db) {
    return db
      .from('submissions AS sub')
      .select(
        'sub.id',
        'sub.date_created',
        'sub.user_id',
        'sub.tw_id',
        'sub.new_tw_name',
        'sub.density',
        'sub.e_long',
        'sub.e_cross',
        'sub.velocity_sound_long',
        'sub.radiation_ratio',
        'sub.sample_length',
        'sub.sample_width',
        'sub.sample_thickness',
        'sub.sample_weight',
        'sub.peak_hz_long_grain',
        'sub.peak_hz_cross_grain',
        'sub.comments',
        // ...userFields,
        db.raw(
          `json_strip_nulls(
            row_to_json(
              (SELECT tmp FROM (
                SELECT
                  usr.id,
                  usr.user_name,
                  usr.email,
                  usr.full_name,
                  usr.nickname,
                  usr.date_created,
                  usr.date_modified
              ) tmp)
            )
          ) AS "user"`
        )
      )
      .leftJoin(
        'tw_users AS usr',
        'sub.user_id',
        'usr.id',
      )
  },

  getById(db, id) {
    return SubmissionsService.getAllSubmissions(db)
      .where('sub.id', id)
      .first()
  },

  insertSubmission(db, newSubmission) {
    return db
      .insert(newSubmission)
      .into('submissions')
      .returning('*')
      .then(([sub]) => sub)
      .then(sub =>
        SubmissionsService.getById(db, sub.id)
      )
  },

  serializeSubmissions(submissions) {
    return submissions.map(this.serializeSubmission)
  },

  serializeSubmission(sub) {
    const { user } = sub
    return {
      id: sub.id,
      date_created: new Date(sub.date_created),
      user_id: sub.user_id,
      tw_id: sub.tw_id,
      new_tw_name: sub.new_tw_name,
      density: sub.density,
      e_long: sub.e_long,
      e_cross: sub.e_cross,
      velocity_sound_long: sub.velocity_sound_long,
      radiation_ratio: sub.radiation_ratio,
      sample_length: sub.sample_length,
      sample_width: sub.sample_width,
      sample_thickness: sub.sample_thickness,
      sample_weight: sub.sample_weight,
      peak_hz_long_grain: sub.peak_hz_long_grain,
      peak_hz_cross_grain: sub.peak_hz_cross_grain,
      comments: xss(sub.comments),
      user: {
        id: user.id,
        user_name: user.user_name,
        email: user.email,
        full_name: user.full_name,
        nickname: user.nickname,
        date_created: new Date(user.date_created),
        date_modified: new Date(user.date_modified) || null
      },
    }
  }
}

const userFields = [
  'usr.id AS user:id',
  'usr.user_name AS user:user_name',
  'usr.full_name AS user:full_name',
  'usr.email AS user:email',
  'usr.nickname AS user:nickname',
  'usr.date_created AS user:date_created',
  'usr.date_modified AS user:date_modified',
]

module.exports = SubmissionsService
