# What is this?
This document summarizes best practices that all team members should follow when making code changes.
Best practices are developped during meeting conversations (see `MeetingNotes.md`) or in PR comments/discussions. They are compiled here for easy reference.
This list of best practices will grow organically as we continue to work on the project.

# General
- Follow the development process (this is outlined in `README.md`)
- 
# Frontend
- 
# Backend
- All API endpoints should go through the token verification function (`API.verifyAuthToken`).
- Always log errors inside endpoints:
  - For user errors, use `logger.info` (these logs are useful for debugging/understanding what happens).
  - For code errors, use `logger.error` (these logs tell us if there is an issue with our code).
# Testing
## Jest (Unit Testing)
- Make sure your test cases are independent. This means:
  - The outcome of a test should not influence others.
  - Tests should not share data (if they are modifying it).
  - See the documentation on [Setup and Teardown for Jest](https://jestjs.io/docs/setup-teardown).
- Always aim for 100% code coverage (use the Jest coverage tool to check: `npm run test:coverage`)
- Group unit tests together in a logical manner using `describe` blocks.
  - Remember: you can have `describe` blocks inside `describe` blocks!
## Karate (UI & API Testing)
- 
# Database
- **Instructions**: How to make a new Schema
  1. Open `../Service/dbSchema.js`
  2. Define the new schema as `const <name>Schema = new Schema({});`
  3. Write the JSON structure of the data. Mongoose Schema docs https://mongoosejs.com/docs/guide.html (explains data types)
  4. Define the Schema's model after the schema definition as `const <Name> = mongoose.model('<Name>', <name>Schema);`
  5. Add the model's name to the `module.exports` at the EOF.
- **When to make a new Schema?**
  - If you want to add a new collection(aka: data table) to the DB.
- **Using Schemas Code Examples:**
  1. Define the schema variable at the top of the file that you're developing. `const Schema = require('./dbSchema');`
  2. Define the collection schema variable. `let <name> = Schema.<Name>;`
  3. Perform queries with the collection schema variable. `<name>.find({})`
