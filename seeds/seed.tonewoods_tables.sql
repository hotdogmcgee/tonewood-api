BEGIN;

TRUNCATE
    tonewoods,
    tw_users
    RESTART IDENTITY CASCADE;

INSERT INTO tw_users (user_name, full_name, email, password)
VALUES
('Joe', 'Joe Schmo', 'joe@joe.com', '$2a$12$G5B2qw/JnCDrZftmviC.BOsXV9mdCVJLGjCaLHTFydCZSU2N8kM5C'),
('Cally', 'Callista Cool', 'cally@cally.com', '$2a$12$55f1Ak42D8S50SiWV8BoY.VI4kccM7DGR66.LLCPxWsrTFmohU9Oi'),
('ilovebalsa', 'Dan Balsa', 'dan@dan.com', '$2a$12$iTe5ufv0o2YVzGoaayEh/.q6kb0XrJq4ZA6gPWCou5dIdPwmP.662'),
('Jeremy', ' Jeremy Clark', 'jeremy@52instruments.com', '$2a$12$QTEkcpLIKwbUiRNvE5vKouKRxZMGzUe87GREAUMssD/npTipxLxdS'),
('Mike', 'Mike', 'mike@indianhillguitars.com', '$2a$12$0zhtQxOGgEn8Q2hp3dNf9e9EjKZO9IPlgumkPD/mG2vbSobSkUkF2'),
('Musicandwood', 'mandw', 'musicandwood@gmail.com', '$2a$12$wMCurwAT72cYdFc80JjR7ut3EOYBsrpYhB7kj7Xiy9XDUBU52g9lG'),
('Theo', 'Theo P', 'theophile.pourchet@gmail.com', '$2a$12$fab5SajtMvKNnDKAA2k3dehsn9EG5UBCENBbru1mODZV2pBc7Klv6'),
('Maxime', 'Maxime', 'maxime@guitaresbaron.com', '$2a$12$/g42X2Od1/CusWeMj7TsaOlwbd1aCJcWim/pxVU1wrmd2crEKaSy6' ),
('Dallaire', 'Dallaire Walker', 'dallairewalkerluthier@gmail.com', '$2a$12$CsScHBqrzN.Gr.M1rz6BZ.44SPy534tE5pbI7Byoj0k8I4xfQBfAO' );


INSERT INTO tonewoods (common_name, genus, species, hardness, user_id)
VALUES
('Other', 'genus', 'species', 'Softwood', 5),
('White Spruce', 'Picea', 'glauca', 'Softwood', 6),
('Engelmann Spruce', 'Picea', 'engelmannii', 'Softwood', 7),
('Western Red Cedar', 'Thuja', 'plicata', 'Softwood', 8),
('American Ash', 'Fraxinus', 'americana', 'Hardwood', 9);

INSERT INTO submissions (tw_id, user_id, density, e_long, e_cross, velocity_sound_long, radiation_ratio, sample_length, sample_width, sample_thickness, sample_weight, peak_hz_long_grain, peak_hz_cross_grain, comments)
VALUES
(1, 1, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 'great!'),
(3, 3, 3.00, 3.00, 3.00, 3.00, 3.00, 3.00, 3.00, 3.00, 3.00, 3.00, 3.00, 'NICE' ),
(2, 2, 2.00, 2.00, 2.00, 2.00, 2.00, 2.00, 2.00, 2.00, 2.00, 2.00, 2.00,  'it was decent!'),

(2, 1, 3.00, 3.00, 3.00, 3.00, 3.00, 3.00, 3.00, 3.00, 3.00, 3.00, 3.00, 'wowowowow' );


COMMIT;
