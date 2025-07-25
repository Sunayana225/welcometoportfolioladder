#!/usr/bin/env python3
"""
Test script to verify pyresparser functionality
"""

import requests
import json
import tempfile
import os

def test_pyresparser_health():
    """Test if the backend is running and pyresparser is available"""
    try:
        response = requests.get('http://localhost:5000/health')
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Backend Status: {data['status']}")
            print(f"✅ pyresparser Available: {data['pyresparser_available']}")
            return data['pyresparser_available']
        else:
            print(f"❌ Backend not responding: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error connecting to backend: {e}")
        return False

def test_pyresparser_text():
    """Test pyresparser with sample resume text"""
    sample_resume = """
    John Doe
    Software Engineer
    Email: john.doe@example.com
    Phone: +1-555-123-4567
    
    EXPERIENCE
    Senior Software Engineer at Google (2020-2023)
    - Developed web applications using React and Node.js
    - Worked with Python, JavaScript, and TypeScript
    - Led a team of 5 developers
    
    Software Engineer at Microsoft (2018-2020)
    - Built scalable backend services using Python and Django
    - Implemented REST APIs and microservices
    
    EDUCATION
    Bachelor of Science in Computer Science
    Stanford University (2014-2018)
    
    SKILLS
    Programming Languages: Python, JavaScript, TypeScript, Java
    Frameworks: React, Node.js, Django, Flask
    Databases: PostgreSQL, MongoDB, Redis
    Cloud: AWS, Azure, Docker, Kubernetes
    """
    
    try:
        response = requests.post(
            'http://localhost:5000/parse-resume-text',
            headers={'Content-Type': 'application/json'},
            json={'text': sample_resume}
        )
        
        if response.status_code == 200:
            data = response.json()
            if data['success']:
                print("✅ pyresparser text parsing successful!")
                print(f"   Name: {data['data']['personalInfo']['name']}")
                print(f"   Email: {data['data']['personalInfo']['email']}")
                print(f"   Phone: {data['data']['personalInfo']['phone']}")
                print(f"   Skills: {len(data['data']['skills']['technical'])} technical skills found")
                print(f"   Experience: {len(data['data']['experience'])} positions found")
                print(f"   Education: {len(data['data']['education'])} entries found")
                return True
            else:
                print(f"❌ Parsing failed: {data.get('error', 'Unknown error')}")
                return False
        else:
            print(f"❌ Request failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"❌ Error testing text parsing: {e}")
        return False

def main():
    print("🧪 Testing pyresparser Backend Integration")
    print("=" * 50)
    
    # Test 1: Health check
    print("\n📋 Test 1: Backend Health Check")
    health_ok = test_pyresparser_health()
    
    if not health_ok:
        print("❌ Backend not available. Make sure to run: python app.py")
        return
    
    # Test 2: Text parsing
    print("\n📄 Test 2: Resume Text Parsing")
    text_ok = test_pyresparser_text()
    
    # Summary
    print("\n" + "=" * 50)
    if health_ok and text_ok:
        print("🎉 All tests passed! pyresparser is working correctly.")
        print("\n💡 Next steps:")
        print("   1. Go to your portfolio maker application")
        print("   2. Navigate to the resume upload section")
        print("   3. You should now see 'pyresparser: Available' status")
        print("   4. Upload a resume and use the enhanced parsing!")
    else:
        print("❌ Some tests failed. Check the error messages above.")

if __name__ == "__main__":
    main()
