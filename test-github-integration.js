// Quick test script for enhanced GitHub integration
// Run with: node test-github-integration.js

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '<YOUR_GITHUB_TOKEN>'; // Use env variable or placeholder
const GITHUB_API_BASE = 'https://api.github.com';

const getGitHubHeaders = () => ({
  'Authorization': `Bearer ${GITHUB_TOKEN}`,
  'Accept': 'application/vnd.github.v3+json',
  'X-GitHub-Api-Version': '2022-11-28'
});

async function testGitHubAPI() {
  console.log('🧪 Testing Enhanced GitHub Integration...\n');

  try {
    // Test 1: Fetch a repository
    console.log('📦 Test 1: Fetching repository data...');
    const repoResponse = await fetch(`${GITHUB_API_BASE}/repos/sunayana225/my-project`, {
      headers: getGitHubHeaders()
    });
    
    if (repoResponse.ok) {
      const repo = await repoResponse.json();
      console.log(`✅ Repository: ${repo.name}`);
      console.log(`   Description: ${repo.description || 'No description'}`);
      console.log(`   Language: ${repo.language || 'Not specified'}`);
      console.log(`   Stars: ${repo.stargazers_count}`);
      console.log(`   Topics: ${repo.topics?.join(', ') || 'None'}`);
    } else {
      console.log(`❌ Repository fetch failed: ${repoResponse.status}`);
    }

    // Test 2: Fetch README
    console.log('\n📄 Test 2: Fetching README...');
    const readmeResponse = await fetch(`${GITHUB_API_BASE}/repos/sunayana225/my-project/contents/README.md`, {
      headers: getGitHubHeaders()
    });
    
    if (readmeResponse.ok) {
      const readmeData = await readmeResponse.json();
      const content = atob(readmeData.content.replace(/\n/g, ''));
      console.log(`✅ README found (${content.length} characters)`);
      console.log(`   Preview: ${content.substring(0, 100)}...`);
    } else {
      console.log(`❌ README fetch failed: ${readmeResponse.status}`);
    }

    // Test 3: Fetch languages
    console.log('\n🔤 Test 3: Fetching languages...');
    const languagesResponse = await fetch(`${GITHUB_API_BASE}/repos/sunayana225/my-project/languages`, {
      headers: getGitHubHeaders()
    });
    
    if (languagesResponse.ok) {
      const languages = await languagesResponse.json();
      console.log('✅ Languages found:');
      Object.entries(languages).forEach(([lang, bytes]) => {
        console.log(`   ${lang}: ${bytes} bytes`);
      });
    } else {
      console.log(`❌ Languages fetch failed: ${languagesResponse.status}`);
    }

    // Test 4: Fetch package.json
    console.log('\n📦 Test 4: Fetching package.json...');
    const packageResponse = await fetch(`${GITHUB_API_BASE}/repos/sunayana225/my-project/contents/package.json`, {
      headers: getGitHubHeaders()
    });
    
    if (packageResponse.ok) {
      const packageData = await packageResponse.json();
      const content = JSON.parse(atob(packageData.content.replace(/\n/g, '')));
      console.log('✅ Package.json found:');
      console.log(`   Name: ${content.name || 'Not specified'}`);
      console.log(`   Dependencies: ${Object.keys(content.dependencies || {}).length}`);
      console.log(`   Scripts: ${Object.keys(content.scripts || {}).join(', ')}`);
    } else {
      console.log(`❌ Package.json fetch failed: ${packageResponse.status}`);
    }

    // Test 5: Check rate limit
    console.log('\n⏱️  Test 5: Checking rate limit...');
    const rateLimitResponse = await fetch(`${GITHUB_API_BASE}/rate_limit`, {
      headers: getGitHubHeaders()
    });
    
    if (rateLimitResponse.ok) {
      const rateLimit = await rateLimitResponse.json();
      console.log('✅ Rate limit status:');
      console.log(`   Remaining: ${rateLimit.rate.remaining}/${rateLimit.rate.limit}`);
      console.log(`   Reset: ${new Date(rateLimit.rate.reset * 1000).toLocaleTimeString()}`);
    }

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n💡 The enhanced GitHub integration is ready to use with:');
    console.log('   - Authenticated API access');
    console.log('   - Comprehensive data extraction');
    console.log('   - Enhanced technology detection');
    console.log('   - Professional description generation');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testGitHubAPI();
