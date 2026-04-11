import { api } from "./api";

// URL Base64 to Uint8Array converter
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function subscribeToWebPush() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    throw new Error("Push notifications not supported by browser.");
  }

  // Register or get existing service worker
  const registration = await navigator.serviceWorker.register("/sw.js");
  await navigator.serviceWorker.ready;

  // Ask for permission
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Permission not granted for Notification.");
  }

  // Fetch Public Key from backend
  const { data } = await api.get("/api/settings/push/vapidPublicKey");
  const publicVapidKey = data.publicKey;

  if (!publicVapidKey) {
    throw new Error("Failed to get VAPID public key");
  }

  // Subscribe to push
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
  });

  // Send subscription to backend
  await api.post("/api/settings/push/subscribe", subscription);
  
  return true;
}

export async function unsubscribeFromWebPush() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    return false;
  }

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  
  if (subscription) {
    // Tell backend to remove it
    await api.post("/api/settings/push/unsubscribe", { endpoint: subscription.endpoint });
    // Tell browser to unsub
    await subscription.unsubscribe();
    return true;
  }
  return false;
}
