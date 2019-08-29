CREATE TABLE tonewoods (
    id SERIAL PRIMARY KEY,
    genus TEXT NOT NULL,
    species TEXT NOT NULL,
    common_name TEXT NOT NULL,
    date_created TIMESTAMP DEFAULT now() NOT NULL
);

--then alter table
CREATE TYPE hardness AS ENUM (
    'Hardwood',
    'Softwood'
)

ALTER TABLE tonewoods
    ADD COLUMN
    style hardness;

--add email address column to users