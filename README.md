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

The schema is found at `server/src/prisma/schema.prisma`. If you make any changes to the schema, make sure to run `npx prisma migrate dev` in the `server/` directory to create a new migration from the changes in the Prisma schema and automatically apply it. After creating the new migration, run `npx prisma generate` in `server/` to generate the schema used for the database.

To run the server, run `npm run start` in `server/`, which should start the server on `http://localhost:3000`.