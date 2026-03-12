# testNotificationRedirect

Test site for verifying `NOTIFICATION_INITIATED` navigation classification in Edge/Chromium. Demonstrates a service-worker-driven notification flow that triggers `ServiceWorkerVersion::NotifyWindowOpened`, which is the only code path that populates `notification_navigation_events_` and produces the `NOTIFICATION_INITIATED` referrer type.

## How It Works

1. **`index.html`** — Registers a service worker (`sw.js`), requests notification permission, and sends a notification via `ServiceWorkerRegistration.showNotification()`.
2. **`sw.js`** — Handles `notificationclick` and calls `clients.openWindow(url)`. This is the critical piece — `clients.openWindow()` triggers `NotifyWindowOpened` in the browser, which feeds into `notification_navigation_events_` so the subsequent navigation is classified as `NOTIFICATION_INITIATED`.
3. **`redirect.html`** — Intermediate page that redirects to the SmartScreen phishing demo page (`nav.smartscreen.msft.net/phishingdemo.html`) after 2 seconds.

## Requirements

- A browser that supports service workers and the Notifications API
- The required browser feature flags must be enabled (see internal documentation for details)
- The navigation must occur within **5 seconds** of the notification click event

## Usage

1. Host the site (e.g., via GitHub Pages or a local HTTPS server)
2. Launch Edge with the required feature flags enabled (see internal documentation)
3. Open the test page
4. Click **Grant Notification Permission** and allow
5. Click **Send Notification**
6. Click the system notification — the service worker opens `redirect.html` via `clients.openWindow()`, which then redirects to the SmartScreen demo page

## Why Service Workers Matter

Using `new Notification()` from page JS and handling clicks with `window.open()` does **not** produce `NOTIFICATION_INITIATED`. Only `clients.openWindow()` (or `clients.navigate()`) inside the service worker's `notificationclick` handler triggers `ServiceWorkerVersion::NotifyWindowOpened` / `NotifyClientNavigated`, which is what populates `notification_navigation_events_` in the browser.
