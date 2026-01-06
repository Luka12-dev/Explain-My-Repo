# Architecture Documentation

Comprehensive architecture documentation for Explain My Repo v2.0.

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture Patterns](#architecture-patterns)
3. [Frontend Architecture](#frontend-architecture)
4. [Backend Architecture](#backend-architecture)
5. [Data Flow](#data-flow)
6. [State Management](#state-management)
7. [API Design](#api-design)
8. [Database Schema](#database-schema)
9. [Security Architecture](#security-architecture)
10. [Deployment Architecture](#deployment-architecture)
11. [Scalability Considerations](#scalability-considerations)
12. [Performance Optimization](#performance-optimization)

## System Overview

Explain My Repo is a full-stack web application built with modern technologies:

### Technology Stack

**Frontend:**
- React 18.2 - UI library
- TypeScript 5.3 - Type-safe JavaScript
- Next.js 14.1 - React framework with SSR/SSG
- Tailwind CSS 3.4 - Utility-first CSS
- Framer Motion 11.0 - Animation library
- Zustand 4.5 - State management

**Backend:**
- Node.js 18+ - Runtime environment
- Express 4.18 - Web framework
- Octokit 3.1 - GitHub API client
- Simple-Git 3.22 - Git operations

**Infrastructure:**
- npm - Package management
- Git - Version control
- GitHub Actions - CI/CD (planned)

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │   Browser   │  │   Desktop   │  │   Mobile    │          │
│  │  (Chrome,   │  │  (Electron) │  │   (React    │          │ 
│  │   Safari)   │  │   Planned   │  │   Native)   │          │
│  └─────────────┘  └─────────────┘  └─────────────┘          │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS
┌────────────────────────┴────────────────────────────────────┐
│                    Presentation Layer                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Next.js Frontend                        │   │
│  │  ┌─────────┐ ┌──────────┐ ┌─────────┐ ┌─────────┐    │   │
│  │  │  Pages  │ │Components│ │  Hooks  │ │  Store  │    │   │
│  │  └─────────┘ └──────────┘ └─────────┘ └─────────┘    │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API
┌────────────────────────┴────────────────────────────────────┐
│                    Application Layer                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Express Backend                         │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐     │   │
│  │  │  Routes │ │ Services│ │  Utils  │ │  Models │     │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘     │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                 │
┌───────┴────────┐              ┌─────────┴────────┐
│  External APIs │              │   File System    │
│  ┌───────────┐ │              │  ┌────────────┐  │
│  │  GitHub   │ │              │  │   Models   │  │
│  │    API    │ │              │  │    Dir     │  │
│  └───────────┘ │              │  └────────────┘  │
│  ┌───────────┐ │              │  ┌────────────┐  │
│  │ AI Models │ │              │  │   Cache    │  │
│  │ (Local/   │ │              │  │    Dir     │  │
│  │  Cloud)   │ │              │  └────────────┘  │
│  └───────────┘ │              └──────────────────┘
└────────────────┘
```

## Architecture Patterns

### 1. Layered Architecture

The application follows a traditional layered architecture:

- **Presentation Layer**: React components, pages, UI logic
- **Application Layer**: Business logic, services, APIs
- **Data Layer**: Data access, external APIs, file system

### 2. Component-Based Architecture

Frontend uses React component-based architecture:

- **Pages**: Route-level components
- **Layout Components**: Headers, footers, navigation
- **Feature Components**: Analysis components, charts
- **Common Components**: Reusable UI elements
- **Hooks**: Reusable stateful logic

### 3. Service-Oriented Architecture

Backend services are modular and focused:

- **GitHub Service**: Repository data fetching
- **Analysis Service**: Code analysis logic
- **Security Service**: Security scanning
- **Model Service**: AI model management

### 4. State Management Pattern

Zustand stores for global state:

- **Theme Store**: Theme preferences
- **Analysis Store**: Analysis state
- **Settings Store**: Application settings

## Frontend Architecture

### Directory Structure

```
src/
├── components/
│   ├── analysis/      # Analysis-specific components
│   ├── common/        # Reusable UI components
│   └── layout/        # Layout components
├── pages/             # Next.js pages/routes
├── hooks/             # Custom React hooks
├── store/             # Zustand stores
├── lib/               # Library code
├── utils/             # Utility functions
├── types/             # TypeScript types
└── styles/            # Global styles
```

### Component Hierarchy

```
App
├── _app.tsx (Root)
│   └── MainLayout
│       ├── Header
│       ├── LiquidBackground
│       ├── Page Content
│       └── Footer
│
├── index.tsx (Home)
│   ├── Hero Section
│   ├── Search Input
│   └── Feature Cards
│
├── analyze.tsx (Analysis)
│   ├── Progress Tracker
│   └── Stage Display
│
├── results.tsx (Results)
│   ├── Overview Cards
│   ├── CodeMetricsChart
│   ├── LanguageDistribution
│   ├── FileStructureTree
│   ├── SecurityReport
│   └── QualityMetricsDashboard
│
├── settings.tsx (Settings)
│   ├── Theme Selector
│   ├── Model Manager
│   └── Preferences
│
└── history.tsx (History)
    └── Analysis List
```

### Routing Strategy

Next.js file-based routing:

- `/` - Home page
- `/analyze` - Analysis in progress
- `/results` - Analysis results
- `/history` - Analysis history
- `/settings` - Application settings
- `/about` - About page

### State Management Flow

```
User Action
    ↓
Component Event Handler
    ↓
Zustand Action
    ↓
Store Update
    ↓
React Re-render
    ↓
Updated UI
```

## Backend Architecture

### Directory Structure

```
server/
├── index.js          # Entry point
├── routes/           # API routes
│   ├── analyze.js
│   ├── models.js
│   └── search.js
├── services/         # Business logic
│   ├── githubService.js
│   ├── analysisService.js
│   └── securityService.js
└── middleware/       # Express middleware
    ├── errorHandler.js
    ├── logger.js
    └── rateLimit.js
```

### API Routes

```
/api/health               GET    Health check
/api/repository/info      GET    Get repo info
/api/analyze              POST   Analyze repository
/api/search               POST   Search repository
/api/models               GET    List models
/api/models/download      POST   Download model
/api/models/download/:id  GET    Download progress
/api/models/:id           DELETE Delete model
```

### Request/Response Flow

```
Client Request
    ↓
Express Router
    ↓
Middleware (Auth, Validation)
    ↓
Route Handler
    ↓
Service Layer
    ↓
External APIs / File System
    ↓
Response Formatting
    ↓
Client Response
```

## Data Flow

### Analysis Flow

```
1. User enters repo URL
    ↓
2. Frontend validates URL
    ↓
3. API request to /analyze
    ↓
4. Backend fetches repo from GitHub
    ↓
5. Clone repository locally
    ↓
6. Analyze code structure
    ↓
7. Run security scans
    ↓
8. Calculate metrics
    ↓
9. Generate AI insights
    ↓
10. Return results
    ↓
11. Display in frontend
    ↓
12. Save to history
```

### Model Download Flow

```
1. User selects model
    ↓
2. Frontend requests download
    ↓
3. Backend creates download task
    ↓
4. Download from model source
    ↓
5. Save to models directory
    ↓
6. Update model status
    ↓
7. Notify frontend
```

## State Management

### Zustand Stores

**Theme Store:**
```typescript
{
  theme: 'liquid-blue' | 'liquid-dark',
  setTheme: (theme) => void,
  toggleTheme: () => void,
}
```

**Analysis Store:**
```typescript
{
  currentAnalysis: RepositoryAnalysis | null,
  analysisProgress: AnalysisProgress | null,
  analysisHistory: AnalysisHistory[],
  isAnalyzing: boolean,
  error: string | null,
}
```

**Settings Store:**
```typescript
{
  animations: boolean,
  autoSave: boolean,
  selectedModel: string,
  models: AIModel[],
}
```

## API Design

### RESTful Principles

- **GET**: Retrieve resources
- **POST**: Create resources
- **PUT**: Update resources
- **DELETE**: Delete resources

### Response Format

```json
{
  "success": boolean,
  "data": object | array,
  "error": string (if success = false),
  "timestamp": string (ISO 8601)
}
```

### Error Handling

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {},
  "timestamp": "2024-01-05T12:00:00.000Z"
}
```

## Security Architecture

### Security Layers

1. **Input Validation**: All user input validated
2. **Authentication**: GitHub OAuth (planned)
3. **Authorization**: Role-based access (planned)
4. **Rate Limiting**: Prevent abuse
5. **HTTPS**: Encrypted communication
6. **CORS**: Restricted origins
7. **Secret Scanning**: No hardcoded secrets
8. **Dependency Scanning**: Regular updates

### Security Best Practices

- Sanitize all user input
- Use environment variables for secrets
- Implement CSRF protection
- Regular security audits
- Keep dependencies updated
- Use security headers
- Implement logging and monitoring

## Deployment Architecture

### Development

```
Local Machine
├── Frontend (localhost:3000)
└── Backend (localhost:5000)
```

### Production (Planned)

```
Cloud Infrastructure
├── Load Balancer
├── Frontend Servers (CDN)
├── Backend Servers (Auto-scaling)
├── Database (PostgreSQL)
├── Cache (Redis)
└── Storage (S3)
```

## Scalability Considerations

### Horizontal Scaling

- Stateless backend servers
- Load balancing
- Database replication
- Caching strategy

### Vertical Scaling

- Optimize algorithms
- Efficient data structures
- Code splitting
- Lazy loading

### Caching Strategy

- Browser caching
- API response caching
- Model caching
- Result caching

## Performance Optimization

### Frontend Optimization

- Code splitting
- Lazy loading
- Image optimization
- Bundle size optimization
- Tree shaking
- Memoization
- Virtual scrolling

### Backend Optimization

- Query optimization
- Connection pooling
- Async operations
- Compression
- CDN usage
- Caching layers

### Monitoring

- Performance metrics
- Error tracking
- User analytics
- Server monitoring
- Database monitoring

---

**Author:** Luka  
**Version:** 1.0.0  
**Last Updated:** January 6, 2026
