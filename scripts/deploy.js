#!/usr/bin/env node

/**
 * Deployment script for TravelSplit PWA
 * This script helps ensure proper cache busting and update detection
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Update the service worker cache version
function updateServiceWorkerCache() {
  const swPath = path.join(__dirname, '../public/sw.js');
  let content = fs.readFileSync(swPath, 'utf8');
  
  // Extract current version
  const versionMatch = content.match(/const STATIC_CACHE = 'travelsplit-static-v(\d+)'/);
  if (versionMatch) {
    const currentVersion = parseInt(versionMatch[1]);
    const newVersion = currentVersion + 1;
    
    // Update both static and dynamic cache versions
    content = content.replace(
      /const STATIC_CACHE = 'travelsplit-static-v\d+'/,
      `const STATIC_CACHE = 'travelsplit-static-v${newVersion}'`
    );
    content = content.replace(
      /const DYNAMIC_CACHE = 'travelsplit-dynamic-v\d+'/,
      `const DYNAMIC_CACHE = 'travelsplit-dynamic-v${newVersion}'`
    );
    
    fs.writeFileSync(swPath, content);
    console.log(`✅ Updated service worker cache version to v${newVersion}`);
  }
}

// Update package.json version
function updatePackageVersion() {
  const packagePath = path.join(__dirname, '../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  const currentVersion = packageJson.version.split('.');
  const patch = parseInt(currentVersion[2]) + 1;
  const newVersion = `${currentVersion[0]}.${currentVersion[1]}.${patch}`;
  
  packageJson.version = newVersion;
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');
  console.log(`✅ Updated package.json version to ${newVersion}`);
}

// Main deployment function
function deploy() {
  console.log('🚀 Starting TravelSplit PWA deployment...\n');
  
  try {
    updateServiceWorkerCache();
    updatePackageVersion();
    
    console.log('\n✅ Deployment preparation complete!');
    console.log('\nNext steps:');
    console.log('1. Build your project: npm run build');
    console.log('2. Deploy to your hosting platform');
    console.log('3. Users will automatically receive the update notification');
    
  } catch (error) {
    console.error('❌ Deployment preparation failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
deploy(); 