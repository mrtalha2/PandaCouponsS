/**
 * Admin 301 Redirects Manager View (Phase 17h)
 */

function renderRedirects({ redirects }) {
  const list = redirects || [];

  return `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
      <div>
        <h1 style="font-size: 1.85rem; font-weight: 800; margin: 0 0 0.5rem 0; color: #FFF;">301 Redirects Manager</h1>
        <p style="color: var(--admin-muted); margin: 0; font-size: 0.95rem;">
          Configure permanent URL forwardings to prevent 404s and preserve search rankings.
        </p>
      </div>
      <button id="btnNewRedirect" class="btn-admin-primary">
        ➕ Add New Redirect
      </button>
    </div>

    <!-- Redirects Table -->
    <div class="admin-card" style="padding: 0; overflow-x: auto;">
      <table class="admin-table">
        <thead>
          <tr>
            <th style="width: 40%;">Source Path (Old URL)</th>
            <th style="width: 40%;">Target Destination (New URL)</th>
            <th style="width: 10%;">Status</th>
            <th style="width: 10%; text-align: right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${list.map((r, idx) => `
            <tr>
              <td><code style="color: #F87171; background: rgba(239, 68, 68, 0.1); padding: 0.2rem 0.4rem; border-radius: 4px;">${r.from}</code></td>
              <td><code style="color: #34D399; background: rgba(16, 185, 129, 0.1); padding: 0.2rem 0.4rem; border-radius: 4px;">${r.to}</code></td>
              <td><span class="admin-badge badge-green">301 Permanent</span></td>
              <td style="text-align: right;">
                <button class="btn-admin-secondary" style="padding: 0.35rem 0.65rem; font-size: 0.8rem; color: #F87171;" onclick="deleteRedirect(${idx})">
                  🗑️ Delete
                </button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Modal for New Redirect -->
    <div id="redirectModal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 1000; align-items: center; justify-content: center; padding: 1rem;">
      <div style="background: #14141A; border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; max-width: 480px; width: 100%; padding: 2rem; box-sizing: border-box;">
        <h2 style="margin: 0 0 1.5rem 0; font-size: 1.35rem; color: #FFF;">Add 301 Redirect</h2>
        
        <form id="redirectForm">
          <div class="admin-form-group">
            <label class="admin-label" for="fromPath">Source Old Path (e.g. /coupons/)</label>
            <input class="admin-input" type="text" id="fromPath" required placeholder="/old-path/">
          </div>

          <div class="admin-form-group">
            <label class="admin-label" for="toPath">Destination Path (e.g. /)</label>
            <input class="admin-input" type="text" id="toPath" required placeholder="/">
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
            <button type="button" class="btn-admin-secondary" onclick="closeModal()">Cancel</button>
            <button type="submit" id="btnCreateRedirectSubmit" class="btn-admin-primary">Create Redirect</button>
          </div>
        </form>
      </div>
    </div>

    <script>
      const modal = document.getElementById('redirectModal');
      const createRedirectBtn = document.getElementById('btnCreateRedirectSubmit');

      document.getElementById('btnNewRedirect').onclick = () => {
        document.getElementById('redirectForm').reset();
        modal.style.display = 'flex';
      };
      function closeModal() {
        modal.style.display = 'none';
      }

      document.getElementById('redirectForm').onsubmit = async (e) => {
        e.preventDefault();
        createRedirectBtn.disabled = true;
        createRedirectBtn.innerHTML = '⏳ Creating...';

        try {
          let from = document.getElementById('fromPath').value.trim();
          let to = document.getElementById('toPath').value.trim();
          if (!from.startsWith('/')) from = '/' + from;
          if (!to.startsWith('/') && !to.startsWith('http')) to = '/' + to;

          const data = await adminFetch('/admin/api/redirects', {
            method: 'POST',
            body: JSON.stringify({ action: 'add', redirect: { from, to, status: 301 } })
          });

          if (data.success) {
            showToast('Redirect added successfully!');
            setTimeout(() => location.reload(), 800);
          } else {
            throw new Error(data.error || 'Server error');
          }
        } catch (err) {
          showToast(err.message, 'error');
          alert('Failed to add redirect: ' + err.message);
        } finally {
          createRedirectBtn.disabled = false;
          createRedirectBtn.innerHTML = 'Create Redirect';
        }
      };

      async function deleteRedirect(index) {
        if (!confirm('Delete this 301 redirect?')) return;
        try {
          const data = await adminFetch('/admin/api/redirects', {
            method: 'POST',
            body: JSON.stringify({ action: 'delete', index })
          });
          if (data.success) {
            showToast('Redirect deleted!');
            setTimeout(() => location.reload(), 600);
          }
        } catch (err) {
          showToast(err.message, 'error');
          alert('Failed to delete redirect: ' + err.message);
        }
      }
    </script>
  `;
}

module.exports = renderRedirects;

