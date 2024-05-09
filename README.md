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

  - `addSiteRoute.js`: Defines the route for adding sites.
    - `GET /`: Get sites by page.
    - `GET /siteIDs`: Get all site IDs.
    - `GET /totalcount`: Get the total count of sites.
    - `GET /trees/:id`: Get all trees by their IDs for a specific site by the site's ID.
    - `POST /`: Create a site.
    - `PUT /:id`: Edit a site by its ID.
  - `addTreeRoute.js`: Defines the route for adding trees.
    - `GET /totalcount`: Get the total count of trees.
    - `GET /site/:id`: Get all trees in a site by the site's ID.
    - `GET /`: Get all trees.
    - `GET /:id`: Get a tree by its ID.
    - `POST /:id`: Create a tree. This endpoint requires authentication.
  - `users.js`: Defines the routes for user management.
  - `auth.js`: Defines the routes for authentication.
  - `imageReq.js`: Defines the route for image requests.

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

## API Endpoints

- `/tree`: Endpoint for tree-related operations. Uses the [`addTreeRoute`] router.
- `/site`: Endpoint for site-related operations. Uses the [`addSiteRoute`] router.
- `/users`: Endpoint for user-related operations. Uses the [`userRoutes`] router.
- `/login`: Endpoint for authentication. Uses the [`authRoutes`] router.
- `/images`: Endpoint for image requests. Uses the [`images`] router.

## Error Handling

Errors are handled by the middleware in [`middleware/`]. Specific error handling is dependent on the middleware used.
