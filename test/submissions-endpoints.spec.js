const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe.only("Submissions Endpoints", function() {
  let db;

  const { testWoods, testUsers, testSubmissions } = helpers.makeWoodsFixtures();

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));

  describe(`POST /api/submissions`, () => {
    beforeEach("insert woods", () =>
      helpers.seedWoodsTables(db, testUsers, testWoods)
    );

    it(`creates a submission, responding with 201 and the new submission`, function() {
      this.retries(3);
      const testWood = testWoods[0];
      const testUser = testUsers[0];
      const newSubmission = {
        comments: "Test new submission comment",
        tw_id: testWood.id,
        user_id: testWood.user_id,
        density: '2.01',
        e_long: '2.01',
        e_cross: '2.01',
        velocity_sound_long: '4.01',
        radiation_ratio: '4.01',
        sample_length: '4.01',
        sample_width: '1.01',
        sample_thickness: '1.01',
        sample_weight_grams: '1.01',
        peak_hz_long_grain: '1.01',
        peak_hz_cross_grain: '1.01',
      };

      //returns a string
      // Number(4).toFixed(2)

      return supertest(app)
        .post('/api/submissions')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .send(newSubmission)
        .expect(201)
        .expect(res => {
        //maybe use .toBeCloseTo?
          expect(res.body).to.have.property("id");

          expect(res.body.user.id).to.eql(testUser.id);
          expect(res.body.tw_id).to.eql(newSubmission.tw_id);
          expect(res.body.density).to.eql(newSubmission.density);
          expect(res.body.e_long).to.eql(newSubmission.e_long);
          expect(res.body.e_cross).to.eql(newSubmission.e_cross);
          expect(res.body.velocity_sound_long).to.eql(
            newSubmission.velocity_sound_long
          );
          expect(res.body.radiation_ratio).to.eql(
            newSubmission.radiation_ratio
          );
          expect(res.body.sample_length).to.eql(newSubmission.sample_length);
          expect(res.body.sample_width).to.eql(newSubmission.sample_width);
          expect(res.body.sample_thickness).to.eql(
            newSubmission.sample_thickness
          );
          expect(res.body.sample_weight_grams).to.eql(
            newSubmission.sample_weight_grams
          );
          expect(res.body.peak_hz_long_grain).to.eql(
            newSubmission.peak_hz_long_grain
          );
          expect(res.body.peak_hz_cross_grain).to.eql(
            newSubmission.peak_hz_cross_grain
          );
          expect(res.body.comments).to.eql(newSubmission.comments);

          expect(res.headers.location).to.eql(
            `/api/submissions/${res.body.id}`
          );
          const expectedDate = new Date().toLocaleString("en", {
            timeZone: "UTC"
          });
          const actualDate = new Date(res.body.date_created).toLocaleString();
          expect(actualDate).to.eql(expectedDate);
        })
        .expect(res =>
          db
            .from("submissions")
            .select("*")
            .where({ id: res.body.id })
            .first()
            .then(row => {
              expect(row.user_id).to.eql(testUser.id);
              expect(row.tw_id).to.eql(newSubmission.tw_id);
              expect(row.density).to.eql(newSubmission.density);
              expect(row.e_long).to.eql(newSubmission.e_long);
              expect(row.e_cross).to.eql(newSubmission.e_cross);
              expect(row.velocity_sound_long).to.eql(
                newSubmission.velocity_sound_long
              );
              expect(row.radiation_ratio).to.eql(newSubmission.radiation_ratio);
              expect(row.sample_length).to.eql(newSubmission.sample_length);
              expect(row.sample_width).to.eql(newSubmission.sample_width);
              expect(row.sample_thickness).to.eql(newSubmission.sample_thickness);
              expect(row.sample_weight_grams).to.eql(
                newSubmission.sample_weight_grams
              );
              expect(row.peak_hz_long_grain).to.eql(
                newSubmission.peak_hz_long_grain
              );
              expect(row.peak_hz_cross_grain).to.eql(
                newSubmission.peak_hz_cross_grain
              );
              expect(row.comments).to.eql(newSubmission.comments);
              const expectedDate = new Date().toLocaleString("en", {
                timeZone: "UTC"
              });
              const actualDate = new Date(row.date_created).toLocaleString();
              expect(actualDate).to.eql(expectedDate);
            })
        );
    });

    const requiredFields = ['tw_id', 'user_id', 'density', 'e_long', 'e_cross', 'velocity_sound_long', 'radiation_ratio', 'sample_length', 'sample_width', 'sample_thickness', 'sample_weight_grams', 'peak_hz_long_grain', 'peak_hz_cross_grain']

    requiredFields.forEach(field => {
        const testWood = testWoods[0]
        const testUser = testUsers[0]
        const newSubmission = {
            comments: "Test new submission comment",
            tw_id: testWood.id,
            user_id: testWood.user_id,
            density: '2.01',
            e_long: '2.01',
            e_cross: '2.01',
            velocity_sound_long: '4.01',
            radiation_ratio: '4.01',
            sample_length: '4.01',
            sample_width: '1.01',
            sample_thickness: '1.01',
            sample_weight_grams: '1.01',
            peak_hz_long_grain: '1.01',
            peak_hz_cross_grain: '1.01',
          };

          it(`responds with 400 and an error message when the '${field}' is missing`, () => {
            delete newSubmission[field]
    
            return supertest(app)
              .post('/api/submissions')
              .set('Authorization', helpers.makeAuthHeader(testUser))
              .send(newSubmission)
              .expect(400, {
                error: `Missing '${field}' in request body`,
              })
          })
    })
  });

  describe('GET /api/submissions', () => {
    context('Given NO submissions', () => {
      beforeEach(() =>
      helpers.seedUsers(db, testUsers)
      )


      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/submissions')
          .expect(200, [])
      })
    })

    context('Given submissions DO EXIST in db', () => {
      beforeEach('insert submissions', () =>
        helpers.seedWoodsTables(
          db,
          testUsers,
          testWoods,
          testSubmissions,
        )
      )

      it('responds with 200 and all of the things', () => {
        const expectedSubmissions = testSubmissions.map(sub =>
          helpers.makeExpectedSubmission(
            testUsers,
            sub,
            testWoods,
          )
        )
        return supertest(app)
          .get('/api/submissions')
          .expect(200, expectedSubmissions)
      })
    })
  })
  describe('GET /api/submissions/:submission_id', () => {

    context('Given NO submissions', () => {
      beforeEach(() =>
      helpers.seedUsers(db, testUsers)
      )

      it(`responds with 404`, () => {
        const submissionId = 123456
        return supertest(app)
          .get(`/api/submissions/${submissionId}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: `Submission doesn't exist` })
      })

    })
    context(`Given submissions DO EXIST in db`, () => {
      beforeEach(() =>
        helpers.seedWoodsTables(db, testUsers, testWoods, testSubmissions)
      )

      it(`responds with 200 and the specified submission`, () => {
        const submissionId = 1
        const expectedSubmission = helpers.makeExpectedSubmission(
          testUsers,
          testSubmissions[submissionId - 1],
          testWoods
        )
        return supertest(app)
          .get(`/api/submissions/${submissionId}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedSubmission)
      })
    })
  })
});
