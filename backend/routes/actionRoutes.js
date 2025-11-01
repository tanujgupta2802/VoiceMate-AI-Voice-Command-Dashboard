// const express = require("express");
// const router = express.Router();
// const actionController = require("../controllers/actionController");

// // Auth middleware - apna existing use kar (probably already hai)
// // const authMiddleware = require('../middleware/auth');

// // Smart action execute karo
// router.post("/execute", actionController.executeSmartAction);

// // Pending reminders list
// router.get("/reminders", actionController.getPendingReminders);

// // Delete specific reminder
// router.delete("/reminders/:id", actionController.deleteReminder);

// module.exports = router;

const express = require("express");
const router = express.Router();
const actionController = require("../controllers/actionController");
const authMiddleware = require("../middleware/authMiddleware"); // ✅ Import

// ✅ Middleware lagao
router.post("/execute", authMiddleware, actionController.executeSmartAction);
router.get("/reminders", authMiddleware, actionController.getPendingReminders);
router.delete(
  "/reminders/:id",
  authMiddleware,
  actionController.deleteReminder
);

module.exports = router;
