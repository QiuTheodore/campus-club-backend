# Campus Club Backend

Campus Club Backend is a Node.js + Express backend for a campus club management system.  
It provides APIs for user authentication, role-based permissions, club management, club applications, events, event signups, announcements, club comments, gallery images, and file uploads.

This project is designed for frontend-backend separated development.

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
- JWT Bearer token authentication
- User profile update
- Avatar upload

### Role System

| Role | Description |
|---|---|
| `student` | Normal student user |
| `club_admin` | Club administrator, can manage clubs created by themselves |
| `super_admin` | System administrator, can manage all users, clubs, events, announcements, comments, and gallery images |

### Club Management

- Create, update, and delete clubs
- Upload club logo
- View club list and club details
- Club supports bilingual names:
  - `chineseName`
  - `englishName`
  - `name`
- Club ID is now a random 6-character alphanumeric string, for example:
  - `A7K9Q2`
  - `M3P8XD`
  - `Q92KLA`

### Club Application

- Students can apply to join a club
- Application must include a reason
- Club admin can approve or reject applications
- Approved users automatically become club members

### Event Management

- Club admin can publish events under their own club
- Event supports:
  - title
  - description
  - location
  - start time
  - end time
  - capacity
  - poster
  - status
- Students can sign up for events after joining the club
- Club admin can view event signup count and signup list

### Announcement Management

- Club admin can publish announcements under their own club
- Announcements support:
  - title
  - content
  - status
  - pinned state
- Club admin can manage announcements under their own clubs

### Club Comments

- Comments now belong to clubs, not events
- Logged-in users can comment on clubs
- Users can delete their own comments
- Club admin can delete comments under their own clubs
- Super admin can delete any comment

### Club Gallery

- Each club has a gallery
- Club admin can upload gallery images
- Each gallery image supports:
  - image file
  - title
  - description

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
jpg
jpeg
png
webp
```

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
│       ├── id.js
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

Seed demo data:

```bash
node prisma/seed.js
```

If you want to reset the local database:

```bash
npx prisma migrate reset
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

## Important Frontend Notes

### 1. Club ID is a string

Club IDs are no longer simple numbers.

Correct:

```js
const clubId = "A7K9Q2";
```

Do not do this:

```js
Number(clubId);
```

### 2. Club supports bilingual names

Frontend can display:

```txt
chineseName
englishName
name
```

Recommended display logic:

```txt
Chinese page: chineseName
English page: englishName
Fallback: name
```

### 3. Get events by club

There is no separate route like:

```txt
GET /api/clubs/:clubId/events
```

Use this instead:

```txt
GET /api/events?clubId=A7K9Q2
```

### 4. Comments belong to clubs

Old event comment APIs are no longer used:

```txt
GET /api/events/:id/comments
POST /api/events/:id/comments
```

Use club comment APIs instead:

```txt
GET /api/clubs/:clubId/comments
POST /api/clubs/:clubId/comments
```

---

## API Documentation

Detailed API documentation is in:

```txt
API_DOCS.md
```

The `API_DOCS.md` file follows a KOOK-style API documentation format and includes:

- endpoint URL
- request method
- authentication requirement
- parameter list
- request example
- response parameter explanation
- response example
- file upload fields
- role permission notes

---

## API Summary

Total APIs:

```txt
56
```

### Test APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Backend home test |
| GET | `/api/health` | Health check |

### Auth APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |

### User APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users/me` | Get current user |
| PUT | `/api/users/me` | Update current user |
| POST | `/api/users/me/avatar` | Upload current user avatar |
| GET | `/api/users/me/club-applications` | Get my club applications |
| GET | `/api/users/me/clubs` | Get my joined clubs |
| GET | `/api/users/me/event-signups` | Get my event signups |
| GET | `/api/users/me/comments` | Get my club comments |
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/:id` | Update user by ID |
| POST | `/api/users/:id/avatar` | Upload user avatar by ID |

### Admin APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/users` | Admin get all users |
| GET | `/api/admin/users/:id` | Admin get user by ID |
| PUT | `/api/admin/users/:id/role` | Admin update user role |
| DELETE | `/api/admin/users/:id` | Admin delete user |

### Club APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/clubs` | Get club list |
| GET | `/api/clubs/:id` | Get club detail |
| POST | `/api/clubs` | Create club |
| PUT | `/api/clubs/:id` | Update club |
| DELETE | `/api/clubs/:id` | Delete club |
| POST | `/api/clubs/:id/logo` | Upload club logo |
| POST | `/api/clubs/:id/apply` | Apply to club |
| GET | `/api/clubs/:id/applications` | Get club applications |
| PUT | `/api/clubs/:clubId/applications/:applicationId/approve` | Approve club application |
| PUT | `/api/clubs/:clubId/applications/:applicationId/reject` | Reject club application |
| GET | `/api/clubs/:id/members` | Get club members |
| DELETE | `/api/clubs/:clubId/members/:userId` | Remove club member |

### Event APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/events` | Get event list |
| GET | `/api/events?clubId=:clubId` | Get events of a specific club |
| GET | `/api/events/:id` | Get event detail |
| GET | `/api/events/:id/signup-count` | Get event signup count |
| POST | `/api/clubs/:clubId/events` | Create event |
| PUT | `/api/events/:id` | Update event |
| DELETE | `/api/events/:id` | Delete event |
| POST | `/api/events/:id/poster` | Upload event poster |
| POST | `/api/events/:id/signup` | Sign up for event |
| DELETE | `/api/events/:id/signup` | Cancel event signup |
| GET | `/api/events/:id/signups` | Get event signup list |

### Announcement APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/announcements` | Get announcement list |
| GET | `/api/announcements/:id` | Get announcement detail |
| GET | `/api/clubs/:clubId/announcements` | Get announcements of a club |
| POST | `/api/clubs/:clubId/announcements` | Create announcement |
| PUT | `/api/announcements/:id` | Update announcement |
| DELETE | `/api/announcements/:id` | Delete announcement |
| GET | `/api/manage/announcements` | Get manageable announcements |

### Comment APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/clubs/:clubId/comments` | Get club comments |
| POST | `/api/clubs/:clubId/comments` | Create club comment |
| DELETE | `/api/comments/:commentId` | Delete comment |
| GET | `/api/users/me/comments` | Get my comments |
| GET | `/api/manage/comments` | Get manageable comments |

### Gallery APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/clubs/:clubId/gallery` | Get club gallery |
| POST | `/api/clubs/:clubId/gallery` | Upload club gallery image |
| PUT | `/api/gallery/:imageId` | Update gallery image title and description |
| DELETE | `/api/gallery/:imageId` | Delete gallery image |

---

## File Upload Summary

| Feature | API | Field | Max Size |
|---|---|---|---|
| User avatar | `POST /api/users/me/avatar` | `avatar` | 2MB |
| User avatar by ID | `POST /api/users/:id/avatar` | `avatar` | 2MB |
| Club logo | `POST /api/clubs/:id/logo` | `logo` | 2MB |
| Event poster | `POST /api/events/:id/poster` | `poster` | 2MB |
| Club gallery image | `POST /api/clubs/:clubId/gallery` | `image` | 5MB |

Uploaded file URL examples:

```txt
http://localhost:3000/uploads/avatars/avatar-xxx.png
http://localhost:3000/uploads/clubs/club-logo-xxx.png
http://localhost:3000/uploads/events/event-poster-xxx.png
http://localhost:3000/uploads/gallery/gallery-xxx.png
```

---

## Demo Accounts

After running `node prisma/seed.js`, demo accounts may include:

| Email | Password | Role |
|---|---|---|
| `super@wku.edu.cn` | `123456` | `super_admin` |
| `clubadmin@wku.edu.cn` | `123456` | `student` or `club_admin` depending on seed |
| `student1@wku.edu.cn` | `123456` | `student` |
| `student2@wku.edu.cn` | `123456` | `student` |

If `clubadmin@wku.edu.cn` is still a student, use the super admin account to promote it to `club_admin`.

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
15. Users comment on the club
16. Club admin manages club comments

---

## Local Development Notes

If frontend and backend run on the same computer:

```txt
Backend: http://localhost:3000
Frontend: http://localhost:5173
```

Frontend can call:

```js
fetch("http://localhost:3000/api/clubs")
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

- User registration and login
- JWT authentication
- Role-based access control
- Super admin user management
- Bilingual club management
- Random 6-character club IDs
- Club application review
- Club member management
- Event publishing
- Event signup
- Event signup count and list
- Announcement management
- Club comments
- Club gallery
- Image uploads
- KOOK-style API documentation in `API_DOCS.md`

This backend is ready for frontend integration and project demo.