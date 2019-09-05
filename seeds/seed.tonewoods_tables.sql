BEGIN;

TRUNCATE
    tonewoods,
    tw_users
    RESTART IDENTITY CASCADE;

INSERT INTO tw_users (user_name, full_name, email, nickname, password)
VALUES
('Joe', 'Joe Schmo', 'joe@joe.com', 'Joey', '$2a$12$G5B2qw/JnCDrZftmviC.BOsXV9mdCVJLGjCaLHTFydCZSU2N8kM5C'),
('Cally', 'Callista Cool', 'cally@cally.com', 'hahahsdjsahbdjsabd', '$2a$12$55f1Ak42D8S50SiWV8BoY.VI4kccM7DGR66.LLCPxWsrTFmohU9Oi'),
('ilovebalsa', 'Dan Balsa', 'dan@dan.com', 'The Balsa Master', '$2a$12$iTe5ufv0o2YVzGoaayEh/.q6kb0XrJq4ZA6gPWCou5dIdPwmP.662');

INSERT INTO tonewoods (genus, species, common_name, user_id)
VALUES
('First test wood!', 'and then', 'maple', 1),
('balsa', 'very balsa', 'def balsa', 3),
('green', 'tree', 'green tree!', 2);

INSERT INTO submissions (tw_id, user_id, density, e_long, e_cross, velocity_sound_long, radiation_ratio, sample_length, sample_width, sample_thickness, sample_weight_grams, peak_hz_long_grain, peak_hz_cross_grain, comments)
VALUES
(1, 1, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 'great!'),
(3, 3, 3.00, 3.00, 3.00, 3.00, 3.00, 3.00, 3.00, 3.00, 3.00, 3.00, 3.00, 'NICE' ),
(2, 2, 2.00, 2.00, 2.00, 2.00, 2.00, 2.00, 2.00, 2.00, 2.00, 2.00, 2.00,  'it was decent!'),

(2, 1, 3.00, 3.00, 3.00, 3.00, 3.00, 3.00, 3.00, 3.00, 3.00, 3.00, 3.00, 'wowowowow' );


COMMIT;
