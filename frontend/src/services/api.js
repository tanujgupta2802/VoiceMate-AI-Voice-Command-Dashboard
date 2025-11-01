// // import axios from "axios";

// // const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3003";

// // // ✅ Send voice command
// // export async function sendCommand(text, userId) {
// //   if (!userId) throw new Error("User ID is required");
// //   const payload = { text, userId };
// //   const res = await axios.post(`${API_BASE}/api/command`, payload, {
// //     timeout: 30000,
// //   });
// //   return res.data;
// // }

// // // ✅ Create a note
// // export async function createNoteAPI(content, userId) {
// //   if (!userId) throw new Error("User ID is required");
// //   const res = await fetch(`${API_BASE}/api/notes`, {
// //     method: "POST",
// //     headers: { "Content-Type": "application/json" },
// //     body: JSON.stringify({ userId, content }),
// //   });
// //   return res.json();
// // }

// // // ✅ List notes
// // export async function listNotesAPI(userId) {
// //   if (!userId) throw new Error("User ID is required");
// //   const res = await fetch(
// //     `${API_BASE}/api/notes?userId=${encodeURIComponent(userId)}`
// //   );
// //   return res.json();
// // }

// // // ✅ Delete a note
// // export async function deleteNoteAPI(id, userId) {
// //   if (!userId) throw new Error("User ID is required");
// //   const res = await fetch(
// //     `${API_BASE}/api/notes/${id}?userId=${encodeURIComponent(userId)}`,
// //     {
// //       method: "DELETE",
// //     }
// //   );
// //   return res.json();
// // }

// import axios from "axios";

// const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3003";

// // ✅ Send voice command
// export async function sendCommand(text, userId) {
//   if (!userId) throw new Error("User ID is required");
//   const payload = { text, userId };
//   const res = await axios.post(`${API_BASE}/api/command`, payload, {
//     timeout: 30000,
//   });
//   return res.data;
// }

// // ✅ Create a note
// export async function createNoteAPI(content, userId) {
//   if (!userId) throw new Error("User ID is required");
//   const res = await fetch(`${API_BASE}/api/notes`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ userId, content }),
//   });
//   return res.json();
// }

// // ✅ List notes
// export async function listNotesAPI(userId) {
//   if (!userId) throw new Error("User ID is required");
//   const res = await fetch(
//     `${API_BASE}/api/notes?userId=${encodeURIComponent(userId)}`
//   );
//   return res.json();
// }

// // ✅ Delete a note
// export async function deleteNoteAPI(id, userId) {
//   if (!userId) throw new Error("User ID is required");
//   const res = await fetch(
//     `${API_BASE}/api/notes/${id}?userId=${encodeURIComponent(userId)}`,
//     {
//       method: "DELETE",
//     }
//   );
//   return res.json();
// }

// // ========================================
// // 🔥 NEW: Smart Action APIs
// // ========================================

// // ✅ Execute Smart Action (Reminders, Email, Music)
// export async function executeSmartActionAPI(command, user) {
//   if (!user) throw new Error("User authentication required");

//   const res = await axios.post(
//     `${API_BASE}/api/actions/execute`,
//     { command },
//     {
//       headers: {
//         "Content-Type": "application/json",
//         // Add auth token if you have JWT implementation
//         // "Authorization": `Bearer ${token}`
//       },
//       timeout: 30000,
//     }
//   );
//   return res.data;
// }

// // ✅ Get Pending Reminders
// export async function getPendingRemindersAPI(user) {
//   if (!user) throw new Error("User authentication required");

//   const res = await axios.get(`${API_BASE}/api/actions/reminders`, {
//     headers: {
//       // Add auth token if you have JWT implementation
//       // "Authorization": `Bearer ${token}`
//     },
//   });
//   return res.data;
// }

// // ✅ Delete a Reminder
// export async function deleteReminderAPI(reminderId, user) {
//   if (!user) throw new Error("User authentication required");

//   const res = await axios.delete(
//     `${API_BASE}/api/actions/reminders/${reminderId}`,
//     {
//       headers: {
//         // Add auth token if you have JWT implementation
//         // "Authorization": `Bearer ${token}`
//       },
//     }
//   );
//   return res.data;
// }

import axios from "axios";
import { getAuth } from "firebase/auth";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3003";

// ✅ Send voice command
export async function sendCommand(text, userId) {
  if (!userId) throw new Error("User ID is required");
  const payload = { text, userId };
  const res = await axios.post(`${API_BASE}/api/command`, payload, {
    timeout: 30000,
  });
  return res.data;
}

// ✅ Create a note
export async function createNoteAPI(content, userId) {
  if (!userId) throw new Error("User ID is required");
  const res = await fetch(`${API_BASE}/api/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, content }),
  });
  return res.json();
}

// ✅ List notes
export async function listNotesAPI(userId) {
  if (!userId) throw new Error("User ID is required");
  const res = await fetch(
    `${API_BASE}/api/notes?userId=${encodeURIComponent(userId)}`
  );
  return res.json();
}

// ✅ Delete a note
export async function deleteNoteAPI(id, userId) {
  if (!userId) throw new Error("User ID is required");
  const res = await fetch(
    `${API_BASE}/api/notes/${id}?userId=${encodeURIComponent(userId)}`,
    {
      method: "DELETE",
    }
  );
  return res.json();
}

// ========================================
// 🔥 NEW: Smart Action APIs
// ========================================

// ✅ Execute Smart Action (Reminders, Email, Music)
export async function executeSmartActionAPI(command, user) {
  if (!user) throw new Error("User authentication required");

  const auth = getAuth();
  const currentUser = auth.currentUser;
  const token = currentUser ? await currentUser.getIdToken() : null;

  const res = await axios.post(
    `${API_BASE}/api/actions/execute`,
    { command },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ Added token header
      },
      timeout: 30000,
    }
  );
  return res.data;
}

// ✅ Get Pending Reminders
export async function getPendingRemindersAPI(user) {
  if (!user) throw new Error("User authentication required");

  const auth = getAuth();
  const currentUser = auth.currentUser;
  const token = currentUser ? await currentUser.getIdToken() : null;

  const res = await axios.get(`${API_BASE}/api/actions/reminders`, {
    headers: {
      Authorization: `Bearer ${token}`, // ✅ Added token header
    },
  });
  return res.data;
}

// ✅ Delete a Reminder
export async function deleteReminderAPI(reminderId, user) {
  if (!user) throw new Error("User authentication required");

  const auth = getAuth();
  const currentUser = auth.currentUser;
  const token = currentUser ? await currentUser.getIdToken() : null;

  const res = await axios.delete(
    `${API_BASE}/api/actions/reminders/${reminderId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Added token header
      },
    }
  );
  return res.data;
}
