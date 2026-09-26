/**
 * Admin Login Page View (Phase 17a)
 */

function renderLogin({ error = null, lockout = false, info = false }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Login | Panda Express Coupons</title>
  <link rel="icon" type="image/svg+xml" href="/public/favicon.svg">
  <link rel="stylesheet" href="/assets/css/style.min.css">
  <style>
    body {
      background-color: #0A0A0E;
      color: #F8FAFC;
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 1rem;
    }
    .login-card {
      background: #14141A;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 14px;
      padding: 2.5rem;
      max-width: 420px;
      width: 100%;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
      box-sizing: border-box;
    }
    .login-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1.75rem;
      justify-content: center;
    }
    .login-logo img {
      width: 44px;
      height: 44px;
    }
    .login-logo h1 {
      font-size: 1.35rem;
      font-weight: 800;
      margin: 0;
      color: #FFF;
    }
    .form-group {
      margin-bottom: 1.25rem;
    }
    .form-label {
      display: block;
      font-size: 0.88rem;
      font-weight: 600;
      color: #CBD5E1;
      margin-bottom: 0.4rem;
    }
    .form-input {
      width: 100%;
      background: #09090C;
      border: 1px solid rgba(255, 255, 255, 0.18);
      border-radius: 6px;
      padding: 0.75rem 0.9rem;
      color: #FFF;
      font-family: inherit;
      font-size: 0.95rem;
      box-sizing: border-box;
      transition: border-color 0.15s;
    }
    .form-input:focus {
      outline: none;
      border-color: #C8102E;
      box-shadow: 0 0 0 2px rgba(200, 16, 46, 0.3);
    }
    .btn-login {
      width: 100%;
      background: #C8102E;
      color: #FFF;
      border: none;
      padding: 0.8rem;
      font-size: 1rem;
      font-weight: 700;
      border-radius: 6px;
      cursor: pointer;
      margin-top: 0.5rem;
      transition: background 0.15s;
    }
    .btn-login:hover {
      background: #E01335;
    }
    .btn-login:disabled {
      background: #475569;
      cursor: not-allowed;
    }
    .error-alert {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.35);
      color: #FCA5A5;
      padding: 0.75rem 1rem;
      border-radius: 6px;
      font-size: 0.88rem;
      margin-bottom: 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .info-alert {
      background: rgba(245, 179, 1, 0.15);
      border: 1px solid rgba(245, 179, 1, 0.35);
      color: #FCD34D;
      padding: 0.75rem 1rem;
      border-radius: 6px;
      font-size: 0.88rem;
      margin-bottom: 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  </style>
</head>
<body>
  <div class="login-card">
    <div class="login-logo">
      <img src="/public/favicon.svg" alt="Panda Logo">
      <h1>Admin Portal</h1>
    </div>

    ${error ? `
      <div class="${info ? 'info-alert' : 'error-alert'}">
        <span>${info ? 'ℹ️' : '⚠️'}</span>
        <div>${error}</div>
      </div>
    ` : ''}

    <form method="POST" action="/admin/login">
      <div class="form-group">
        <label class="form-label" for="username">Username</label>
        <input class="form-input" type="text" id="username" name="username" required autocomplete="username" autofocus ${lockout ? 'disabled' : ''}>
      </div>

      <div class="form-group">
        <label class="form-label" for="password">Password</label>
        <input class="form-input" type="password" id="password" name="password" required autocomplete="current-password" ${lockout ? 'disabled' : ''}>
      </div>

      <button type="submit" class="btn-login" ${lockout ? 'disabled' : ''}>
        Sign In to Admin
      </button>
    </form>
    
    <div style="margin-top: 1.5rem; text-align: center; font-size: 0.82rem; color: #64748B;">
      Protected administrative area &bull; Rate-limited sessions
    </div>
  </div>
</body>
</html>`;
}

module.exports = renderLogin;
