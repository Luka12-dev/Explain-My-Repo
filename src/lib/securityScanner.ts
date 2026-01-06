import type { SecurityAnalysis, SecretDetection, Vulnerability } from '@/types';

export interface SecurityScanOptions {
  scanSecrets: boolean;
  scanDependencies: boolean;
  scanPermissions: boolean;
  scanCode: boolean;
}

export class SecurityScanner {
  private files: Array<{ path: string; content: string }>;
  private options: SecurityScanOptions;

  constructor(files: Array<{ path: string; content: string }>, options?: Partial<SecurityScanOptions>) {
    this.files = files;
    this.options = {
      scanSecrets: true,
      scanDependencies: true,
      scanPermissions: true,
      scanCode: true,
      ...options,
    };
  }

  async scan(): Promise<SecurityAnalysis> {
    const secrets = this.options.scanSecrets ? await this.scanForSecrets() : [];
    const vulnerabilities = this.options.scanDependencies ? await this.scanDependencies() : [];
    const permissions = this.options.scanPermissions ? await this.scanPermissions() : [];

    const scoreBreakdown = {
      vulnerabilities: this.calculateVulnerabilityScore(vulnerabilities),
      secrets: this.calculateSecretScore(secrets),
      permissions: this.calculatePermissionScore(permissions),
      dependencies: this.calculateDependencyScore(vulnerabilities),
    };

    const overallScore =
      (scoreBreakdown.vulnerabilities +
        scoreBreakdown.secrets +
        scoreBreakdown.permissions +
        scoreBreakdown.dependencies) /
      4;

    return {
      overallRating: this.getRating(overallScore),
      vulnerabilities,
      secrets,
      permissions,
      dependencies: [],
      scoreBreakdown,
    };
  }

  private async scanForSecrets(): Promise<SecretDetection[]> {
    const secrets: SecretDetection[] = [];

    const secretPatterns = [
      {
        name: 'AWS Access Key',
        pattern: /AKIA[0-9A-Z]{16}/gi,
        severity: 'critical' as const,
        description: 'AWS access key detected',
      },
      {
        name: 'AWS Secret Key',
        pattern: /aws_secret_access_key\s*=\s*['"][^'"]{40}['"]/gi,
        severity: 'critical' as const,
        description: 'AWS secret access key detected',
      },
      {
        name: 'Generic API Key',
        pattern: /api[_-]?key\s*[:=]\s*['"][a-zA-Z0-9_\-]{20,}['"]/gi,
        severity: 'high' as const,
        description: 'Generic API key detected',
      },
      {
        name: 'Generic Secret',
        pattern: /secret\s*[:=]\s*['"][a-zA-Z0-9_\-]{20,}['"]/gi,
        severity: 'high' as const,
        description: 'Generic secret detected',
      },
      {
        name: 'Private Key',
        pattern: /-----BEGIN\s+(?:RSA\s+)?PRIVATE\s+KEY-----/gi,
        severity: 'critical' as const,
        description: 'Private key detected',
      },
      {
        name: 'GitHub Token',
        pattern: /gh[ps]_[a-zA-Z0-9]{36,}/gi,
        severity: 'critical' as const,
        description: 'GitHub personal access token detected',
      },
      {
        name: 'GitHub OAuth Token',
        pattern: /gho_[a-zA-Z0-9]{36,}/gi,
        severity: 'critical' as const,
        description: 'GitHub OAuth token detected',
      },
      {
        name: 'JWT Token',
        pattern: /eyJ[a-zA-Z0-9_-]*\.eyJ[a-zA-Z0-9_-]*\.[a-zA-Z0-9_-]*/gi,
        severity: 'high' as const,
        description: 'JWT token detected',
      },
      {
        name: 'Slack Token',
        pattern: /xox[baprs]-[0-9a-zA-Z]{10,48}/gi,
        severity: 'high' as const,
        description: 'Slack token detected',
      },
      {
        name: 'Google API Key',
        pattern: /AIza[0-9A-Za-z_-]{35}/gi,
        severity: 'high' as const,
        description: 'Google API key detected',
      },
      {
        name: 'Stripe API Key',
        pattern: /sk_live_[0-9a-zA-Z]{24,}/gi,
        severity: 'critical' as const,
        description: 'Stripe live API key detected',
      },
      {
        name: 'Password in Code',
        pattern: /password\s*[:=]\s*['"][^'"]{6,}['"]/gi,
        severity: 'medium' as const,
        description: 'Hardcoded password detected',
      },
      {
        name: 'Database Connection String',
        pattern: /(?:mongodb|mysql|postgresql):\/\/[^'"]+/gi,
        severity: 'high' as const,
        description: 'Database connection string detected',
      },
    ];

    this.files.forEach((file) => {
      const lines = file.content.split('\n');

      lines.forEach((line, lineIndex) => {
        secretPatterns.forEach((pattern) => {
          if (pattern.pattern.test(line)) {
            secrets.push({
              type: pattern.name,
              file: file.path,
              line: lineIndex + 1,
              severity: pattern.severity,
              description: pattern.description,
            });
          }
        });
      });
    });

    return secrets;
  }

  private async scanDependencies(): Promise<Vulnerability[]> {
    const vulnerabilities: Vulnerability[] = [];

    const knownVulnerabilities = [
      {
        package: 'lodash',
        pattern: /"lodash":\s*"[^"]*[0-3]\./,
        severity: 'high' as const,
        title: 'Prototype Pollution in lodash',
        description: 'Versions before 4.17.21 are vulnerable to prototype pollution',
        vulnerable: '<4.17.21',
        patched: '4.17.21',
      },
      {
        package: 'axios',
        pattern: /"axios":\s*"0\.[0-1][0-9]\./,
        severity: 'moderate' as const,
        title: 'SSRF in axios',
        description: 'Server-Side Request Forgery vulnerability',
        vulnerable: '<0.21.1',
        patched: '0.21.1',
      },
      {
        package: 'minimist',
        pattern: /"minimist":\s*"[01]\.[01]\./,
        severity: 'critical' as const,
        title: 'Prototype Pollution in minimist',
        description: 'Critical prototype pollution vulnerability',
        vulnerable: '<1.2.6',
        patched: '1.2.6',
      },
    ];

    const packageJsonFiles = this.files.filter((f) => f.path.endsWith('package.json'));

    packageJsonFiles.forEach((file) => {
      knownVulnerabilities.forEach((vuln) => {
        if (new RegExp(vuln.pattern).test(file.content)) {
          vulnerabilities.push({
            id: `${vuln.package}-${Date.now()}`,
            severity: vuln.severity,
            package: vuln.package,
            title: vuln.title,
            description: vuln.description,
            vulnerable: vuln.vulnerable,
            patched: vuln.patched,
          });
        }
      });
    });

    return vulnerabilities;
  }

  private async scanPermissions(): Promise<
    Array<{ file: string; permissions: string; risk: 'low' | 'medium' | 'high'; recommendation: string }>
  > {
    const permissions: Array<{
      file: string;
      permissions: string;
      risk: 'low' | 'medium' | 'high';
      recommendation: string;
    }> = [];

    this.files.forEach((file) => {
      if (file.content.includes('chmod 777') || file.content.includes('chmod 0777')) {
        permissions.push({
          file: file.path,
          permissions: '777',
          risk: 'high',
          recommendation: 'Use more restrictive permissions like 644 or 755',
        });
      }

      if (file.content.includes('eval(') && file.path.endsWith('.js')) {
        permissions.push({
          file: file.path,
          permissions: 'eval',
          risk: 'high',
          recommendation: 'Avoid using eval() as it can execute arbitrary code',
        });
      }
    });

    return permissions;
  }

  private calculateVulnerabilityScore(vulnerabilities: Vulnerability[]): number {
    if (vulnerabilities.length === 0) return 100;

    let deduction = 0;
    vulnerabilities.forEach((vuln) => {
      switch (vuln.severity) {
        case 'critical':
          deduction += 20;
          break;
        case 'high':
          deduction += 15;
          break;
        case 'moderate':
          deduction += 10;
          break;
        case 'low':
          deduction += 5;
          break;
      }
    });

    return Math.max(0, 100 - deduction);
  }

  private calculateSecretScore(secrets: SecretDetection[]): number {
    if (secrets.length === 0) return 100;

    let deduction = 0;
    secrets.forEach((secret) => {
      switch (secret.severity) {
        case 'critical':
          deduction += 25;
          break;
        case 'high':
          deduction += 20;
          break;
        case 'medium':
          deduction += 10;
          break;
        case 'low':
          deduction += 5;
          break;
      }
    });

    return Math.max(0, 100 - deduction);
  }

  private calculatePermissionScore(
    permissions: Array<{ risk: 'low' | 'medium' | 'high' }>
  ): number {
    if (permissions.length === 0) return 100;

    let deduction = 0;
    permissions.forEach((perm) => {
      switch (perm.risk) {
        case 'high':
          deduction += 15;
          break;
        case 'medium':
          deduction += 10;
          break;
        case 'low':
          deduction += 5;
          break;
      }
    });

    return Math.max(0, 100 - deduction);
  }

  private calculateDependencyScore(vulnerabilities: Vulnerability[]): number {
    return this.calculateVulnerabilityScore(vulnerabilities);
  }

  private getRating(
    score: number
  ): 'excellent' | 'good' | 'fair' | 'poor' | 'critical' {
    if (score >= 90) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'fair';
    if (score >= 30) return 'poor';
    return 'critical';
  }

  scanForInsecurePatterns(): Array<{
    file: string;
    line: number;
    pattern: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
  }> {
    const issues: Array<{
      file: string;
      line: number;
      pattern: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      description: string;
    }> = [];

    const insecurePatterns = [
      {
        pattern: /eval\(/gi,
        severity: 'high' as const,
        description: 'Use of eval() can lead to code injection vulnerabilities',
      },
      {
        pattern: /innerHTML\s*=/gi,
        severity: 'medium' as const,
        description: 'Direct innerHTML assignment can lead to XSS vulnerabilities',
      },
      {
        pattern: /dangerouslySetInnerHTML/gi,
        severity: 'medium' as const,
        description: 'dangerouslySetInnerHTML can expose XSS vulnerabilities if not properly sanitized',
      },
      {
        pattern: /document\.write\(/gi,
        severity: 'high' as const,
        description: 'document.write() can lead to security issues and poor performance',
      },
    ];

    this.files.forEach((file) => {
      const lines = file.content.split('\n');

      lines.forEach((line, lineIndex) => {
        insecurePatterns.forEach((pattern) => {
          if (pattern.pattern.test(line)) {
            issues.push({
              file: file.path,
              line: lineIndex + 1,
              pattern: pattern.pattern.source,
              severity: pattern.severity,
              description: pattern.description,
            });
          }
        });
      });
    });

    return issues;
  }
}

export default SecurityScanner;
