# Warehouse Management System

**One system for 5 linked warehouses, replacing paper and Excel. Every unit of stock has a recorded history, and every order is checked twice before it leaves.**

## The problem

The business ran 5 warehouses on paper and Excel. Each warehouse kept its own sheets, so nobody could see in one place what was in stock, where it was, or what was already promised to a customer. Orders were prepared from printed lists, mistakes were found by the customer, and moving stock between warehouses depended on phone calls. When a number was wrong, there was no way to find out who changed it or when.

## What was built

A web system that the whole operation runs on: office staff, pickers, reviewers, drivers, returns staff and auditors, each with their own screens and permissions. Stock lives in one database, split per warehouse and per section, and every change goes through the same rules: receiving, picking, shipping, returns, transfers, dispatches to branches, supplier returns and stock counts. It runs on desktop in the office and as an installable app on phones on the warehouse floor.

## Key features

- **Stock you can trust.** Every movement is saved with who did it, when, the order or document behind it, and the balance before and after.
- **Every order is checked twice.** One person picks by scanning, a second person checks by scanning, and products that need serial numbers are tracked per unit.
- **Problems are caught early.** If another order takes the last units, the waiting order is flagged with the exact shortage, and it goes back in the queue as soon as new stock arrives.
- **Transfers without phone calls.** Stock moves between warehouses or out to branches in a few clicks, and both sides update at once.
- **Stock counts without closing the warehouse.** A count is spread over several days, two people can't count the same item at once, and any difference needs a manager's approval and a reason.
- **The right screen for each person.** 43 permissions, 7 role templates and access per warehouse, plus 25 reports.

## My role

I built the full system on my own: the database design, backend, frontend and deployment.

## Results

- **5** warehouses linked in one system
- **25** employees use it every day
- **1,000+** products managed
- From paper and Excel to one system: a smaller first version since early 2026, then the full current version since June 2026

## Under the hood

**Stack:** React 19, TypeScript, Vite, Tailwind, TanStack Query, Zustand, Node.js, Express 5, Prisma, PostgreSQL 16, Redis, BullMQ, Socket.io, Docker Compose.

**Architecture:** a layered API (routes and permission checks, controllers, services, repositories) on one PostgreSQL database. Redis handles live updates and background jobs. The whole system runs in Docker Compose, and the database is never exposed outside the server.

**Three engineering decisions:**

1. **Stock is a ledger, not a number.** Every change runs inside a database transaction and writes a ledger line with the balance before and after. Stock is split into available, reserved and damaged, so units already promised to an order never show as free. Any count can be traced back line by line.
2. **Order conflicts are resolved at the moment of reservation.** When a picker confirms an order, other waiting orders that need the same products are re-checked in the same transaction. If they are now short, they move to "Issue" with the exact reason. When stock arrives, they are checked again and released automatically.
3. **Counting is safe with many people on the floor.** Each count task is locked with a single conditional update, so two people can't take the same item. A background job frees locks that were abandoned for 30 minutes, and every screen in that warehouse updates live. The barcode-scanner input also reads physical key positions, so scans still work when the PC keyboard is set to Arabic.

## Status

**Live.** In daily use since early 2026 (the full current version since June 2026). Integration with the company's POS is planned as the next phase.

*Screens and videos use invented demo data. No real client data is shown.*
