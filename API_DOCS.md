# Campus Club Backend API Docs

本文档按照 KOOK 风格整理：接口列表、接口说明、参数列表、请求示例、返回参数说明、返回示例。

## 基础信息

| 项目 | 内容 |
| --- | --- |
| Base URL | `http://localhost:3000` |
| 鉴权方式 | `Authorization: Bearer <token>` |
| JSON 请求 | `Content-Type: application/json` |
| 文件上传 | `multipart/form-data` |
| 成功响应 | `{ "success": true, "message": "...", "data": ... }` |
| 失败响应 | `{ "success": false, "message": "..." }` |

## 角色说明

| 角色 | 说明 |
| --- | --- |
| `student` | 普通学生用户 |
| `club_admin` | 社团管理员，只能管理自己创建的社团 |
| `super_admin` | 超级管理员，可以管理所有用户和内容 |

## 重要说明

- 所有 ID 都是 UUID v4 string，例如 `1f3b6f1a-9c12-4d3a-88f0-b8c91f8e2e31`。
- 前端不要使用 `Number(id)` 或 `parseInt(id)`。
- 社团支持双语字段：`chineseName`、`englishName`、`name`。
- 评论属于社团，不属于活动。
- 获取指定社团活动：`GET /api/events?clubId=<clubId>`。

# 接口列表

| 请求方式 | 接口 | 接口说明 | 鉴权 |
| --- | --- | --- | --- |
| GET | / | Backend home test | No |
| GET | /api/health | Health check | No |
| POST | /api/auth/register | Register user | No |
| POST | /api/auth/login | Login user | No |
| GET | /api/users/me | Get current user | Login |
| PUT | /api/users/me | Update current user | Login |
| POST | /api/users/me/avatar | Upload current user avatar | Login |
| GET | /api/users/me/club-applications | Get my club applications | Login |
| GET | /api/users/me/clubs | Get my joined clubs | Login |
| GET | /api/users/me/event-signups | Get my event signups | Login |
| GET | /api/users/me/comments | Get my comments | Login |
| GET | /api/users | Get all users | super_admin |
| GET | /api/users/:id | Get user by ID | Login |
| PUT | /api/users/:id | Update user by ID | Login |
| POST | /api/users/:id/avatar | Upload user avatar by ID | Login |
| GET | /api/admin/users | Admin get all users | super_admin |
| GET | /api/admin/users/:id | Admin get user by ID | super_admin |
| PUT | /api/admin/users/:id/role | Admin update user role | super_admin |
| DELETE | /api/admin/users/:id | Admin delete user | super_admin |
| GET | /api/clubs | Get club list | No |
| GET | /api/clubs/:id | Get club detail | No |
| POST | /api/clubs | Create club | club_admin / super_admin |
| PUT | /api/clubs/:id | Update club | club owner / super_admin |
| DELETE | /api/clubs/:id | Delete club | club owner / super_admin |
| POST | /api/clubs/:id/logo | Upload club logo | club owner / super_admin |
| POST | /api/clubs/:id/apply | Apply to club | Login |
| GET | /api/clubs/:id/applications | Get club applications | club owner / super_admin |
| PUT | /api/clubs/:clubId/applications/:applicationId/approve | Approve club application | club owner / super_admin |
| PUT | /api/clubs/:clubId/applications/:applicationId/reject | Reject club application | club owner / super_admin |
| GET | /api/clubs/:id/members | Get club members | Login |
| DELETE | /api/clubs/:clubId/members/:userId | Remove club member | club owner / super_admin |
| GET | /api/events | Get event list | No |
| GET | /api/events?clubId=:clubId | Get events of a specific club | No |
| GET | /api/events/:id | Get event detail | No |
| GET | /api/events/:id/signup-count | Get event signup count | No |
| POST | /api/clubs/:clubId/events | Create event | club owner / super_admin |
| PUT | /api/events/:id | Update event | club owner / super_admin |
| DELETE | /api/events/:id | Delete event | club owner / super_admin |
| POST | /api/events/:id/poster | Upload event poster | club owner / super_admin |
| POST | /api/events/:id/signup | Sign up for event | Login + club member |
| DELETE | /api/events/:id/signup | Cancel event signup | Login |
| GET | /api/events/:id/signups | Get event signup list | club owner / super_admin |
| GET | /api/announcements | Get announcement list | No |
| GET | /api/announcements/:id | Get announcement detail | No |
| GET | /api/clubs/:clubId/announcements | Get announcements of a club | No |
| POST | /api/clubs/:clubId/announcements | Create announcement | club owner / super_admin |
| PUT | /api/announcements/:id | Update announcement | club owner / super_admin |
| DELETE | /api/announcements/:id | Delete announcement | club owner / super_admin |
| GET | /api/manage/announcements | Get manageable announcements | club_admin / super_admin |
| GET | /api/clubs/:clubId/comments | Get club comments | No |
| POST | /api/clubs/:clubId/comments | Create club comment | Login |
| DELETE | /api/comments/:commentId | Delete comment | Login |
| GET | /api/manage/comments | Get manageable comments | club_admin / super_admin |
| GET | /api/clubs/:clubId/gallery | Get club gallery | No |
| POST | /api/clubs/:clubId/gallery | Upload club gallery image | club owner / super_admin |
| PUT | /api/gallery/:imageId | Update gallery image | club owner / super_admin |
| DELETE | /api/gallery/:imageId | Delete gallery image | club owner / super_admin |

# 详细接口

## Backend Home

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/` | GET | 测试后端是否运行。 | No |

### 参数列表

无

### 请求示例

无

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Campus Club Backend API is running"
}
```

---

## Health Check

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/health` | GET | 检查服务器健康状态。 | No |

### 参数列表

无

### 请求示例

无

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Server is healthy"
}
```

---

## Register

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/auth/register` | POST | 注册新用户，仅允许 @wku.edu.cn 邮箱。 | No |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| email | body | string | Yes | 邮箱 |
| password | body | string | Yes | 密码 |
| name | body | string | No | 姓名 |
| studentId | body | string | No | 学号 |
| major | body | string | No | 专业 |
| grade | body | string | No | 年级 |

### 请求示例

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

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Register successful",
  "data": {
    "token": "JWT_TOKEN",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "student@wku.edu.cn",
      "role": "student"
    }
  }
}
```

---

## Login

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/auth/login` | POST | 用户登录，返回 JWT token。 | No |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| email | body | string | Yes | 邮箱 |
| password | body | string | Yes | 密码 |

### 请求示例

```json
{
  "email": "super@wku.edu.cn",
  "password": "123456"
}
```

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "JWT_TOKEN",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "super@wku.edu.cn",
      "role": "super_admin"
    }
  }
}
```

---

## Get Current User

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/users/me` | GET | 获取当前登录用户信息。 | Login required |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | Yes | Bearer token |

### 请求示例

无

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "student1@wku.edu.cn",
    "role": "student",
    "name": "Student One"
  }
}
```

---

## Update Current User

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/users/me` | PUT | 修改当前用户资料。 | Login required |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | Yes | Bearer token |
| name | body | string | No | 姓名 |
| studentId | body | string | No | 学号 |
| major | body | string | No | 专业 |
| grade | body | string | No | 年级 |
| bio | body | string | No | 简介 |

### 请求示例

```json
{
  "name": "Theodore Qiu",
  "studentId": "1234567",
  "major": "Computer Science",
  "grade": "Senior",
  "bio": "I like software development."
}
```

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Theodore Qiu"
  }
}
```

---

## Upload Current User Avatar

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/users/me/avatar` | POST | 上传当前用户头像。 | Login required |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | Yes | Bearer token |
| avatar | formData | file | Yes | 头像图片 |

### 备注
- Content-Type 使用 multipart/form-data。

### 请求示例

```txt
FormData: avatar=<file>
```

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "avatar": "/uploads/avatars/avatar-xxx.png"
  }
}
```

---

## Get My Club Applications

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/users/me/club-applications` | GET | 获取我的社团申请。 | Login required |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | Yes | Bearer token |

### 请求示例

无

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "My club applications fetched successfully",
  "data": [
    {
      "id": "0e6c9c95-ef9d-4f6e-890e-b5a6d05c0b57",
      "clubId": "1f3b6f1a-9c12-4d3a-88f0-b8c91f8e2e31",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "status": "pending"
    }
  ]
}
```

---

## Get My Clubs

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/users/me/clubs` | GET | 获取我加入的社团。 | Login required |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | Yes | Bearer token |

### 请求示例

无

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "My clubs fetched successfully",
  "data": [
    {
      "clubId": "1f3b6f1a-9c12-4d3a-88f0-b8c91f8e2e31",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "role": "member"
    }
  ]
}
```

---

## Get My Event Signups

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/users/me/event-signups` | GET | 获取我的活动报名。 | Login required |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | Yes | Bearer token |

### 请求示例

无

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "My event signups fetched successfully",
  "data": [
    {
      "eventId": "a28f4d4c-55f4-45a4-a05e-9b3e3c5b7f92",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "status": "registered"
    }
  ]
}
```

---

## Get My Comments

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/users/me/comments` | GET | 获取我的评论。 | Login required |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | Yes | Bearer token |

### 请求示例

无

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "My comments fetched successfully",
  "data": [
    {
      "id": "9c771cb9-31d5-4e1e-96d3-8ddf6e52f2d6",
      "clubId": "1f3b6f1a-9c12-4d3a-88f0-b8c91f8e2e31",
      "content": "This club looks interesting."
    }
  ]
}
```

---

## Get All Users

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/users` | GET | 获取所有用户。 | super_admin |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | Yes | Bearer token |

### 请求示例

无

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "super@wku.edu.cn",
      "role": "super_admin"
    }
  ]
}
```

---

## Get User by ID

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/users/:id` | GET | 通过用户 UUID 获取用户。 | Login required |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | Yes | Bearer token |
| id | path | string | Yes | User UUID |

### 请求示例

无

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "student1@wku.edu.cn",
    "role": "student",
    "name": "Student One"
  }
}
```

---

## Update User by ID

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/users/:id` | PUT | 通过用户 UUID 修改用户。 | Login required |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | Yes | Bearer token |
| id | path | string | Yes | User UUID |
| name | body | string | No | 姓名 |
| studentId | body | string | No | 学号 |
| major | body | string | No | 专业 |
| grade | body | string | No | 年级 |
| bio | body | string | No | 简介 |

### 请求示例

```json
{
  "name": "Updated Name",
  "bio": "Updated bio"
}
```

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Updated Name"
  }
}
```

---

## Upload User Avatar by ID

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/users/:id/avatar` | POST | 通过用户 UUID 上传头像。 | Login required |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | Yes | Bearer token |
| id | path | string | Yes | User UUID |
| avatar | formData | file | Yes | 头像图片 |

### 备注
- Content-Type 使用 multipart/form-data。

### 请求示例

```txt
FormData: avatar=<file>
```

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "avatar": "/uploads/avatars/avatar-xxx.png"
  }
}
```

---

## Admin Get All Users

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/admin/users` | GET | 超级管理员获取所有用户。 | super_admin |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | Yes | Bearer token |

### 请求示例

无

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "super@wku.edu.cn",
      "role": "super_admin"
    }
  ]
}
```

---

## Admin Get User by ID

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/admin/users/:id` | GET | 超级管理员获取指定用户。 | super_admin |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | Yes | Bearer token |
| id | path | string | Yes | User UUID |

### 请求示例

无

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "student1@wku.edu.cn",
    "role": "student",
    "name": "Student One"
  }
}
```

---

## Admin Update User Role

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/admin/users/:id/role` | PUT | 超级管理员修改用户角色。 | super_admin |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | Yes | Bearer token |
| id | path | string | Yes | User UUID |
| role | body | string | Yes | student / club_admin / super_admin |

### 请求示例

```json
{
  "role": "club_admin"
}
```

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "User role updated successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "role": "club_admin"
  }
}
```

---

## Admin Delete User

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/admin/users/:id` | DELETE | 超级管理员删除用户。 | super_admin |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | Yes | Bearer token |
| id | path | string | Yes | User UUID |

### 备注
- 不能删除自己的账号。

### 请求示例

无

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

---

## Get Clubs

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/clubs` | GET | 获取社团列表。 | No |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| keyword | query | string | No | 关键词 |
| category | query | string | No | 分类 |
| status | query | string | No | 状态，默认 active |

### 请求示例

无

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Clubs fetched successfully",
  "data": [
    {
      "id": "1f3b6f1a-9c12-4d3a-88f0-b8c91f8e2e31",
      "name": "Turing Computer Club",
      "chineseName": "图灵计算机社",
      "englishName": "Turing Computer Club"
    }
  ]
}
```

---

## Get Club by ID

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/clubs/:id` | GET | 获取社团详情。 | No |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| id | path | string | Yes | Club UUID |

### 请求示例

无

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Club fetched successfully",
  "data": {
    "id": "1f3b6f1a-9c12-4d3a-88f0-b8c91f8e2e31",
    "name": "Turing Computer Club",
    "chineseName": "图灵计算机社",
    "englishName": "Turing Computer Club"
  }
}
```

---

## Create Club

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/clubs` | POST | 创建社团。 | club_admin / super_admin |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | Yes | Bearer token |
| chineseName | body | string | No | 中文名 |
| englishName | body | string | No | 英文名 |
| name | body | string | No | 兼容字段 |
| description | body | string | No | 简介 |
| purpose | body | string | No | 宗旨 |
| mission | body | string | No | 使命 |
| category | body | string | No | 分类 |
| joinInfo | body | string | No | 加入方式 |
| reviewer | body | string | No | 审核人 |

### 备注
- 至少提供 name / chineseName / englishName 之一。创建者会自动成为 president。

### 请求示例

```json
{
  "chineseName": "图灵计算机社",
  "englishName": "Turing Computer Club",
  "description": "A club for programming.",
  "category": "Professional Organizations"
}
```

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Club created successfully",
  "data": {
    "id": "1f3b6f1a-9c12-4d3a-88f0-b8c91f8e2e31",
    "name": "Turing Computer Club",
    "chineseName": "图灵计算机社",
    "englishName": "Turing Computer Club"
  }
}
```

---

## Update Club

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/clubs/:id` | PUT | 修改社团。 | club owner / super_admin |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | Yes | Bearer token |
| id | path | string | Yes | Club UUID |
| chineseName | body | string | No | 中文名 |
| englishName | body | string | No | 英文名 |
| description | body | string | No | 简介 |
| purpose | body | string | No | 宗旨 |
| mission | body | string | No | 使命 |
| category | body | string | No | 分类 |
| status | body | string | No | 状态 |

### 请求示例

```json
{
  "chineseName": "图灵计算机社 Updated",
  "englishName": "Turing Computer Club Updated",
  "status": "active"
}
```

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Club updated successfully",
  "data": {
    "id": "1f3b6f1a-9c12-4d3a-88f0-b8c91f8e2e31",
    "status": "active"
  }
}
```

---

## Delete Club

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/clubs/:id` | DELETE | 删除社团。 | club owner / super_admin |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | Yes | Bearer token |
| id | path | string | Yes | Club UUID |

### 请求示例

无

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Club deleted successfully",
  "data": {
    "id": "1f3b6f1a-9c12-4d3a-88f0-b8c91f8e2e31"
  }
}
```

---

## Upload Club Logo

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/clubs/:id/logo` | POST | 上传社团 Logo。 | club owner / super_admin |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | Yes | Bearer token |
| id | path | string | Yes | Club UUID |
| logo | formData | file | Yes | Logo 图片 |

### 备注
- Content-Type 使用 multipart/form-data。

### 请求示例

```txt
FormData: logo=<file>
```

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Club logo uploaded successfully",
  "data": {
    "id": "1f3b6f1a-9c12-4d3a-88f0-b8c91f8e2e31",
    "logo": "/uploads/clubs/club-logo-xxx.png"
  }
}
```

---

## Apply to Club

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/clubs/:id/apply` | POST | 申请加入社团。 | Login required |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | Yes | Bearer token |
| id | path | string | Yes | Club UUID |
| reason | body | string | Yes | 申请理由 |

### 请求示例

```json
{
  "reason": "I want to join this club."
}
```

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Club application submitted successfully",
  "data": {
    "id": "0e6c9c95-ef9d-4f6e-890e-b5a6d05c0b57",
    "clubId": "1f3b6f1a-9c12-4d3a-88f0-b8c91f8e2e31",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "status": "pending"
  }
}
```

---

## Get Club Applications

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/clubs/:id/applications` | GET | 获取社团申请列表。 | club owner / super_admin |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | Yes | Bearer token |
| id | path | string | Yes | Club UUID |

### 请求示例

无

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Club applications fetched successfully",
  "data": [
    {
      "id": "0e6c9c95-ef9d-4f6e-890e-b5a6d05c0b57",
      "clubId": "1f3b6f1a-9c12-4d3a-88f0-b8c91f8e2e31",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "status": "pending"
    }
  ]
}
```

---

## Approve Club Application

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/clubs/:clubId/applications/:applicationId/approve` | PUT | 批准入社申请。 | club owner / super_admin |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | Yes | Bearer token |
| clubId | path | string | Yes | Club UUID |
| applicationId | path | string | Yes | ClubApplication UUID |

### 备注
- 批准后用户自动成为社团成员。

### 请求示例

无

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Club application approved successfully",
  "data": {
    "id": "0e6c9c95-ef9d-4f6e-890e-b5a6d05c0b57",
    "status": "approved"
  }
}
```

---

## Reject Club Application

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/clubs/:clubId/applications/:applicationId/reject` | PUT | 拒绝入社申请。 | club owner / super_admin |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | Yes | Bearer token |
| clubId | path | string | Yes | Club UUID |
| applicationId | path | string | Yes | ClubApplication UUID |

### 请求示例

无

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Club application rejected successfully",
  "data": {
    "id": "0e6c9c95-ef9d-4f6e-890e-b5a6d05c0b57",
    "status": "rejected"
  }
}
```

---

## Get Club Members

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/clubs/:id/members` | GET | 获取社团成员。 | Login required |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | Yes | Bearer token |
| id | path | string | Yes | Club UUID |

### 请求示例

无

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Club members fetched successfully",
  "data": [
    {
      "id": "5f7bbdb6-5fa4-4f66-8f7d-2c1a6a2fdd19",
      "clubId": "1f3b6f1a-9c12-4d3a-88f0-b8c91f8e2e31",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "role": "president"
    }
  ]
}
```

---

## Remove Club Member

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/clubs/:clubId/members/:userId` | DELETE | 移除社团成员。 | club owner / super_admin |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | Yes | Bearer token |
| clubId | path | string | Yes | Club UUID |
| userId | path | string | Yes | User UUID |

### 请求示例

无

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Club member removed successfully",
  "data": {
    "clubId": "1f3b6f1a-9c12-4d3a-88f0-b8c91f8e2e31",
    "userId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

---

## Get Events

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/events` | GET | 获取活动列表。 | No |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| keyword | query | string | No | 关键词 |
| clubId | query | string | No | Club UUID |
| status | query | string | No | 状态，默认 published |

### 请求示例

无

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Events fetched successfully",
  "data": [
    {
      "id": "a28f4d4c-55f4-45a4-a05e-9b3e3c5b7f92",
      "clubId": "1f3b6f1a-9c12-4d3a-88f0-b8c91f8e2e31",
      "title": "AI Coding Workshop",
      "registeredCount": 2,
      "remainingSeats": 28
    }
  ]
}
```

---

## Get Event by ID

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/events/:id` | GET | 获取活动详情。 | No |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| id | path | string | Yes | Event UUID |

### 请求示例

无

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Event fetched successfully",
  "data": {
    "id": "a28f4d4c-55f4-45a4-a05e-9b3e3c5b7f92",
    "clubId": "1f3b6f1a-9c12-4d3a-88f0-b8c91f8e2e31",
    "title": "AI Coding Workshop",
    "registeredCount": 2,
    "remainingSeats": 28
  }
}
```

---

## Get Event Signup Count

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/events/:id/signup-count` | GET | 获取活动报名人数。 | No |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| id | path | string | Yes | Event UUID |

### 请求示例

无

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Event signup count fetched successfully",
  "data": {
    "eventId": "a28f4d4c-55f4-45a4-a05e-9b3e3c5b7f92",
    "capacity": 30,
    "registeredCount": 2,
    "remainingSeats": 28
  }
}
```

---

## Create Event

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/clubs/:clubId/events` | POST | 创建活动。 | club owner / super_admin |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | Yes | Bearer token |
| clubId | path | string | Yes | Club UUID |
| title | body | string | Yes | 标题 |
| description | body | string | No | 简介 |
| location | body | string | No | 地点 |
| startTime | body | datetime | Yes | 开始时间 |
| endTime | body | datetime | Yes | 结束时间 |
| capacity | body | integer | No | 容量 |
| status | body | string | No | 状态 |

### 请求示例

```json
{
  "title": "AI Coding Workshop",
  "description": "A workshop about AI tools.",
  "location": "WKU CBPM Building",
  "startTime": "2026-06-01T15:00:00.000Z",
  "endTime": "2026-06-01T17:00:00.000Z",
  "capacity": 30,
  "status": "published"
}
```

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Event created successfully",
  "data": {
    "id": "a28f4d4c-55f4-45a4-a05e-9b3e3c5b7f92",
    "clubId": "1f3b6f1a-9c12-4d3a-88f0-b8c91f8e2e31",
    "title": "AI Coding Workshop"
  }
}
```

---

## Update Event

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/events/:id` | PUT | 修改活动。 | club owner / super_admin |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | Yes | Bearer token |
| id | path | string | Yes | Event UUID |

### 请求示例

```json
{
  "title": "Updated Event",
  "capacity": 40
}
```

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Event updated successfully",
  "data": {
    "id": "a28f4d4c-55f4-45a4-a05e-9b3e3c5b7f92",
    "title": "Updated Event"
  }
}
```

---

## Delete Event

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/events/:id` | DELETE | 删除活动。 | club owner / super_admin |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | Yes | Bearer token |
| id | path | string | Yes | Event UUID |

### 请求示例

无

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Event deleted successfully",
  "data": {
    "id": "a28f4d4c-55f4-45a4-a05e-9b3e3c5b7f92"
  }
}
```

---

## Upload Event Poster

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/events/:id/poster` | POST | 上传活动海报。 | club owner / super_admin |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | Yes | Bearer token |
| id | path | string | Yes | Event UUID |
| poster | formData | file | Yes | 海报图片 |

### 备注
- Content-Type 使用 multipart/form-data。

### 请求示例

```txt
FormData: poster=<file>
```

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Event poster uploaded successfully",
  "data": {
    "id": "a28f4d4c-55f4-45a4-a05e-9b3e3c5b7f92",
    "poster": "/uploads/events/event-poster-xxx.png"
  }
}
```

---

## Signup Event

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/events/:id/signup` | POST | 报名活动。 | Login required + club member |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | Yes | Bearer token |
| id | path | string | Yes | Event UUID |

### 备注
- 用户必须是该社团成员。不能重复报名。

### 请求示例

无

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Event registration successful",
  "data": {
    "id": "d63196f8-82fb-4125-82d2-78be880f8504",
    "eventId": "a28f4d4c-55f4-45a4-a05e-9b3e3c5b7f92",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "status": "registered"
  }
}
```

---

## Cancel Event Signup

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/events/:id/signup` | DELETE | 取消活动报名。 | Login required |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | Yes | Bearer token |
| id | path | string | Yes | Event UUID |

### 请求示例

无

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Event registration cancelled successfully",
  "data": {
    "eventId": "a28f4d4c-55f4-45a4-a05e-9b3e3c5b7f92",
    "userId": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

---

## Get Event Signups

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/events/:id/signups` | GET | 获取活动报名名单。 | club owner / super_admin |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | Yes | Bearer token |
| id | path | string | Yes | Event UUID |

### 请求示例

无

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Event signups fetched successfully",
  "data": {
    "event": {
      "id": "a28f4d4c-55f4-45a4-a05e-9b3e3c5b7f92",
      "registeredCount": 2
    },
    "signups": []
  }
}
```

---

## Get Announcements

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/announcements` | GET | 获取公告列表。 | No |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| keyword | query | string | No | 关键词 |
| clubId | query | string | No | Club UUID |
| status | query | string | No | 状态 |
| pinned | query | boolean | No | 是否置顶 |

### 请求示例

无

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Announcements fetched successfully",
  "data": [
    {
      "id": "34df0ef8-9a35-4c33-a648-7d3c7d6c61c",
      "clubId": "1f3b6f1a-9c12-4d3a-88f0-b8c91f8e2e31",
      "title": "Event Reminder",
      "isPinned": true
    }
  ]
}
```

---

## Get Announcement by ID

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/announcements/:id` | GET | 获取公告详情。 | No |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| id | path | string | Yes | Announcement UUID |

### 请求示例

无

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Announcement fetched successfully",
  "data": {
    "id": "34df0ef8-9a35-4c33-a648-7d3c7d6c61c",
    "clubId": "1f3b6f1a-9c12-4d3a-88f0-b8c91f8e2e31",
    "title": "Event Reminder"
  }
}
```

---

## Get Club Announcements

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/clubs/:clubId/announcements` | GET | 获取指定社团公告。 | No |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| clubId | path | string | Yes | Club UUID |

### 请求示例

无

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Club announcements fetched successfully",
  "data": [
    {
      "id": "34df0ef8-9a35-4c33-a648-7d3c7d6c61c",
      "clubId": "1f3b6f1a-9c12-4d3a-88f0-b8c91f8e2e31",
      "title": "Event Reminder"
    }
  ]
}
```

---

## Create Announcement

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/clubs/:clubId/announcements` | POST | 创建社团公告。 | club owner / super_admin |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | Yes | Bearer token |
| clubId | path | string | Yes | Club UUID |
| title | body | string | Yes | 标题 |
| content | body | string | Yes | 内容 |
| status | body | string | No | draft / published / archived |
| isPinned | body | boolean | No | 是否置顶 |

### 请求示例

```json
{
  "title": "Event Reminder",
  "content": "Please arrive 10 minutes early.",
  "status": "published",
  "isPinned": true
}
```

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Announcement created successfully",
  "data": {
    "id": "34df0ef8-9a35-4c33-a648-7d3c7d6c61c",
    "clubId": "1f3b6f1a-9c12-4d3a-88f0-b8c91f8e2e31",
    "title": "Event Reminder"
  }
}
```

---

## Update Announcement

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/announcements/:id` | PUT | 修改公告。 | club owner / super_admin |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | Yes | Bearer token |
| id | path | string | Yes | Announcement UUID |

### 请求示例

```json
{
  "title": "Updated Announcement",
  "content": "Updated content.",
  "status": "published",
  "isPinned": false
}
```

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Announcement updated successfully",
  "data": {
    "id": "34df0ef8-9a35-4c33-a648-7d3c7d6c61c",
    "title": "Updated Announcement"
  }
}
```

---

## Delete Announcement

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/announcements/:id` | DELETE | 删除公告。 | club owner / super_admin |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | Yes | Bearer token |
| id | path | string | Yes | Announcement UUID |

### 请求示例

无

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Announcement deleted successfully",
  "data": {
    "id": "34df0ef8-9a35-4c33-a648-7d3c7d6c61c"
  }
}
```

---

## Get Managed Announcements

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/manage/announcements` | GET | 获取可管理公告。 | club_admin / super_admin |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | Yes | Bearer token |

### 请求示例

无

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Managed announcements fetched successfully",
  "data": []
}
```

---

## Get Club Comments

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/clubs/:clubId/comments` | GET | 获取社团评论。 | No |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| clubId | path | string | Yes | Club UUID |

### 请求示例

无

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Club comments fetched successfully",
  "data": [
    {
      "id": "9c771cb9-31d5-4e1e-96d3-8ddf6e52f2d6",
      "clubId": "1f3b6f1a-9c12-4d3a-88f0-b8c91f8e2e31",
      "userId": "550e8400-e29b-41d4-a716-446655440000",
      "content": "This club looks interesting.",
      "user": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Student One",
        "avatar": null
      }
    }
  ]
}
```

---

## Create Club Comment

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/clubs/:clubId/comments` | POST | 创建社团评论。 | Login required |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | Yes | Bearer token |
| clubId | path | string | Yes | Club UUID |
| content | body | string | Yes | 评论内容，最多 500 字符 |

### 请求示例

```json
{
  "content": "This club looks really interesting!"
}
```

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Comment created successfully",
  "data": {
    "id": "9c771cb9-31d5-4e1e-96d3-8ddf6e52f2d6",
    "clubId": "1f3b6f1a-9c12-4d3a-88f0-b8c91f8e2e31",
    "content": "This club looks really interesting!"
  }
}
```

---

## Delete Comment

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/comments/:commentId` | DELETE | 删除评论。 | Login required |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | Yes | Bearer token |
| commentId | path | string | Yes | ClubComment UUID |

### 备注
- 用户可以删除自己的评论。club_admin 可以删除自己社团下的评论。super_admin 可以删除任何评论。

### 请求示例

无

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Comment deleted successfully",
  "data": {
    "id": "9c771cb9-31d5-4e1e-96d3-8ddf6e52f2d6"
  }
}
```

---

## Get Managed Comments

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/manage/comments` | GET | 获取可管理评论。 | club_admin / super_admin |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | Yes | Bearer token |

### 请求示例

无

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Managed comments fetched successfully",
  "data": []
}
```

---

## Get Club Gallery

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/clubs/:clubId/gallery` | GET | 获取社团画廊。 | No |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| clubId | path | string | Yes | Club UUID |

### 请求示例

无

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Club gallery fetched successfully",
  "data": [
    {
      "id": "d8f8a734-7f18-4e73-98f6-d1accc9aa4e9",
      "clubId": "1f3b6f1a-9c12-4d3a-88f0-b8c91f8e2e31",
      "imageUrl": "/uploads/gallery/gallery-xxx.png",
      "title": "Club Orientation"
    }
  ]
}
```

---

## Upload Club Gallery Image

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/clubs/:clubId/gallery` | POST | 上传社团画廊图片。 | club owner / super_admin |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | Yes | Bearer token |
| clubId | path | string | Yes | Club UUID |
| image | formData | file | Yes | 图片文件 |
| title | formData | string | No | 标题 |
| description | formData | string | No | 描述 |

### 备注
- Content-Type 使用 multipart/form-data。

### 请求示例

```txt
FormData:
image=<file>
title=Club Orientation
description=New members joined our first meeting.
```

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Gallery image uploaded successfully",
  "data": {
    "id": "d8f8a734-7f18-4e73-98f6-d1accc9aa4e9",
    "clubId": "1f3b6f1a-9c12-4d3a-88f0-b8c91f8e2e31",
    "imageUrl": "/uploads/gallery/gallery-xxx.png",
    "title": "Club Orientation"
  }
}
```

---

## Update Gallery Image

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/gallery/:imageId` | PUT | 修改画廊图片信息。 | club owner / super_admin |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | Yes | Bearer token |
| imageId | path | string | Yes | ClubGalleryImage UUID |
| title | body | string | No | 标题 |
| description | body | string | No | 描述 |

### 请求示例

```json
{
  "title": "Updated Gallery Title",
  "description": "Updated image description."
}
```

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Gallery image updated successfully",
  "data": {
    "id": "d8f8a734-7f18-4e73-98f6-d1accc9aa4e9",
    "title": "Updated Gallery Title"
  }
}
```

---

## Delete Gallery Image

### 接口说明

| 地址 | 请求方式 | 说明 | 鉴权 |
| --- | --- | --- | --- |
| `/api/gallery/:imageId` | DELETE | 删除画廊图片。 | club owner / super_admin |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | Yes | Bearer token |
| imageId | path | string | Yes | ClubGalleryImage UUID |

### 请求示例

无

### 返回参数说明

| 参数名 | 类型 | 说明 |
| --- | --- | --- |
| success | boolean | 是否成功 |
| message | string | 提示信息 |
| data | object / array / null | 返回数据 |

### 返回示例

```json
{
  "success": true,
  "message": "Gallery image deleted successfully",
  "data": {
    "id": "d8f8a734-7f18-4e73-98f6-d1accc9aa4e9"
  }
}
```

---


# 文件上传规则


| 功能 | 接口 | 字段名 | 最大大小 |
| --- | --- | --- | --- |
| User avatar | `POST /api/users/me/avatar` | `avatar` | 2MB |
| User avatar by ID | `POST /api/users/:id/avatar` | `avatar` | 2MB |
| Club logo | `POST /api/clubs/:id/logo` | `logo` | 2MB |
| Event poster | `POST /api/events/:id/poster` | `poster` | 2MB |
| Club gallery image | `POST /api/clubs/:clubId/gallery` | `image` | 5MB |

支持图片格式：

```txt
jpg
jpeg
png
webp
```

# 接口数量


| 模块 | 数量 |
| --- | --- |
| Test | 2 |
| Auth | 2 |
| User | 11 |
| Admin | 4 |
| Club | 12 |
| Event | 10 |
| Announcement | 7 |
| Comment | 4 |
| Gallery | 4 |
| Total | 56 |