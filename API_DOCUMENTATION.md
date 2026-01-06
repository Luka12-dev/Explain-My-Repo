# API Documentation

Complete API documentation for Explain My Repo backend services.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Currently, authentication is not required for local development. For production deployments, API keys will be required.

## Rate Limiting

The API follows GitHub's rate limiting rules when fetching repository data:
- **Authenticated**: 5,000 requests per hour
- **Unauthenticated**: 60 requests per hour

## Endpoints

### Health Check

Check the health status of the API server.

**Endpoint:** `GET /health`

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "uptime": 12345
  },
  "timestamp": "2024-01-05T12:00:00.000Z"
}
```

---

### Get Repository Info

Fetch basic information about a GitHub repository.

**Endpoint:** `GET /repository/info`

**Query Parameters:**
- `repoUrl` (required): GitHub repository URL

**Example Request:**
```bash
curl "http://localhost:5000/api/repository/info?repoUrl=https://github.com/facebook/react"
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "10270250",
    "name": "react",
    "fullName": "facebook/react",
    "owner": "facebook",
    "description": "The library for web and native user interfaces",
    "url": "https://github.com/facebook/react",
    "stars": 220000,
    "forks": 45000,
    "language": "JavaScript",
    "createdAt": "2013-05-24T16:15:54Z",
    "updatedAt": "2024-01-05T10:30:00Z",
    "size": 250000,
    "openIssues": 1200,
    "topics": ["react", "javascript", "frontend"],
    "license": "MIT",
    "defaultBranch": "main",
    "isPrivate": false,
    "hasWiki": true,
    "hasIssues": true,
    "hasProjects": true,
    "hasDownloads": true
  },
  "timestamp": "2024-01-05T12:00:00.000Z"
}
```

---

### Analyze Repository

Perform comprehensive analysis on a GitHub repository.

**Endpoint:** `POST /analyze`

**Request Body:**
```json
{
  "repoUrl": "https://github.com/facebook/react",
  "modelId": "codellama-7b"
}
```

**Parameters:**
- `repoUrl` (required): GitHub repository URL
- `modelId` (optional): AI model ID to use for analysis

**Example Response:**
```json
{
  "success": true,
  "data": {
    "repository": { /* Repository object */ },
    "codeAnalysis": {
      "totalFiles": 1500,
      "totalLines": 250000,
      "codeLines": 180000,
      "commentLines": 35000,
      "blankLines": 35000,
      "languages": [
        {
          "language": "JavaScript",
          "files": 1200,
          "lines": 200000,
          "bytes": 5000000,
          "percentage": 80.0
        }
      ],
      "fileTypes": [ /* File type stats */ ],
      "averageFileSize": 3333,
      "largestFiles": [ /* Largest files */ ],
      "complexity": {
        "averageComplexity": 8.5,
        "maxComplexity": 45,
        "complexFiles": [ /* Complex files */ ],
        "maintainabilityIndex": 72
      }
    },
    "structureAnalysis": { /* Structure analysis */ },
    "dependencies": { /* Dependency analysis */ },
    "qualityMetrics": {
      "overallScore": 85,
      "codeQuality": 80,
      "documentation": 75,
      "testing": 90,
      "maintainability": 82,
      "security": 88,
      "performance": 85,
      "bestPractices": [ /* Best practices */ ],
      "recommendations": [ /* Recommendations */ ]
    },
    "securityAnalysis": { /* Security analysis */ },
    "documentation": { /* Documentation analysis */ },
    "aiInsights": {
      "summary": "React is a mature, well-maintained...",
      "purpose": "UI library for building interfaces",
      "techStack": ["JavaScript", "TypeScript"],
      "strengths": [ /* Strengths */ ],
      "weaknesses": [ /* Weaknesses */ ],
      "suggestions": [ /* Suggestions */ ],
      "useCases": [ /* Use cases */ ],
      "targetAudience": ["Frontend Developers"],
      "complexity": "advanced",
      "maturity": "mature",
      "activityLevel": "very active",
      "keyFeatures": [ /* Key features */ ],
      "codeQualityInsights": [ /* Insights */ ],
      "architectureInsights": [ /* Insights */ ],
      "performanceInsights": [ /* Insights */ ],
      "securityInsights": [ /* Insights */ ]
    },
    "timestamp": "2024-01-05T12:00:00.000Z",
    "processingTime": 4523
  },
  "timestamp": "2024-01-05T12:00:00.000Z"
}
```

---

### Search Repository

Search within a repository for code, files, or issues.

**Endpoint:** `POST /search`

**Request Body:**
```json
{
  "repoUrl": "https://github.com/facebook/react",
  "query": "useState",
  "type": "code"
}
```

**Parameters:**
- `repoUrl` (required): GitHub repository URL
- `query` (required): Search query
- `type` (optional): Search type (code, file, commit, issue, pr)

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "type": "code",
      "title": "React Hooks - useState",
      "description": "Implementation of useState hook",
      "path": "packages/react/src/ReactHooks.js",
      "url": "https://github.com/facebook/react/blob/...",
      "score": 95.5,
      "highlights": ["function useState(initialState)"],
      "metadata": {
        "lineNumber": 42,
        "language": "JavaScript"
      }
    }
  ],
  "timestamp": "2024-01-05T12:00:00.000Z"
}
```

---

### Get Available Models

List all available AI models.

**Endpoint:** `GET /models`

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "codellama-7b",
      "name": "Code Llama 7B",
      "description": "Fast and efficient code analysis model",
      "size": "3.8 GB",
      "type": "local",
      "status": "ready",
      "capabilities": ["code-analysis", "documentation", "bug-detection"],
      "requirements": {
        "ram": "8 GB",
        "disk": "4 GB",
        "gpu": "Optional"
      }
    }
  ],
  "timestamp": "2024-01-05T12:00:00.000Z"
}
```

---

### Download Model

Start downloading an AI model.

**Endpoint:** `POST /models/download`

**Request Body:**
```json
{
  "modelId": "codellama-7b"
}
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "taskId": "1704456000000"
  },
  "timestamp": "2024-01-05T12:00:00.000Z"
}
```

---

### Get Download Progress

Check the progress of a model download.

**Endpoint:** `GET /models/download/:taskId`

**Example Response:**
```json
{
  "success": true,
  "data": {
    "modelId": "codellama-7b",
    "progress": 45,
    "downloadedBytes": 1800000000,
    "totalBytes": 4000000000,
    "speed": 5000000,
    "eta": 440,
    "status": "downloading"
  },
  "timestamp": "2024-01-05T12:00:00.000Z"
}
```

---

### Delete Model

Delete a downloaded AI model.

**Endpoint:** `DELETE /models/:modelId`

**Example Response:**
```json
{
  "success": true,
  "message": "Model codellama-7b deleted successfully",
  "timestamp": "2024-01-05T12:00:00.000Z"
}
```

---

## Error Responses

All endpoints return errors in a consistent format:

```json
{
  "success": false,
  "error": "Error message here",
  "timestamp": "2024-01-05T12:00:00.000Z"
}
```

### Common Error Codes

- **400 Bad Request**: Invalid parameters
- **404 Not Found**: Resource not found
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server error

---

## WebSocket Support (Coming Soon)

Real-time updates for long-running operations will be available via WebSocket.

**Connection:** `ws://localhost:5000/ws`

**Events:**
- `analysis:progress` - Analysis progress updates
- `download:progress` - Model download progress
- `error` - Error notifications

---

## SDK and Client Libraries

### JavaScript/TypeScript

```typescript
import { ExplainMyRepoClient } from 'explain-my-repo-sdk';

const client = new ExplainMyRepoClient({
  baseURL: 'http://localhost:5000/api',
});

const analysis = await client.analyzeRepository('https://github.com/facebook/react');
```

### Python (Coming Soon)

```python
from explain_my_repo import Client

client = Client(base_url='http://localhost:5000/api')
analysis = client.analyze_repository('https://github.com/facebook/react')
```

---

## Changelog

### v1.0.0
- Initial API release
- All core endpoints implemented
- Comprehensive error handling

---

## Support

For API support:
- GitHub Issues: https://github.com/Luka12-dev/Explain-My-Repo/issues

---

**Author:** Luka  
**Version:** 1.0.0  
**Last Updated:** January 6, 2026
