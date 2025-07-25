#!/usr/bin/env python3
"""
Setup script for Portfolio Maker Python Backend
This script installs all required dependencies for pyresparser
"""

import subprocess
import sys
import os

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"\n🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, check=True, capture_output=True, text=True)
        print(f"✅ {description} completed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {description} failed:")
        print(f"Error: {e.stderr}")
        return False

def main():
    print("🚀 Setting up Portfolio Maker Python Backend")
    print("=" * 50)
    
    # Check Python version
    python_version = sys.version_info
    if python_version.major < 3 or (python_version.major == 3 and python_version.minor < 7):
        print("❌ Python 3.7 or higher is required")
        sys.exit(1)
    
    print(f"✅ Python {python_version.major}.{python_version.minor}.{python_version.micro} detected")
    
    # Install pip requirements
    if not run_command("pip install -r requirements.txt", "Installing Python packages"):
        print("❌ Failed to install Python packages")
        sys.exit(1)
    
    # Download spaCy model
    if not run_command("python -m spacy download en_core_web_sm", "Downloading spaCy English model"):
        print("⚠️  Warning: spaCy model download failed. You may need to run this manually:")
        print("   python -m spacy download en_core_web_sm")
    
    # Download NLTK data
    print("\n🔄 Downloading NLTK data...")
    try:
        import nltk
        nltk.download('words', quiet=True)
        nltk.download('stopwords', quiet=True)
        print("✅ NLTK data downloaded successfully")
    except Exception as e:
        print(f"⚠️  Warning: NLTK data download failed: {e}")
        print("   You may need to run this manually in Python:")
        print("   import nltk; nltk.download('words'); nltk.download('stopwords')")
    
    print("\n🎉 Setup completed!")
    print("\nTo start the server, run:")
    print("   python app.py")
    print("\nThe server will be available at: http://localhost:5000")

if __name__ == "__main__":
    main()
