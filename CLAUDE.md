# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15.2.4 e-commerce application called "Craft City" built with TypeScript, Tailwind CSS, and Prisma. The app features user authentication (Google/Microsoft OAuth), shopping cart functionality, and integrates with MercadoPago for payments. Originally created with v0.dev and deployed on Vercel.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build production application  
- `npm run start` - Start production server
- `npm run lint` - Run Next.js linter

## Database Operations

- `npx prisma generate` - Generate Prisma client after schema changes
- `npx prisma db push` - Push schema changes to SQLite database (dev.db)
- `npx prisma migrate dev` - Create and apply new migration
- `npx prisma studio` - Open database GUI

## Architecture

### Authentication System
- Uses NextAuth.js v4 with JWT strategy
- Configured with Google and Microsoft Azure AD providers  
- Prisma adapter for session/user persistence
- Auth configuration in `services/auth.ts`
- Session wrapper in `app/SessionProviderWrapper.tsx`

### Database Schema
- SQLite database with Prisma ORM
- User model includes custom fields: nickname, idade (age), senha (password)
- Standard NextAuth tables: Account, Session, VerificationToken
- Database file: `prisma/dev.db`

### State Management
- Shopping cart uses React Context (`components/cart/CartContext.tsx`)
- Cart persisted to localStorage
- Global user profile modal system

### UI Components
- Radix UI components with Tailwind CSS styling
- Custom components in `components/` directory organized by feature
- Uses Geist font family (sans & mono)
- Theme provider for dark/light mode support

### File Structure
- `app/` - Next.js App Router pages and API routes
- `components/` - Reusable UI components organized by feature
- `lib/` - Utility functions and Prisma client
- `services/` - Authentication and external service configurations
- `prisma/` - Database schema and migrations
- `public/` - Static assets including product images

### Key Features
- OAuth authentication (Google/Microsoft)
- Shopping cart with localStorage persistence  
- Payment integration with MercadoPago
- Responsive design with Tailwind CSS
- Product catalog with images organized by category

## Environment Variables Required

- `DATABASE_URL` - SQLite database connection
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - Google OAuth
- `MICROSOFT_CLIENT_ID` / `MICROSOFT_CLIENT_SECRET` - Microsoft OAuth  
- `NEXTAUTH_URL` - NextAuth configuration
- `NEXTAUTH_LOCAL_URL` - NextAuth local configuration
- `NEXTAUTH_SECRET` - NextAuth JWT secret