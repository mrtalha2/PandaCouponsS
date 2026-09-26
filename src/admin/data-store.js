/**
 * Admin Data Store with Atomic Backups (Phase B)
 * Shared module through which all reads and writes must pass.
 * Automatically creates timestamped backups in data/admin/backups/ before writing.
 */

const fs = require('fs');
const path = require('path');

const ADMIN_DATA_DIR = path.join(__dirname, '../../data/admin');
const BACKUPS_DIR = path.join(ADMIN_DATA_DIR, 'backups');
const MAX_BACKUPS = 20;

// Ensure directories exist
if (!fs.existsSync(ADMIN_DATA_DIR)) {
  fs.mkdirSync(ADMIN_DATA_DIR, { recursive: true });
}
if (!fs.existsSync(BACKUPS_DIR)) {
  fs.mkdirSync(BACKUPS_DIR, { recursive: true });
}

function getFilePath(filename) {
  if (filename === 'coupons.json') {
    return path.join(__dirname, '../../data/coupons.json');
  }
  return path.join(ADMIN_DATA_DIR, filename);
}

function readData(filename, fallback = {}) {
  const filePath = getFilePath(filename);
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  } catch (err) {
    console.error(`Error reading ${filename}:`, err);
  }
  return fallback;
}

function backupFile(filename) {
  const filePath = getFilePath(filename);
  if (!fs.existsSync(filePath)) return;

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupName = `${path.basename(filename, '.json')}.${timestamp}.json`;
  const backupPath = path.join(BACKUPS_DIR, backupName);

  try {
    fs.copyFileSync(filePath, backupPath);

    // Prune older backups for this file (keep most recent 20)
    const basePrefix = `${path.basename(filename, '.json')}.`;
    const files = fs.readdirSync(BACKUPS_DIR)
      .filter(f => f.startsWith(basePrefix) && f.endsWith('.json'))
      .sort((a, b) => b.localeCompare(a)); // Newest first

    if (files.length > MAX_BACKUPS) {
      files.slice(MAX_BACKUPS).forEach(oldFile => {
        try {
          fs.unlinkSync(path.join(BACKUPS_DIR, oldFile));
        } catch (e) {
          console.error(`Failed to prune backup ${oldFile}:`, e);
        }
      });
    }
  } catch (err) {
    console.error(`Failed to create backup for ${filename}:`, err);
  }
}

function recordPendingChange(description) {
  const statusFile = path.join(ADMIN_DATA_DIR, 'publish-status.json');
  let status = { lastPublished: null, status: 'pending', pendingChanges: [] };
  try {
    if (fs.existsSync(statusFile)) {
      status = JSON.parse(fs.readFileSync(statusFile, 'utf8'));
    }
  } catch (e) {}

  if (!status.pendingChanges) status.pendingChanges = [];
  status.pendingChanges.push({
    desc: description,
    time: new Date().toISOString()
  });
  status.status = 'pending_changes';

  try {
    fs.writeFileSync(statusFile, JSON.stringify(status, null, 2), 'utf8');
  } catch (e) {}
}

function writeData(filename, data, changeDescription = '') {
  const filePath = getFilePath(filename);

  // 1. Create backup before overwriting
  backupFile(filename);

  // 2. Write new content
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');

  // 3. Record pending change
  if (changeDescription) {
    recordPendingChange(changeDescription);
  }

  return true;
}

function getPublishStatus() {
  return readData('publish-status.json', {
    lastPublished: null,
    status: 'published',
    pendingChanges: []
  });
}

function markPublished() {
  const statusFile = path.join(ADMIN_DATA_DIR, 'publish-status.json');
  const status = {
    lastPublished: new Date().toISOString(),
    status: 'published',
    pendingChanges: []
  };
  fs.writeFileSync(statusFile, JSON.stringify(status, null, 2), 'utf8');
  return status;
}

module.exports = {
  readData,
  writeData,
  backupFile,
  getPublishStatus,
  markPublished
};
