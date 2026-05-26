# Claude Code Project Guide - Portfolio Site

This file provides context and guidelines for Claude Code to maintain consistency in this repository.

## 1. Project Overview & Requirements

- **Goal:** Build a portfolio site with a content management (CMS) admin dashboard.
- **Key Security Requirement:** Unauthenticated users accessing `/admin/*` MUST receive an **HTTP 404 Not Found** status code (NOT a redirect).
- **Images:** Must be stored and managed in the Database (or AWS S3).
- **Environment Variables:** Firebase configurations and DB credentials must be managed via `.env` (Never commit secrets).

## 2. Tech Stack

- **Frontend:** TypeScript, Next.js (App Router)
- **Backend:** TypeScript, Express.js
- **ORM:** Prisma
- **Database:** PostgreSQL (or MySQL)
- **Authentication:** Firebase Authentication (Personal Account)
- **Architecture:** The backend Express app must be accessed through the frontend server features (Next.js API Routes / Server Actions).

## 3. Reference Files & Documentation

- **Requirements/Specs:** Refer to `README.md`
- **Task List & Progress:** Refer to `TASKS.md`
- **Code Rules & Style:** Refer to `CONTRIBUTING.md`

## 4. Communication Rules

- Please respond and write comments in **Japanese**.
- Before writing extensive code, use `/plan` or suggest the architecture in Japanese first.
