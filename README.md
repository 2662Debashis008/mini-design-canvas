# Mini Design Canvas

A full-stack graphic design canvas application inspired by Figma-lite and Canva-lite, built for the Glazia Full Stack Developer Intern technical assignment.

The application allows users to create, view, edit, and persist customizable design canvases containing Rectangles, Circles, and Text elements with real-time transformation controls, a properties sidebar, layer reordering, history undo/redo, and PNG image export.

---

## Features

### User Authentication (`/login` & `/register`)
- **JWT & bcrypt Security**: Full user registration and login with encrypted password storage and JSON Web Token verification.
- **User-Scoped Canvases**: Authenticated users have private canvases persisted to their user ID; guests can still explore in guest mode.
- **Session Persistence**: Automatic session restoration via `localStorage` and `AuthContext`.
- **User Profile UI**: Header avatar badge with username and seamless one-click Log Out.

### Dashboard (`/`)
- **Canvas Overview**: View all previously saved design projects with preview summaries, dimensions, and updated timestamps.
- **Create New Canvas**: Direct action to configure new canvas names and dimensions.
- **Open / Edit Action**: Seamless navigation to the editor workspace.
- **Delete with Confirmation**: Clean modal prompt ensuring canvases cannot be deleted by accident.
- **Empty State UI**: Helpful onboarding state when no canvases have been created yet.

### Canvas Editor (`/canvas/[id]`)
- **Konva-Powered Canvas**: Built on `react-konva` utilizing Stage, Layer, and custom Shape renderers.
- **Element Manipulation**:
  - **Rectangle**: Add, select, drag, resize, rotate, recolor, modify width/height.
  - **Circle**: Add, select, drag, resize (diameter preserved), rotate, recolor.
  - **Text**: Add, select, drag, rotate, edit text content inline/via properties, change font size and text color.
- **Selection & Transformer**:
  - Click any element to select and activate the Konva Transformer with 8 anchor handles.
  - Click empty canvas workspace to deselect.
  - **Scale Normalization**: Automatically converts scale factors (`scaleX`, `scaleY`) to true pixel dimensions upon transform completion and resets scales back to `1.0`, preventing compounded distortion.
- **Real-Time Properties Panel**:
  - Position (X, Y in px)
  - Dimensions (Width, Height, or Diameter in px)
  - Rotation (degrees)
  - Color palette & hex color picker (fill color or text color)
  - Text typography editor (content & font size)
- **Keyboard Shortcuts**:
  - `Delete` / `Backspace`: Remove selected shape (safe-guarded: inactive while typing in input/textarea).
  - `Ctrl+Z` / `Cmd+Z`: Undo.
  - `Ctrl+Y` / `Ctrl+Shift+Z`: Redo.
  - `V`: Select tool.
  - `R`: Add Rectangle.
  - `C`: Add Circle.
  - `T`: Add Text.
- **Persistence & Save Status**:
  - Save button with live status indicator (`Saved`, `Saving...`, `Unsaved changes`, `Save failed`).
  - Automatic debounced autosave (2.5 seconds after editing stops).
- **Bonus Features**:
  - **Undo & Redo**: Full immutable history stack for canvas element actions.
  - **Layer Management Panel**: Reorder layers (bring forward, send backward) and delete elements.
  - **PNG Export**: One-click download of the canvas rendered as a high-resolution PNG image named after the canvas.

---

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Library**: React 18
- **Canvas Engine**: React Konva & Konva
- **Styling**: Standard CSS Design System (`app/globals.css`)
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Server Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **CORS & Environment**: `cors`, `dotenv`
- **Development Tooling**: `nodemon`

---

## Project Structure

```text
mini-design-canvas/
├── frontend/
│   ├── app/
│   │   ├── layout.js              # Next.js root layout with metadata
│   │   ├── page.js                # Dashboard page (canvas list & actions)
│   │   ├── globals.css            # Unified CSS design system
│   │   ├── canvas/
│   │   │   └── [id]/
│   │   │       └── page.js        # Dynamic route for Canvas Editor
│   │   └── new/
│   │       └── page.js            # New canvas creation form
│   ├── components/
│   │   ├── canvas/
│   │   │   ├── CanvasEditor.jsx   # Main state coordinator & keyboard shortcuts
│   │   │   ├── CanvasStage.jsx    # Konva Stage & Layer wrapper
│   │   │   ├── CanvasToolbar.jsx  # Left-side tool and action buttons
│   │   │   ├── PropertiesPanel.jsx# Right-side property editor
│   │   │   ├── LayersPanel.jsx    # Z-index management panel
│   │   │   ├── ShapeRenderer.jsx  # Rect, Circle, and Text rendering logic
│   │   │   └── SelectionTransformer.jsx # Konva Transformer wrapper
│   │   ├── dashboard/
│   │   │   ├── CanvasCard.jsx     # Individual canvas card component
│   │   │   └── CanvasList.jsx     # Canvases grid with delete confirmation
│   │   └── common/
│   │       ├── Header.jsx         # Navigation header for dashboard & editor
│   │       ├── Button.jsx         # Button component with variants
│   │       ├── Loader.jsx         # Spinner loader
│   │       └── ErrorMessage.jsx   # Error alert banner
│   ├── services/
│   │   └── canvasApi.js           # REST API client for backend communication
│   ├── utils/
│   │   ├── shapeFactory.js        # Factory for generating new shape objects
│   │   └── constants.js           # Global constants (dimensions, colors, states)
│   ├── .env.example
│   ├── next.config.js
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js              # MongoDB Mongoose connection
│   │   ├── controllers/
│   │   │   └── canvasController.js# CRUD controllers for canvas documents
│   │   ├── models/
│   │   │   └── Canvas.js          # Mongoose Schema & Model
│   │   ├── routes/
│   │   │   └── canvasRoutes.js    # Express REST API routes
│   │   ├── middleware/
│   │   │   ├── errorHandler.js    # Centralized error handler
│   │   │   └── notFound.js        # 404 endpoint handler
│   │   ├── validators/
│   │   │   └── canvasValidator.js # Request payload validation
│   │   ├── app.js                 # Express application setup
│   │   └── server.js              # HTTP server entrypoint
│   ├── .env.example
│   ├── test-http.js               # Integration test script
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Prerequisites

- **Node.js**: v18.0.0 or higher (v24.x tested)
- **npm**: v9.0.0 or higher
- **MongoDB**: A running MongoDB instance (Local on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI)

---

## Environment Configuration

### Backend (`backend/.env`)
Create `backend/.env` (or copy from `backend/.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/mini-design-canvas
CLIENT_URL=http://localhost:3000
```

### Frontend (`frontend/.env.local`)
Create `frontend/.env.local` (or copy from `frontend/.env.example`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Installation & Running Locally

### 1. Start MongoDB
Ensure MongoDB is running locally:
```bash
# Windows Service
net start MongoDB

# Or via mongod CLI
mongod --dbpath <data_directory>
```

### 2. Start the Backend API Server
```bash
cd backend
npm install
npm run dev
```
The backend will start at `http://localhost:5000`. You should see:
```text
[MongoDB] Connected successfully to host: 127.0.0.1
[Server] Mini Design Canvas backend listening on port 5000
```

### 3. Start the Frontend Application
In a separate terminal window:
```bash
cd frontend
npm install
npm run dev
```
Open your browser and navigate to:
```text
http://localhost:3000
```

---

## REST API Endpoints

| Method | Endpoint | Description | Status Codes |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account | `201`, `400`, `500` |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token | `200`, `400`, `401`, `500` |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | `200`, `401`, `500` |
| `GET` | `/api/health` | Service health status check | `200` |
| `GET` | `/api/canvases` | Retrieve canvases (user-scoped or guest) | `200`, `500` |
| `POST` | `/api/canvases` | Create a new canvas | `201`, `400`, `500` |
| `GET` | `/api/canvases/:id` | Retrieve single canvas by ID | `200`, `400`, `404`, `500` |
| `PUT` | `/api/canvases/:id` | Update canvas name, size, and elements | `200`, `400`, `403`, `404`, `500` |
| `DELETE` | `/api/canvases/:id`| Delete canvas document by ID | `200`, `400`, `403`, `404`, `500` |

---

## Canvas Data Model

Canvases are stored in a single `canvases` collection in MongoDB. All elements are embedded inside the canvas document:

```json
{
  "_id": "66e4a2f8b28d04d742952b36",
  "name": "Social Media Banner",
  "width": 900,
  "height": 600,
  "elements": [
    {
      "elementId": "rect_9d8a2f",
      "type": "rectangle",
      "x": 120,
      "y": 140,
      "width": 240,
      "height": 160,
      "rotation": 0,
      "fill": "#3B82F6",
      "text": "",
      "fontSize": 16
    },
    {
      "elementId": "text_b34c11",
      "type": "text",
      "x": 140,
      "y": 200,
      "width": 200,
      "height": 40,
      "rotation": 0,
      "fill": "#FFFFFF",
      "text": "Summer Sale",
      "fontSize": 28
    }
  ],
  "createdAt": "2026-09-13T16:00:00.000Z",
  "updatedAt": "2026-09-13T16:05:00.000Z"
}
```

---

## Verification & Testing

To run the automated backend HTTP tests:
```bash
cd backend
npm test
```
The test suite validates:
- Mongoose schema integrity and validation.
- Rejection of invalid inputs (empty names, invalid element types, malformed IDs).
- Complete CRUD lifecycle across all HTTP routes with correct status codes (200, 201, 400, 404).

---

## Known Limitations

1. **Single User / No Authentication**: Authentication is intentionally out of scope for this initial version. All canvases are currently stored in a shared collection.
2. **Offline Mode**: Changes require network connectivity to persist to MongoDB. If offline, the UI shows a `Save failed` status badge.
3. **Complex Path Shapes**: The canvas currently supports Rectangles, Circles, and Text. Freehand drawing and polygon paths are not yet supported.

---

## Future Improvements

- User authentication & multi-tenancy (JWT / Session-based).
- Canvas zooming and panning controls (pinch to zoom, scroll wheel).
- Multi-element selection and grouping (dragging multiple shapes together).
- Real-time collaboration via WebSockets (Socket.io).
- Image uploads to place external graphics on canvas.

---

## Author

Implemented as part of the technical evaluation for the **Full Stack Developer Intern** role at **Glazia**.
