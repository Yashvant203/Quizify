# Exam Quiz Backend (Node/Express/Mongoose)

## Quick start

1. Create the project folder and files according to the folder structure.
2. `npm init -y`
3. `npm i express mongoose bcryptjs jsonwebtoken dotenv cors express-validator morgan`
4. `npm i -D nodemon`
5. Copy `.env.example` to `.env` and fill the values.
6. Run DB (local MongoDB) or use MongoDB Atlas and set `MONGO_URI`.
7. `npm run dev` to start the server in development.

## Notes
- Add unique index for users.email in MongoDB or via Mongoose schema.
- Consider storing JWT in HttpOnly cookie for better security.
- Server calculates score — do not trust client-submitted scores.
