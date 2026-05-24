````md
# API_DOCS.md

# Campus Club Backend API Docs

Base URL:

```txt
http://localhost:3000
```

Authentication:

```txt
Authorization: Bearer <token>
```


---

## 1. Common Response Format

### Success

```json
{
  "success": true,
  "message": "Success message",
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

## 2. Roles

| Role | Description |
|---|---|
| `student` | 普通学生用户 |
| `club_admin` | 社团管理员，只能管理自己创建的社团 |
| `super_admin` | 超级管理员，可以管理所有用户、社团、活动和内容 |

---

## 3. Common Data Models

### User

```json
{
  "id": 1,
  "email": "student1@wku.edu.cn",
  "role": "student",
  "name": "Student One",
  "studentId": "9000003",
  "major": "Computer Science",
  "grade": "Junior",
  "bio": "Demo student account.",
  "avatar": "/uploads/avatars/avatar-xxx.png",
  "createdAt": "2026-05-21T07:10:33.371Z",
  "updatedAt": "2026-05-21T07:10:33.371Z"
}
```

### Club

```json
{
  "id": 1,
  "name": "Computer Science Club",
  "description": "A club for programming and AI.",
  "category": "Academic",
  "logo": "/uploads/clubs/club-logo-xxx.png",
  "status": "active",
  "createdById": 2,
  "createdAt": "2026-05-21T07:10:33.371Z",
  "updatedAt": "2026-05-21T07:10:33.371Z"
}
```

### Event

```json
{
  "id": 1,
  "clubId": 1,
  "title": "AI Coding Workshop",
  "description": "A workshop about AI tools and coding.",
  "location": "WKU CBPM Building",
  "startTime": "2026-06-01T15:00:00.000Z",
  "endTime": "2026-06-01T17:00:00.000Z",
  "capacity": 30,
  "poster": "/uploads/events/event-poster-xxx.png",
  "status": "published",
  "registeredCount": 2,
  "remainingSeats": 28
}
```

### Announcement

```json
{
  "id": 1,
  "clubId": 1,
  "createdById": 2,
  "title": "Event Reminder",
  "content": "Please arrive 10 minutes early.",
  "status": "published",
  "isPinned": true,
  "createdAt": "2026-05-21T07:10:33.371Z",
  "updatedAt": "2026-05-21T07:10:33.371Z"
}
```

### Event Comment

```json
{
  "id": 1,
  "eventId": 1,
  "userId": 3,
  "content": "Looking forward to this event!",
  "createdAt": "2026-05-21T07:10:33.371Z",
  "updatedAt": "2026-05-21T07:10:33.371Z"
}
```

### Club Gallery Image

```json
{
  "id": 1,
  "clubId": 1,
  "uploadedById": 2,
  "imageUrl": "/uploads/gallery/gallery-xxx.png",
  "title": "Club Orientation",
  "description": "New members joined our first meeting.",
  "createdAt": "2026-05-21T07:10:33.371Z",
  "updatedAt": "2026-05-21T07:10:33.371Z"
}
```

---

# 4. Test APIs

## 4.1 Backend Home

| Item | Value |
|---|---|
| Method | `GET` |
| URL | `/` |
| Auth | No |

Response:

```json
{
  "success": true,
  "message": "Campus Club Backend API is running"
}
```

---

## 4.2 Health Check

| Item | Value |
|---|---|
| Method | `GET` |
| URL | `/api/health` |
| Auth | No |

Response:

```json
{
  "success": true,
  "message": "Server is healthy"
}
```

---

# 5. Auth APIs

## 5.1 Register

| Item | Value |
|---|---|
| Method | `POST` |
| URL | `/api/auth/register` |
| Auth | No |

Request Body:

```json
{
  "email": "student@wku.edu.cn",
  "password": "123456",
  "name": "Student Name",
  "studentId": "1234567",
  "major": "Computer Science",
  "grade": "Senior"
}
```

Request Rules:

| Field | Required | Type | Notes |
|---|---|---|---|
| email | Yes | String | Must end with `@wku.edu.cn` |
| password | Yes | String | Minimum 6 characters |
| name | No | String | User name |
| studentId | No | String | Unique student ID |
| major | No | String | Major |
| grade | No | String | Grade |

Response `data`:

```json
{
  "token": "JWT_TOKEN",
  "user": {
    "id": 1,
    "email": "student@wku.edu.cn",
    "role": "student",
    "name": "Student Name",
    "studentId": "1234567",
    "major": "Computer Science",
    "grade": "Senior",
    "bio": null,
    "avatar": null
  }
}
```

---

## 5.2 Login

| Item | Value |
|---|---|
| Method | `POST` |
| URL | `/api/auth/login` |
| Auth | No |

Request Body:

```json
{
  "email": "super@wku.edu.cn",
  "password": "123456"
}
```

Request Rules:

| Field | Required | Type |
|---|---|---|
| email | Yes | String |
| password | Yes | String |

Response `data`:

```json
{
  "token": "JWT_TOKEN",
  "user": {
    "id": 1,
    "email": "super@wku.edu.cn",
    "role": "super_admin",
    "name": "Super Admin"
  }
}
```

---

# 6. User APIs

## 6.1 Get Current User

| Item | Value |
|---|---|
| Method | `GET` |
| URL | `/api/users/me` |
| Auth | Login required |

Request:

```txt
No body
```

Response `data`:

```json
{
  "id": 1,
  "email": "student1@wku.edu.cn",
  "role": "student",
  "name": "Student One",
  "studentId": "9000003",
  "major": "Computer Science",
  "grade": "Junior",
  "bio": "Demo student account.",
  "avatar": null,
  "createdAt": "2026-05-21T07:10:33.371Z",
  "updatedAt": "2026-05-21T07:10:33.371Z"
}
```

---

## 6.2 Update Current User

| Item | Value |
|---|---|
| Method | `PUT` |
| URL | `/api/users/me` |
| Auth | Login required |

Request Body:

```json
{
  "name": "Theodore Qiu",
  "studentId": "1234567",
  "major": "Computer Science",
  "grade": "Senior",
  "bio": "I like software development."
}
```

Request Fields:

| Field | Required | Type |
|---|---|---|
| name | No | String |
| studentId | No | String |
| major | No | String |
| grade | No | String |
| bio | No | String |

Response `data`:

```json
{
  "id": 1,
  "email": "student1@wku.edu.cn",
  "role": "student",
  "name": "Theodore Qiu",
  "studentId": "1234567",
  "major": "Computer Science",
  "grade": "Senior",
  "bio": "I like software development.",
  "avatar": null
}
```

---

## 6.3 Upload Current User Avatar

| Item | Value |
|---|---|
| Method | `POST` |
| URL | `/api/users/me/avatar` |
| Auth | Login required |
| Content-Type | `multipart/form-data` |

FormData:

| Field | Required | Type |
|---|---|---|
| avatar | Yes | File |

Response `data`:

```json
{
  "id": 1,
  "email": "student1@wku.edu.cn",
  "avatar": "/uploads/avatars/avatar-xxx.png"
}
```

---

## 6.4 Get My Club Applications

| Item | Value |
|---|---|
| Method | `GET` |
| URL | `/api/users/me/club-applications` |
| Auth | Login required |

Response `data`:

```json
[
  {
    "id": 1,
    "clubId": 1,
    "userId": 3,
    "reason": "I want to improve my coding skills.",
    "status": "pending",
    "club": {
      "id": 1,
      "name": "Computer Science Club"
    }
  }
]
```

---

## 6.5 Get My Clubs

| Item | Value |
|---|---|
| Method | `GET` |
| URL | `/api/users/me/clubs` |
| Auth | Login required |

Response `data`:

```json
[
  {
    "id": 1,
    "clubId": 1,
    "userId": 3,
    "role": "member",
    "joinedAt": "2026-05-21T07:10:33.371Z",
    "club": {
      "id": 1,
      "name": "Computer Science Club"
    }
  }
]
```

---

## 6.6 Get My Event Signups

| Item | Value |
|---|---|
| Method | `GET` |
| URL | `/api/users/me/event-signups` |
| Auth | Login required |

Response `data`:

```json
[
  {
    "id": 1,
    "eventId": 1,
    "userId": 3,
    "status": "registered",
    "event": {
      "id": 1,
      "title": "AI Coding Workshop",
      "club": {
        "id": 1,
        "name": "Computer Science Club"
      }
    }
  }
]
```

---

## 6.7 Get My Comments

| Item | Value |
|---|---|
| Method | `GET` |
| URL | `/api/users/me/comments` |
| Auth | Login required |

Response `data`:

```json
[
  {
    "id": 1,
    "eventId": 1,
    "userId": 3,
    "content": "Looking forward to this event!",
    "event": {
      "id": 1,
      "title": "AI Coding Workshop"
    }
  }
]
```

---

## 6.8 Get All Users

| Item | Value |
|---|---|
| Method | `GET` |
| URL | `/api/users` |
| Auth | `super_admin` |

Response `data`:

```json
[
  {
    "id": 1,
    "email": "super@wku.edu.cn",
    "role": "super_admin",
    "name": "Super Admin"
  }
]
```

---

## 6.9 Get User by ID

| Item | Value |
|---|---|
| Method | `GET` |
| URL | `/api/users/:id` |
| Auth | Login required |

Path Params:

| Param | Type | Required |
|---|---|---|
| id | Number | Yes |

Rules:

```txt
normal user can only view themselves
super_admin can view any user
```

Response `data`:

```json
{
  "id": 1,
  "email": "student1@wku.edu.cn",
  "role": "student",
  "name": "Student One"
}
```

---

## 6.10 Update User by ID

| Item | Value |
|---|---|
| Method | `PUT` |
| URL | `/api/users/:id` |
| Auth | Login required |

Path Params:

| Param | Type | Required |
|---|---|---|
| id | Number | Yes |

Request Body:

```json
{
  "name": "Updated Name",
  "studentId": "1234567",
  "major": "Computer Science",
  "grade": "Senior",
  "bio": "Updated bio"
}
```

Rules:

```txt
normal user can only update themselves
super_admin can update any user
```

Response `data`:

```json
{
  "id": 1,
  "email": "student1@wku.edu.cn",
  "name": "Updated Name"
}
```

---

## 6.11 Upload User Avatar by ID

| Item | Value |
|---|---|
| Method | `POST` |
| URL | `/api/users/:id/avatar` |
| Auth | Login required |
| Content-Type | `multipart/form-data` |

Path Params:

| Param | Type | Required |
|---|---|---|
| id | Number | Yes |

FormData:

| Field | Type | Required |
|---|---|---|
| avatar | File | Yes |

Rules:

```txt
normal user can only upload their own avatar
super_admin can upload avatar for any user
```

Response `data`:

```json
{
  "id": 1,
  "avatar": "/uploads/avatars/avatar-xxx.png"
}
```

---

# 7. Admin APIs

## 7.1 Admin Get All Users

| Item | Value |
|---|---|
| Method | `GET` |
| URL | `/api/admin/users` |
| Auth | `super_admin` |

Response `data`:

```json
[
  {
    "id": 1,
    "email": "super@wku.edu.cn",
    "role": "super_admin",
    "name": "Super Admin"
  },
  {
    "id": 2,
    "email": "clubadmin@wku.edu.cn",
    "role": "club_admin",
    "name": "Club Admin Candidate"
  }
]
```

---

## 7.2 Admin Get User by ID

| Item | Value |
|---|---|
| Method | `GET` |
| URL | `/api/admin/users/:id` |
| Auth | `super_admin` |

Path Params:

| Param | Type | Required |
|---|---|---|
| id | Number | Yes |

Response `data`:

```json
{
  "id": 2,
  "email": "clubadmin@wku.edu.cn",
  "role": "club_admin",
  "name": "Club Admin Candidate"
}
```

---

## 7.3 Admin Update User Role

| Item | Value |
|---|---|
| Method | `PUT` |
| URL | `/api/admin/users/:id/role` |
| Auth | `super_admin` |

Path Params:

| Param | Type | Required |
|---|---|---|
| id | Number | Yes |

Request Body:

```json
{
  "role": "club_admin"
}
```

Allowed roles:

```txt
student
club_admin
super_admin
```

Response `data`:

```json
{
  "id": 2,
  "email": "clubadmin@wku.edu.cn",
  "role": "club_admin",
  "name": "Club Admin Candidate"
}
```

---

## 7.4 Admin Delete User

| Item | Value |
|---|---|
| Method | `DELETE` |
| URL | `/api/admin/users/:id` |
| Auth | `super_admin` |

Path Params:

| Param | Type | Required |
|---|---|---|
| id | Number | Yes |

Response `data`:

```json
{
  "id": 2
}
```

---

# 8. Club APIs

## 8.1 Get Clubs

| Item | Value |
|---|---|
| Method | `GET` |
| URL | `/api/clubs` |
| Auth | No |

Query Params:

| Param | Type | Required | Description |
|---|---|---|---|
| keyword | String | No | Search club name or description |
| category | String | No | Filter by category |
| status | String | No | Default is `active` |

Response `data`:

```json
[
  {
    "id": 1,
    "name": "Computer Science Club",
    "description": "A club for programming and AI.",
    "category": "Academic",
    "logo": null,
    "status": "active",
    "createdById": 2,
    "_count": {
      "members": 3,
      "applications": 2
    }
  }
]
```

---

## 8.2 Get Club by ID

| Item | Value |
|---|---|
| Method | `GET` |
| URL | `/api/clubs/:id` |
| Auth | No |

Path Params:

| Param | Type | Required |
|---|---|---|
| id | Number | Yes |

Response `data`:

```json
{
  "id": 1,
  "name": "Computer Science Club",
  "description": "A club for programming and AI.",
  "category": "Academic",
  "logo": null,
  "status": "active",
  "createdById": 2
}
```

---

## 8.3 Create Club

| Item | Value |
|---|---|
| Method | `POST` |
| URL | `/api/clubs` |
| Auth | `club_admin` or `super_admin` |

Request Body:

```json
{
  "name": "Computer Science Club",
  "description": "A club for students interested in programming, software development, and AI.",
  "category": "Academic"
}
```

Response `data`:

```json
{
  "id": 1,
  "name": "Computer Science Club",
  "description": "A club for students interested in programming, software development, and AI.",
  "category": "Academic",
  "logo": null,
  "status": "active",
  "createdById": 2
}
```

Note:

```txt
creator automatically becomes president of the club
```

---

## 8.4 Update Club

| Item | Value |
|---|---|
| Method | `PUT` |
| URL | `/api/clubs/:id` |
| Auth | `club owner` or `super_admin` |

Request Body:

```json
{
  "name": "Updated Club Name",
  "description": "Updated description",
  "category": "Academic",
  "status": "active"
}
```

Response `data`:

```json
{
  "id": 1,
  "name": "Updated Club Name",
  "description": "Updated description",
  "category": "Academic",
  "status": "active"
}
```

---

## 8.5 Delete Club

| Item | Value |
|---|---|
| Method | `DELETE` |
| URL | `/api/clubs/:id` |
| Auth | `club owner` or `super_admin` |

Response `data`:

```json
{
  "id": 1
}
```

---

## 8.6 Upload Club Logo

| Item | Value |
|---|---|
| Method | `POST` |
| URL | `/api/clubs/:id/logo` |
| Auth | `club owner` or `super_admin` |
| Content-Type | `multipart/form-data` |

FormData:

| Field | Type | Required |
|---|---|---|
| logo | File | Yes |

Response `data`:

```json
{
  "id": 1,
  "name": "Computer Science Club",
  "logo": "/uploads/clubs/club-logo-xxx.png"
}
```

---

# 9. Club Application APIs

## 9.1 Apply to Club

| Item | Value |
|---|---|
| Method | `POST` |
| URL | `/api/clubs/:id/apply` |
| Auth | Login required |

Request Body:

```json
{
  "reason": "I want to improve my coding skills and join technical workshops."
}
```

Response `data`:

```json
{
  "id": 1,
  "clubId": 1,
  "userId": 3,
  "reason": "I want to improve my coding skills and join technical workshops.",
  "status": "pending"
}
```

---

## 9.2 Get Club Applications

| Item | Value |
|---|---|
| Method | `GET` |
| URL | `/api/clubs/:id/applications` |
| Auth | `club owner` or `super_admin` |

Response `data`:

```json
[
  {
    "id": 1,
    "clubId": 1,
    "userId": 3,
    "reason": "I want to improve my coding skills.",
    "status": "pending",
    "user": {
      "id": 3,
      "email": "student1@wku.edu.cn",
      "name": "Student One"
    }
  }
]
```

---

## 9.3 Approve Club Application

| Item | Value |
|---|---|
| Method | `PUT` |
| URL | `/api/clubs/:clubId/applications/:applicationId/approve` |
| Auth | `club owner` or `super_admin` |

Response `data`:

```json
{
  "id": 1,
  "clubId": 1,
  "userId": 3,
  "status": "approved",
  "reviewedById": 2,
  "reviewedAt": "2026-05-21T07:10:33.371Z"
}
```

Note:

```txt
after approval, the user automatically becomes a club member
```

---

## 9.4 Reject Club Application

| Item | Value |
|---|---|
| Method | `PUT` |
| URL | `/api/clubs/:clubId/applications/:applicationId/reject` |
| Auth | `club owner` or `super_admin` |

Response `data`:

```json
{
  "id": 1,
  "clubId": 1,
  "userId": 3,
  "status": "rejected",
  "reviewedById": 2,
  "reviewedAt": "2026-05-21T07:10:33.371Z"
}
```

---

# 10. Club Member APIs

## 10.1 Get Club Members

| Item | Value |
|---|---|
| Method | `GET` |
| URL | `/api/clubs/:id/members` |
| Auth | Login required |

Response `data`:

```json
[
  {
    "id": 1,
    "clubId": 1,
    "userId": 2,
    "role": "president",
    "joinedAt": "2026-05-21T07:10:33.371Z",
    "user": {
      "id": 2,
      "email": "clubadmin@wku.edu.cn",
      "name": "Club Admin Candidate"
    }
  }
]
```

---

## 10.2 Remove Club Member

| Item | Value |
|---|---|
| Method | `DELETE` |
| URL | `/api/clubs/:clubId/members/:userId` |
| Auth | `club owner` or `super_admin` |

Response `data`:

```json
{
  "clubId": 1,
  "userId": 3
}
```

---

# 11. Event APIs

## 11.1 Get Events

| Item | Value |
|---|---|
| Method | `GET` |
| URL | `/api/events` |
| Auth | No |

Query Params:

| Param | Type | Required |
|---|---|---|
| keyword | String | No |
| clubId | Number | No |
| status | String | No |

Response `data`:

```json
[
  {
    "id": 1,
    "clubId": 1,
    "title": "AI Coding Workshop",
    "description": "A workshop about AI tools and coding.",
    "location": "WKU CBPM Building",
    "startTime": "2026-06-01T15:00:00.000Z",
    "endTime": "2026-06-01T17:00:00.000Z",
    "capacity": 30,
    "poster": null,
    "status": "published",
    "registeredCount": 2,
    "remainingSeats": 28
  }
]
```

---

## 11.2 Get Event by ID

| Item | Value |
|---|---|
| Method | `GET` |
| URL | `/api/events/:id` |
| Auth | No |

Response `data`:

```json
{
  "id": 1,
  "clubId": 1,
  "title": "AI Coding Workshop",
  "description": "A workshop about AI tools and coding.",
  "location": "WKU CBPM Building",
  "startTime": "2026-06-01T15:00:00.000Z",
  "endTime": "2026-06-01T17:00:00.000Z",
  "capacity": 30,
  "poster": null,
  "status": "published",
  "registeredCount": 2,
  "remainingSeats": 28
}
```

---

## 11.3 Get Event Signup Count

| Item | Value |
|---|---|
| Method | `GET` |
| URL | `/api/events/:id/signup-count` |
| Auth | No |

Response `data`:

```json
{
  "eventId": 1,
  "title": "AI Coding Workshop",
  "capacity": 30,
  "registeredCount": 2,
  "remainingSeats": 28
}
```

---

## 11.4 Create Event

| Item | Value |
|---|---|
| Method | `POST` |
| URL | `/api/clubs/:clubId/events` |
| Auth | `club owner` or `super_admin` |

Request Body:

```json
{
  "title": "AI Coding Workshop",
  "description": "A workshop about AI tools and coding.",
  "location": "WKU CBPM Building",
  "startTime": "2026-06-01T15:00:00.000Z",
  "endTime": "2026-06-01T17:00:00.000Z",
  "capacity": 30,
  "status": "published"
}
```

Response `data`:

```json
{
  "id": 1,
  "clubId": 1,
  "title": "AI Coding Workshop",
  "capacity": 30,
  "status": "published"
}
```

---

## 11.5 Update Event

| Item | Value |
|---|---|
| Method | `PUT` |
| URL | `/api/events/:id` |
| Auth | `club owner` or `super_admin` |

Request Body:

```json
{
  "title": "Updated Event Title",
  "description": "Updated description",
  "location": "GEH Hall",
  "startTime": "2026-06-01T15:00:00.000Z",
  "endTime": "2026-06-01T17:00:00.000Z",
  "capacity": 40,
  "status": "published"
}
```

Response `data`:

```json
{
  "id": 1,
  "title": "Updated Event Title",
  "capacity": 40
}
```

---

## 11.6 Delete Event

| Item | Value |
|---|---|
| Method | `DELETE` |
| URL | `/api/events/:id` |
| Auth | `club owner` or `super_admin` |

Response `data`:

```json
{
  "id": 1
}
```

---

## 11.7 Upload Event Poster

| Item | Value |
|---|---|
| Method | `POST` |
| URL | `/api/events/:id/poster` |
| Auth | `club owner` or `super_admin` |
| Content-Type | `multipart/form-data` |

FormData:

| Field | Type | Required |
|---|---|---|
| poster | File | Yes |

Response `data`:

```json
{
  "id": 1,
  "title": "AI Coding Workshop",
  "poster": "/uploads/events/event-poster-xxx.png"
}
```

---

# 12. Event Signup APIs

## 12.1 Signup Event

| Item | Value |
|---|---|
| Method | `POST` |
| URL | `/api/events/:id/signup` |
| Auth | Login required and approved club member |

Request Body:

```txt
No body
```

Rules:

```txt
user must be approved club member
cannot signup twice
capacity cannot be exceeded
event status must be published
```

Response `data`:

```json
{
  "id": 1,
  "eventId": 1,
  "userId": 3,
  "status": "registered"
}
```

---

## 12.2 Cancel Event Signup

| Item | Value |
|---|---|
| Method | `DELETE` |
| URL | `/api/events/:id/signup` |
| Auth | Login required |

Response `data`:

```json
{
  "eventId": 1,
  "userId": 3
}
```

---

## 12.3 Get Event Signups

| Item | Value |
|---|---|
| Method | `GET` |
| URL | `/api/events/:id/signups` |
| Auth | `club owner` or `super_admin` |

Response `data`:

```json
{
  "event": {
    "id": 1,
    "title": "AI Coding Workshop",
    "capacity": 30,
    "registeredCount": 2,
    "remainingSeats": 28
  },
  "signups": [
    {
      "id": 1,
      "eventId": 1,
      "userId": 3,
      "status": "registered",
      "user": {
        "id": 3,
        "email": "student1@wku.edu.cn",
        "name": "Student One"
      }
    }
  ]
}
```

---

# 13. Announcement APIs

## 13.1 Get Announcements

| Item | Value |
|---|---|
| Method | `GET` |
| URL | `/api/announcements` |
| Auth | No |

Query Params:

| Param | Type | Required |
|---|---|---|
| keyword | String | No |
| clubId | Number | No |
| status | String | No |
| pinned | Boolean | No |

Response `data`:

```json
[
  {
    "id": 1,
    "clubId": 1,
    "createdById": 2,
    "title": "Event Reminder",
    "content": "Please arrive 10 minutes early.",
    "status": "published",
    "isPinned": true
  }
]
```

---

## 13.2 Get Announcement by ID

| Item | Value |
|---|---|
| Method | `GET` |
| URL | `/api/announcements/:id` |
| Auth | No |

Response `data`:

```json
{
  "id": 1,
  "clubId": 1,
  "createdById": 2,
  "title": "Event Reminder",
  "content": "Please arrive 10 minutes early.",
  "status": "published",
  "isPinned": true
}
```

---

## 13.3 Get Club Announcements

| Item | Value |
|---|---|
| Method | `GET` |
| URL | `/api/clubs/:clubId/announcements` |
| Auth | No |

Response `data`:

```json
[
  {
    "id": 1,
    "clubId": 1,
    "title": "Event Reminder",
    "content": "Please arrive 10 minutes early.",
    "status": "published"
  }
]
```

---

## 13.4 Create Announcement

| Item | Value |
|---|---|
| Method | `POST` |
| URL | `/api/clubs/:clubId/announcements` |
| Auth | `club owner` or `super_admin` |

Request Body:

```json
{
  "title": "Event Reminder",
  "content": "Please arrive 10 minutes early.",
  "status": "published",
  "isPinned": true
}
```

Allowed status:

```txt
draft
published
archived
```

Response `data`:

```json
{
  "id": 1,
  "clubId": 1,
  "title": "Event Reminder",
  "content": "Please arrive 10 minutes early.",
  "status": "published",
  "isPinned": true
}
```

---

## 13.5 Update Announcement

| Item | Value |
|---|---|
| Method | `PUT` |
| URL | `/api/announcements/:id` |
| Auth | `club owner` or `super_admin` |

Request Body:

```json
{
  "title": "Updated Announcement",
  "content": "Updated content",
  "status": "published",
  "isPinned": false
}
```

Response `data`:

```json
{
  "id": 1,
  "title": "Updated Announcement",
  "content": "Updated content",
  "isPinned": false
}
```

---

## 13.6 Delete Announcement

| Item | Value |
|---|---|
| Method | `DELETE` |
| URL | `/api/announcements/:id` |
| Auth | `club owner` or `super_admin` |

Response `data`:

```json
{
  "id": 1
}
```

---

## 13.7 Get Managed Announcements

| Item | Value |
|---|---|
| Method | `GET` |
| URL | `/api/manage/announcements` |
| Auth | `club_admin` or `super_admin` |

Response `data`:

```json
[
  {
    "id": 1,
    "clubId": 1,
    "title": "Event Reminder",
    "status": "published"
  }
]
```

---

# 14. Comment APIs

## 14.1 Get Event Comments

| Item | Value |
|---|---|
| Method | `GET` |
| URL | `/api/events/:id/comments` |
| Auth | No |

Response `data`:

```json
[
  {
    "id": 1,
    "eventId": 1,
    "userId": 3,
    "content": "Looking forward to this event!",
    "user": {
      "id": 3,
      "email": "student1@wku.edu.cn",
      "name": "Student One"
    }
  }
]
```

---

## 14.2 Create Event Comment

| Item | Value |
|---|---|
| Method | `POST` |
| URL | `/api/events/:id/comments` |
| Auth | Login required |

Request Body:

```json
{
  "content": "Looking forward to this event!"
}
```

Response `data`:

```json
{
  "id": 1,
  "eventId": 1,
  "userId": 3,
  "content": "Looking forward to this event!"
}
```

---

## 14.3 Delete Comment

| Item | Value |
|---|---|
| Method | `DELETE` |
| URL | `/api/comments/:commentId` |
| Auth | Login required |

Rules:

```txt
user can delete own comment
club_admin can delete comments under own club events
super_admin can delete any comment
```

Response `data`:

```json
{
  "id": 1
}
```

---

## 14.4 Get Managed Comments

| Item | Value |
|---|---|
| Method | `GET` |
| URL | `/api/manage/comments` |
| Auth | `club_admin` or `super_admin` |

Response `data`:

```json
[
  {
    "id": 1,
    "eventId": 1,
    "userId": 3,
    "content": "Looking forward to this event!"
  }
]
```

---

# 15. Club Gallery APIs

## 15.1 Get Club Gallery

| Item | Value |
|---|---|
| Method | `GET` |
| URL | `/api/clubs/:clubId/gallery` |
| Auth | No |

Path Params:

| Param | Type | Required |
|---|---|---|
| clubId | Number | Yes |

Response `data`:

```json
[
  {
    "id": 1,
    "clubId": 1,
    "uploadedById": 2,
    "imageUrl": "/uploads/gallery/gallery-xxx.png",
    "title": "Club Orientation",
    "description": "New members joined our first meeting.",
    "club": {
      "id": 1,
      "name": "Computer Science Club"
    },
    "uploadedBy": {
      "id": 2,
      "email": "clubadmin@wku.edu.cn",
      "name": "Club Admin Candidate",
      "role": "club_admin"
    }
  }
]
```

---

## 15.2 Upload Club Gallery Image

| Item | Value |
|---|---|
| Method | `POST` |
| URL | `/api/clubs/:clubId/gallery` |
| Auth | `club owner` or `super_admin` |
| Content-Type | `multipart/form-data` |

FormData:

| Field | Type | Required |
|---|---|---|
| image | File | Yes |
| title | String | No |
| description | String | No |

Response `data`:

```json
{
  "id": 1,
  "clubId": 1,
  "uploadedById": 2,
  "imageUrl": "/uploads/gallery/gallery-xxx.png",
  "title": "Club Orientation",
  "description": "New members joined our first meeting."
}
```

---

## 15.3 Update Gallery Image

| Item | Value |
|---|---|
| Method | `PUT` |
| URL | `/api/gallery/:imageId` |
| Auth | `club owner` or `super_admin` |

Request Body:

```json
{
  "title": "Updated Gallery Title",
  "description": "Updated image description."
}
```

Response `data`:

```json
{
  "id": 1,
  "clubId": 1,
  "imageUrl": "/uploads/gallery/gallery-xxx.png",
  "title": "Updated Gallery Title",
  "description": "Updated image description."
}
```

---

## 15.4 Delete Gallery Image

| Item | Value |
|---|---|
| Method | `DELETE` |
| URL | `/api/gallery/:imageId` |
| Auth | `club owner` or `super_admin` |

Response `data`:

```json
{
  "id": 1
}
```

---

# 16. File Upload Summary

| Feature | API | Field | Max Size |
|---|---|---|---|
| User avatar | `POST /api/users/me/avatar` | `avatar` | 2MB |
| User avatar by ID | `POST /api/users/:id/avatar` | `avatar` | 2MB |
| Club logo | `POST /api/clubs/:id/logo` | `logo` | 2MB |
| Event poster | `POST /api/events/:id/poster` | `poster` | 2MB |
| Club gallery image | `POST /api/clubs/:clubId/gallery` | `image` | 5MB |

Allowed image types:

```txt
jpg
jpeg
png
webp
```

Uploaded file URL examples:

```txt
http://localhost:3000/uploads/avatars/avatar-xxx.png
http://localhost:3000/uploads/clubs/club-logo-xxx.png
http://localhost:3000/uploads/events/event-poster-xxx.png
http://localhost:3000/uploads/gallery/gallery-xxx.png
```

---

# 17. API Count

```txt
Test APIs: 2
Business APIs: 54
Total APIs: 56
```

Breakdown:

| Module | Count |
|---|---:|
| Test | 2 |
| Auth | 2 |
| User | 10 |
| Admin | 4 |
| Club | 12 |
| Event | 10 |
| Announcement | 7 |
| Comment | 5 |
| Gallery | 4 |
| Total | 56 |

---

# 18. Recommended Demo Flow

```txt
1. Login as super_admin
2. Promote clubadmin to club_admin
3. Login as club_admin
4. Create a club
5. Upload club logo
6. Upload club gallery images
7. Login as student1 and student2
8. Students apply to join club with reason
9. Club admin approves applications
10. Club admin creates an event
11. Club admin uploads event poster
12. Approved students sign up for event
13. Club admin checks signup count and signup list
14. Club admin posts announcement
15. Users comment on event
```
````
