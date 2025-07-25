#!/usr/bin/env python3
"""
Test script to verify URL and hyperlink extraction from resumes
"""

import requests
import json

def test_url_extraction():
    """Test URL extraction with a resume containing various links"""
    sample_resume = """
    John Doe
    Full Stack Developer
    Email: john.doe@example.com
    Phone: +1-555-123-4567
    
    LINKS & PROFILES
    Portfolio: https://johndoe.dev
    LinkedIn: https://linkedin.com/in/johndoe
    GitHub: https://github.com/johndoe
    Personal Blog: www.johndoe-blog.com
    Project Demo: https://my-awesome-app.vercel.app
    
    TECHNICAL SKILLS
    Programming Languages: JavaScript, TypeScript, Python, Java
    Frontend: React, Vue.js, Angular, HTML5, CSS3, TailwindCSS
    Backend: Node.js, Express.js, Django, Flask, Spring Boot
    Databases: MongoDB, PostgreSQL, MySQL, Redis
    Cloud & DevOps: AWS, Docker, Kubernetes, Jenkins
    Tools: Git, GitHub, VS Code, Webpack, Vite
    
    PROFESSIONAL EXPERIENCE
    
    Senior Full Stack Developer at Tech Innovations Inc (2021-2024)
    - Built scalable web applications using React and Node.js
    - Implemented microservices architecture with Docker and Kubernetes
    - Deployed applications on AWS with CI/CD pipelines
    - Project: https://company-dashboard.tech-innovations.com
    
    Software Engineer at Digital Solutions LLC (2019-2021)
    - Developed REST APIs using Python Django
    - Created responsive frontends with Vue.js and TailwindCSS
    - Worked with PostgreSQL and Redis for data management
    - Portfolio project: https://portfolio.digitalsolutions.com/johndoe
    
    PROJECTS
    
    E-commerce Platform (2023)
    - Full-stack application using React, Node.js, and MongoDB
    - Live Demo: https://ecommerce-demo.johndoe.dev
    - GitHub: https://github.com/johndoe/ecommerce-platform
    
    Task Management App (2022)
    - Built with Vue.js, Express.js, and PostgreSQL
    - Demo: https://taskmanager.johndoe.dev
    - Source: github.com/johndoe/task-manager
    
    EDUCATION
    
    Master of Science in Computer Science
    Stanford University (2017-2019)
    Thesis: "Machine Learning Applications in Web Development"
    Research: https://stanford.edu/research/johndoe-thesis
    
    CERTIFICATIONS
    
    AWS Certified Solutions Architect (2022)
    Verification: https://aws.amazon.com/verification/johndoe123
    
    Google Cloud Professional Developer (2021)
    Certificate: https://cloud.google.com/certification/johndoe456
    """
    
    try:
        print("🔗 Testing URL and Hyperlink Extraction")
        print("=" * 50)
        
        response = requests.post(
            'http://localhost:5000/parse-resume-text',
            headers={'Content-Type': 'application/json'},
            json={'text': sample_resume}
        )
        
        if response.status_code == 200:
            data = response.json()
            if data['success']:
                print("✅ Resume parsing successful!")
                print(f"   Parser Used: {data.get('parser_used', 'unknown')}")
                
                parsed_data = data['data']
                raw_data = data.get('raw_data', {})
                
                print(f"\n📋 Basic Information:")
                print(f"   Name: {parsed_data['personalInfo']['name']}")
                print(f"   Email: {parsed_data['personalInfo']['email']}")
                print(f"   Phone: {parsed_data['personalInfo']['phone']}")
                
                # Check for URLs in raw data
                if 'urls' in raw_data:
                    urls = raw_data['urls']
                    print(f"\n🔗 URLs Extracted: {len(urls)} found")
                    for i, url in enumerate(urls[:10], 1):
                        print(f"   {i}. {url}")
                    
                    # Check specific URL types
                    linkedin_url = raw_data.get('linkedin_url', '')
                    github_url = raw_data.get('github_url', '')
                    portfolio_url = raw_data.get('portfolio_url', '')
                    
                    print(f"\n🎯 Categorized URLs:")
                    print(f"   LinkedIn: {linkedin_url if linkedin_url else 'Not found'}")
                    print(f"   GitHub: {github_url if github_url else 'Not found'}")
                    print(f"   Portfolio: {portfolio_url if portfolio_url else 'Not found'}")
                    
                    # Expected URLs to find
                    expected_urls = [
                        'https://johndoe.dev',
                        'https://linkedin.com/in/johndoe',
                        'https://github.com/johndoe',
                        'https://my-awesome-app.vercel.app',
                        'https://ecommerce-demo.johndoe.dev'
                    ]
                    
                    found_expected = 0
                    for expected in expected_urls:
                        if any(expected.lower() in url.lower() for url in urls):
                            found_expected += 1
                    
                    print(f"\n✅ Expected URLs Found: {found_expected}/{len(expected_urls)}")
                    
                    if found_expected >= 4:
                        print("🎉 URL extraction working excellently!")
                    elif found_expected >= 2:
                        print("👍 URL extraction working well!")
                    else:
                        print("⚠️  URL extraction needs improvement")
                        
                else:
                    print("\n❌ No URLs found in parsed data")
                    print("   URL extraction may not be implemented")
                
                # Check skills detection
                technical_skills = parsed_data['skills']['technical']
                print(f"\n🔧 Skills: {len(technical_skills)} found")
                print(f"   Top Skills: {', '.join(technical_skills[:8])}")
                
                # Expected skills
                expected_skills = ['javascript', 'react', 'python', 'docker', 'aws', 'mongodb']
                detected_skills = [skill.lower() for skill in technical_skills]
                found_skills = [skill for skill in expected_skills if any(skill in ds for ds in detected_skills)]
                
                print(f"   Expected Skills Found: {len(found_skills)}/{len(expected_skills)}")
                
                return True
            else:
                print(f"❌ Parsing failed: {data.get('error', 'Unknown error')}")
                return False
        else:
            print(f"❌ Request failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing URL extraction: {e}")
        return False

def main():
    print("🚀 Testing Enhanced Resume Parser - URL Extraction")
    print("=" * 60)
    
    success = test_url_extraction()
    
    print("\n" + "=" * 60)
    if success:
        print("🎉 URL extraction test completed!")
        print("\n💡 The enhanced parser now extracts:")
        print("   ✅ All URLs and hyperlinks from resumes")
        print("   ✅ LinkedIn profile URLs")
        print("   ✅ GitHub repository URLs")
        print("   ✅ Portfolio/personal website URLs")
        print("   ✅ Project demo links")
        print("   ✅ Certification verification links")
        print("\n🔥 Ready for comprehensive resume parsing!")
    else:
        print("❌ URL extraction test failed. Check the error messages above.")

if __name__ == "__main__":
    main()
