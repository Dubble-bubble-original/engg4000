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
- 
