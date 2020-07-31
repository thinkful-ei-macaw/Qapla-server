# Qapla API!


## General Info

This project is the server for Qapla!, which utilizes a database and test database with 3 tables, 3 routers, and 6 endpoints. The Language used for Qapla! is Klingon, the fictional alien language from the Star Trek universe. The words chosen were taken from the Klingon Language Institute, a group founded to develop the fictional language. If interested, here is a link to the Institute's website. https://www.kli.org/

## Technologies Utilizes

* Express
* PostgreSQL
* JavaScript
* NodeJS
* Knex
* Postgrator
* Mocha
* Chai
* Supertest
* Nodemon
* Morgan
* BcryptJS

## API Documentation

## Auth

### POST /api/auth/token

Handles authentication, ensuring proper matches for username and password

JSON takes username as a string, and password as a string

### PUT /api/auth/token

Handles auth token refresh

JSON takes web token

## Language

### GET /api/language

Gets all the languages and words from the db

### GET /api/language/head

Gets current word

### POST /api/language/guess

Handles user guess, updating score

JSON requires guess as string

## User

### POST /api/user

Handles registration

JSON requires a name as string, username as a string that is not taken, password as a string with 7 letters, one uppercase, one number, one special character

## Local dev setup

If using user `devwi`:

```bash
mv example.env .env
createdb -U devwi qapla
createdb -U devwi qapla-test
```

If your `devwi` user has a password be sure to set it in `.env` for all appropriate fields. Or if using a different user, update appropriately.

```bash
npm install
npm run migrate
env MIGRATION_DB_NAME=qapla-test npm run migrate
```

And `npm test` should work at this point

## Configuring Postgres

For tests involving time to run properly, configure your Postgres database to run in the UTC timezone.

1. Locate the `postgresql.conf` file for your Postgres installation.
   1. E.g. for an OS X, Homebrew install: `/usr/local/var/postgres/postgresql.conf`
   2. E.g. on Windows, _maybe_: `C:\Program Files\PostgreSQL\11.2\data\postgresql.conf`
   3. E.g  on Ubuntu 18.04 probably: '/etc/postgresql/10/main/postgresql.conf'
2. Find the `timezone` line and set it to `UTC`:

```conf
# - Locale and Formatting -

datestyle = 'iso, mdy'
#intervalstyle = 'postgres'
timezone = 'UTC'
#timezone_abbreviations = 'Default'     # Select the set of available time zone
```

## Scripts

Start the application `npm start`

Start nodemon for the application `npm run dev`

Run the tests mode `npm test`

Run the migrations up `npm run migrate`

Run the migrations down `npm run migrate -- 0`
