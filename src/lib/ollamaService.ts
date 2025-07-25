// Ollama Local AI Service - Completely Free, No API Key Required
// Install Ollama: https://ollama.ai/
// Run: ollama pull llama3.1 (or other models)

interface OllamaResponse {
  response?: string;
  done?: boolean;
  error?: string;
}

export class OllamaService {
  private baseUrl: string;

  constructor(baseUrl = 'http://localhost:11434') {
    this.baseUrl = baseUrl;
  }

  /**
   * Generate text using local Ollama models
   * Popular models: llama3.1, mistral, codellama, phi3
   */
  async generateText(
    prompt: string, 
    model = 'llama3.1',
    options: any = {}
  ): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          prompt,
          stream: false,
          options: {
            temperature: 0.7,
            num_predict: 150,
            ...options
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: OllamaResponse = await response.json();
      
      if (data.response) {
        return data.response.trim();
      }
      
      throw new Error('No generated text received');
    } catch (error) {
      console.error('Ollama API error:', error);
      throw error;
    }
  }

  /**
   * Generate project description using local AI
   */
  async generateProjectDescription(repoData: any, readme?: string): Promise<string> {
    const prompt = `Create a professional project description for a portfolio. Keep it under 150 characters.

Project Details:
- Name: ${repoData.name}
- Description: ${repoData.description || 'No description'}
- Language: ${repoData.language || 'Not specified'}
- Topics: ${repoData.topics?.join(', ') || 'None'}
- Stars: ${repoData.stargazers_count || 0}
${readme ? `- README excerpt: ${readme.substring(0, 300)}...` : ''}

Write a concise, professional description (max 150 characters) that highlights the project's purpose and key technologies:`;

    const description = await this.generateText(prompt, 'llama3.1', {
      num_predict: 50,
      temperature: 0.5
    });
    
    // Clean and limit the response
    let cleanDescription = description
      .replace(/^["\s]*/, '') // Remove leading quotes/spaces
      .replace(/["\s]*$/, '') // Remove trailing quotes/spaces
      .split('\n')[0]; // Take first line only
    
    // Ensure it's within 150 characters
    if (cleanDescription.length > 150) {
      cleanDescription = cleanDescription.substring(0, 147) + '...';
    }
    
    return cleanDescription;
  }

  /**
   * Parse resume content using local AI
   */
  async parseResumeContent(resumeText: string): Promise<any> {
    const prompt = `Extract structured information from this resume and format as JSON.

Resume Text:
${resumeText.substring(0, 2000)}

Extract and return ONLY a JSON object with this structure:
{
  "name": "full name",
  "email": "email address",
  "phone": "phone number",
  "location": "location",
  "title": "professional title",
  "bio": "brief summary",
  "skills": ["skill1", "skill2"],
  "experience": [
    {
      "company": "company name",
      "position": "job title",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM or Present",
      "description": "job description"
    }
  ],
  "education": [
    {
      "institution": "school name",
      "degree": "degree type",
      "field": "field of study",
      "startDate": "YYYY",
      "endDate": "YYYY"
    }
  ],
  "projects": [
    {
      "name": "project name",
      "description": "project description",
      "technologies": ["tech1", "tech2"]
    }
  ]
}

JSON:`;

    try {
      const response = await this.generateText(prompt, 'llama3.1', {
        num_predict: 800,
        temperature: 0.3
      });
      
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return this.validateAndCleanData(parsed);
      }
      
      throw new Error('No valid JSON found in response');
    } catch (error) {
      console.error('Resume parsing error:', error);
      // Fallback to regex-based extraction
      return this.fallbackExtraction(resumeText);
    }
  }

  private validateAndCleanData(data: any): any {
    return {
      name: data.name || '',
      email: data.email || '',
      phone: data.phone || '',
      location: data.location || '',
      title: data.title || '',
      bio: data.bio || '',
      skills: Array.isArray(data.skills) ? data.skills : [],
      experience: Array.isArray(data.experience) ? data.experience : [],
      education: Array.isArray(data.education) ? data.education : [],
      projects: Array.isArray(data.projects) ? data.projects : []
    };
  }

  private fallbackExtraction(text: string): any {
    return {
      name: this.extractField(text, ['name', 'Name']),
      email: this.extractEmail(text),
      phone: this.extractPhone(text),
      location: this.extractField(text, ['location', 'address', 'city']),
      title: this.extractField(text, ['title', 'position', 'role']),
      bio: '',
      skills: this.extractSkills(text),
      experience: [],
      education: [],
      projects: []
    };
  }

  private extractField(text: string, patterns: string[]): string {
    for (const pattern of patterns) {
      const regex = new RegExp(`${pattern}[:\\s]*([^\\n]+)`, 'i');
      const match = text.match(regex);
      if (match) return match[1].trim();
    }
    return '';
  }

  private extractEmail(text: string): string {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const match = text.match(emailRegex);
    return match ? match[0] : '';
  }

  private extractPhone(text: string): string {
    const phoneRegex = /[\+]?[1-9]?[\d\s\-\(\)]{10,}/;
    const match = text.match(phoneRegex);
    return match ? match[0].trim() : '';
  }

  private extractSkills(text: string): string[] {
    const skillsSection = text.match(/skills?[:\s]*([\s\S]*?)(?=\n\n|\n[A-Z]|$)/i);
    if (skillsSection) {
      return skillsSection[1]
        .split(/[,\n]/)
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);
    }
    return [];
  }

  /**
   * Check if Ollama is running and model is available
   */
  async validateConnection(model = 'llama3.1'): Promise<boolean> {
    try {
      // Check if Ollama is running
      const healthResponse = await fetch(`${this.baseUrl}/api/tags`);
      if (!healthResponse.ok) return false;

      // Check if model is available
      const models = await healthResponse.json();
      const modelExists = models.models?.some((m: any) => m.name.includes(model));
      
      if (!modelExists) {
        console.warn(`Model ${model} not found. Available models:`, 
          models.models?.map((m: any) => m.name) || []);
        return false;
      }

      // Test generation
      await this.generateText('Hello', model, { num_predict: 5 });
      return true;
    } catch (error) {
      console.error('Ollama connection error:', error);
      return false;
    }
  }

  /**
   * List available models
   */
  async listModels(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/tags`);
      if (!response.ok) return [];
      
      const data = await response.json();
      return data.models?.map((m: any) => m.name) || [];
    } catch (error) {
      console.error('Error listing models:', error);
      return [];
    }
  }
}

// Usage example:
// const ollama = new OllamaService();
// const isReady = await ollama.validateConnection('llama3.1');
// if (isReady) {
//   const description = await ollama.generateProjectDescription(repoData, readme);
// }
