import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { PortfolioData } from '@/types/portfolio';

// Generate HTML template for the portfolio
export function generatePortfolioHTML(data: PortfolioData): string {
  const { personalInfo, socialLinks, skills, projects, experience, education, certifications, theme } = data;

  const getThemeColors = () => {
    switch (theme) {
      case 'modern':
        return {
          primary: '#667eea',
          secondary: '#764ba2',
          accent: '#4facfe',
          background: '#ffffff',
          text: '#2d3748',
          cardBackground: '#f8fafc',
          divider: '#e2e8f0',
          hover: '#edf2f7',
        };
      case 'creative':
        return {
          primary: '#ff6b6b',
          secondary: '#4ecdc4',
          accent: '#45b7d1',
          background: '#f8f9fa',
          text: '#2c3e50',
          cardBackground: '#ffffff',
          divider: '#dee2e6',
          hover: '#e9ecef',
        };
      case 'professional':
        return {
          primary: '#2c3e50',
          secondary: '#34495e',
          accent: '#3498db',
          background: '#ffffff',
          text: '#2c3e50',
          cardBackground: '#f8f9fa',
          divider: '#dee2e6',
          hover: '#e9ecef',
        };
      case 'dark':
        return {
          primary: '#bb86fc',
          secondary: '#03dac6',
          accent: '#cf6679',
          background: '#121212',
          text: '#ffffff',
          cardBackground: '#1e1e1e',
          divider: '#333333',
          hover: '#2a2a2a',
        };
      case 'pastel':
        return {
          primary: '#6B4F41',
          secondary: '#FDF6EE',
          accent: '#C4A484',
          background: '#FDF6EE',
          text: '#6B4F41',
          cardBackground: '#F5EDE3',
          divider: '#E8D5C4',
          hover: '#F2D3C2',
          heartGradient: 'linear-gradient(135deg, #FDF6EE 0%, #E8D5C4 100%)',
        };
      default:
        return {
          primary: '#667eea',
          secondary: '#764ba2',
          accent: '#4facfe',
          background: '#ffffff',
          text: '#2d3748',
          cardBackground: '#f8fafc',
          divider: '#e2e8f0',
          hover: '#edf2f7',
        };
    }
  };

  // Theme colors will be handled by CSS variables
  // const colors = getThemeColors();
  // const isDark = theme === 'dark';

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${personalInfo.fullName} - Portfolio</title>
    <meta name="description" content="${personalInfo.bio}">
    <meta name="keywords" content="portfolio, ${personalInfo.title}, ${skills.map(s => s.name).join(', ')}">
    <meta name="author" content="${personalInfo.fullName}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="">
    <meta property="og:title" content="${personalInfo.fullName} - Portfolio">
    <meta property="og:description" content="${personalInfo.bio}">
    ${personalInfo.profileImage ? `<meta property="og:image" content="${personalInfo.profileImage}">` : ''}
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image">
    <meta property="twitter:url" content="">
    <meta property="twitter:title" content="${personalInfo.fullName} - Portfolio">
    <meta property="twitter:description" content="${personalInfo.bio}">
    ${personalInfo.profileImage ? `<meta property="twitter:image" content="${personalInfo.profileImage}">` : ''}
    
    <link rel="stylesheet" href="styles.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <!-- Navigation -->
    <nav class="nav">
        <div class="nav-container">
            <div class="nav-brand">${personalInfo.fullName}</div>
            <div class="nav-links">
                <a href="#about">About</a>
                <a href="#skills">Skills</a>
                <a href="#projects">Projects</a>
                <a href="#experience">Experience</a>
                <a href="#education">Education</a>
                <a href="#contact">Contact</a>
            </div>
            <div class="nav-toggle">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="hero" class="hero">
        <div class="hero-content">
            ${personalInfo.profileImage ? `
            <div class="hero-image">
                <img src="${personalInfo.profileImage}" alt="${personalInfo.fullName}">
            </div>
            ` : ''}
            <h1 class="hero-title">${personalInfo.fullName}</h1>
            <h2 class="hero-subtitle">${personalInfo.title}</h2>
            <p class="hero-description">${personalInfo.bio}</p>
            
            <div class="hero-contact">
                <div class="contact-item">
                    <i class="fas fa-envelope"></i>
                    <span>${personalInfo.email}</span>
                </div>
                <div class="contact-item">
                    <i class="fas fa-phone"></i>
                    <span>${personalInfo.phone}</span>
                </div>
                <div class="contact-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${personalInfo.location}</span>
                </div>
            </div>
            
            <div class="hero-social">
                ${socialLinks.github ? `<a href="${socialLinks.github}" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i></a>` : ''}
                ${socialLinks.linkedin ? `<a href="${socialLinks.linkedin}" target="_blank" rel="noopener noreferrer"><i class="fab fa-linkedin"></i></a>` : ''}
                ${socialLinks.twitter ? `<a href="${socialLinks.twitter}" target="_blank" rel="noopener noreferrer"><i class="fab fa-twitter"></i></a>` : ''}
                ${socialLinks.website ? `<a href="${socialLinks.website}" target="_blank" rel="noopener noreferrer"><i class="fas fa-globe"></i></a>` : ''}
                ${socialLinks.instagram ? `<a href="${socialLinks.instagram}" target="_blank" rel="noopener noreferrer"><i class="fab fa-instagram"></i></a>` : ''}
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="section about-section">
        <div class="container">
            <h2 class="section-title">About Me</h2>
            <div class="about-content">
                <div class="about-text">
                    <p class="about-description">${personalInfo.bio}</p>

                    <div class="about-highlights">
                        <div class="highlight-item">
                            <i class="fas fa-user"></i>
                            <div>
                                <h4>Professional Title</h4>
                                <p>${personalInfo.title}</p>
                            </div>
                        </div>
                        <div class="highlight-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <div>
                                <h4>Location</h4>
                                <p>${personalInfo.location}</p>
                            </div>
                        </div>
                        <div class="highlight-item">
                            <i class="fas fa-envelope"></i>
                            <div>
                                <h4>Contact</h4>
                                <p><a href="mailto:${personalInfo.email}">${personalInfo.email}</a></p>
                            </div>
                        </div>
                    </div>
                </div>

                ${personalInfo.profileImage ? `
                <div class="about-image">
                    <img src="${personalInfo.profileImage}" alt="${personalInfo.fullName}">
                </div>
                ` : ''}
            </div>
        </div>
    </section>

    <!-- Skills Section -->
    ${skills.length > 0 ? `
    <section id="skills" class="section">
        <div class="container">
            <h2 class="section-title">Skills & Expertise</h2>

            <!-- Compact Skills Layout -->
            <div class="skills-compact">
                ${skills.map(skill => `
                <div class="skill-compact-item">
                    <div class="skill-compact-header">
                        <span class="skill-compact-name">${skill.name}</span>
                        <span class="skill-compact-level">${skill.level}%</span>
                    </div>
                    <div class="skill-compact-bar">
                        <div class="skill-compact-progress" style="width: ${skill.level}%"></div>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    <!-- Projects Section -->
    ${projects.length > 0 ? `
    <section id="projects" class="section">
        <div class="container">
            <h2 class="section-title">Featured Projects</h2>
            <div class="projects-grid">
                ${projects.filter(p => p.featured).concat(projects.filter(p => !p.featured)).slice(0, 6).map(project => `
                <div class="project-card">
                    ${project.imageUrl ? `<img src="${project.imageUrl}" alt="${project.title}" class="project-image">` : ''}
                    <div class="project-content">
                        <h3 class="project-title">
                            ${project.title}
                            ${project.featured ? '<i class="fas fa-star featured-star"></i>' : ''}
                        </h3>
                        <p class="project-description">${project.description}</p>
                        <div class="project-tech">
                            ${project.technologies.slice(0, 3).map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                        </div>
                        <div class="project-links">
                            ${project.liveUrl ? `<a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer"><i class="fas fa-external-link-alt"></i> Live Demo</a>` : ''}
                            ${project.githubUrl ? `<a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i> Code</a>` : ''}
                        </div>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    <!-- Experience Section -->
    ${experience.length > 0 ? `
    <section id="experience" class="section">
        <div class="container">
            <h2 class="section-title">Work Experience</h2>
            <div class="timeline">
                ${experience.map(exp => `
                <div class="timeline-item">
                    <div class="timeline-marker"></div>
                    <div class="timeline-content">
                        <h3 class="timeline-title">
                            ${exp.position}
                            ${exp.current ? '<span class="current-badge">Current</span>' : ''}
                        </h3>
                        <h4 class="timeline-company">${exp.company}</h4>
                        <div class="timeline-meta">
                            <span><i class="fas fa-calendar"></i> ${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate || '')}</span>
                            ${exp.location ? `<span><i class="fas fa-map-marker-alt"></i> ${exp.location}</span>` : ''}
                        </div>
                        ${exp.description ? `<p class="timeline-description">${exp.description}</p>` : ''}
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>
    ` : ''}

    <!-- Education & Certifications Section -->
    ${(education.length > 0 || certifications.length > 0) ? `
    <section id="education" class="section">
        <div class="container">
            <div class="education-grid">
                ${education.length > 0 ? `
                <div class="education-column">
                    <h2 class="section-title">Education</h2>
                    <div class="education-list">
                        ${education.map(edu => `
                        <div class="education-item">
                            <h3 class="education-degree">${edu.degree}</h3>
                            <h4 class="education-institution">${edu.institution}</h4>
                            <div class="education-meta">
                                ${formatDate(edu.startDate)} - ${edu.current ? 'Present' : formatDate(edu.endDate || '')}
                                ${edu.gpa ? ` • GPA: ${edu.gpa}` : ''}
                            </div>
                            ${edu.field ? `<p class="education-field">Field: ${edu.field}</p>` : ''}
                            ${edu.description ? `<p class="education-description">${edu.description}</p>` : ''}
                        </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                
                ${certifications.length > 0 ? `
                <div class="certifications-column">
                    <h2 class="section-title">Certifications</h2>
                    <div class="certifications-list">
                        ${certifications.map(cert => `
                        <div class="certification-item">
                            <h3 class="certification-name">${cert.name}</h3>
                            <h4 class="certification-issuer">${cert.issuer}</h4>
                            <div class="certification-meta">
                                Issued: ${formatDate(cert.date)}
                                ${cert.expiryDate ? ` • Expires: ${formatDate(cert.expiryDate)}` : ''}
                            </div>
                            ${cert.credentialUrl ? `<a href="${cert.credentialUrl}" target="_blank" rel="noopener noreferrer" class="certification-link">View Credential →</a>` : ''}
                        </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>
        </div>
    </section>
    ` : ''}

    <!-- Contact Section -->
    <section id="contact" class="section contact-section">
        <div class="container">
            <h2 class="section-title">Get In Touch</h2>
            <div class="contact-content">
                <div class="contact-info">
                    <h3>Let's work together!</h3>
                    <p>I'm always interested in new opportunities and exciting projects.</p>
                    
                    <div class="contact-details">
                        <div class="contact-detail">
                            <i class="fas fa-envelope"></i>
                            <a href="mailto:${personalInfo.email}">${personalInfo.email}</a>
                        </div>
                        <div class="contact-detail">
                            <i class="fas fa-phone"></i>
                            <a href="tel:${personalInfo.phone}">${personalInfo.phone}</a>
                        </div>
                        <div class="contact-detail">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${personalInfo.location}</span>
                        </div>
                    </div>
                    
                    <div class="contact-social">
                        ${socialLinks.github ? `<a href="${socialLinks.github}" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i></a>` : ''}
                        ${socialLinks.linkedin ? `<a href="${socialLinks.linkedin}" target="_blank" rel="noopener noreferrer"><i class="fab fa-linkedin"></i></a>` : ''}
                        ${socialLinks.twitter ? `<a href="${socialLinks.twitter}" target="_blank" rel="noopener noreferrer"><i class="fab fa-twitter"></i></a>` : ''}
                        ${socialLinks.website ? `<a href="${socialLinks.website}" target="_blank" rel="noopener noreferrer"><i class="fas fa-globe"></i></a>` : ''}
                        ${socialLinks.instagram ? `<a href="${socialLinks.instagram}" target="_blank" rel="noopener noreferrer"><i class="fab fa-instagram"></i></a>` : ''}
                    </div>
                </div>
                
                <!-- ============================================= -->
                <!-- CONTACT FORM ${personalInfo.formspreeId ? 'READY TO USE' : 'SETUP REQUIRED'} -->
                <!-- ============================================= -->
                ${personalInfo.formspreeId ? `
                <!-- ✅ Contact form is ready to use with your Formspree ID: ${personalInfo.formspreeId} -->
                ` : `
                <!-- ⚠️ SETUP REQUIRED: -->
                <!-- 1. Sign up at https://formspree.io (FREE) -->
                <!-- 2. Create a new form and get your Form ID -->
                <!-- 3. Replace 'your-form-id' below with your actual Formspree ID -->
                <!-- Example: https://formspree.io/f/xpzgkqyw -->
                `}
                <!-- ============================================= -->
                <form class="contact-form" action="https://formspree.io/f/${personalInfo.formspreeId || 'your-form-id'}" method="POST">
                    <div class="form-group">
                        <input type="text" name="name" placeholder="Your Name" required>
                    </div>
                    <div class="form-group">
                        <input type="email" name="email" placeholder="Your Email" required>
                    </div>
                    <div class="form-group">
                        <input type="text" name="subject" placeholder="Subject" required>
                    </div>
                    <div class="form-group">
                        <textarea name="message" placeholder="Your Message" rows="5" required></textarea>
                    </div>
                    <button type="submit" class="submit-btn">Send Message</button>
                </form>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} ${personalInfo.fullName}. All rights reserved.</p>
            <p>Built with ❤️ using Portfolio Maker</p>
        </div>
    </footer>

    <script src="script.js"></script>
</body>
</html>`;
}

// Generate CSS for the portfolio
export function generatePortfolioCSS(data: PortfolioData): string {
  const { theme } = data;

  const getThemeColors = () => {
    switch (theme) {
      case 'modern':
        return {
          primary: '#667eea',
          secondary: '#764ba2',
          accent: '#4facfe',
          background: '#ffffff',
          text: '#2d3748',
          cardBackground: '#f8fafc',
          divider: '#e2e8f0',
          hover: '#edf2f7',
          heroText: '#2d3748',
          contactText: '#2d3748',
        };
      case 'creative':
        return {
          primary: '#ff6b6b',
          secondary: '#4ecdc4',
          accent: '#45b7d1',
          background: '#f8f9fa',
          text: '#2c3e50',
          cardBackground: '#ffffff',
          divider: '#dee2e6',
          hover: '#e9ecef',
          heroText: '#2c3e50',
          contactText: '#2c3e50',
        };
      case 'professional':
        return {
          primary: '#2c3e50',
          secondary: '#34495e',
          accent: '#3498db',
          background: '#ffffff',
          text: '#2c3e50',
          cardBackground: '#f8f9fa',
          divider: '#dee2e6',
          hover: '#e9ecef',
          heroText: '#2c3e50',
          contactText: '#2c3e50',
        };
      case 'dark':
        return {
          primary: '#bb86fc',
          secondary: '#03dac6',
          accent: '#cf6679',
          background: '#121212',
          text: '#ffffff',
          cardBackground: '#1e1e1e',
          divider: '#333333',
          hover: '#2a2a2a',
          heroText: '#ffffff',
          contactText: '#ffffff',
        };
      case 'pastel':
        return {
          primary: '#6B4F41',
          secondary: '#FDF6EE',
          accent: '#C4A484',
          background: '#FDF6EE',
          text: '#6B4F41',
          cardBackground: '#F5EDE3',
          divider: '#E8D5C4',
          heroText: '#6B4F41',
          contactText: '#6B4F41',
          hover: '#F2D3C2',
          heartGradient: 'linear-gradient(135deg, #FDF6EE 0%, #E8D5C4 100%)',
        };
      default:
        return {
          primary: '#667eea',
          secondary: '#764ba2',
          accent: '#4facfe',
          background: '#ffffff',
          text: '#2d3748',
          cardBackground: '#f8fafc',
          divider: '#e2e8f0',
          hover: '#edf2f7',
        };
    }
  };

  const colors = getThemeColors();
  const isDark = theme === 'dark';

  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ?
      `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` :
      '0, 0, 0';
  };

  return `/* Portfolio Styles - Generated by Portfolio Maker */

:root {
  --primary: ${colors.primary};
  --primary-rgb: ${hexToRgb(colors.primary)};
  --secondary: ${colors.secondary};
  --accent: ${colors.accent};
  --background: ${colors.background};
  --text: ${colors.text};
  --card-bg: ${colors.cardBackground};
  --divider: ${colors.divider};
  --hover: ${colors.hover};
  --hero-text: ${colors.heroText};
  --contact-text: ${colors.contactText};
  --gradient: ${colors.heartGradient || `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`};
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.6;
  color: var(--text);
  background-color: var(--background);
  overflow-x: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Navigation */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  z-index: 1000;
  padding: 1rem 0;
  transition: all 0.3s ease;
}

${isDark ? `
.nav {
  background: rgba(30, 30, 30, 0.95);
}
` : ''}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  text-decoration: none;
  color: var(--text);
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-links a:hover {
  color: var(--primary);
}

.nav-toggle {
  display: none;
  flex-direction: column;
  cursor: pointer;
}

.nav-toggle span {
  width: 25px;
  height: 3px;
  background: var(--text);
  margin: 3px 0;
  transition: 0.3s;
}

/* Hero Section */
.hero {
  min-height: 100vh;
  background: var(--gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--hero-text);
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.1);
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  padding: 2rem;
}

.hero-image {
  width: 150px;
  height: 150px;
  margin: 0 auto 2rem;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  animation: fadeInUp 1s ease;
  text-shadow: 2px 2px 4px rgba(255,255,255,0.8);
}

.hero-subtitle {
  font-size: 1.5rem;
  font-weight: 400;
  margin-bottom: 2rem;
  opacity: 0.9;
  animation: fadeInUp 1s ease 0.2s both;
  text-shadow: 1px 1px 2px rgba(255,255,255,0.7);
}

.hero-description {
  font-size: 1.1rem;
  margin-bottom: 3rem;
  opacity: 0.8;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  animation: fadeInUp 1s ease 0.4s both;
  text-shadow: 1px 1px 2px rgba(255,255,255,0.6);
}

.hero-contact {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  animation: fadeInUp 1s ease 0.6s both;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.contact-item i {
  font-size: 1rem;
}

.hero-social {
  display: flex;
  justify-content: center;
  gap: 1rem;
  animation: fadeInUp 1s ease 0.8s both;
}

.hero-social a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: rgba(var(--primary-rgb), 0.2);
  border: 2px solid rgba(var(--primary-rgb), 0.4);
  border-radius: 50%;
  color: var(--primary);
  text-decoration: none;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.hero-social a:hover {
  background: rgba(var(--primary-rgb), 0.3);
  transform: translateY(-3px);
  opacity: 0.8;
}

/* Sections */
.section {
  padding: 5rem 0;
}

.section:nth-child(even) {
  background-color: var(--card-bg);
}

.section-title {
  font-size: 2.5rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 3rem;
  color: var(--primary);
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 4px;
  background: var(--accent);
  border-radius: 2px;
}

/* About Section */
.about-section {
  background: var(--card-bg);
}

.about-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 4rem;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.about-text {
  color: var(--text);
}

.about-description {
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 2rem;
  color: var(--text);
}

.about-highlights {
  display: grid;
  gap: 1.5rem;
}

.highlight-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--bg);
  border-radius: 12px;
  border-left: 4px solid var(--primary);
  transition: all 0.3s ease;
}

.highlight-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.highlight-item i {
  color: var(--primary);
  font-size: 1.2rem;
  margin-top: 0.2rem;
  min-width: 20px;
}

.highlight-item h4 {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--primary);
}

.highlight-item p {
  margin: 0;
  color: var(--text);
  font-size: 0.95rem;
}

.highlight-item a {
  color: var(--primary);
  text-decoration: none;
  transition: color 0.3s ease;
}

.highlight-item a:hover {
  color: var(--accent);
}

.about-image {
  text-align: center;
}

.about-image img {
  width: 100%;
  max-width: 300px;
  height: auto;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.about-image img:hover {
  transform: scale(1.05);
}

/* Skills - Compact Layout */
.skills-compact {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  max-width: 100%;
}

/* Ensure skill bars are visible on load */
.skill-compact-progress[style*="width"] {
  opacity: 1 !important;
  display: block !important;
}

/* Fallback for skill bars without animation */
.skill-compact-progress {
  background: linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%) !important;
}

/* Force visibility for skill progress bars */
.skills-compact .skill-compact-progress {
  visibility: visible !important;
  opacity: 1 !important;
}

.skill-compact-item {
  background: var(--card-bg);
  padding: 1rem 1.25rem;
  border-radius: 8px;
  border-left: 4px solid var(--primary);
  transition: all 0.3s ease;
  position: relative;
}

.skill-compact-item:hover {
  transform: translateX(5px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.skill-compact-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.skill-compact-name {
  font-weight: 600;
  color: var(--text);
  font-size: 0.9rem;
}

.skill-compact-level {
  font-weight: 600;
  background: var(--primary);
  color: #ffffff;
  padding: 0.1rem 0.4rem;
  border-radius: 10px;
  font-size: 0.7rem;
}

.skill-compact-bar {
  width: 100%;
  height: 6px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  overflow: hidden;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.skill-compact-progress {
  height: 100%;
  background: linear-gradient(90deg, var(--primary) 0%, var(--accent) 100%);
  border-radius: 3px;
  transition: width 1s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  min-width: 2%;
  display: block;
  opacity: 1;
}

/* Projects */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.project-card {
  background: var(--card-bg);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.project-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.project-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.project-content {
  padding: 1.5rem;
}

.project-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.featured-star {
  color: #ffd700;
}

.project-description {
  color: var(--text);
  opacity: 0.8;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.project-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tech-tag {
  background: rgba(${colors.primary.slice(1).match(/.{2}/g)?.map(hex => parseInt(hex, 16)).join(', ')}, 0.1);
  color: var(--primary);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.project-links {
  display: flex;
  gap: 1rem;
}

.project-links a {
  color: var(--accent);
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.3s ease;
}

.project-links a:hover {
  color: var(--primary);
}

/* Timeline */
.timeline {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 30px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--divider);
}

.timeline-item {
  position: relative;
  margin-bottom: 3rem;
  padding-left: 80px;
}

.timeline-marker {
  position: absolute;
  left: 20px;
  top: 0;
  width: 20px;
  height: 20px;
  background: var(--accent);
  border-radius: 50%;
  border: 4px solid var(--background);
  box-shadow: 0 0 0 4px var(--divider);
}

.timeline-content {
  background: var(--card-bg);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.timeline-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.current-badge {
  background: var(--accent);
  color: #ffffff;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 500;
}

.timeline-company {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--primary);
  opacity: 0.8;
  margin-bottom: 1rem;
}

.timeline-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: var(--text);
  opacity: 0.7;
  flex-wrap: wrap;
}

.timeline-meta i {
  margin-right: 0.5rem;
}

.timeline-description {
  color: var(--text);
  line-height: 1.6;
}

/* Education & Certifications */
.education-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 3rem;
}

.education-item,
.certification-item {
  background: var(--card-bg);
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
  transition: transform 0.3s ease;
}

.education-item:hover,
.certification-item:hover {
  transform: translateY(-3px);
}

.education-degree,
.certification-name {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--text);
}

.education-institution,
.certification-issuer {
  font-size: 1rem;
  font-weight: 500;
  color: var(--primary);
  opacity: 0.8;
  margin-bottom: 0.5rem;
}

.education-meta,
.certification-meta {
  font-size: 0.9rem;
  color: var(--text);
  opacity: 0.7;
  margin-bottom: 1rem;
}

.education-field,
.education-description {
  color: var(--text);
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

.certification-link {
  color: var(--accent);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.certification-link:hover {
  color: var(--primary);
}

/* Contact Section */
.contact-section {
  background: var(--gradient);
  color: var(--contact-text);
}

.contact-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 3rem;
  align-items: start;
}

.contact-info h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.contact-info p {
  margin-bottom: 2rem;
  opacity: 0.9;
}

.contact-details {
  margin-bottom: 2rem;
}

.contact-detail {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.contact-detail i {
  width: 20px;
  text-align: center;
}

.contact-detail a {
  color: var(--contact-text);
  text-decoration: none;
  transition: opacity 0.3s ease;
}

.contact-detail a:hover {
  opacity: 0.8;
}

.contact-social {
  display: flex;
  gap: 1rem;
}

.contact-social a {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(var(--primary-rgb), 0.2);
  border: 2px solid rgba(var(--primary-rgb), 0.4);
  border-radius: 50%;
  color: var(--primary);
  text-decoration: none;
  transition: all 0.3s ease;
}

.contact-social a:hover {
  background: rgba(var(--primary-rgb), 0.3);
  transform: translateY(-3px);
  opacity: 0.8;
}

/* Contact Form */
.contact-form {
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  color: var(--text);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  background: white;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.submit-btn {
  background: white;
  color: var(--primary);
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

/* Footer */
.footer {
  background: var(--text);
  color: var(--background);
  text-align: center;
  padding: 2rem 0;
}

.footer p {
  margin-bottom: 0.5rem;
  opacity: 0.8;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }

  .nav-toggle {
    display: flex;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
  }

  .hero-contact {
    flex-direction: column;
    gap: 1rem;
  }

  .container {
    padding: 0 1rem;
  }

  .section {
    padding: 3rem 0;
  }

  .section-title {
    font-size: 2rem;
  }

  .about-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }

  .about-image {
    order: -1;
  }

  .about-image img {
    max-width: 250px;
  }

  .skills-compact,
  .projects-grid {
    grid-template-columns: 1fr;
  }

  .timeline::before {
    left: 15px;
  }

  .timeline-item {
    padding-left: 50px;
  }

  .timeline-marker {
    left: 5px;
  }

  .education-grid {
    grid-template-columns: 1fr;
  }

  .contact-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .hero-image {
    width: 120px;
    height: 120px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }

  .project-card {
    margin: 0 1rem;
  }
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--background);
}

::-webkit-scrollbar-thumb {
  background: var(--primary);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--secondary);
}
`;
}

// Generate JavaScript for the portfolio
export function generatePortfolioJS(): string {
  return `// Portfolio JavaScript - Generated by Portfolio Maker

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Account for fixed nav
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            }
        });
    });

    // Navbar background on scroll
    const nav = document.querySelector('.nav');
    if (nav) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }

    // Ensure skill bars are visible and properly sized
    const skillBars = document.querySelectorAll('.skill-compact-progress');

    // Simple animation that ensures bars are always visible
    const animateSkillBars = () => {
        skillBars.forEach((bar, index) => {
            // Get the width from the inline style (set in HTML)
            const targetWidth = bar.style.width;
            if (targetWidth && targetWidth !== '0%') {
                // Start from 0 and animate to target width
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = targetWidth;
                }, index * 100 + 200);
            }
        });
    };

    // Trigger skill bar animation on page load
    setTimeout(() => {
        animateSkillBars();
    }, 500);

    // Also trigger on scroll if not already animated
    let skillsAnimated = false;
    window.addEventListener('scroll', function() {
        if (!skillsAnimated) {
            const skillsSection = document.querySelector('#skills');
            if (skillsSection) {
                const rect = skillsSection.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    animateSkillBars();
                    skillsAnimated = true;
                }
            }
        }
    });

    // Contact form is now handled by Formspree - no JavaScript needed
    // The form will submit directly to Formspree and redirect to a thank you page

    // Add fade-in animation to elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.skill-compact-item, .project-card, .timeline-item, .education-item, .certification-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Typing effect for hero title (optional)
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && heroTitle.textContent) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.borderRight = '2px solid white';

        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                setTimeout(() => {
                    heroTitle.style.borderRight = 'none';
                }, 1000);
            }
        };

        setTimeout(typeWriter, 1000);
    }
});

// Add CSS for mobile navigation
const style = document.createElement('style');
style.textContent = \`
.nav-links.active {
    display: flex !important;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--background);
    flex-direction: column;
    padding: 1rem 2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.nav-toggle.active span:nth-child(1) {
    transform: rotate(-45deg) translate(-5px, 6px);
}

.nav-toggle.active span:nth-child(2) {
    opacity: 0;
}

.nav-toggle.active span:nth-child(3) {
    transform: rotate(45deg) translate(-5px, -6px);
}

.nav.scrolled {
    background: var(--background);
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    opacity: 0.98;
}

@media (max-width: 768px) {
    .nav-links {
        display: none;
    }
}
\`;
document.head.appendChild(style);
`;
}

// Main export function
export async function exportPortfolio(data: PortfolioData): Promise<void> {
  try {
    const zip = new JSZip();

    // Generate files
    const html = generatePortfolioHTML(data);
    const css = generatePortfolioCSS(data);
    const js = generatePortfolioJS();

    // Add files to zip
    zip.file('index.html', html);
    zip.file('styles.css', css);
    zip.file('script.js', js);

    // Add README file
    const readme = `# ${data.personalInfo.fullName} - Portfolio Website

This portfolio website was generated using Portfolio Maker.

## Files Included

- \`index.html\` - Main HTML file
- \`styles.css\` - Stylesheet with ${data.theme} theme
- \`script.js\` - JavaScript for interactivity
- \`README.md\` - This file
- \`FORMSPREE_SETUP.md\` - Contact form setup instructions

## Setup Instructions

1. Upload all files to your web server
2. **IMPORTANT**: Set up the contact form by following \`FORMSPREE_SETUP.md\`
3. Replace placeholder images with your actual images
4. Customize colors and styles in \`styles.css\` if desired

## Contact Form Setup

${data.personalInfo.formspreeId ? `
✅ **READY TO USE**: Your contact form is already configured with Formspree ID: \`${data.personalInfo.formspreeId}\`

Your contact form will work immediately when you upload this portfolio to any web hosting service.
` : `
⚠️ **SETUP REQUIRED**: The contact form uses Formspree and needs setup to work properly.

**Quick Setup (5 minutes):**
1. Read the detailed instructions in \`FORMSPREE_SETUP.md\`
2. Sign up at https://formspree.io (free account)
3. Replace \`your-form-id\` in \`index.html\` with your Formspree ID

**Note**: Replace \`your-form-id\` in the form action URL with your actual Formspree ID.
`}

## Features

- Responsive design that works on all devices
- Smooth scrolling navigation
- Animated skill bars
- Contact form with validation
- SEO-friendly markup
- Fast loading and optimized

## Customization

You can customize the website by:
- Editing colors in the CSS variables at the top of \`styles.css\`
- Adding your own images to replace placeholders
- Modifying the content in \`index.html\`
- Adding new sections or removing existing ones

## Support

This portfolio was generated by Portfolio Maker.
For support or questions, please refer to the Portfolio Maker documentation.

---

Built with ❤️ using Portfolio Maker
`;

    zip.file('README.md', readme);

    // Add Formspree setup instructions
    const formspreeSetup = `# Contact Form Setup with Formspree

${data.personalInfo.formspreeId ? `
✅ **Your contact form is READY TO USE!**

Your portfolio includes a contact form that is already configured with your Formspree ID: \`${data.personalInfo.formspreeId}\`

The contact form will work immediately when you upload your portfolio to any web hosting service. No additional setup required!

## What's Already Done

- ✅ Formspree ID configured: \`${data.personalInfo.formspreeId}\`
- ✅ Form action URL set correctly
- ✅ All form fields properly named
- ✅ Contact form ready for immediate use

## Next Steps

1. Upload your portfolio files to your web hosting
2. Test the contact form by filling it out
3. Check your email for form submissions

## Need to Change Your Formspree ID?

If you need to use a different Formspree form:
1. Open \`index.html\`
2. Find: \`action="https://formspree.io/f/${data.personalInfo.formspreeId}"\`
3. Replace \`${data.personalInfo.formspreeId}\` with your new Formspree ID

` : `
Your portfolio includes a contact form that uses Formspree to handle form submissions. Follow these simple steps to make it work:`}

## Quick Setup (5 minutes)

### 1. Sign up for Formspree
- Go to [https://formspree.io](https://formspree.io)
- Create a free account (allows 50 submissions per month)
- Click "New Form" to create a form

### 2. Get Your Form ID (Step-by-Step)
- After signing up, click **"New Form"** button
- Give your form a name (e.g., "Portfolio Contact Form")
- Click **"Create Form"**
- You'll see your form endpoint URL: \`https://formspree.io/f/YOUR-FORM-ID\`
- Your Form ID is the part after \`/f/\` (e.g., \`xpzgkqyw\`)
- **Copy this Form ID** - you'll need it in the next step

**Example**: If your URL is \`https://formspree.io/f/xpzgkqyw\`, then \`xpzgkqyw\` is your Form ID

### 3. Update Your Portfolio
- Open your \`index.html\` file
- Find this line: \`<form class="contact-form" action="https://formspree.io/f/your-form-id" method="POST">\`
- Replace \`your-form-id\` with your actual Formspree ID
- Example: \`<form class="contact-form" action="https://formspree.io/f/xpzgkqyw" method="POST">\`

### 4. Test Your Form
- Upload your portfolio to your web hosting
- Fill out the contact form and submit it
- Check your email - you should receive the message!

## Features Included

✅ **Spam Protection** - Formspree includes built-in spam filtering
✅ **Email Notifications** - Get emails when someone contacts you
✅ **Mobile Friendly** - Works perfectly on all devices
✅ **No Backend Required** - No PHP or server setup needed
✅ **Free Plan Available** - 50 submissions per month at no cost

## Troubleshooting

**Form not working?**
- Make sure you replaced \`your-form-id\` with your actual Formspree ID
- Check that your website is uploaded to a web server (not just opened locally)
- Verify your Formspree account is active

**Not receiving emails?**
- Check your spam folder
- Verify the email address in your Formspree account
- Make sure you confirmed your Formspree account via email

---

**Note**: Remember to replace \`your-form-id\` in the form action URL with your actual Formspree ID for the contact form to work properly.`;

    zip.file('FORMSPREE_SETUP.md', formspreeSetup);

    // Generate and download zip
    const content = await zip.generateAsync({ type: 'blob' });
    const fileName = `${data.personalInfo.fullName.replace(/\s+/g, '-').toLowerCase()}-portfolio.zip`;

    saveAs(content, fileName);

  } catch (error) {
    console.error('Error exporting portfolio:', error);
    throw new Error('Failed to export portfolio. Please try again.');
  }
}
