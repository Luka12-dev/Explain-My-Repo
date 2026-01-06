import { Octokit } from 'octokit';
import type { Repository, GitHubRateLimit } from '@/types';

export class GitHubService {
  private octokit: Octokit;
  private token?: string;

  constructor(token?: string) {
    this.token = token;
    this.octokit = new Octokit({
      auth: token,
      userAgent: 'ExplainMyRepo/2.0',
    });
  }

  async getRepository(owner: string, repo: string): Promise<Repository> {
    try {
      const { data } = await this.octokit.rest.repos.get({
        owner,
        repo,
      });

      return {
        id: data.id.toString(),
        name: data.name,
        fullName: data.full_name,
        owner: data.owner.login,
        description: data.description || '',
        url: data.html_url,
        stars: data.stargazers_count,
        forks: data.forks_count,
        language: data.language || 'Unknown',
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        size: data.size,
        openIssues: data.open_issues_count,
        topics: data.topics || [],
        license: data.license?.name || null,
        defaultBranch: data.default_branch,
        isPrivate: data.private,
        hasWiki: data.has_wiki,
        hasIssues: data.has_issues,
        hasProjects: data.has_projects,
        hasDownloads: data.has_downloads,
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch repository: ${error.message}`);
    }
  }

  async getRepositoryContents(owner: string, repo: string, path: string = ''): Promise<any[]> {
    try {
      const { data } = await this.octokit.rest.repos.getContent({
        owner,
        repo,
        path,
      });

      return Array.isArray(data) ? data : [data];
    } catch (error: any) {
      throw new Error(`Failed to fetch repository contents: ${error.message}`);
    }
  }

  async getFileContent(owner: string, repo: string, path: string): Promise<string> {
    try {
      const { data } = await this.octokit.rest.repos.getContent({
        owner,
        repo,
        path,
      });

      if ('content' in data && data.content) {
        return Buffer.from(data.content, 'base64').toString('utf-8');
      }

      throw new Error('File content not available');
    } catch (error: any) {
      throw new Error(`Failed to fetch file content: ${error.message}`);
    }
  }

  async getRepositoryTree(owner: string, repo: string, branch: string = 'main'): Promise<any> {
    try {
      const { data } = await this.octokit.rest.git.getTree({
        owner,
        repo,
        tree_sha: branch,
        recursive: 'true',
      });

      return data;
    } catch (error: any) {
      try {
        const { data } = await this.octokit.rest.git.getTree({
          owner,
          repo,
          tree_sha: 'master',
          recursive: 'true',
        });
        return data;
      } catch (retryError: any) {
        throw new Error(`Failed to fetch repository tree: ${error.message}`);
      }
    }
  }

  async getCommits(owner: string, repo: string, perPage: number = 100): Promise<any[]> {
    try {
      const { data } = await this.octokit.rest.repos.listCommits({
        owner,
        repo,
        per_page: perPage,
      });

      return data;
    } catch (error: any) {
      throw new Error(`Failed to fetch commits: ${error.message}`);
    }
  }

  async getContributors(owner: string, repo: string): Promise<any[]> {
    try {
      const { data } = await this.octokit.rest.repos.listContributors({
        owner,
        repo,
        per_page: 100,
      });

      return data;
    } catch (error: any) {
      throw new Error(`Failed to fetch contributors: ${error.message}`);
    }
  }

  async getIssues(owner: string, repo: string, state: 'open' | 'closed' | 'all' = 'all'): Promise<any[]> {
    try {
      const { data } = await this.octokit.rest.issues.listForRepo({
        owner,
        repo,
        state,
        per_page: 100,
      });

      return data;
    } catch (error: any) {
      throw new Error(`Failed to fetch issues: ${error.message}`);
    }
  }

  async getPullRequests(owner: string, repo: string, state: 'open' | 'closed' | 'all' = 'all'): Promise<any[]> {
    try {
      const { data } = await this.octokit.rest.pulls.list({
        owner,
        repo,
        state,
        per_page: 100,
      });

      return data;
    } catch (error: any) {
      throw new Error(`Failed to fetch pull requests: ${error.message}`);
    }
  }

  async getLanguages(owner: string, repo: string): Promise<Record<string, number>> {
    try {
      const { data } = await this.octokit.rest.repos.listLanguages({
        owner,
        repo,
      });

      return data;
    } catch (error: any) {
      throw new Error(`Failed to fetch languages: ${error.message}`);
    }
  }

  async getRateLimit(): Promise<GitHubRateLimit> {
    try {
      const { data } = await this.octokit.rest.rateLimit.get();

      return {
        limit: data.rate.limit,
        remaining: data.rate.remaining,
        reset: data.rate.reset,
        used: data.rate.used,
      };
    } catch (error: any) {
      throw new Error(`Failed to fetch rate limit: ${error.message}`);
    }
  }

  async searchCode(owner: string, repo: string, query: string): Promise<any[]> {
    try {
      const { data } = await this.octokit.rest.search.code({
        q: `${query} repo:${owner}/${repo}`,
        per_page: 50,
      });

      return data.items;
    } catch (error: any) {
      throw new Error(`Failed to search code: ${error.message}`);
    }
  }

  async searchIssues(owner: string, repo: string, query: string): Promise<any[]> {
    try {
      const { data } = await this.octokit.rest.search.issuesAndPullRequests({
        q: `${query} repo:${owner}/${repo}`,
        per_page: 50,
      });

      return data.items;
    } catch (error: any) {
      throw new Error(`Failed to search issues: ${error.message}`);
    }
  }

  parseRepoUrl(url: string): { owner: string; repo: string } | null {
    const patterns = [
      /github\.com\/([^\/]+)\/([^\/]+)/,
      /^([^\/]+)\/([^\/]+)$/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return {
          owner: match[1],
          repo: match[2].replace(/\.git$/, ''),
        };
      }
    }

    return null;
  }
}

export const githubService = new GitHubService();
