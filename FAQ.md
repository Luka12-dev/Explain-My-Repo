# Frequently Asked Questions

Common questions and answers about Explain My Repo.

## General Questions

### What is Explain My Repo?
Explain My Repo is an AI-powered tool that analyzes GitHub repositories and provides comprehensive insights about code quality, structure, security, dependencies, and more. It uses advanced AI models to understand your codebase and generate actionable recommendations.

### Who created Explain My Repo?
Explain My Repo was created by Luka, a passionate software developer dedicated to helping developers understand and improve their code.

### Is it free to use?
Yes, the current version is completely free and open source. You can run it locally on your machine without any cost.

### What programming languages are supported?
We support 20+ programming languages including TypeScript, JavaScript, Python, Java, C++, C#, Go, Rust, Ruby, PHP, Swift, Kotlin, and many more.

### Do I need to install AI models?
AI models are optional but recommended for the best analysis results. You can download models using our built-in model manager, or use the application without AI-powered insights.

### How long does analysis take?
Analysis time varies based on repository size. Small repositories (< 50 files) take 10-30 seconds, medium repositories (50-200 files) take 30-90 seconds, and large repositories (200+ files) may take 2-5 minutes.

### Can I analyze private repositories?
Yes, if you provide a GitHub personal access token with appropriate permissions, you can analyze private repositories you have access to.

### Is my code uploaded anywhere?
No, all analysis happens locally on your machine. Your code never leaves your computer. We only use GitHub's API to fetch repository metadata and file contents.

### What are the system requirements?
Minimum: 4GB RAM, 20GB disk space. Recommended: 8GB+ RAM, 50GB+ SSD for optimal performance with AI models.

### Can I use this in my CI/CD pipeline?
Yes, we provide command-line interface options for integration with CI/CD systems. Documentation for automation is available in our guides.

## Technical Questions

### What technology stack is used?
Frontend: React, TypeScript, Next.js, Tailwind CSS
Backend: Node.js, Express
AI: Multiple local and cloud-based models

### How does the AI analysis work?
We use large language models specifically trained on code to understand patterns, detect issues, and provide insights. The models analyze code structure, complexity, documentation, and best practices.

### Can I run this offline?
Yes, once you've downloaded the AI models and cloned repositories, you can analyze them offline. Only the initial GitHub fetch requires internet.

### What about security?
We take security seriously. No data is transmitted externally, all secrets are scanned for, dependencies are checked for vulnerabilities, and we follow security best practices.

### How accurate are the results?
Our analysis combines static code analysis with AI insights. Static metrics (lines of code, complexity) are 100% accurate. AI insights are highly reliable but should be reviewed by experienced developers.

### Can I customize the analysis?
Yes, you can configure analysis settings, choose which AI model to use, and customize what aspects to analyze in the settings panel.

### Does it work with monorepos?
Yes, it can analyze monorepos. The tool will analyze the entire repository structure and provide insights for each component.

### What about large repositories?
Large repositories are supported but may take longer to analyze. We recommend starting with smaller projects to familiarize yourself with the tool.

### Can I export the results?
Yes, you can export analysis results in multiple formats including JSON, PDF, and Markdown (export feature in development).

### How often should I analyze my repository?
We recommend analyzing after major changes, before releases, or on a regular schedule (weekly/monthly) to track code quality over time.

## Feature Questions

### What metrics are provided?
- Code lines (total, code, comments, blank)
- Language distribution
- File structure analysis
- Code complexity metrics
- Maintainability index
- Security vulnerabilities
- Dependency analysis
- Quality scores
- AI-generated insights and recommendations

### What is the liquid design?
Our liquid design is inspired by Apple's modern interface design, featuring smooth animations, gradient effects, and fluid transitions that make the interface feel alive and responsive.

### Can I compare multiple repositories?
Repository comparison feature is planned for v2.1. Currently, you can analyze multiple repositories separately and view their history.

### Does it detect code smells?
Yes, the analysis includes detection of common code smells, anti-patterns, and areas that could benefit from refactoring.

### What about test coverage?
If your repository includes test files, we analyze test distribution and can estimate test coverage based on test file presence and size.

### Can it suggest improvements?
Yes, the AI generates specific suggestions for improving code quality, security, documentation, and architecture based on the analysis.

### Does it check for licensing issues?
Yes, we analyze dependency licenses and check for potential licensing conflicts or issues.

### What about code documentation?
We analyze documentation quality including README files, inline comments, API documentation, and provide recommendations for improvement.

### Can it detect security vulnerabilities?
Yes, we scan for common security vulnerabilities, hardcoded secrets, insecure patterns, and dependency vulnerabilities.

### Does it analyze git history?
Basic git metadata is analyzed. Full git history analysis (commits, contributors, activity patterns) is planned for future versions.

## Troubleshooting

### The analysis is taking too long
Large repositories naturally take longer. Ensure you have sufficient RAM and CPU resources. Consider analyzing smaller sections first or upgrading your hardware.

### I'm getting rate limit errors
GitHub API has rate limits. With authentication: 5000 requests/hour. Without: 60 requests/hour. Provide a GitHub token for higher limits.

### Models won't download
Check your internet connection and available disk space. Some models are very large (up to 19GB). Ensure you have sufficient space and stable connection.

### The app won't start
Check that ports 3000 and 5000 are available. Run `npm install` to ensure all dependencies are installed. Check the logs for specific error messages.

### Results seem inaccurate
AI insights are probabilistic and may occasionally be imperfect. Always review suggestions with human judgment. Report specific inaccuracies to help us improve.

### Can't access private repos
Ensure your GitHub token has the correct scopes (repo access). Check that the token hasn't expired and that you have access to the repository.

### Memory errors during analysis
Large repositories may require more memory. Increase Node.js memory with `--max-old-space-size=4096` or analyze smaller sections.

### UI is laggy
Disable animations in settings if experiencing performance issues. Ensure your browser is up to date. Try a different browser (Chrome recommended).

### Export isn't working
Export feature is currently in development. Use the browser's print function to save results as PDF temporarily.

### Getting CORS errors
Ensure both frontend and backend are running. Check that API_URL is correctly configured in your environment variables.

## Usage Questions

### How do I start analyzing?
1. Enter a GitHub repository URL in the input field
2. Click the "Analyze" button
3. Wait for analysis to complete
4. Review the comprehensive results

### Can I save my analysis history?
Yes, all analyses are automatically saved to your history. You can view, search, and filter past analyses in the History page.

### How do I download AI models?
Go to Settings → AI Models, select a model, and click "Download". The download progress will be shown. Once complete, the model is ready to use.

### Can I use multiple models?
You can download multiple models but only use one at a time for analysis. Different models provide different perspectives and speeds.

### How do I change themes?
Click the theme toggle button in the header to switch between Liquid Blue and Liquid Dark themes. Your preference is saved automatically.

### Can I analyze the same repo multiple times?
Yes, you can re-analyze repositories at any time. This is useful for tracking changes and improvements over time.

### How do I share results?
Use the Share button on the results page to generate a shareable link (feature in development). Currently, you can export or screenshot results.

### Can I delete analysis history?
Yes, you can delete individual analyses from the History page or clear all history in Settings.

### How do I report bugs?
Create an issue on our GitHub repository or contact us through the provided channels. Include detailed steps to reproduce the issue.

### Where can I request features?
Feature requests can be submitted via GitHub Issues. We review all suggestions and prioritize based on community needs.

## Advanced Questions

### Can I contribute to the project?
Yes! We welcome contributions. See CONTRIBUTING.md for guidelines on how to contribute code, documentation, or bug reports.

### Is there an API?
Yes, the backend provides a REST API. See API_DOCUMENTATION.md for complete endpoint documentation and usage examples.

### Can I self-host for my team?
Yes, the application is designed to be self-hosted. See DEPLOYMENT.md for instructions on deploying to various platforms.

### Are there enterprise features?
Enterprise features (team collaboration, advanced security, custom models) are planned for future releases. Contact us for early access.

### Can I integrate with other tools?
Integration capabilities are being developed. Currently, you can use the API to integrate with other tools and services.

### Is there a CLI version?
Command-line interface is in development. Basic CLI functionality will be available in v2.1.

### Can I train custom models?
Custom model training is an advanced feature planned for v3.0. Currently, you can use the provided models or integrate external models.

### What about scalability?
The current version is optimized for individual use. Enterprise scaling solutions with database backend and distributed processing are planned.

### Can I white-label this?
The project is open source under MIT license. You can fork and customize it for your needs while maintaining attribution.

### Are there performance benchmarks?
Performance benchmarks are available in ARCHITECTURE.md. Analysis speed varies by repository size and available system resources.

## Getting Help

### Where can I find documentation?
Complete documentation is available in the repository:
- README.md - Getting started
- USER_GUIDE.md - Detailed usage instructions
- API_DOCUMENTATION.md - API reference
- ARCHITECTURE.md - Technical architecture
- CONTRIBUTING.md - Contribution guidelines

### How do I contact support?
- GitHub Issues: For bugs and features
- GitHub Discussions: For questions
- Email: (coming soon)
- Discord: (coming soon)

### Is there a community?
We're building a community! Join our GitHub Discussions to connect with other users, share tips, and get help.

### Are there video tutorials?
Check out our YouTube channel (@LukaCyber-s4b7o) for tutorials, tips, and feature demonstrations.

### Can I schedule a demo?
For enterprise or team demonstrations, contact us through GitHub or the provided contact methods.

---

**Last Updated:** January 6, 2026 
**Version:** 1.0.0  
**Author:** Luka

Have more questions? Open an issue on GitHub or check our documentation!
