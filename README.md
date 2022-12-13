g# Northcoders House of Games API

## Background (will edit later)

We will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as reddit) which should provide this information to the front end architecture.

Your database will be PSQL, and you will interact with it using [node-postgres](https://node-postgres.com/).

### Seeding

### Setting up database connection to test and development databases

You will need to create two .env files for your project: .env.test and .env.development. Into each, add PGDATABASE=<database_name_here> (see /db/setup.sql for the database names), with the correct database name for that environment (use the `example.env` as a template). Double check that these .env files are .gitignored.

_dotenv is a [module that loads environment variables from a .env file into the process.env global object]

You have been provided with a `db` folder with some data, a setup.sql file and a seeds folder.please take some time to familiarise yourself with the project structure.

## Drop the existing tables

The `seed` script provided for you in the `package.json` will run the `seed` function with the dev data. Use the `seed` script to check your `seed` function is working as intended. 

You will need to run the `setup.sql` file to create the databases first.



### Build the api 

Time to go into business and get the api setup. Your task is to make a flexible endpoint that clients can use to query all the data they will need about the state of their games.

It's essential that the endpoint is tested, including a test for each query! Avoid testing for too many things in one assertion.
It might be worth using a very small dataset (you can use the data in your `./db/data/test-data.js` file!).


### 1. GET /api/categories

This endpoint should allow clients to view all the categories currently available.

E.g.
```js
{
  "categories": [
    // ... category objects
  ]
}
```

### 2. Get /api/reviews

This endpoint should allow clients to view all the reviews currently available.

- each review should have the following keys:
    -   review_id
    -   title
    -   designer
    -   owner
    -   review_img_url
    -   category
    -   created_at
    -   votes
    -   **comment_count** which is the total count of all the comments with this review_id

default sort criteria: **date**
default sort order: **descending**

- `/api/reviews`, first result should be the latest review (default)

> **Hint:** Some properties on the response might need to be coerced into numbers to check whether they are sorted correctly. Check out [the documentation for jest-sorted](https://www.npmjs.com/package/jest-sorted#user-content-tobesorted).


### 3. Get /api/reviews/:review_id

This endpoint should allow clients to view a single review matched by review_id.

- each review should have the following keys:
    -   review_id
    -   title
    -   designer
    -   owner
    -   review_img_url
    -   review_body
    -   category
    -   created_at
    -   votes

E.g.

```js
// GET /api/review/2
{
  "review":{
    review_id: 2,
    title: 'Jenga',
    designer: 'Leslie Scott',
    owner: 'philippaclaire9',
    review_img_url:'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
    review_body: 'Fiddly fun for all the family',
    category: 'dexterity',
    created_at: '2021-01-18T10:01:41.251Z',
    votes: 5
  }
}
```

### 4. Get /api/reviews/:review_id/comments

This endpoint should allow clients to view an array of comments for the given review_id of which 

- Each comment should have the following keys:
  - comment_id
  - votes
  - created_at
  - author
  - body
  - review_id



E.g.

```js
// GET /api/review/2/comments
{
  "comments": [
     {
    comment_id: 1
    body: 'I loved this game too!',
    votes: 16,
    author: 'bainesface',
    review_id: 2,
    created_at: new Date(1511354613389),
  },
  {
    comment_id: 4
    body: 'EPIC board game!',
    votes: 16,
    author: 'bainesface',
    review_id: 2,
    created_at: new Date(1511354163389),
  },
  {
    comment_id: 5
    body: 'Now this is a story all about how, board games turned my life upside down',
    votes: 13,
    author: 'mallionaire',
    review_id: 2,
    created_at: new Date(1610965445410),
  },
  ]
}
```







**Please ensure you work through the tickets in numerical order.**

## Git Branching and Pull Requests

You will be working on each ticket on a new **branch**.

To create and switch to a new git branch use the command:

```
git checkout -b <new branch name>
```

This will create a branch and move over to that branch. (Omit the `-b` flag if you wish to switch to an already existing branch).

We recommend that you name the branch after the number assigned to each ticket via the header. eg. `ncnews-1`

When pushing the branch to git hub ensure that you make reference to the branch you are pushing to on the remote.

```
git push origin <branch name>
```

From github you can make a pull request and share the link and ticket number via a pull request specific nchelp using the command `nchelp pr`. A tutor will swing by to review your code. Ensure that you keep your trello up to date whilst you await the PR approval. Regular `nchelp` will be available for when you need support.

Once a pull request been accepted be sure to switch back to the main branch and pull down the updated changes.

```
git checkout main

git pull origin main
```

You can tidy up your local branches once they have been pull into main by deleting them:

```
git branch -D <local branch>
```

## Husky

To ensure we are not commiting broken code this project makes use of git hooks. Git hooks are scripts triggered during certain events in the git lifecycle. Husky is a popular package which allows us to set up and maintain these scripts. This project makes use a _pre-commit hook_. When we attempt to commit our work, the script defined in the `pre-commit` file will run. If any of our tests fail than the commit will be aborted.

The [Husky documentation](https://typicode.github.io/husky/#/) explains how to configure Husky for your own project as well as creating your own custom hooks.\_
