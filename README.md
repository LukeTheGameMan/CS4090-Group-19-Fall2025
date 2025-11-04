# CS4090-Group-19-Fall2025
## SoundScape
### By Aaron Woody, Ethan Dang, Luke Sinclair
A premise for an online community forum designed for music-related discussions and questions, with the intent of fostering people's interest and talent in music.
<br>
## Objectives
SoundScape's primary features that will be included by the end of the project will be:
* Posts with support for text and various uploaded file types.
* Comments on posts.
* User accounts:
    * Admins
    * Mods
    * Regular users
    * Guests

</br>

## Setting up the server
The server is created using TypeScript and the database uses PostgreSQL. Prisma is used to generate and modify the schemas for the database automatically.

If you are setting it up locally for the first time, run `npm install` in `server/` to install all of the dependencies needed. You will also need to install PostgreSQL and pgAdmin4 to see the database and what is going on.

You will need to create a `.env` file in `server/` so that Prisma knows where to create the database. Add the following line to the .env file.

`DATABASE_URL="postgresql://postgres:PASSWORD@localhost:5432/soundscape_db?schema=public"`

This will tell Prisma to generate the database using `postgres` as the superuser (should be default), and `PASSWORD` as the password (this will need to be changed based on what you set postgres password to in pgAdmin). The server should run on `localhost:5432` and the database name should be `soundscape_db` using the default public schema.

The schema is found at `server/src/prisma/schema.prisma`. If you make any changes to the schema, make sure to run `npx prisma migrate dev` in the `server/` directory to create a new migration from the changes in the Prisma schema and automatically apply it. After creating the new migration, run `npx prisma generate` in `server/` to generate the schema used for the database. **These two commands only need to be ran if you are making changes to the database schema. Please do not make a new migration every time you start the server.**

To run the server, run `npm run start` in `server/`, which should start the server on `http://localhost:3000`.