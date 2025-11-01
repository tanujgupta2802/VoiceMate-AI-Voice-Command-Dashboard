// const cron = require("node-cron");
// const nodemailer = require("nodemailer");
// const Reminder = require("../models/Reminder");
// const axios = require("axios");

// // Email transporter
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// class ActionService {
//   // Command ko parse karo - intent aur entities nikalo
//   parseCommand(command) {
//     const lower = command.toLowerCase();

//     // ========== REMIND ME ==========
//     if (lower.includes("remind me") || lower.includes("reminder")) {
//       const timeMatch = lower.match(/(\d+)\s*(hour|hours|minute|minutes|min)/);
//       const whatMatch = lower.match(/to\s+(.+?)(?:\s+after|\s+in|$)/);

//       return {
//         intent: "set_reminder",
//         message: whatMatch ? whatMatch[1].trim() : "Reminder",
//         delay: timeMatch
//           ? {
//               value: parseInt(timeMatch[1]),
//               unit: timeMatch[2],
//             }
//           : null,
//       };
//     }

//     // ========== SEND EMAIL ==========
//     if (
//       lower.includes("send") &&
//       (lower.includes("email") || lower.includes("mail"))
//     ) {
//       // Email extract karo
//       const emailPattern = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
//       const emailMatch = command.match(emailPattern);

//       // Check "to me" or "to myself"
//       const toSelf = lower.includes("to me") || lower.includes("to myself");

//       // Subject extract karo (optional)
//       const subjectMatch = lower.match(
//         /subject[:\s]+(.+?)(?:\s+saying|\s+with|$)/i
//       );

//       // ✅ FIXED MESSAGE EXTRACTION:
//       // 1. “send email to <email> <message>”
//       // 2. “send email saying <message>”
//       // 3. “email to me hello” — sab case cover karega
//       let messageMatch =
//         lower.match(/saying[:\s]+(.+)$/i) ||
//         lower.match(/message[:\s]+(.+)$/i) ||
//         lower.match(/content[:\s]+(.+)$/i);

//       let messageText = null;

//       if (messageMatch) {
//         messageText = messageMatch[1].trim();
//       } else {
//         // ✅ Agar “to <email>” ke baad kuch likha ho to use message maan lo
//         const afterEmail = command.split(emailMatch ? emailMatch[0] : "")[1];
//         if (afterEmail && afterEmail.trim().length > 0) {
//           messageText = afterEmail.trim();
//         }
//       }

//       return {
//         intent: "send_email",
//         recipient: emailMatch ? emailMatch[1] : null,
//         toSelf: toSelf,
//         subject: subjectMatch
//           ? subjectMatch[1].trim()
//           : "Message from Voice Assistant",
//         message: messageText || "No message content",
//       };
//     }

//     // ========== PLAY MUSIC ==========
//     if (lower.includes("play")) {
//       const whatPlay = lower.replace("play", "").trim();
//       return {
//         intent: "play_music",
//         query: whatPlay,
//       };
//     }

//     return { intent: "unknown" };
//   }

//   // Time delay calculate karo
//   calculateDelay(delay) {
//     if (!delay) return 60000; // default 1 minute

//     const { value, unit } = delay;
//     if (unit.includes("hour")) return value * 60 * 60 * 1000;
//     if (unit.includes("min")) return value * 60 * 1000;
//     return 60000;
//   }

//   // Reminder set karo
//   async setReminder(userId, message, delayMs) {
//     const scheduledTime = new Date(Date.now() + delayMs);

//     const reminder = new Reminder({
//       userId,
//       message,
//       scheduledTime,
//     });

//     await reminder.save();

//     // Schedule karo
//     setTimeout(async () => {
//       reminder.executed = true;
//       await reminder.save();
//       console.log(`⏰ REMINDER: ${message}`);
//       // Yaha Socket.io se notification bhej sakte ho
//     }, delayMs);

//     // Readable time string
//     const minutes = Math.round(delayMs / 60000);
//     const hours = Math.round(delayMs / 3600000);
//     const timeStr =
//       hours >= 1
//         ? `${hours} hour${hours > 1 ? "s" : ""}`
//         : `${minutes} minute${minutes > 1 ? "s" : ""}`;

//     return {
//       success: true,
//       message: `Reminder set for "${message}" in ${timeStr}`,
//       scheduledTime: scheduledTime,
//     };
//   }

//   // Email bhejo
//   async sendEmail(senderEmail, recipientEmail, subject, text) {
//     try {
//       if (!recipientEmail) {
//         return {
//           success: false,
//           message: "Please specify recipient email address",
//         };
//       }

//       const info = await transporter.sendMail({
//         from: `"Voice Assistant" <${process.env.EMAIL_USER}>`,
//         to: recipientEmail,
//         subject: subject,
//         text: text,
//         html: `
//           <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9fafb;">
//             <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
//               <h2 style="color: #4F46E5; margin-bottom: 20px;">📧 Voice Assistant Message</h2>
//               <p style="font-size: 16px; line-height: 1.8; color: #374151; white-space: pre-line;">${text}</p>
//               <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
//               <p style="color: #9ca3af; font-size: 13px; margin: 0;">
//                 Sent via Voice Assistant by <strong>${senderEmail}</strong>
//               </p>
//             </div>
//           </div>
//         `,
//       });

//       return {
//         success: true,
//         message: `Email sent successfully to ${recipientEmail}`,
//         messageId: info.messageId,
//       };
//     } catch (error) {
//       console.error("Email Error:", error);
//       return {
//         success: false,
//         message: `Email failed: ${error.message}`,
//       };
//     }
//   }

//   // Music play karo - YouTube API se dynamic video ID fetch karo
//   async playMusic(query) {
//     if (!query || query.trim() === "") {
//       return {
//         success: false,
//         message: "Please specify what to play",
//       };
//     }

//     try {
//       const API_KEY = process.env.YOUTUBE_API_KEY;

//       if (!API_KEY) {
//         console.error("❌ YouTube API Key not found in .env");
//         return {
//           success: false,
//           message: "YouTube API not configured",
//         };
//       }

//       console.log("\n" + "=".repeat(60));
//       console.log("🎵 YOUTUBE API REQUEST");
//       console.log("=".repeat(60));
//       console.log("Search Query:", query);

//       const response = await axios.get(
//         `https://www.googleapis.com/youtube/v3/search`,
//         {
//           params: {
//             part: "snippet",
//             q: query,
//             type: "video",
//             maxResults: 1,
//             key: API_KEY,
//           },
//           timeout: 15000,
//         }
//       );

//       if (response.data.items && response.data.items.length > 0) {
//         const video = response.data.items[0];
//         const videoId = video.id.videoId;
//         const title = video.snippet.title;

//         return {
//           success: true,
//           action: "play_music",
//           message: `Now playing: ${title}`,
//           url: `https://www.youtube.com/watch?v=${videoId}`,
//           videoId: videoId,
//           title: title,
//         };
//       } else {
//         return {
//           success: false,
//           message: "No music found for your query",
//         };
//       }
//     } catch (error) {
//       console.log("❌ YOUTUBE API ERROR:", error.message);
//       return {
//         success: false,
//         message:
//           error.response?.data?.error?.message ||
//           "Failed to search music. Please try again.",
//       };
//     }
//   }

//   // Main executor - yaha se sab actions trigger hote hain
//   async executeAction(user, command) {
//     const parsed = this.parseCommand(command);

//     switch (parsed.intent) {
//       case "set_reminder":
//         const delayMs = this.calculateDelay(parsed.delay);
//         return await this.setReminder(
//           user._id || user.email,
//           parsed.message,
//           delayMs
//         );

//       case "send_email":
//         let recipientEmail;

//         if (parsed.toSelf) {
//           recipientEmail = user.email;
//         } else if (parsed.recipient) {
//           recipientEmail = parsed.recipient;
//         } else {
//           return {
//             success: false,
//             message: 'Please specify recipient email or say "to me"',
//           };
//         }

//         return await this.sendEmail(
//           user.email,
//           recipientEmail,
//           parsed.subject,
//           parsed.message
//         );

//       case "play_music":
//         return await this.playMusic(parsed.query);

//       default:
//         return {
//           success: false,
//           message: "Command not recognized as a smart action",
//         };
//     }
//   }

//   // Pending reminders get karo
//   async getPendingReminders(userId) {
//     try {
//       const reminders = await Reminder.find({
//         userId,
//         executed: false,
//         scheduledTime: { $gt: new Date() },
//       }).sort({ scheduledTime: 1 });

//       return {
//         success: true,
//         count: reminders.length,
//         reminders: reminders,
//       };
//     } catch (error) {
//       return {
//         success: false,
//         message: "Failed to fetch reminders",
//         error: error.message,
//       };
//     }
//   }
// }

// module.exports = new ActionService();

const cron = require("node-cron");
const sgMail = require("@sendgrid/mail"); // npm install @sendgrid/mail
const Reminder = require("../models/Reminder");
const axios = require("axios");

// SendGrid setup
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

class ActionService {
  // Command ko parse karo - intent aur entities nikalo
  parseCommand(command) {
    const lower = command.toLowerCase();

    // ========== REMIND ME ==========
    if (lower.includes("remind me") || lower.includes("reminder")) {
      const timeMatch = lower.match(/(\d+)\s*(hour|hours|minute|minutes|min)/);
      const whatMatch = lower.match(/to\s+(.+?)(?:\s+after|\s+in|$)/);

      return {
        intent: "set_reminder",
        message: whatMatch ? whatMatch[1].trim() : "Reminder",
        delay: timeMatch
          ? {
              value: parseInt(timeMatch[1]),
              unit: timeMatch[2],
            }
          : null,
      };
    }

    // ========== SEND EMAIL ==========
    if (
      lower.includes("send") &&
      (lower.includes("email") || lower.includes("mail"))
    ) {
      // Email extract karo
      const emailPattern = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
      const emailMatch = command.match(emailPattern);

      // Check "to me" or "to myself"
      const toSelf = lower.includes("to me") || lower.includes("to myself");

      // Subject extract karo (optional)
      const subjectMatch = lower.match(
        /subject[:\s]+(.+?)(?:\s+saying|\s+with|$)/i
      );

      // ✅ FIXED MESSAGE EXTRACTION:
      // 1. "send email to <email> <message>"
      // 2. "send email saying <message>"
      // 3. "email to me hello" — sab case cover karega
      let messageMatch =
        lower.match(/saying[:\s]+(.+)$/i) ||
        lower.match(/message[:\s]+(.+)$/i) ||
        lower.match(/content[:\s]+(.+)$/i);

      let messageText = null;

      if (messageMatch) {
        messageText = messageMatch[1].trim();
      } else {
        // ✅ Agar "to <email>" ke baad kuch likha ho to use message maan lo
        const afterEmail = command.split(emailMatch ? emailMatch[0] : "")[1];
        if (afterEmail && afterEmail.trim().length > 0) {
          messageText = afterEmail.trim();
        }
      }

      return {
        intent: "send_email",
        recipient: emailMatch ? emailMatch[1] : null,
        toSelf: toSelf,
        subject: subjectMatch
          ? subjectMatch[1].trim()
          : "Message from Voice Assistant",
        message: messageText || "No message content",
      };
    }

    // ========== PLAY MUSIC ==========
    if (lower.includes("play")) {
      const whatPlay = lower.replace("play", "").trim();
      return {
        intent: "play_music",
        query: whatPlay,
      };
    }

    return { intent: "unknown" };
  }

  // Time delay calculate karo
  calculateDelay(delay) {
    if (!delay) return 60000; // default 1 minute

    const { value, unit } = delay;
    if (unit.includes("hour")) return value * 60 * 60 * 1000;
    if (unit.includes("min")) return value * 60 * 1000;
    return 60000;
  }

  // Reminder set karo
  async setReminder(userId, message, delayMs) {
    const scheduledTime = new Date(Date.now() + delayMs);

    const reminder = new Reminder({
      userId,
      message,
      scheduledTime,
    });

    await reminder.save();

    // Schedule karo
    setTimeout(async () => {
      reminder.executed = true;
      await reminder.save();
      console.log(`⏰ REMINDER: ${message}`);
      // Yaha Socket.io se notification bhej sakte ho
    }, delayMs);

    // Readable time string
    const minutes = Math.round(delayMs / 60000);
    const hours = Math.round(delayMs / 3600000);
    const timeStr =
      hours >= 1
        ? `${hours} hour${hours > 1 ? "s" : ""}`
        : `${minutes} minute${minutes > 1 ? "s" : ""}`;

    return {
      success: true,
      message: `Reminder set for "${message}" in ${timeStr}`,
      scheduledTime: scheduledTime,
    };
  }

  // Email bhejo - SendGrid use karke
  async sendEmail(senderEmail, recipientEmail, subject, text) {
    try {
      if (!recipientEmail) {
        return {
          success: false,
          message: "Please specify recipient email address",
        };
      }

      const msg = {
        to: recipientEmail,
        from: process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_USER, // Verified sender email
        subject: subject,
        text: text,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9fafb;">
            <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h2 style="color: #4F46E5; margin-bottom: 20px;">📧 Voice Assistant Message</h2>
              <p style="font-size: 16px; line-height: 1.8; color: #374151; white-space: pre-line;">${text}</p>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 13px; margin: 0;">
                Sent via Voice Assistant by <strong>${senderEmail}</strong>
              </p>
            </div>
          </div>
        `,
      };

      await sgMail.send(msg);

      return {
        success: true,
        message: `Email sent successfully to ${recipientEmail}`,
      };
    } catch (error) {
      console.error("Email Error:", error);
      return {
        success: false,
        message: `Email failed: ${error.message}`,
      };
    }
  }

  // Music play karo - YouTube API se dynamic video ID fetch karo
  async playMusic(query) {
    if (!query || query.trim() === "") {
      return {
        success: false,
        message: "Please specify what to play",
      };
    }

    try {
      const API_KEY = process.env.YOUTUBE_API_KEY;

      if (!API_KEY) {
        console.error("❌ YouTube API Key not found in .env");
        return {
          success: false,
          message: "YouTube API not configured",
        };
      }

      console.log("\n" + "=".repeat(60));
      console.log("🎵 YOUTUBE API REQUEST");
      console.log("=".repeat(60));
      console.log("Search Query:", query);

      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search`,
        {
          params: {
            part: "snippet",
            q: query,
            type: "video",
            maxResults: 1,
            key: API_KEY,
          },
          timeout: 15000,
        }
      );

      if (response.data.items && response.data.items.length > 0) {
        const video = response.data.items[0];
        const videoId = video.id.videoId;
        const title = video.snippet.title;

        return {
          success: true,
          action: "play_music",
          message: `Now playing: ${title}`,
          url: `https://www.youtube.com/watch?v=${videoId}`,
          videoId: videoId,
          title: title,
        };
      } else {
        return {
          success: false,
          message: "No music found for your query",
        };
      }
    } catch (error) {
      console.log("❌ YOUTUBE API ERROR:", error.message);
      return {
        success: false,
        message:
          error.response?.data?.error?.message ||
          "Failed to search music. Please try again.",
      };
    }
  }

  // Main executor - yaha se sab actions trigger hote hain
  async executeAction(user, command) {
    const parsed = this.parseCommand(command);

    switch (parsed.intent) {
      case "set_reminder":
        const delayMs = this.calculateDelay(parsed.delay);
        return await this.setReminder(
          user._id || user.email,
          parsed.message,
          delayMs
        );

      case "send_email":
        let recipientEmail;

        if (parsed.toSelf) {
          recipientEmail = user.email;
        } else if (parsed.recipient) {
          recipientEmail = parsed.recipient;
        } else {
          return {
            success: false,
            message: 'Please specify recipient email or say "to me"',
          };
        }

        return await this.sendEmail(
          user.email,
          recipientEmail,
          parsed.subject,
          parsed.message
        );

      case "play_music":
        return await this.playMusic(parsed.query);

      default:
        return {
          success: false,
          message: "Command not recognized as a smart action",
        };
    }
  }

  // Pending reminders get karo
  async getPendingReminders(userId) {
    try {
      const reminders = await Reminder.find({
        userId,
        executed: false,
        scheduledTime: { $gt: new Date() },
      }).sort({ scheduledTime: 1 });

      return {
        success: true,
        count: reminders.length,
        reminders: reminders,
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to fetch reminders",
        error: error.message,
      };
    }
  }
}

module.exports = new ActionService();
