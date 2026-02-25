# Organick — Full-Stack E-commerce Platform

Organick is a production-style full-stack e-commerce application built with Next.js App Router, Prisma, PostgreSQL, Better Auth, and Stripe. It includes complete customer shopping flows, account management, admin operations, CMS/blog features, and role-based access control.

---

## Project Highlights

- End-to-end commerce flow: browse products → cart → Stripe checkout → thank-you page
- Customer account center: profile, address book, favourites, order history, password change
- Admin dashboard and operations: products, categories, orders, users, reviews, blogs, messages, settings
- Content and engagement modules: blog posts, product reviews, contact messaging
- Strong backend foundation: Prisma schema + **17 migration folders** and dedicated action layers

---

## Technology Stack

### Frontend

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- Framer Motion
- Lucide + Font Awesome icons

### Backend & Services

- Prisma ORM + PostgreSQL
- Better Auth (email/password + optional Google/GitHub OAuth)
- Stripe Checkout integration
- Nodemailer (email flows)

### Quality & Tooling

- ESLint
- Vitest + Testing Library

---

## Functionalities Implemented

### 1) Customer-Facing Store

- Home page and marketing sections
- Product listing page and dynamic single product route (`/products/[productSlug]`)
- Category-based shopping experience
- Cart management (add/update/remove)
- Checkout workflow and payment handoff
- Post-checkout success/thank-you page

### 2) Authentication & Access Control

- Register, login, forgot/reset password, verify email routes
- Better Auth integration
- Optional social login support (Google/GitHub)
- Route protection middleware
- Role model support (customer/admin/super-admin)

### 3) Account Area

- Account overview
- Address management (`/account/addresses`)
- Order tracking/history (`/account/orders`)
- Favourites management (`/account/favourites`)
- Change password

### 4) Admin Panel

Available admin sections under `/admin`:

- Dashboard
- Products management
- Categories management
- Orders management
- Users management
- Reviews moderation
- Blog management
- Contact messages management
- Settings

### 5) Content, Communication & Trust

- Blog module and blog status support
- Product reviews system
- Contact form and message handling
- Service and About pages

---

## Work Scope Evidence (Implemented Modules)

### Route Architecture (`src/app`)

- Storefront, auth, account, checkout, blog, service, contact, and admin route groups are all present.

### Business Logic Layer (`src/actions`)

- Dedicated action files for: products, categories, cart, checkout, orders, users, profile, addresses, reviews, blog, contact, admin stats/search/notifications.

### Database Evolution (`prisma/migrations`)

- 17 migration directories tracked, covering:
	- blog table + blog status
	- contact messages
	- user roles
	- currency normalization to integer cents
	- order address/session updates
	- cart item uniqueness constraints
	- reviews and pricing enhancements
	- shipped status/tracking additions

This reflects substantial incremental delivery and maintenance work over time.

---

## Screenshot Showcase (Project Work)

> These screenshots/images come from the current project assets in `public/img` and demonstrate the implemented UI scope.

### Main Navigation & Branding

![Navigation](public/img/navigation.png)

### Home / Storefront Visual

![Home Banner](https://res.cloudinary.com/db5l8tzgk/image/upload/v1772045721/Home_k3uebv.png)

### Product Experience

![Categories](https://res.cloudinary.com/db5l8tzgk/image/upload/v1772045719/categories_tnqk3q.png)
![our Collection](https://res.cloudinary.com/db5l8tzgk/image/upload/v1772045722/products_ou40ls.png)
![Product Example](https://res.cloudinary.com/db5l8tzgk/image/upload/v1772045716/product_details_fe6mho.png)
![Reviews Section](https://res.cloudinary.com/db5l8tzgk/image/upload/v1772045718/reviews_iby3ni.png)

### Blog Section

![Blog Feed](https://res.cloudinary.com/db5l8tzgk/image/upload/v1772045721/blog_feed_va9isr.png)

### Checkout Experience

![Checkout Page](https://res.cloudinary.com/db5l8tzgk/image/upload/v1772045716/checkout_hado4m.png)
![Stripe Checkout](https://res.cloudinary.com/db5l8tzgk/image/upload/v1772045718/stripe_checkout_oiyee7.png)

### Admin Dashboard Section

![Admin Feed](https://res.cloudinary.com/db5l8tzgk/image/upload/v1772046048/admin_dashboard_rg9xbk.png)

---

## Summary

This project demonstrates significant full-stack delivery across customer UX, admin tooling, secure auth, payments, and database lifecycle management. The number of modules, route groups, server actions, and migrations reflects a high amount of hands-on implementation work.
