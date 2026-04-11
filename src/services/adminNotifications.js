// src/services/adminNotifications.js
// ─────────────────────────────────────────────────────────────────────────────
// In-session browser notification service for the admin panel.
// Reads the admin's saved notification preferences and fires native
// Notification API alerts when relevant backend alerts are detected.
// ─────────────────────────────────────────────────────────────────────────────

import { api } from "./api";

let _initialized = false;
let _sessionFiredAlerts = new Set();  // prevents duplicate alerts per session

// Request permission once. Returns true if granted.
export async function requestNotificationPermission() {
  if (!("Notification" in window)) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  const result = await Notification.requestPermission();
  return result === "granted";
}

// Fire a browser notification (only when permission granted)
function fireNotification(title, body, tag) {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  if (_sessionFiredAlerts.has(tag)) return; // deduplicate within session
  _sessionFiredAlerts.add(tag);
  try {
    new Notification(title, {
      body,
      icon: "/favicon.ico",
      tag,
      requireInteraction: false,
    });
  } catch (e) {
    // Safari / some browsers may reject — silent fail
  }
}

// Main entry — call once when the admin panel mounts.
// `notificationSettings` = the object from the Settings page:
//   { stockAlerts, outOfStockAlerts, returnRequests, dailySalesSummary, systemUpdates }
export async function initAdminNotifications(notificationSettings = {}) {
  if (_initialized) return;
  _initialized = true;

  // Step 1 — request permission
  const granted = await requestNotificationPermission();
  if (!granted) return;

  // Step 2 — fetch live alert data from backend
  let alerts = null;
  try {
    const res = await api.get("/api/admin/analytics/alerts");
    alerts = res.data?.alerts;
  } catch {
    return; // silently skip if backend is unreachable
  }

  if (!alerts) return;

  const {
    stockAlerts = true,
    outOfStockAlerts = true,
    returnRequests = true,
    dailySalesSummary = true,
  } = notificationSettings;

  // Out-of-stock alerts
  if (outOfStockAlerts && alerts.outOfStockCount > 0) {
    const names = alerts.outOfStockProducts?.slice(0, 3).join(", ") || "some products";
    fireNotification(
      `⚠️ ${alerts.outOfStockCount} Product${alerts.outOfStockCount > 1 ? "s" : ""} Out of Stock`,
      `${names} ${alerts.outOfStockCount > 3 ? "and more" : ""} are out of stock. Restock immediately.`,
      "out-of-stock"
    );
  }

  // Pending return requests
  if (returnRequests && alerts.pendingReturnCount > 0) {
    fireNotification(
      `🔄 ${alerts.pendingReturnCount} Pending Return${alerts.pendingReturnCount > 1 ? "s" : ""}`,
      `${alerts.pendingReturnCount} return request${alerts.pendingReturnCount > 1 ? "s" : ""} need your review in the Returns panel.`,
      "pending-returns"
    );
  }
}

// Reset session state (call on logout)
export function resetNotificationSession() {
  _initialized = false;
  _sessionFiredAlerts.clear();
}
