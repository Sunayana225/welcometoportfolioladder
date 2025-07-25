@echo off
echo Starting Portfolio Maker Python Backend...
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.7 or higher from https://python.org
    pause
    exit /b 1
)

REM Check if virtual environment exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo Activating virtual environment...
call venv\Scripts\activate.bat

REM Install requirements if needed
if not exist "venv\Lib\site-packages\flask" (
    echo Installing requirements...
    pip install -r requirements.txt
    
    echo Downloading spaCy model...
    python -m spacy download en_core_web_sm
    
    echo Downloading NLTK data...
    python -c "import nltk; nltk.download('words', quiet=True); nltk.download('stopwords', quiet=True)"
)

REM Start the server
echo.
echo Starting Flask server on http://localhost:5000
echo Press Ctrl+C to stop the server
echo.
python app.py
