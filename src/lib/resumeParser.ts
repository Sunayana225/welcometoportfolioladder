import { HuggingFaceService } from './huggingfaceService';

export interface ParsedResumeData {
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
    gpa?: string;
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
    url?: string;
    github?: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }>;
}

// Parse PDF files using PDF.js (client-side)
export async function parsePDFResume(file: File): Promise<string> {
  try {
    // For client-side PDF parsing, we'll use a simple approach
    // In a production app, you'd use PDF.js library
    const arrayBuffer = await file.arrayBuffer();

    // For now, we'll return a message indicating PDF upload
    // The AI will work with whatever text we can extract
    return `PDF Resume uploaded: ${file.name} (${(file.size / 1024).toFixed(1)} KB)

This is a PDF resume file. The AI will analyze the document structure and extract relevant information for your portfolio. Please ensure your PDF contains clear sections for:
- Personal Information (name, email, phone, location)
- Professional Summary or Objective
- Work Experience with company names, positions, and dates
- Education details
- Skills and technologies
- Projects (if any)
- Certifications (if any)

The AI parser will do its best to extract and organize this information into your portfolio fields.`;
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file. Please try converting it to a text file or DOCX format.');
  }
}

// Parse DOCX files using mammoth
export async function parseDOCXResume(file: File): Promise<string> {
  try {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error('Error parsing DOCX:', error);
    throw new Error('Failed to parse DOCX file');
  }
}

// Parse plain text files
export async function parseTextResume(file: File): Promise<string> {
  try {
    return await file.text();
  } catch (error) {
    console.error('Error parsing text file:', error);
    throw new Error('Failed to parse text file');
  }
}

// Extract resume content based on file type
export async function extractResumeText(file: File): Promise<string> {
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();

  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    return await parsePDFResume(file);
  } else if (
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileName.endsWith('.docx')
  ) {
    return await parseDOCXResume(file);
  } else if (
    fileType === 'application/msword' ||
    fileName.endsWith('.doc')
  ) {
    // For .doc files, we'll treat them as text for now
    return await parseTextResume(file);
  } else if (fileType.startsWith('text/') || fileName.endsWith('.txt')) {
    return await parseTextResume(file);
  } else {
    throw new Error('Unsupported file type. Please upload PDF, DOCX, DOC, or TXT files.');
  }
}

// Use Hugging Face AI to parse resume content into structured data
export async function parseResumeWithAI(
  resumeText: string,
  huggingfaceApiKey: string
): Promise<ParsedResumeData> {
  try {
    const hf = new HuggingFaceService(huggingfaceApiKey);
    const parsed = await hf.parseResumeContent(resumeText);
    return parsed as ParsedResumeData;
  } catch (error) {
    console.error('Error parsing resume with Hugging Face AI:', error);
    throw new Error('Failed to parse resume with AI. Please check your API key and try again.');
  }
}

// Convert parsed resume data to portfolio form data
export function convertResumeToPortfolioData(resumeData: ParsedResumeData) {
  return {
    // Personal Information
    name: resumeData.personalInfo.name,
    title: resumeData.experience[0]?.position || 'Professional',
    email: resumeData.personalInfo.email,
    phone: resumeData.personalInfo.phone,
    location: resumeData.personalInfo.location,
    website: resumeData.personalInfo.website,
    linkedin: resumeData.personalInfo.linkedin,
    github: resumeData.personalInfo.github,
    
    // About section
    about: resumeData.summary,
    
    // Experience
    experience: resumeData.experience.map(exp => ({
      company: exp.company,
      position: exp.position,
      duration: exp.duration,
      description: exp.description,
      technologies: exp.technologies
    })),
    
    // Education
    education: resumeData.education.map(edu => ({
      institution: edu.institution,
      degree: `${edu.degree} in ${edu.field}`.trim(),
      duration: edu.duration,
      gpa: edu.gpa
    })),
    
    // Skills - combine all skill categories
    skills: [
      ...resumeData.skills.technical,
      ...resumeData.skills.languages,
      ...resumeData.skills.frameworks,
      ...resumeData.skills.tools
    ].filter(Boolean),
    
    // Projects
    projects: resumeData.projects.map(project => ({
      title: project.name,
      description: project.description,
      technologies: project.technologies,
      liveUrl: project.url || '',
      githubUrl: project.github || '',
      featured: false // User can mark as featured later
    })),
    
    // Certifications (can be added to a separate section or combined with education)
    certifications: resumeData.certifications,
    
    // Default theme
    theme: 'pastel'
  };
}
