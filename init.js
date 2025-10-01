// init.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Initializing project...');

const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = require(packageJsonPath);

try {
  // 1. Get the repository URL from the git config
  const remoteUrl = execSync('git config --get remote.origin.url').toString().trim();
  const repoNameMatch = remoteUrl.match(/github\.com[/:](.*)\.git$/);

  if (!repoNameMatch) {
    throw new Error('Could not parse repository URL from git config.');
  }

  const repoName = repoNameMatch[1];
  const newProjectName = path.basename(repoName);
  const githubUrl = `https://github.com/${repoName}`;

  // 2. Update the package.json content
  packageJson.name = newProjectName;
  packageJson.description = ''; // Clear description for the new project
  packageJson.version = '0.1.0'; // Reset version
  
  packageJson.repository = {
    type: 'git',
    url: `git+${githubUrl}.git`,
  };
  
  packageJson.bugs = {
    url: `${githubUrl}/issues`,
  };

  packageJson.homepage = `${githubUrl}#readme`;

  // 3. Write the updated package.json back to the file
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  console.log(`✅ Successfully updated package.json for '${newProjectName}'.`);

  // 4. (Optional) Self-destruct the script
  console.log('🗑️ Cleaning up initialization script...');
  fs.unlinkSync(__filename); 
  console.log('✅ Done!');

} catch (error) {
  console.error('❌ Error initializing project:', error.message);
}