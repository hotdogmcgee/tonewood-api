CREATE TYPE tonewood_category AS ENUM (
    'Hardwood',
    'Softwood'
);

ALTER TABLE tonewoods
    ADD COLUMN
    hardness tonewood_category;