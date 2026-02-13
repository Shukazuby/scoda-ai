# Scoda AI Frontend - Quick Setup Guide

## Prerequisites

- Node.js 18.0.0 or higher
- npm, yarn, or pnpm package manager
- Backend API running (default: http://localhost:3001)

## Installation Steps

### 1. Install Dependencies

```bash
cd frontend
npm install
```

This will install all required packages including:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- ReactFlow (for graph visualization)
- Axios (for API calls)

### 2. Configure Environment Variables

Create a `.env.local` file in the frontend directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and set your backend URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Project Structure Overview

```
frontend/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with metadata
│   ├── page.tsx                 # Main home page
│   └── globals.css              # Global styles and Tailwind imports
├── components/                  # React components
│   ├── Navbar.tsx              # Top navigation bar
│   ├── IdeaInput.tsx           # Topic input with suggestions
│   └── GraphVisualization.tsx  # Interactive graph display
├── lib/                        # Utility functions
│   └── api.ts                  # API client for backend communication
├── types/                      # TypeScript definitions
│   └── index.ts                # Shared type interfaces
├── public/                     # Static assets
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.ts          # Tailwind CSS configuration
└── next.config.js              # Next.js configuration
```

## Key Features Implemented

### ✅ UI Components
- **Navbar**: Top navigation with logo, menu items, and credits display
- **IdeaInput**: Input field with generate button and suggested topics
- **GraphVisualization**: Interactive graph using ReactFlow

### ✅ Styling
- Dark theme with purple accents matching the reference design
- Responsive layout for mobile and desktop
- Custom glow effects for interactive elements
- Tailwind CSS utility classes

### ✅ Functionality
- Topic input with form validation
- API integration with backend `/generate-ideas` endpoint
- Loading and error states
- Interactive graph visualization with:
  - Drag and drop nodes
  - Zoom and pan controls
  - Mini-map navigation
  - Automatic hierarchical layout
  - Color-coded node types

### ✅ Type Safety
- Full TypeScript implementation
- Type definitions for graph data structure
- LangGraph-compatible data format

## API Integration

The frontend expects the backend to return data in this format:

```json
{
  "graph": {
    "nodes": [
      {
        "id": "node-1",
        "label": "Main Idea",
        "type": "main",
        "description": "Description text",
        "category": "Category name"
      }
    ],
    "edges": [
      {
        "id": "edge-1",
        "source": "node-1",
        "target": "node-2",
        "type": "hierarchical"
      }
    ]
  }
}
```

## Troubleshooting

### Port Already in Use
If port 3000 is already in use:
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Backend Connection Issues
- Verify backend is running on the configured port
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Check browser console for CORS errors
- Ensure backend CORS is configured to allow frontend origin

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

### Graph Not Displaying
- Check browser console for errors
- Verify graph data structure matches expected format
- Ensure ReactFlow styles are imported (already in GraphVisualization.tsx)

## Next Steps

1. **Connect Backend**: Ensure your NestJS backend is running and accessible
2. **Test Generation**: Enter a topic and click "Generate" to test the full flow
3. **Customize**: Modify colors, layouts, or add new features as needed

## Development Tips

- Use `npm run dev` for hot-reload development
- Check browser DevTools for React component debugging
- Use React DevTools extension for component inspection
- Graph visualization supports drag, zoom, and pan interactions
