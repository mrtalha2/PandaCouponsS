/**
 * Admin Layout View Generator
 * Renders the shared administrative shell, sidebar, CSRF tokens, and publish controls.
 */

function renderAdminLayout({ title, activeNav = 'dashboard', content, session, publishState, extraHead = '', extraScripts = '' }) {
  const pendingCount = publishState?.pendingChangesCount || 0;
  const isBuilding = publishState?.isBuilding || false;
  const lastPublished = publishState?.lastPublished
    ? new Date(publishState.lastPublished).toLocaleString()
    : 'Never';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | Panda Express Coupons Admin</title>
  <link rel="icon" type="image/svg+xml" href="/public/favicon.svg">
  <link rel="stylesheet" href="/assets/css/style.min.css">
  <style>
    :root {
      --admin-bg: #0E0E12;
      --admin-card: #16161D;
      --admin-border: rgba(255, 255, 255, 0.1);
      --admin-text: #F1F5F9;
      --admin-muted: #94A3B8;
      --admin-primary: #C8102E;
      --admin-primary-hover: #E01335;
      --admin-sidebar-w: 240px;
    }
    body.admin-body {
      background-color: var(--admin-bg) !important;
      color: var(--admin-text) !important;
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif !important;
      margin: 0 !important;
      padding: 0 !important;
      min-height: 100vh !important;
      display: flex !important;
      flex-direction: row !important;
    }
    body.admin-body::before {
      display: none !important;
    }
    .admin-sidebar {
      width: var(--admin-sidebar-w);
      background: #09090D;
      border-right: 1px solid var(--admin-border);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      min-height: 100vh;
      position: sticky;
      top: 0;
    }
    .admin-brand {
      padding: 1.5rem 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      border-bottom: 1px solid var(--admin-border);
      text-decoration: none;
      color: #FFF;
      font-weight: 800;
      font-size: 1.05rem;
    }
    .admin-brand img {
      width: 32px;
      height: 32px;
    }
    .admin-nav {
      padding: 1.25rem 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      flex: 1;
    }
    .admin-nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.7rem 0.9rem;
      color: var(--admin-muted);
      text-decoration: none;
      font-size: 0.92rem;
      font-weight: 600;
      border-radius: 8px;
      transition: all 0.15s ease;
    }
    .admin-nav-item:hover {
      color: #FFF;
      background: rgba(255, 255, 255, 0.05);
    }
    .admin-nav-item.is-active {
      color: #FFF;
      background: rgba(200, 16, 46, 0.25);
      border-left: 3px solid var(--admin-primary);
    }
    .admin-sidebar-footer {
      padding: 1rem;
      border-top: 1px solid var(--admin-border);
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .admin-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .admin-topbar {
      height: 64px;
      background: #09090D;
      border-bottom: 1px solid var(--admin-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .admin-content {
      padding: 2rem;
      flex: 1;
      max-width: 1400px;
      width: 100%;
      box-sizing: border-box;
      margin: 0 auto;
    }
    .admin-card {
      background: var(--admin-card);
      border: 1px solid var(--admin-border);
      border-radius: 12px;
      padding: 1.75rem;
      margin-bottom: 1.75rem;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
    }
    .admin-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.07);
      padding-bottom: 1rem;
    }
    .admin-card-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0;
      color: #FFF;
    }
    .btn-admin-primary {
      background: var(--admin-primary);
      color: #FFF;
      border: none;
      padding: 0.65rem 1.25rem;
      font-size: 0.9rem;
      font-weight: 700;
      border-radius: 6px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      transition: background 0.15s ease;
    }
    .btn-admin-primary:hover {
      background: var(--admin-primary-hover);
    }
    .btn-admin-secondary {
      background: rgba(255, 255, 255, 0.08);
      color: #FFF;
      border: 1px solid var(--admin-border);
      padding: 0.65rem 1.25rem;
      font-size: 0.9rem;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      transition: all 0.15s ease;
    }
    .btn-admin-secondary:hover {
      background: rgba(255, 255, 255, 0.14);
    }
    .admin-form-group {
      margin-bottom: 1.25rem;
    }
    .admin-label {
      display: block;
      font-size: 0.88rem;
      font-weight: 600;
      color: #CBD5E1;
      margin-bottom: 0.4rem;
    }
    .admin-input, .admin-textarea, .admin-select {
      width: 100%;
      background: #0B0B0E;
      border: 1px solid rgba(255, 255, 255, 0.18);
      border-radius: 6px;
      padding: 0.65rem 0.85rem;
      color: #FFF;
      font-family: inherit;
      font-size: 0.92rem;
      box-sizing: border-box;
      transition: border 0.15s ease;
    }
    .admin-input:focus, .admin-textarea:focus, .admin-select:focus {
      outline: none;
      border-color: var(--admin-primary);
      box-shadow: 0 0 0 2px rgba(200, 16, 46, 0.3);
    }
    .admin-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.9rem;
    }
    .admin-table th {
      background: #0B0B0E;
      color: #94A3B8;
      font-weight: 700;
      text-align: left;
      padding: 0.85rem 1rem;
      border-bottom: 1px solid var(--admin-border);
    }
    .admin-table td {
      padding: 0.95rem 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      vertical-align: middle;
    }
    .admin-table tbody tr:hover td {
      background: rgba(255, 255, 255, 0.02);
    }
    .admin-badge {
      display: inline-block;
      padding: 0.25rem 0.65rem;
      font-size: 0.75rem;
      font-weight: 700;
      border-radius: 9999px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    .badge-green { background: rgba(16, 185, 129, 0.15); color: #34D399; border: 1px solid rgba(16, 185, 129, 0.3); }
    .badge-gold { background: rgba(245, 179, 1, 0.15); color: #FBBF24; border: 1px solid rgba(245, 179, 1, 0.3); }
    .badge-red { background: rgba(239, 68, 68, 0.15); color: #F87171; border: 1px solid rgba(239, 68, 68, 0.3); }
    .badge-blue { background: rgba(59, 130, 246, 0.15); color: #60A5FA; border: 1px solid rgba(59, 130, 246, 0.3); }
    
    /* Toast Alert */
    #adminToast {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: #1E293B;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      padding: 0.85rem 1.4rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      color: #FFF;
      font-weight: 600;
      font-size: 0.92rem;
      z-index: 1000;
      display: none;
      align-items: center;
      gap: 0.75rem;
    }
  </style>
  <meta name="csrf-token" content="${session?.csrfToken || ''}">
  <meta http-equiv="Cache-Control" content="no-store">

  <!-- Core Global Admin Script (Available before page components render) -->
  <script>
    function getCsrfToken() {
      const meta = document.querySelector('meta[name="csrf-token"]');
      return meta ? meta.getAttribute('content') : '';
    }
    window.CSRF_TOKEN = getCsrfToken();

    let _toastTimer = null;
    function showToast(msg, type) {
      type = type || 'success';
      const toast = document.getElementById('adminToast');
      if (!toast) return;
      toast.textContent = (type === 'success' ? '✅ ' : '❌ ') + msg;
      toast.style.borderColor = type === 'success' ? '#10B981' : '#EF4444';
      toast.style.background = type === 'success' ? '#0F291E' : '#2D1214';
      toast.style.color = type === 'success' ? '#A7F3D0' : '#FECACA';
      toast.style.display = 'flex';
      clearTimeout(_toastTimer);
      _toastTimer = setTimeout(function() { toast.style.display = 'none'; }, 4500);
    }

    function handleSessionExpired() {
      showToast('Your session expired — redirecting to login...', 'error');
      setTimeout(function() {
        window.location.href = '/admin/login?expired=1';
      }, 1000);
    }

    // Refresh CSRF token from server if needed
    async function refreshCsrfToken() {
      try {
        const res = await fetch('/admin/api/csrf-token', { method: 'GET', credentials: 'same-origin' });
        if (res.status === 401 || (res.redirected && res.url.includes('/admin/login'))) {
          handleSessionExpired();
          return null;
        }
        if (res.ok) {
          const data = await res.json();
          if (data && data.csrfToken) {
            window.CSRF_TOKEN = data.csrfToken;
            const meta = document.querySelector('meta[name="csrf-token"]');
            if (meta) meta.setAttribute('content', data.csrfToken);
            return data.csrfToken;
          }
        }
      } catch (e) {
        console.error('Failed to refresh CSRF token:', e);
      }
      return window.CSRF_TOKEN;
    }

    // Safe fetch wrapper that auto-retries on CSRF failure and redirects on session expiration
    async function adminFetch(url, options) {
      options = options || {};
      const token = window.CSRF_TOKEN || getCsrfToken();
      const headers = Object.assign({
        'Content-Type': 'application/json',
        'X-CSRF-Token': token
      }, options.headers || {});

      const fetchOpts = Object.assign({}, options, {
        headers: headers,
        credentials: 'same-origin'
      });

      let res;
      try {
        res = await fetch(url, fetchOpts);
      } catch (networkErr) {
        throw new Error('Network error: Unable to communicate with server (' + networkErr.message + ')');
      }

      // 1. Detect session expiration (401 Unauthorized or redirect to /admin/login)
      if (res.status === 401 || (res.redirected && res.url.includes('/admin/login'))) {
        handleSessionExpired();
        throw new Error('Your session expired — redirecting to login...');
      }

      // 2. Handle CSRF failure (403): auto-retry once with refreshed token
      if (res.status === 403) {
        const newToken = await refreshCsrfToken();
        if (newToken && newToken !== token) {
          const retryHeaders = Object.assign({}, headers, { 'X-CSRF-Token': newToken });
          try {
            res = await fetch(url, Object.assign({}, fetchOpts, { headers: retryHeaders }));
          } catch (retryErr) {
            throw new Error('Network error on retry: ' + retryErr.message);
          }

          if (res.status === 401 || (res.redirected && res.url.includes('/admin/login'))) {
            handleSessionExpired();
            throw new Error('Your session expired — redirecting to login...');
          }
        }
      }

      // 3. Parse JSON safely
      const contentType = res.headers.get('content-type') || '';
      let data;
      if (contentType.includes('application/json')) {
        try {
          data = await res.json();
        } catch (jsonErr) {
          throw new Error('Failed to parse server JSON response');
        }
      } else {
        const text = await res.text();
        if (text.includes('Admin Login') || res.status === 401) {
          handleSessionExpired();
          throw new Error('Your session expired — redirecting to login...');
        }
        if (!res.ok) {
          throw new Error('Server error (' + res.status + '): ' + text.substring(0, 120));
        }
        return { success: true, raw: text };
      }

      // 4. Handle non-2xx status or success === false
      if (!res.ok || data.success === false) {
        const errMsg = data.error || data.message || ('Server request failed with status ' + res.status);
        throw new Error(errMsg);
      }

      return data;
    }
  </script>
  ${extraHead}
</head>
<body class="admin-body">
  <!-- Sidebar -->
  <aside class="admin-sidebar">
    <a href="/admin" class="admin-brand">
      <img src="/public/favicon.svg" alt="Panda Logo">
      <span>Panda Admin</span>
    </a>
    <nav class="admin-nav">
      <a href="/admin" class="admin-nav-item ${activeNav === 'dashboard' ? 'is-active' : ''}">
        <span>📊</span> Dashboard
      </a>
      <a href="/admin/coupons" class="admin-nav-item ${activeNav === 'coupons' ? 'is-active' : ''}">
        <span>🎟️</span> Coupons Manager
      </a>
      <a href="/admin/pages" class="admin-nav-item ${activeNav === 'pages' ? 'is-active' : ''}">
        <span>📄</span> Page Content
      </a>
      <a href="/admin/meta" class="admin-nav-item ${activeNav === 'meta' ? 'is-active' : ''}">
        <span>🏷️</span> SEO Meta
      </a>
      <a href="/admin/code" class="admin-nav-item ${activeNav === 'code' ? 'is-active' : ''}">
        <span>💻</span> Code Injection
      </a>
      <a href="/admin/redirects" class="admin-nav-item ${activeNav === 'redirects' ? 'is-active' : ''}">
        <span>🔀</span> 301 Redirects
      </a>
      <a href="/admin/media" class="admin-nav-item ${activeNav === 'media' ? 'is-active' : ''}">
        <span>🖼️</span> Media Library
      </a>
    </nav>
    <div class="admin-sidebar-footer">
      <div style="font-size: 0.8rem; color: #64748B;">
        Logged in as: <strong style="color: #CBD5E1;">${session?.username || 'admin'}</strong>
      </div>
      <button type="button" class="btn-admin-secondary" style="justify-content: center; padding: 0.45rem; font-size: 0.85rem;" onclick="openPasswordModal()">
        🔑 Change Password
      </button>
      <a href="/admin/logout" class="btn-admin-secondary" style="justify-content: center; padding: 0.45rem; font-size: 0.85rem;">
        🚪 Log Out
      </a>
    </div>
  </aside>

  <!-- Main Content Area -->
  <div class="admin-main">
    <header class="admin-topbar">
      <div style="display: flex; align-items: center; gap: 1rem;">
        <span style="font-size: 0.85rem; color: var(--admin-muted);">
          Last published: <strong style="color: #FFF;">${lastPublished}</strong>
        </span>
        ${pendingCount > 0 ? `
          <span class="admin-badge badge-gold">
            ⚡ ${pendingCount} Unpublished Change${pendingCount === 1 ? '' : 's'}
          </span>
        ` : `
          <span class="admin-badge badge-green">
            ✓ Live Site In Sync
          </span>
        `}
      </div>
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <a href="/" target="_blank" class="btn-admin-secondary" style="font-size: 0.85rem; padding: 0.5rem 0.9rem;">
          🌐 View Live Site
        </a>
        <button id="btnPublishLive" class="btn-admin-primary" style="font-size: 0.85rem; padding: 0.5rem 1rem;">
          🚀 Rebuild &amp; Publish
        </button>
      </div>
    </header>

    <main class="admin-content">
      ${content}
    </main>
  </div>

  <!-- Toast Notification -->
  <div id="adminToast"></div>

  <!-- Global Change Password Modal -->
  <div id="changePasswordModal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 9999999; justify-content: center; align-items: center; backdrop-filter: blur(5px); padding: 1rem;">
    <div style="background: #16161D; border: 1px solid rgba(255,255,255,0.2); border-radius: 12px; width: 100%; max-width: 440px; padding: 1.75rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.8); color: #FFF;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
        <h3 style="margin: 0; font-size: 1.2rem; font-weight: 800; color: #FFF; display: flex; align-items: center; gap: 0.5rem;">
          <span>🔑</span> Change Admin Password
        </h3>
        <button type="button" onclick="closePasswordModal()" style="background: none; border: none; color: var(--admin-muted); font-size: 1.5rem; cursor: pointer; line-height: 1;">&times;</button>
      </div>

      <form id="changePasswordForm" onsubmit="handlePasswordChangeSubmit(event)">
        <div class="admin-form-group">
          <label class="admin-label" for="pwdCurrent">Current Password</label>
          <input type="password" id="pwdCurrent" name="currentPassword" class="admin-input" required placeholder="Enter current password" style="background: #0B0B0E; color: #FFF;">
        </div>

        <div class="admin-form-group">
          <label class="admin-label" for="pwdNew">New Password</label>
          <input type="password" id="pwdNew" name="newPassword" class="admin-input" required minlength="8" placeholder="At least 8 characters" style="background: #0B0B0E; color: #FFF;">
          <small style="color: var(--admin-muted); display: block; margin-top: 0.25rem; font-size: 0.78rem;">Must be at least 8 characters long.</small>
        </div>

        <div class="admin-form-group">
          <label class="admin-label" for="pwdConfirm">Confirm New Password</label>
          <input type="password" id="pwdConfirm" name="confirmPassword" class="admin-input" required minlength="8" placeholder="Re-type new password" style="background: #0B0B0E; color: #FFF;">
        </div>

        <div id="passwordErrorAlert" style="display: none; background: rgba(239, 68, 68, 0.15); border: 1px solid #EF4444; color: #FCA5A5; padding: 0.6rem 0.85rem; border-radius: 6px; font-size: 0.85rem; margin-bottom: 1rem;"></div>

        <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
          <button type="button" class="btn-admin-secondary" onclick="closePasswordModal()">Cancel</button>
          <button type="submit" id="btnSubmitPassword" class="btn-admin-primary">Update Password</button>
        </div>
      </form>
    </div>
  </div>

  <script>
    function openPasswordModal() {
      const form = document.getElementById('changePasswordForm');
      if (form) form.reset();
      const alertEl = document.getElementById('passwordErrorAlert');
      if (alertEl) alertEl.style.display = 'none';
      document.getElementById('changePasswordModal').style.display = 'flex';
    }

    function closePasswordModal() {
      document.getElementById('changePasswordModal').style.display = 'none';
    }

    async function handlePasswordChangeSubmit(e) {
      e.preventDefault();
      const btn = document.getElementById('btnSubmitPassword');
      const alertEl = document.getElementById('passwordErrorAlert');
      alertEl.style.display = 'none';

      const currentPassword = document.getElementById('pwdCurrent').value;
      const newPassword = document.getElementById('pwdNew').value;
      const confirmPassword = document.getElementById('pwdConfirm').value;

      if (newPassword !== confirmPassword) {
        alertEl.textContent = 'New passwords do not match.';
        alertEl.style.display = 'block';
        return;
      }

      btn.disabled = true;
      btn.innerHTML = '⏳ Updating...';

      try {
        const res = await adminFetch('/admin/api/change-password', {
          method: 'POST',
          body: JSON.stringify({ currentPassword, newPassword, confirmPassword })
        });

        if (res.success) {
          closePasswordModal();
          showToast('Password updated successfully!');
          alert('Admin password has been updated successfully!');
        } else {
          throw new Error(res.error || res.message || 'Failed to update password');
        }
      } catch (err) {
        alertEl.textContent = err.message;
        alertEl.style.display = 'block';
      } finally {
        btn.disabled = false;
        btn.innerHTML = 'Update Password';
      }
    }

    // Initialize Topbar Publish Button
    const publishBtn = document.getElementById('btnPublishLive');
    if (publishBtn) {
      publishBtn.onclick = async function() {
        publishBtn.disabled = true;
        publishBtn.innerHTML = '⏳ Building &amp; Publishing...';
        try {
          const data = await adminFetch('/admin/api/publish', { method: 'POST', body: '{}' });
          if (data && data.success) {
            showToast('Site published successfully! Reloading...');
            setTimeout(function() { window.location.reload(); }, 1000);
          } else {
            showToast(data?.error || 'Build failed', 'error');
            publishBtn.disabled = false;
            publishBtn.innerHTML = '🚀 Rebuild &amp; Publish';
          }
        } catch (err) {
          showToast(err.message, 'error');
          publishBtn.disabled = false;
          publishBtn.innerHTML = '🚀 Rebuild &amp; Publish';
        }
      };
    }
  </script>
  ${extraScripts}
</body>
</html>`;
}

module.exports = renderAdminLayout;
