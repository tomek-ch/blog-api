# Blog API

This is an API for a blog platform (web 2.0 style, anyone can sign up and write) created with Node.js, Express, MongoDB and Mongoose. Authentication is handled using JSON Web Tokens with PassportJS. Express-validator is used for data validation.

**[Live API](https://main-blog-ap-wueawfbgfpl1r7cs-gtw.qovery.io/posts)**

**[Client app](https://github.com/tomek-ch/blog-client)**

## Table of contents

- [Models](#models)
- [Endpoints](#endpoints)
	- [Users](#users)
	- [Posts](#posts)
	- [Comments](#comments)
- [Authentication and authorization](#authentication-and-authorization)
- [Running locally](#running-locally)


## Models

There are three models in this application:

- `User` - represents every authenticated user of the app, contains information about their first name, hashed password, unique username and optionally a last name and a description.

- `Post` - an article on the platform, has a title, a timestamp, an author (`User`), an optional array of tags, a custom excerpt and a boolean value determining whether it's publicly listed. The main text is contained within an array of paragraphs in the following format: `[{heading, body}, {heading, body}]` where paragraphs have optional headings and non-empty bodies.

- `Comment` - a response to either a `Post` or another `Comment`, has an author (`User`), a timestamp, body, and a number of replies to it.


## Endpoints

You can access the resources in a REST fashion like so:

### Users

- `GET /users?username=<beginning of a username>`\
Lists all users or only users whose usernames start with the provided string if `username` parameter is provided.

- `GET /users/<username>`\
Returns information about a user with the provided `username` along with a list of their posts.

- `POST /users`\
Takes a requests body with `username` (must be unique), `firstName` and a `password`. Optionally accepts `lastName` and `description`. Returns user data along with a token for authentication.

- `PUT /users/<user id>`\
Protected route available only to the user with matching id. Takes a request body with any of the user fields that you want to update. Returns user data with newly updated fields. To update the password use `newPassword` field and provide the correct `oldPassword` .

- `DELETE /users/<user id>`\
Protected route available only to the user with matching id. Requires a request body  with `password` field. Deletes the user along with their posts and all of the comments related to their account (comments made by the user, comments under user's post, replies to all those comments). Returns deleted user's data.

### Posts

- `GET /posts?author=<author id>&tags=<tag>&title=<beginning of the title>`\
Returns a list of all published posts, optionally limited to only posts by one `author`, with a particular `tag` or with a `title` starting with the provided string. If used with the `Authorization` header, returns a list of all of the user's posts, published and unpublished.

- `GET /posts/<post id>`\
Returns post data along with its comments.

- `POST /posts`\
Protected route. Takes a request body with a `title`, `excerpt`, `paragraphs` and `isPublished` fields. Optionally accepts an array of `tags`. Creates a post with the authorized user as the `author`.

- `PUT /posts/<post id>`\
Protected route available only to post's `author`. Takes a request body with any of the post fields that you want to update. Returns post data with newly updated fields.

- `DELETE /posts/<post id>`\
Protected route available only to post's `author`. Deletes the post, comments under it and replies to them. Returns deleted post's data.

### Comments

- `GET /comments?comment=<comment id>&author=<author id>&getPost=<boolean value>&newest=<boolean value>`\
Returns a list of comments which are replies to provided `comment` or written by provided `author`.  If `getPost` field is set to `true`, returned comments will have their `post` fields populated. `newest` specifies the order of the returned list.

- `POST /comments`\
Protected route. Takes a request body with a `text` field and either a `post` or a `comment` field, which is the id of the entity that you're replying to. Creates a comment with the authenticated `User` as the `author`.

- `PUT /comments/<comment id>`\
Protected route available only to the comment's `author`. Takes a request body with a `text` field. Returns comment data with newly updated fields.

- `DELETE /comments/<comment id>`\
Protected route available only to the comment's `author`.  Deletes the comment along with replies to it, if it is top level, or decrements the `replyCount` of the comment that it was replying to.

## Authentication and authorization

When creating a `User` using the `POST /users` endpoint, an object with a `token` field is returned. To use this token to access protected routes, add an `Authorization` header to your request and use the token as `Bearer` like this:

`headers: {"Authorization": "Bearer <your token>"}`

You can use the `POST /log-in` endpoint to request a token. It takes a request body with `username` and `password` fields corresponding to an existing `User` and returns the user data along with a token.

To verify a token and fetch associated user's data, make an authorized request to the `/verify-user` endpoint.

## Running locally

Run the following commands to clone and install the project:

`git clone https://github.com/tomek-ch/blog-api`
<br>
`cd blog-api`
<br>
`npm ci`

If you wish to run this API on your machine, you need to create a `.env` file at the root of the project. It requires the following variables to be set:

`DB_KEY=<mongodb connection string>`
<br>
`JWT_SECRET=<a secret string>`

If you want to access this API from a client application, you should also add this variable for CORS:

`CLIENT_URL=<client application url>`

To run the API do:

`npm start`

Or for development with nodemon:

`npm run dev`

To populate the database with sample data, you can run this script, passing your MongoDB connection string to it:

`node utility/populateDb <connection string>`
