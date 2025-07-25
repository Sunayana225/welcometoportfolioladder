#!/usr/bin/env python3
"""
Improved Resume Parser using the skills database from pyresparser
"""

import re
import os
import csv
import io
from typing import Dict, List, Set
<<<<<<< HEAD
import requests
=======
>>>>>>> b73e91fba34b27aabf20f3d73406c15ba40c9f57

# Import PDF and DOCX libraries
try:
    import PyPDF2
    PDF_SUPPORT = True
except ImportError:
    PDF_SUPPORT = False
    print("Warning: PyPDF2 not available. PDF support disabled.")

try:
    from docx import Document
    DOCX_SUPPORT = True
except ImportError:
    DOCX_SUPPORT = False
    print("Warning: python-docx not available. DOCX support disabled.")

class ImprovedResumeParser:
    def __init__(self):
        self.skills_set = self._load_skills()
        
    def _load_skills(self) -> Set[str]:
        """Load skills from the pyresparser skills.csv file"""
        skills = set()
        skills_file = os.path.join(os.path.dirname(__file__), 'pyresparser', 'skills.csv')

        try:
            with open(skills_file, 'r', encoding='utf-8') as f:
                content = f.read().strip()
                # The file has all skills in one line, comma-separated
                all_skills = content.split(',')

                for skill in all_skills:
                    skill = skill.strip()
                    if skill and len(skill) > 1:  # Skip single characters
                        # Clean up the skill
                        skill = skill.replace('"', '').replace("'", "")
                        if skill and not skill.isdigit():  # Skip numbers
                            skills.add(skill.lower())
                            # Also add capitalized version for exact matches
                            skills.add(skill.title())
                            if skill.upper() != skill.lower():  # Avoid duplicates
                                skills.add(skill.upper())

            print(f"Loaded {len(skills)} skills from database")
        except Exception as e:
            print(f"Warning: Could not load skills file: {e}")
            # Fallback to basic skills
            skills.update([
                'python', 'javascript', 'java', 'react', 'node.js', 'html', 'css',
                'sql', 'mongodb', 'postgresql', 'aws', 'docker', 'kubernetes',
                'git', 'linux', 'windows', 'machine learning', 'data analysis',
                'django', 'flask', 'typescript', 'angular', 'vue.js', 'express'
            ])

        return skills

    def extract_text_from_file(self, file_path: str) -> str:
        """Extract text from various file formats"""
        file_extension = os.path.splitext(file_path)[1].lower()

        try:
            if file_extension == '.pdf':
                return self._extract_text_from_pdf(file_path)
            elif file_extension in ['.docx', '.doc']:
                return self._extract_text_from_docx(file_path)
            elif file_extension == '.txt':
                return self._extract_text_from_txt(file_path)
            else:
                raise ValueError(f"Unsupported file format: {file_extension}")
        except Exception as e:
            print(f"Error extracting text from {file_path}: {e}")
            return ""

    def _extract_text_from_pdf(self, file_path: str) -> str:
        """Extract text from PDF file"""
        if not PDF_SUPPORT:
            raise ValueError("PDF support not available. Install PyPDF2.")

        text = ""
        try:
            with open(file_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    text += page.extract_text() + "\n"
        except Exception as e:
            print(f"Error reading PDF: {e}")
            raise

        return text

    def _extract_text_from_docx(self, file_path: str) -> str:
        """Extract text from DOCX file"""
        if not DOCX_SUPPORT:
            raise ValueError("DOCX support not available. Install python-docx.")

        text = ""
        try:
            doc = Document(file_path)
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
        except Exception as e:
            print(f"Error reading DOCX: {e}")
            raise

        return text

    def _extract_text_from_txt(self, file_path: str) -> str:
        """Extract text from TXT file"""
        try:
            with open(file_path, 'r', encoding='utf-8') as file:
                return file.read()
        except UnicodeDecodeError:
            # Try with different encoding
            with open(file_path, 'r', encoding='latin-1') as file:
                return file.read()

    def parse_resume_from_file(self, file_path: str) -> Dict:
        """Parse resume from file (PDF, DOCX, or TXT)"""
        text_content = self.extract_text_from_file(file_path)
        if not text_content.strip():
            raise ValueError("No text could be extracted from the file")

        return self.parse_resume(text_content)

    def parse_resume(self, text_content: str) -> Dict:
        """
        Parse resume text and extract structured information
        """
        data = {
            'name': '',
            'email': '',
            'mobile_number': '',
            'skills': [],
            'designation': [],
            'company_names': [],
            'college_name': [],
            'degree': [],
            'total_experience': 0,
            'experience': [],
            'no_of_pages': 1
        }
        
        # Clean the text
        text_content = self._clean_text(text_content)
        lines = text_content.split('\n')
        
        # Extract basic information
        data['email'] = self._extract_email(text_content)
        data['mobile_number'] = self._extract_phone(text_content)
        data['name'] = self._extract_name(lines)

        # Extract URLs and links
        urls = self._extract_urls(text_content)
<<<<<<< HEAD
        classified = self._classify_links(urls)
        data['urls'] = urls
        data['github_url'] = classified['github']
        data['linkedin_url'] = classified['linkedin']
        data['twitter_url'] = classified['twitter']
        data['portfolio_url'] = classified['website']
=======
        data['urls'] = urls
        data['linkedin_url'] = self._extract_linkedin(urls)
        data['github_url'] = self._extract_github(urls)
        data['portfolio_url'] = self._extract_portfolio(urls)
>>>>>>> b73e91fba34b27aabf20f3d73406c15ba40c9f57
        
        # Extract skills using the comprehensive skills database
        data['skills'] = self._extract_skills(text_content)
        
        # Extract experience and companies
        experience_info = self._extract_experience(text_content, lines)
        data['company_names'] = experience_info['companies']
        data['designation'] = experience_info['designations']
        data['experience'] = experience_info['experience_list']
        data['total_experience'] = experience_info['total_years']
        
        # Extract education
        education_info = self._extract_education(lines)
        data['college_name'] = education_info['colleges']
        data['degree'] = education_info['degrees']
        
        return data
    
    def _clean_text(self, text: str) -> str:
        """Clean and normalize text"""
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        # Remove special characters but keep important ones
        text = re.sub(r'[^\w\s@.+()-]', ' ', text)
        return text.strip()
    
    def _extract_email(self, text: str) -> str:
        """Extract email address"""
        email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        emails = re.findall(email_pattern, text)
        return emails[0] if emails else ''
    
    def _extract_phone(self, text: str) -> str:
        """Extract phone number"""
        phone_patterns = [
            r'\+?1?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})',
            r'\+?([0-9]{1,3})[-.\s]?([0-9]{3,4})[-.\s]?([0-9]{3,4})[-.\s]?([0-9]{3,4})',
            r'(\d{10})',  # Simple 10-digit number
        ]
        
        for pattern in phone_patterns:
            phones = re.findall(pattern, text)
            if phones:
                if isinstance(phones[0], tuple):
                    return ''.join(phones[0])
                else:
                    return phones[0]
        return ''

    def _extract_urls(self, text: str) -> List[str]:
<<<<<<< HEAD
        """Extract all URLs from text using a simple regex"""
        return re.findall(r'https?://[^\s,;"\'<>]+', text)

    def _classify_links(self, urls: List[str]) -> dict:
        github = next((l for l in urls if re.match(r'https?://github.com/[^/]+/?$', l)), '')
        linkedin = next((l for l in urls if re.match(r'https?://(www\.)?linkedin.com/(in|pub)/[^/]+/?$', l)), '')
        twitter = next((l for l in urls if re.match(r'https?://(www\.)?twitter.com/[^/]+/?$', l)), '')
        banned = ['linkedin.com', 'github.com', 'twitter.com', 'mail.com', 'gmail.com']
        website = next((l for l in urls if not any(b in l for b in banned)), '')
        return {'github': github, 'linkedin': linkedin, 'twitter': twitter, 'website': website}

    # Optional: validate if a link is live (not used by default)
    # def _validate_link(self, link: str) -> bool:
    #     try:
    #         response = requests.head(link, timeout=5)
    #         return response.status_code == 200
    #     except requests.RequestException:
    #         return False

    # In your main parse function, after extracting URLs:
    # urls = self._extract_urls(text_content)
    # classified = self._classify_links(urls)
    # data['github_url'] = classified['github']
    # data['linkedin_url'] = classified['linkedin']
    # data['twitter_url'] = classified['twitter']
    # data['portfolio_url'] = classified['website']

    def _extract_github(self, urls: List[str]) -> str:
        """Extract the most relevant GitHub URL (prefer user profile or repo, not root)"""
        for url in urls:
            # Match user profile or repo, but not just https://github.com
            if re.match(r'https?://github.com/[^/]+(/[^/]+)?/?$', url, re.IGNORECASE) and not url.rstrip('/').endswith('github.com'):
                return url
        return ''

    def _extract_linkedin(self, urls: List[str]) -> str:
        """Extract the most relevant LinkedIn URL (prefer /in/ or /pub/)"""
        for url in urls:
            if re.match(r'https?://(www\.)?linkedin.com/(in|pub)/[^/]+/?$', url, re.IGNORECASE):
                return url
        return ''

    def _extract_twitter(self, urls: List[str]) -> str:
        """Extract Twitter profile URL (not just https://twitter.com)"""
        for url in urls:
            if re.match(r'https?://(www\.)?twitter.com/[^/]+/?$', url, re.IGNORECASE) and not url.rstrip('/').endswith('twitter.com'):
=======
        """Extract all URLs from text"""
        url_patterns = [
            r'https?://[^\s<>"{}|\\^`\[\]]+',  # Standard HTTP/HTTPS URLs
            r'www\.[^\s<>"{}|\\^`\[\]]+',      # www URLs without protocol
            r'[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:/[^\s<>"{}|\\^`\[\]]*)?'  # Domain-based URLs
        ]

        urls = []
        for pattern in url_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for match in matches:
                # Clean up the URL
                url = match.strip('.,;:!?')
                if url and len(url) > 5:  # Minimum URL length
                    # Add protocol if missing
                    if not url.startswith(('http://', 'https://')):
                        if url.startswith('www.'):
                            url = 'https://' + url
                        elif '.' in url and not url.startswith('mailto:'):
                            url = 'https://' + url
                    urls.append(url)

        # Remove duplicates while preserving order
        seen = set()
        unique_urls = []
        for url in urls:
            if url.lower() not in seen:
                seen.add(url.lower())
                unique_urls.append(url)

        return unique_urls[:10]  # Limit to 10 URLs

    def _extract_linkedin(self, urls: List[str]) -> str:
        """Extract LinkedIn URL from list of URLs"""
        for url in urls:
            if 'linkedin.com' in url.lower():
                return url
        return ''

    def _extract_github(self, urls: List[str]) -> str:
        """Extract GitHub URL from list of URLs"""
        for url in urls:
            if 'github.com' in url.lower():
>>>>>>> b73e91fba34b27aabf20f3d73406c15ba40c9f57
                return url
        return ''

    def _extract_portfolio(self, urls: List[str]) -> str:
<<<<<<< HEAD
        """Extract portfolio/personal website URL, skipping common platforms and social media"""
        skip_domains = [
            'linkedin.com', 'github.com', 'twitter.com', 'facebook.com',
            'instagram.com', 'youtube.com', 'gmail.com', 'outlook.com',
            'bitbucket.org', 'gitlab.com', 'medium.com', 'reddit.com',
            'stackoverflow.com', 'behance.net', 'dribbble.com', 't.me', 'wa.me',
            'mail.com', 'protonmail.com', 'yahoo.com', 'icloud.com', 'aol.com'
        ]
        for url in urls:
            url_lower = url.lower()
            if not any(domain in url_lower for domain in skip_domains):
=======
        """Extract portfolio/personal website URL from list of URLs"""
        # Skip social media and common platforms
        skip_domains = [
            'linkedin.com', 'github.com', 'twitter.com', 'facebook.com',
            'instagram.com', 'youtube.com', 'gmail.com', 'outlook.com'
        ]

        for url in urls:
            url_lower = url.lower()
            if not any(domain in url_lower for domain in skip_domains):
                # Likely a personal website or portfolio
>>>>>>> b73e91fba34b27aabf20f3d73406c15ba40c9f57
                return url
        return ''

    def _extract_name(self, lines: List[str]) -> str:
        """Extract name from the first few lines"""
        for line in lines[:5]:
            line = line.strip()
            if line and len(line.split()) >= 2 and len(line) < 50:
                # Skip lines with email, phone, or common headers
                if not any(x in line.lower() for x in ['email', 'phone', 'resume', 'cv', '@', 'objective']):
                    # Check if it looks like a name (no numbers, reasonable length)
                    if not re.search(r'\d{3,}', line) and 2 <= len(line.split()) <= 4:
                        return line
        return ''
    
    def _extract_skills(self, text: str) -> List[str]:
        """Extract skills using the comprehensive skills database"""
        found_skills = set()
        text_lower = text.lower()

        # Remove common section headers that might interfere
        text_lower = re.sub(r'\b(technical\s+skills?|skills?|technologies?|programming\s+languages?)\b', '', text_lower)

        # Check each skill in our database
        for skill in self.skills_set:
            skill_lower = skill.lower()
            # Skip very short skills and common words
            if len(skill_lower) > 2 and skill_lower not in ['the', 'and', 'for', 'with', 'from']:
                # Use word boundaries to avoid partial matches
                pattern = r'\b' + re.escape(skill_lower) + r'\b'
                if re.search(pattern, text_lower):
                    # Don't add if it's just a section header
                    if skill_lower not in ['technical skills', 'skills', 'technologies']:
                        found_skills.add(skill)

        # Add common skill variations and aliases
        skill_aliases = {
            'javascript': ['js', 'ecmascript'],
            'typescript': ['ts'],
            'react': ['reactjs', 'react.js'],
            'angular': ['angularjs'],
            'vue': ['vue.js', 'vuejs'],
            'node': ['node.js', 'nodejs'],
            'express': ['express.js', 'expressjs'],
            'mongodb': ['mongo'],
            'postgresql': ['postgres', 'psql'],
            'mysql': ['my sql'],
            'aws': ['amazon web services'],
            'gcp': ['google cloud platform'],
            'azure': ['microsoft azure']
        }

        # Check for aliases
        for main_skill, aliases in skill_aliases.items():
            for alias in aliases:
                if re.search(r'\b' + re.escape(alias) + r'\b', text_lower):
                    found_skills.add(main_skill)

        # Convert to list and filter out duplicates/variations
        skills_list = list(found_skills)

        # Remove duplicates and variations (keep the most common form)
        filtered_skills = []
        skills_lower = [s.lower() for s in skills_list]

        for skill in skills_list:
            skill_lower = skill.lower()
            # Skip if we already have a variation of this skill
            if not any(skill_lower in existing.lower() and skill_lower != existing.lower()
                      for existing in filtered_skills):
                filtered_skills.append(skill)

        # Prioritize programming languages and frameworks
        priority_skills = []
        other_skills = []

        priority_keywords = [
            'python', 'javascript', 'java', 'react', 'node', 'angular', 'vue',
            'html', 'css', 'sql', 'mongodb', 'postgresql', 'aws', 'docker',
            'kubernetes', 'git', 'machine learning', 'data analysis', 'django',
            'flask', 'typescript', 'express', 'bootstrap', 'jquery'
        ]

        for skill in filtered_skills:
            if any(keyword in skill.lower() for keyword in priority_keywords):
                priority_skills.append(skill)
            else:
                other_skills.append(skill)

        # Return prioritized skills (max 25)
        return (priority_skills + other_skills)[:25]
    
    def _extract_experience(self, text: str, lines: List[str]) -> Dict:
        """Extract work experience information"""
        companies = []
        designations = []
        experience_list = []
        
        # Common company indicators
        company_indicators = [
            'inc', 'llc', 'corp', 'company', 'technologies', 'systems', 
            'solutions', 'services', 'consulting', 'software', 'ltd'
        ]
        
        # Common job titles
        job_titles = [
            'engineer', 'developer', 'manager', 'analyst', 'consultant',
            'specialist', 'coordinator', 'director', 'lead', 'senior',
            'junior', 'intern', 'associate', 'architect', 'designer'
        ]
        
        # Look for experience sections
        experience_section = False
        for line in lines:
            line_lower = line.lower().strip()
            
            # Check if we're in experience section
            if any(keyword in line_lower for keyword in ['experience', 'employment', 'work history']):
                experience_section = True
                continue
            
            # Stop if we hit education or other sections
            if any(keyword in line_lower for keyword in ['education', 'skills', 'projects']):
                experience_section = False
                continue
            
            if line.strip():
                # Look for companies
                if any(indicator in line_lower for indicator in company_indicators):
                    companies.append(line.strip())
                
                # Look for job titles
                if any(title in line_lower for title in job_titles):
                    designations.append(line.strip())
                
                # If in experience section, add to experience list
                if experience_section and len(line.strip()) > 10:
                    experience_list.append(line.strip())
        
        # Estimate total experience (simple heuristic)
        total_years = 0
        year_pattern = r'(19|20)\d{2}'
        years = re.findall(year_pattern, text)
        if len(years) >= 2:
            try:
                years_int = [int(y) for y in years]
                total_years = max(years_int) - min(years_int)
                total_years = min(total_years, 50)  # Cap at 50 years
            except:
                total_years = 0
        
        return {
            'companies': companies[:5],  # Limit to 5
            'designations': designations[:5],
            'experience_list': experience_list[:10],
            'total_years': total_years
        }
    
    def _extract_education(self, lines: List[str]) -> Dict:
        """Extract education information"""
        colleges = []
        degrees = []
        
        # Education keywords
        degree_keywords = [
            'bachelor', 'master', 'phd', 'doctorate', 'degree', 'diploma',
            'certificate', 'b.s', 'b.a', 'm.s', 'm.a', 'mba', 'ph.d'
        ]
        
        institution_keywords = [
            'university', 'college', 'institute', 'school', 'academy'
        ]
        
        for line in lines:
            line_lower = line.lower().strip()
            
            if line.strip():
                # Look for degrees
                if any(keyword in line_lower for keyword in degree_keywords):
                    degrees.append(line.strip())
                
                # Look for institutions
                if any(keyword in line_lower for keyword in institution_keywords):
                    colleges.append(line.strip())
        
        return {
            'colleges': colleges[:3],  # Limit to 3
            'degrees': degrees[:3]
        }

# Global instance
improved_parser = ImprovedResumeParser()

def parse_resume_improved(text_content: str) -> Dict:
    """
    Main function to parse resume using improved parser
    """
    return improved_parser.parse_resume(text_content)
