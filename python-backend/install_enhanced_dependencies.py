#!/usr/bin/env python3
"""
Install enhanced dependencies for PDF parsing with hyperlink support
"""

import subprocess
import sys
import os

def install_package(package):
    """Install a package using pip"""
    try:
        print(f"Installing {package}...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", package])
        print(f"✅ {package} installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install {package}: {e}")
        return False

def main():
    print("🚀 Installing Enhanced PDF Parser Dependencies")
    print("=" * 50)
    
    # List of packages to install
    packages = [
        "pdfplumber==0.10.3",
        "pymupdf==1.23.26",
        "reportlab==4.0.7"  # For testing
    ]
    
    success_count = 0
    
    for package in packages:
        if install_package(package):
            success_count += 1
        print()
    
    print(f"📊 Installation Summary: {success_count}/{len(packages)} packages installed successfully")
    
    if success_count == len(packages):
        print("\n🎉 All dependencies installed successfully!")
        print("\n💡 Enhanced features now available:")
        print("   ✅ pdfplumber - Advanced PDF text extraction")
        print("   ✅ PyMuPDF - Hyperlink extraction from PDFs")
        print("   ✅ reportlab - PDF generation for testing")
        print("\n🚀 You can now run the enhanced parser!")
        print("   Test with: python test_enhanced_parser.py")
    else:
        print(f"\n⚠️  {len(packages) - success_count} package(s) failed to install.")
        print("   Please check the error messages above and try again.")

if __name__ == "__main__":
    main()
