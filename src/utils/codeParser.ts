export interface ParsedFunction {
  name: string;
  parameters: string[];
  returnType?: string;
  lineStart: number;
  lineEnd: number;
  complexity: number;
  isAsync: boolean;
  isExported: boolean;
  documentation?: string;
}

export interface ParsedClass {
  name: string;
  extends?: string;
  implements: string[];
  methods: ParsedFunction[];
  properties: Array<{
    name: string;
    type?: string;
    visibility: 'public' | 'private' | 'protected';
  }>;
  lineStart: number;
  lineEnd: number;
  isExported: boolean;
  documentation?: string;
}

export interface ParsedImport {
  source: string;
  imports: Array<{
    name: string;
    alias?: string;
  }>;
  isDefault: boolean;
  lineNumber: number;
}

export interface ParsedExport {
  name: string;
  type: 'function' | 'class' | 'variable' | 'type';
  isDefault: boolean;
  lineNumber: number;
}

export interface CodeStructure {
  imports: ParsedImport[];
  exports: ParsedExport[];
  functions: ParsedFunction[];
  classes: ParsedClass[];
  variables: Array<{
    name: string;
    type?: string;
    isConst: boolean;
    lineNumber: number;
  }>;
  types: Array<{
    name: string;
    lineNumber: number;
  }>;
  interfaces: Array<{
    name: string;
    lineNumber: number;
  }>;
}

export class CodeParser {
  private content: string;
  private lines: string[];
  private language: string;

  constructor(content: string, language: string = 'typescript') {
    this.content = content;
    this.lines = content.split('\n');
    this.language = language.toLowerCase();
  }

  parse(): CodeStructure {
    return {
      imports: this.parseImports(),
      exports: this.parseExports(),
      functions: this.parseFunctions(),
      classes: this.parseClasses(),
      variables: this.parseVariables(),
      types: this.parseTypes(),
      interfaces: this.parseInterfaces(),
    };
  }

  private parseImports(): ParsedImport[] {
    const imports: ParsedImport[] = [];
    const importPattern = /import\s+(?:(\{[^}]+\})|(\*\s+as\s+\w+)|(\w+))\s+from\s+['"]([^'"]+)['"]/g;

    this.lines.forEach((line, index) => {
      let match;
      while ((match = importPattern.exec(line)) !== null) {
        const namedImports = match[1];
        const namespaceImport = match[2];
        const defaultImport = match[3];
        const source = match[4];

        const importItems: Array<{ name: string; alias?: string }> = [];

        if (namedImports) {
          const items = namedImports.replace(/[{}]/g, '').split(',');
          items.forEach((item) => {
            const parts = item.trim().split(/\s+as\s+/);
            importItems.push({
              name: parts[0].trim(),
              alias: parts[1]?.trim(),
            });
          });
        } else if (namespaceImport) {
          const parts = namespaceImport.split(/\s+as\s+/);
          importItems.push({
            name: '*',
            alias: parts[1]?.trim(),
          });
        } else if (defaultImport) {
          importItems.push({
            name: defaultImport.trim(),
          });
        }

        imports.push({
          source,
          imports: importItems,
          isDefault: !!defaultImport,
          lineNumber: index + 1,
        });
      }
    });

    return imports;
  }

  private parseExports(): ParsedExport[] {
    const exports: ParsedExport[] = [];
    const exportPatterns = [
      /export\s+default\s+(function|class)\s+(\w+)/,
      /export\s+default\s+(\w+)/,
      /export\s+(function|class|const|let|var|interface|type)\s+(\w+)/,
      /export\s+\{([^}]+)\}/,
    ];

    this.lines.forEach((line, index) => {
      exportPatterns.forEach((pattern) => {
        const match = line.match(pattern);
        if (match) {
          if (pattern.source.includes('default')) {
            if (match[1] === 'function' || match[1] === 'class') {
              exports.push({
                name: match[2],
                type: match[1] as any,
                isDefault: true,
                lineNumber: index + 1,
              });
            } else {
              exports.push({
                name: match[1],
                type: 'variable',
                isDefault: true,
                lineNumber: index + 1,
              });
            }
          } else if (pattern.source.includes('{')) {
            const items = match[1].split(',').map((item) => item.trim());
            items.forEach((item) => {
              exports.push({
                name: item,
                type: 'variable',
                isDefault: false,
                lineNumber: index + 1,
              });
            });
          } else {
            exports.push({
              name: match[2],
              type: match[1] === 'function' || match[1] === 'class' ? match[1] as any : 'variable',
              isDefault: false,
              lineNumber: index + 1,
            });
          }
        }
      });
    });

    return exports;
  }

  private parseFunctions(): ParsedFunction[] {
    const functions: ParsedFunction[] = [];
    const functionPattern = /(export\s+)?(async\s+)?function\s+(\w+)\s*\(([^)]*)\)(?:\s*:\s*([^{]+))?\s*\{/g;
    const arrowFunctionPattern = /(export\s+)?(const|let|var)\s+(\w+)\s*=\s*(async\s+)?\(([^)]*)\)(?:\s*:\s*([^=]+))?\s*=>/g;

    let match;
    while ((match = functionPattern.exec(this.content)) !== null) {
      const isExported = !!match[1];
      const isAsync = !!match[2];
      const name = match[3];
      const params = match[4].split(',').map((p) => p.trim()).filter((p) => p);
      const returnType = match[5]?.trim();

      const lineStart = this.content.substring(0, match.index).split('\n').length;
      const functionBody = this.extractFunctionBody(match.index + match[0].length);
      const lineEnd = lineStart + functionBody.split('\n').length;
      const complexity = this.calculateComplexity(functionBody);

      functions.push({
        name,
        parameters: params,
        returnType,
        lineStart,
        lineEnd,
        complexity,
        isAsync,
        isExported,
      });
    }

    while ((match = arrowFunctionPattern.exec(this.content)) !== null) {
      const isExported = !!match[1];
      const name = match[3];
      const isAsync = !!match[4];
      const params = match[5].split(',').map((p) => p.trim()).filter((p) => p);
      const returnType = match[6]?.trim();

      const lineStart = this.content.substring(0, match.index).split('\n').length;
      const functionBody = this.extractArrowFunctionBody(match.index + match[0].length);
      const lineEnd = lineStart + functionBody.split('\n').length;
      const complexity = this.calculateComplexity(functionBody);

      functions.push({
        name,
        parameters: params,
        returnType,
        lineStart,
        lineEnd,
        complexity,
        isAsync,
        isExported,
      });
    }

    return functions;
  }

  private parseClasses(): ParsedClass[] {
    const classes: ParsedClass[] = [];
    const classPattern = /(export\s+)?(abstract\s+)?class\s+(\w+)(?:\s+extends\s+(\w+))?(?:\s+implements\s+([^{]+))?\s*\{/g;

    let match;
    while ((match = classPattern.exec(this.content)) !== null) {
      const isExported = !!match[1];
      const name = match[3];
      const extendsClass = match[4];
      const implementsInterfaces = match[5]
        ? match[5].split(',').map((i) => i.trim())
        : [];

      const lineStart = this.content.substring(0, match.index).split('\n').length;
      const classBody = this.extractClassBody(match.index + match[0].length);
      const lineEnd = lineStart + classBody.split('\n').length;

      const methods = this.parseClassMethods(classBody);
      const properties = this.parseClassProperties(classBody);

      classes.push({
        name,
        extends: extendsClass,
        implements: implementsInterfaces,
        methods,
        properties,
        lineStart,
        lineEnd,
        isExported,
      });
    }

    return classes;
  }

  private parseClassMethods(classBody: string): ParsedFunction[] {
    const methods: ParsedFunction[] = [];
    const methodPattern = /(public|private|protected)?\s*(async\s+)?(\w+)\s*\(([^)]*)\)(?:\s*:\s*([^{]+))?\s*\{/g;

    let match;
    while ((match = methodPattern.exec(classBody)) !== null) {
      const isAsync = !!match[2];
      const name = match[3];
      const params = match[4].split(',').map((p) => p.trim()).filter((p) => p);
      const returnType = match[5]?.trim();

      const lineStart = classBody.substring(0, match.index).split('\n').length;
      const methodBody = this.extractFunctionBody(match.index + match[0].length, classBody);
      const lineEnd = lineStart + methodBody.split('\n').length;
      const complexity = this.calculateComplexity(methodBody);

      methods.push({
        name,
        parameters: params,
        returnType,
        lineStart,
        lineEnd,
        complexity,
        isAsync,
        isExported: false,
      });
    }

    return methods;
  }

  private parseClassProperties(classBody: string): Array<{
    name: string;
    type?: string;
    visibility: 'public' | 'private' | 'protected';
  }> {
    const properties: Array<{
      name: string;
      type?: string;
      visibility: 'public' | 'private' | 'protected';
    }> = [];

    const propertyPattern = /(public|private|protected)?\s*(readonly\s+)?(\w+)(?:\s*:\s*([^;=\n]+))?(?:\s*=\s*[^;]+)?;/g;

    let match;
    while ((match = propertyPattern.exec(classBody)) !== null) {
      const visibility = (match[1] as any) || 'public';
      const name = match[3];
      const type = match[4]?.trim();

      properties.push({
        name,
        type,
        visibility,
      });
    }

    return properties;
  }

  private parseVariables(): Array<{
    name: string;
    type?: string;
    isConst: boolean;
    lineNumber: number;
  }> {
    const variables: Array<{
      name: string;
      type?: string;
      isConst: boolean;
      lineNumber: number;
    }> = [];

    const variablePattern = /(const|let|var)\s+(\w+)(?:\s*:\s*([^=\n]+))?/g;

    this.lines.forEach((line, index) => {
      let match;
      while ((match = variablePattern.exec(line)) !== null) {
        variables.push({
          name: match[2],
          type: match[3]?.trim(),
          isConst: match[1] === 'const',
          lineNumber: index + 1,
        });
      }
    });

    return variables;
  }

  private parseTypes(): Array<{ name: string; lineNumber: number }> {
    const types: Array<{ name: string; lineNumber: number }> = [];
    const typePattern = /type\s+(\w+)\s*=/g;

    this.lines.forEach((line, index) => {
      let match;
      while ((match = typePattern.exec(line)) !== null) {
        types.push({
          name: match[1],
          lineNumber: index + 1,
        });
      }
    });

    return types;
  }

  private parseInterfaces(): Array<{ name: string; lineNumber: number }> {
    const interfaces: Array<{ name: string; lineNumber: number }> = [];
    const interfacePattern = /interface\s+(\w+)/g;

    this.lines.forEach((line, index) => {
      let match;
      while ((match = interfacePattern.exec(line)) !== null) {
        interfaces.push({
          name: match[1],
          lineNumber: index + 1,
        });
      }
    });

    return interfaces;
  }

  private extractFunctionBody(startIndex: number, content: string = this.content): string {
    let braceCount = 1;
    let endIndex = startIndex;

    while (braceCount > 0 && endIndex < content.length) {
      if (content[endIndex] === '{') braceCount++;
      if (content[endIndex] === '}') braceCount--;
      endIndex++;
    }

    return content.substring(startIndex, endIndex);
  }

  private extractArrowFunctionBody(startIndex: number): string {
    if (this.content[startIndex] === '{') {
      return this.extractFunctionBody(startIndex + 1);
    }

    let endIndex = startIndex;
    let parenCount = 0;
    let braceCount = 0;

    while (endIndex < this.content.length) {
      const char = this.content[endIndex];

      if (char === '(') parenCount++;
      if (char === ')') parenCount--;
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;

      if (
        parenCount === 0 &&
        braceCount === 0 &&
        (char === ';' || char === '\n')
      ) {
        break;
      }

      endIndex++;
    }

    return this.content.substring(startIndex, endIndex);
  }

  private extractClassBody(startIndex: number): string {
    return this.extractFunctionBody(startIndex);
  }

  private calculateComplexity(code: string): number {
    let complexity = 1;

    const complexityPatterns = [
      /\bif\b/g,
      /\belse\s+if\b/g,
      /\belse\b/g,
      /\bfor\b/g,
      /\bwhile\b/g,
      /\bdo\b/g,
      /\bswitch\b/g,
      /\bcase\b/g,
      /\bcatch\b/g,
      /\?\s*:/g,
      /&&/g,
      /\|\|/g,
    ];

    complexityPatterns.forEach((pattern) => {
      const matches = code.match(pattern);
      if (matches) {
        complexity += matches.length;
      }
    });

    return complexity;
  }

  static detectLanguage(filename: string): string {
    const extension = filename.split('.').pop()?.toLowerCase();
    const languageMap: Record<string, string> = {
      ts: 'typescript',
      tsx: 'typescript',
      js: 'javascript',
      jsx: 'javascript',
      py: 'python',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      cs: 'csharp',
      go: 'go',
      rs: 'rust',
      rb: 'ruby',
      php: 'php',
    };

    return languageMap[extension || ''] || 'unknown';
  }

  getDependencyGraph(): Map<string, string[]> {
    const graph = new Map<string, string[]>();
    const imports = this.parseImports();

    imports.forEach((importStatement) => {
      const dependencies = importStatement.imports.map((imp) => imp.name);
      graph.set(importStatement.source, dependencies);
    });

    return graph;
  }

  getExportedSymbols(): string[] {
    const exports = this.parseExports();
    return exports.map((exp) => exp.name);
  }

  getImportedSymbols(): string[] {
    const imports = this.parseImports();
    const symbols: string[] = [];

    imports.forEach((importStatement) => {
      importStatement.imports.forEach((imp) => {
        symbols.push(imp.alias || imp.name);
      });
    });

    return symbols;
  }

  findUnusedImports(): string[] {
    const imported = this.getImportedSymbols();
    const contentWithoutImports = this.content.replace(/import\s+.*from\s+['"].*['"]/g, '');

    return imported.filter((symbol) => {
      const pattern = new RegExp(`\\b${symbol}\\b`, 'g');
      const matches = contentWithoutImports.match(pattern);
      return !matches || matches.length === 0;
    });
  }

  findUnusedExports(): string[] {
    const exports = this.parseExports();
    const contentWithoutExports = this.content.replace(/export\s+/g, '');

    return exports
      .filter((exp) => {
        if (exp.isDefault) return false;

        const pattern = new RegExp(`\\b${exp.name}\\b`, 'g');
        const matches = contentWithoutExports.match(pattern);
        return !matches || matches.length <= 1;
      })
      .map((exp) => exp.name);
  }

  getComplexityReport(): {
    average: number;
    max: number;
    functions: Array<{ name: string; complexity: number }>;
  } {
    const functions = this.parseFunctions();
    const complexities = functions.map((f) => f.complexity);

    if (complexities.length === 0) {
      return { average: 0, max: 0, functions: [] };
    }

    const average =
      complexities.reduce((sum, c) => sum + c, 0) / complexities.length;
    const max = Math.max(...complexities);

    const complexFunctions = functions
      .map((f) => ({ name: f.name, complexity: f.complexity }))
      .sort((a, b) => b.complexity - a.complexity)
      .slice(0, 10);

    return {
      average,
      max,
      functions: complexFunctions,
    };
  }

  getCodeMetrics(): {
    totalLines: number;
    codeLines: number;
    commentLines: number;
    blankLines: number;
    functions: number;
    classes: number;
    complexity: number;
  } {
    let codeLines = 0;
    let commentLines = 0;
    let blankLines = 0;
    let inMultilineComment = false;

    this.lines.forEach((line) => {
      const trimmed = line.trim();

      if (trimmed === '') {
        blankLines++;
        return;
      }

      if (trimmed.startsWith('/*') || trimmed.startsWith('/**')) {
        inMultilineComment = true;
        commentLines++;
        if (trimmed.endsWith('*/')) {
          inMultilineComment = false;
        }
        return;
      }

      if (inMultilineComment) {
        commentLines++;
        if (trimmed.endsWith('*/')) {
          inMultilineComment = false;
        }
        return;
      }

      if (trimmed.startsWith('//')) {
        commentLines++;
        return;
      }

      codeLines++;
    });

    const functions = this.parseFunctions();
    const classes = this.parseClasses();
    const complexityReport = this.getComplexityReport();

    return {
      totalLines: this.lines.length,
      codeLines,
      commentLines,
      blankLines,
      functions: functions.length,
      classes: classes.length,
      complexity: Math.round(complexityReport.average),
    };
  }
}

export default CodeParser;
