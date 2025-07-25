#!/bin/bash

echo "Starting Portfolio Maker Python Backend..."
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed"
    echo "Please install Python 3.7 or higher"
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install requirements if needed
if [ ! -f "venv/lib/python*/site-packages/flask" ]; then
    echo "Installing requirements..."
    pip install -r requirements.txt
    
    echo "Downloading spaCy model..."
    python -m spacy download en_core_web_sm
    
    echo "Downloading NLTK data..."
    python -c "import nltk; nltk.download('words', quiet=True); nltk.download('stopwords', quiet=True)"
fi

# Start the server
echo
echo "Starting Flask server on http://localhost:5000"
echo "Press Ctrl+C to stop the server"
echo
python app.py
