from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import tempfile
import json
from werkzeug.utils import secure_filename
import traceback
import re

# Resume parsing temporarily disabled for testing
# from improved_parser import parse_resume_improved, improved_parser
# from enhanced_pdf_parser import EnhancedPDFParser

RESUME_PARSING_ENABLED = False
print("📝 Resume parsing temporarily disabled for testing")

# pyresparser temporarily disabled for testing
# try:
#     from pyresparser.resume_parser import ResumeParser
#     PYRESPARSER_AVAILABLE = True
#     print("✅ Local pyresparser imported successfully")
# except ImportError as e:
#     PYRESPARSER_AVAILABLE = False
#     print(f"❌ Warning: Local pyresparser not available. Error: {e}")
# except Exception as e:
#     PYRESPARSER_AVAILABLE = False
#     print(f"❌ Warning: pyresparser import failed. Error: {e}")

PYRESPARSER_AVAILABLE = False

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = tempfile.gettempdir()
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'doc', 'txt'}
MAX_FILE_SIZE = 16 * 1024 * 1024  # 16MB

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_FILE_SIZE

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def clean_pyresparser_data(data):
    """Clean and normalize pyresparser output"""
    if not data:
        return {}
    
    # Handle the case where data is a list
    if isinstance(data, list) and len(data) > 0:
        data = data[0]
    
    cleaned = {}
    
    # Personal Info
    cleaned['personalInfo'] = {
        'name': data.get('name', ''),
        'email': data.get('email', ''),
        'phone': data.get('mobile_number', ''),
        'location': '',  # pyresparser doesn't extract location well
        'linkedin': data.get('linkedin_url', ''),
        'github': data.get('github_url', ''),
        'website': data.get('portfolio_url', '')
    }

    # Extract social links from skills or other fields if available (fallback)
    if not cleaned['personalInfo']['github'] or not cleaned['personalInfo']['linkedin']:
        skills = data.get('skills', [])
        if skills:
            for skill in skills:
                if 'github' in skill.lower() and not cleaned['personalInfo']['github']:
                    cleaned['personalInfo']['github'] = skill
                elif 'linkedin' in skill.lower() and not cleaned['personalInfo']['linkedin']:
                    cleaned['personalInfo']['linkedin'] = skill
    
    # Summary/Bio
    cleaned['summary'] = ''
    
    # Experience
    experience = []
    designations = data.get('designation', [])
    companies = data.get('company_names', [])
    
    if designations and companies:
        for i, designation in enumerate(designations):
            company = companies[i] if i < len(companies) else 'Unknown Company'
            experience.append({
                'company': company,
                'position': designation,
                'duration': '',
                'description': '',
                'technologies': []
            })
    
    cleaned['experience'] = experience
    
    # Education
    education = []
    colleges = data.get('college_name', [])
    degrees = data.get('degree', [])
    
    if colleges and degrees:
        for i, college in enumerate(colleges):
            degree = degrees[i] if i < len(degrees) else 'Unknown Degree'
            education.append({
                'institution': college,
                'degree': degree,
                'field': '',
                'duration': '',
                'gpa': ''
            })
    
    cleaned['education'] = education
    
    # Skills
    skills_list = data.get('skills', [])
    cleaned['skills'] = {
        'technical': skills_list[:10] if skills_list else [],  # First 10 as technical
        'languages': [],
        'frameworks': [],
        'tools': skills_list[10:] if len(skills_list) > 10 else []  # Rest as tools
    }
    
    # Projects (pyresparser doesn't extract projects well)
    cleaned['projects'] = []
    
    # Certifications (pyresparser doesn't extract certifications)
    cleaned['certifications'] = []
    
    return cleaned

def simple_resume_parser(text_content):
    """
    Simple regex-based resume parser as fallback when pyresparser doesn't work
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
        'total_experience': 0
    }

    # Extract email
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    emails = re.findall(email_pattern, text_content)
    if emails:
        data['email'] = emails[0]

    # Extract phone numbers
    phone_patterns = [
        r'\+?1?[-.\s]?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})',
        r'\+?([0-9]{1,3})[-.\s]?([0-9]{3,4})[-.\s]?([0-9]{3,4})[-.\s]?([0-9]{3,4})'
    ]
    for pattern in phone_patterns:
        phones = re.findall(pattern, text_content)
        if phones:
            data['mobile_number'] = ''.join(phones[0])
            break

    # Extract name (first line that looks like a name)
    lines = text_content.split('\n')
    for line in lines[:5]:  # Check first 5 lines
        line = line.strip()
        if line and len(line.split()) >= 2 and len(line) < 50:
            # Simple heuristic: if it's not an email and has 2+ words
            if '@' not in line and not re.search(r'\d{3,}', line):
                data['name'] = line
                break

    # Extract skills (common programming languages and technologies)
    skill_keywords = [
        'Python', 'JavaScript', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift',
        'React', 'Angular', 'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'Spring',
        'HTML', 'CSS', 'SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
        'AWS', 'Azure', 'Docker', 'Kubernetes', 'Git', 'Linux', 'Windows'
    ]

    found_skills = []
    text_upper = text_content.upper()
    for skill in skill_keywords:
        if skill.upper() in text_upper:
            found_skills.append(skill)

    data['skills'] = found_skills

    # Extract companies (lines with common company indicators)
    company_indicators = ['Inc', 'LLC', 'Corp', 'Company', 'Technologies', 'Systems', 'Solutions']
    companies = []
    for line in lines:
        line = line.strip()
        if any(indicator in line for indicator in company_indicators):
            companies.append(line)

    data['company_names'] = companies[:3]  # Limit to 3

    # Extract education (lines with degree keywords)
    degree_keywords = ['Bachelor', 'Master', 'PhD', 'Degree', 'University', 'College']
    degrees = []
    colleges = []

    for line in lines:
        line = line.strip()
        if any(keyword in line for keyword in degree_keywords):
            if 'University' in line or 'College' in line:
                colleges.append(line)
            else:
                degrees.append(line)

    data['degree'] = degrees[:2]
    data['college_name'] = colleges[:2]

    return data

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'resume_parsing_enabled': RESUME_PARSING_ENABLED,
        'pyresparser_available': PYRESPARSER_AVAILABLE,
        'message': 'Resume parsing temporarily disabled for testing',
        'supported_formats': {
            'txt': True,
            'pdf': True,
            'docx': True
        },
        'features': {
            'core_functionality': True,
            'resume_parsing': RESUME_PARSING_ENABLED,
            'portfolio_generation': True
        }
    })

# Resume parsing temporarily disabled for testing
# @app.route('/parse-resume', methods=['POST'])
def parse_resume_disabled():
    """Resume parsing temporarily disabled for testing"""
    return jsonify({
        'error': 'Resume parsing temporarily disabled for testing',
        'success': False,
        'message': 'This feature will be re-enabled after core functionality testing'
    }), 503

# Resume text parsing temporarily disabled for testing
# @app.route('/parse-resume-text', methods=['POST'])
def parse_resume_text_disabled():
    """Resume text parsing temporarily disabled for testing"""
    return jsonify({
        'error': 'Resume text parsing temporarily disabled for testing',
        'success': False,
        'message': 'This feature will be re-enabled after core functionality testing'
    }), 503


if __name__ == '__main__':
    print(f"Starting Flask server...")
    print(f"pyresparser available: {PYRESPARSER_AVAILABLE}")
    app.run(debug=True, host='0.0.0.0', port=5000)
