BEGIN;

TRUNCATE
    tonewoods,
    tw_users
    RESTART IDENTITY CASCADE;

INSERT INTO tw_users (user_name, full_name, nickname, password)
VALUES
('Joe', 'Joe Schmo', 'Joey', 'pass-j'),
('Cally', 'Callista Cool', 'hahahsdjsahbdjsabd', 'goodpassword'),
('ilovebalsa', 'Dan Balsa', 'The Balsa Master', 'balsabalsabalsa');

INSERT INTO tonewoods (genus, species, user_id)
VALUES
('something', 'and then', 1),
('balsa', 'wood', 3),
('green', 'tree', 2);

COMMIT;
