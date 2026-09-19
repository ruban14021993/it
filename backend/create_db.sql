-- Create database user and database for InfinityMind Tech
-- Run as postgres superuser: psql -U postgres -f create_db.sql

CREATE USER infinity_user WITH PASSWORD 'infinity_pass';
CREATE DATABASE infinitydb OWNER infinity_user;
GRANT ALL PRIVILEGES ON DATABASE infinitydb TO infinity_user;
