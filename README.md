# Salepost Scrap ERP

Production-ready Laravel 12 internal business management system for a Nigerian scrap business. The app is built for owners and staff who need clean records for sales, stock, purchases, cash flow, invoices, documents, customers, suppliers, and reports without a technical learning curve.

## Stack

- Laravel 12
- PHP 8.3+
- Inertia.js + React + TypeScript
- Tailwind CSS
- shadcn-style reusable UI components
- MySQL-first configuration
- Spatie Laravel Permission
- Laravel Breeze (Inertia React)
- DOMPDF for invoice downloads
- Database queues and notifications

## Core Features

- Secure auth, password reset, profile settings, session protection
- Role and permission management for owner, manager, cashier, sales staff, storekeeper, and viewer
- Responsive dashboard with totals, alerts, recent activity, charts, and date filtering
- Product/material register with stock levels, reorder levels, tags, and adjustment log
- Sales workflow with draft/completed sales, invoices, partial payments, and stock deduction
- Purchase/intake workflow with supplier tracking, stock increase, and linked cash outflows
- Cash in/out register with categories, payment methods, filters, and summaries
- Customer and supplier registries with balances and linked records
- Business document registry with uploads, references, dates, tags, and audit logging
- Reports for sales, invoices, cash flow, product movement, customer/supplier statements, and expense trends
- Dark/light mode with persistent theme support
- Audit trail for important operational changes
- Branch-ready schema for future multi-branch rollout

## Setup

1. Install backend dependencies.

```bash
composer install
```

2. Install frontend dependencies.

```bash
npm install
```

3. Create the environment file and configure MySQL.

```bash
cp .env.example .env
php artisan key:generate
```

4. Update `.env` with your MySQL credentials.

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=salepost
DB_USERNAME=root
DB_PASSWORD=
```

5. Run migrations and seed realistic demo data.

```bash
php artisan migrate --seed
```

6. Link storage for uploaded documents and generated invoice PDFs.

```bash
php artisan storage:link
```

7. Start the app.

```bash
php artisan serve
npm run dev
```

8. Run the queue worker for invoice PDF generation, low stock alerts, and queued notifications.

```bash
php artisan queue:work
```

9. Build production assets when deploying.

```bash
npm run build
```

## Demo Accounts

All seeded accounts use the password `password`.

| Role | Email |
| --- | --- |
| Owner | `owner@salepost.ng` |
| Manager | `manager@salepost.ng` |
| Cashier / Account Officer | `cashier@salepost.ng` |
| Sales Staff | `sales@salepost.ng` |
| Storekeeper | `storekeeper@salepost.ng` |
| Viewer / Auditor | `auditor@salepost.ng` |

## Seeded Demo Data

- Materials: Karfe, Brass, Jar Waya, Aluminium, Copper, Battery Scrap, Mixed Metals
- Product categories: Ferrous, Non-Ferrous, Wire Scrap, Battery Scrap, Mixed Materials
- Realistic customers, suppliers, cash transactions, purchases, sales, invoices, documents, and audit records
- Partial and full payment examples
- Low-stock scenario for dashboard alerts and notifications
- Main branch plus a second sample branch for branch-ready architecture

## Recommended Structure

```text
app/
  Enums/
  Events/
  Http/
    Controllers/
    Middleware/
    Requests/
  Jobs/
  Models/
    Concerns/
  Notifications/
  Policies/
  Services/
  Support/
database/
  factories/
  migrations/
  seeders/
resources/
  css/
  js/
    components/
    components/ui/
    layouts/
    lib/
    Pages/
    types/
routes/
  web.php
resources/views/pdf/
tests/
  Feature/
```

## Migration Order

1. Framework tables: users, cache, jobs, sessions, notifications
2. Access control: roles, permissions, model permissions
3. Branch and settings foundation
4. Product categories and products
5. Stock movement ledger
6. Customers and suppliers
7. Sales, invoices, payments
8. Purchases and purchase items
9. Cash transactions and expense categories
10. Documents and tags
11. Audit logs
12. User business profile fields

## Key Routes

- `/dashboard`
- `/products`
- `/customers`
- `/suppliers`
- `/sales`
- `/invoices`
- `/purchases`
- `/cash-transactions`
- `/documents`
- `/reports`
- `/settings`
- `/users`
- `/profile`

## Permission Matrix

| Role | Main Access |
| --- | --- |
| Owner | Full system access, settings, permissions, users, finance, reports |
| Manager | Operations access across inventory, sales, purchases, finance, documents, reports |
| Cashier | Invoices, payments, cash in/out, finance records, reports, documents |
| Sales Staff | Customers, sales register, invoices, stock view, document upload |
| Storekeeper | Products, stock adjustments, suppliers, purchase intake, reports |
| Viewer | Read-only access to allowed records and reports |

Granular permissions are seeded through `App\Support\PermissionMatrix` and managed with Spatie Laravel Permission.

## Sample Dashboard Widgets

- Today sales total
- Weekly sales total
- Monthly sales total
- Cash in today
- Cash out today
- Outstanding customer balances
- Low stock alerts
- Recent invoices
- Recent cash transactions
- Sales by product/material
- Top customers
- Top selling materials

## Important Workflow Logic

- Completed sales reduce stock automatically
- Received purchases increase stock automatically
- Partial payments update invoice, sale, customer, and supplier balances
- Cash transactions can be auto-generated from sale and purchase payments
- Stock changes and finance actions are wrapped in database transactions
- Negative stock is blocked by default unless business settings allow it
- Important actions write to the audit log
- Invoice PDF generation and low-stock alerts use queued jobs

## Notable Backend Pieces

- `app/Services/SaleService.php`
- `app/Services/PurchaseService.php`
- `app/Services/PaymentService.php`
- `app/Services/InventoryService.php`
- `app/Services/CashTransactionService.php`
- `app/Services/DashboardService.php`
- `app/Services/ReportService.php`
- `app/Support/PermissionMatrix.php`

## Tests

Run the full test suite:

```bash
php artisan test
```

Covered critical flows include:

- completed sale reduces stock and creates invoice
- received purchase increases stock
- partial payment updates invoice and customer balance
- role-based access restrictions
- negative stock protection

## Implementation Summary

The application ships with a modular service-based backend, policy-driven authorization, reusable request validation, realistic sample data, responsive Inertia pages, dark/light theming, queue-backed background work, and feature tests for the most important business operations. It is ready to continue from internal MVP into production hardening, especially around deployment, backups, and organization-specific reporting rules.
