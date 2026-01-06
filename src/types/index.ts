export interface Repository {
  id: string;
  name: string;
  fullName: string;
  owner: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  language: string;
  createdAt: string;
  updatedAt: string;
  size: number;
  openIssues: number;
  topics: string[];
  license: string | null;
  defaultBranch: string;
  isPrivate: boolean;
  hasWiki: boolean;
  hasIssues: boolean;
  hasProjects: boolean;
  hasDownloads: boolean;
}

export interface RepositoryAnalysis {
  repository: Repository;
  codeAnalysis: CodeAnalysis;
  structureAnalysis: StructureAnalysis;
  dependencies: DependencyAnalysis;
  qualityMetrics: QualityMetrics;
  securityAnalysis: SecurityAnalysis;
  documentation: DocumentationAnalysis;
  aiInsights: AIInsights;
  timestamp: string;
  processingTime: number;
}

export interface CodeAnalysis {
  totalFiles: number;
  totalLines: number;
  codeLines: number;
  commentLines: number;
  blankLines: number;
  languages: LanguageStatistics[];
  fileTypes: FileTypeStatistics[];
  averageFileSize: number;
  largestFiles: FileInfo[];
  complexity: ComplexityMetrics;
}

export interface LanguageStatistics {
  language: string;
  files: number;
  lines: number;
  percentage: number;
  bytes: number;
}

export interface FileTypeStatistics {
  extension: string;
  count: number;
  totalSize: number;
  percentage: number;
}

export interface FileInfo {
  path: string;
  size: number;
  lines: number;
  language: string;
  complexity?: number;
}

export interface ComplexityMetrics {
  averageComplexity: number;
  maxComplexity: number;
  complexFiles: Array<{
    path: string;
    complexity: number;
  }>;
  maintainabilityIndex: number;
}

export interface StructureAnalysis {
  directories: number;
  maxDepth: number;
  structure: DirectoryNode;
  patterns: ArchitecturePattern[];
  organizationScore: number;
}

export interface DirectoryNode {
  name: string;
  path: string;
  type: 'file' | 'directory';
  children?: DirectoryNode[];
  size?: number;
  lines?: number;
}

export interface ArchitecturePattern {
  name: string;
  confidence: number;
  description: string;
  files: string[];
}

export interface DependencyAnalysis {
  total: number;
  direct: number;
  dev: number;
  outdated: OutdatedDependency[];
  vulnerabilities: Vulnerability[];
  licenses: LicenseInfo[];
  dependencyGraph: DependencyNode[];
}

export interface OutdatedDependency {
  name: string;
  current: string;
  latest: string;
  type: 'dependency' | 'devDependency';
}

export interface Vulnerability {
  id: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  package: string;
  title: string;
  description: string;
  vulnerable: string;
  patched: string;
}

export interface LicenseInfo {
  name: string;
  packages: string[];
  count: number;
  compatible: boolean;
}

export interface DependencyNode {
  name: string;
  version: string;
  dependencies: string[];
  depth: number;
}

export interface QualityMetrics {
  overallScore: number;
  codeQuality: number;
  documentation: number;
  testing: number;
  maintainability: number;
  security: number;
  performance: number;
  bestPractices: BestPracticeCheck[];
  recommendations: Recommendation[];
}

export interface BestPracticeCheck {
  name: string;
  passed: boolean;
  importance: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  suggestion?: string;
}

export interface Recommendation {
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  actionItems: string[];
  estimatedEffort: string;
}

export interface SecurityAnalysis {
  overallRating: 'excellent' | 'good' | 'fair' | 'poor' | 'critical';
  vulnerabilities: Vulnerability[];
  secrets: SecretDetection[];
  permissions: PermissionCheck[];
  dependencies: SecurityDependency[];
  scoreBreakdown: {
    vulnerabilities: number;
    secrets: number;
    permissions: number;
    dependencies: number;
  };
}

export interface SecretDetection {
  type: string;
  file: string;
  line: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export interface PermissionCheck {
  file: string;
  permissions: string;
  risk: 'low' | 'medium' | 'high';
  recommendation: string;
}

export interface SecurityDependency {
  name: string;
  version: string;
  vulnerabilities: number;
  severity: 'low' | 'moderate' | 'high' | 'critical';
}

export interface DocumentationAnalysis {
  hasReadme: boolean;
  hasContributing: boolean;
  hasLicense: boolean;
  hasChangelog: boolean;
  hasCodeOfConduct: boolean;
  readmeQuality: number;
  apiDocumentation: boolean;
  inlineComments: number;
  commentRatio: number;
  documentationScore: number;
  missingDocs: string[];
}

export interface AIInsights {
  summary: string;
  purpose: string;
  techStack: string[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  useCases: string[];
  targetAudience: string[];
  complexity: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  maturity: 'experimental' | 'development' | 'stable' | 'mature';
  activityLevel: 'inactive' | 'low' | 'moderate' | 'active' | 'very active';
  keyFeatures: string[];
  codeQualityInsights: string[];
  architectureInsights: string[];
  performanceInsights: string[];
  securityInsights: string[];
}

export interface AnalysisProgress {
  stage: string;
  progress: number;
  message: string;
  startTime: number;
  estimatedTimeRemaining?: number;
}

export interface SearchResult {
  type: 'file' | 'code' | 'commit' | 'issue' | 'pr';
  title: string;
  description: string;
  path?: string;
  url: string;
  score: number;
  highlights: string[];
  metadata: Record<string, any>;
}

export interface AnalysisHistory {
  id: string;
  repositoryUrl: string;
  repositoryName: string;
  timestamp: string;
  duration: number;
  summary: string;
  status: 'completed' | 'failed' | 'cancelled';
}

export interface Theme {
  name: 'liquid-blue' | 'liquid-dark';
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface AppSettings {
  theme: 'liquid-blue' | 'liquid-dark';
  animations: boolean;
  autoSave: boolean;
  defaultModel: string;
  apiEndpoint: string;
  maxConcurrentAnalyses: number;
  cacheResults: boolean;
  cacheDuration: number;
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
  size: string;
  type: 'local' | 'api';
  status: 'not-downloaded' | 'downloading' | 'ready' | 'error';
  downloadProgress?: number;
  path?: string;
  capabilities: string[];
  requirements: {
    ram: string;
    disk: string;
    gpu?: string;
  };
}

export interface ModelDownloadProgress {
  modelId: string;
  progress: number;
  downloadedBytes: number;
  totalBytes: number;
  speed: number;
  eta: number;
  status: 'pending' | 'downloading' | 'extracting' | 'completed' | 'error';
  error?: string;
}

export interface GitHubRateLimit {
  limit: number;
  remaining: number;
  reset: number;
  used: number;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
}

export interface CommitAnalysis {
  sha: string;
  message: string;
  author: string;
  date: string;
  filesChanged: number;
  additions: number;
  deletions: number;
  impact: 'low' | 'medium' | 'high';
}

export interface ContributorAnalysis {
  login: string;
  name: string;
  avatar: string;
  contributions: number;
  commits: number;
  additions: number;
  deletions: number;
  percentage: number;
}

export interface IssueAnalysis {
  openIssues: number;
  closedIssues: number;
  averageCloseTime: number;
  oldestOpenIssue: {
    title: string;
    age: number;
    url: string;
  };
  issuesByLabel: Array<{
    label: string;
    count: number;
  }>;
}

export interface PullRequestAnalysis {
  openPRs: number;
  closedPRs: number;
  mergedPRs: number;
  averageMergeTime: number;
  oldestOpenPR: {
    title: string;
    age: number;
    url: string;
  };
}

export interface ActivityAnalysis {
  commits: CommitAnalysis[];
  contributors: ContributorAnalysis[];
  issues: IssueAnalysis;
  pullRequests: PullRequestAnalysis;
  lastCommit: {
    date: string;
    message: string;
    author: string;
  };
  activityTimeline: Array<{
    date: string;
    commits: number;
    issues: number;
    prs: number;
  }>;
}
