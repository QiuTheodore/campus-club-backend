
````md
# Campus Club Backend

Campus Club Backend is a Node.js backend project for a campus club management system.  
It provides APIs for user authentication, role-based access control, club management, club applications, event registration, announcements, comments, file uploads, and club gallery images.

---

## Tech Stack

- Node.js
- Express
- Prisma
- SQLite
- JWT
- bcrypt
- multer
- cors
- dotenv
- nodemon

---

## Main Features

### User & Authentication

- Register with `@wku.edu.cn` email only
- Login with email and password
- Password encryption with bcrypt
- JWT-based authentication
- User profile update
- Avatar upload

### Role System

The system supports three roles:

| Role | Description |
|---|---|
| `student` | Normal student user |
| `club_admin` | Club administrator |
| `super_admin` | System administrator |

### Club Management

- Create, update, delete clubs
- Upload club logo
- View club list and club details
- Club gallery image upload
- Gallery image title and description

### Club Application

- Students can apply to join a club
- Application must include a reason
- Club admin can approve or reject applications
- Approved users become club members

### Event Management

- Club admin can publish events
- Event supports title, description, location, time, capacity, and poster
- Students can sign up for events after joining the club
- Club admin can view signup count and signup list

### Announcement

- Club admin can publish announcements
- Announcements support title, content, status, and pinned state
- Club admin can manage announcements under their own clubs

### Comments

- Logged-in users can comment on events
- Users can delete their own comments
- Club admin can delete comments under their own club events
- Super admin can delete any comment

### File Upload

Supported uploads:

| Feature | Folder |
|---|---|
| User avatar | `uploads/avatars` |
| Club logo | `uploads/clubs` |
| Event poster | `uploads/events` |
| Club gallery image | `uploads/gallery` |

Supported image types:

```txt
jpg, jpeg, png, webp
````

---

## Project Structure

```txt
campus-club-backend
│
├── prisma
│   ├── schema.prisma
│   ├── seed.js
│   └── migrations
│
├── src
│   ├── app.js
│   ├── server.js
│   │
│   ├── config
│   │   └── prisma.js
│   │
│   ├── controllers
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── admin.controller.js
│   │   ├── club.controller.js
│   │   ├── event.controller.js
│   │   ├── announcement.controller.js
│   │   ├── comment.controller.js
│   │   └── gallery.controller.js
│   │
│   ├── routes
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── admin.routes.js
│   │   ├── club.routes.js
│   │   ├── event.routes.js
│   │   ├── announcement.routes.js
│   │   ├── comment.routes.js
│   │   └── gallery.routes.js
│   │
│   ├── middleware
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   └── upload.middleware.js
│   │
│   └── utils
│       ├── password.js
│       ├── response.js
│       └── token.js
│
├── uploads
│   ├── avatars
│   ├── clubs
│   ├── events
│   └── gallery
│
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── API_DOCS.md
```

---

## Environment Variables

Create a `.env` file in the project root.

```env
PORT=3000
DATABASE_URL="file:./dev.db"
JWT_SECRET="campus_club_backend_secret_2026"
JWT_EXPIRES_IN="7d"
```

---

## Installation

```bash
npm install
```

If dependencies are missing, install them manually:

```bash
npm install express cors dotenv bcrypt multer jsonwebtoken
npm install prisma @prisma/client
npm install nodemon --save-dev
```

---

## Database Setup

Run Prisma migration:

```bash
npx prisma migrate dev
```

Generate Prisma Client:

```bash
npx prisma generate
```

Seed demo users:

```bash
node prisma/seed.js
```

---

## Run the Server

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

Default server URL:

```txt
http://localhost:3000
```

Health check:

```txt
GET http://localhost:3000/api/health
```

---

## Demo Accounts

After running `node prisma/seed.js`, the following accounts are available:

| Email                  | Password | Role                 |
| ---------------------- | -------- | -------------------- |
| `super@wku.edu.cn`     | `123456` | `super_admin`        |
| `clubadmin@wku.edu.cn` | `123456` | `student` by default |
| `student1@wku.edu.cn`  | `123456` | `student`            |
| `student2@wku.edu.cn`  | `123456` | `student`            |

The `super_admin` can promote `clubadmin@wku.edu.cn` to `club_admin`.

---

## Authentication

This project uses Bearer token authentication.

After login or register, the backend returns a JWT token:

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "JWT_TOKEN",
    "user": {
      "id": 1,
      "email": "super@wku.edu.cn",
      "role": "super_admin"
    }
  }
}
```

For protected APIs, include the token in the request header:

```txt
Authorization: Bearer JWT_TOKEN
```

---

## API Documentation

Detailed request and response parameters are documented separately.

Please see:

```txt
API_DOCS.md
```

or the JSON version:

```txt
campus_club_api_docs.json
```

The API documentation includes:

* endpoint path
* HTTP method
* authentication requirement
* path parameters
* query parameters
* request body
* FormData fields
* response examples
* role permissions

---

## Recommended Demo Flow

1. Login as `super_admin`
2. Promote `clubadmin@wku.edu.cn` to `club_admin`
3. Login as `club_admin`
4. Create a club
5. Upload club logo
6. Upload club gallery images
7. Login as `student1` and `student2`
8. Students apply to join the club with reasons
9. Club admin approves applications
10. Club admin creates an event
11. Club admin uploads event poster
12. Approved students sign up for the event
13. Club admin checks signup count and signup list
14. Club admin publishes announcement
15. Users comment on the event

---

## Notes for Frontend

During local development:

```txt
Backend: http://localhost:3000
```

If frontend and backend run on the same computer, use:

```txt
http://localhost:3000
```

If frontend runs on another computer in the same network, use the backend computer's LAN IP:

```txt
http://<backend-computer-ip>:3000
```

Example:

```txt
http://192.168.1.25:3000
```

---

## GitHub Notes

Do not upload these files or folders:

```txt
node_modules
.env
uploads
prisma/dev.db
prisma/dev.db-journal
```

They should be included in `.gitignore`.

Recommended `.gitignore`:

```txt
node_modules
.env
uploads
prisma/dev.db
prisma/dev.db-journal
.DS_Store
```

---

## Current Status

The backend currently supports:

* User registration and login
* JWT authentication
* Role-based access control
* Super admin user management
* Club management
* Club application review
* Club member management
* Event publishing
* Event signup
* Event signup count and list
* Announcement management
* Event comments
* Club gallery
* Image uploads

This backend is ready for frontend integration and project demo.

```
```
