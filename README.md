# Scoda AI - Frontend

A modern Next.js frontend for the Scoda AI Idea Generator application. This application provides an intuitive interface for generating and visualizing AI-powered idea graphs.

## Features

- 🎨 **Modern UI**: Dark theme with purple accents matching the design reference
- 📊 **Interactive Graph Visualization**: Powered by ReactFlow to display idea relationships
- 🔄 **Real-time Generation**: Connect to NestJS backend for AI-powered idea generation
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- ⚡ **TypeScript**: Full type safety throughout the application
- 🎯 **LangGraph Compatible**: Displays graph data in a format compatible with LangGraph

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **ReactFlow** - Interactive graph visualization library
- **Axios** - HTTP client for API communication

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Backend API running (see backend README)

### Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Set up environment variables:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and set your backend API URL:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Navbar.tsx        # Navigation bar
│   ├── IdeaInput.tsx     # Topic input component
│   └── GraphVisualization.tsx  # Graph visualization
├── lib/                  # Utility functions
│   └── api.ts            # API client
├── types/                # TypeScript type definitions
│   └── index.ts          # Shared types
└── public/               # Static assets
```

## Components

### Navbar
Top navigation bar with logo, navigation links, and credits display.

### IdeaInput
Input field with generate button and suggested topic tags. Handles form submission and loading states.

### GraphVisualization
Interactive graph component using ReactFlow. Displays ideas as nodes with relationships as edges. Supports:
- Drag and drop nodes
- Zoom and pan
- Mini-map navigation
- Automatic layout positioning
- Color-coded node types (main, sub, related)

## API Integration

The frontend communicates with the backend `/generate-ideas` endpoint:

```typescript
POST /generate-ideas
Body: { topic: string }
Response: {
  graph: {
    nodes: IdeaNode[],
    edges: IdeaEdge[]
  }
}
```

## Graph Data Format

The application expects graph data in the following format (LangGraph-compatible):

```typescript
interface IdeaGraph {
  nodes: Array<{
    id: string;
    label: string;
    type: "main" | "sub" | "related";
    description?: string;
    category?: string;
  }>;
  edges: Array<{
    id: string;
    source: string;
    target: string;
    type: "hierarchical" | "related" | "suggested";
  }>;
}
```

## Styling

The application uses Tailwind CSS with a custom color palette:
- Primary purple shades (`primary-*`)
- Dark backgrounds (`gray-950`, `gray-900`)
- Glow effects for interactive elements

Custom CSS utilities:
- `.glow-purple` - Subtle purple glow effect
- `.glow-purple-strong` - Stronger purple glow effect

## Building for Production

```bash
npm run build
npm start
```

## Environment Variables

- `NEXT_PUBLIC_API_URL` - Backend API base URL (default: `http://localhost:3001`)

## Development Notes

- The graph visualization automatically layouts nodes on mount
- Main ideas are positioned in the center
- Sub-ideas are positioned around their parent main ideas
- Related ideas are positioned on the periphery
- All nodes are draggable and the graph is zoomable/panable

## Troubleshooting

### Graph not displaying
- Ensure the backend is running and accessible
- Check browser console for API errors
- Verify `NEXT_PUBLIC_API_URL` is set correctly

### Styling issues
- Clear `.next` cache and rebuild: `rm -rf .next && npm run build`
- Ensure Tailwind CSS is properly configured

### Type errors
- Run `npm run build` to check for TypeScript errors
- Ensure all dependencies are installed
