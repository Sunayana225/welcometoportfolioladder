# Portfolio Maker - Python Backend

This Python backend service provides advanced resume parsing capabilities using the `pyresparser` library.

## Features

- 📄 **Multi-format Support**: PDF, DOCX, DOC, and TXT files
- 🤖 **AI-Powered Parsing**: Uses NLP to extract structured data
- 🔍 **Comprehensive Extraction**: 
  - Personal information (name, email, phone)
  - Work experience and designations
  - Education and degrees
  - Skills and technologies
  - Company names
- 🌐 **REST API**: Easy integration with the frontend
- 🚀 **Fast Processing**: Optimized for quick resume analysis

## Installation

### Prerequisites

- Python 3.7 or higher
- pip (Python package manager)

### Quick Setup

1. **Navigate to the Python backend directory:**
   ```bash
   cd python-backend
   ```

2. **Run the setup script:**
   ```bash
   python setup.py
   ```

   This will automatically:
   - Install all required Python packages
   - Download the spaCy English language model
   - Download required NLTK data

### Manual Setup (if automatic setup fails)

1. **Install Python packages:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Download spaCy model:**
   ```bash
   python -m spacy download en_core_web_sm
   ```

3. **Download NLTK data:**
   ```python
   python -c "import nltk; nltk.download('words'); nltk.download('stopwords')"
   ```

## Usage

### Starting the Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

### API Endpoints

#### 1. Health Check
```
GET /health
```

Response:
```json
{
  "status": "healthy",
  "pyresparser_available": true
}
```

#### 2. Parse Resume File
```
POST /parse-resume
Content-Type: multipart/form-data
```

Parameters:
- `file`: Resume file (PDF, DOCX, DOC, or TXT)

Response:
```json
{
  "success": true,
  "data": {
    "personalInfo": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "location": "",
      "linkedin": "",
      "github": "",
      "website": ""
    },
    "experience": [...],
    "education": [...],
    "skills": {...},
    "projects": [...],
    "certifications": [...]
  },
  "raw_data": {...}
}
```

#### 3. Parse Resume Text
```
POST /parse-resume-text
Content-Type: application/json
```

Body:
```json
{
  "text": "Resume content as text..."
}
```

## Integration with Frontend

The frontend can use this service as a fallback or primary parser:

```typescript
// Example integration
const parseResumeWithPyresparser = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch('http://localhost:5000/parse-resume', {
    method: 'POST',
    body: formData
  });
  
  const result = await response.json();
  return result.data;
};
```

## Troubleshooting

### Common Issues

1. **spaCy model not found:**
   ```bash
   python -m spacy download en_core_web_sm
   ```

2. **NLTK data missing:**
   ```python
   import nltk
   nltk.download('words')
   nltk.download('stopwords')
   ```

3. **Permission errors on Windows:**
   - Run command prompt as Administrator
   - Or use `pip install --user`

4. **Memory issues with large files:**
   - The service limits files to 16MB
   - For larger files, consider preprocessing

### Performance Tips

- Keep the server running for faster subsequent requests
- Use SSD storage for temporary file operations
- Ensure adequate RAM (minimum 2GB recommended)

## Dependencies

- **pyresparser**: Core resume parsing library
- **spacy**: Natural language processing
- **nltk**: Additional NLP tools
- **flask**: Web framework
- **flask-cors**: Cross-origin resource sharing
- **python-docx**: DOCX file processing
- **PyPDF2**: PDF file processing

## License

This backend service is part of the Portfolio Maker project.
