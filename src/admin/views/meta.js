/**
 * Admin SEO & Social Meta Editor View (Phase 17e)
 */

function renderMeta({ activePath = '/', metaData, mediaUploads = [] }) {
  const currentMeta = (metaData && metaData[activePath]) || {
    title: '',
    description: '',
    ogImage: '',
    canonical: '',
    noindex: false
  };

  const pages = [
    { path: '/', label: 'Homepage (/)' },
    { path: '/panda-express-menu/', label: 'Menu Prices (/panda-express-menu/)' },
    { path: '/panda-express-nutrition/', label: 'Nutrition Calculator (/panda-express-nutrition/)' },
    { path: '/panda-express-orange-chicken/', label: 'Orange Chicken (/panda-express-orange-chicken/)' },
    { path: '/beijing-beef/', label: 'Beijing Beef (/beijing-beef/)' },
    { path: '/about-us/', label: 'About Us (/about-us/)' },
    { path: '/contact-us/', label: 'Contact Us (/contact-us/)' },
    { path: '/privacy-policy/', label: 'Privacy Policy (/privacy-policy/)' },
    { path: '/disclaimer/', label: 'Disclaimer (/disclaimer/)' }
  ];

  return `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
      <div>
        <h1 style="font-size: 1.85rem; font-weight: 800; margin: 0 0 0.5rem 0; color: #FFF;">SEO &amp; Social Meta Editor</h1>
        <p style="color: var(--admin-muted); margin: 0; font-size: 0.95rem;">
          Configure title tags, search snippets, Open Graph preview cards, and canonical indexing.
        </p>
      </div>
      <button id="btnSaveMeta" class="btn-admin-primary">
        💾 Save Metadata
      </button>
    </div>

    <!-- Page Selection Dropdown -->
    <div class="admin-card" style="padding: 1.25rem 1.5rem; margin-bottom: 1.5rem;">
      <div style="display: flex; align-items: center; gap: 1rem; flex-wrap: wrap;">
        <label class="admin-label" style="margin: 0; white-space: nowrap;" for="selectMetaRoute">Select Route to Edit:</label>
        <select class="admin-select" id="selectMetaRoute" style="max-width: 400px;" onchange="location.href='/admin/meta?path=' + encodeURIComponent(this.value)">
          ${pages.map(p => `
            <option value="${p.path}" ${p.path === activePath ? 'selected' : ''}>${p.label}</option>
          `).join('')}
        </select>
      </div>
    </div>

    <form id="metaForm">
      <div class="admin-card">
        <h2 class="admin-card-title" style="margin-bottom: 1.5rem;">Meta Tags for ${activePath}</h2>

        <div class="admin-form-group">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.35rem;">
            <label class="admin-label" for="metaTitle" style="margin-bottom: 0;">SEO Meta Title Tag</label>
            <span id="metaTitleCount" style="font-size: 0.8rem; font-weight: 600; color: var(--admin-muted);">0 / 60 chars</span>
          </div>
          <input class="admin-input" type="text" id="metaTitle" name="title" value="${escapeHtml(currentMeta.title || '')}" placeholder="Leave blank to use default template title">
        </div>

        <div class="admin-form-group">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.35rem;">
            <label class="admin-label" for="metaDesc" style="margin-bottom: 0;">Meta Description</label>
            <span id="metaDescCount" style="font-size: 0.8rem; font-weight: 600; color: var(--admin-muted);">0 / 160 chars</span>
          </div>
          <textarea class="admin-textarea" id="metaDesc" name="description" rows="3" placeholder="Leave blank to use default template description">${escapeHtml(currentMeta.description || '')}</textarea>
        </div>

        <div class="admin-form-group">
          <label class="admin-label" for="metaOgImage">Social Share Image URL (Open Graph / Twitter)</label>
          <div style="display: flex; gap: 0.5rem;">
            <input class="admin-input" type="text" id="metaOgImage" name="ogImage" value="${escapeHtml(currentMeta.ogImage || '')}" placeholder="/public/images/og/og-default.jpg">
            <button type="button" class="btn-admin-secondary" onclick="openMediaPicker()">Pick from Library</button>
          </div>
        </div>

        <div class="admin-form-group">
          <label class="admin-label" for="metaCanonical">Canonical URL Override (Optional)</label>
          <input class="admin-input" type="text" id="metaCanonical" name="canonical" value="${escapeHtml(currentMeta.canonical || '')}" placeholder="https://pandacoupons.org${activePath}">
        </div>

        <div class="admin-form-group" style="margin-top: 1.5rem; display: flex; align-items: center; gap: 0.75rem;">
          <input type="checkbox" id="metaNoindex" name="noindex" value="true" ${currentMeta.noindex ? 'checked' : ''} style="width: 18px; height: 18px; cursor: pointer;">
          <label for="metaNoindex" style="font-size: 0.92rem; color: #F87171; font-weight: 600; cursor: pointer;">
            Instruct search engines not to index this page (noindex, nofollow)
          </label>
        </div>
      </div>
    </form>

    <!-- Media Picker Modal -->
    <div id="mediaPickerModal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 1000; align-items: center; justify-content: center; padding: 2rem;">
      <div style="background: #14141A; border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; max-width: 720px; width: 100%; max-height: 80vh; display: flex; flex-direction: column; padding: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h3 style="margin: 0; color: #FFF;">Select an Image</h3>
          <button onclick="closeMediaPicker()" class="btn-admin-secondary" style="padding: 0.3rem 0.6rem;">✕</button>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 1rem; overflow-y: auto; flex: 1; padding: 0.5rem 0;">
          ${mediaUploads.length === 0 ? `
            <div style="grid-column: 1 / -1; text-align: center; color: var(--admin-muted); padding: 2rem;">
              No uploaded media found. Visit the Media Library to upload new images.
            </div>
          ` : mediaUploads.map(m => `
            <div onclick="selectImage('${m.url}')" style="cursor: pointer; background: #0A0A0E; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; overflow: hidden; text-align: center; padding: 0.5rem;">
              <img src="${m.url}" style="width: 100%; height: 80px; object-fit: cover; border-radius: 4px;" alt="">
              <div style="font-size: 0.72rem; color: #CBD5E1; margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${m.filename}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <script>
      function escapeHtml(str) {
        return str ? str.replace(/"/g, '&quot;') : '';
      }

      function openMediaPicker() {
        document.getElementById('mediaPickerModal').style.display = 'flex';
      }
      function closeMediaPicker() {
        document.getElementById('mediaPickerModal').style.display = 'none';
      }
      function selectImage(url) {
        document.getElementById('metaOgImage').value = url;
        closeMediaPicker();
      }

      function updateCharCounts() {
        const titleInput = document.getElementById('metaTitle');
        const descInput = document.getElementById('metaDesc');
        const titleBadge = document.getElementById('metaTitleCount');
        const descBadge = document.getElementById('metaDescCount');

        if (titleInput && titleBadge) {
          const tLen = titleInput.value.length;
          titleBadge.textContent = tLen + ' / 60 chars (ideal: 50–60)';
          if (tLen >= 50 && tLen <= 60) {
            titleBadge.style.color = '#34D399';
          } else if (tLen > 60) {
            titleBadge.style.color = '#F87171';
          } else {
            titleBadge.style.color = 'var(--admin-muted)';
          }
        }

        if (descInput && descBadge) {
          const dLen = descInput.value.length;
          descBadge.textContent = dLen + ' / 160 chars (ideal: 140–160)';
          if (dLen >= 140 && dLen <= 160) {
            descBadge.style.color = '#34D399';
          } else if (dLen > 160) {
            descBadge.style.color = '#F87171';
          } else {
            descBadge.style.color = 'var(--admin-muted)';
          }
        }
      }

      document.getElementById('metaTitle').addEventListener('input', updateCharCounts);
      document.getElementById('metaDesc').addEventListener('input', updateCharCounts);
      updateCharCounts();

      const btnSaveMeta = document.getElementById('btnSaveMeta');
      btnSaveMeta.onclick = async () => {
        btnSaveMeta.disabled = true;
        btnSaveMeta.innerHTML = '⏳ Saving...';

        try {
          const payload = {
            path: '${activePath}',
            meta: {
              title: document.getElementById('metaTitle').value.trim(),
              description: document.getElementById('metaDesc').value.trim(),
              ogImage: document.getElementById('metaOgImage').value.trim(),
              canonical: document.getElementById('metaCanonical').value.trim(),
              noindex: document.getElementById('metaNoindex').checked
            }
          };

          const data = await adminFetch('/admin/api/meta', {
            method: 'POST',
            body: JSON.stringify(payload)
          });

          if (data.success) {
            showToast('Metadata saved successfully!');
          } else {
            throw new Error(data.error || 'Server error');
          }
        } catch (err) {
          showToast(err.message, 'error');
          alert('Failed to save meta: ' + err.message);
        } finally {
          btnSaveMeta.disabled = false;
          btnSaveMeta.innerHTML = '💾 Save Metadata';
        }
      };
    </script>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

module.exports = renderMeta;

