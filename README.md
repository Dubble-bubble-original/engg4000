# Production Ready Web Application

## Contributors
Nathaniel Caron\
Carter James MacLennan\
Joao Viana Rocha Pontes\
Sahil Saini\
Frederic Verret

# Development Process Workflow

## 1. Make a new feature branch from `dev`
```
git fetch
git checkout -b <new_branch_name> origin/dev
git push -u origin HEAD
```
- Replace `<new_branch_name>` with the name of your branch. Your branch name should include the ticket number (e.g., `DBO-4`) along with optional descriptive words (e.g., `DBO-5-refactor-authentication`, `DBO-8-user-content-cache-key`, `DBO-15-make-retina-avatars`) so that others can see what is being worked on.
- `push -u` is an easy way to push the branch to the remote repository and get the "upstream tracking" set up correctly.
- Remember to move the Trello card to "In progress".

## 2. Implement feature
- Remember to commit & push often as you make changes and work on the feature.
- Before pushing changes to the repo, make sure you run the unit tests & code linting and fix any issues:
   ```
   npm run test
   npm run lint
   ```
   > Remember that both backend & frontend have their own tests & lint settings so if you modify both you should run these commands in both directories.
- If others are also working on the same branch as you, you might need to pull their changes using `git pull` (or `git pull --rebase`).
- If other PRs are merged into `dev` before yours, you will need to pull the new changes from `dev` using `git pull origin dev`.

## 3. Create pull request
Go to our repository page, select your branch, then select "Compare & pull request".
1. Make sure the base branch is `dev` (this means your work will be merged into `dev`).
2. Add a title (what feature did you work on?), and a description if you have details to add.
3. If your code is ready for review, click "Create Pull Request". If you are not done working on it, use the dropdown and select "Create Draft Pull Request" (once you are done, you can mark it as ready for review).
- Remember to move the Trello card to "In PR"

## 4. Review process
1. Wait for at least 1 dev review (another dev does an overview of your code to make sure there are no major issues/things missing). After at least 1 dev review, you can move the Trello card to "Ready for test".
2. The designated tester will pull the branch locally, run all automated tests, do some manual testing to verify the functionality, and record the testing results in a comment on the PR. (the tester will add themselves to the Trello card and move the card to "In Test" so we know who is doing it)
   1. If tester found issues, they will tell the developer (Trello card moves back to "In progress" until issue is fixes, then the review process restarts).
   2. If tester has not found issues, they will approve the request & merge it into `dev`.
3. Once merged, move the Trello card to "Done"
4. Good job!

## Final Notes:
When setting up your environment for the first time I recommend installing `npm-merge-driver`. This will auto-resolve any conflicts that happen in the package-lock.json file when merging with someone else's changes (those conflicts are a pain to do manually). Just run this command once you have installed `node.js` on your computer: (The `--global` will install it globally for your computer so you will have it for all projects)
```
npx npm-merge-driver install --global
```
- Note: If there are also conflicts in `package.json`, you will have to solve those manually. Once you have fixed it, run `npm install --package-lock-only` to fix the `package-lock.json` accordingly.
- Source: https://npm.community/t/dealing-with-package-lock-json-conflicts/902

# Codebase Sections
## Backend
To run the Express service locally, use the following commands inside of the Service directory:\
`npm install`\
`npm run dev`

To run the service using pm2, use the following commands inside of the Service directory:\
`npm install`\
`pm2 start app.js`

To kill the process run by pm2, use the following command inside of the Service directory:\
`pm2 stop app.js`

pm2 must be installed globally in order to use the above commands:\
`npm install pm2 -g`

## Frontend

To run the React app locally in development mode, use the following command inside of the application directory:\
`npm start`\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.\
The page will reload if you make edits.\
You will also see any lint errors in the console.

`npm test`\
Launches the test runner in the interactive watch mode.

`npm run build`\
Builds the app for production to the `build` folder.

## Testing
### Jest Unit Tests
To run all the unit test use the following command:\
`npm run test`

To run jest covearge for the entier product run the following command:\
`npm run test:coverage`

To see the unit test changes in real time, and to automatically run the tests when the files are changed use the follwoing command:\
`npm run test:watch`

### Karate Tests
#### Command line:
All API feature files can be run using the following maven command inside of the automation directory:\
`mvn test -Dtest=ServiceTests  -Dkarate.env="dev"`

All UI feature files can be run using the following maven command inside of the automation directory:\
`mvn test -Dtest=UiTests -Dkarate.env="dev"`

#### Intellij Idea:
Feature files can be run individually in Intellij IDEA by right-clicking on the feature and selecting the green play button (a run configureation is required).

#### Reports:
Tests results reports can be found here:\
Automation/target/karate-reports/

#### Important:
All API feature files should be placed in the `api` directory.\
All UI feature files should be placed in the `ui` directory.\
All UI feature files should have the `@ui` tag at the top of the file.
