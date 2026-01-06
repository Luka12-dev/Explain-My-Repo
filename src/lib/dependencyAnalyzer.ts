import type {
  DependencyAnalysis,
  OutdatedDependency,
  Vulnerability,
  LicenseInfo,
  DependencyNode,
} from '@/types';

export interface PackageJson {
  name?: string;
  version?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
}

export class DependencyAnalyzer {
  private packageJson: PackageJson;
  private lockFile?: any;

  constructor(packageJson: PackageJson, lockFile?: any) {
    this.packageJson = packageJson;
    this.lockFile = lockFile;
  }

  async analyze(): Promise<DependencyAnalysis> {
    const dependencies = this.getAllDependencies();
    const directDeps = Object.keys(this.packageJson.dependencies || {});
    const devDeps = Object.keys(this.packageJson.devDependencies || {});

    return {
      total: dependencies.length,
      direct: directDeps.length,
      dev: devDeps.length,
      outdated: await this.findOutdatedDependencies(),
      vulnerabilities: await this.scanVulnerabilities(),
      licenses: this.analyzeLicenses(),
      dependencyGraph: this.buildDependencyGraph(),
    };
  }

  private getAllDependencies(): Array<{ name: string; version: string }> {
    const allDeps: Array<{ name: string; version: string }> = [];
    const deps = {
      ...this.packageJson.dependencies,
      ...this.packageJson.devDependencies,
      ...this.packageJson.peerDependencies,
      ...this.packageJson.optionalDependencies,
    };

    Object.entries(deps).forEach(([name, version]) => {
      allDeps.push({ name, version });
    });

    return allDeps;
  }

  private async findOutdatedDependencies(): Promise<OutdatedDependency[]> {
    const outdated: OutdatedDependency[] = [];
    const dependencies = this.getAllDependencies();

    for (const dep of dependencies) {
      const latestVersion = await this.getLatestVersion(dep.name);
      if (latestVersion && this.isOutdated(dep.version, latestVersion)) {
        outdated.push({
          name: dep.name,
          current: dep.version,
          latest: latestVersion,
          type: this.getDependencyType(dep.name),
        });
      }
    }

    return outdated;
  }

  private async getLatestVersion(packageName: string): Promise<string | null> {
    try {
      const response = await fetch(`https://registry.npmjs.org/${packageName}/latest`);
      if (response.ok) {
        const data = await response.json();
        return data.version;
      }
    } catch (error) {
      console.error(`Failed to fetch latest version for ${packageName}:`, error);
    }
    return null;
  }

  private isOutdated(current: string, latest: string): boolean {
    const cleanCurrent = current.replace(/^[^0-9]*/, '');
    const cleanLatest = latest.replace(/^[^0-9]*/, '');

    const currentParts = cleanCurrent.split('.').map(Number);
    const latestParts = cleanLatest.split('.').map(Number);

    for (let i = 0; i < Math.max(currentParts.length, latestParts.length); i++) {
      const curr = currentParts[i] || 0;
      const lat = latestParts[i] || 0;

      if (lat > curr) return true;
      if (lat < curr) return false;
    }

    return false;
  }

  private getDependencyType(packageName: string): 'dependency' | 'devDependency' {
    if (this.packageJson.dependencies && packageName in this.packageJson.dependencies) {
      return 'dependency';
    }
    return 'devDependency';
  }

  private async scanVulnerabilities(): Promise<Vulnerability[]> {
    const vulnerabilities: Vulnerability[] = [];
    const dependencies = this.getAllDependencies();

    const knownVulnerabilities = [
      {
        package: 'lodash',
        versions: ['<4.17.21'],
        severity: 'high' as const,
        title: 'Prototype Pollution',
        description: 'Vulnerable to prototype pollution attacks',
        patched: '4.17.21',
      },
      {
        package: 'axios',
        versions: ['<0.21.1'],
        severity: 'moderate' as const,
        title: 'Server-Side Request Forgery',
        description: 'SSRF vulnerability in axios',
        patched: '0.21.1',
      },
      {
        package: 'minimist',
        versions: ['<1.2.6'],
        severity: 'critical' as const,
        title: 'Prototype Pollution',
        description: 'Critical prototype pollution vulnerability',
        patched: '1.2.6',
      },
    ];

    dependencies.forEach((dep) => {
      knownVulnerabilities.forEach((vuln) => {
        if (dep.name === vuln.package && this.matchesVersionRange(dep.version, vuln.versions)) {
          vulnerabilities.push({
            id: `${vuln.package}-${Date.now()}`,
            severity: vuln.severity,
            package: vuln.package,
            title: vuln.title,
            description: vuln.description,
            vulnerable: dep.version,
            patched: vuln.patched,
          });
        }
      });
    });

    return vulnerabilities;
  }

  private matchesVersionRange(version: string, ranges: string[]): boolean {
    const cleanVersion = version.replace(/^[^0-9]*/, '');
    return ranges.some((range) => {
      if (range.startsWith('<')) {
        const rangeVersion = range.substring(1);
        return this.isOutdated(cleanVersion, rangeVersion);
      }
      return false;
    });
  }

  private analyzeLicenses(): LicenseInfo[] {
    const licenses = new Map<string, string[]>();

    const dependencies = this.getAllDependencies();
    const commonLicenses = [
      { name: 'MIT', packages: ['react', 'typescript', 'next', 'axios'] },
      { name: 'Apache-2.0', packages: ['express', 'typescript'] },
      { name: 'BSD-3-Clause', packages: [] },
      { name: 'ISC', packages: [] },
    ];

    dependencies.forEach((dep) => {
      const license = this.guesLicense(dep.name);
      const existing = licenses.get(license) || [];
      existing.push(dep.name);
      licenses.set(license, existing);
    });

    return Array.from(licenses.entries()).map(([name, packages]) => ({
      name,
      packages,
      count: packages.length,
      compatible: this.isLicenseCompatible(name),
    }));
  }

  private guesLicense(packageName: string): string {
    const mitPackages = ['react', 'typescript', 'next', 'axios', 'lodash', 'express'];
    if (mitPackages.some((p) => packageName.includes(p))) {
      return 'MIT';
    }
    return 'Unknown';
  }

  private isLicenseCompatible(license: string): boolean {
    const compatibleLicenses = ['MIT', 'Apache-2.0', 'BSD-3-Clause', 'ISC'];
    return compatibleLicenses.includes(license);
  }

  private buildDependencyGraph(): DependencyNode[] {
    const graph: DependencyNode[] = [];
    const dependencies = this.getAllDependencies();

    dependencies.forEach((dep) => {
      graph.push({
        name: dep.name,
        version: dep.version,
        dependencies: [],
        depth: 1,
      });
    });

    return graph;
  }

  calculateDependencyRisk(): {
    overallRisk: 'low' | 'medium' | 'high';
    factors: Array<{ name: string; risk: string; description: string }>;
  } {
    const factors: Array<{ name: string; risk: string; description: string }> = [];
    let riskScore = 0;

    const totalDeps = this.getAllDependencies().length;
    if (totalDeps > 100) {
      factors.push({
        name: 'High Dependency Count',
        risk: 'high',
        description: `Project has ${totalDeps} dependencies, increasing attack surface`,
      });
      riskScore += 3;
    } else if (totalDeps > 50) {
      factors.push({
        name: 'Moderate Dependency Count',
        risk: 'medium',
        description: `Project has ${totalDeps} dependencies`,
      });
      riskScore += 2;
    }

    const directDeps = Object.keys(this.packageJson.dependencies || {}).length;
    if (directDeps > 30) {
      factors.push({
        name: 'Many Direct Dependencies',
        risk: 'medium',
        description: `${directDeps} direct dependencies may complicate maintenance`,
      });
      riskScore += 1;
    }

    return {
      overallRisk: riskScore >= 4 ? 'high' : riskScore >= 2 ? 'medium' : 'low',
      factors,
    };
  }

  findCircularDependencies(): string[][] {
    const circular: string[][] = [];
    return circular;
  }

  getDependencySize(): Promise<Map<string, number>> {
    return Promise.resolve(new Map());
  }

  analyzeBundleImpact(): {
    heaviest: Array<{ name: string; size: number }>;
    total: number;
  } {
    return {
      heaviest: [],
      total: 0,
    };
  }
}

export default DependencyAnalyzer;
