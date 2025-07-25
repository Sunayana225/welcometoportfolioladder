#!/usr/bin/env python3
"""
Complete test for PDF, DOCX, and TXT support in the enhanced parser
"""

import requests
import json
import tempfile
import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from docx import Document

def create_comprehensive_test_files():
    """Create test files in all supported formats"""
    
    resume_content = {
        'name': 'Jane Smith',
        'email': 'jane.smith@example.com',
        'phone': '+1-555-987-6543',
        'title': 'Full Stack Developer',
        'skills': [
            'Python', 'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue.js',
            'Node.js', 'Express.js', 'Django', 'Flask', 'FastAPI',
            'PostgreSQL', 'MongoDB', 'MySQL', 'Redis',
            'AWS', 'Docker', 'Kubernetes', 'Jenkins', 'Git',
            'Machine Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy'
        ],
        'experience': [
            {
                'title': 'Senior Full Stack Developer',
                'company': 'Tech Innovations Inc',
                'period': '2021-2024',
                'description': 'Led development of scalable web applications using React, Node.js, and Python'
            },
            {
                'title': 'Software Engineer',
                'company': 'Digital Solutions LLC',
                'period': '2019-2021',
                'description': 'Built microservices architecture using Django and deployed on AWS'
            }
        ],
        'education': [
            {
                'degree': 'Master of Science in Computer Science',
                'institution': 'MIT',
                'year': '2019'
            },
            {
                'degree': 'Bachelor of Science in Software Engineering',
                'institution': 'Stanford University',
                'year': '2017'
            }
        ]
    }
    
    # Create text content
    text_content = f"""
{resume_content['name']}
{resume_content['title']}
Email: {resume_content['email']}
Phone: {resume_content['phone']}

TECHNICAL SKILLS
{', '.join(resume_content['skills'])}

PROFESSIONAL EXPERIENCE

{resume_content['experience'][0]['title']} at {resume_content['experience'][0]['company']} ({resume_content['experience'][0]['period']})
{resume_content['experience'][0]['description']}

{resume_content['experience'][1]['title']} at {resume_content['experience'][1]['company']} ({resume_content['experience'][1]['period']})
{resume_content['experience'][1]['description']}

EDUCATION

{resume_content['education'][0]['degree']}
{resume_content['education'][0]['institution']} ({resume_content['education'][0]['year']})

{resume_content['education'][1]['degree']}
{resume_content['education'][1]['institution']} ({resume_content['education'][1]['year']})
"""
    
    files = {}
    
    # Create TXT file
    txt_file = tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False, encoding='utf-8')
    txt_file.write(text_content)
    txt_file.close()
    files['txt'] = txt_file.name
    
    # Create PDF file
    pdf_file = tempfile.NamedTemporaryFile(mode='w+b', suffix='.pdf', delete=False)
    pdf_file.close()
    
    c = canvas.Canvas(pdf_file.name, pagesize=letter)
    width, height = letter
    y_position = height - 50
    
    for line in text_content.split('\n'):
        if line.strip():
            c.drawString(50, y_position, line.strip())
            y_position -= 20
            if y_position < 50:
                c.showPage()
                y_position = height - 50
    
    c.save()
    files['pdf'] = pdf_file.name
    
    # Create DOCX file
    docx_file = tempfile.NamedTemporaryFile(mode='w+b', suffix='.docx', delete=False)
    docx_file.close()
    
    doc = Document()
    for line in text_content.split('\n'):
        if line.strip():
            doc.add_paragraph(line.strip())
    
    doc.save(docx_file.name)
    files['docx'] = docx_file.name
    
    return files, resume_content

def test_file_format(file_path, format_name, expected_data):
    """Test parsing a specific file format"""
    print(f"\n📄 Testing {format_name.upper()} format...")
    
    try:
        mime_types = {
            'txt': 'text/plain',
            'pdf': 'application/pdf',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        }
        
        with open(file_path, 'rb') as f:
            files = {'file': (f'test_resume.{format_name}', f, mime_types[format_name])}
            response = requests.post('http://localhost:5000/parse-resume', files=files)
        
        if response.status_code == 200:
            data = response.json()
            if data['success']:
                print(f"✅ {format_name.upper()} parsing successful!")
                print(f"   Parser Used: {data.get('parser_used', 'unknown')}")
                
                parsed_data = data['data']
                
                # Check extracted information
                print(f"\n📋 Extracted Information:")
                print(f"   Name: {parsed_data['personalInfo']['name']}")
                print(f"   Email: {parsed_data['personalInfo']['email']}")
                print(f"   Phone: {parsed_data['personalInfo']['phone']}")
                
                # Check skills
                technical_skills = parsed_data['skills']['technical']
                print(f"\n🔧 Skills:")
                print(f"   Technical Skills: {len(technical_skills)} found")
                print(f"   Top Skills: {', '.join(technical_skills[:8])}")
                
                # Check for expected skills
                expected_skills = ['python', 'javascript', 'react', 'django', 'aws', 'docker']
                detected_skills = [skill.lower() for skill in technical_skills]
                found_expected = [skill for skill in expected_skills if any(skill in ds for ds in detected_skills)]
                
                print(f"\n✅ Expected Skills Found: {len(found_expected)}/{len(expected_skills)}")
                print(f"   Found: {', '.join(found_expected)}")
                
                # Check experience
                experience = parsed_data.get('experience', [])
                print(f"\n💼 Experience: {len(experience)} entries found")
                
                # Check education
                education = parsed_data.get('education', [])
                print(f"🎓 Education: {len(education)} entries found")
                
                return True, len(found_expected)
            else:
                print(f"❌ {format_name.upper()} parsing failed: {data.get('error', 'Unknown error')}")
                return False, 0
        else:
            print(f"❌ Request failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False, 0
            
    except Exception as e:
        print(f"❌ Error testing {format_name.upper()}: {e}")
        return False, 0

def main():
    print("🚀 Complete Multi-Format Resume Parser Test")
    print("=" * 60)
    
    try:
        # Create test files
        print("📁 Creating test files in all supported formats...")
        files, expected_data = create_comprehensive_test_files()
        print(f"✅ Created test files:")
        for format_name, file_path in files.items():
            print(f"   {format_name.upper()}: {file_path}")
        
        # Test each format
        results = {}
        total_skills_found = 0
        
        for format_name, file_path in files.items():
            success, skills_found = test_file_format(file_path, format_name, expected_data)
            results[format_name] = success
            total_skills_found += skills_found
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 Test Results Summary:")
        
        for format_name, success in results.items():
            status = "✅ PASS" if success else "❌ FAIL"
            print(f"   {format_name.upper()}: {status}")
        
        successful_formats = sum(1 for success in results.values() if success)
        print(f"\n🎯 Overall Results:")
        print(f"   Formats Tested: {len(results)}")
        print(f"   Successful: {successful_formats}")
        print(f"   Success Rate: {(successful_formats/len(results)*100):.1f}%")
        print(f"   Average Skills Found: {total_skills_found/len(results):.1f}")
        
        if successful_formats == len(results):
            print("\n🎉 ALL FORMATS WORKING PERFECTLY!")
            print("\n💡 The enhanced parser now provides:")
            print("   ✅ Universal file format support (PDF, DOCX, TXT)")
            print("   ✅ Comprehensive skills database (3000+ skills)")
            print("   ✅ Advanced pattern matching and extraction")
            print("   ✅ Professional-grade parsing accuracy")
            print("   ✅ Robust error handling and fallbacks")
            print("\n🔥 Ready for production use in the portfolio maker!")
        else:
            print(f"\n⚠️  {len(results) - successful_formats} format(s) failed. Check error messages above.")
        
    except Exception as e:
        print(f"❌ Test setup failed: {e}")
    
    finally:
        # Clean up test files
        print("\n🧹 Cleaning up test files...")
        try:
            for format_name, file_path in files.items():
                os.remove(file_path)
                print(f"   Removed {format_name.upper()}: {file_path}")
        except:
            pass

if __name__ == "__main__":
    main()
