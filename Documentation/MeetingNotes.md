# Table of Contents
- [Table of Contents](#table-of-contents)
- [What is this document?](#what-is-this-document)
- [Meeting Notes](#meeting-notes)
  - [[Sept 21, 2021] First Official Meeting](#sept-21-2021-first-official-meeting)
  - [[Sept 23, 2021] Sprint 1 Planning](#sept-23-2021-sprint-1-planning)
  - [[Sept 28, 2021] Genesis (#1)](#sept-28-2021-genesis-1)
  - [[Sept 30, 2021] Genesis (#1)](#sept-30-2021-genesis-1)
  - [::TEMPLATE:: [Month day, year] SPRINT NAME (#SprintNum)](#template-month-day-year-sprint-name-sprintnum)

# What is this document?
This document is a record of all of our team scheduled meetings, which normally take place on Tuesdays/Thursdays at 11am on Teams.

# Meeting Notes

## [Sept 21, 2021] First Official Meeting
40m
- Discussed Project Scope Document
- Distributed initialization tasks (setup frontend, backend, db, server, and define data structure)
- Initial project leader decided: Fred

## [Sept 23, 2021] Sprint 1 Planning
1h 20m
### Standup <!-- omit in toc -->
- Sahil: Initial react project done
- Carter: EC2 instance created
- Joao: MongoDB cluster created
- Nathaniel: Created initial Express & Karate projects
- Fred: Defined basic object structure & APIs
### Dicussions <!-- omit in toc -->
- Carter idea: in production, can add IP restriction (API only accept request from frontend IP)
### Decisions <!-- omit in toc -->
- Build the app as single-page app for now (maybe switch to react router later)
- Start with only "anonymous" messages (maybe add login later)
- First sprint starts now (Genesis) -> [Sept 27 - Oct 8]
- These meeting notes will be kept in a markdown file in the repo under Documentation folder
- Rough definition of the merging process:
  1. Pull request into `dev` branch
  1. At least 2 reviews
  1. Merge it (anyone can do it once has 2 reviews)
  1. At end of sprint, merge `dev` into `master` (triggers production deployment)
### Todo <!-- omit in toc -->
- UI meeting next thursday (bring your ideas!)
- Carter will create users for AWS (remember to activate 2 factor auth)

## [Sept 28, 2021] Genesis (#1)
1h
### Standup <!-- omit in toc -->
- Sahil: Added eslint & jest to backend (todo: add eslint settings)
- Carter: Setup jenkins EC2 instance, will research more about how to setup pipeline
- Joao: Added connection setup with mongoose to MongoDB cluster
- Nathaniel: Prepared to work on API token endpoint
- Fred: Added bootstrap-react & eslint for frontend
### Dicussions <!-- omit in toc -->
- When running tests with DB will probably need to have separate DB instance (or at least unique objects created so tests don't conflict)
- Project plan document posted on D2L (will talk about it later)
### Decisions <!-- omit in toc -->
- Will delete branches once merged (Nathaniel will look into setting the repo rule so it happens automatically)
- Future meeting note updates will be commited directly to dev branch w/o pr & reviews
- When creating a feature branch, add the ticket number at begining of the branch name (same as the one on Trello card, e.g. "DBO-2")
- Further clarified dev process (will be copied to the main README later)
  1. Create branch from `dev` (add the ticker number, e.g. DBO-1 in the branch name) & move Trello card to "In progress"
  2. Do you work, committing locally
  3. Push to repo & create PR (create a "Draft" PR if not ready for review) & move Trello card to "In PR"
  4. Wait for at least 1 dev to review (quick overview of code to make sure no major issues)
  5. Once at least 1 dev review, move Trello card to "Ready for test"
  6. Designated tester pulls the branch, runs automated and manual tests, records relevant results in a comment on the PR. If all good, tester approves the PR and merges the branch.
  7. Once merged, move Trello card to "Done"
  8. Good job! You are done for this feature branch!
### Todo <!-- omit in toc -->
- UI meeting thursday (bring your ideas!)
- Carter will create users for AWS (remember to activate 2 factor auth)
- Fred fix merge issue
- Joao will send .env file (includes db user/password) on slack

## [Sept 30, 2021] Genesis (#1)
0h
### Standup <!-- omit in toc -->
- Sahil: 
- Carter: 
- Joao: 
- Nathaniel: 
- Fred: 
### Dicussions <!-- omit in toc -->
- 
### Decisions <!-- omit in toc -->
- 
### Todo <!-- omit in toc -->
- 

## ::TEMPLATE:: [Month day, year] SPRINT NAME (#SprintNum)
Duration
### Standup <!-- omit in toc -->
- Sahil: 
- Carter: 
- Joao: 
- Nathaniel: 
- Fred: 
### Dicussions <!-- omit in toc -->
- 
### Decisions <!-- omit in toc -->
- 
### Todo <!-- omit in toc -->
- 
