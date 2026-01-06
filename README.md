# Explain My Repo

AI-powered repository analysis tool with modern liquid design. Analyze any GitHub repository with advanced AI models and get comprehensive insights about code quality, structure, security, and more.

**Author:** Luka

## Features

- **AI-Powered Analysis**: Advanced AI models analyze your repository structure, code quality, and best practices
- **Lightning Fast**: Optimized algorithms provide comprehensive analysis in seconds
- **Security Scanning**: Detect vulnerabilities, secrets, and security issues before they become problems
- **Quality Metrics**: Get detailed insights on code complexity, maintainability, and documentation
- **Modern UI**: Beautiful liquid-themed interface with light and dark modes
- **Multi-Language Support**: Supports 20+ programming languages
- **Real-time Progress**: Live progress tracking during analysis
- **History Tracking**: Keep track of all your repository analyses

## Tech Stack

### Frontend
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Next.js** - React framework with SSR
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Zustand** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **Octokit** - GitHub API client
- **Simple-Git** - Git operations

### AI Models
- Code Llama (7B, 13B, 34B)
- StarCoder 15B
- WizardCoder 15B
- DeepSeek Coder 6.7B
- Phi-2 2.7B
- Mistral 7B Instruct
- Llama 2 7B
- Granite Code 8B

## Installation

### Prerequisites
- Node.js 18+ and npm
- Git
- 8GB+ RAM (depending on AI model)

### Quick Start

1. **Download source code from Release**
```bash
https://github.com/Luka12-dev/Explain-My-Repo/Release
cd Explain-My-Repo
```

2. **Install dependencies**
```bash
# Using PowerShell
.\run.ps1 -Install

# Using Bash
./run.sh install
```

3. **Download AI models** (Optional)
```bash
# Windows
.\download_ai.ps1

# Linux/Mac
./download_ai.sh

# Choose a model (1-10) from the interactive menu
```

4. **Start the application**
```bash
# Development mode (Windows)
.\run.ps1

# Development mode (Linux/Mac)
./run.sh dev

# Production mode
.\run.ps1 -Production  # Windows
./run.sh production    # Linux/Mac
```

5. **Open your browser**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Usage

1. **Enter Repository URL**: Paste any GitHub repository URL
2. **Start Analysis**: Click the "Analyze" button
3. **View Results**: Get comprehensive insights including:
   - Code structure and statistics
   - Language breakdown
   - Quality metrics
   - Security analysis
   - AI-generated insights
   - Best practice recommendations

## Available Scripts

### PowerShell (Windows)
```powershell
.\run.ps1              # Start development servers
.\run.ps1 -Install     # Install dependencies
.\run.ps1 -Build       # Build for production
.\run.ps1 -Production  # Start production servers
.\run.ps1 -Clean       # Clean build artifacts

.\download_ai.ps1      # Download AI models
```

### Bash (Linux/Mac)
```bash
./run.sh dev           # Start development servers
./run.sh install       # Install dependencies
./run.sh build         # Build for production
./run.sh production    # Start production servers
./run.sh clean         # Clean build artifacts

./download_ai.sh       # Download AI models
```

## Configuration

Create a `.env` file in the `src/` directory:

```env
# GitHub API Token (optional, increases rate limits)
GITHUB_TOKEN=your_github_token_here

# Server Configuration
PORT=5000

# AI Model Configuration
DEFAULT_MODEL=codellama-7b
```

## Project Structure

```
Explain-My-Repo/
├── src/
│   ├── components/       # React components
│   │   ├── layout/      # Layout components
│   │   └── ...
│   ├── pages/           # Next.js pages
│   │   ├── index.tsx    # Home page
│   │   ├── analyze.tsx  # Analysis page
│   │   ├── results.tsx  # Results page
│   │   ├── history.tsx  # History page
│   │   ├── settings.tsx # Settings page
│   │   └── about.tsx    # About page
│   ├── lib/             # Utility libraries
│   ├── store/           # State management
│   ├── styles/          # Global styles
│   ├── types/           # TypeScript types
│   ├── server/          # Backend server
│   │   └── index.js     # Express server
│   └── package.json     # Dependencies
├── models/              # AI models (created after download)
├── download_ai.ps1      # Model download script (PowerShell)
├── download_ai.sh       # Model download script (Bash)
├── download_ai.bat      # Model download script (Batch)
├── run.ps1              # Main run script (PowerShell)
├── run.sh               # Main run script (Bash)
└── README.md            # This file
```

## Themes

### Liquid Blue
A modern, vibrant theme with smooth liquid animations and blue accents. Perfect for daytime use.

### Liquid Dark
A sleek, dark theme with liquid effects designed for comfortable nighttime coding.

Switch between themes using the theme toggle in the header.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Links

- **GitHub Profile**: [@Luka12-dev](https://github.com/Luka12-dev/)
- **YouTube Channel**: [@LukaCyber-s4b7o](https://www.youtube.com/@LukaCyber-s4b7o)
- **Project Repository**: [Explain-My-Repo](https://github.com/Luka12-dev/Explain-My-Repo)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Author

Created with passion by **Luka**

---

Made with TypeScript, React, Next.js, Node.js & AI
