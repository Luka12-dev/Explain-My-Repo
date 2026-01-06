import type { 
  CodeAnalysis, 
  LanguageStatistics, 
  FileTypeStatistics,
  ComplexityMetrics,
  FileInfo 
} from '@/types';

export class CodeAnalyzer {
  private languageExtensions: Record<string, string> = {
    '.ts': 'TypeScript',
    '.tsx': 'TypeScript React',
    '.js': 'JavaScript',
    '.jsx': 'JavaScript React',
    '.py': 'Python',
    '.java': 'Java',
    '.cpp': 'C++',
    '.c': 'C',
    '.cs': 'C#',
    '.go': 'Go',
    '.rs': 'Rust',
    '.rb': 'Ruby',
    '.php': 'PHP',
    '.swift': 'Swift',
    '.kt': 'Kotlin',
    '.scala': 'Scala',
    '.r': 'R',
    '.m': 'Objective-C',
    '.sql': 'SQL',
    '.sh': 'Shell',
    '.html': 'HTML',
    '.css': 'CSS',
    '.scss': 'SCSS',
    '.sass': 'Sass',
    '.less': 'Less',
    '.vue': 'Vue',
    '.md': 'Markdown',
    '.json': 'JSON',
    '.xml': 'XML',
    '.yml': 'YAML',
    '.yaml': 'YAML',
    '.toml': 'TOML',
    '.ini': 'INI',
    '.conf': 'Config',
  };

  analyzeCode(files: Array<{ path: string; content: string; size: number }>): CodeAnalysis {
    let totalLines = 0;
    let codeLines = 0;
    let commentLines = 0;
    let blankLines = 0;
    const languageStats: Map<string, { files: number; lines: number; bytes: number }> = new Map();
    const fileTypeStats: Map<string, { count: number; totalSize: number }> = new Map();
    const fileInfoList: FileInfo[] = [];

    for (const file of files) {
      const lines = file.content.split('\n');
      const fileLines = lines.length;
      totalLines += fileLines;

      const { code, comments, blank } = this.analyzeLines(lines, file.path);
      codeLines += code;
      commentLines += comments;
      blankLines += blank;

      const extension = this.getFileExtension(file.path);
      const language = this.languageExtensions[extension] || 'Other';

      const langStat = languageStats.get(language) || { files: 0, lines: 0, bytes: 0 };
      langStat.files++;
      langStat.lines += fileLines;
      langStat.bytes += file.size;
      languageStats.set(language, langStat);

      const fileTypeStat = fileTypeStats.get(extension) || { count: 0, totalSize: 0 };
      fileTypeStat.count++;
      fileTypeStat.totalSize += file.size;
      fileTypeStats.set(extension, fileTypeStat);

      fileInfoList.push({
        path: file.path,
        size: file.size,
        lines: fileLines,
        language,
        complexity: this.calculateComplexity(file.content),
      });
    }

    const languages: LanguageStatistics[] = Array.from(languageStats.entries()).map(
      ([language, stats]) => ({
        language,
        files: stats.files,
        lines: stats.lines,
        bytes: stats.bytes,
        percentage: (stats.lines / totalLines) * 100,
      })
    );

    languages.sort((a, b) => b.lines - a.lines);

    const totalBytes = fileInfoList.reduce((sum, f) => sum + f.size, 0);
    const fileTypes: FileTypeStatistics[] = Array.from(fileTypeStats.entries()).map(
      ([extension, stats]) => ({
        extension,
        count: stats.count,
        totalSize: stats.totalSize,
        percentage: (stats.totalSize / totalBytes) * 100,
      })
    );

    fileTypes.sort((a, b) => b.totalSize - a.totalSize);

    const largestFiles = fileInfoList
      .sort((a, b) => b.size - a.size)
      .slice(0, 10);

    const complexity = this.calculateProjectComplexity(fileInfoList);

    return {
      totalFiles: files.length,
      totalLines,
      codeLines,
      commentLines,
      blankLines,
      languages,
      fileTypes,
      averageFileSize: files.length > 0 ? totalBytes / files.length : 0,
      largestFiles,
      complexity,
    };
  }

  private analyzeLines(
    lines: string[],
    filePath: string
  ): { code: number; comments: number; blank: number } {
    let code = 0;
    let comments = 0;
    let blank = 0;
    let inMultilineComment = false;

    const extension = this.getFileExtension(filePath);
    const commentPatterns = this.getCommentPatterns(extension);

    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed === '') {
        blank++;
        continue;
      }

      if (commentPatterns.multilineStart && trimmed.includes(commentPatterns.multilineStart)) {
        inMultilineComment = true;
      }

      if (inMultilineComment) {
        comments++;
        if (commentPatterns.multilineEnd && trimmed.includes(commentPatterns.multilineEnd)) {
          inMultilineComment = false;
        }
        continue;
      }

      let isComment = false;
      for (const pattern of commentPatterns.singleLine) {
        if (trimmed.startsWith(pattern)) {
          isComment = true;
          break;
        }
      }

      if (isComment) {
        comments++;
      } else {
        code++;
      }
    }

    return { code, comments, blank };
  }

  private getCommentPatterns(extension: string): {
    singleLine: string[];
    multilineStart: string | null;
    multilineEnd: string | null;
  } {
    const patterns: Record<string, any> = {
      '.js': { singleLine: ['//'], multilineStart: '/*', multilineEnd: '*/' },
      '.ts': { singleLine: ['//'], multilineStart: '/*', multilineEnd: '*/' },
      '.jsx': { singleLine: ['//'], multilineStart: '/*', multilineEnd: '*/' },
      '.tsx': { singleLine: ['//'], multilineStart: '/*', multilineEnd: '*/' },
      '.py': { singleLine: ['#'], multilineStart: '"""', multilineEnd: '"""' },
      '.java': { singleLine: ['//'], multilineStart: '/*', multilineEnd: '*/' },
      '.cpp': { singleLine: ['//'], multilineStart: '/*', multilineEnd: '*/' },
      '.c': { singleLine: ['//'], multilineStart: '/*', multilineEnd: '*/' },
      '.cs': { singleLine: ['//'], multilineStart: '/*', multilineEnd: '*/' },
      '.go': { singleLine: ['//'], multilineStart: '/*', multilineEnd: '*/' },
      '.rs': { singleLine: ['//'], multilineStart: '/*', multilineEnd: '*/' },
      '.rb': { singleLine: ['#'], multilineStart: '=begin', multilineEnd: '=end' },
      '.php': { singleLine: ['//', '#'], multilineStart: '/*', multilineEnd: '*/' },
      '.html': { singleLine: [], multilineStart: '<!--', multilineEnd: '-->' },
      '.css': { singleLine: [], multilineStart: '/*', multilineEnd: '*/' },
      '.sh': { singleLine: ['#'], multilineStart: null, multilineEnd: null },
    };

    return patterns[extension] || { singleLine: [], multilineStart: null, multilineEnd: null };
  }

  private calculateComplexity(content: string): number {
    let complexity = 1;

    const complexityKeywords = [
      /\bif\b/g,
      /\belse\b/g,
      /\bfor\b/g,
      /\bwhile\b/g,
      /\bswitch\b/g,
      /\bcase\b/g,
      /\bcatch\b/g,
      /\b\?\s*:/g,
      /\&\&/g,
      /\|\|/g,
    ];

    for (const keyword of complexityKeywords) {
      const matches = content.match(keyword);
      if (matches) {
        complexity += matches.length;
      }
    }

    return complexity;
  }

  private calculateProjectComplexity(files: FileInfo[]): ComplexityMetrics {
    const complexities = files.map((f) => f.complexity || 1);
    const averageComplexity = complexities.reduce((sum, c) => sum + c, 0) / complexities.length;
    const maxComplexity = Math.max(...complexities);

    const complexFiles = files
      .filter((f) => (f.complexity || 0) > averageComplexity * 1.5)
      .map((f) => ({
        path: f.path,
        complexity: f.complexity || 0,
      }))
      .sort((a, b) => b.complexity - a.complexity)
      .slice(0, 10);

    const maintainabilityIndex = this.calculateMaintainabilityIndex(
      averageComplexity,
      files.reduce((sum, f) => sum + f.lines, 0) / files.length
    );

    return {
      averageComplexity,
      maxComplexity,
      complexFiles,
      maintainabilityIndex,
    };
  }

  private calculateMaintainabilityIndex(avgComplexity: number, avgLines: number): number {
    const volume = Math.log2(avgLines) * avgLines;
    const complexity = avgComplexity;
    const maintainability = Math.max(
      0,
      (171 - 5.2 * Math.log(volume) - 0.23 * complexity - 16.2 * Math.log(avgLines)) * 100 / 171
    );

    return Math.round(maintainability);
  }

  private getFileExtension(filePath: string): string {
    const match = filePath.match(/\.[^.]+$/);
    return match ? match[0].toLowerCase() : '';
  }
}

export const codeAnalyzer = new CodeAnalyzer();
