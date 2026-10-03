/**
 * Visual Block-Based Page Editor (WordPress / Gutenberg Style)
 * Unified visual canvas for all pages.
 * Supports in-place contenteditable editing, floating text format toolbar,
 * drag-and-drop block reordering, undo/redo history stack, block copy/paste,
 * dynamic internal link picker, block inserter popover, autosave, and atomic publishing.
 */

const { renderBlocks } = require('../block-renderer');
const { getSiteRoutes } = require('../site-routes');
const { PAGE_ALLOWED_SMART_BLOCKS, SMART_BLOCK_TYPES } = require('../block-schema');
const { getDynamicDate } = require('../../utils/date');

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderVisualEditor({ activePage = 'home', blocks = [], publishState }) {
  const siteRoutes = getSiteRoutes();
  const allowedSmart = PAGE_ALLOWED_SMART_BLOCKS[activePage] || [];

  const pagesList = [
    { key: 'home', label: '🏠 Homepage', path: '/' },
    { key: 'menu', label: '📖 Menu Prices', path: '/panda-express-menu/' },
    { key: 'nutrition', label: '🥗 Nutrition Calculator', path: '/panda-express-nutrition/' },
    { key: 'orange-chicken', label: '🍗 Orange Chicken Dish', path: '/panda-express-orange-chicken/' },
    { key: 'beijing-beef', label: '🥩 Beijing Beef Dish', path: '/beijing-beef/' },
    { key: 'about', label: '🏢 About Us', path: '/about-us/' },
    { key: 'contact', label: '✉️ Contact Us', path: '/contact-us/' },
    { key: 'disclaimer', label: '⚖️ Disclaimer', path: '/disclaimer/' },
    { key: 'privacy', label: '🔒 Privacy Policy', path: '/privacy-policy/' }
  ];

  const currentPageObj = pagesList.find(p => p.key === activePage) || pagesList[0];

  const canvasHtml = renderBlocks(blocks, { lastVerified: getDynamicDate().currentMonthYear }, true);

  return `
    <div class="visual-editor-root">
      <!-- Editor Top Control Bar -->
      <div class="editor-header-bar">
        <div class="editor-header-left">
          <div class="page-selector-wrapper">
            <label for="pageSelector" class="visually-hidden">Select Page to Edit</label>
            <select id="pageSelector" class="admin-select-page" onchange="window.location.href='/admin/pages?page=' + this.value">
              ${pagesList.map(p => `
                <option value="${p.key}" ${activePage === p.key ? 'selected' : ''}>
                  ${p.label} (${p.path})
                </option>
              `).join('')}
            </select>
          </div>

          <div class="editor-history-buttons">
            <button type="button" id="btnUndo" class="btn-editor-tool" title="Undo (Ctrl+Z)" onclick="editorUndo()">
              ↶
            </button>
            <button type="button" id="btnRedo" class="btn-editor-tool" title="Redo (Ctrl+Y / Ctrl+Shift+Z)" onclick="editorRedo()">
              ↷
            </button>
          </div>

          <div class="editor-clipboard-buttons">
            <button type="button" id="btnPasteBlock" class="btn-editor-tool" title="Paste Copied Block Below Selected" onclick="pasteCopiedBlock()">
              📋 Paste Block
            </button>
          </div>

          <div class="editor-save-status" id="saveStatusIndicator">
            <span class="status-dot dot-green"></span>
            <span class="status-text">All changes saved</span>
          </div>
        </div>

        <div class="editor-header-right">
          <a id="btnPreviewDraft" href="/admin/preview/${activePage}" target="_blank" class="btn-admin-secondary">
            👁️ Preview Draft
          </a>
          <button type="button" id="btnManualSave" class="btn-admin-secondary" onclick="triggerSave(true)">
            💾 Save Draft
          </button>
          <button type="button" id="btnPublishLive" class="btn-admin-primary" onclick="triggerPublish()">
            🚀 Publish Page
          </button>
        </div>
      </div>

      <!-- Editor Canvas Wrapper -->
      <div class="editor-canvas-stage">
        <div class="editor-canvas-viewport">
          <div class="editor-page-badge">
            <span>Visual Canvas: <strong>${currentPageObj.label}</strong></span>
            <span style="opacity: 0.6; font-size: 0.8rem;">Click text to edit inline • Hover for block actions &amp; inserter (+)</span>
          </div>

          <!-- The Live Interactive Block Canvas -->
          ${canvasHtml}
        </div>
      </div>

      <!-- Floating Text Formatting Mini-Toolbar -->
      <div id="floatingTextToolbar" class="floating-selection-toolbar" style="display: none;">
        <button type="button" class="btn-toolbar-mark btn-bold" title="Bold (Ctrl+B)" onmousedown="event.preventDefault(); execFormat('bold');">B</button>
        <button type="button" class="btn-toolbar-mark btn-italic" title="Italic (Ctrl+I)" onmousedown="event.preventDefault(); execFormat('italic');">I</button>
        <div class="toolbar-divider"></div>
        <button type="button" class="btn-toolbar-mark btn-link" title="Hyperlink (Ctrl+K)" onmousedown="event.preventDefault(); openLinkDialog();">🔗 Link</button>
        <button type="button" class="btn-toolbar-mark btn-unlink" title="Remove Link" onmousedown="event.preventDefault(); execFormat('unlink');">🚫</button>
      </div>

      <!-- Block Inserter Modal / Popover -->
      <div id="blockInserterModal" class="admin-modal-backdrop" style="display: none;">
        <div class="admin-modal-card inserter-modal-card">
          <div class="modal-header">
            <h3>➕ Insert Block</h3>
            <button type="button" class="modal-close-btn" onclick="closeBlockPicker()">&times;</button>
          </div>

          <div class="inserter-tabs">
            <button type="button" class="inserter-tab is-active" id="tabFreeBlocks" onclick="switchInserterTab('free')">Content Blocks</button>
            <button type="button" class="inserter-tab" id="tabSmartBlocks" onclick="switchInserterTab('smart')">Components</button>
          </div>

          <!-- Free Blocks List -->
          <div id="panelFreeBlocks" class="inserter-grid">
            <button type="button" class="inserter-item-btn" onclick="insertNewBlock('heading')">
              <span class="item-icon">H</span>
              <span class="item-label">Heading</span>
              <span class="item-desc">Section title or subhead</span>
            </button>
            <button type="button" class="inserter-item-btn" onclick="insertNewBlock('paragraph')">
              <span class="item-icon">¶</span>
              <span class="item-label">Paragraph</span>
              <span class="item-desc">Rich body text with inline links</span>
            </button>
            <button type="button" class="inserter-item-btn" onclick="insertNewBlock('image')">
              <span class="item-icon">🖼️</span>
              <span class="item-label">Image</span>
              <span class="item-desc">Photo with caption</span>
            </button>
            <button type="button" class="inserter-item-btn" onclick="insertNewBlock('button')">
              <span class="item-icon">🔘</span>
              <span class="item-label">Button</span>
              <span class="item-desc">Call to action link button</span>
            </button>
            <button type="button" class="inserter-item-btn" onclick="insertNewBlock('quote')">
              <span class="item-icon">❝</span>
              <span class="item-label">Quote</span>
              <span class="item-desc">Editorial callout blockquote</span>
            </button>
            <button type="button" class="inserter-item-btn" onclick="insertNewBlock('callout')">
              <span class="item-icon">🎯</span>
              <span class="item-label">Callout Box</span>
              <span class="item-desc">Highlighted notice or alert</span>
            </button>
            <button type="button" class="inserter-item-btn" onclick="insertNewBlock('faq-item')">
              <span class="item-icon">❓</span>
              <span class="item-label">FAQ Item</span>
              <span class="item-desc">Question and answer box</span>
            </button>
            <button type="button" class="inserter-item-btn" onclick="insertNewBlock('divider')">
              <span class="item-icon">―</span>
              <span class="item-label">Divider</span>
              <span class="item-desc">Horizontal rule divider</span>
            </button>
            <button type="button" class="inserter-item-btn" onclick="insertNewBlock('spacer')">
              <span class="item-icon">↕</span>
              <span class="item-label">Spacer</span>
              <span class="item-desc">Vertical whitespace buffer</span>
            </button>
          </div>

          <!-- Smart Components List (Restricted by page) -->
          <div id="panelSmartBlocks" class="inserter-grid" style="display: none;">
            ${allowedSmart.length === 0 ? '<p style="grid-column: 1/-1; color: var(--admin-muted); text-align: center; padding: 1.5rem;">No smart components designated for this page.</p>' : ''}
            ${allowedSmart.includes('hero') ? `
              <button type="button" class="inserter-item-btn" onclick="insertNewBlock('hero')">
                <span class="item-icon">🌟</span>
                <span class="item-label">Hero Banner</span>
                <span class="item-desc">Above-the-fold banner with CTA</span>
              </button>
            ` : ''}
            ${allowedSmart.includes('coupon-grid') ? `
              <button type="button" class="inserter-item-btn" onclick="insertNewBlock('coupon-grid')">
                <span class="item-icon">🎟️</span>
                <span class="item-label">Coupon Grid</span>
                <span class="item-desc">Live coupon tickets &amp; filters</span>
              </button>
            ` : ''}
            ${allowedSmart.includes('rewards-calculator') ? `
              <button type="button" class="inserter-item-btn" onclick="insertNewBlock('rewards-calculator')">
                <span class="item-icon">🐼</span>
                <span class="item-label">Rewards Calculator</span>
                <span class="item-desc">Panda Rewards tier ladder</span>
              </button>
            ` : ''}
            ${allowedSmart.includes('family-meal-stepper') ? `
              <button type="button" class="inserter-item-btn" onclick="insertNewBlock('family-meal-stepper')">
                <span class="item-icon">🥡</span>
                <span class="item-label">Family Meal Stepper</span>
                <span class="item-desc">Cost comparison &amp; bundle guide</span>
              </button>
            ` : ''}
            ${allowedSmart.includes('faq-accordion') ? `
              <button type="button" class="inserter-item-btn" onclick="insertNewBlock('faq-accordion')">
                <span class="item-icon">📑</span>
                <span class="item-label">FAQ Accordion</span>
                <span class="item-desc">Interactive accordion from FAQ data</span>
              </button>
            ` : ''}
            ${allowedSmart.includes('nutrition-calculator') ? `
              <button type="button" class="inserter-item-btn" onclick="insertNewBlock('nutrition-calculator')">
                <span class="item-icon">🥗</span>
                <span class="item-label">Nutrition Calculator</span>
                <span class="item-desc">Live interactive combo engine</span>
              </button>
            ` : ''}
            ${allowedSmart.includes('menu-grid') ? `
              <button type="button" class="inserter-item-btn" onclick="insertNewBlock('menu-grid')">
                <span class="item-icon">📖</span>
                <span class="item-label">Menu Grid</span>
                <span class="item-desc">Live dish catalog &amp; prices</span>
              </button>
            ` : ''}
            ${allowedSmart.includes('dish-guide') ? `
              <button type="button" class="inserter-item-btn" onclick="insertNewBlock('dish-guide')">
                <span class="item-icon">🍽️</span>
                <span class="item-label">Dish Specialty Guide</span>
                <span class="item-desc">Flagship dish overview card</span>
              </button>
            ` : ''}
            ${allowedSmart.includes('contact-form') ? `
              <button type="button" class="inserter-item-btn" onclick="insertNewBlock('contact-form')">
                <span class="item-icon">✉️</span>
                <span class="item-label">Contact Inquiries Form</span>
                <span class="item-desc">Accessible message form &amp; email</span>
              </button>
            ` : ''}
          </div>
        </div>
      </div>

      <!-- Hyperlink Modal Dialog -->
      <div id="editorLinkModal" class="admin-modal-backdrop" style="display: none;">
        <div class="admin-modal-card">
          <div class="modal-header">
            <h3>🔗 Insert / Edit Hyperlink</h3>
            <button type="button" class="modal-close-btn" onclick="closeLinkDialog()">&times;</button>
          </div>

          <div style="display: flex; gap: 0.5rem; margin-bottom: 1.25rem;">
            <button type="button" id="tabLinkInternal" class="btn-admin-primary" style="flex: 1; font-size: 0.85rem;" onclick="setLinkDialogMode('internal')">Internal Page</button>
            <button type="button" id="tabLinkExternal" class="btn-admin-secondary" style="flex: 1; font-size: 0.85rem;" onclick="setLinkDialogMode('external')">External URL</button>
          </div>

          <div id="dialogSecInternal" class="admin-form-group">
            <label class="admin-label" for="dialogSelectInternal">Select Site Page / Route</label>
            <select id="dialogSelectInternal" class="admin-input" style="background: #0B0B0E; color: #FFF;">
              ${siteRoutes.map(r => `<option value="${escapeHtml(r.url)}">${escapeHtml(r.title)} (${escapeHtml(r.url)})</option>`).join('')}
            </select>
          </div>

          <div id="dialogSecExternal" class="admin-form-group" style="display: none;">
            <label class="admin-label" for="dialogInputExternal">External URL (https://...)</label>
            <input type="url" id="dialogInputExternal" class="admin-input" placeholder="https://example.com/target" style="background: #0B0B0E; color: #FFF;">
          </div>

          <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.6rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.88rem; color: #E2E8F0; cursor: pointer;">
              <input type="checkbox" id="dialogChkNewTab" style="accent-color: #C8102E;">
              Open in new tab (<code style="color: #F5B301; font-size: 0.8rem;">target="_blank" rel="noopener noreferrer"</code>)
            </label>
            <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.88rem; color: #E2E8F0; cursor: pointer;">
              <input type="checkbox" id="dialogChkSponsored" style="accent-color: #C8102E;">
              Mark as sponsored / nofollow (<code style="color: #F5B301; font-size: 0.8rem;">rel="nofollow sponsored"</code>)
            </label>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
            <button type="button" class="btn-admin-secondary" onclick="closeLinkDialog()">Cancel</button>
            <button type="button" class="btn-admin-primary" onclick="applyLinkDialog()">Apply Link</button>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal for Smart Blocks -->
      <div id="deleteConfirmModal" class="admin-modal-backdrop" style="display: none;">
        <div class="admin-modal-card" style="max-width: 420px;">
          <div class="modal-header">
            <h3 style="color: #EF4444;">⚠️ Delete Smart Component?</h3>
            <button type="button" class="modal-close-btn" onclick="closeDeleteConfirm()">&times;</button>
          </div>
          <p style="color: #94A3B8; font-size: 0.95rem; line-height: 1.6; margin: 1rem 0 1.5rem 0;">
            This will remove the component from this page's layout. The underlying data source will remain intact in the admin database.
          </p>
          <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
            <button type="button" class="btn-admin-secondary" onclick="closeDeleteConfirm()">Cancel</button>
            <button type="button" class="btn-admin-primary" style="background: #DC2626; border-color: #DC2626;" onclick="confirmDeleteBlock()">Delete Component</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Client-Side Block Editor Engine Script -->
    <script>
      let activePageSlug = '${activePage}';
      let pageBlocks = ${JSON.stringify(blocks)};
      let historyStack = [];
      let historyIndex = -1;
      let targetInsertIndex = -1;
      let pendingDeleteBlockId = null;
      let copiedBlockData = null;
      let activeSelectionRange = null;
      let autosaveTimer = null;
      let hasUnsavedChanges = false;
      let linkDialogMode = 'internal';

      // Record snapshot in history
      function recordHistory(desc = '') {
        const snapshot = JSON.parse(JSON.stringify(pageBlocks));
        historyStack = historyStack.slice(0, historyIndex + 1);
        historyStack.push(snapshot);
        historyIndex++;
        if (historyStack.length > 50) {
          historyStack.shift();
          historyIndex--;
        }
        updateHistoryButtons();
        markUnsaved();
      }

      function updateHistoryButtons() {
        const btnUndo = document.getElementById('btnUndo');
        const btnRedo = document.getElementById('btnRedo');
        if (btnUndo) btnUndo.disabled = historyIndex <= 0;
        if (btnRedo) btnRedo.disabled = historyIndex >= historyStack.length - 1;
      }

      function editorUndo() {
        if (historyIndex > 0) {
          historyIndex--;
          pageBlocks = JSON.parse(JSON.stringify(historyStack[historyIndex]));
          renderCanvasFromState();
          updateHistoryButtons();
          markUnsaved();
        }
      }

      function editorRedo() {
        if (historyIndex < historyStack.length - 1) {
          historyIndex++;
          pageBlocks = JSON.parse(JSON.stringify(historyStack[historyIndex]));
          renderCanvasFromState();
          updateHistoryButtons();
          markUnsaved();
        }
      }

      function markUnsaved() {
        hasUnsavedChanges = true;
        const ind = document.getElementById('saveStatusIndicator');
        if (ind) {
          ind.innerHTML = '<span class="status-dot dot-yellow"></span><span class="status-text">Unsaved changes</span>';
        }
        clearTimeout(autosaveTimer);
        autosaveTimer = setTimeout(() => triggerSave(false), 10000);
      }

      function markSaved() {
        hasUnsavedChanges = false;
        const ind = document.getElementById('saveStatusIndicator');
        if (ind) {
          ind.innerHTML = '<span class="status-dot dot-green"></span><span class="status-text">All changes saved</span>';
        }
      }

      function markSaving() {
        const ind = document.getElementById('saveStatusIndicator');
        if (ind) {
          ind.innerHTML = '<span class="status-dot dot-blue"></span><span class="status-text">Saving draft...</span>';
        }
      }

      // Sync edited text fields back into pageBlocks state
      function syncBlockField(blockId, field, value) {
        const block = pageBlocks.find(b => b.id === blockId);
        if (block) {
          block[field] = value;
          markUnsaved();
        }
      }

      // Drag & Drop Reordering
      let draggedBlockId = null;
      function handleBlockDragStart(e, id) {
        draggedBlockId = id;
        e.dataTransfer.setData('text/plain', id);
        e.dataTransfer.effectAllowed = 'move';
      }

      document.addEventListener('dragover', (e) => {
        const targetBlock = e.target.closest('.admin-block-wrapper');
        if (targetBlock && draggedBlockId) {
          e.preventDefault();
          targetBlock.classList.add('drag-over-active');
        }
      });

      document.addEventListener('dragleave', (e) => {
        const targetBlock = e.target.closest('.admin-block-wrapper');
        if (targetBlock) {
          targetBlock.classList.remove('drag-over-active');
        }
      });

      document.addEventListener('drop', (e) => {
        const targetBlock = e.target.closest('.admin-block-wrapper');
        if (targetBlock && draggedBlockId) {
          e.preventDefault();
          targetBlock.classList.remove('drag-over-active');
          const targetId = targetBlock.dataset.blockId;
          if (draggedBlockId !== targetId) {
            const fromIdx = pageBlocks.findIndex(b => b.id === draggedBlockId);
            const toIdx = pageBlocks.findIndex(b => b.id === targetId);
            if (fromIdx !== -1 && toIdx !== -1) {
              const [moved] = pageBlocks.splice(fromIdx, 1);
              pageBlocks.splice(toIdx, 0, moved);
              recordHistory('Reordered blocks');
              renderCanvasFromState();
            }
          }
          draggedBlockId = null;
        }
      });

      // Move Block Actions
      function moveBlockUp(id) {
        const idx = pageBlocks.findIndex(b => b.id === id);
        if (idx > 0) {
          const [moved] = pageBlocks.splice(idx, 1);
          pageBlocks.splice(idx - 1, 0, moved);
          recordHistory('Moved block up');
          renderCanvasFromState();
        }
      }

      function moveBlockDown(id) {
        const idx = pageBlocks.findIndex(b => b.id === id);
        if (idx !== -1 && idx < pageBlocks.length - 1) {
          const [moved] = pageBlocks.splice(idx, 1);
          pageBlocks.splice(idx + 1, 0, moved);
          recordHistory('Moved block down');
          renderCanvasFromState();
        }
      }

      function duplicateBlock(id) {
        const idx = pageBlocks.findIndex(b => b.id === id);
        if (idx !== -1) {
          const clone = JSON.parse(JSON.stringify(pageBlocks[idx]));
          clone.id = 'b_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36).substring(4);
          pageBlocks.splice(idx + 1, 0, clone);
          recordHistory('Duplicated block');
          renderCanvasFromState();
          showToast('Block duplicated');
        }
      }

      function deleteBlock(id, isLocked) {
        if (isLocked) {
          pendingDeleteBlockId = id;
          document.getElementById('deleteConfirmModal').style.display = 'flex';
        } else {
          const idx = pageBlocks.findIndex(b => b.id === id);
          if (idx !== -1) {
            pageBlocks.splice(idx, 1);
            recordHistory('Deleted block');
            renderCanvasFromState();
            showToast('Block deleted (Ctrl+Z to undo)');
          }
        }
      }

      function confirmDeleteBlock() {
        if (pendingDeleteBlockId) {
          const idx = pageBlocks.findIndex(b => b.id === pendingDeleteBlockId);
          if (idx !== -1) {
            pageBlocks.splice(idx, 1);
            recordHistory('Deleted smart component');
            renderCanvasFromState();
            showToast('Smart component removed');
          }
        }
        closeDeleteConfirm();
      }

      function closeDeleteConfirm() {
        pendingDeleteBlockId = null;
        document.getElementById('deleteConfirmModal').style.display = 'none';
      }

      // Inserter Logic
      function openBlockPicker(anchorId) {
        if (anchorId === 'TOP') {
          targetInsertIndex = 0;
        } else {
          const idx = pageBlocks.findIndex(b => b.id === anchorId);
          targetInsertIndex = idx !== -1 ? idx + 1 : pageBlocks.length;
        }
        document.getElementById('blockInserterModal').style.display = 'flex';
      }

      function closeBlockPicker() {
        document.getElementById('blockInserterModal').style.display = 'none';
      }

      function switchInserterTab(tab) {
        const tabFree = document.getElementById('tabFreeBlocks');
        const tabSmart = document.getElementById('tabSmartBlocks');
        const panelFree = document.getElementById('panelFreeBlocks');
        const panelSmart = document.getElementById('panelSmartBlocks');

        if (tab === 'free') {
          tabFree.className = 'inserter-tab is-active';
          tabSmart.className = 'inserter-tab';
          panelFree.style.display = 'grid';
          panelSmart.style.display = 'none';
        } else {
          tabFree.className = 'inserter-tab';
          tabSmart.className = 'inserter-tab is-active';
          panelFree.style.display = 'none';
          panelSmart.style.display = 'grid';
        }
      }

      function insertNewBlock(type) {
        const id = 'b_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36).substring(4);
        let newBlock = { id, type };

        switch (type) {
          case 'heading': newBlock.level = 2; newBlock.content = 'New Section Heading'; break;
          case 'paragraph': newBlock.content = 'New paragraph content. Click to format or add links.'; break;
          case 'image': newBlock.url = '/public/images/hero-wok.jpg'; newBlock.alt = 'Panda Express dish'; newBlock.caption = ''; break;
          case 'button': newBlock.text = '🎟️ View Deals'; newBlock.url = '#coupon-section'; newBlock.target = '_self'; newBlock.style = 'primary'; break;
          case 'quote': newBlock.content = 'Honest savings and clear meal nutrition.'; newBlock.author = 'Editor'; newBlock.role = 'Specialist'; break;
          case 'callout': newBlock.title = 'Key Note'; newBlock.content = 'Details regarding this special deal.'; newBlock.icon = '🎯'; break;
          case 'faq-item': newBlock.question = 'Common question?'; newBlock.answer = 'Helpful explanation.'; break;
          case 'divider': break;
          case 'spacer': newBlock.height = '2rem'; break;
          case 'coupon-grid':
            newBlock.locked = true;
            newBlock.heading = 'Working Panda Express Coupon Codes';
            newBlock.subtext = 'Alphanumeric promo codes for checkout discounts.';
            newBlock.deliveryNotice = 'Promo codes function only on official apps & website.';
            break;
          case 'rewards-calculator':
            newBlock.locked = true;
            newBlock.heading = 'Panda Rewards Points Ladder';
            newBlock.subtext = 'Earn 10 points per $1 spent.';
            break;
          case 'family-meal-stepper':
            newBlock.locked = true;
            newBlock.heading = 'Family Meal Deals: $35 vs $48';
            newBlock.subtext = 'Feeds 4 to 5 diners with 2 large sides and 3 large entrees.';
            break;
          case 'faq-accordion':
            newBlock.locked = true;
            newBlock.heading = 'Frequently Asked Questions';
            newBlock.subtext = 'Everything you need to know about redemption.';
            break;
          case 'nutrition-calculator':
            newBlock.locked = true;
            newBlock.badgeText = 'NUTRITION ENGINE';
            newBlock.heading = 'Panda Express Nutrition Calculator';
            newBlock.subtext = 'Interactive Combo Meal Builder.';
            break;
          case 'menu-grid':
            newBlock.locked = true;
            newBlock.badgeText = '2026 MENU';
            newBlock.heading = 'Panda Express Menu with Prices';
            newBlock.subtext = 'Complete dishes and prices.';
            break;
          case 'dish-guide':
            newBlock.locked = true;
            newBlock.slug = activePageSlug === 'beijing-beef' ? 'beijing-beef' : 'orange-chicken';
            newBlock.title = activePageSlug === 'beijing-beef' ? 'Beijing Beef' : 'The Original Orange Chicken';
            newBlock.subtitle = 'Complete facts and hacks.';
            newBlock.intro = 'Prepared fresh in authentic woks.';
            break;
          case 'contact-form':
            newBlock.locked = true;
            newBlock.title = 'Contact Our Editorial Team';
            newBlock.subtitle = 'Have feedback or new codes?';
            newBlock.supportEmail = 'helppandacoupons@gmail.com';
            break;
        }

        const insertAt = targetInsertIndex >= 0 ? targetInsertIndex : pageBlocks.length;
        pageBlocks.splice(insertAt, 0, newBlock);
        recordHistory('Inserted ' + type);
        closeBlockPicker();
        renderCanvasFromState();
        showToast('Block inserted');
      }

      // Block Copy & Paste
      function copyBlock(id) {
        const block = pageBlocks.find(b => b.id === id);
        if (block) {
          copiedBlockData = JSON.parse(JSON.stringify(block));
          localStorage.setItem('panda_copied_block', JSON.stringify(copiedBlockData));
          showToast('Block copied to clipboard');
        }
      }

      function pasteCopiedBlock() {
        let blockToPaste = copiedBlockData;
        if (!blockToPaste) {
          const stored = localStorage.getItem('panda_copied_block');
          if (stored) {
            try { blockToPaste = JSON.parse(stored); } catch (e) {}
          }
        }
        if (!blockToPaste) {
          alert('No block copied yet! Select a block to copy first.');
          return;
        }
        const clone = JSON.parse(JSON.stringify(blockToPaste));
        clone.id = 'b_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36).substring(4);
        pageBlocks.push(clone);
        recordHistory('Pasted block');
        renderCanvasFromState();
        showToast('Block pasted');
      }

      // Floating Selection Toolbar Logic
      document.addEventListener('selectionchange', () => {
        const sel = window.getSelection();
        const toolbar = document.getElementById('floatingTextToolbar');
        if (!sel || sel.isCollapsed || !sel.rangeCount) {
          if (toolbar && !toolbar.contains(document.activeElement)) {
            toolbar.style.display = 'none';
          }
          return;
        }

        const range = sel.getRangeAt(0);
        const container = range.commonAncestorContainer;
        const editableEl = container.nodeType === 1 ? container.closest('.block-editable') : container.parentElement?.closest('.block-editable');

        if (editableEl) {
          const rect = range.getBoundingClientRect();
          toolbar.style.display = 'flex';
          toolbar.style.top = Math.max(10, rect.top - 45 + window.scrollY) + 'px';
          toolbar.style.left = Math.max(10, rect.left + (rect.width / 2) - 80 + window.scrollX) + 'px';
        } else {
          toolbar.style.display = 'none';
        }
      });

      function execFormat(cmd, value = null) {
        document.execCommand(cmd, false, value);
        markUnsaved();
      }

      function openLinkDialog() {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
          activeSelectionRange = sel.getRangeAt(0).cloneRange();
        }
        document.getElementById('editorLinkModal').style.display = 'flex';
      }

      function closeLinkDialog() {
        document.getElementById('editorLinkModal').style.display = 'none';
      }

      function setLinkDialogMode(mode) {
        linkDialogMode = mode;
        const btnInt = document.getElementById('tabLinkInternal');
        const btnExt = document.getElementById('tabLinkExternal');
        const secInt = document.getElementById('dialogSecInternal');
        const secExt = document.getElementById('dialogSecExternal');
        const chkNew = document.getElementById('dialogChkNewTab');

        if (mode === 'internal') {
          btnInt.className = 'btn-admin-primary';
          btnExt.className = 'btn-admin-secondary';
          secInt.style.display = 'block';
          secExt.style.display = 'none';
          chkNew.checked = false;
        } else {
          btnInt.className = 'btn-admin-secondary';
          btnExt.className = 'btn-admin-primary';
          secInt.style.display = 'none';
          secExt.style.display = 'block';
          chkNew.checked = true;
        }
      }

      function applyLinkDialog() {
        const selectInt = document.getElementById('dialogSelectInternal');
        const inputExt = document.getElementById('dialogInputExternal');
        const chkNew = document.getElementById('dialogChkNewTab');
        const chkSpon = document.getElementById('dialogChkSponsored');

        let url = linkDialogMode === 'internal' ? selectInt.value : inputExt.value.trim();
        if (!url) {
          alert('Please specify a destination URL');
          return;
        }
        if (linkDialogMode === 'external' && !url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
          url = 'https://' + url;
        }

        if (activeSelectionRange) {
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(activeSelectionRange);
        }

        document.execCommand('createLink', false, url);

        const sel = window.getSelection();
        if (sel && sel.anchorNode) {
          const anchor = sel.anchorNode.nodeType === 1 ? sel.anchorNode.closest('a') : sel.anchorNode.parentElement?.closest('a');
          if (anchor) {
            anchor.setAttribute('href', url);
            if (chkNew.checked) {
              anchor.setAttribute('target', '_blank');
              let rels = ['noopener', 'noreferrer'];
              if (chkSpon.checked) rels.push('nofollow', 'sponsored');
              anchor.setAttribute('rel', rels.join(' '));
            } else {
              anchor.removeAttribute('target');
              if (chkSpon.checked) anchor.setAttribute('rel', 'nofollow sponsored');
              else anchor.removeAttribute('rel');
            }
          }
        }

        closeLinkDialog();
        markUnsaved();
      }

      // Multi-paragraph and formatting paste filter
      document.addEventListener('paste', (e) => {
        const editable = e.target.closest('.block-editable');
        if (editable) {
          e.preventDefault();
          const text = (e.clipboardData || window.clipboardData).getData('text/plain');
          const paragraphs = text.split(/\\r?\\n\\r?\\n+/).filter(p => p.trim().length > 0);
          
          if (paragraphs.length > 1 && editable.dataset.field === 'content') {
            const blockId = editable.dataset.blockId;
            const currentIdx = pageBlocks.findIndex(b => b.id === blockId);
            if (currentIdx !== -1) {
              editable.innerHTML = escapeHtml(paragraphs[0]);
              syncBlockField(blockId, 'content', paragraphs[0]);
              
              const newBlocks = paragraphs.slice(1).map(p => ({
                id: 'b_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now().toString(36).substring(4),
                type: 'paragraph',
                content: escapeHtml(p)
              }));
              pageBlocks.splice(currentIdx + 1, 0, ...newBlocks);
              recordHistory('Pasted multiple paragraphs');
              renderCanvasFromState();
              return;
            }
          }

          document.execCommand('insertText', false, text);
          syncBlockField(editable.dataset.blockId, editable.dataset.field, editable.innerHTML);
        }
      });

      // Keyboard Shortcuts (Ctrl+Z, Ctrl+Y, Ctrl+S)
      window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
          e.preventDefault();
          if (e.shiftKey) editorRedo();
          else editorUndo();
        } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
          e.preventDefault();
          editorRedo();
        } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
          e.preventDefault();
          triggerSave(true);
        }
      });

      // Save & Publish API calls
      async function triggerSave(isManual = false) {
        if (!hasUnsavedChanges && !isManual) return;
        markSaving();

        // Read all active contenteditable fields into state
        document.querySelectorAll('.block-editable').forEach(el => {
          const id = el.dataset.blockId;
          const field = el.dataset.field;
          if (id && field) syncBlockField(id, field, el.innerHTML);
        });

        try {
          const res = await adminFetch('/admin/api/blocks', {
            method: 'POST',
            body: JSON.stringify({
              page: activePageSlug,
              blocks: pageBlocks
            })
          });

          if (res.success) {
            markSaved();
            if (isManual) showToast('Draft saved successfully! (Atomic backup created)');
          } else {
            throw new Error(res.error || 'Failed to save');
          }
        } catch (err) {
          const ind = document.getElementById('saveStatusIndicator');
          if (ind) ind.innerHTML = '<span class="status-dot dot-red"></span><span class="status-text">Save failed!</span>';
          if (isManual) alert('Failed to save draft: ' + err.message);
        }
      }

      async function triggerPublish() {
        const btn = document.getElementById('btnPublishLive');
        btn.disabled = true;
        btn.innerHTML = '⏳ Saving &amp; Publishing...';

        try {
          // 1. Force flush and await full disk save of all in-place edits
          await triggerSave(true);

          // 2. Trigger static build and live publishing
          const res = await adminFetch('/admin/api/publish', {
            method: 'POST',
            body: JSON.stringify({ reason: 'Published ' + activePageSlug + ' block changes' })
          });

          if (res.success) {
            showToast('🎉 Page published successfully to live site!');
            alert('Live build finished successfully! Your changes are now live on the site.');
          } else {
            throw new Error(res.error || res.message || 'Build failed');
          }
        } catch (err) {
          showToast('Publish failed: ' + err.message, 'error');
          alert('Publish Error: ' + err.message);
        } finally {
          btn.disabled = false;
          btn.innerHTML = '🚀 Publish Page';
        }
      }

      // Re-render canvas HTML from current in-memory pageBlocks state
      async function renderCanvasFromState() {
        try {
          const res = await adminFetch('/admin/api/blocks/render-canvas', {
            method: 'POST',
            body: JSON.stringify({
              page: activePageSlug,
              blocks: pageBlocks
            })
          });
          if (res.success && res.html) {
            const container = document.getElementById('editorCanvas');
            if (container) {
              container.outerHTML = res.html;
              bindEditableEvents();
            }
          }
        } catch (e) {
          console.error('Failed to re-render canvas in real-time:', e);
        }
      }

      function bindEditableEvents() {
        document.querySelectorAll('.block-editable').forEach(el => {
          el.addEventListener('input', () => {
            syncBlockField(el.dataset.blockId, el.dataset.field, el.innerHTML);
          });
          el.addEventListener('blur', () => {
            syncBlockField(el.dataset.blockId, el.dataset.field, el.innerHTML);
            triggerSave(false);
          });
        });
      }

      // Prevent canvas link navigation while editing so users can click & type anywhere
      document.addEventListener('click', (e) => {
        const canvas = document.getElementById('editorCanvas');
        if (canvas && canvas.contains(e.target)) {
          const link = e.target.closest('a');
          if (link && !link.classList.contains('btn-smart-edit')) {
            e.preventDefault();
          }

          // If clicking on any text element inside a block that isn't yet focused
          const blockWrapper = e.target.closest('.admin-block-wrapper');
          if (blockWrapper && !e.target.closest('.block-action-toolbar') && !e.target.closest('.block-inserter-hotspot') && !e.target.closest('.smart-block-header-indicator')) {
            if (!e.target.isContentEditable) {
              const textEl = e.target.closest('h1, h2, h3, h4, h5, h6, p, span, li, summary, blockquote, figcaption, div, small, strong, em, b, i, td, th');
              if (textEl && !textEl.closest('.block-action-toolbar') && !textEl.closest('.smart-block-header-indicator')) {
                textEl.setAttribute('contenteditable', 'true');
                textEl.classList.add('block-editable');
                if (!textEl.dataset.blockId) textEl.dataset.blockId = blockWrapper.dataset.blockId;
                if (!textEl.dataset.field) textEl.dataset.field = 'content';
                textEl.focus();
                
                textEl.addEventListener('input', () => {
                  syncBlockField(textEl.dataset.blockId, textEl.dataset.field, textEl.innerHTML);
                });
                textEl.addEventListener('blur', () => {
                  syncBlockField(textEl.dataset.blockId, textEl.dataset.field, textEl.innerHTML);
                  triggerSave(false);
                });
              }
            }
          }
        }
      });

      // Initial binding
      bindEditableEvents();
      recordHistory('Initial load');
    </script>

    <style>
      .visual-editor-root {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      .editor-header-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #16161D;
        border: 1px solid var(--admin-border);
        border-radius: 12px;
        padding: 0.75rem 1.25rem;
        flex-wrap: wrap;
        gap: 1rem;
        position: sticky;
        top: 1rem;
        z-index: 1000;
        box-shadow: 0 10px 25px rgba(0,0,0,0.5);
      }
      .editor-header-left, .editor-header-right {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex-wrap: wrap;
      }
      .admin-select-page {
        background: #09090D;
        border: 1px solid rgba(255,255,255,0.2);
        color: #FFF;
        font-weight: 700;
        padding: 0.45rem 0.75rem;
        border-radius: 6px;
        font-size: 0.9rem;
        outline: none;
      }
      .btn-editor-tool {
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.12);
        color: #E2E8F0;
        border-radius: 6px;
        padding: 0.4rem 0.65rem;
        font-size: 0.85rem;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.15s;
      }
      .btn-editor-tool:hover:not(:disabled) {
        background: rgba(255,255,255,0.15);
        color: #FFF;
      }
      .btn-editor-tool:disabled {
        opacity: 0.35;
        cursor: not-allowed;
      }
      .editor-save-status {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        font-size: 0.8rem;
        color: var(--admin-muted);
        background: rgba(0,0,0,0.3);
        padding: 0.3rem 0.6rem;
        border-radius: 20px;
        border: 1px solid rgba(255,255,255,0.08);
      }
      .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        display: inline-block;
      }
      .dot-green { background: #10B981; box-shadow: 0 0 8px #10B981; }
      .dot-yellow { background: #F59E0B; box-shadow: 0 0 8px #F59E0B; }
      .dot-blue { background: #3B82F6; box-shadow: 0 0 8px #3B82F6; }
      .dot-red { background: #EF4444; box-shadow: 0 0 8px #EF4444; }

      .editor-canvas-stage {
        background: #09090D;
        border: 1px solid var(--admin-border);
        border-radius: 12px;
        padding: 1.5rem;
        min-height: 80vh;
      }
      .editor-canvas-viewport {
        background: #FFFFFF;
        color: #0F172A;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 20px 40px rgba(0,0,0,0.6);
      }
      .editor-page-badge {
        background: #1E293B;
        color: #F8FAFC;
        padding: 0.6rem 1.25rem;
        font-size: 0.85rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(255,255,255,0.1);
      }

      /* Blocks & Action Toolbars */
      .admin-block-wrapper {
        position: relative;
        transition: outline 0.15s ease;
      }
      .admin-block-wrapper:hover {
        outline: 2px solid rgba(200, 16, 46, 0.4);
      }
      .admin-block-wrapper.drag-over-active {
        outline: 3px dashed #C8102E !important;
        background: rgba(200, 16, 46, 0.05);
      }
      .block-action-toolbar {
        position: absolute;
        top: -14px;
        right: 14px;
        background: #1E293B;
        border: 1px solid rgba(255,255,255,0.2);
        border-radius: 6px;
        padding: 0.2rem 0.4rem;
        display: none;
        align-items: center;
        gap: 0.35rem;
        z-index: 50;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      }
      .admin-block-wrapper:hover > .block-action-toolbar {
        display: flex;
      }
      .block-drag-handle {
        cursor: grab;
        color: #94A3B8;
        font-weight: 800;
        font-size: 0.9rem;
        padding: 0 0.2rem;
      }
      .block-type-badge {
        font-size: 0.7rem;
        font-weight: 700;
        text-transform: uppercase;
        color: #F8FAFC;
        background: rgba(255,255,255,0.1);
        padding: 0.15rem 0.4rem;
        border-radius: 4px;
      }
      .btn-block-action {
        background: transparent;
        border: none;
        color: #94A3B8;
        cursor: pointer;
        padding: 0.15rem 0.3rem;
        border-radius: 3px;
        font-size: 0.8rem;
      }
      .btn-block-action:hover {
        background: rgba(255,255,255,0.15);
        color: #FFF;
      }
      .btn-block-delete:hover {
        background: #DC2626 !important;
        color: #FFF !important;
      }

      .smart-block-header-indicator {
        background: #0B0B0E;
        color: #F5B301;
        font-size: 0.78rem;
        font-weight: 700;
        padding: 0.4rem 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(255,255,255,0.1);
      }
      .btn-smart-edit {
        color: #FFF;
        text-decoration: underline;
        font-size: 0.75rem;
      }

      /* Inserter Hotspot */
      .block-inserter-hotspot {
        position: relative;
        height: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.15s ease;
        margin: -10px 0;
        z-index: 40;
      }
      .block-inserter-hotspot:hover, .block-inserter-hotspot.hotspot-top {
        opacity: 1;
      }
      .btn-hotspot-insert {
        background: #C8102E;
        color: #FFF;
        border: none;
        border-radius: 20px;
        padding: 0.2rem 0.75rem;
        font-size: 0.75rem;
        font-weight: 800;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      }
      .btn-hotspot-insert:hover {
        background: #E01335;
        transform: scale(1.05);
      }

      /* Floating Selection Toolbar */
      .floating-selection-toolbar {
        position: absolute;
        background: #111116;
        border: 1px solid rgba(255,255,255,0.25);
        border-radius: 8px;
        padding: 0.3rem 0.5rem;
        display: flex;
        align-items: center;
        gap: 0.35rem;
        z-index: 99999;
        box-shadow: 0 10px 25px rgba(0,0,0,0.6);
      }
      .btn-toolbar-mark {
        background: transparent;
        border: none;
        color: #E2E8F0;
        font-weight: 700;
        font-size: 0.85rem;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        cursor: pointer;
      }
      .btn-toolbar-mark:hover {
        background: rgba(255,255,255,0.15);
        color: #FFF;
      }
      .toolbar-divider {
        width: 1px;
        height: 16px;
        background: rgba(255,255,255,0.2);
        margin: 0 0.2rem;
      }

      /* Modals */
      .admin-modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.8);
        backdrop-filter: blur(4px);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 999999;
        padding: 1rem;
      }
      .admin-modal-card {
        background: #16161D;
        border: 1px solid rgba(255,255,255,0.2);
        border-radius: 12px;
        width: 100%;
        max-width: 520px;
        padding: 1.75rem;
        box-shadow: 0 25px 50px -12px rgba(0,0,0,0.8);
        color: #FFF;
      }
      .inserter-modal-card {
        max-width: 620px;
      }
      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.25rem;
      }
      .modal-header h3 {
        margin: 0;
        font-size: 1.2rem;
        font-weight: 800;
      }
      .modal-close-btn {
        background: none;
        border: none;
        color: var(--admin-muted);
        font-size: 1.5rem;
        cursor: pointer;
      }
      .inserter-tabs {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1.25rem;
        border-bottom: 1px solid rgba(255,255,255,0.1);
        padding-bottom: 0.5rem;
      }
      .inserter-tab {
        background: transparent;
        border: none;
        color: var(--admin-muted);
        font-weight: 700;
        font-size: 0.9rem;
        padding: 0.4rem 0.75rem;
        cursor: pointer;
        border-radius: 6px;
      }
      .inserter-tab.is-active {
        background: #C8102E;
        color: #FFF;
      }
      .inserter-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
        gap: 0.75rem;
        max-height: 380px;
        overflow-y: auto;
        padding: 0.25rem;
      }
      .inserter-item-btn {
        background: #0B0B0E;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 8px;
        padding: 1rem 0.75rem;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        cursor: pointer;
        transition: all 0.15s ease;
        text-align: left;
      }
      .inserter-item-btn:hover {
        border-color: #C8102E;
        background: rgba(200, 16, 46, 0.1);
        transform: translateY(-2px);
      }
      .item-icon {
        font-size: 1.4rem;
        margin-bottom: 0.35rem;
      }
      .item-label {
        font-weight: 700;
        font-size: 0.9rem;
        color: #FFF;
      }
      .item-desc {
        font-size: 0.75rem;
        color: var(--admin-muted);
        margin-top: 0.2rem;
      }
      .block-editable:focus {
        outline: 2px dashed #C8102E;
        background: rgba(200, 16, 46, 0.03);
        border-radius: 4px;
      }
    </style>
  `;
}

module.exports = renderVisualEditor;
