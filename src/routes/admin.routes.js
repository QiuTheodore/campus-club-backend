const express = require("express");
const router = express.Router();

const {
  getAdminUsers,
  getAdminUserById,
  updateUserRole,
  deleteUserById,
} = require("../controllers/admin.controller");

const { authenticate } = require("../middleware/auth.middleware");
const { requireRoles } = require("../middleware/role.middleware");

router.use(authenticate);
router.use(requireRoles("super_admin"));

router.get("/users", getAdminUsers);
router.get("/users/:id", getAdminUserById);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUserById);

module.exports = router;