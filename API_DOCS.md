# Campus Club Backend API 文档（KOOK 风格）



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
| student | 普通学生用户 |
| club_admin | 社团管理员，只能管理自己创建的社团 |
| super_admin | 超级管理员，可以管理所有内容 |

## 重要说明

- `clubId` 是 6 位随机字母数字字符串，例如 `A7K9Q2`，前端不要使用 `Number(clubId)`。
- 社团支持双语字段：`chineseName`、`englishName`、`name`。
- 评论现在属于社团，不属于活动。
- 指定社团获取活动使用：`GET /api/events?clubId=A7K9Q2`。

# 接口列表

| 接口 | 接口说明 | 维护状态 |
| --- | --- | --- |
| `GET /` | 测试后端是否运行 | 正常 |
| `GET /api/health` | 检查服务器健康状态 | 正常 |
| `POST /api/auth/register` | 注册新用户，仅允许 @wku.edu.cn 邮箱 | 正常 |
| `POST /api/auth/login` | 用户登录，返回 JWT token | 正常 |
| `GET /api/users/me` | 获取当前登录用户信息 | 正常 |
| `PUT /api/users/me` | 修改当前用户资料 | 正常 |
| `POST /api/users/me/avatar` | 上传当前用户头像 | 正常 |
| `GET /api/users/me/club-applications` | 获取当前用户提交的社团申请 | 正常 |
| `GET /api/users/me/clubs` | 获取当前用户加入的社团 | 正常 |
| `GET /api/users/me/event-signups` | 获取当前用户报名的活动 | 正常 |
| `GET /api/users` | 超级管理员获取所有用户 | 正常 |
| `GET /api/users/:id` | 获取指定用户信息 | 正常 |
| `PUT /api/users/:id` | 修改指定用户信息 | 正常 |
| `POST /api/users/:id/avatar` | 上传指定用户头像 | 正常 |
| `GET /api/admin/users` | 管理员获取所有用户 | 正常 |
| `GET /api/admin/users/:id` | 管理员获取指定用户 | 正常 |
| `PUT /api/admin/users/:id/role` | 管理员修改用户角色 | 正常 |
| `DELETE /api/admin/users/:id` | 管理员删除用户 | 正常 |
| `GET /api/clubs` | 获取社团列表，支持关键词、分类和状态筛选 | 正常 |
| `GET /api/clubs/:id` | 获取社团详情 | 正常 |
| `POST /api/clubs` | 创建社团，自动生成 6 位社团 ID | 正常 |
| `PUT /api/clubs/:id` | 修改社团信息 | 正常 |
| `DELETE /api/clubs/:id` | 删除社团 | 正常 |
| `POST /api/clubs/:id/logo` | 上传社团 Logo | 正常 |
| `POST /api/clubs/:id/apply` | 申请加入社团 | 正常 |
| `GET /api/clubs/:id/applications` | 获取社团申请列表 | 正常 |
| `PUT /api/clubs/:clubId/applications/:applicationId/approve` | 批准入社申请，用户自动成为成员 | 正常 |
| `PUT /api/clubs/:clubId/applications/:applicationId/reject` | 拒绝入社申请 | 正常 |
| `GET /api/clubs/:id/members` | 获取社团成员列表 | 正常 |
| `DELETE /api/clubs/:clubId/members/:userId` | 移除社团成员 | 正常 |
| `GET /api/events` | 获取活动列表，可用 clubId 获取指定社团活动 | 正常 |
| `GET /api/events/:id` | 获取活动详情 | 正常 |
| `GET /api/events/:id/signup-count` | 获取报名人数和剩余名额 | 正常 |
| `POST /api/clubs/:clubId/events` | 创建活动 | 正常 |
| `PUT /api/events/:id` | 修改活动 | 正常 |
| `DELETE /api/events/:id` | 删除活动 | 正常 |
| `POST /api/events/:id/poster` | 上传活动海报 | 正常 |
| `POST /api/events/:id/signup` | 报名活动 | 正常 |
| `DELETE /api/events/:id/signup` | 取消当前用户的活动报名 | 正常 |
| `GET /api/events/:id/signups` | 获取活动报名名单 | 正常 |
| `GET /api/announcements` | 获取公告列表 | 正常 |
| `GET /api/announcements/:id` | 获取公告详情 | 正常 |
| `GET /api/clubs/:clubId/announcements` | 获取指定社团公告 | 正常 |
| `POST /api/clubs/:clubId/announcements` | 创建社团公告 | 正常 |
| `PUT /api/announcements/:id` | 修改公告 | 正常 |
| `DELETE /api/announcements/:id` | 删除公告 | 正常 |
| `GET /api/manage/announcements` | 获取当前管理员可管理的公告 | 正常 |
| `GET /api/clubs/:clubId/comments` | 获取指定社团评论 | 正常 |
| `POST /api/clubs/:clubId/comments` | 给社团发表评论 | 正常 |
| `DELETE /api/comments/:commentId` | 删除评论 | 正常 |
| `GET /api/users/me/comments` | 获取当前用户发表过的社团评论 | 正常 |
| `GET /api/manage/comments` | 获取当前管理员可管理的评论 | 正常 |
| `GET /api/clubs/:clubId/gallery` | 获取指定社团画廊 | 正常 |
| `POST /api/clubs/:clubId/gallery` | 上传社团画廊图片 | 正常 |
| `PUT /api/gallery/:imageId` | 修改画廊图片标题和描述 | 正常 |
| `DELETE /api/gallery/:imageId` | 删除画廊图片 | 正常 |

# 详细接口


## 1. 后端首页测试

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/` | GET | 测试后端是否运行 |

### 参数列表

无

### 请求示例

```json
{}
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
  "message": "Campus Club Backend API is running"
}
```

---


## 2. 健康检查

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/health` | GET | 检查服务器健康状态 |

### 参数列表

无

### 请求示例

```json
{}
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
  "message": "Server is healthy"
}
```

---


## 3. 用户注册

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/auth/register` | POST | 注册新用户，仅允许 @wku.edu.cn 邮箱 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| email | body | string | true | 邮箱，必须以 @wku.edu.cn 结尾 |
| password | body | string | true | 密码，至少 6 位 |
| name | body | string | false | 姓名 |
| studentId | body | string | false | 学号，唯一 |
| major | body | string | false | 专业 |
| grade | body | string | false | 年级 |

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
      "id": 3,
      "email": "student@wku.edu.cn",
      "role": "student",
      "name": "Student Name"
    }
  }
}
```

---


## 4. 用户登录

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/auth/login` | POST | 用户登录，返回 JWT token |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| email | body | string | true | 邮箱 |
| password | body | string | true | 密码 |

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
      "id": 1,
      "email": "super@wku.edu.cn",
      "role": "super_admin"
    }
  }
}
```

---


## 5. 获取当前用户

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/users/me` | GET | 获取当前登录用户信息 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | true | 登录 |

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
    "id": 3,
    "email": "student1@wku.edu.cn",
    "role": "student",
    "name": "Student One"
  }
}
```

---


## 6. 修改当前用户

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/users/me` | PUT | 修改当前用户资料 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | true | 登录 |
| name | body | string | false | 姓名 |
| studentId | body | string | false | 学号 |
| major | body | string | false | 专业 |
| grade | body | string | false | 年级 |
| bio | body | string | false | 简介 |

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
    "id": 3,
    "name": "Theodore Qiu"
  }
}
```

---


## 7. 上传当前用户头像

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/users/me/avatar` | POST | 上传当前用户头像 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | true | 登录 |
| avatar | formData | file | true | 头像图片 |

### 请求示例

```txt
avatar: <file>
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
    "id": 3,
    "avatar": "/uploads/avatars/avatar-xxx.png"
  }
}
```

---


## 8. 获取我的社团申请

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/users/me/club-applications` | GET | 获取当前用户提交的社团申请 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | true | 登录 |

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
      "id": 1,
      "clubId": "A7K9Q2",
      "status": "pending"
    }
  ]
}
```

---


## 9. 获取我加入的社团

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/users/me/clubs` | GET | 获取当前用户加入的社团 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | true | 登录 |

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
      "clubId": "A7K9Q2",
      "role": "member"
    }
  ]
}
```

---


## 10. 获取我的活动报名

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/users/me/event-signups` | GET | 获取当前用户报名的活动 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | true | 登录 |

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
      "eventId": 1,
      "status": "registered"
    }
  ]
}
```

---


## 11. 获取所有用户

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/users` | GET | 超级管理员获取所有用户 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | true | super_admin |

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
      "id": 1,
      "email": "super@wku.edu.cn",
      "role": "super_admin"
    }
  ]
}
```

---


## 12. 获取指定用户

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/users/:id` | GET | 获取指定用户信息 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | true | 登录 |
| id | path | integer | true | 用户 ID |

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
    "id": 3,
    "email": "student1@wku.edu.cn"
  }
}
```

---


## 13. 修改指定用户

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/users/:id` | PUT | 修改指定用户信息 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | true | 登录 |
| id | path | integer | true | 用户 ID |
| name | body | string | false | 姓名 |
| studentId | body | string | false | 学号 |
| major | body | string | false | 专业 |
| grade | body | string | false | 年级 |
| bio | body | string | false | 简介 |

### 请求示例

```json
{
  "name": "Updated Name",
  "studentId": "1234567",
  "major": "Computer Science",
  "grade": "Senior",
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
    "id": 3,
    "name": "Updated Name"
  }
}
```

---


## 14. 上传指定用户头像

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/users/:id/avatar` | POST | 上传指定用户头像 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | true | 登录 |
| id | path | integer | true | 用户 ID |
| avatar | formData | file | true | 头像图片 |

### 请求示例

```txt
avatar: <file>
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
    "id": 3,
    "avatar": "/uploads/avatars/avatar-xxx.png"
  }
}
```

---


## 15. 管理员获取所有用户

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/admin/users` | GET | 管理员获取所有用户 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | true | super_admin |

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
      "id": 1,
      "role": "super_admin"
    }
  ]
}
```

---


## 16. 管理员获取指定用户

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/admin/users/:id` | GET | 管理员获取指定用户 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | true | super_admin |
| id | path | integer | true | 用户 ID |

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
    "id": 2,
    "email": "clubadmin@wku.edu.cn"
  }
}
```

---


## 17. 管理员修改用户角色

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/admin/users/:id/role` | PUT | 管理员修改用户角色 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | true | super_admin |
| id | path | integer | true | 用户 ID |
| role | body | string | true | student / club_admin / super_admin |

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
    "id": 2,
    "role": "club_admin"
  }
}
```

---


## 18. 管理员删除用户

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/admin/users/:id` | DELETE | 管理员删除用户 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | true | super_admin |
| id | path | integer | true | 用户 ID |

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
    "id": 2
  }
}
```

---


## 19. 获取社团列表

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/clubs` | GET | 获取社团列表，支持关键词、分类和状态筛选 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| keyword | query | string | false | 搜索关键词 |
| category | query | string | false | 社团分类 |
| status | query | string | false | 状态，默认 active |

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
      "id": "A7K9Q2",
      "chineseName": "图灵计算机社",
      "englishName": "Turing Computer Club"
    }
  ]
}
```

---


## 20. 获取社团详情

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/clubs/:id` | GET | 获取社团详情 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| id | path | string | true | 6 位社团 ID |

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
    "id": "A7K9Q2",
    "chineseName": "图灵计算机社",
    "englishName": "Turing Computer Club"
  }
}
```

---


## 21. 创建社团

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/clubs` | POST | 创建社团，自动生成 6 位社团 ID |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | true | club_admin / super_admin |
| chineseName | body | string | false | 中文名 |
| englishName | body | string | false | 英文名 |
| name | body | string | false | 兼容字段 |
| description | body | string | false | 简介 |
| purpose | body | string | false | 宗旨 |
| mission | body | string | false | 使命 |
| category | body | string | false | 分类 |
| joinInfo | body | string | false | 加入方式 |
| reviewer | body | string | false | 审核人 |

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
    "id": "A7K9Q2",
    "chineseName": "图灵计算机社",
    "englishName": "Turing Computer Club"
  }
}
```

---


## 22. 修改社团

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/clubs/:id` | PUT | 修改社团信息 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | true | club owner / super_admin |
| id | path | string | true | 社团 ID |
| chineseName | body | string | false | 中文名 |
| englishName | body | string | false | 英文名 |
| description | body | string | false | 简介 |
| purpose | body | string | false | 宗旨 |
| mission | body | string | false | 使命 |
| category | body | string | false | 分类 |
| status | body | string | false | 状态 |

### 请求示例

```json
{
  "chineseName": "图灵计算机社",
  "englishName": "Turing Computer Club",
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
    "id": "A7K9Q2",
    "status": "active"
  }
}
```

---


## 23. 删除社团

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/clubs/:id` | DELETE | 删除社团 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | true | club owner / super_admin |
| id | path | string | true | 社团 ID |

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
    "id": "A7K9Q2"
  }
}
```

---


## 24. 上传社团 Logo

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/clubs/:id/logo` | POST | 上传社团 Logo |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | true | club owner / super_admin |
| id | path | string | true | 社团 ID |
| logo | formData | file | true | Logo 图片 |

### 请求示例

```txt
logo: <file>
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
    "id": "A7K9Q2",
    "logo": "/uploads/clubs/club-logo-xxx.png"
  }
}
```

---


## 25. 申请加入社团

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/clubs/:id/apply` | POST | 申请加入社团 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | true | 登录 |
| id | path | string | true | 社团 ID |
| reason | body | string | true | 申请理由 |

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
    "id": 1,
    "clubId": "A7K9Q2",
    "status": "pending"
  }
}
```

---


## 26. 获取社团申请列表

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/clubs/:id/applications` | GET | 获取社团申请列表 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | true | club owner / super_admin |
| id | path | string | true | 社团 ID |

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
      "id": 1,
      "clubId": "A7K9Q2",
      "status": "pending"
    }
  ]
}
```

---


## 27. 批准入社申请

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/clubs/:clubId/applications/:applicationId/approve` | PUT | 批准入社申请，用户自动成为成员 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | true | club owner / super_admin |
| clubId | path | string | true | 社团 ID |
| applicationId | path | integer | true | 申请 ID |

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
    "id": 1,
    "status": "approved"
  }
}
```

---


## 28. 拒绝入社申请

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/clubs/:clubId/applications/:applicationId/reject` | PUT | 拒绝入社申请 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | true | club owner / super_admin |
| clubId | path | string | true | 社团 ID |
| applicationId | path | integer | true | 申请 ID |

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
    "id": 1,
    "status": "rejected"
  }
}
```

---


## 29. 获取社团成员

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/clubs/:id/members` | GET | 获取社团成员列表 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | true | 登录 |
| id | path | string | true | 社团 ID |

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
      "userId": 2,
      "role": "president"
    }
  ]
}
```

---


## 30. 移除社团成员

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/clubs/:clubId/members/:userId` | DELETE | 移除社团成员 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | true | club owner / super_admin |
| clubId | path | string | true | 社团 ID |
| userId | path | integer | true | 用户 ID |

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
    "clubId": "A7K9Q2",
    "userId": 3
  }
}
```

---


## 31. 获取活动列表

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/events` | GET | 获取活动列表，可用 clubId 获取指定社团活动 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| keyword | query | string | false | 关键词 |
| clubId | query | string | false | 社团 ID，例如 A7K9Q2 |
| status | query | string | false | 状态，默认 published |

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
      "id": 1,
      "clubId": "A7K9Q2",
      "title": "AI Coding Workshop",
      "registeredCount": 2,
      "remainingSeats": 28
    }
  ]
}
```

---


## 32. 获取活动详情

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/events/:id` | GET | 获取活动详情 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| id | path | integer | true | 活动 ID |

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
    "id": 1,
    "title": "AI Coding Workshop",
    "registeredCount": 2
  }
}
```

---


## 33. 获取活动报名人数

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/events/:id/signup-count` | GET | 获取报名人数和剩余名额 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| id | path | integer | true | 活动 ID |

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
    "eventId": 1,
    "registeredCount": 2,
    "remainingSeats": 28
  }
}
```

---


## 34. 创建社团活动

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/clubs/:clubId/events` | POST | 创建活动 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | true | club owner / super_admin |
| clubId | path | string | true | 社团 ID |
| title | body | string | true | 标题 |
| description | body | string | false | 简介 |
| location | body | string | false | 地点 |
| startTime | body | datetime | true | 开始时间 ISO |
| endTime | body | datetime | true | 结束时间 ISO |
| capacity | body | integer | false | 容量 |
| status | body | string | false | 状态，默认 published |

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
    "id": 1,
    "clubId": "A7K9Q2",
    "title": "AI Coding Workshop"
  }
}
```

---


## 35. 修改活动

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/events/:id` | PUT | 修改活动 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | true | club owner / super_admin |
| id | path | integer | true | 活动 ID |

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
    "id": 1,
    "title": "Updated Event"
  }
}
```

---


## 36. 删除活动

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/events/:id` | DELETE | 删除活动 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | true | club owner / super_admin |
| id | path | integer | true | 活动 ID |

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
    "id": 1
  }
}
```

---


## 37. 上传活动海报

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/events/:id/poster` | POST | 上传活动海报 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | true | club owner / super_admin |
| id | path | integer | true | 活动 ID |
| poster | formData | file | true | 海报图片 |

### 请求示例

```txt
poster: <file>
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
    "id": 1,
    "poster": "/uploads/events/event-poster-xxx.png"
  }
}
```

---


## 38. 报名活动

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/events/:id/signup` | POST | 报名活动 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | true | 登录 + 社团成员 |
| id | path | integer | true | 活动 ID |

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
    "id": 1,
    "eventId": 1,
    "userId": 3,
    "status": "registered"
  }
}
```

---


## 39. 取消活动报名

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/events/:id/signup` | DELETE | 取消当前用户的活动报名 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | true | 登录 |
| id | path | integer | true | 活动 ID |

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
    "eventId": 1,
    "userId": 3
  }
}
```

---


## 40. 获取活动报名名单

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/events/:id/signups` | GET | 获取活动报名名单 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | true | club owner / super_admin |
| id | path | integer | true | 活动 ID |

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
      "id": 1,
      "registeredCount": 2
    },
    "signups": []
  }
}
```

---


## 41. 获取公告列表

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/announcements` | GET | 获取公告列表 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| keyword | query | string | false | 关键词 |
| clubId | query | string | false | 社团 ID |
| status | query | string | false | 状态 |
| pinned | query | boolean | false | 是否置顶 |

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
      "id": 1,
      "clubId": "A7K9Q2",
      "title": "Event Reminder"
    }
  ]
}
```

---


## 42. 获取公告详情

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/announcements/:id` | GET | 获取公告详情 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| id | path | integer | true | 公告 ID |

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
    "id": 1,
    "title": "Event Reminder"
  }
}
```

---


## 43. 获取指定社团公告

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/clubs/:clubId/announcements` | GET | 获取指定社团公告 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| clubId | path | string | true | 社团 ID |

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
      "id": 1,
      "title": "Event Reminder"
    }
  ]
}
```

---


## 44. 创建社团公告

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/clubs/:clubId/announcements` | POST | 创建社团公告 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | true | club owner / super_admin |
| clubId | path | string | true | 社团 ID |
| title | body | string | true | 标题 |
| content | body | string | true | 内容 |
| status | body | string | false | draft / published / archived |
| isPinned | body | boolean | false | 是否置顶 |

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
    "id": 1,
    "clubId": "A7K9Q2",
    "title": "Event Reminder"
  }
}
```

---


## 45. 修改公告

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/announcements/:id` | PUT | 修改公告 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | true | club owner / super_admin |
| id | path | integer | true | 公告 ID |
| title | body | string | false | 标题 |
| content | body | string | false | 内容 |
| status | body | string | false | 状态 |
| isPinned | body | boolean | false | 是否置顶 |

### 请求示例

```json
{
  "title": "Updated Announcement",
  "content": "Updated content",
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
    "id": 1,
    "title": "Updated Announcement"
  }
}
```

---


## 46. 删除公告

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/announcements/:id` | DELETE | 删除公告 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | true | club owner / super_admin |
| id | path | integer | true | 公告 ID |

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
    "id": 1
  }
}
```

---


## 47. 获取可管理公告

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/manage/announcements` | GET | 获取当前管理员可管理的公告 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | true | club_admin / super_admin |

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


## 48. 获取社团评论

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/clubs/:clubId/comments` | GET | 获取指定社团评论 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| clubId | path | string | true | 社团 ID |

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
      "id": 1,
      "clubId": "A7K9Q2",
      "content": "This club looks interesting."
    }
  ]
}
```

---


## 49. 创建社团评论

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/clubs/:clubId/comments` | POST | 给社团发表评论 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | true | 登录 |
| clubId | path | string | true | 社团 ID |
| content | body | string | true | 评论内容，最多 500 字符 |

### 请求示例

```json
{
  "content": "This club looks interesting."
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
    "id": 1,
    "clubId": "A7K9Q2",
    "content": "This club looks interesting."
  }
}
```

---


## 50. 删除评论

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/comments/:commentId` | DELETE | 删除评论 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | true | 登录 |
| commentId | path | integer | true | 评论 ID |

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
    "id": 1
  }
}
```

---


## 51. 获取我的评论

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/users/me/comments` | GET | 获取当前用户发表过的社团评论 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | true | 登录 |

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
      "id": 1,
      "clubId": "A7K9Q2",
      "content": "This club looks interesting."
    }
  ]
}
```

---


## 52. 获取可管理评论

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/manage/comments` | GET | 获取当前管理员可管理的评论 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | true | club_admin / super_admin |

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


## 53. 获取社团画廊

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/clubs/:clubId/gallery` | GET | 获取指定社团画廊 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| clubId | path | string | true | 社团 ID |

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
      "id": 1,
      "clubId": "A7K9Q2",
      "imageUrl": "/uploads/gallery/gallery-xxx.png"
    }
  ]
}
```

---


## 54. 上传社团画廊图片

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/clubs/:clubId/gallery` | POST | 上传社团画廊图片 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | true | club owner / super_admin |
| clubId | path | string | true | 社团 ID |
| image | formData | file | true | 图片文件 |
| title | formData | string | false | 标题 |
| description | formData | string | false | 描述 |

### 请求示例

```txt
image: <file>
title: <value>
description: <value>
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
    "id": 1,
    "clubId": "A7K9Q2",
    "imageUrl": "/uploads/gallery/gallery-xxx.png",
    "title": "Club Orientation"
  }
}
```

---


## 55. 修改画廊图片信息

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/gallery/:imageId` | PUT | 修改画廊图片标题和描述 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | true | club owner / super_admin |
| imageId | path | integer | true | 图片 ID |
| title | body | string | false | 标题 |
| description | body | string | false | 描述 |

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
    "id": 1,
    "title": "Updated Gallery Title"
  }
}
```

---


## 56. 删除画廊图片

### 接口说明

| 地址 | 请求方式 | 说明 |
| --- | --- | --- |
| `/api/gallery/:imageId` | DELETE | 删除画廊图片 |

### 参数列表

| 参数名 | 位置 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- | --- |
| Authorization | header | string | true | club owner / super_admin |
| imageId | path | integer | true | 图片 ID |

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
    "id": 1
  }
}
```

---


# 文件上传规则

| 功能 | 接口 | 字段名 | 最大大小 |
| --- | --- | --- | --- |
| 用户头像 | `POST /api/users/me/avatar` | `avatar` | 2MB |
| 指定用户头像 | `POST /api/users/:id/avatar` | `avatar` | 2MB |
| 社团 Logo | `POST /api/clubs/:id/logo` | `logo` | 2MB |
| 活动海报 | `POST /api/events/:id/poster` | `poster` | 2MB |
| 社团画廊图片 | `POST /api/clubs/:clubId/gallery` | `image` | 5MB |

支持图片格式：`jpg`、`jpeg`、`png`、`webp`。


# 接口数量

| 模块 | 数量 |
| --- | --- |
| Test | 2 |
| Auth | 2 |
| User | 10 |
| Admin | 4 |
| Club | 12 |
| Event | 10 |
| Announcement | 7 |
| Comment | 5 |
| Gallery | 4 |
| 总计 | 56 |