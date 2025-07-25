// Hugging Face Inference API Service
// Free alternative to Gemini API

interface HuggingFaceResponse {
  generated_text?: string;
  error?: string;
}

export class HuggingFaceService {
  private apiKey: string;
  private baseUrl = 'https://api-inference.huggingface.co/models';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Generate text using Hugging Face models
   * Free models: microsoft/DialoGPT-large, google/flan-t5-large, etc.
   */
  async generateText(prompt: string, model = 'microsoft/DialoGPT-large'): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/${model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_length: 150,
            temperature: 0.7,
            do_sample: true,
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: HuggingFaceResponse[] = await response.json();
      
      if (data && data[0] && data[0].generated_text) {
        return data[0].generated_text.replace(prompt, '').trim();
      }
      
      throw new Error('No generated text received');
    } catch (error) {
      console.error('Hugging Face API error:', error);
      throw error;
    }
  }

  /**
   * Generate project description (replacement for Gemini)
   */
  async generateProjectDescription(repoData: any, readme?: string): Promise<string> {
    const prompt = `Create a professional 150-character description for this project:

Project: ${repoData.name}
Description: ${repoData.description || 'No description'}
Language: ${repoData.language}
Topics: ${repoData.topics?.join(', ') || 'None'}
${readme ? `README: ${readme.substring(0, 500)}...` : ''}

Generate a concise, professional description:`;

    const description = await this.generateText(prompt, 'google/flan-t5-large');
    
    // Ensure it's within 150 characters
    if (description.length > 150) {
      return description.substring(0, 147) + '...';
    }
    
    return description;
  }

  /**
   * Parse resume content (replacement for Gemini)
   */
  async parseResumeContent(resumeText: string): Promise<any> {
    const prompt = `Extract structured data from this resume in JSON format:

${resumeText.substring(0, 2000)}

Return JSON with: name, email, phone, skills, experience, education, projects.
JSON:`;

    try {
      const response = await this.generateText(prompt, 'microsoft/DialoGPT-large');
      
      // Try to parse JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback: create basic structure
      return {
        name: this.extractField(resumeText, ['name', 'Name']),
        email: this.extractEmail(resumeText),
        phone: this.extractPhone(resumeText),
        skills: this.extractSkills(resumeText),
        experience: [],
        education: [],
        projects: []
      };
    } catch (error) {
      console.error('Resume parsing error:', error);
      throw error;
    }
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
   * Validate API key
   */
  async validateApiKey(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/microsoft/DialoGPT-large`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: 'Hello',
          parameters: { max_length: 10 }
        }),
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

// Usage example:
// const hf = new HuggingFaceService('your-hf-token');
// const description = await hf.generateProjectDescription(repoData, readme);
