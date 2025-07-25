// Unified AI Service - Switch between different free AI providers
import { HuggingFaceService } from './huggingfaceService';
import { GroqService } from './groqService';
import { OllamaService } from './ollamaService';

export type AIProvider = 'huggingface' | 'groq' | 'ollama' | 'gemini';

interface AIConfig {
  provider: AIProvider;
  apiKey?: string;
  baseUrl?: string;
  model?: string;
}

export class AIService {
  private config: AIConfig;
  private service: HuggingFaceService | GroqService | OllamaService | null = null;

  constructor(config: AIConfig) {
    this.config = config;
    this.initializeService();
  }

  private initializeService() {
    switch (this.config.provider) {
      case 'huggingface':
        if (!this.config.apiKey) throw new Error('Hugging Face API key required');
        this.service = new HuggingFaceService(this.config.apiKey);
        break;
      
      case 'groq':
        if (!this.config.apiKey) throw new Error('Groq API key required');
        this.service = new GroqService(this.config.apiKey);
        break;
      
      case 'ollama':
        this.service = new OllamaService(this.config.baseUrl);
        break;
      
      default:
        throw new Error(`Unsupported AI provider: ${this.config.provider}`);
    }
  }

  /**
   * Generate project description
   */
  async generateProjectDescription(repoData: any, readme?: string): Promise<string> {
    if (!this.service) throw new Error('AI service not initialized');
    return await this.service.generateProjectDescription(repoData, readme);
  }

  /**
   * Parse resume content
   */
  async parseResumeContent(resumeText: string): Promise<any> {
    if (!this.service) throw new Error('AI service not initialized');
    return await this.service.parseResumeContent(resumeText);
  }

  /**
   * Validate API connection
   */
  async validateConnection(): Promise<boolean> {
    if (!this.service) return false;
    
    try {
      switch (this.config.provider) {
        case 'huggingface':
          return await (this.service as HuggingFaceService).validateApiKey();
        
        case 'groq':
          return await (this.service as GroqService).validateApiKey();
        
        case 'ollama':
          return await (this.service as OllamaService).validateConnection(this.config.model);
        
        default:
          return false;
      }
    } catch (error) {
      console.error('Connection validation error:', error);
      return false;
    }
  }

  /**
   * Get provider-specific setup instructions
   */
  static getSetupInstructions(provider: AIProvider): string {
    switch (provider) {
      case 'huggingface':
        return `
🤗 Hugging Face Setup:
1. Go to https://huggingface.co/settings/tokens
2. Create a new token (read access is enough)
3. Copy the token and paste it below
4. No payment info required!`;

      case 'groq':
        return `
⚡ Groq Setup (Fastest):
1. Go to https://console.groq.com/
2. Sign up with email (no payment required)
3. Create an API key
4. Copy and paste it below
5. Enjoy super-fast AI inference!`;

      case 'ollama':
        return `
🏠 Ollama Setup (Local AI):
1. Download Ollama from https://ollama.ai/
2. Install and run: ollama pull llama3.1
3. Start Ollama service
4. No API key needed - runs locally!
5. Complete privacy and no internet required`;

      default:
        return 'Unknown provider';
    }
  }

  /**
   * Get available models for provider
   */
  static getAvailableModels(provider: AIProvider): string[] {
    switch (provider) {
      case 'huggingface':
        return [
          'microsoft/DialoGPT-large',
          'google/flan-t5-large',
          'facebook/blenderbot-400M-distill',
          'microsoft/DialoGPT-medium'
        ];

      case 'groq':
        return [
          'llama3-8b-8192',
          'llama3-70b-8192',
          'mixtral-8x7b-32768',
          'gemma-7b-it'
        ];

      case 'ollama':
        return [
          'llama3.1',
          'mistral',
          'codellama',
          'phi3',
          'gemma',
          'qwen'
        ];

      default:
        return [];
    }
  }

  /**
   * Get provider comparison
   */
  static getProviderComparison() {
    return {
      huggingface: {
        name: 'Hugging Face',
        cost: 'Free',
        speed: 'Medium',
        quality: 'Good',
        setup: 'Easy',
        privacy: 'Cloud',
        pros: ['No payment info', 'Many models', 'Good documentation'],
        cons: ['Rate limits', 'Internet required', 'Slower than Groq']
      },
      groq: {
        name: 'Groq',
        cost: 'Free tier',
        speed: 'Very Fast',
        quality: 'Excellent',
        setup: 'Easy',
        privacy: 'Cloud',
        pros: ['Extremely fast', 'High quality', 'Good free tier'],
        cons: ['Requires signup', 'Internet required', 'Limited free usage']
      },
      ollama: {
        name: 'Ollama (Local)',
        cost: 'Completely Free',
        speed: 'Fast',
        quality: 'Excellent',
        setup: 'Medium',
        privacy: 'Local',
        pros: ['Complete privacy', 'No API limits', 'Works offline', 'No payment ever'],
        cons: ['Requires installation', 'Uses local resources', 'Initial setup']
      }
    };
  }
}

// Helper function to create AI service based on user preference
export function createAIService(provider: AIProvider, apiKey?: string, baseUrl?: string): AIService {
  return new AIService({
    provider,
    apiKey,
    baseUrl,
    model: provider === 'ollama' ? 'llama3.1' : undefined
  });
}

// Export individual services for direct use
export { HuggingFaceService, GroqService, OllamaService };

export async function validateHuggingFaceApiKey(apiKey: string): Promise<{ valid: boolean; error?: string }> {
  try {
    if (!apiKey || !apiKey.startsWith('hf_')) {
      return { valid: false, error: 'API key must start with "hf_".' };
    }
    const response = await fetch('https://huggingface.co/api/whoami-v2', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
      },
    });
    if (response.status === 200) {
      const data = await response.json();
      if (data && data.name) {
        return { valid: true };
      } else {
        return { valid: false, error: 'API key is valid but user info not found.' };
      }
    } else {
      const data = await response.json().catch(() => ({}));
      let errorMsg = 'Invalid API key or expired.';
      if (data && data.error) errorMsg = data.error;
      return { valid: false, error: errorMsg };
    }
  } catch (error: any) {
    return { valid: false, error: error?.message || 'Network error during Hugging Face API key validation.' };
  }
}
