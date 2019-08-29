CREATE TABLE tonewoods (
    id SERIAL PRIMARY KEY,
    genus TEXT NOT NULL,
    species TEXT NOT NULL,
    common_name TEXT NOT NULL,
    date_created TIMESTAMP DEFAULT now() NOT NULL
);