````md
# Campus Club Backend

A backend system for a campus club management platform.  
This project provides APIs for user authentication, role-based authorization, club management, event management, club applications, announcements, comments, gallery images, file uploads, and homepage highlights.

The system is designed for a university club platform where students can discover clubs, apply to join clubs, register for events, and interact with club content. Club administrators can manage their own clubs, while the super administrator can manage the whole system.

---

## 1. Tech Stack

- Node.js
- Express.js
- Prisma ORM
- SQLite
- JWT Authentication
- Multer File Upload
- bcrypt Password Hashing

---

## 2. Main Features

### Authentication

- User registration
- User login
- JWT token-based authentication
- Password hashing with bcrypt
- WKU email-based user accounts

### User Management

- Get current user profile
- Update current user profile
- Upload user avatar
- View personal club applications
- View joined clubs
- View event signups
- View user comments

### Admin Management

- Super admin can view all users
- Super admin can view a single user
- Super admin can update user roles
- Super admin can delete users

### Club Management

- Create clubs
- View all clubs
- View club details
- Search clubs
- Update clubs
- Delete clubs
- Upload club logos
- Support bilingual club names:
  - `chineseName`
  - `englishName`
  - `name`

### Club Applications and Members

- Students can apply to join clubs
- Club admins can view applications for their own clubs
- Club admins can approve applications
- Club admins can reject applications
- Club admins can remove club members
- Removed members can apply again

### Event Management

- Create events under a club
- View all events
- View events by club
- View event details
- Update events
- Delete events
- Upload event posters
- Students can sign up for events
- Students can cancel event signups
- Club admins can view event signup lists
- Event signup count is supported

### Announcement Management

- Create club announcements
- View all announcements
- View announcements by club
- View announcement details
- Update announcements
- Delete announcements
- Manage announcements as club admin or super admin

### Club Comments

- Comments belong to clubs, not events
- Students can comment on clubs
- Users can delete their own comments
- Club admins can manage comments under their own clubs
- Super admin can manage all comments

### Club Gallery

- Each club can have gallery images
- Club admins can upload gallery images
- Each image can include:
  - image file
  - title
  - description
- Gallery image metadata can be updated
- Gallery images can be deleted

### Homepage Highlights

The backend provides a highlight API for frontend homepage display:

```txt
GET /api/highlights
````

Response data format:

```js
[
  {
    club: Club,
    image: string,
    text: string
  }
]
```

The highlight image is selected in this priority order:

```txt
event poster -> gallery image -> club logo
```

---

## 3. Roles and Permissions

The system has three user roles:

| Role          | Description          |
| ------------- | -------------------- |
| `student`     | Regular student user |
| `club_admin`  | Club administrator   |
| `super_admin` | System administrator |

### Permission Rules

| Role          | Permissions                                                                   |
| ------------- | ----------------------------------------------------------------------------- |
| `student`     | Browse clubs, apply to clubs, sign up for events, comment on clubs            |
| `club_admin`  | Manage only the clubs created by themselves                                   |
| `super_admin` | Manage all users, clubs, events, comments, announcements, and gallery content |

Club admin permission is mainly checked using:

```js
user.role === "club_admin" && club.createdById === user.id
```

Super admin can manage all clubs:

```js
user.role === "super_admin"
```

Frontend can use the same logic to decide whether to show management buttons, but real authorization is always enforced by the backend.

---

## 4. ID System

All major database IDs use UUID v4 strings.

Examples:

```txt
User ID:             550e8400-e29b-41d4-a716-446655440000
Club ID:             1f3b6f1a-9c12-4d3a-88f0-b8c91f8e2e31
Event ID:            a28f4d4c-55f4-45a4-a05e-9b3e3c5b7f92
Announcement ID:     34df0ef8-9a35-4c33-a648-7d3c7d6c61c
Comment ID:          9c771cb9-31d5-4e1e-96d3-8ddf6e52f2d6
Gallery Image ID:    d8f8a734-7f18-4e73-98f6-d1accc9aa4e9
```

Frontend should treat all IDs as strings.

Do not use:

```js
Number(id)
parseInt(id)
```

---

## 5. Project Structure

```txt
campus-club-backend
│
├── prisma
│   ├── dev.db
│   ├── schema.prisma
│   ├── seed.js
│   ├── demo-seed.js
│   ├── demo-images.js
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
│   │   ├── admin.controller.js
│   │   ├── announcement.controller.js
│   │   ├── auth.controller.js
│   │   ├── club.controller.js
│   │   ├── comment.controller.js
│   │   ├── event.controller.js
│   │   ├── gallery.controller.js
│   │   ├── highlight.controller.js
│   │   └── user.controller.js
│   │
│   ├── middleware
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   └── upload.middleware.js
│   │
│   ├── routes
│   │   ├── admin.routes.js
│   │   ├── announcement.routes.js
│   │   ├── auth.routes.js
│   │   ├── club.routes.js
│   │   ├── comment.routes.js
│   │   ├── event.routes.js
│   │   ├── gallery.routes.js
│   │   ├── highlight.routes.js
│   │   └── user.routes.js
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
├── API_DOCS.md
├── README.md
├── package.json
└── .env
```

---

## 6. Installation

Install dependencies:

```bash
npm install
```

For Windows PowerShell, if `npm` is blocked by script policy, use:

```powershell
npm.cmd install
```

---

## 7. Environment Variables

Create a `.env` file in the project root.

Example:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your_jwt_secret"
JWT_EXPIRES_IN="7d"
PORT=3000
```

Do not upload `.env` to GitHub.

---

## 8. Database Setup

Generate Prisma client:

```bash
npx prisma generate
```

Run migrations:

```bash
npx prisma migrate dev
```

For Windows:

```powershell
npx.cmd prisma generate
npx.cmd prisma migrate dev
```

---

## 9. Running the Backend

Start development server:

```bash
npm run dev
```

For Windows:

```powershell
npm.cmd run dev
```

Default local backend URL:

```txt
http://localhost:3000
```

Health check:

```txt
GET http://localhost:3000/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "Server is healthy"
}
```

---

## 10. Demo Database

The project includes a demo database for presentation and frontend integration.

Current demo data includes:

* 1 super admin
* 5 club admins
* 2 student users
* 5 clubs
* 5 club member president records
* 5 events
* 5 event posters
* 5 club comments
* 5 gallery images
* 5 club logos
* 5 announcements

The 5 demo clubs are:

```txt
Street Dance Club
Food Lovers Club
Light by Light Psychology Club
French Club
Turing Computer Club
```

Each club includes:

* club description
* purpose
* mission
* logo
* one event
* one event poster
* one comment
* one gallery image
* one club admin as president

---

## 11. Demo Accounts

All demo accounts use the same password:

```txt
123456
```

### Super Admin

```txt
super@wku.edu.cn
```

### Club Admins

```txt
1235882@wku.edu.cn    Ethan Miller       Street Dance Club
1235883@wku.edu.cn    Sophia Johnson     Food Lovers Club
1235884@wku.edu.cn    Liam Anderson      Light by Light Psychology Club
1235885@wku.edu.cn    Olivia Brown       French Club
1235886@wku.edu.cn    Noah Wilson        Turing Computer Club
```

### Student Users

```txt
1235887@wku.edu.cn    Ava Martinez
1235888@wku.edu.cn    Lucas Thompson
```

---

## 12. Demo Seed Scripts

### Create Demo Users and Clubs

Run:

```bash
node prisma/demo-seed.js
```

This script will:

* clear old business data
* delete all users except super admin
* create 7 demo users
* create 5 clubs
* create one event for each club
* create one comment for each club
* create one announcement for each club
* assign each club admin as president of their club

### Import Demo Images

Put demo images into:

```txt
demo-images/
```

Then run:

```bash
node prisma/demo-images.js
```

This script will:

* copy logo images into `uploads/clubs`
* copy event posters into `uploads/events`
* copy gallery images into `uploads/gallery`
* update `Club.logo`
* update `Event.poster`
* create `ClubGalleryImage` records

---

## 13. File Uploads

Images are stored in the `uploads/` folder.
The database only stores image paths.

Example:

```txt
/uploads/clubs/turing-logo.png
/uploads/events/turing-event.png
/uploads/gallery/turing-gallery.png
```

Supported image types:

```txt
jpg
jpeg
png
webp
gif
avif
```

Upload folders:

| Type          | Folder            |
| ------------- | ----------------- |
| User avatar   | `uploads/avatars` |
| Club logo     | `uploads/clubs`   |
| Event poster  | `uploads/events`  |
| Gallery image | `uploads/gallery` |

When sharing the demo database with the frontend team, provide both:

```txt
prisma/dev.db
uploads/
```

If only `dev.db` is shared, the database will contain image paths, but the actual images will not display.

---

## 14. API Overview

The backend currently provides 57 endpoints.

| Module       | Count |
| ------------ | ----: |
| Test         |     2 |
| Auth         |     2 |
| User         |    11 |
| Admin        |     4 |
| Club         |    12 |
| Event        |    10 |
| Announcement |     7 |
| Comment      |     4 |
| Gallery      |     4 |
| Highlight    |     1 |
| Total        |    57 |

Detailed API documentation is available in:

```txt
API_DOCS.md
```

---

## 15. Main API Summary

### Test

```txt
GET /
GET /api/health
```

### Auth

```txt
POST /api/auth/register
POST /api/auth/login
```

### Users

```txt
GET    /api/users/me
PUT    /api/users/me
POST   /api/users/me/avatar
GET    /api/users/me/club-applications
GET    /api/users/me/clubs
GET    /api/users/me/event-signups
GET    /api/users/me/comments
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id
POST   /api/users/:id/avatar
```

### Admin

```txt
GET    /api/admin/users
GET    /api/admin/users/:id
PUT    /api/admin/users/:id/role
DELETE /api/admin/users/:id
```

### Clubs

```txt
GET    /api/clubs
GET    /api/clubs/:id
POST   /api/clubs
PUT    /api/clubs/:id
DELETE /api/clubs/:id
POST   /api/clubs/:id/logo
POST   /api/clubs/:id/apply
GET    /api/clubs/:id/applications
PUT    /api/clubs/:clubId/applications/:applicationId/approve
PUT    /api/clubs/:clubId/applications/:applicationId/reject
GET    /api/clubs/:id/members
DELETE /api/clubs/:clubId/members/:userId
```

### Events

```txt
GET    /api/events
GET    /api/events?clubId=:clubId
GET    /api/events/:id
GET    /api/events/:id/signup-count
POST   /api/clubs/:clubId/events
PUT    /api/events/:id
DELETE /api/events/:id
POST   /api/events/:id/poster
POST   /api/events/:id/signup
DELETE /api/events/:id/signup
GET    /api/events/:id/signups
```

### Announcements

```txt
GET    /api/announcements
GET    /api/announcements/:id
GET    /api/clubs/:clubId/announcements
POST   /api/clubs/:clubId/announcements
PUT    /api/announcements/:id
DELETE /api/announcements/:id
GET    /api/manage/announcements
```

### Comments

```txt
GET    /api/clubs/:clubId/comments
POST   /api/clubs/:clubId/comments
DELETE /api/comments/:commentId
GET    /api/manage/comments
```

### Gallery

```txt
GET    /api/clubs/:clubId/gallery
POST   /api/clubs/:clubId/gallery
PUT    /api/gallery/:imageId
DELETE /api/gallery/:imageId
```

### Highlights

```txt
GET /api/highlights
GET /api/highlights?limit=4
```

Response example:

```json
{
  "success": true,
  "message": "Highlights fetched successfully",
  "data": [
    {
      "club": {
        "id": "club uuid",
        "name": "Turing Computer Club",
        "chineseName": "图灵计算机社",
        "englishName": "Turing Computer Club",
        "description": "A student-led technology club for coding, software development, AI exploration, hackathons, and peer learning.",
        "logo": "/uploads/clubs/turing-logo.png"
      },
      "image": "/uploads/events/turing-event.png",
      "text": "AI Tools for Student Projects · A beginner-friendly workshop on using AI tools for coding, research, presentation design, and project development."
    }
  ]
}
```

---

## 16. Authentication Format

Protected endpoints require a Bearer token.

Header format:

```txt
Authorization: Bearer <token>
```

Example:

```txt
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6...
```

---

## 17. Standard Response Format

### Success

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "message": "Error message"
}
```

---

## 18. Frontend Integration Notes

Important notes for frontend developers:

1. All IDs are UUID strings.
2. Do not convert IDs to numbers.
3. Use `Authorization: Bearer <token>` for protected APIs.
4. Image URLs are relative paths.
5. To display images, prefix the backend base URL if needed.

Example:

```js
const imageUrl = `${baseUrl}${club.logo}`;
```

Example logo path:

```txt
/uploads/clubs/turing-logo.png
```

Example full URL:

```txt
http://localhost:3000/uploads/clubs/turing-logo.png
```

---

## 19. Current Demo Use Case

The current demo database is designed for a full presentation flow:

1. A visitor can browse clubs.
2. A visitor can view club details.
3. A student can log in.
4. A student can apply to join a club.
5. A club admin can review applications.
6. A club admin can approve or reject applications.
7. A student can sign up for an event.
8. A student can comment on a club.
9. A club admin can manage events, comments, announcements, and gallery images.
10. A super admin can manage users and roles.

---

## 20. GitHub Notes

The following files or folders should not be uploaded:

```txt
.env
node_modules/
```

The following demo files can be uploaded for presentation purposes:

```txt
prisma/dev.db
uploads/
```

If `dev.db` or `uploads/` are ignored by `.gitignore`, force add them:

```bash
git add -f prisma/dev.db
git add -f uploads/
```

Commit example:

```bash
git add .
git add -f prisma/dev.db
git add -f uploads/
git commit -m "Update final demo backend database and assets"
git push origin main
```

---

## 21. Final Project Status

The backend is ready for demo presentation.

It supports:

* complete user authentication
* role-based access control
* club management
* club applications
* member management
* event management
* event signup
* announcement management
* comments
* gallery images
* file uploads
* homepage highlights
* demo database
* demo images
* Postman testing
* frontend integration

The backend can support a complete campus club platform demo with real data, images, and role-based workflows.

```
```
