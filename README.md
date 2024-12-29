# School Management System API

## Overview

The School Management System API provides a comprehensive set of endpoints for managing users, schools, classrooms, and students. This API is designed to support administrative tasks and operations within a school management platform. Authentication is required for most operations, ensuring secure access to sensitive data and functionalities.

## Features

-   User Management
    -   Create, retrieve, and manage user accounts.
    -   Modify user roles and delete users.
-   Authentication
    -   User signup, login, and logout functionalities.
-   School Management
    -   Create, retrieve, update, and delete school records.
-   Classroom Management
    -   Create, retrieve, update, and manage classrooms within schools.
-   Student Management
    -   Enroll students in classrooms, update student profiles, and transfer students between classrooms.

## Authentication

The API uses token-based authentication. Each request requiring authentication must include a `Bearer` token in the Authorization header:

```
Authorization: Bearer <your_token_here>
```

## Base URL

```
http://localhost:{{PORT}}/api
```

## Endpoints

### Auth Endpoints

#### 1. User Signup

-   **Endpoint**: `POST /api/auth/signup`
-   **Description**: Allows a new user to register.
-   **Request Body**:
    ```json
    {
        "username": "string",
        "password": "string",
        "email": "string",
        "name": "string"
    }
    ```
-   **Response**:
    ```json
    {
        "message": "User signed up successfully."
    }
    ```

#### 2. User Login

-   **Endpoint**: `POST /api/auth/login`
-   **Description**: Authenticates a user.
-   **Request Body**:
    ```json
    {
        "username": "string",
        "password": "string"
    }
    ```
-   **Response**:
    ```json
    {
        "token": "your_token_here"
    }
    ```

#### 3. User Logout

-   **Endpoint**: `POST /api/auth/logout`
-   **Description**: Logs out the authenticated user.

### User Endpoints

#### 1. Create New User

-   **Endpoint**: `POST /api/user/newUser`
-   **Description**: Creates a new user account by an authenticated administrator.
-   **Request Body**:
    ```json
    {
        "username": "string",
        "password": "string",
        "email": "string",
        "name": "string"
    }
    ```
-   **Response**:
    ```json
    {
        "message": "User created successfully."
    }
    ```

#### 2. Get All Users

-   **Endpoint**: `GET /api/user/getUsers`
-   **Description**: Retrieves a list of all users.
-   **Response**:
    ```json
    [
        {
            "id": "string",
            "username": "string",
            "email": "string"
        }
    ]
    ```

#### 3. Find User by Username

-   **Endpoint**: `GET /api/user/findUser`
-   **Description**: Fetches details of a specific user.
-   **Query Parameters**:
    -   `username` (string): Username to search for.

#### 4. Change User Role

-   **Endpoint**: `PATCH /api/user/changeUserRole`
-   **Description**: Updates the role of a specified user.
-   **Request Body**:
    ```json
    {
        "username": "string",
        "role": "string"
    }
    ```

#### 5. Delete User

-   **Endpoint**: `DELETE /api/user/deleteUser`
-   **Description**: Removes a user from the system.

### School Endpoints

#### 1. Create School

-   **Endpoint**: `POST /api/school/createSchool`
-   **Description**: Adds a new school to the system.
-   **Request Body**:
    ```json
    {
        "name": "string",
        "desc": "string",
        "administrators": ["string"]
    }
    ```

#### 2. Get All Schools

-   **Endpoint**: `GET /api/school/getSchools`
-   **Description**: Retrieves a list of all schools.

#### 3. Find School by Slug

-   **Endpoint**: `GET /api/school/findSchool`
-   **Description**: Fetches details of a school.
-   **Query Parameters**:
    -   `slug` (string): Slug of the school.

#### 4. Update School Details

-   **Endpoint**: `PATCH /api/school/updateSchool`
-   **Description**: Updates the details of a school.
-   **Request Body**:
    ```json
    {
        "id": "string",
        "name": "string"
    }
    ```

#### 5. Delete School

-   **Endpoint**: `DELETE /api/school/deleteSchool`
-   **Description**: Deletes a school.

### Classroom Endpoints

#### 1. Create Classroom

-   **Endpoint**: `POST /api/classroom/createClassroom`
-   **Description**: Creates a new classroom within a school.
-   **Request Body**:
    ```json
    {
        "name": "string",
        "capacity": "integer",
        "school": "string",
        "courses": ["string"],
        "students": ["string"]
    }
    ```

#### 2. Get All Classrooms

-   **Endpoint**: `GET /api/classroom/getClassrooms`
-   **Description**: Retrieves a list of classrooms in a school.

#### 3. Find Classroom by Slug

-   **Endpoint**: `GET /api/classroom/findClassroom`
-   **Description**: Fetches details of a classroom.
-   **Query Parameters**:
    -   `slug` (string): Slug of the classroom.
    -   `school` (string): School ID.

#### 4. Update Classroom Details

-   **Endpoint**: `PATCH /api/classroom/updateClassroom`
-   **Description**: Updates classroom details.

### Student Endpoints

#### 1. Enroll Student

-   **Endpoint**: `POST /api/student/enrollStudent`
-   **Description**: Enrolls a student in a classroom.
-   **Request Body**:
    ```json
    {
        "user": "string",
        "classroom": "string",
        "courses": ["string"]
    }
    ```

#### 2. Update Student Profile

-   **Endpoint**: `PATCH /api/student/updateStudentProfile`
-   **Description**: Updates a student's profile.

#### 3. Transfer Student

-   **Endpoint**: `PATCH /api/student/transferStudent`
-   **Description**: Transfers a student to another classroom.

## Error Handling

The API uses standard HTTP status codes for responses:

-   `200 OK`: Successful request.
-   `400 Bad Request`: Invalid input.
-   `401 Unauthorized`: Missing or invalid authentication token.
-   `404 Not Found`: Resource not found.
-   `500 Internal Server Error`: Unexpected error.

## Contact

For further inquiries or support, contact the development team at [spssekamatte@gmail.com](spssekamatte@gmail.com).
