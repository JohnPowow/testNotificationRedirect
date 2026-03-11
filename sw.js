// Service worker for notification-initiated navigation test.
// The notificationclick handler uses clients.openWindow() which is the only
// code path that feeds into notification_navigation_events_ via
// ServiceWorkerVersion::NotifyWindowOpened, producing NOTIFICATION_INITIATED.

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = event.notification.data && event.notification.data.url;
  if (!url) {
    return;
  }

  // clients.openWindow() is the key — this calls NotifyWindowOpened in the
  // browser, which populates notification_navigation_events_ so the subsequent
  // navigation is classified as NOTIFICATION_INITIATED.
  event.waitUntil(clients.openWindow(url));
});
