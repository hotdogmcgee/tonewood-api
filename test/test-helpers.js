const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: "test-user-1",
      full_name: "Test user 1",
      email: "woody@wood.com",
      nickname: "TU1",
      password: "password",
      date_created: "2029-01-22T16:28:32.615Z"
    },
    {
      id: 2,
      user_name: "test-user-2",
      full_name: "Test user 2",
      email: "notwoody@notwood.com",
      nickname: "TU2",
      password: "password",
      date_created: "2029-01-22T16:28:32.615Z"
    },
    {
      id: 3,
      user_name: "test-user-3",
      full_name: "Test user 3",
      email: "maybe@maybe.com",
      nickname: "TU3",
      password: "password",
      date_created: "2029-01-22T16:28:32.615Z"
    },
    {
      id: 4,
      user_name: "test-user-4",
      full_name: "Test user 4",
      email: "steve@evets.com",
      nickname: "TU4",
      password: "password",
      date_created: "2029-01-22T16:28:32.615Z"
    }
  ];
}

function makeWoodsArray(users) {
  return [
    {
      id: 1,
      genus: "First test wood!",
      species: "who knows",
      common_name: 'maple',
      user_id: users[0].id,
      date_created: "2029-01-22T16:28:32.615Z"
    },
    {
      id: 2,
      genus: "Second test wood!",
      species: "balsa",
      common_name: 'balsa',
      user_id: users[1].id,
      date_created: "2029-01-22T16:28:32.615Z"
    },
    {
      id: 3,
      genus: "Third test wood!",
      species: "acacia",
      common_name: 'oak',
      user_id: users[2].id,
      date_created: "2029-01-22T16:28:32.615Z"
    },
    {
      id: 4,
      genus: "Fourth test wood!",
      species: "maple",
      common_name: 'duh, maple',
      user_id: users[3].id,
      date_created: "2029-01-22T16:28:32.615Z"
    }
  ];
}

function makeExpectedWood(users, wood) {
  const user = users.find(user => user.id === wood.user_id);

  return {
    id: wood.id,
    genus: wood.genus,
    species: wood.species,
    date_created: wood.date_created,
    user: {
      id: user.id,
      user_name: user.user_name,
      full_name: user.full_name,
      nickname: user.nickname,
      date_created: user.date_created
    }
  };
}

function makeMaliciousWood(user) {
  const maliciousWood = {
    id: 911,
    date_created: new Date().toISOString(),
    genus: 'Naughty naughty very naughty <script>alert("xss");</script>',
    species: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    user_id: user.id
  };
  const expectedWood = {
    ...makeExpectedWood([user], maliciousWood),
    genus:
      'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;',
    species: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`
  };
  return {
    maliciousWood,
    expectedWood
  };
}

function makeWoodsFixtures() {
  const testUsers = makeUsersArray();
  const testWoods = makeWoodsArray(testUsers);
  return { testUsers, testWoods };
}

function cleanTables(db) {
  return db.raw(
    `TRUNCATE
        tonewoods,
        tw_users
        RESTART IDENTITY CASCADE`
  );
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }));
  return db
    .into("tw_users")
    .insert(preppedUsers)
    .then(() =>
      db.raw(`SELECT setval('tw_users_id_seq', ?)`, [
        users[users.length - 1].id
      ])
    );
}

function seedWoodsTables(db, users, woods) {
  return db
    .into("tw_users")
    .insert(users)
    .then(() => db.into("tonewoods").insert(woods));
}

function seedMaliciousWood(db, user, wood) {
  return db
    .into("tw_users")
    .insert([user])
    .then(() => db.into("tonewoods").insert([wood]));
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: "HS256"
  });

  return `Bearer ${token}`;
}

module.exports = {
  makeAuthHeader,
  makeUsersArray,
  makeWoodsArray,
  makeWoodsFixtures,
  makeExpectedWood,
  makeMaliciousWood,

  cleanTables,
  seedWoodsTables,
  seedUsers,
  seedMaliciousWood
};
