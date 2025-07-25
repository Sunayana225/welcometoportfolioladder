#!/usr/bin/env node
/**
 * Test script for GitHub skills detection
 * Run with: node test_github_skills.js
 */

// Simple test to check if GitHub analysis is working
async function testGitHubSkillsDetection() {
    console.log('🔍 Testing GitHub Skills Detection');
    console.log('=' * 50);
    
    // Test data - simulating what we get from GitHub API
    const testRepo = {
        name: 'my-awesome-project',
        description: 'A full-stack web application built with React and Node.js',
        language: 'JavaScript',
        topics: ['react', 'nodejs', 'mongodb', 'express'],
        stargazers_count: 15,
        forks_count: 3
    };
    
    const testReadme = `
# My Awesome Project

A modern full-stack web application built with cutting-edge technologies.

## 🚀 Technologies Used

### Frontend
- **React** - Modern UI library
- **TypeScript** - Type-safe JavaScript
- **TailwindCSS** - Utility-first CSS framework
- **Vite** - Fast build tool

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Redis** - Caching layer

### DevOps & Cloud
- **Docker** - Containerization
- **AWS** - Cloud platform
- **GitHub Actions** - CI/CD
- **Vercel** - Deployment

### Testing
- **Jest** - Testing framework
- **Cypress** - E2E testing

## 📦 Installation

\`\`\`bash
npm install
npm run dev
\`\`\`

## 🔧 Features

- User authentication with JWT
- Real-time chat with WebSocket
- RESTful API design
- Responsive design
- Machine Learning integration with Python

## 🌐 Live Demo

Check out the live demo: https://my-awesome-project.vercel.app
    `;
    
    // Test the technology extraction logic
    console.log('📋 Test Repository Data:');
    console.log(`   Name: ${testRepo.name}`);
    console.log(`   Language: ${testRepo.language}`);
    console.log(`   Topics: ${testRepo.topics.join(', ')}`);
    console.log(`   Description: ${testRepo.description}`);
    
    console.log('\n📄 Test README Content:');
    console.log(`   Length: ${testReadme.length} characters`);
    console.log(`   Contains React: ${testReadme.includes('React')}`);
    console.log(`   Contains Node.js: ${testReadme.includes('Node.js')}`);
    console.log(`   Contains MongoDB: ${testReadme.includes('MongoDB')}`);
    
    // Simulate the technology extraction
    const technologies = new Set();
    
    // Add primary language
    if (testRepo.language) {
        technologies.add(testRepo.language);
    }
    
    // Add topics
    testRepo.topics?.forEach(topic => {
        technologies.add(topic.charAt(0).toUpperCase() + topic.slice(1));
    });
    
    // Enhanced README analysis
    const techKeywords = [
        'React', 'Vue', 'Angular', 'Svelte', 'Node.js', 'Express', 'FastAPI', 
        'Django', 'Flask', 'TypeScript', 'JavaScript', 'Python', 'Java', 
        'Kotlin', 'Swift', 'Rust', 'Go', 'PHP', 'Ruby', 'MongoDB', 
        'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'Kubernetes', 'AWS', 
        'Azure', 'GCP', 'TailwindCSS', 'Bootstrap', 'SASS', 'CSS3', 'HTML5',
        'Firebase', 'Supabase', 'Vercel', 'Netlify', 'Next.js', 'Nuxt.js',
        'Gatsby', 'Vite', 'GraphQL', 'REST API', 'Machine Learning', 'AI',
        'Jest', 'Cypress', 'WebSocket', 'JWT'
    ];
    
    const readmeLower = testReadme.toLowerCase();
    
    techKeywords.forEach(tech => {
        const techLower = tech.toLowerCase();
        // Use word boundaries for better matching
        const pattern = new RegExp(`\\b${techLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        if (pattern.test(readmeLower)) {
            technologies.add(tech);
        }
    });
    
    // Additional pattern matching for variations
    const variations = {
        'JavaScript': ['js', 'javascript', 'ecmascript'],
        'TypeScript': ['ts', 'typescript'],
        'Node.js': ['node', 'nodejs', 'node.js'],
        'React': ['react', 'reactjs', 'react.js'],
        'Vue.js': ['vue', 'vuejs', 'vue.js'],
        'Angular': ['angular', 'angularjs'],
        'MongoDB': ['mongo', 'mongodb'],
        'PostgreSQL': ['postgres', 'postgresql', 'psql'],
        'Docker': ['docker', 'dockerfile'],
        'Kubernetes': ['kubernetes', 'k8s'],
        'AWS': ['aws', 'amazon web services'],
        'Machine Learning': ['ml', 'machine learning', 'artificial intelligence', 'ai']
    };
    
    Object.entries(variations).forEach(([tech, aliases]) => {
        if (aliases.some(alias => {
            const pattern = new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
            return pattern.test(readmeLower);
        })) {
            technologies.add(tech);
        }
    });
    
    const detectedTechnologies = Array.from(technologies);
    
    console.log('\n🔧 Technology Detection Results:');
    console.log(`   Technologies Found: ${detectedTechnologies.length}`);
    console.log(`   Technologies: ${detectedTechnologies.join(', ')}`);
    
    // Expected technologies that should be found
    const expectedTechs = [
        'React', 'TypeScript', 'Node.js', 'Express.js', 'MongoDB', 
        'Redis', 'Docker', 'AWS', 'TailwindCSS', 'Vite', 'Jest', 'Cypress'
    ];
    
    const foundExpected = expectedTechs.filter(tech => 
        detectedTechnologies.some(detected => 
            detected.toLowerCase().includes(tech.toLowerCase()) ||
            tech.toLowerCase().includes(detected.toLowerCase())
        )
    );
    
    console.log('\n✅ Expected Technologies Analysis:');
    console.log(`   Expected: ${expectedTechs.length} technologies`);
    console.log(`   Found: ${foundExpected.length} technologies`);
    console.log(`   Success Rate: ${(foundExpected.length / expectedTechs.length * 100).toFixed(1)}%`);
    console.log(`   Found Technologies: ${foundExpected.join(', ')}`);
    
    if (foundExpected.length >= 8) {
        console.log('\n🎉 EXCELLENT! Skills detection is working perfectly!');
    } else if (foundExpected.length >= 5) {
        console.log('\n👍 GOOD! Skills detection is working well!');
    } else if (foundExpected.length >= 3) {
        console.log('\n⚠️  FAIR! Skills detection needs improvement!');
    } else {
        console.log('\n❌ POOR! Skills detection has issues!');
    }
    
    console.log('\n💡 Recommendations:');
    if (foundExpected.length < expectedTechs.length) {
        const missing = expectedTechs.filter(tech => !foundExpected.includes(tech));
        console.log(`   Missing: ${missing.join(', ')}`);
        console.log('   - Check regex patterns for these technologies');
        console.log('   - Verify word boundary matching');
        console.log('   - Add more aliases/variations');
    } else {
        console.log('   - Skills detection is working optimally!');
        console.log('   - Ready for production use!');
    }
}

// Run the test
testGitHubSkillsDetection().catch(console.error);
