import type { AIInsights, Repository, CodeAnalysis, LanguageStatistics } from '@/types';

export interface AIModelConfig {
  id: string;
  name: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

export interface AnalysisContext {
  repository: Repository;
  codeAnalysis: CodeAnalysis;
  dependencies?: any;
  security?: any;
}

export class AIEngine {
  private model: AIModelConfig;
  private context: AnalysisContext;

  constructor(modelConfig: AIModelConfig, context: AnalysisContext) {
    this.model = modelConfig;
    this.context = context;
  }

  async generateInsights(): Promise<AIInsights> {
    const repository = this.context.repository;
    const codeAnalysis = this.context.codeAnalysis;

    return {
      summary: this.generateSummary(),
      purpose: this.determinePurpose(),
      techStack: this.extractTechStack(),
      strengths: this.identifyStrengths(),
      weaknesses: this.identifyWeaknesses(),
      suggestions: this.generateSuggestions(),
      useCases: this.determineUseCases(),
      targetAudience: this.identifyTargetAudience(),
      complexity: this.assessComplexity(),
      maturity: this.assessMaturity(),
      activityLevel: this.assessActivityLevel(),
      keyFeatures: this.extractKeyFeatures(),
      codeQualityInsights: this.generateCodeQualityInsights(),
      architectureInsights: this.generateArchitectureInsights(),
      performanceInsights: this.generatePerformanceInsights(),
      securityInsights: this.generateSecurityInsights(),
    };
  }

  private generateSummary(): string {
    const { repository } = this.context;
    const { codeAnalysis } = this.context;
    const primaryLang = codeAnalysis.languages[0]?.language || 'Unknown';
    const visibility = repository.isPrivate ? 'private' : 'public';
    const scale = codeAnalysis.totalFiles > 100 ? 'large-scale' : codeAnalysis.totalFiles > 50 ? 'medium-scale' : 'small-scale';

    return `${repository.fullName} is a ${visibility} ${primaryLang} project with ${codeAnalysis.totalFiles.toLocaleString()} files and ${codeAnalysis.totalLines.toLocaleString()} lines of code. This ${scale} repository demonstrates ${this.getCodeQualityDescriptor()} codebase with ${this.getActivityDescriptor()} development activity. The project has gained ${repository.stars.toLocaleString()} stars and ${repository.forks.toLocaleString()} forks, indicating ${this.getCommunityEngagementLevel()} community engagement.`;
  }

  private determinePurpose(): string {
    const { repository, codeAnalysis } = this.context;
    const primaryLang = codeAnalysis.languages[0]?.language || 'Unknown';
    const hasWeb = codeAnalysis.languages.some(l => ['HTML', 'CSS', 'JavaScript', 'TypeScript'].includes(l.language));
    const hasBackend = codeAnalysis.languages.some(l => ['Python', 'Java', 'Go', 'Rust', 'PHP'].includes(l.language));

    if (hasWeb && hasBackend) {
      return `This repository serves as a full-stack ${primaryLang.toLowerCase()} application, combining frontend and backend technologies to deliver ${repository.description || 'a complete software solution'}.`;
    } else if (hasWeb) {
      return `This repository is a frontend ${primaryLang.toLowerCase()} application focused on ${repository.description || 'user interface development'}.`;
    } else if (hasBackend) {
      return `This repository is a backend ${primaryLang.toLowerCase()} application designed for ${repository.description || 'server-side processing and API development'}.`;
    }

    return `This repository serves as a ${primaryLang.toLowerCase()} project focused on ${repository.description || 'software development'}.`;
  }

  private extractTechStack(): string[] {
    const { codeAnalysis } = this.context;
    const stack: string[] = [];

    codeAnalysis.languages.forEach(lang => {
      if (lang.percentage > 5) {
        stack.push(lang.language);
      }
    });

    const frameworks = this.detectFrameworks();
    stack.push(...frameworks);

    return stack.slice(0, 10);
  }

  private detectFrameworks(): string[] {
    const frameworks: string[] = [];
    const { codeAnalysis } = this.context;

    const hasReact = codeAnalysis.languages.some(l => l.language.includes('React'));
    const hasTypeScript = codeAnalysis.languages.some(l => l.language === 'TypeScript');
    const hasPython = codeAnalysis.languages.some(l => l.language === 'Python');

    if (hasReact) frameworks.push('React');
    if (hasTypeScript) frameworks.push('TypeScript');
    if (hasPython) frameworks.push('Python');

    return frameworks;
  }

  private identifyStrengths(): string[] {
    const strengths: string[] = [];
    const { repository, codeAnalysis } = this.context;

    if (codeAnalysis.totalFiles > 50) {
      strengths.push(`Well-organized codebase with ${codeAnalysis.totalFiles} files demonstrating modular architecture`);
    }

    if (repository.stars > 1000) {
      strengths.push(`High community recognition with ${repository.stars.toLocaleString()} stars`);
    }

    if (repository.forks > 100) {
      strengths.push(`Strong community engagement with ${repository.forks.toLocaleString()} forks`);
    }

    if (codeAnalysis.commentLines > codeAnalysis.codeLines * 0.15) {
      strengths.push('Excellent code documentation with comprehensive inline comments');
    }

    if (codeAnalysis.languages.length > 3) {
      strengths.push(`Multi-language support with ${codeAnalysis.languages.length} programming languages`);
    }

    const hasTests = codeAnalysis.languages.some(l => l.language.toLowerCase().includes('test'));
    if (hasTests) {
      strengths.push('Includes automated testing infrastructure');
    }

    if (repository.hasWiki) {
      strengths.push('Comprehensive project wiki for documentation');
    }

    if (repository.license) {
      strengths.push(`Open source with ${repository.license} license`);
    }

    return strengths;
  }

  private identifyWeaknesses(): string[] {
    const weaknesses: string[] = [];
    const { repository, codeAnalysis } = this.context;

    if (codeAnalysis.commentLines < codeAnalysis.codeLines * 0.1) {
      weaknesses.push('Low code comment ratio could benefit from more documentation');
    }

    const hasTests = codeAnalysis.languages.some(l => l.language.toLowerCase().includes('test'));
    if (!hasTests) {
      weaknesses.push('Consider adding automated tests to improve code reliability');
    }

    if (repository.openIssues > 50) {
      weaknesses.push(`High number of open issues (${repository.openIssues}) may indicate maintenance challenges`);
    }

    if (codeAnalysis.complexity.averageComplexity > 15) {
      weaknesses.push('High code complexity may impact maintainability and readability');
    }

    if (codeAnalysis.complexity.maintainabilityIndex < 60) {
      weaknesses.push('Low maintainability index suggests need for code refactoring');
    }

    if (!repository.hasWiki && !repository.description) {
      weaknesses.push('Limited documentation could make onboarding difficult for new contributors');
    }

    if (codeAnalysis.totalFiles > 500 && codeAnalysis.languages.length > 5) {
      weaknesses.push('High language diversity in large codebase may increase complexity');
    }

    return weaknesses;
  }

  private generateSuggestions(): string[] {
    const suggestions: string[] = [];
    const { repository, codeAnalysis } = this.context;

    suggestions.push('Implement comprehensive README with installation and usage instructions');

    if (codeAnalysis.commentLines < codeAnalysis.codeLines * 0.1) {
      suggestions.push('Increase inline code documentation to improve code understanding');
    }

    const hasTests = codeAnalysis.languages.some(l => l.language.toLowerCase().includes('test'));
    if (!hasTests) {
      suggestions.push('Add unit tests and integration tests to ensure code quality');
    }

    if (!repository.hasWiki) {
      suggestions.push('Create project wiki for detailed documentation and guides');
    }

    suggestions.push('Set up continuous integration and continuous deployment (CI/CD) pipeline');
    suggestions.push('Implement automated code quality checks and linting');
    suggestions.push('Add contribution guidelines to facilitate community contributions');
    suggestions.push('Perform regular security audits on dependencies');
    suggestions.push('Consider code review process for pull requests');
    suggestions.push('Implement proper error handling and logging mechanisms');

    return suggestions;
  }

  private determineUseCases(): string[] {
    const { repository, codeAnalysis } = this.context;
    const useCases: string[] = [];
    const primaryLang = codeAnalysis.languages[0]?.language || 'Unknown';

    useCases.push('Software development and engineering projects');
    useCases.push('Learning resource for developers');
    useCases.push('Code reference and best practices');

    if (repository.stars > 500) {
      useCases.push('Production-ready applications');
    }

    const hasWeb = codeAnalysis.languages.some(l => ['HTML', 'CSS', 'JavaScript', 'TypeScript'].includes(l.language));
    if (hasWeb) {
      useCases.push('Web application development');
      useCases.push('User interface design and implementation');
    }

    const hasBackend = codeAnalysis.languages.some(l => ['Python', 'Java', 'Go', 'Rust'].includes(l.language));
    if (hasBackend) {
      useCases.push('Backend services and APIs');
      useCases.push('Data processing and analysis');
    }

    useCases.push('Open source contribution and collaboration');
    useCases.push('Research and academic projects');

    return useCases;
  }

  private identifyTargetAudience(): string[] {
    const { repository, codeAnalysis } = this.context;
    const audience: string[] = [];

    audience.push('Software developers');
    audience.push('Engineering teams');

    if (repository.stars < 100) {
      audience.push('Early adopters');
    } else if (repository.stars < 1000) {
      audience.push('Professional developers');
    } else {
      audience.push('Enterprise teams');
      audience.push('Large-scale projects');
    }

    const complexity = this.assessComplexity();
    if (complexity === 'beginner') {
      audience.push('Beginner programmers');
      audience.push('Students');
    } else if (complexity === 'intermediate') {
      audience.push('Intermediate developers');
    } else {
      audience.push('Senior engineers');
      audience.push('Technical architects');
    }

    audience.push('Open source contributors');
    audience.push('Technical enthusiasts');

    return audience;
  }

  private assessComplexity(): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
    const { codeAnalysis } = this.context;

    if (codeAnalysis.totalFiles < 20 && codeAnalysis.complexity.averageComplexity < 5) {
      return 'beginner';
    } else if (codeAnalysis.totalFiles < 100 && codeAnalysis.complexity.averageComplexity < 10) {
      return 'intermediate';
    } else if (codeAnalysis.totalFiles < 500 && codeAnalysis.complexity.averageComplexity < 20) {
      return 'advanced';
    }
    return 'expert';
  }

  private assessMaturity(): 'experimental' | 'development' | 'stable' | 'mature' {
    const { repository } = this.context;
    const ageInDays = Math.floor((Date.now() - new Date(repository.createdAt).getTime()) / (1000 * 60 * 60 * 24));

    if (repository.stars > 5000 && ageInDays > 365) {
      return 'mature';
    } else if (repository.stars > 1000 && ageInDays > 180) {
      return 'stable';
    } else if (repository.stars > 100 && ageInDays > 90) {
      return 'development';
    }
    return 'experimental';
  }

  private assessActivityLevel(): 'inactive' | 'low' | 'moderate' | 'active' | 'very active' {
    const { repository } = this.context;
    const daysSinceUpdate = Math.floor((Date.now() - new Date(repository.updatedAt).getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceUpdate < 7) {
      return 'very active';
    } else if (daysSinceUpdate < 30) {
      return 'active';
    } else if (daysSinceUpdate < 90) {
      return 'moderate';
    } else if (daysSinceUpdate < 180) {
      return 'low';
    }
    return 'inactive';
  }

  private extractKeyFeatures(): string[] {
    const { repository, codeAnalysis } = this.context;
    const features: string[] = [];
    const primaryLang = codeAnalysis.languages[0]?.language || 'Unknown';

    features.push(`${primaryLang} implementation with ${codeAnalysis.totalFiles} files`);
    features.push(`${codeAnalysis.totalLines.toLocaleString()} lines of production code`);

    if (codeAnalysis.languages.length > 1) {
      features.push(`Multi-language support (${codeAnalysis.languages.length} languages)`);
    }

    if (repository.topics.length > 0) {
      features.push(`Tagged with ${repository.topics.length} relevant topics`);
    }

    if (repository.hasWiki) {
      features.push('Comprehensive documentation wiki');
    }

    if (repository.hasIssues) {
      features.push('Issue tracking enabled');
    }

    if (repository.hasProjects) {
      features.push('Project management boards');
    }

    if (repository.license) {
      features.push(`${repository.license} licensed open source`);
    }

    const hasTests = codeAnalysis.languages.some(l => l.language.toLowerCase().includes('test'));
    if (hasTests) {
      features.push('Automated testing framework');
    }

    features.push(`${repository.forks.toLocaleString()} community forks`);

    return features;
  }

  private generateCodeQualityInsights(): string[] {
    const insights: string[] = [];
    const { codeAnalysis } = this.context;

    const commentRatio = codeAnalysis.commentLines / Math.max(codeAnalysis.codeLines, 1);
    insights.push(`Code-to-comment ratio: ${(1 / commentRatio).toFixed(2)}:1 (${(commentRatio * 100).toFixed(1)}% comments)`);

    insights.push(`Average file size: ${Math.round(codeAnalysis.averageFileSize).toLocaleString()} bytes`);

    insights.push(`Code complexity: Average ${codeAnalysis.complexity.averageComplexity.toFixed(1)}, Max ${codeAnalysis.complexity.maxComplexity.toFixed(0)}`);

    insights.push(`Maintainability index: ${codeAnalysis.complexity.maintainabilityIndex}/100`);

    const blankRatio = codeAnalysis.blankLines / codeAnalysis.totalLines;
    insights.push(`Code density: ${((1 - blankRatio) * 100).toFixed(1)}% (${codeAnalysis.blankLines.toLocaleString()} blank lines)`);

    if (codeAnalysis.languages.length > 1) {
      const diversityScore = (codeAnalysis.languages.length / codeAnalysis.totalFiles) * 100;
      insights.push(`Language diversity: ${diversityScore.toFixed(1)}% (${codeAnalysis.languages.length} languages)`);
    }

    return insights;
  }

  private generateArchitectureInsights(): string[] {
    const insights: string[] = [];
    const { codeAnalysis } = this.context;
    const primaryLang = codeAnalysis.languages[0]?.language || 'Unknown';

    insights.push(`Primary language: ${primaryLang} (${codeAnalysis.languages[0]?.percentage.toFixed(1)}% of codebase)`);

    insights.push(`Total ${codeAnalysis.totalFiles} files organized across multiple directories`);

    if (codeAnalysis.languages.length > 3) {
      insights.push(`Multi-language architecture with ${codeAnalysis.languages.length} programming languages`);
    } else if (codeAnalysis.languages.length > 1) {
      insights.push(`Hybrid architecture combining ${codeAnalysis.languages.map(l => l.language).slice(0, 3).join(', ')}`);
    } else {
      insights.push(`Mono-language architecture using ${primaryLang}`);
    }

    const hasModularStructure = codeAnalysis.totalFiles > 50;
    if (hasModularStructure) {
      insights.push('Modular architecture with clear separation of concerns');
    }

    insights.push(`File organization suggests ${codeAnalysis.totalFiles < 50 ? 'simple' : codeAnalysis.totalFiles < 200 ? 'moderate' : 'complex'} project structure`);

    return insights;
  }

  private generatePerformanceInsights(): string[] {
    const insights: string[] = [];
    const { repository, codeAnalysis } = this.context;

    const sizeInMB = repository.size / 1024;
    insights.push(`Repository size: ${sizeInMB.toFixed(2)} MB`);

    const filesPerKB = codeAnalysis.totalFiles / (repository.size / 1024);
    insights.push(`File density: ${filesPerKB.toFixed(2)} files per KB`);

    insights.push(`Average lines per file: ${Math.round(codeAnalysis.totalLines / codeAnalysis.totalFiles)}`);

    if (codeAnalysis.totalFiles > 1000) {
      insights.push('Large codebase may benefit from lazy loading and code splitting');
    }

    if (codeAnalysis.complexity.averageComplexity > 15) {
      insights.push('High complexity may impact runtime performance');
    } else if (codeAnalysis.complexity.averageComplexity < 5) {
      insights.push('Low complexity suggests optimized, efficient code');
    }

    return insights;
  }

  private generateSecurityInsights(): string[] {
    const insights: string[] = [];
    const { repository } = this.context;

    insights.push('Regular security audits recommended for dependencies');

    if (repository.isPrivate) {
      insights.push('Private repository with controlled access');
    } else {
      insights.push('Public repository - ensure sensitive data is not committed');
    }

    insights.push('Implement automated security scanning in CI/CD pipeline');
    insights.push('Consider using dependency vulnerability scanning tools');
    insights.push('Review and update dependencies regularly');

    if (repository.openIssues > 20) {
      insights.push('Monitor open issues for security-related reports');
    }

    insights.push('Enable branch protection rules for main branches');
    insights.push('Implement code review process for all changes');

    return insights;
  }

  private getCodeQualityDescriptor(): string {
    const { codeAnalysis } = this.context;
    const commentRatio = codeAnalysis.commentLines / Math.max(codeAnalysis.codeLines, 1);
    const complexityScore = codeAnalysis.complexity.averageComplexity;

    if (commentRatio > 0.15 && complexityScore < 10) {
      return 'a well-documented, maintainable';
    } else if (commentRatio > 0.1 && complexityScore < 15) {
      return 'a well-maintained';
    } else if (complexityScore < 20) {
      return 'a functional';
    }
    return 'a complex';
  }

  private getActivityDescriptor(): string {
    const level = this.assessActivityLevel();
    const descriptors = {
      'very active': 'highly active',
      'active': 'active',
      'moderate': 'moderate',
      'low': 'occasional',
      'inactive': 'limited',
    };
    return descriptors[level];
  }

  private getCommunityEngagementLevel(): string {
    const { repository } = this.context;
    const engagementScore = repository.stars + repository.forks * 2;

    if (engagementScore > 10000) return 'exceptional';
    if (engagementScore > 5000) return 'very strong';
    if (engagementScore > 1000) return 'strong';
    if (engagementScore > 100) return 'moderate';
    return 'growing';
  }
}

export default AIEngine;
