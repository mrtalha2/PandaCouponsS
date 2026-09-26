/**
 * Admin Publisher & Preview Engine (Phase I)
 * Executes build.js asynchronously to publish pending changes.
 * On build failure, restores the previous working dist/ output so the live site remains untouched.
 */

const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const dataManager = require('./data-manager');

let isBuilding = false;
let lastBuildLog = '';
let lastBuildResult = null;

const DIST_DIR = path.join(__dirname, '../../dist');
const BACKUP_DIST_DIR = path.join(__dirname, '../../dist_publisher_backup');

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function removeDirRecursive(dir) {
  if (fs.existsSync(dir)) {
    try {
      fs.rmSync(dir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
    } catch (e) {}
  }
}

function runPublish() {
  if (isBuilding) {
    return Promise.resolve({
      success: false,
      message: 'A build is already in progress.',
      log: lastBuildLog
    });
  }

  isBuilding = true;
  lastBuildLog = '';
  lastBuildResult = null;

  // 1. Create a snapshot backup of current working dist/
  try {
    removeDirRecursive(BACKUP_DIST_DIR);
    if (fs.existsSync(DIST_DIR)) {
      copyDirRecursive(DIST_DIR, BACKUP_DIST_DIR);
    }
  } catch (err) {
    console.error('Warning: Failed to create snapshot backup of dist:', err);
  }

  return new Promise((resolve) => {
    const buildScript = path.join(__dirname, '../../build.js');
    console.log('BUILD START: Executing build.js...');
    exec(`node "${buildScript}"`, { cwd: path.join(__dirname, '../..') }, (error, stdout, stderr) => {
      isBuilding = false;
      lastBuildLog = stdout + '\n' + (stderr || '');

      if (error) {
        // Roll back: restore previous working dist
        console.error('BUILD FAILED: Restoring previous working dist directory...', error.message);
        try {
          if (fs.existsSync(BACKUP_DIST_DIR)) {
            removeDirRecursive(DIST_DIR);
            copyDirRecursive(BACKUP_DIST_DIR, DIST_DIR);
            removeDirRecursive(BACKUP_DIST_DIR);
          }
        } catch (restoreErr) {
          console.error('Error during dist restore:', restoreErr);
        }

        lastBuildResult = {
          success: false,
          error: error.message,
          log: lastBuildLog
        };
        resolve(lastBuildResult);
      } else {
        // Build succeeded: clean up snapshot backup
        console.log('BUILD END: Static build finished successfully.');
        try {
          removeDirRecursive(BACKUP_DIST_DIR);
        } catch (cleanErr) {}

        const publishInfo = dataManager.markPublished();
        lastBuildResult = {
          success: true,
          publishedAt: publishInfo.lastPublished,
          log: lastBuildLog
        };
        resolve(lastBuildResult);
      }
    });
  });
}

function getPublishState() {
  const status = dataManager.getPublishStatus();
  return {
    isBuilding,
    lastBuildResult,
    lastPublished: status.lastPublished,
    pendingChangesCount: (status.pendingChanges || []).length,
    pendingChanges: status.pendingChanges || []
  };
}

module.exports = {
  runPublish,
  getPublishState
};
