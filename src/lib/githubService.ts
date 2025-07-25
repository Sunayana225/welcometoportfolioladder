import { GoogleGenerativeAI } from '@google/generative-ai';
import { createAIService } from './aiService';

// GitHub API configuration
const GITHUB_API_BASE = 'https://api.github.com';

// GitHub API headers (no authentication needed for public repos)
const getGitHubHeaders = () => ({
  'Accept': 'application/vnd.github.v3+json',
  'User-Agent': 'Portfolio-Maker'
});

// Types for GitHub API responses
export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  clone_url: string;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  size: number;
  default_branch: string;
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string | null;
  company: string | null;
  blog: string | null;
  location: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
}

export interface RepoAnalysis {
  repo: GitHubRepo;
  readme: string | null;
  languages: Record<string, number>;
  commits: number;
  contributors: number;
}

export interface ProjectSuggestion {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  imageUrl?: string;
  featured: boolean;
}

function isApiKeyFormatValid(apiKey: string): boolean {
  return /^AIza[0-9A-Za-z-_]{30,}$/.test(apiKey);
}

// Validate Gemini API key using models endpoint (simpler and more reliable)
export async function validateGeminiApiKey(apiKey: string): Promise<{ valid: boolean; error?: string; models?: string[] }> {
  try {
    if (!apiKey || apiKey.trim().length === 0) {
      return { valid: false, error: 'API key is required' };
    }

    if (!isApiKeyFormatValid(apiKey)) {
      return { valid: false, error: 'API key format is invalid. Keys should start with "AIza"' };
    }

    // Test the API key by listing available models
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      const models = data.models?.map((model: any) => model.name) || [];
      return { valid: true, models };
    } else if (response.status === 400) {
      return { valid: false, error: 'API key format is invalid' };
    } else if (response.status === 403) {
      return { valid: false, error: 'API key is invalid or lacks permissions' };
    } else if (response.status === 404) {
      return { valid: false, error: 'API validation failed (404). Please verify your API key.' };
    } else if (response.status === 429) {
      return { valid: false, error: 'Too many requests. Please try again later.' };
    } else {
      return { valid: false, error: `API validation failed with status ${response.status}` };
    }
  } catch (error) {
    console.error('API key validation error:', error);
    return { valid: false, error: 'Network error. Please check your internet connection.' };
  }
}

// Fetch user repositories
export async function fetchUserRepositories(username: string): Promise<GitHubRepo[]> {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/users/${username}/repos?sort=updated&per_page=100`, {
      headers: getGitHubHeaders()
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const repos: GitHubRepo[] = await response.json();
    return repos.filter(repo => !repo.name.includes('.github.io') && repo.size > 0);
  } catch (error) {
    console.error('Error fetching repositories:', error);
    throw error;
  }
}

// Fetch repository README
export async function fetchRepositoryReadme(owner: string, repo: string): Promise<string | null> {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/readme`, {
      headers: getGitHubHeaders()
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return atob(data.content.replace(/\s/g, ''));
  } catch (error) {
    console.error('Error fetching README:', error);
    return null;
  }
}

// Fetch repository languages
export async function fetchRepositoryLanguages(owner: string, repo: string): Promise<Record<string, number>> {
  try {
    const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/languages`, {
      headers: getGitHubHeaders()
    });

    if (!response.ok) {
      return {};
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching languages:', error);
    return {};
  }
}

// Analyze a single repository
export async function analyzeGitHubRepository(owner: string, repo: string): Promise<RepoAnalysis> {
  try {
    const [repoData, readme, languages] = await Promise.all([
      fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}`, { headers: getGitHubHeaders() }).then(r => r.json()),
      fetchRepositoryReadme(owner, repo),
      fetchRepositoryLanguages(owner, repo)
    ]);

    return {
      repo: repoData,
      readme,
      languages,
      commits: 0, // Would need additional API call
      contributors: 0 // Would need additional API call
    };
  } catch (error) {
    console.error('Error analyzing repository:', error);
    throw error;
  }
}

// Analyze user repositories and suggest projects
export async function analyzeUserRepositories(username: string): Promise<ProjectSuggestion[]> {
  try {
    const repos = await fetchUserRepositories(username);
    const suggestions: ProjectSuggestion[] = [];

    for (const repo of repos.slice(0, 10)) { // Limit to 10 repos
      const analysis = await analyzeGitHubRepository(username, repo.name);
      
      const suggestion: ProjectSuggestion = {
        id: repo.id.toString(),
        title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        description: repo.description || `A ${repo.language || 'software'} project`,
        technologies: Object.keys(analysis.languages),
        githubUrl: repo.html_url,
        featured: repo.stargazers_count > 0
      };

      suggestions.push(suggestion);
    }

    return suggestions;
  } catch (error) {
    console.error('Error analyzing user repositories:', error);
    throw error;
  }
}

// Enhanced repository analysis with AI
export async function analyzeGitHubRepositoryEnhanced(
  owner: string, 
  repo: string, 
  huggingfaceApiKey: string
): Promise<RepoAnalysis & { aiDescription?: string }> {
  try {
    const analysis = await analyzeGitHubRepository(owner, repo);
    
    if (huggingfaceApiKey) {
      try {
        const aiDescription = await generateProjectDescriptionWithAI(analysis, huggingfaceApiKey);
        return { ...analysis, aiDescription };
      } catch (error) {
        console.error('AI description generation failed:', error);
      }
    }

    return analysis;
  } catch (error) {
    console.error('Error in enhanced repository analysis:', error);
    throw error;
  }
}

// Enhanced user repositories analysis with AI descriptions
export async function analyzeUserRepositoriesEnhanced(
  username: string, 
  huggingfaceApiKey: string
): Promise<ProjectSuggestion[]> {
  try {
    const repos = await fetchUserRepositories(username);
    const suggestions: ProjectSuggestion[] = [];

    for (const repo of repos.slice(0, 5)) { // Limit to 5 repos for AI processing
      try {
        const analysis = await analyzeGitHubRepositoryEnhanced(username, repo.name, huggingfaceApiKey);
        
        const suggestion: ProjectSuggestion = {
          id: repo.id.toString(),
          title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          description: analysis.aiDescription || repo.description || `A ${repo.language || 'software'} project`,
          technologies: Object.keys(analysis.languages),
          githubUrl: repo.html_url,
          featured: repo.stargazers_count > 0
        };

        suggestions.push(suggestion);
      } catch (error) {
        console.error(`Error analyzing repository ${repo.name}:`, error);
        // Fallback to basic analysis
        const suggestion: ProjectSuggestion = {
          id: repo.id.toString(),
          title: repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          description: repo.description || `A ${repo.language || 'software'} project`,
          technologies: repo.language ? [repo.language] : [],
          githubUrl: repo.html_url,
          featured: repo.stargazers_count > 0
        };
        suggestions.push(suggestion);
      }
    }

    return suggestions;
  } catch (error) {
    console.error('Error in enhanced user repositories analysis:', error);
    throw error;
  }
}

// Generate project description using AI
export async function generateProjectDescriptionWithAI(
  analysis: RepoAnalysis,
  huggingfaceApiKey: string
): Promise<string> {
  const ai = createAIService('huggingface', huggingfaceApiKey);
  return await ai.generateProjectDescription(analysis.repo, analysis.readme || undefined);
}

// Example replacement for generateProjectDescription
export async function generateProjectDescription(
  repo: GitHubRepo,
  readme: string | null,
  huggingfaceApiKey: string
): Promise<string> {
  const ai = createAIService('huggingface', huggingfaceApiKey);
  return await ai.generateProjectDescription(repo, readme || undefined);
}

// Generate basic description fallback
function generateBasicDescription(repo: GitHubRepo): string {
  let description = repo.description || `${repo.language || 'Software'} project`;
  if (repo.topics && repo.topics.length > 0) {
    description += ` featuring ${repo.topics.slice(0, 3).join(', ')}`;
  }
  return description;
}
