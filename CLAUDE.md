# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Gemini Media Generator** - a Next.js 14 application that creates AI-generated images using Google's Gemini 2.5 Flash Image model. The app features a Hebrew/RTL interface with a "Creative Spark" design system that emphasizes joyful, playful user interactions.

## Development Commands

```bash
# Development
npm run dev          # Start development server (port 3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint for code quality

# Testing
# Note: No test framework is currently configured
```

## Architecture & Key Components

### Core Structure
- **Next.js 14** with App Router (`/app` directory)
- **TypeScript 5+** for type safety
- **Tailwind CSS** with custom Creative Spark design system
- **Google Gemini AI SDK** (`@google/genai`) for image generation

### Main Components

#### `/app/page.tsx`
Simple home page that renders the main MediaGenerator component.

#### `/app/components/MediaGenerator.tsx`
The core component containing:
- API key management (localStorage)
- Image upload with drag & drop (supports multiple images)
- Prompt input with Hebrew placeholders
- AI generation via `/api/generate-image`
- Results display with sharing capabilities
- Sound effects and confetti animations

#### `/app/api/generate-image/route.ts`
API endpoint that:
- Validates user input and API key
- Calls Google Gemini 2.5 Flash Image model
- Supports both text-only and image+text input
- Returns generated images with comprehensive error handling

#### Supporting Components
- `CreativeBackground.tsx` - Animated background elements
- `InspirationGallery.tsx` - Example gallery for user inspiration
- `CreativeToolsShowcase.tsx` - Feature showcase
- `SoundControl.tsx` - Sound effects toggle
- Utility files for confetti effects and sounds

### Design System

#### Colors (Creative Spark)
```typescript
primary: '#3b82f6'     // Vibrant blue
secondary: '#10b981'   // Energetic green  
accent: '#fb923c'      // Warm orange
```

#### Typography
- **Body**: Inter font family
- **Display**: Poppins font family
- **Mono**: JetBrains Mono

#### Animations
Custom Tailwind animations for:
- `fade-in`, `slide-up`, `bounce-gentle`
- `gradient-x`, `pulse-soft`, `confetti`

## Key Features

### API Integration
- Uses Google's Gemini 2.5 Flash Image model
- Streams responses for real-time generation
- Supports both text and image+text input
- Client-side API key storage (localStorage)

### Internationalization
- Hebrew/RTL interface with automatic text direction
- English fallbacks for technical terms
- Mixed RTL/LTR content support

### User Experience
- Progressive enhancement with loading states
- Sound effects for user actions (with toggle)
- Confetti celebrations for successful generations
- Mobile-responsive design (320px - 1920px)
- Accessibility features (WCAG 2.1 AA targeted)

### File Upload
- Drag & drop interface
- Multiple image support
- 10MB per file limit
- Automatic image preview and removal

## Environment & Dependencies

### Key Dependencies
- `next@14.2.32` - React framework
- `@google/genai@^1.15.0` - Google AI SDK
- `lucide-react@^0.542.0` - Icon library
- `canvas-confetti@^1.9.3` - Celebration effects
- `mime@^4.0.7` - MIME type detection

### Development Dependencies
- TypeScript 5+ with strict mode
- ESLint with Next.js config
- Tailwind CSS with custom configuration
- PostCSS for CSS processing

## Important Notes

### Security
- API keys are stored client-side only (localStorage)
- No server-side key storage or logging
- Input validation on both client and server
- Error handling prevents sensitive data exposure

### Performance
- Optimized for Core Web Vitals
- Progressive loading with skeletons
- Image optimization considerations
- Bundle size monitoring needed

### Hebrew/RTL Considerations
- Uses `dir="auto"` for mixed content
- Custom RTL-aware layout components
- Hebrew placeholders with English technical terms
- Icon positioning adjusted for RTL

## Common Development Tasks

### Adding New Components
Follow existing patterns in `/app/components/`:
- Use TypeScript interfaces for props
- Include proper ARIA attributes
- Follow Creative Spark design system colors
- Add appropriate sound effects via `utils/sounds.ts`

### Modifying API Behavior
Main API logic in `/app/api/generate-image/route.ts`:
- Always validate input parameters
- Handle Gemini API errors gracefully
- Return consistent response structure
- Log errors without exposing sensitive data

### Design System Updates
Modify `/tailwind.config.ts` for:
- Color scheme adjustments
- New animation keyframes
- Typography scaling
- Custom component utilities

### Testing Considerations
Currently no testing framework is configured. When adding tests:
- Focus on API endpoint validation
- Test error handling scenarios
- Verify Hebrew/RTL layout behavior
- Check accessibility features