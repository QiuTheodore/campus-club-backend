````md
# Campus Club Backend - 简洁接口说明

后端技术栈：Node.js + Express + Prisma + SQLite + JWT + Multer  
功能：用户管理、角色权限、社团管理、社团申请、活动管理、活动报名、公告管理、评论管理、文件上传。

---

## 1. 启动项目

```bash
npm install
npx prisma migrate dev
npx prisma generate
node prisma/seed.js
npm run dev
````

服务器：`http://localhost:3000`

---

## 2. 用户角色

| 角色          | 权限                          |
| ----------- | --------------------------- |
| student     | 注册、登录、编辑个人信息、申请社团、报名活动、评论活动 |
| club_admin  | 管理自己社团、审核申请、发布活动、公告         |
| super_admin | 管理所有用户、社团、活动、评论、公告          |

---

## 3. 认证

* 登录 / 注册返回 token
* 前端存储 token（localStorage 或 Vuex/Redux）
* 请求需要权限的接口时在 Header 中加：

```
Authorization: Bearer <TOKEN>
```

用户界面不显示 token。

---

## 4. 主要模块接口

### 用户 User

| 方法   | 接口                              | Auth        | 说明     |
| ---- | ------------------------------- | ----------- | ------ |
| GET  | /api/users/me                   | ✅           | 获取当前用户 |
| PUT  | /api/users/me                   | ✅           | 修改当前用户 |
| POST | /api/users/me/avatar            | ✅           | 上传头像   |
| GET  | /api/users/me/club-applications | ✅           | 我的社团申请 |
| GET  | /api/users/me/clubs             | ✅           | 我加入的社团 |
| GET  | /api/users/me/event-signups     | ✅           | 我的活动报名 |
| GET  | /api/users/me/comments          | ✅           | 我的评论   |
| GET  | /api/users                      | super_admin | 所有用户   |
| GET  | /api/users/:id                  | ✅           | 用户详情   |
| PUT  | /api/users/:id                  | ✅           | 修改用户   |
| POST | /api/users/:id/avatar           | ✅           | 上传用户头像 |

### 管理 Admin

| 方法     | 接口                        | Auth        | 说明   |
| ------ | ------------------------- | ----------- | ---- |
| GET    | /api/admin/users          | super_admin | 所有用户 |
| GET    | /api/admin/users/:id      | super_admin | 查看用户 |
| PUT    | /api/admin/users/:id/role | super_admin | 修改角色 |
| DELETE | /api/admin/users/:id      | super_admin | 删除用户 |

### 社团 Club

| 方法     | 接口                                                     | Auth                     | 说明        |
| ------ | ------------------------------------------------------ | ------------------------ | --------- |
| GET    | /api/clubs                                             | ❌                        | 所有社团      |
| GET    | /api/clubs/:id                                         | ❌                        | 社团详情      |
| POST   | /api/clubs                                             | club_admin / super_admin | 创建社团      |
| PUT    | /api/clubs/:id                                         | club_admin / super_admin | 修改社团      |
| DELETE | /api/clubs/:id                                         | club_admin / super_admin | 删除社团      |
| POST   | /api/clubs/:id/logo                                    | club_admin / super_admin | 上传社团 Logo |
| POST   | /api/clubs/:id/apply                                   | ✅                        | 申请加入社团    |
| GET    | /api/clubs/:id/applications                            | club_admin / super_admin | 查看申请      |
| PUT    | /api/clubs/:clubId/applications/:applicationId/approve | club_admin / super_admin | 批准申请      |
| PUT    | /api/clubs/:clubId/applications/:applicationId/reject  | club_admin / super_admin | 拒绝申请      |
| GET    | /api/clubs/:id/members                                 | ✅                        | 社团成员列表    |
| DELETE | /api/clubs/:clubId/members/:userId                     | club_admin / super_admin | 移除成员      |

### 活动 Event

| 方法     | 接口                           | Auth                     | 说明            |
| ------ | ---------------------------- | ------------------------ | ------------- |
| GET    | /api/events                  | ❌                        | 活动列表          |
| GET    | /api/events/:id              | ❌                        | 活动详情          |
| GET    | /api/events/:id/signup-count | ❌                        | 活动报名人数        |
| POST   | /api/clubs/:clubId/events    | club_admin / super_admin | 发布活动（文字 + 海报） |
| PUT    | /api/events/:id              | club_admin / super_admin | 修改活动          |
| DELETE | /api/events/:id              | club_admin / super_admin | 删除活动          |
| POST   | /api/events/:id/poster       | club_admin / super_admin | 上传活动海报        |
| POST   | /api/events/:id/signup       | ✅                        | 学生报名活动        |
| DELETE | /api/events/:id/signup       | ✅                        | 取消报名          |
| GET    | /api/events/:id/signups      | club_admin / super_admin | 活动报名名单        |

### 公告 Announcement

| 方法     | 接口                               | Auth                     | 说明             |
| ------ | -------------------------------- | ------------------------ | -------------- |
| GET    | /api/announcements               | ❌                        | 公告列表           |
| GET    | /api/announcements/:id           | ❌                        | 公告详情           |
| GET    | /api/clubs/:clubId/announcements | ❌                        | 社团公告           |
| POST   | /api/clubs/:clubId/announcements | club_admin / super_admin | 发布公告（文字，可扩展图片） |
| PUT    | /api/announcements/:id           | club_admin / super_admin | 修改公告           |
| DELETE | /api/announcements/:id           | club_admin / super_admin | 删除公告           |
| GET    | /api/manage/announcements        | club_admin / super_admin | 管理可管理公告        |

### 评论 Comment

| 方法     | 接口                       | Auth                     | 说明                   |
| ------ | ------------------------ | ------------------------ | -------------------- |
| GET    | /api/events/:id/comments | ❌                        | 活动评论列表               |
| POST   | /api/events/:id/comments | ✅                        | 发布评论（文字，可扩展图片）       |
| DELETE | /api/comments/:commentId | ✅                        | 删除评论（自己/社团管理员/超级管理员） |
| GET    | /api/users/me/comments   | ✅                        | 我的评论                 |
| GET    | /api/manage/comments     | club_admin / super_admin | 管理可管理评论              |

---

## 5. 文件上传规则

* 用户头像：`/api/users/me/avatar` → FormData field: `avatar`
* 活动海报：`/api/events/:id/poster` → FormData field: `poster`
* 社团 Logo：`/api/clubs/:id/logo` → FormData field: `logo`
* 最大 2MB，支持 jpg/png/webp
* 上传成功返回 URL → 前端直接显示

---

## 6. 前端使用建议

* 登录 / 注册获取 token → 前端保存
* 需要权限的接口自动在 Header 加：

```
Authorization: Bearer <TOKEN>
```

* 文件上传接口用 `FormData`
* 其他接口直接用 JSON 请求/返回数据


---

## 7. Demo 流程

1. Super Admin 登录 → 提升 club_admin
2. Club Admin 创建社团 → 发布活动 + 公告
3. 学生申请加入社团 → 审核通过 → 报名活动
4. 学生评论活动
5. Club Admin / Super Admin 管理公告和评论

---

## 8. 总结功能

* 用户管理、注册登录、头像上传
* 角色权限控制（student / club_admin / super_admin）
* 社团创建、修改、申请加入、成员管理
* 活动发布、修改、报名、海报上传
* 公告发布、修改、删除
* 活动评论、删除
* 文件上传与展示


---

**接口总数**：50+（包含测试接口）