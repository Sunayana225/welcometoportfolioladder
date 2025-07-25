// Groq API Service - Fast and Free Alternative to Gemini
// Get free API key at: https://console.groq.com/

interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GroqResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class GroqService {
  private apiKey: string;
  private baseUrl = 'https://api.groq.com/openai/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Generate text using Groq's fast inference
   * Available models: llama3-8b-8192, llama3-70b-8192, mixtral-8x7b-32768
   */
  async generateText(
    messages: GroqMessage[], 
    model = 'llama3-8b-8192',
    maxTokens = 150
  ): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: maxTokens,
          temperature: 0.7,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: GroqResponse = await response.json();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content.trim();
      }
      
      throw new Error('No generated text received');
    } catch (error) {
      console.error('Groq API error:', error);
      throw error;
    }
  }

  /**
   * Generate project description (replacement for Gemini)
   */
  async generateProjectDescription(repoData: any, readme?: string): Promise<string> {
    const messages: GroqMessage[] = [
      {
        role: 'system',
        content: 'You are a professional portfolio writer. Create concise, engaging project descriptions that are exactly 150 characters or less.'
      },
      {
        role: 'user',
        content: `Create a professional description for this project:

Project Name: ${repoData.name}
Description: ${repoData.description || 'No description provided'}
Primary Language: ${repoData.language || 'Not specified'}
Topics/Tags: ${repoData.topics?.join(', ') || 'None'}
Stars: ${repoData.stargazers_count || 0}
${readme ? `README excerpt: ${readme.substring(0, 300)}...` : ''}

Requirements:
- Maximum 150 characters
- Professional and engaging
- Highlight key technologies
- Focus on value/purpose

Description:`
      }
    ];

    const description = await this.generateText(messages, 'llama3-8b-8192', 50);
    
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
    const messages: GroqMessage[] = [
      {
        role: 'system',
        content: 'You are a resume parser. Extract structured data from resumes and return valid JSON only.'
      },
      {
        role: 'user',
        content: `Extract structured data from this resume and return ONLY valid JSON:

${resumeText.substring(0, 2000)}

Return JSON with this exact structure:
{
  "name": "Full Name",
  "email": "email@example.com",
  "phone": "phone number",
  "location": "city, country",
  "title": "professional title",
  "bio": "brief professional summary",
  "skills": ["skill1", "skill2"],
  "experience": [
    {
      "company": "Company Name",
      "position": "Job Title",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM or Present",
      "description": "Job description"
    }
  ],
  "education": [
    {
      "institution": "School Name",
      "degree": "Degree Type",
      "field": "Field of Study",
      "startDate": "YYYY",
      "endDate": "YYYY"
    }
  ],
  "projects": [
    {
      "name": "Project Name",
      "description": "Project description",
      "technologies": ["tech1", "tech2"]
    }
  ]
}

JSON:`
      }
    ];

    try {
      const response = await this.generateText(messages, 'llama3-8b-8192', 500);
      
      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return this.validateAndCleanData(parsed);
      }
      
      throw new Error('No valid JSON found in response');
    } catch (error) {
      console.error('Resume parsing error:', error);
      // Fallback to basic extraction
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
      location: '',
      title: '',
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
   * Validate API key
   */
  async validateApiKey(): Promise<boolean> {
    try {
      const messages: GroqMessage[] = [
        { role: 'user', content: 'Hello' }
      ];
      
      await this.generateText(messages, 'llama3-8b-8192', 5);
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Usage example:
// const groq = new GroqService('your-groq-api-key');
// const description = await groq.generateProjectDescription(repoData, readme);
