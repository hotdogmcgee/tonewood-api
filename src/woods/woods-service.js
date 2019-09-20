const xss = require('xss')
const Treeize = require('treeize')

//why is userFields used in thingful server?
const WoodsService = {
    getAllWoods(db) {
        return db
        .from('tonewoods AS tw')
        .select(
            'tw.id',
            'tw.genus',
            'tw.species',
            'tw.common_name',
            'tw.date_created',
            'tw.hardness',
            ...userFields,
            db.raw(
              'count(DISTINCT sub) AS number_of_submissions'
            )
        )
        .leftJoin(
          'submissions as sub',
          'tw.id',
          'sub.tw_id'
        )
        .leftJoin(
            'tw_users AS usr',
            'tw.user_id',
            'usr.id'
        )
        .groupBy('tw.id', 'usr.id')
    },

    getById(db, id) {
      return WoodsService.getAllWoods(db)
        .where('tw.id', id)
        .first()
    },

    insertWood(knex, newWood) {
        return knex
          .insert(newWood)
          .into('tonewoods')
          .returning('*')
          .then(rows => {
            return rows[0]
          })
    },

    getSubmissionsForWood(db, tw_id) {
      return db
        .from('submissions AS sub')
        .select(
          'sub.id',
          'sub.date_created',
          'sub.user_id',
          'sub.tw_id',
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
          ...userFields,
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
        .where('sub.tw_id', tw_id)
        .leftJoin(
          'tw_users AS usr',
          'sub.user_id',
          'usr.id'
        )
        .groupBy('sub.id', 'usr.id')
    },

    serializeWoods(woods) {
        return woods.map(this.serializeWood)
      },
      serializeWood(wood) {
        const woodTree = new Treeize()
    
        // Some light hackiness to allow for the fact that `treeize`
        // only accepts arrays of objects, and we want to use a single
        // object.
        const woodData = woodTree.grow([ wood ]).getData()[0]
    
        return {
          id: woodData.id,
          genus: xss(woodData.genus),
          species: xss(woodData.species),
          common_name: xss(woodData.common_name),
          date_created: woodData.date_created,
          hardness: woodData.hardness,
          user: woodData.user || {},
          number_of_submissions: Number(woodData.number_of_submissions) || 0
        }
      },

      serializeWoodSubmission(sub) {
        const { user } = sub
        return {
          id: sub.id,
          date_created: new Date(sub.date_created),
          user_id: sub.user_id,
          tw_id: sub.tw_id,
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
    
    module.exports = WoodsService