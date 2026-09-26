/**
 * Admin Code Injections View (Phase 17c)
 * Provides syntax-highlighted code editors for Head, Body Start, and Body End slots.
 */

function renderCode({ injections }) {
  const data = injections || { head: '', bodyStart: '', bodyEnd: '' };

  return `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
      <div>
        <h1 style="font-size: 1.85rem; font-weight: 800; margin: 0 0 0.5rem 0; color: #FFF;">Custom Code Injection</h1>
        <p style="color: var(--admin-muted); margin: 0; font-size: 0.95rem;">
          Embed custom tracking scripts, meta tags, and analytics across all generated pages.
        </p>
      </div>
      <button id="btnSaveCode" class="btn-admin-primary">
        💾 Save Code Injections
      </button>
    </div>

    <!-- Security Warning Callout -->
    <div style="background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.3); border-left: 4px solid #EF4444; border-radius: 8px; padding: 1rem 1.25rem; margin-bottom: 2rem; display: flex; align-items: flex-start; gap: 0.85rem;">
      <span style="font-size: 1.4rem; line-height: 1;">⚠️</span>
      <div style="font-size: 0.88rem; color: #FCA5A5; line-height: 1.6;">
        <strong style="color: #FFF;">Warning: Trusted Administrative Execution:</strong>
        Content saved here is injected <strong>unescaped and unsanitized</strong> directly into public HTML at build time. This feature is intended strictly for trusted third-party analytics (Google Analytics, Microsoft Clarity), verification meta tags, and custom CSS. Never paste untrusted scripts.
      </div>
    </div>

    <!-- CodeMirror Assets (Loaded ONLY on admin page) -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/theme/dracula.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/xml/xml.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/javascript/javascript.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/css/css.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/htmlmixed/htmlmixed.min.js"></script>

    <style>
      .CodeMirror {
        height: 200px;
        border-radius: 6px;
        font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
        font-size: 0.88rem;
        border: 1px solid rgba(255, 255, 255, 0.15);
      }
    </style>

    <div class="admin-card">
      <h2 class="admin-card-title">1. Head Code (Injected just before &lt;/head&gt;)</h2>
      <p style="font-size: 0.85rem; color: var(--admin-muted); margin: 0.25rem 0 1rem 0;">
        Ideal for Google Analytics &lt;script&gt; tags, search console verification &lt;meta&gt;, and custom &lt;style&gt; blocks.
      </p>
      <textarea id="codeHead">${escapeHtml(data.head || '')}</textarea>
    </div>

    <div class="admin-card">
      <h2 class="admin-card-title">2. Body Start Code (Injected immediately after &lt;body&gt;)</h2>
      <p style="font-size: 0.85rem; color: var(--admin-muted); margin: 0.25rem 0 1rem 0;">
        Ideal for Google Tag Manager (noscript) containers or banner alert overlays.
      </p>
      <textarea id="codeBodyStart">${escapeHtml(data.bodyStart || '')}</textarea>
    </div>

    <div class="admin-card">
      <h2 class="admin-card-title">3. Body End Code (Injected just before &lt;/body&gt;)</h2>
      <p style="font-size: 0.85rem; color: var(--admin-muted); margin: 0.25rem 0 1rem 0;">
        Ideal for customer feedback widgets, live chat plugins, and deferred tracking pixels.
      </p>
      <textarea id="codeBodyEnd">${escapeHtml(data.bodyEnd || '')}</textarea>
    </div>

    <script>
      const editorConfig = {
        mode: 'htmlmixed',
        theme: 'dracula',
        lineNumbers: true,
        lineWrapping: true,
        tabSize: 2
      };

      const cmHead = CodeMirror.fromTextArea(document.getElementById('codeHead'), editorConfig);
      const cmBodyStart = CodeMirror.fromTextArea(document.getElementById('codeBodyStart'), editorConfig);
      const cmBodyEnd = CodeMirror.fromTextArea(document.getElementById('codeBodyEnd'), editorConfig);

      const btnSaveCode = document.getElementById('btnSaveCode');
      btnSaveCode.onclick = async () => {
        btnSaveCode.disabled = true;
        btnSaveCode.innerHTML = '⏳ Saving...';

        try {
          const payload = {
            head: cmHead.getValue().trim(),
            bodyStart: cmBodyStart.getValue().trim(),
            bodyEnd: cmBodyEnd.getValue().trim()
          };

          const data = await adminFetch('/admin/api/code', {
            method: 'POST',
            body: JSON.stringify(payload)
          });

          if (data.success) {
            showToast('Code injections saved successfully!');
          } else {
            throw new Error(data.error || 'Server error');
          }
        } catch (err) {
          showToast(err.message, 'error');
          alert('Failed to save code: ' + err.message);
        } finally {
          btnSaveCode.disabled = false;
          btnSaveCode.innerHTML = '💾 Save Code Injections';
        }
      };
    </script>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

module.exports = renderCode;

