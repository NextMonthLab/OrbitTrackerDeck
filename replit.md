# OrbitDeck - Interactive Presentation Builder

## Overview

OrbitDeck is a React-based web application that transforms static content (presentations, folders, or slide decks) into interactive, cinematic storytelling experiences. The application allows users to upload content, choose presentation templates and visual themes, then deploy immersive experiences with URL sharing capabilities.

## Recent Changes (January 10, 2025)

✓ **Orbit Template Complete**: Full interactive Orbit experience with radial node layout
✓ **Military Theme Applied**: Tactical animations, color scheme, and stencil fonts implemented  
✓ **Navigation System**: Seamless routing between builder and experience views
✓ **Interactive Components**: Hover effects, pulse animations, and tactical scanning overlays
✓ **Content Management**: Dynamic content switching with gravity-based suggestions

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with Vite for fast development and building
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: TailwindCSS with custom theme system supporting multiple visual themes (Military, Ultra-Modern, Technology)
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Animations**: Framer Motion for smooth transitions and cinematic effects
- **State Management**: TanStack Query for server state management
- **TypeScript**: Full TypeScript support for type safety

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Sessions**: PostgreSQL session storage with connect-pg-simple
- **Development**: Hot module replacement with Vite integration

### Component Architecture
- **Modular Design**: Plug-and-play architecture for themes and templates
- **Theme System**: CSS custom properties with programmatic theme switching
- **Template System**: Three distinct presentation templates (Orbit, SlideStory, ImmersionDeck)
- **Component Library**: Comprehensive UI component system based on shadcn/ui

## Key Components

### Content Upload System
- **PowerPoint Import**: Support for .pptx file uploads
- **Google Slides Integration**: URL-based import via Google Slides API
- **Folder Upload**: Drag-and-drop support for mixed media content (.md, .jpg, .mp4, etc.)

### Template System
1. **Orbit Template**: Radial UI with branching interactions and central command node
2. **SlideStory Template**: Non-linear cinematic slide progression
3. **ImmersionDeck Template**: Scroll-based journey with contextual triggers

### Theme System
1. **Military Theme**: Khaki, olive, tactical aesthetics with stencil fonts
2. **Ultra-Modern Theme**: Black/white/silver minimalist design with glow effects
3. **Technology Theme**: Neon blues, matrix overlays, code-style typography

### Preview & Launch System
- **Real-time Preview**: Interactive preview of configured experiences
- **URL Generation**: Shareable links for deployed experiences
- **Embed Support**: iframe-based embedding for external sites
- **Branding Options**: Watermark and branding based on SaaS tier

## Data Flow

1. **Content Ingestion**: Users upload content through file upload, URL import, or folder drag-drop
2. **Template Selection**: Choose from three presentation template options
3. **Theme Application**: Select visual theme that transforms the entire experience
4. **Preview Generation**: Real-time preview with interactive elements
5. **Deployment**: Generate shareable URLs and embed codes
6. **Experience Delivery**: Serve optimized, interactive presentations to end users

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **framer-motion**: Animation library
- **@radix-ui/***: Headless UI component primitives
- **wouter**: Lightweight routing

### Development Dependencies
- **Vite**: Build tool and development server
- **TailwindCSS**: Utility-first CSS framework
- **TypeScript**: Static type checking
- **@replit/vite-plugin-***: Replit-specific development plugins

### Planned Integrations
- **Google Slides API**: For URL-based slide import
- **File Processing**: For PowerPoint .pptx parsing
- **CDN**: For asset delivery and performance optimization

## Deployment Strategy

### Development Environment
- **Vite Dev Server**: Hot module replacement for rapid development
- **Express Middleware**: Vite integration for full-stack development
- **Database Migrations**: Drizzle Kit for schema management

### Production Build
- **Static Assets**: Vite builds optimized client bundle
- **Server Bundle**: esbuild compiles server code for Node.js
- **Database**: Neon PostgreSQL for production data storage
- **Environment Variables**: DATABASE_URL required for database connectivity

### Deployment Configuration
- **Build Command**: `npm run build` - Creates production-ready assets
- **Start Command**: `npm start` - Launches production server
- **Database Setup**: `npm run db:push` - Applies schema changes

The architecture prioritizes modularity, allowing for easy extension of themes and templates while maintaining a cohesive user experience. The frontend-only MVP approach enables rapid prototyping with mock data, while the backend infrastructure supports future scaling and feature development.