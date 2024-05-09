# Project Documentation

## Overview

This is a Node.js application that uses Express.js for routing and MongoDB for data storage. The application provides APIs for managing trees, sites, users, and images.

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the server with `node index.js`

## Application Structure

- `index.js`: The entry point to the application. This file defines our express server, requires the routes and models used in the application. It also contains middleware for error handling and for parsing the JSON body to `req.body`.

- `routes/`: This folder contains all the route definitions for our API. Each file corresponds to a route on the router.

  - `addSiteRoute.js` : Defines the route for adding sites. The actual endpoints are:
    - `GET /site`: Get sites by page.
    - `GET /site/siteIDs`: Get all site IDs.
    - `GET /site/totalcount`: Get the total count of sites.
    - `GET /site/trees/:id`: Get all trees by their IDs for a specific site by the site's ID.
    - `POST /site`: Create a site.
    - `PUT /site/:id`: Edit a site by its ID.
  - `addTreeRoute.js`: Defines the route for adding trees. The actual endpoints are:
    - `GET /tree/totalcount`: Get the total count of trees.
    - `GET /tree/site/:id`: Get all trees in a site by the site's ID.
    - `GET /tree`: Get all trees.
    - `GET /tree/:id`: Get a tree by its ID.
    - `POST /tree/:id`: Create a tree. This endpoint requires authentication.
  - `users.js`: Defines the routes for user management. The actual endpoints are:
    - `GET /users`: Get all users.
    - `POST /users`: Create a new user.
    - `PUT /users/:id`: Update a user.
    - `DELETE /users/:id`: Delete a user.
  - `auth.js`: Defines the routes for authentication. The actual endpoints are:
    - `POST /auth/login`: Authenticate a user and return a token.
    - `POST /auth/register`: Register a new user.
  - `imageReq.js`: Defines the route for image requests. The actual endpoint is:
    - `GET /images/:id`: Get an image by its ID.

- `models/`: This folder contains the schema definitions for our Mongoose models.

  - `sites.js`: Defines the schema for sites.
  - `trees.js`: Defines the schema for trees.
  - `user.js`: Defines the schema for users.

- `middleware/`: This folder contains custom-built middleware for handling validation and authentication.

  - `admin.js`: Middleware for admin-related tasks.
  - `auth.js`: Middleware for authentication.
  - `validObjectId.js`: Middleware for validating object IDs.

## Environment Variables

- `PORT`: The port on which the server will listen.
- `MONGO_URI`: The URI of the MongoDB database.
- `AWS_ACCESS_KEY_ID`: Your AWS access key ID for accessing AWS services.
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret access key for accessing AWS services.
- `AWS_REGION`: The AWS region where your resources are located.
- `AWS_BUCKET_NAME`: The name of the AWS S3 bucket used for storing files.
- `JWTPRIVATEKEY`: The private key used for signing and verifying JSON Web Tokens (JWTs).

## API Endpoints

- `/tree`: Endpoint for tree-related operations. Uses the [`addTreeRoute`] router.
- `/site`: Endpoint for site-related operations. Uses the [`addSiteRoute`] router.
- `/users`: Endpoint for user-related operations. Uses the [`userRoutes`] router.
- `/login`: Endpoint for authentication. Uses the [`authRoutes`] router.
- `/images`: Endpoint for image requests. Uses the [`images`] router.

## Error Handling

Errors are handled by the middleware in [`middleware/`]. Specific error handling is dependent on the middleware used.
