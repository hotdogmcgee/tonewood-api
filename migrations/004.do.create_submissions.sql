CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    date_created TIMESTAMP DEFAULT now() NOT NULL,
    tw_id INTEGER REFERENCES tonewoods(id) ON DELETE CASCADE,
    new_tw_name TEXT DEFAULT NULL,
    user_id INTEGER REFERENCES tw_users(id) ON DELETE CASCADE NOT NULL,
    density NUMERIC(5, 2) NOT NULL,
    e_long NUMERIC(3, 2) NOT NULL,
    e_cross NUMERIC(3, 2) NOT NULL,
    velocity_sound_long NUMERIC(3, 2) NOT NULL,
    radiation_ratio NUMERIC(3, 2) NOT NULL,
    sample_length NUMERIC(5, 2) NOT NULL,
    sample_width NUMERIC(5, 2) NOT NULL,
    sample_thickness NUMERIC(3, 2) NOT NULL,
    sample_weight_grams NUMERIC(5, 2) NOT NULL,
    peak_hz_long_grain NUMERIC(5, 2) NOT NULL,
    peak_hz_cross_grain NUMERIC(5, 2) NOT NULL,
    comments TEXT
);