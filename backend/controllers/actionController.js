// const actionService = require("../services/actionService");

// // Smart action execute karo
// exports.executeSmartAction = async (req, res) => {
//   try {
//     const { command } = req.body;

//     // User object - auth middleware se aayega
//     // Agar auth nahi hai to error throw karo
//     if (!req.user) {
//       return res.status(401).json({
//         success: false,
//         message: "Authentication required",
//       });
//     }

//     const result = await actionService.executeAction(req.user, command);

//     res.json(result);
//   } catch (error) {
//     console.error("Action execution error:", error);
//     res.status(500).json({
//       success: false,
//       message: "Action execution failed",
//       error: error.message,
//     });
//   }
// };

// // Pending reminders get karo
// exports.getPendingReminders = async (req, res) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({
//         success: false,
//         message: "Authentication required",
//       });
//     }

//     const result = await actionService.getPendingReminders(
//       req.user._id || req.user.email
//     );

//     res.json(result);
//   } catch (error) {
//     console.error("Get reminders error:", error);
//     res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// };

// // Delete reminder
// exports.deleteReminder = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const Reminder = require("../models/Reminder");

//     const reminder = await Reminder.findOneAndDelete({
//       _id: id,
//       userId: req.user._id || req.user.email,
//     });

//     if (!reminder) {
//       return res.status(404).json({
//         success: false,
//         message: "Reminder not found",
//       });
//     }

//     res.json({
//       success: true,
//       message: "Reminder deleted successfully",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// };

const actionService = require("../services/actionService");

exports.executeSmartAction = async (req, res) => {
  try {
    const { command } = req.body;

    // ✅ Ab req.user mein REAL logged-in user hai
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // ✅ Real user use karo
    const result = await actionService.executeAction(req.user, command);

    res.json(result);
  } catch (error) {
    console.error("Action execution error:", error);
    res.status(500).json({
      success: false,
      message: "Action execution failed",
      error: error.message,
    });
  }
};

// Same for other functions...
exports.getPendingReminders = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const result = await actionService.getPendingReminders(
      req.user._id || req.user.email
    );

    res.json(result);
  } catch (error) {
    console.error("Get reminders error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.deleteReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const Reminder = require("../models/Reminder");

    const reminder = await Reminder.findOneAndDelete({
      _id: id,
      userId: req.user._id || req.user.email,
    });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: "Reminder not found",
      });
    }

    res.json({
      success: true,
      message: "Reminder deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
