const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Woods Endpoints", function() {
  let db;

  const { testUsers, testWoods } = helpers.makeWoodsFixtures();

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

  describe('GET /api/woods', () => {
    context("Given no woods in db", () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get("/api/woods")
          .expect(200, []);
      });
    });

    context("Given woods DO EXIST in db", () => {
      beforeEach("insert woods", () =>
        helpers.seedWoodsTables(db, testUsers, testWoods)
      );

      it("responds with 200 and all of the woods", () => {
        const expectedWoods = testWoods.map(wood =>
          helpers.makeExpectedWood(testUsers, wood)
        );
        return supertest(app)
          .get("/api/woods")
          .expect(200, expectedWoods);
      });
    });
    context(`Given an XSS attack wood`, () => {
      const testUser = helpers.makeUsersArray()[1];
      const { maliciousWood, expectedWood } = helpers.makeMaliciousWood(
        testUser
      );

      beforeEach("insert malicious wood", () => {
        return helpers.seedMaliciousWood(db, testUser, maliciousWood);
      });

      it("removes XSS attack content", () => {
        return supertest(app)
          .get(`/api/woods`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].genus).to.eql(expectedWood.genus);
            expect(res.body[0].species).to.eql(expectedWood.species);
          });
      });
    });
  });

  describe('GET /api/woods/:entry_id', () => {
    context("Given no entries", () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));

      it("responds with 404", () => {
        const entryId = 123456;
        return supertest(app)
          .get(`/api/woods/${entryId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: `Entry doesn't exist` });
      });
    });

    context("Given there are woods in the database", () => {
      beforeEach("insert woods", () =>
        helpers.seedWoodsTables(db, testUsers, testWoods)
      );

      it("responds with 200 and the specified wood", () => {
        const entryId = 2;
        const expectedWood = helpers.makeExpectedWood(
          testUsers,
          testWoods[entryId - 1]
        );

        return supertest(app)
          .get(`/api/woods/${entryId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedWood);
      });
    });

    context(`Given an XSS attack wood`, () => {
        const testUser = helpers.makeUsersArray()[1]
        const {
          maliciousWood,
          expectedWood,
        } = helpers.makeMaliciousWood(testUser)
  
        beforeEach('insert malicious wood', () => {
          return helpers.seedMaliciousWood(
            db,
            testUser,
            maliciousWood,
          )
        })
  
        it('removes XSS attack content', () => {
          return supertest(app)
            .get(`/api/woods/${maliciousWood.id}`)
            .set('Authorization', helpers.makeAuthHeader(testUser))
            .expect(200)
            .expect(res => {
              expect(res.body.genus).to.eql(expectedWood.genus)
              expect(res.body.species).to.eql(expectedWood.species)
            })
        })
      })
  });

});
