# Smart Control: the dashboard behind an employee-benefits platform

**The control panel for the Elite employee-benefits platform: client companies, partners, gifts, engagement events and reports in one place.**

## The problem

An employee-benefits programme has many moving parts: client companies, thousands of employees, partner brands with offers and gifts, and events that get people to take part. The team running it needs answers every day — how much is the app used, who joined the survey and who didn't, how much gift stock is left. Without one clear panel, those answers come late and follow-up is manual.

## What was built

Smart Control is Elite's dashboard, and also a system with parts of its own. Admins, each client company's HR team and partners linked to a client all use it, and each sees only what their permissions allow. From it the team manages companies, employees, partners and offers, hands out gifts and points, runs events and surveys, and reads the results in clear reports.

## Key features

- See app usage day by day and pin "events" — an offer launch, a reminder — on the chart to see whether usage moved afterwards.
- For the work-life survey, see who finished, who stopped halfway and who never opened it, then nudge them with a notification from the same screen.
- Run walking challenges, photo votes and tournaments, and track engagement per company.
- Track gift stock across the main warehouse, the market and each client's store, in riyals and points.
- Follow complaints, ratings and the most-browsed sectors in one place.
- Permissions shape the menu and every action, so each user sees only their part.

## My role

Frontend developer of the Smart Control dashboard since 2024. I reworked every existing screen and built new ones from scratch — engagement events and tournaments, gift management, usage reports, the work-life survey report and auto-reply. The backend was built by the company's backend team.

The dashboard existed before I joined, with real problems in speed and design. I worked on both and have owned its interface since; today about **68%** of its screen code is mine.

## Results

- **22** operations staff use the dashboard.
- **101** gifts from **85** gift partners are managed through it.

It runs the Elite platform; the platform's numbers (companies and employees) are on the Elite page.

## Under the hood

- **Stack:** Laravel 8, Blade and jQuery, ApexCharts, DataTables, Select2, Flatpickr; full Arabic RTL interface.
- **Architecture:** one backend serving three audiences — the dashboard, the employee API used by the Elite apps, and a cashier API for partner stores. Push through FCM/APNs, real-time updates through Pusher.
- **Engineering decisions:**
  - Chart events are stored as data and drawn as annotations at every zoom level (day, month, year), with a bar listing the events in the current period.
  - "Select all" on event participants sends counts and filters to the server instead of thousands of IDs, so bulk notifications stay fast.
  - Survey follow-up lists open straight from the chart legend, with search, paging and Excel export.

## Status

**Live**, still being extended.
