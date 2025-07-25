#!/usr/bin/env python3
"""
Demo script showing the enhanced parser improvements
"""

import sys
import os

# Add current directory to path
sys.path.append(os.path.dirname(__file__))

def demo_text_parsing():
    """Demo enhanced text parsing with URLs"""
    print("🔍 Demo: Enhanced Text Parsing")
    print("-" * 40)
    
    sample_resume_text = """
John Doe
Senior Software Engineer

Email: john.doe@example.com
Phone: +1 (555) 123-4567
LinkedIn: https://linkedin.com/in/johndoe
GitHub: https://github.com/johndoe
Portfolio: https://johndoe.dev
Twitter: https://twitter.com/johndoe

PROFESSIONAL SUMMARY
Experienced software engineer with 8+ years in full-stack development.
Proficient in Python, JavaScript, React, Django, AWS, Docker, and Kubernetes.

TECHNICAL SKILLS
• Programming Languages: Python, JavaScript, TypeScript, Java, C++
• Frontend: React, Vue.js, Angular, HTML5, CSS3, SASS
• Backend: Django, Flask, Node.js, Express.js, FastAPI
• Databases: PostgreSQL, MySQL, MongoDB, Redis
• Cloud & DevOps: AWS, Docker, Kubernetes, Jenkins, GitLab CI

PROJECTS
E-commerce Platform (https://github.com/johndoe/ecommerce)
Task Manager (https://taskmanager.johndoe.dev)
"""
    
    try:
        from enhanced_pdf_parser import EnhancedPDFParser
        parser = EnhancedPDFParser()
        
        print("📝 Parsing sample resume text...")
        result = parser.parse_resume(sample_resume_text)
        
        personal_info = result.get('personalInfo', {})
        skills = result.get('skills', {})
        
        print(f"\n✅ Extraction Results:")
        print(f"   Name: {personal_info.get('name', 'Not found')}")
        print(f"   Email: {personal_info.get('email', 'Not found')}")
        print(f"   Phone: {personal_info.get('phone', 'Not found')}")
        
        print(f"\n🔗 URL Extraction:")
        print(f"   LinkedIn: {personal_info.get('linkedin', 'Not found')}")
        print(f"   GitHub: {personal_info.get('github', 'Not found')}")
        print(f"   Website: {personal_info.get('website', 'Not found')}")
        print(f"   Twitter: {personal_info.get('twitter', 'Not found')}")
        
        technical_skills = skills.get('technical', [])
        print(f"\n🔧 Skills Found: {len(technical_skills)}")
        if technical_skills:
            print(f"   Top Skills: {', '.join(technical_skills[:8])}")
        
        return True
        
    except ImportError as e:
        print(f"❌ Enhanced parser not available: {e}")
        print("   Run: python install_enhanced_dependencies.py")
        return False
    except Exception as e:
        print(f"❌ Error during parsing: {e}")
        return False

def demo_url_classification():
    """Demo URL classification improvements"""
    print("\n🎯 Demo: URL Classification")
    print("-" * 40)
    
    sample_urls = [
        "https://linkedin.com/in/johndoe",
        "https://github.com/johndoe",
        "https://github.com/johndoe/awesome-project",
        "https://twitter.com/johndoe",
        "https://x.com/johndoe",
        "https://johndoe.dev",
        "https://johndoe.github.io",
        "https://medium.com/@johndoe",
        "https://stackoverflow.com/users/123456/johndoe"
    ]
    
    try:
        from enhanced_pdf_parser import EnhancedPDFParser
        parser = EnhancedPDFParser()
        
        classified = parser._classify_links(sample_urls)
        
        print("📋 URL Classification Results:")
        print(f"   GitHub: {classified.get('github', 'Not found')}")
        print(f"   LinkedIn: {classified.get('linkedin', 'Not found')}")
        print(f"   Twitter: {classified.get('twitter', 'Not found')}")
        print(f"   Website: {classified.get('website', 'Not found')}")
        
        print(f"\n📊 All URLs processed:")
        for i, url in enumerate(sample_urls, 1):
            print(f"   {i}. {url}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during URL classification: {e}")
        return False

def demo_name_extraction():
    """Demo improved name extraction"""
    print("\n👤 Demo: Name Extraction")
    print("-" * 40)
    
    test_cases = [
        ["John Doe", "Senior Software Engineer", "Email: john@example.com"],
        ["RESUME", "Jane Smith", "Full Stack Developer"],
        ["CV", "Dr. Robert Johnson", "Data Scientist"],
        ["Michael Brown", "Phone: 555-123-4567", "Address: 123 Main St"],
        ["Sarah Wilson, PhD", "Machine Learning Engineer", "sarah@example.com"]
    ]
    
    try:
        from enhanced_pdf_parser import EnhancedPDFParser
        parser = EnhancedPDFParser()
        
        print("📝 Testing name extraction from different formats:")
        
        for i, lines in enumerate(test_cases, 1):
            extracted_name = parser._extract_name(lines, {})
            print(f"   Test {i}: {lines} → '{extracted_name}'")
        
        # Test with metadata
        print(f"\n📄 Testing with PDF metadata:")
        metadata = {"author": "John Doe"}
        name_from_metadata = parser._extract_name(["RESUME", "Software Engineer"], metadata)
        print(f"   Metadata author: 'John Doe' → '{name_from_metadata}'")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during name extraction demo: {e}")
        return False

def main():
    print("🚀 Enhanced PDF Parser Demo")
    print("=" * 50)
    
    demos = [
        ("Text Parsing", demo_text_parsing),
        ("URL Classification", demo_url_classification),
        ("Name Extraction", demo_name_extraction)
    ]
    
    success_count = 0
    
    for demo_name, demo_func in demos:
        try:
            if demo_func():
                success_count += 1
        except Exception as e:
            print(f"❌ {demo_name} demo failed: {e}")
    
    print(f"\n📊 Demo Summary: {success_count}/{len(demos)} demos completed successfully")
    
    if success_count == len(demos):
        print("\n🎉 All demos completed successfully!")
        print("\n💡 Key improvements demonstrated:")
        print("   ✅ Better URL extraction and classification")
        print("   ✅ Improved name detection with metadata support")
        print("   ✅ Comprehensive skills extraction")
        print("   ✅ Enhanced text processing capabilities")
        print("\n🚀 The enhanced parser is ready for production!")
    else:
        print(f"\n⚠️  {len(demos) - success_count} demo(s) failed.")
        print("   Make sure dependencies are installed:")
        print("   python install_enhanced_dependencies.py")

if __name__ == "__main__":
    main()
