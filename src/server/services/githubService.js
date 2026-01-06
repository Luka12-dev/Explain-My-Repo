const { Octokit } = require('octokit');

class GitHubService {
  constructor(token) {
    this.octokit = new Octokit({
      auth: token,
      userAgent: 'ExplainMyRepo/2.0',
    });
  }

  async getRepository(owner, repo) {
    try {
      const { data } = await this.octokit.rest.repos.get({ owner, repo });
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
    } catch (error) {
      throw new Error(`Failed to fetch repository: ${error.message}`);
    }
  }

  async getRepositoryContents(owner, repo, path = '') {
    try {
      const { data } = await this.octokit.rest.repos.getContent({ owner, repo, path });
      return Array.isArray(data) ? data : [data];
    } catch (error) {
      throw new Error(`Failed to fetch repository contents: ${error.message}`);
    }
  }

  async getFileContent(owner, repo, path) {
    try {
      const { data } = await this.octokit.rest.repos.getContent({ owner, repo, path });
      if ('content' in data && data.content) {
        return Buffer.from(data.content, 'base64').toString('utf-8');
      }
      throw new Error('File content not available');
    } catch (error) {
      throw new Error(`Failed to fetch file content: ${error.message}`);
    }
  }

  async getRepositoryTree(owner, repo, branch = 'main') {
    try {
      const { data } = await this.octokit.rest.git.getTree({
        owner,
        repo,
        tree_sha: branch,
        recursive: 'true',
      });
      return data;
    } catch (error) {
      try {
        const { data } = await this.octokit.rest.git.getTree({
          owner,
          repo,
          tree_sha: 'master',
          recursive: 'true',
        });
        return data;
      } catch (retryError) {
        throw new Error(`Failed to fetch repository tree: ${error.message}`);
      }
    }
  }

  async getCommits(owner, repo, perPage = 100) {
    try {
      const { data } = await this.octokit.rest.repos.listCommits({
        owner,
        repo,
        per_page: perPage,
      });
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch commits: ${error.message}`);
    }
  }

  async getContributors(owner, repo) {
    try {
      const { data } = await this.octokit.rest.repos.listContributors({
        owner,
        repo,
        per_page: 100,
      });
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch contributors: ${error.message}`);
    }
  }

  async getIssues(owner, repo, state = 'all') {
    try {
      const { data } = await this.octokit.rest.issues.listForRepo({
        owner,
        repo,
        state,
        per_page: 100,
      });
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch issues: ${error.message}`);
    }
  }

  async getPullRequests(owner, repo, state = 'all') {
    try {
      const { data } = await this.octokit.rest.pulls.list({
        owner,
        repo,
        state,
        per_page: 100,
      });
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch pull requests: ${error.message}`);
    }
  }

  async getLanguages(owner, repo) {
    try {
      const { data } = await this.octokit.rest.repos.listLanguages({ owner, repo });
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch languages: ${error.message}`);
    }
  }

  async getRateLimit() {
    try {
      const { data } = await this.octokit.rest.rateLimit.get();
      return {
        limit: data.rate.limit,
        remaining: data.rate.remaining,
        reset: data.rate.reset,
        used: data.rate.used,
      };
    } catch (error) {
      throw new Error(`Failed to fetch rate limit: ${error.message}`);
    }
  }

  async searchCode(owner, repo, query) {
    try {
      const { data } = await this.octokit.rest.search.code({
        q: `${query} repo:${owner}/${repo}`,
        per_page: 50,
      });
      return data.items;
    } catch (error) {
      throw new Error(`Failed to search code: ${error.message}`);
    }
  }

  async searchIssues(owner, repo, query) {
    try {
      const { data } = await this.octokit.rest.search.issuesAndPullRequests({
        q: `${query} repo:${owner}/${repo}`,
        per_page: 50,
      });
      return data.items;
    } catch (error) {
      throw new Error(`Failed to search issues: ${error.message}`);
    }
  }

  parseRepoUrl(url) {
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

  async getRepositoryReadme(owner, repo) {
    try {
      const { data } = await this.octokit.rest.repos.getReadme({ owner, repo });
      if (data.content) {
        return Buffer.from(data.content, 'base64').toString('utf-8');
      }
      return null;
    } catch (error) {
      return null;
    }
  }

  async getBranches(owner, repo) {
    try {
      const { data } = await this.octokit.rest.repos.listBranches({
        owner,
        repo,
        per_page: 100,
      });
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch branches: ${error.message}`);
    }
  }

  async getTags(owner, repo) {
    try {
      const { data } = await this.octokit.rest.repos.listTags({
        owner,
        repo,
        per_page: 100,
      });
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch tags: ${error.message}`);
    }
  }

  async getReleas(owner, repo) {
    try {
      const { data } = await this.octokit.rest.repos.listReleases({
        owner,
        repo,
        per_page: 100,
      });
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch releases: ${error.message}`);
    }
  }

  async getCommitActivity(owner, repo) {
    try {
      const { data } = await this.octokit.rest.repos.getCommitActivityStats({
        owner,
        repo,
      });
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch commit activity: ${error.message}`);
    }
  }

  async getCodeFrequency(owner, repo) {
    try {
      const { data } = await this.octokit.rest.repos.getCodeFrequencyStats({
        owner,
        repo,
      });
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch code frequency: ${error.message}`);
    }
  }

  async getParticipation(owner, repo) {
    try {
      const { data } = await this.octokit.rest.repos.getParticipationStats({
        owner,
        repo,
      });
      return data;
    } catch (error) {
      throw new Error(`Failed to fetch participation stats: ${error.message}`);
    }
  }
}

module.exports = GitHubService;
