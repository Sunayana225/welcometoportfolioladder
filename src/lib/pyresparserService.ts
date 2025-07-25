// Service for integrating with Python backend using pyresparser

const PYTHON_BACKEND_URL = 'http://localhost:5000';

export interface PyresparserData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    website: string;
  };
  summary: string;
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
    technologies: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    duration: string;
    gpa: string;
  }>;
  skills: {
    technical: string[];
    languages: string[];
    frameworks: string[];
    tools: string[];
  };
  projects: Array<{
    name: string;
    description: string;
    technologies: string[];
    url: string;
    github: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    url: string;
  }>;
}

export interface PyresparserResponse {
  success: boolean;
  data?: PyresparserData;
  raw_data?: any;
  error?: string;
}

/**
 * Check if the Python backend is available
 */
export async function checkPyresparserAvailability(): Promise<boolean> {
  try {
    const response = await fetch(`${PYTHON_BACKEND_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      // Check if any parser is available (pyresparser, improved parser, or simple parser)
      return (data.pyresparser_available === true && data.pyresparser_working === true) ||
             data.improved_parser_available === true ||
             data.simple_parser_available === true;
    }
    return false;
  } catch (error) {
    console.log('Python backend not available:', error);
    return false;
  }
}

/**
 * Parse resume file using pyresparser
 */
export async function parseResumeWithPyresparser(file: File): Promise<PyresparserData> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${PYTHON_BACKEND_URL}/parse-resume`, {
      method: 'POST',
      body: formData,
    });

    const result: PyresparserResponse = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to parse resume with pyresparser');
    }

    if (!result.data) {
      throw new Error('No data returned from pyresparser');
    }

    return result.data;
  } catch (error) {
    console.error('Error parsing resume with pyresparser:', error);
    throw new Error(`Failed to parse resume with pyresparser: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Parse resume text using pyresparser
 */
export async function parseResumeTextWithPyresparser(text: string): Promise<PyresparserData> {
  try {
    const response = await fetch(`${PYTHON_BACKEND_URL}/parse-resume-text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    const result: PyresparserResponse = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Failed to parse resume text with pyresparser');
    }

    if (!result.data) {
      throw new Error('No data returned from pyresparser');
    }

    return result.data;
  } catch (error) {
    console.error('Error parsing resume text with pyresparser:', error);
    throw new Error(`Failed to parse resume text with pyresparser: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Convert pyresparser data to portfolio format
 */
export function convertPyresparserToPortfolioData(data: PyresparserData): any {
  return {
    name: data.personalInfo.name,
    title: '', // pyresparser doesn't extract job titles well
    about: data.summary,
    email: data.personalInfo.email,
    phone: data.personalInfo.phone,
    location: data.personalInfo.location,
    github: data.personalInfo.github,
    linkedin: data.personalInfo.linkedin,
    website: data.personalInfo.website,
    skills: [
      ...data.skills.technical,
      ...data.skills.languages,
      ...data.skills.frameworks,
      ...data.skills.tools
    ].filter(Boolean),
    projects: data.projects.map(project => ({
      title: project.name,
      description: project.description,
      technologies: project.technologies,
      liveUrl: project.url || '',
      githubUrl: project.github || '',
      featured: false
    })),
    experience: data.experience.map(exp => ({
      company: exp.company,
      position: exp.position,
      duration: exp.duration,
      description: exp.description,
      location: '',
      current: false
    })),
    education: data.education.map(edu => ({
      institution: edu.institution,
      degree: edu.degree,
      duration: edu.duration,
      gpa: edu.gpa
    })),
    certifications: data.certifications.map(cert => ({
      name: cert.name,
      issuer: cert.issuer,
      date: cert.date,
      credentialUrl: cert.url
    })),
    theme: 'modern'
  };
}
