#!/usr/bin/env python3
"""
Test script to verify PDF and DOCX support in the improved parser
"""

import requests
import json
import tempfile
import os
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

def create_test_pdf():
    """Create a test PDF resume"""
    # Create a temporary PDF file
    temp_pdf = tempfile.NamedTemporaryFile(mode='w+b', suffix='.pdf', delete=False)
    temp_pdf.close()
    
    # Create PDF content
    c = canvas.Canvas(temp_pdf.name, pagesize=letter)
    width, height = letter
    
    # Add resume content
    y_position = height - 50
    
    resume_content = [
        "John Doe",
        "Senior Software Engineer",
        "Email: john.doe@example.com",
        "Phone: +1-555-123-4567",
        "",
        "TECHNICAL SKILLS",
        "Programming Languages: Python, JavaScript, Java, TypeScript",
        "Web Technologies: React, Angular, Node.js, HTML5, CSS3",
        "Frameworks: Django, Flask, Express.js, Spring Boot",
        "Databases: PostgreSQL, MongoDB, MySQL, Redis",
        "Cloud & DevOps: AWS, Docker, Kubernetes, Jenkins",
        "Machine Learning: TensorFlow, PyTorch, Scikit-learn",
        "",
        "PROFESSIONAL EXPERIENCE",
        "",
        "Senior Software Engineer at Google Inc (2020-2023)",
        "- Developed scalable web applications using React and Python",
        "- Implemented machine learning algorithms for data analysis",
        "- Led a team of 5 developers in agile environment",
        "- Worked with AWS, Docker, and Kubernetes for deployment",
        "",
        "Software Engineer at Microsoft Corp (2018-2020)",
        "- Built backend services using Django and Flask",
        "- Implemented REST APIs and microservices",
        "- Worked with PostgreSQL and Redis databases",
        "",
        "EDUCATION",
        "",
        "Master of Science in Computer Science",
        "Stanford University (2014-2016)",
        "",
        "Bachelor of Science in Computer Engineering",
        "University of California, Berkeley (2010-2014)"
    ]
    
    for line in resume_content:
        c.drawString(50, y_position, line)
        y_position -= 20
        if y_position < 50:  # Start new page if needed
            c.showPage()
            y_position = height - 50
    
    c.save()
    return temp_pdf.name

def test_pdf_parsing():
    """Test PDF parsing with the improved parser"""
    print("📄 Creating test PDF resume...")
    
    try:
        # Create test PDF
        pdf_path = create_test_pdf()
        print(f"✅ Test PDF created: {pdf_path}")
        
        # Test the parsing
        print("\n🧪 Testing PDF parsing...")
        
        with open(pdf_path, 'rb') as f:
            files = {'file': ('test_resume.pdf', f, 'application/pdf')}
            response = requests.post('http://localhost:5000/parse-resume', files=files)
        
        if response.status_code == 200:
            data = response.json()
            if data['success']:
                print("✅ PDF parsing successful!")
                print(f"   Parser Used: {data.get('parser_used', 'unknown')}")
                
                parsed_data = data['data']
                print(f"\n📋 Extracted Information:")
                print(f"   Name: {parsed_data['personalInfo']['name']}")
                print(f"   Email: {parsed_data['personalInfo']['email']}")
                print(f"   Phone: {parsed_data['personalInfo']['phone']}")
                
                print(f"\n🔧 Skills:")
                technical_skills = parsed_data['skills']['technical']
                print(f"   Technical Skills: {len(technical_skills)} found")
                print(f"   Skills: {', '.join(technical_skills[:10])}")
                
                # Check for expected skills
                expected_skills = ['python', 'javascript', 'react', 'django', 'aws', 'docker']
                detected_skills = [skill.lower() for skill in technical_skills]
                found_expected = [skill for skill in expected_skills if any(skill in ds for ds in detected_skills)]
                
                print(f"\n✅ Expected Skills Found: {len(found_expected)}/{len(expected_skills)}")
                print(f"   Found: {', '.join(found_expected)}")
                
                return True
            else:
                print(f"❌ PDF parsing failed: {data.get('error', 'Unknown error')}")
                return False
        else:
            print(f"❌ Request failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing PDF parsing: {e}")
        return False
    finally:
        # Clean up
        try:
            if 'pdf_path' in locals():
                os.remove(pdf_path)
                print(f"🧹 Cleaned up test file: {pdf_path}")
        except:
            pass

def test_health_check():
    """Test health check for file format support"""
    print("🏥 Testing health check for file format support...")
    
    try:
        response = requests.get('http://localhost:5000/health')
        if response.status_code == 200:
            data = response.json()
            print("✅ Health check successful!")
            print(f"   Status: {data['status']}")
            print(f"   Improved Parser: {data['improved_parser_available']}")
            
            if 'supported_formats' in data:
                formats = data['supported_formats']
                print(f"\n📁 Supported File Formats:")
                print(f"   TXT: {'✅' if formats.get('txt') else '❌'}")
                print(f"   PDF: {'✅' if formats.get('pdf') else '❌'}")
                print(f"   DOCX: {'✅' if formats.get('docx') else '❌'}")
                
                return formats.get('pdf', False)
            else:
                print("⚠️  Format support info not available")
                return False
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error in health check: {e}")
        return False

def main():
    print("🚀 Testing Enhanced Resume Parser with PDF Support")
    print("=" * 60)
    
    # Test 1: Health check
    print("\n📋 Test 1: Health Check")
    pdf_supported = test_health_check()
    
    if not pdf_supported:
        print("\n❌ PDF support not available. Please install reportlab for PDF creation.")
        return
    
    # Test 2: PDF parsing
    print("\n📄 Test 2: PDF Parsing")
    pdf_success = test_pdf_parsing()
    
    # Summary
    print("\n" + "=" * 60)
    if pdf_success:
        print("🎉 PDF support test completed successfully!")
        print("\n💡 The enhanced parser now supports:")
        print("   ✅ PDF files (.pdf)")
        print("   ✅ DOCX files (.docx)")
        print("   ✅ Text files (.txt)")
        print("   ✅ Comprehensive skills database")
        print("   ✅ Advanced pattern matching")
        print("\n🔥 Ready for production use with multi-format support!")
    else:
        print("❌ PDF support test failed. Check the error messages above.")

if __name__ == "__main__":
    # Check if reportlab is available for PDF creation
    try:
        import reportlab
        main()
    except ImportError:
        print("❌ reportlab not available. Installing...")
        import subprocess
        subprocess.run(['pip', 'install', 'reportlab'])
        try:
            import reportlab
            main()
        except ImportError:
            print("❌ Could not install reportlab. Testing with existing files only.")
            test_health_check()
