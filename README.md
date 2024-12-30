# School Management System API

The School Management System API provides a comprehensive set of endpoints for managing users, schools, classrooms, and students. This API is designed to support administrative tasks and operations within a school management platform. Authentication is required for most operations, ensuring secure access to sensitive data and functionalities.

## Features

### Authentication

> User signup, login, and logout functionalities.

### User Management (Super admin access only)

> Create, retrieve, and manage user accounts. Modify user roles and delete users.

#### School Management (Super admin access only)

> Create, retrieve, update, and delete school records.

#### Classroom Management (Super admin and admin access only)

> Create, retrieve, update, and manage classrooms within schools.

#### Student Management (Super Admin, admin and limited student Access)

> Enroll students in classrooms, update student profiles, and transfer students between classrooms.

## Setup

Set up a Redis instance running the latest version of Redis as well as an instance of MongoDB running the latest version as well and copy their respective connection URIs

Create a `.env` file and populate it with the keys in the `.example.env` file with their values set to the desired configs

Install Dependencies

```
npm i
```

Run the API

```
npm run dev
```

Open the API documentation in the browser at:

```
https://soar-sms-api.spssekamatte.com
```

## Testing

The API can be tested out easily in the browser without using any 3rd party applications

-   Open the app at `https://.soar-sms-api.spssekamatte.com` and use the page to sign up and then login.
-   Copy the `shortToken` returned on successful Login.
-   Click the "Authorize" button at the top right of the page and paste the token in the input.
-   You can now test all the endpoints your user has the authorization for by expanding the endpoint and clicking the "Try it out" button

## Error Handling

The API uses standard HTTP status codes for responses:

-   `200 OK`: Successful request.
-   `400 Bad Request`: Invalid input.
-   `401 Unauthorized`: Missing or invalid authentication token.
-   `404 Not Found`: Resource not found.
-   `500 Internal Server Error`: Unexpected error.

## Contact

For further inquiries or support, contact the development team at [spssekamatte@gmail.com](spssekamatte@gmail.com).
