/**
 * Admin Media Library View (Phase 17g)
 */

function renderMedia({ uploads = [] }) {
  return `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
      <div>
        <h1 style="font-size: 1.85rem; font-weight: 800; margin: 0 0 0.5rem 0; color: #FFF;">Media Library</h1>
        <p style="color: var(--admin-muted); margin: 0; font-size: 0.95rem;">
          Upload images with automatic Sharp WebP optimization (640w, 800w, 1200w).
        </p>
      </div>
    </div>

    <!-- Upload Dropzone Card -->
    <div class="admin-card" style="text-align: center; border: 2px dashed rgba(255,255,255,0.2); background: rgba(255,255,255,0.02); padding: 2.5rem 1.5rem; margin-bottom: 2rem;">
      <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">📤</div>
      <h3 style="color: #FFF; margin: 0 0 0.5rem 0; font-size: 1.15rem;">Drag &amp; Drop Image Here or Browse</h3>
      <p style="color: var(--admin-muted); font-size: 0.88rem; margin: 0 0 1.25rem 0;">
        Supports JPG, PNG, WebP. Automatically converted to responsive WebP variants.
      </p>
      <input type="file" id="mediaFileInput" accept="image/*" style="display: none;">
      <button class="btn-admin-primary" onclick="document.getElementById('mediaFileInput').click()">
        📁 Choose Image File
      </button>
      <div id="uploadStatus" style="margin-top: 1rem; font-size: 0.88rem; color: #F5B301; display: none;"></div>
    </div>

    <!-- Uploads Grid -->
    <div class="admin-card">
      <h2 class="admin-card-title" style="margin-bottom: 1.25rem;">Uploaded Media Assets (${uploads.length})</h2>

      ${uploads.length === 0 ? `
        <div style="padding: 2rem; text-align: center; color: var(--admin-muted);">
          No images uploaded yet. Use the upload box above to add your first photo.
        </div>
      ` : `
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.25rem;">
          ${uploads.map(u => `
            <div style="background: #0B0B0E; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 8px; overflow: hidden; display: flex; flex-direction: column;">
              <div style="height: 140px; background: #16161D; overflow: hidden; display: flex; align-items: center; justify-content: center;">
                <img src="${u.url}" alt="${u.filename}" style="width: 100%; height: 100%; object-fit: cover;">
              </div>
              <div style="padding: 0.85rem; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                  <div style="font-size: 0.82rem; font-weight: 700; color: #F1F5F9; word-break: break-all; margin-bottom: 4px;">
                    ${u.filename}
                  </div>
                  <div style="font-size: 0.75rem; color: var(--admin-muted);">
                    ${u.sizeKb} KB &bull; WebP Optimized
                  </div>
                </div>
                <div style="margin-top: 0.75rem;">
                  <button class="btn-admin-secondary" style="width: 100%; font-size: 0.75rem; padding: 0.35rem;" onclick="copyUrl('${u.url}')">
                    📋 Copy Path
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>

    <script>
      const fileInput = document.getElementById('mediaFileInput');
      const statusDiv = document.getElementById('uploadStatus');

      fileInput.onchange = async () => {
        const file = fileInput.files[0];
        if (!file) return;

        statusDiv.style.display = 'block';
        statusDiv.textContent = '⏳ Uploading and optimizing image with Sharp...';

        const formData = new FormData();
        formData.append('file', file);

        try {
          const res = await fetch('/admin/api/media/upload', {
            method: 'POST',
            headers: { 'X-CSRF-Token': window.CSRF_TOKEN || getCsrfToken() },
            credentials: 'same-origin',
            body: formData
          });

          if (res.status === 401 || (res.redirected && res.url.includes('/admin/login'))) {
            handleSessionExpired();
            throw new Error('Your session expired — redirecting to login...');
          }

          const contentType = res.headers.get('content-type') || '';
          let data;
          if (contentType.includes('application/json')) {
            data = await res.json();
          } else {
            const text = await res.text();
            if (text.includes('Admin Login')) {
              handleSessionExpired();
              throw new Error('Your session expired — redirecting to login...');
            }
            throw new Error('Server error: ' + text.substring(0, 100));
          }

          if (data && data.success) {
            statusDiv.textContent = '✓ Upload and optimization complete!';
            showToast('Image uploaded and optimized successfully!');
            setTimeout(() => location.reload(), 900);
          } else {
            const errMsg = data?.error || 'Server error';
            statusDiv.textContent = '❌ Upload failed: ' + errMsg;
            showToast(errMsg, 'error');
            alert('Upload failed: ' + errMsg);
          }
        } catch (err) {
          statusDiv.textContent = '❌ Upload error: ' + err.message;
          showToast(err.message, 'error');
        } finally {
          fileInput.value = '';
        }
      };

      function copyUrl(url) {
        navigator.clipboard.writeText(url);
        showToast('Path copied to clipboard: ' + url);
      }
    </script>
  `;
}

module.exports = renderMedia;
