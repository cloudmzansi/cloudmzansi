# Cloud Mzansi - Digital Design Agency Application

## Overview

This is a modern full-stack web application for Cloud Mzansi, a Durban-based digital design agency. The application serves as both a marketing website and a contact management system, built with React frontend, Express backend, and PostgreSQL database integration using Drizzle ORM. The design is inspired by Brittany Chiang's portfolio with a dark theme, typography-focused layout, and modern aesthetics.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: PostgreSQL session store
- **API Design**: RESTful API endpoints

### Database Architecture
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema Management**: Drizzle Kit for migrations
- **Tables**: Contact submissions with structured fields
- **Validation**: Zod schemas for type-safe data validation

## Key Components

### Frontend Components
- **Landing Page**: Dark-themed hero section, about, services, portfolio, contact form
- **Design Theme**: Inspired by Brittany Chiang's portfolio with dark navy background, green accents, and typography-focused layout
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **UI Components**: Comprehensive component library from Shadcn/ui with custom dark theme
- **Form Handling**: Contact form with validation and submission
- **Toast Notifications**: User feedback for form submissions
- **Navigation**: Numbered sections (01., 02., 03., 04.) with smooth scrolling
- **Typography**: Monospace fonts for accents, bold typography for headings

### Backend Services
- **Contact API**: Handles form submissions and retrieval
- **Storage Layer**: Abstracted storage interface with in-memory fallback
- **Error Handling**: Centralized error handling middleware
- **Request Logging**: Custom logging for API requests

### Shared Resources
- **Schema Definitions**: Shared TypeScript types and Zod schemas
- **Type Safety**: End-to-end type safety between frontend and backend

## Data Flow

1. **Contact Form Submission**:
   - User fills out contact form on frontend
   - Form data validated using Zod schema
   - Data sent to `/api/contact` POST endpoint
   - Backend validates and stores submission
   - Success/error response sent back to client
   - Client shows toast notification

2. **Contact Data Retrieval**:
   - Admin can access `/api/contact` GET endpoint
   - Backend retrieves all contact submissions
   - Data returned in chronological order

3. **Database Operations**:
   - Drizzle ORM handles database interactions
   - Schema migrations managed through Drizzle Kit
   - PostgreSQL connection via Neon serverless

## External Dependencies

### Production Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL client
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/**: UI primitive components
- **react-hook-form**: Form handling and validation
- **zod**: Runtime type validation
- **tailwindcss**: Utility-first CSS framework

### Development Tools
- **Vite**: Build tool and dev server
- **TypeScript**: Static type checking
- **ESBuild**: Fast JavaScript bundler
- **Drizzle Kit**: Database migration tool

## Deployment Strategy

### Build Process
- Frontend: Vite builds optimized static assets
- Backend: ESBuild bundles server code for production
- Assets: Built to `dist/public` directory
- Server: Bundled to `dist/index.js`

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Production/development mode switching
- Replit-specific development tools integration

### Development Workflow
- `npm run dev`: Start development server with hot reload
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run db:push`: Push database schema changes

## Changelog

Changelog:
- July 02, 2025. Initial setup with PixelCraft Studio branding
- July 02, 2025. Complete redesign inspired by Brittany Chiang's portfolio - transformed to Cloud Mzansi agency with dark theme, updated branding, South African content, and modern typography-focused layout

## Recent Changes

### Design Transformation (July 02, 2025)
- **Branding**: Changed from PixelCraft Studio to Cloud Mzansi (Durban-based agency)
- **Theme**: Implemented dark theme inspired by Brittany Chiang's design
- **Color Scheme**: Dark navy background with green accent colors
- **Typography**: Added monospace fonts for section numbers and accents
- **Layout**: Numbered sections (01., 02., 03., 04.) with horizontal dividers
- **Content**: Updated all content for South African market and Cloud Mzansi branding
- **Contact Info**: Updated to Durban, South Africa location with local contact details

## User Preferences

Preferred communication style: Simple, everyday language.
Design inspiration: Brittany Chiang's portfolio (dark theme, typography-focused, minimal aesthetic).
Agency focus: South African market, Durban-based agency.