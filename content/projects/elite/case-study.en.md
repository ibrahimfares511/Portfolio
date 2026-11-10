# Elite: employee benefits platform

A web app that gives company employees discounts at local shops, restaurants and gyms, and brings them together through events, points and gifts. Status: live with 8 companies and 13,326 employees.

## The problem

Elite was only available as a mobile app. The company needed a web version with the same benefits (offers, the map, chat, events and points) that employees could open in a browser, and that would work for every client company under its own brand.

## What was built

One web app that wears each company's brand (logo and colours), so the screens here use a demo company's brand. Employees sign in with their phone number or email, browse offers by sector, city or on a map, message the shop directly, and redeem in store by scanning the shop's QR code and uploading a photo of the receipt. In the same app, the company runs events for its staff, and every bit of participation turns into points employees can spend on gifts.

## Key features

- Find the closest offers on a map, with a search radius the employee sets.
- Redeem in store by scanning a QR code and uploading the receipt, so the company sees real usage.
- Chat with shops: voice notes, shared locations, replies and forwarded messages.
- Five event types for the company to run: step marathons with a department leaderboard, photo voting, daily streaks, tournaments with invitations between colleagues, and a work-life survey.
- Points earned from events, sent to colleagues and exchanged for gifts.
- Every company gets its own logo and colours without a separate build.

## My role

Lead frontend developer. I built the app from the first commit in two months (June 2024), and I have kept shipping changes and new features on it since. 283 of the 289 commits are mine.

## The dashboard: Smart Control

Behind the app is a dashboard called Smart Control, where the admin team, client companies and partners manage offers, gifts, events and reports. It is also a system with parts of its own, and I have worked on its interface since 2024. It has its own page.

## Results

- **8** companies using it today
- **13,326** employees with an account
- **2 months** from first commit to launch
- **5** event types, plus points and gifts

## Under the hood

**Stack:** React 18, Vite, Redux Toolkit with redux-persist, React-Bootstrap, axios, Firebase Cloud Messaging, Google Maps JS API.

**Engineering decisions:**

1. **One build, many brands.** The login link carries the client's ID; the app loads that client's logo (also swapped into the favicon and home-screen icon) and applies its colours as CSS variables. Same code and the same deployment for every client.
2. **Real-time chat on top of a REST API.** New messages arrive as Firebase push events and go straight into the Redux store. Online status is kept fresh by a heartbeat on tab visibility and network changes.
3. **One API layer that protects the whole app.** A single maintenance switch stops every request with one message, and an expired session sends the user back to login automatically. State is split into 13 slices with one async thunk per endpoint.

## Status

Live
