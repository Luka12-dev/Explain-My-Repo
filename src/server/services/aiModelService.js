const fs = require('fs').promises;
const path = require('path');

// Try to load node-llama-cpp, but continue if not available
let LlamaModel, LlamaContext, LlamaChatSession;
try {
  const llamaCpp = require('node-llama-cpp');
  LlamaModel = llamaCpp.LlamaModel;
  LlamaContext = llamaCpp.LlamaContext;
  LlamaChatSession = llamaCpp.LlamaChatSession;
  console.log('✓ node-llama-cpp loaded successfully');
} catch (error) {
  console.warn('⚠ node-llama-cpp not available, using fallback analysis');
}

class AIModelService {
  constructor() {
    this.modelsDir = path.join(__dirname, '../../../models');
    this.loadedModel = null;
    this.modelContext = null;
    this.modelPath = null;
  }

  /**
   * Check if a model file exists and return its path
   */
  async findModelFile(modelId) {
    try {
      const files = await fs.readdir(this.modelsDir);
      
      // Common model file patterns
      const patterns = [
        `${modelId}.gguf`,
        `${modelId}.bin`,
        modelId.includes('phi') ? 'phi-2.gguf' : null,
        modelId.includes('codellama') ? `codellama-${modelId.split('-')[1]}.gguf` : null,
      ].filter(Boolean);
      
      for (const file of files) {
        for (const pattern of patterns) {
          if (file.toLowerCase().includes(pattern.toLowerCase()) || 
              file.toLowerCase().includes(modelId.toLowerCase())) {
            return path.join(this.modelsDir, file);
          }
        }
      }
      return null;
    } catch (error) {
      console.error('Error finding model file:', error);
      return null;
    }
  }

  /**
   * Load the AI model (lazy loading)
   */
  async loadModel(modelPath) {
    if (!LlamaModel) {
      console.log('node-llama-cpp not available, skipping model load');
      return false;
    }

    try {
      if (this.loadedModel && this.modelPath === modelPath) {
        console.log('Model already loaded');
        return true;
      }

      console.log(`Loading AI model: ${modelPath}`);
      console.log('This may take a minute...');
      
      const startTime = Date.now();
      this.loadedModel = new LlamaModel({
        modelPath: modelPath,
      });
      
      this.modelContext = new LlamaContext({
        model: this.loadedModel,
        contextSize: 2048, // Adjust based on your needs
      });
      
      this.modelPath = modelPath;
      
      const loadTime = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`✓ Model loaded successfully in ${loadTime}s`);
      return true;
    } catch (error) {
      console.error('Failed to load model:', error);
      return false;
    }
  }

  /**
   * Generate AI insights using the local model
   */
  async generateInsights(context, modelId = 'phi-2') {
    try {
      const modelPath = await this.findModelFile(modelId);
      
      if (!modelPath) {
        console.log(`AI Model file not found for ${modelId}, using fallback analysis`);
        return this.generateFallbackInsights(context);
      }

      console.log(`Found AI model: ${modelPath}`);
      
      // Try to load and use the model
      const modelLoaded = await this.loadModel(modelPath);
      
      if (!modelLoaded || !this.modelContext) {
        console.log('Could not load AI model, using fallback analysis');
        return this.generateFallbackInsights(context);
      }

      // Build prompt for the AI model
      const prompt = this.buildPrompt(context);
      console.log('Generating AI insights with real model...');
      
      try {
        const session = new LlamaChatSession({
          context: this.modelContext,
        });

        const response = await session.prompt(prompt, {
          maxTokens: 500,
          temperature: 0.7,
          topK: 40,
          topP: 0.9,
        });

        console.log('✓ AI insights generated successfully');
        
        // Parse AI response and combine with fallback for structured data
        const fallbackInsights = this.generateFallbackInsights(context);
        
        return {
          ...fallbackInsights,
          summary: this.extractSummary(response) || fallbackInsights.summary,
          keyFeatures: this.extractKeyFeatures(response) || fallbackInsights.keyFeatures,
          aiGenerated: true,
          rawAIResponse: response,
        };
      } catch (inferenceError) {
        console.error('AI inference failed:', inferenceError);
        return this.generateFallbackInsights(context);
      }
    } catch (error) {
      console.error('Error generating AI insights:', error);
      return this.generateFallbackInsights(context);
    }
  }

  /**
   * Extract summary from AI response
   */
  extractSummary(aiResponse) {
    try {
      // Look for summary section in response
      const summaryMatch = aiResponse.match(/summary[:\s]+(.*?)(?:\n\n|key features)/is);
      if (summaryMatch) {
        return summaryMatch[1].trim();
      }
      
      // If no specific section, return first paragraph
      const firstParagraph = aiResponse.split('\n\n')[0];
      if (firstParagraph && firstParagraph.length > 50) {
        return firstParagraph.trim();
      }
    } catch (error) {
      console.error('Error extracting summary:', error);
    }
    return null;
  }

  /**
   * Extract key features from AI response
   */
  extractKeyFeatures(aiResponse) {
    try {
      const features = [];
      
      // Look for numbered or bulleted lists
      const listMatches = aiResponse.match(/(?:^|\n)(?:\d+\.|[-*•])\s+(.+)/gm);
      if (listMatches && listMatches.length > 0) {
        listMatches.forEach(match => {
          const feature = match.replace(/^(?:\d+\.|[-*•])\s+/, '').trim();
          if (feature.length > 10 && feature.length < 200) {
            features.push(feature);
          }
        });
      }
      
      return features.length >= 3 ? features.slice(0, 5) : null;
    } catch (error) {
      console.error('Error extracting features:', error);
    }
    return null;
  }

  /**
   * Build a prompt for the AI model
   */
  buildPrompt(context) {
    const { repository, codeAnalysis } = context;
    
    return `Analyze this GitHub repository and provide insights:

Repository: ${repository.fullName}
Description: ${repository.description || 'N/A'}
Primary Language: ${codeAnalysis.languages[0]?.language || 'Unknown'}
Total Files: ${codeAnalysis.totalFiles}
Total Lines: ${codeAnalysis.totalLines}
Stars: ${repository.stars}
Forks: ${repository.forks}

Languages:
${codeAnalysis.languages.map(l => `- ${l.language}: ${l.percentage.toFixed(1)}%`).join('\n')}

Please provide:
1. A concise summary of the repository
2. Key features (3-5 items)
3. Technology stack
4. Strengths and weaknesses
5. Suggestions for improvement

Response:`;
  }

  /**
   * Fallback analysis when no AI model is available
   */
  generateFallbackInsights(context) {
    const { repository, codeAnalysis } = context;
    const primaryLang = codeAnalysis.languages[0]?.language || 'Unknown';
    const visibility = repository.isPrivate ? 'private' : 'public';
    const scale = codeAnalysis.totalFiles > 100 ? 'large-scale' : 
                  codeAnalysis.totalFiles > 50 ? 'medium-scale' : 'small-scale';

    const summary = `${repository.fullName} is a ${visibility} ${primaryLang} project with ${codeAnalysis.totalFiles} files and ${codeAnalysis.totalLines.toLocaleString()} lines of code. The repository demonstrates ${this.getCodeQualityDescriptor(codeAnalysis)} codebase with ${this.getActivityDescriptor(repository)} development activity.`;

    const keyFeatures = [
      `${primaryLang} implementation with ${codeAnalysis.totalFiles} files`,
      `${codeAnalysis.totalLines.toLocaleString()} lines of code`,
      codeAnalysis.languages.length > 1 ? `Multi-language support (${codeAnalysis.languages.length} languages)` : `Single-language codebase`,
      repository.license ? `${repository.license} licensed open source` : 'No specified license',
      `${repository.stars.toLocaleString()} stars and ${repository.forks.toLocaleString()} forks on GitHub`,
    ];

    return {
      summary,
      keyFeatures,
      purpose: this.determinePurpose(context),
      techStack: this.extractTechStack(codeAnalysis),
      strengths: this.identifyStrengths(context),
      weaknesses: this.identifyWeaknesses(context),
      suggestions: this.generateSuggestions(context),
      useCases: this.determineUseCases(context),
      targetAudience: this.identifyTargetAudience(context),
      complexity: this.assessComplexity(codeAnalysis),
      maturity: this.assessMaturity(repository),
      activityLevel: this.assessActivityLevel(repository),
      codeQualityInsights: this.generateCodeQualityInsights(codeAnalysis),
      architectureInsights: this.generateArchitectureInsights(codeAnalysis),
      performanceInsights: this.generatePerformanceInsights(context),
      securityInsights: this.generateSecurityInsights(repository),
    };
  }

  getCodeQualityDescriptor(codeAnalysis) {
    const commentRatio = codeAnalysis.commentLines / Math.max(codeAnalysis.codeLines, 1);
    const complexityScore = codeAnalysis.complexity?.averageComplexity || 10;

    if (commentRatio > 0.15 && complexityScore < 10) return 'a well-documented, maintainable';
    if (commentRatio > 0.1 && complexityScore < 15) return 'a well-maintained';
    if (complexityScore < 20) return 'a functional';
    return 'a complex';
  }

  getActivityDescriptor(repository) {
    const daysSinceUpdate = Math.floor((Date.now() - new Date(repository.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceUpdate < 7) return 'highly active';
    if (daysSinceUpdate < 30) return 'active';
    if (daysSinceUpdate < 90) return 'moderate';
    return 'occasional';
  }

  determinePurpose(context) {
    const { repository, codeAnalysis } = context;
    const primaryLang = codeAnalysis.languages[0]?.language || 'Unknown';
    return `This repository serves as a ${primaryLang.toLowerCase()} project focused on ${repository.description || 'software development'}.`;
  }

  extractTechStack(codeAnalysis) {
    return codeAnalysis.languages
      .filter(l => l.percentage > 5)
      .map(l => l.language)
      .slice(0, 10);
  }

  identifyStrengths(context) {
    const { repository, codeAnalysis } = context;
    const strengths = [];

    if (codeAnalysis.totalFiles > 50) {
      strengths.push(`Well-organized codebase with ${codeAnalysis.totalFiles} files`);
    }
    if (repository.stars > 100) {
      strengths.push(`Community recognition with ${repository.stars.toLocaleString()} stars`);
    }
    if (codeAnalysis.commentLines > codeAnalysis.codeLines * 0.15) {
      strengths.push('Good code documentation');
    }
    if (codeAnalysis.languages.length > 3) {
      strengths.push(`Multi-language support (${codeAnalysis.languages.length} languages)`);
    }
    if (repository.license) {
      strengths.push(`Open source with ${repository.license} license`);
    }

    return strengths.length > 0 ? strengths : ['Active development'];
  }

  identifyWeaknesses(context) {
    const { repository, codeAnalysis } = context;
    const weaknesses = [];

    if (codeAnalysis.commentLines < codeAnalysis.codeLines * 0.1) {
      weaknesses.push('Could benefit from more code documentation');
    }
    if (repository.openIssues > 50) {
      weaknesses.push(`High number of open issues (${repository.openIssues})`);
    }

    return weaknesses.length > 0 ? weaknesses : ['Consider adding more tests'];
  }

  generateSuggestions(context) {
    return [
      'Implement comprehensive README documentation',
      'Add unit tests to improve code quality',
      'Set up CI/CD pipeline for automated testing',
      'Consider adding contribution guidelines',
      'Regular dependency updates and security audits',
    ];
  }

  determineUseCases(context) {
    return [
      'Software development projects',
      'Learning resource for developers',
      'Code reference and best practices',
      'Open source contribution',
    ];
  }

  identifyTargetAudience(context) {
    return [
      'Software developers',
      'Engineering teams',
      'Open source contributors',
      'Technical enthusiasts',
    ];
  }

  assessComplexity(codeAnalysis) {
    if (codeAnalysis.totalFiles < 20) return 'beginner';
    if (codeAnalysis.totalFiles < 100) return 'intermediate';
    if (codeAnalysis.totalFiles < 500) return 'advanced';
    return 'expert';
  }

  assessMaturity(repository) {
    const ageInDays = Math.floor((Date.now() - new Date(repository.createdAt).getTime()) / (1000 * 60 * 60 * 24));
    if (repository.stars > 5000 && ageInDays > 365) return 'mature';
    if (repository.stars > 1000 && ageInDays > 180) return 'stable';
    if (repository.stars > 100 && ageInDays > 90) return 'development';
    return 'experimental';
  }

  assessActivityLevel(repository) {
    const daysSinceUpdate = Math.floor((Date.now() - new Date(repository.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceUpdate < 7) return 'very active';
    if (daysSinceUpdate < 30) return 'active';
    if (daysSinceUpdate < 90) return 'moderate';
    return 'low';
  }

  generateCodeQualityInsights(codeAnalysis) {
    const commentRatio = codeAnalysis.commentLines / Math.max(codeAnalysis.codeLines, 1);
    return [
      `Code-to-comment ratio: ${(1 / commentRatio).toFixed(2)}:1`,
      `Average file size: ${Math.round(codeAnalysis.averageFileSize).toLocaleString()} bytes`,
      `Code complexity: Average ${codeAnalysis.complexity?.averageComplexity?.toFixed(1) || 'N/A'}`,
    ];
  }

  generateArchitectureInsights(codeAnalysis) {
    const primaryLang = codeAnalysis.languages[0]?.language || 'Unknown';
    return [
      `Primary language: ${primaryLang} (${codeAnalysis.languages[0]?.percentage.toFixed(1)}%)`,
      `Total ${codeAnalysis.totalFiles} files organized across directories`,
      codeAnalysis.languages.length > 3 ? 
        `Multi-language architecture with ${codeAnalysis.languages.length} languages` :
        `Mono-language architecture using ${primaryLang}`,
    ];
  }

  generatePerformanceInsights(context) {
    const { repository, codeAnalysis } = context;
    const sizeInMB = repository.size / 1024;
    return [
      `Repository size: ${sizeInMB.toFixed(2)} MB`,
      `Average lines per file: ${Math.round(codeAnalysis.totalLines / codeAnalysis.totalFiles)}`,
    ];
  }

  generateSecurityInsights(repository) {
    return [
      'Regular security audits recommended',
      repository.isPrivate ? 'Private repository with controlled access' : 'Public repository - ensure no sensitive data',
      'Implement automated security scanning in CI/CD',
      'Review and update dependencies regularly',
    ];
  }
}

module.exports = new AIModelService();
