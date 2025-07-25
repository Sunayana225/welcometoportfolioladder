#!/usr/bin/env python3
"""
Enhanced PDF Parser with hyperlink extraction and improved name detection
"""

import os
import re
import io
import logging
from typing import Dict, List, Any, Optional, Tuple
import pdfplumber
import fitz  # PyMuPDF
import PyPDF2
from docx import Document

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class EnhancedPDFParser:
    """Enhanced PDF parser with hyperlink extraction and improved name detection"""
    
    def __init__(self):
        """Initialize the parser"""
        # Load skills database if available
        self.skills_set = set()
        try:
            skills_file = os.path.join(os.path.dirname(__file__), 'pyresparser', 'skills.csv')
            if os.path.exists(skills_file):
                with open(skills_file, 'r', encoding='utf-8') as f:
                    self.skills_set = {line.strip() for line in f if line.strip()}
                logger.info(f"Loaded {len(self.skills_set)} skills from database")
            else:
                logger.warning(f"Skills file not found at {skills_file}")
        except Exception as e:
            logger.error(f"Error loading skills database: {e}")
    
    def parse_resume_from_file(self, file_path: str) -> Dict:
        """Parse resume from file with enhanced hyperlink extraction"""
        file_extension = os.path.splitext(file_path)[1].lower()
        
        try:
            if file_extension == '.pdf':
                text_content, hyperlinks, metadata = self._extract_from_pdf(file_path)
            elif file_extension in ['.docx', '.doc']:
                text_content = self._extract_text_from_docx(file_path)
                hyperlinks = []
                metadata = {}
            elif file_extension == '.txt':
                with open(file_path, 'r', encoding='utf-8') as f:
                    text_content = f.read()
                hyperlinks = []
                metadata = {}
            else:
                raise ValueError(f"Unsupported file format: {file_extension}")
                
            if not text_content.strip():
                raise ValueError("No text could be extracted from the file")
                
            return self.parse_resume(text_content, hyperlinks, metadata)
            
        except Exception as e:
            logger.error(f"Error parsing resume from file {file_path}: {e}")
            raise
    
    def _extract_from_pdf(self, file_path: str) -> Tuple[str, List[Dict], Dict]:
        """Extract text, hyperlinks and metadata from PDF using multiple libraries for best results"""
        text = ""
        hyperlinks = []
        metadata = {}
        
        # Try PyMuPDF (fitz) first for hyperlinks
        try:
            doc = fitz.open(file_path)
            
            # Extract metadata
            metadata = {
                "title": doc.metadata.get("title", ""),
                "author": doc.metadata.get("author", ""),
                "subject": doc.metadata.get("subject", ""),
                "creator": doc.metadata.get("creator", ""),
                "producer": doc.metadata.get("producer", ""),
            }
            
            # Extract text and hyperlinks
            for page_num, page in enumerate(doc):
                text += page.get_text() + "\n"
                
                # Extract links
                links = page.get_links()
                for link in links:
                    if "uri" in link:
                        hyperlinks.append({
                            "url": link["uri"],
                            "page": page_num + 1,
                            "text": self._get_text_near_link(page, link)
                        })
            
            doc.close()
            
        except Exception as e:
            logger.warning(f"PyMuPDF extraction failed, falling back to pdfplumber: {e}")
            
            # Fall back to pdfplumber for better text extraction
            try:
                with pdfplumber.open(file_path) as pdf:
                    # Extract text
                    for page in pdf.pages:
                        text += page.extract_text() or ""
                        
                    # Try to extract hyperlinks if PyMuPDF failed
                    if not hyperlinks:
                        hyperlinks = self._extract_hyperlinks_from_pdfplumber(pdf)
            except Exception as e2:
                logger.warning(f"pdfplumber extraction failed, falling back to PyPDF2: {e2}")
                
                # Last resort: PyPDF2
                try:
                    with open(file_path, 'rb') as file:
                        pdf_reader = PyPDF2.PdfReader(file)
                        for page in pdf_reader.pages:
                            text += page.extract_text() + "\n"
                except Exception as e3:
                    logger.error(f"All PDF extraction methods failed: {e3}")
                    raise ValueError("Failed to extract text from PDF using any available method")
        
        return text, hyperlinks, metadata
    
    def _get_text_near_link(self, page, link):
        """Get text near a hyperlink for context"""
        try:
            if "from" in link:
                rect = fitz.Rect(link["from"])
                # Expand rectangle slightly to capture surrounding text
                expanded_rect = rect.inflate(10, 5)
                words = page.get_text("words", clip=expanded_rect)
                if words:
                    return " ".join(word[4] for word in words)
            return ""
        except Exception as e:
            logger.warning(f"Error getting text near link: {e}")
            return ""
    
    def _extract_hyperlinks_from_pdfplumber(self, pdf):
        """Extract hyperlinks from pdfplumber PDF object"""
        hyperlinks = []
        
        try:
            for i, page in enumerate(pdf.pages):
                annots = page.annots
                if annots:
                    for annot in annots:
                        if annot.get('subtype') == 'Link' and annot.get('uri'):
                            hyperlinks.append({
                                "url": annot['uri'],
                                "page": i + 1,
                                "text": ""  # pdfplumber doesn't easily provide text near links
                            })
        except Exception as e:
            logger.warning(f"Error extracting hyperlinks with pdfplumber: {e}")
            
        return hyperlinks
    
    def _extract_text_from_docx(self, file_path: str) -> str:
        """Extract text from DOCX file"""
        text = ""
        try:
            doc = Document(file_path)
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
        except Exception as e:
            logger.error(f"Error reading DOCX: {e}")
            raise
        return text
    
    def parse_resume(self, text_content: str, hyperlinks: List[Dict] = None, metadata: Dict = None) -> Dict:
        """Parse resume text with enhanced hyperlink support"""
        if hyperlinks is None:
            hyperlinks = []
        if metadata is None:
            metadata = {}
            
        # Clean the text
        text_content = self._clean_text(text_content)
        lines = text_content.split('\n')
        
        # Initialize result dictionary
        data = {
            'name': '',
            'email': '',
            'mobile_number': '',
            'skills': [],
            'college_name': [],
            'degree': [],
            'designation': [],
            'experience': [],
            'company_names': [],
            'no_of_pages': 0,
            'total_experience': 0,
        }
        
        # Extract basic information
        data['email'] = self._extract_email(text_content)
        data['mobile_number'] = self._extract_phone(text_content)
        data['name'] = self._extract_name(lines, metadata)
        
        # Extract URLs from both text and hyperlinks
        urls_from_text = self._extract_urls(text_content)
        urls_from_hyperlinks = [link['url'] for link in hyperlinks]
        all_urls = list(set(urls_from_text + urls_from_hyperlinks))
        
        # Classify links
        classified = self._classify_links(all_urls)
        data['urls'] = all_urls
        data['github_url'] = classified['github']
        data['linkedin_url'] = classified['linkedin']
        data['twitter_url'] = classified['twitter']
        data['portfolio_url'] = classified['website']
        
        # Extract skills
        data['skills'] = self._extract_skills(text_content)
        
        # Format for compatibility with existing code
        result = {
            'personalInfo': {
                'name': data['name'],
                'email': data['email'],
                'phone': data['mobile_number'],
                'location': '',
                'github': data['github_url'],
                'linkedin': data['linkedin_url'],
                'twitter': data['twitter_url'],
                'website': data['portfolio_url']
            },
            'skills': {
                'technical': data['skills'],
                'languages': [],
                'frameworks': [],
                'tools': []
            },
            'experience': [],
            'education': [],
            'projects': [],
            'certifications': [],
            'summary': '',
            'hyperlinks': hyperlinks
        }
        
        return result
        
    def _clean_text(self, text: str) -> str:
        """Clean and normalize text"""
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text)
        # Replace newlines with actual newlines
        text = text.replace('\\n', '\n')
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
    
    def _extract_name(self, lines: List[str], metadata: Dict) -> str:
        """Extract name with improved accuracy using metadata and heuristics"""
        # First try metadata if available
        if metadata and metadata.get('author'):
            author = metadata.get('author', '').strip()
            if author and len(author.split()) >= 2 and len(author) < 50:
                if not any(x in author.lower() for x in ['company', 'inc', 'ltd', 'corporation']):
                    return author
        
        # Then try the first few lines
        for line in lines[:7]:  # Check more lines than before
            line = line.strip()
            if line and len(line.split()) >= 2 and len(line) < 50:
                # Skip lines with email, phone, or common headers
                if not any(x in line.lower() for x in ['email', 'phone', 'resume', 'cv', '@', 'objective', 'address']):
                    # Check if it looks like a name (no numbers, reasonable length)
                    if not re.search(r'\d', line) and 2 <= len(line.split()) <= 5:
                        # Avoid lines that look like section headers
                        if not line.lower().endswith(':') and not line.upper() == line:
                            return line
        
        return ''
    
    def _extract_urls(self, text: str) -> List[str]:
        """Extract all URLs from text using a more comprehensive regex"""
        # More comprehensive URL pattern
        url_pattern = r'https?://(?:[-\w.]|(?:%[\da-fA-F]{2}))+(?:/[-\w%!$&\'()*+,;=:~.]+)*/?(?:\?[-\w%.!$&\'()*+,;=:]+)?(?:#[-\w%.!$&\'()*+,;=:]+)?'
        return re.findall(url_pattern, text)
    
    def _classify_links(self, urls: List[str]) -> dict:
        """Classify links into categories with improved patterns"""
        github = next((l for l in urls if re.search(r'github\.com/[^/]+/?', l, re.IGNORECASE)), '')
        linkedin = next((l for l in urls if re.search(r'linkedin\.com/(?:in|pub|profile)/[^/]+/?', l, re.IGNORECASE)), '')
        twitter = next((l for l in urls if re.search(r'(?:twitter|x)\.com/[^/]+/?', l, re.IGNORECASE)), '')
        
        banned = ['linkedin.com', 'github.com', 'twitter.com', 'x.com', 'mail.com', 'gmail.com']
        website = next((l for l in urls if not any(b in l.lower() for b in banned)), '')
        
        return {'github': github, 'linkedin': linkedin, 'twitter': twitter, 'website': website}
    
    def _extract_skills(self, text: str) -> List[str]:
        """Extract skills using the comprehensive skills database"""
        found_skills = set()
        text_lower = text.lower()
        
        # Check each skill in our database
        for skill in self.skills_set:
            skill_lower = skill.lower()
            # Skip very short skills and common words
            if len(skill_lower) > 2 and skill_lower not in ['the', 'and', 'for', 'with', 'from']:
                # Use word boundaries to avoid partial matches
                pattern = r'\b' + re.escape(skill_lower) + r'\b'
                if re.search(pattern, text_lower):
                    found_skills.add(skill)
        
        return sorted(list(found_skills))
