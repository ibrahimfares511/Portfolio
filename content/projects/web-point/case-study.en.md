# Web Point: a restaurant POS built for the floor

**A touch-first point of sale and back office for sit-down restaurants with delivery. Used in 5 restaurants in Egypt.**

---

## The problem

A busy restaurant runs three businesses at once. There's the hall, with tables that open, merge and move. There's the takeaway counter. And there's a delivery desk taking calls. Each one has its own prices, tax and service charge. Each order has to reach the right station (grill, kitchen or bar) the moment it's taken, and the owner needs the cash to match at the end of every shift.

Before Web Point, these restaurants ran on paper orders or on another POS, depending on the place. Paper means handwritten tickets, totals added by hand and no reports. The generic POS treated all of this as one list of receipts. Either way, waiters worked around the tools, and the owner only found the gaps the next morning.

## What we built

Web Point runs in the browser on a touch screen in each hall, while the kitchen and the bar each have just a printer. The cashier opens a table on a floor plan that matches the real room and adds dishes with a double tap. A short swipe on a line removes it. When the order is taken, every item prints at its own station: food in the kitchen, drinks at the bar. Payment, shift close and day close follow the same flow, and the owner reads ten reports from the same data.

## Key features

- **See the whole room at a glance.** Each hall has its own floor plan with real table sizes. A table's colour tells you if it's free, busy, waiting for payment or reserved.
- **Each item prints at its own station.** A juice prints at the bar and a grill dish in the kitchen, as soon as the order is taken. Kitchen slips can use a different item name from the customer check.
- **Three channels, one menu.** Every item has its own dine-in, takeaway and delivery price, and each channel has its own tax and service rules.
- **Delivery handled end to end.** Find the customer by phone with their saved address and delivery fee, hand the order to a driver, and settle each driver's cash.
- **Cash that adds up.** Day and shift close, numbered checks per terminal with gap detection, void and transfer logs, and per-user discount limits.
- **Ten reports for the owner.** Sales by item, waiter, shift and channel, plus discounts, voids, transfers, cost and cost of sold items.

## My role

Co-founder. I led the frontend: the POS screens (login, floor plan, order and payment, delivery, options) and the control-panel and report interfaces. The backend logic was not mine.

## Results

- Used in **5 restaurants** in Egypt.
- About **100 orders a day** in each restaurant.
- A **lean setup**: one touch screen per hall, and just a printer in the kitchen and at the bar.
- Replaced **paper orders or another POS**, depending on the restaurant.
- **Still in use** in at least one of the restaurants today.

## Under the hood

**Stack:** Laravel 6 (PHP), MySQL, Blade views, jQuery and AJAX, Bootstrap 4, DataTables, jQuery UI with touch support, mPDF for printed reports, Spatie roles and permissions.

**Architecture:** one Laravel application split into three areas: `/menu` (the POS), `/admin` (control panel) and `/Reports`. Shared business rules for days, shifts, serials, tax and service live in one place and every screen uses them. Most actions are AJAX calls, so terminals never reload during service.

Decisions in the system design (team work):

1. **Live day vs. history.** Orders sit in small "live" tables during service. When the day ends, everything moves to history tables in one step. The screens waiters use stay fast, and reports read from a separate set.
2. **Printing goes through a queue.** The app doesn't talk to printers. It writes print jobs to a queue table, and a print agent on the restaurant network sends each item to its station. Printing never holds up the cashier's screen.
3. **Built for touch, not a mouse** (my part, in the interface). Login is a user picker plus a PIN pad. There's an on-screen keyboard with English and Arabic layouts, items are added by double tap (so a stray touch doesn't add a dish), and ticket lines open their actions with a swipe.

## Status

Delivered. Used in 5 restaurants in Egypt, and at least one still runs it today. Not in active development.

*Screens in this case study use invented demo data (a fictional restaurant, names and prices). No client data is shown.*
