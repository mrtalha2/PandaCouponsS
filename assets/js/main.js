/**
 * Panda Express Coupons & Nutrition Calculator Engine
 * High-performance, accessible, interactive vanilla JS (zero dependencies)
 */

function debounce(fn, delay = 180) {
  let timer = null;
  return function(...args) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

document.addEventListener('DOMContentLoaded', () => {
  // Critical interactive systems
  initEmailDecoders();
  initCopyButtons();
  initMobileNav();
  initFaqAccordion();
  initCouponFilterAndToggle();

  // Defer non-critical initializations to avoid blocking main thread (INP / TBT optimization)
  const deferInit = window.requestIdleCallback || ((fn) => setTimeout(fn, 1));
  deferInit(() => {
    initDynamicDates();
    initNutritionSystem();
    initHeaderScroll();
    initMobileStickyBar();
    initMenuSearchAndFilter();
    initTableOfContents();
    initSavingsCalculator();
  });
});

/**
 * 1. Email Scraper Protection
 */
function initEmailDecoders() {
  const emailElements = document.querySelectorAll('.protected-email');
  const user = 'help';
  const domain = 'pandacoupons.org';
  const fullEmail = `${user}@${domain}`;

  emailElements.forEach((el) => {
    el.setAttribute('href', `mailto:${fullEmail}`);
    if (el.dataset.showText === 'true' || !el.textContent.trim()) {
      el.textContent = fullEmail;
    }
  });
}

/**
 * 2. Coupon Code Clipboard Copying (Event Delegation)
 */
function initCopyButtons() {
  document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.btn-copy');
    if (!btn) return;

    const code = btn.getAttribute('data-code');
    if (!code) return;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = code;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }

      const originalHtml = btn.innerHTML;
      btn.classList.add('is-copied');
      btn.innerHTML = '<span>✓ Copied!</span>';

      // Accessible screen-reader announcement
      const announcer = document.getElementById('a11yClipboardAnnouncer');
      if (announcer) {
        announcer.textContent = `Promo code ${code} copied to clipboard!`;
        setTimeout(() => { announcer.textContent = ''; }, 3000);
      }

      setTimeout(() => {
        btn.classList.remove('is-copied');
        btn.innerHTML = originalHtml;
      }, 2200);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  });
}

/**
 * 3. Mobile Navigation (Accessible Full-Height Drawer with Focus Trap)
 */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const navDrawer = document.querySelector('.mobile-nav-drawer');
  const closeBtn = document.getElementById('mobileNavCloseBtn');

  if (!toggleBtn || !navDrawer) return;

  function openDrawer() {
    navDrawer.classList.add('is-active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    const firstFocusable = navDrawer.querySelector('button, a');
    if (firstFocusable) firstFocusable.focus();
    document.addEventListener('keydown', handleDrawerKeydown);
  }

  function closeDrawer() {
    navDrawer.classList.remove('is-active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleDrawerKeydown);
    toggleBtn.focus();
  }

  function handleDrawerKeydown(e) {
    if (e.key === 'Escape') {
      closeDrawer();
      return;
    }
    if (e.key === 'Tab') {
      const focusables = navDrawer.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  toggleBtn.addEventListener('click', () => {
    if (navDrawer.classList.contains('is-active')) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  // Close when clicking any nav link
  navDrawer.querySelectorAll('.mobile-nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });

  // Close when clicking drawer backdrop outside the menu list/header
  navDrawer.addEventListener('click', (e) => {
    if (e.target === navDrawer) {
      closeDrawer();
    }
  });
}

/**
 * 4. FAQ Accordion
 */
function initFaqAccordion() {
  const triggers = document.querySelectorAll('.faq-trigger');

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.faq-item');
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      trigger.setAttribute('aria-expanded', !isExpanded);
      item.classList.toggle('is-open');
    });
  });
}

/**
 * 5. Dynamic Month & Year
 */
function initDynamicDates() {
  const now = new Date();
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const currentMonthYear = `${months[now.getMonth()]} ${now.getFullYear()}`;
  const currentYear = `${now.getFullYear()}`;

  document.querySelectorAll('.js-current-month-year').forEach((el) => {
    el.textContent = currentMonthYear;
  });

  document.querySelectorAll('.js-current-year').forEach((el) => {
    el.textContent = currentYear;
  });
}

/**
 * 6. High-Performance Nutrition Calculator System
 * Supports both Combo Meal Builder and Full Explorer with Allergen Filters & Search
 */
function initNutritionSystem() {
  const calcContainer = document.getElementById('nutrition-app');
  if (!calcContainer) return;

  // Load menu dataset
  const menuData = window.PANDA_MENU_ITEMS || [];

  // State
  let currentMode = 'combo'; // 'combo' | 'explorer'
  let activeComboMeal = 'plate'; // 'bowl' | 'plate' | 'bigger_plate'
  let selectedSide = 'chow-mein';
  let selectedEntrees = ['orange-chicken', 'beijing-beef'];

  // Explorer State
  let searchQuery = '';
  let activeCategory = 'All Items';
  let allergensToAvoid = [];
  let sortField = 'calories';
  let cartItems = JSON.parse(localStorage.getItem('panda-meal-cart') || '[]');

  // Hydrate cart from share link (?meal=orange-chicken:1,chow-mein:1)
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedMeal = urlParams.get('meal');
    if (sharedMeal) {
      const parsedItems = [];
      const parts = sharedMeal.split(',');
      parts.forEach((p) => {
        const [id, qtyStr] = p.split(':');
        const found = menuData.find((m) => m.id === id);
        if (found) {
          const qty = parseInt(qtyStr, 10) || 1;
          parsedItems.push({ ...found, quantity: qty });
        }
      });
      if (parsedItems.length > 0) {
        cartItems = parsedItems;
        localStorage.setItem('panda-meal-cart', JSON.stringify(cartItems));
      }
    }
  } catch (err) {
    console.warn('Could not parse shared meal URL param:', err);
  }
  const modeBtns = calcContainer.querySelectorAll('.calc-mode-btn');
  const comboView = document.getElementById('view-combo-builder');
  const explorerView = document.getElementById('view-explorer');

  modeBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      modeBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      currentMode = btn.dataset.mode;

      if (currentMode === 'combo') {
        if (comboView) comboView.style.display = 'block';
        if (explorerView) explorerView.style.display = 'none';
      } else {
        if (comboView) comboView.style.display = 'none';
        if (explorerView) explorerView.style.display = 'block';
        renderExplorerTable();
      }
    });
  });

  /* -------------------------------------------------------------
     MODE 1: COMBO BUILDER LOGIC
     ------------------------------------------------------------- */
  const comboLimits = {
    bowl: { sides: 1, entrees: 1, name: 'Bowl' },
    plate: { sides: 1, entrees: 2, name: 'Plate' },
    bigger_plate: { sides: 1, entrees: 3, name: 'Bigger Plate' }
  };

  const comboPills = calcContainer.querySelectorAll('.combo-meal-pill');
  const comboSidesGrid = document.getElementById('combo-sides-grid');
  const comboEntreesGrid = document.getElementById('combo-entrees-grid');
  const comboEntreeNotice = document.getElementById('combo-entree-notice');

  function updateComboTotals() {
    let cals = 0, fat = 0, carbs = 0, protein = 0;

    // Side
    const sideObj = menuData.find((m) => m.id === selectedSide);
    if (sideObj) {
      cals += sideObj.calories || 0;
      fat += sideObj.totalFat || 0;
      carbs += sideObj.totalCarbs || 0;
      protein += sideObj.protein || 0;
    }

    // Entrees
    selectedEntrees.forEach((eid) => {
      const eObj = menuData.find((m) => m.id === eid);
      if (eObj) {
        cals += eObj.calories || 0;
        fat += eObj.totalFat || 0;
        carbs += eObj.totalCarbs || 0;
        protein += eObj.protein || 0;
      }
    });

    const cVal = document.getElementById('combo-total-cals');
    const pVal = document.getElementById('combo-total-protein');
    const cbVal = document.getElementById('combo-total-carbs');
    const fVal = document.getElementById('combo-total-fat');

    if (cVal) cVal.textContent = Math.round(cals).toLocaleString();
    if (pVal) pVal.textContent = `${Math.round(protein)}g`;
    if (cbVal) cbVal.textContent = `${Math.round(carbs)}g`;
    if (fVal) fVal.textContent = `${Math.round(fat)}g`;

    // Progress bar towards 2000 cal
    const progressEl = document.getElementById('combo-cal-bar');
    if (progressEl) {
      const pct = Math.min((cals / 2000) * 100, 100);
      progressEl.style.width = `${pct}%`;
    }

    if (comboEntreeNotice) {
      const allowed = comboLimits[activeComboMeal].entrees;
      comboEntreeNotice.textContent = `Selected: ${selectedEntrees.length}/${allowed} Entrees`;
    }
  }

  // Handle combo meal pills (Bowl, Plate, Bigger Plate)
  comboPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      comboPills.forEach((p) => p.classList.remove('is-selected'));
      pill.classList.add('is-selected');
      activeComboMeal = pill.dataset.meal;

      const allowed = comboLimits[activeComboMeal].entrees;
      if (selectedEntrees.length > allowed) {
        selectedEntrees = selectedEntrees.slice(0, allowed);
      }
      renderComboGrids();
      updateComboTotals();
    });
  });

  // Event delegation on combo selection containers (Phase 5 INP optimization)
  if (comboSidesGrid) {
    comboSidesGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.item-choice-card');
      if (!card) return;
      selectedSide = card.dataset.side;
      comboSidesGrid.querySelectorAll('.item-choice-card').forEach((c) => c.classList.remove('is-checked'));
      card.classList.add('is-checked');
      updateComboTotals();
    });
  }

  if (comboEntreesGrid) {
    comboEntreesGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.item-choice-card');
      if (!card) return;
      e.preventDefault();
      const eid = card.dataset.entree;
      const allowedCount = comboLimits[activeComboMeal].entrees;

      if (selectedEntrees.includes(eid)) {
        selectedEntrees = selectedEntrees.filter((id) => id !== eid);
        card.classList.remove('is-checked');
      } else {
        if (selectedEntrees.length >= allowedCount) {
          selectedEntrees.shift();
        }
        selectedEntrees.push(eid);
      }

      // Re-highlight checked cards
      comboEntreesGrid.querySelectorAll('.item-choice-card').forEach((c) => {
        c.classList.toggle('is-checked', selectedEntrees.includes(c.dataset.entree));
      });

      updateComboTotals();
    });
  }

  function renderComboGrids() {
    // Render Sides
    if (comboSidesGrid) {
      const sides = menuData.filter((i) => i.category === 'Sides');
      comboSidesGrid.innerHTML = sides.map((item) => `
        <label class="item-choice-card ${selectedSide === item.id ? 'is-checked' : ''}" data-side="${item.id}">
          <input type="radio" name="combo-side-radio" value="${item.id}" ${selectedSide === item.id ? 'checked' : ''}>
          <span class="item-choice-name">${item.name}</span>
          <span class="item-choice-macros">${item.calories} cal | ${item.protein}g protein | ${item.totalCarbs}g carbs</span>
        </label>
      `).join('');
    }

    // Render Entrees
    if (comboEntreesGrid) {
      const entrees = menuData.filter((i) => ['Chicken', 'Chicken Breast', 'Beef', 'Seafood', 'Vegetables'].includes(i.category));
      comboEntreesGrid.innerHTML = entrees.map((item) => {
        const isSelected = selectedEntrees.includes(item.id);
        return `
          <label class="item-choice-card ${isSelected ? 'is-checked' : ''}" data-entree="${item.id}">
            <input type="checkbox" name="combo-entree-check" value="${item.id}" ${isSelected ? 'checked' : ''}>
            <span class="item-choice-name">${item.name}</span>
            <span class="item-choice-macros">${item.calories} cal | ${item.protein}g protein | ${item.totalFat}g fat</span>
          </label>
        `;
      }).join('');
    }
  }

  // Initial combo render
  renderComboGrids();
  updateComboTotals();

  /* -------------------------------------------------------------
     MODE 2: EXPLORER & FULL MEAL CALCULATOR LOGIC
     ------------------------------------------------------------- */
  const searchInput = document.getElementById('calcSearchInput');
  const clearSearchBtn = document.getElementById('calcClearSearch');
  const catFilterBar = document.getElementById('calcCategoryBar');
  const allergenBtn = document.getElementById('calcAllergenBtn');
  const allergenDropdown = document.getElementById('calcAllergenDropdown');
  const allergenCountBadge = document.getElementById('calcAllergenCount');
  const explorerTableBody = document.getElementById('calcTableBody');
  const stickyDock = document.getElementById('stickyCalorieDock');
  const dockCount = document.getElementById('dockItemCount');
  const dockValue = document.getElementById('dockCalorieValue');
  const viewMealBtn = document.getElementById('dockViewMealBtn');

  // Modal elements
  const modalBackdrop = document.getElementById('nutritionModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalContent = document.getElementById('modalDetailsBody');

  // Search input handler with debouncing (INP optimization)
  if (searchInput) {
    searchInput.addEventListener('input', debounce((e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      if (clearSearchBtn) clearSearchBtn.style.display = searchQuery ? 'flex' : 'none';
      renderExplorerTable();
    }, 180));
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      searchQuery = '';
      if (searchInput) searchInput.value = '';
      clearSearchBtn.style.display = 'none';
      renderExplorerTable();
    });
  }

  // Allergen Dropdown toggle
  if (allergenBtn && allergenDropdown) {
    allergenBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      allergenDropdown.classList.toggle('is-active');
    });

    document.addEventListener('click', () => allergenDropdown.classList.remove('is-active'));
    allergenDropdown.addEventListener('click', (e) => e.stopPropagation());

    allergenDropdown.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
      cb.addEventListener('change', () => {
        const val = cb.value;
        if (cb.checked) {
          if (!allergensToAvoid.includes(val)) allergensToAvoid.push(val);
        } else {
          allergensToAvoid = allergensToAvoid.filter((a) => a !== val);
        }

        if (allergenCountBadge) {
          allergenCountBadge.textContent = allergensToAvoid.length;
          allergenCountBadge.style.display = allergensToAvoid.length > 0 ? 'inline-flex' : 'none';
        }
        renderExplorerTable();
      });
    });

    const clearAllergensBtn = document.getElementById('calcClearAllergens');
    if (clearAllergensBtn) {
      clearAllergensBtn.addEventListener('click', () => {
        allergensToAvoid = [];
        allergenDropdown.querySelectorAll('input[type="checkbox"]').forEach((cb) => { cb.checked = false; });
        if (allergenCountBadge) {
          allergenCountBadge.textContent = '0';
          allergenCountBadge.style.display = 'none';
        }
        renderExplorerTable();
      });
    }
  }

  // Category filter pills
  if (catFilterBar) {
    catFilterBar.querySelectorAll('.cat-pill').forEach((pill) => {
      pill.addEventListener('click', () => {
        catFilterBar.querySelectorAll('.cat-pill').forEach((p) => p.classList.remove('is-active'));
        pill.classList.add('is-active');
        activeCategory = pill.dataset.category;
        renderExplorerTable();
      });
    });
  }

  // Sortable table headers
  const sortHeaders = calcContainer.querySelectorAll('th.sortable');
  sortHeaders.forEach((th) => {
    th.addEventListener('click', () => {
      const field = th.dataset.field;
      if (sortField === field) {
        sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        sortField = field;
        sortOrder = 'desc';
      }
      renderExplorerTable();
    });
  });

  function getFilteredItems() {
    return menuData.filter((item) => {
      if (searchQuery && !item.name.toLowerCase().includes(searchQuery)) return false;
      if (activeCategory !== 'All Items' && item.category !== activeCategory) return false;
      if (allergensToAvoid.length > 0 && item.allergens && item.allergens.some((a) => allergensToAvoid.includes(a))) {
        return false;
      }
      return true;
    });
  }

  function getSortedItems(items) {
    if (!sortField) return items;
    return [...items].sort((a, b) => {
      const aVal = a[sortField] ?? 0;
      const bVal = b[sortField] ?? 0;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      return 0;
    });
  }

  function renderExplorerTable() {
    if (!explorerTableBody) return;
    const filtered = getFilteredItems();
    const sorted = getSortedItems(filtered);

    if (sorted.length === 0) {
      explorerTableBody.innerHTML = `
        <tr>
          <td colspan="13" style="text-align: center; padding: 3rem 1rem; color: #64748B;">
            <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">🔍</div>
            <div style="font-weight: 800; font-size: 1.1rem; color: #1E293B; margin-bottom: 0.35rem;">No dishes match your search or allergen filters</div>
            <div style="font-size: 0.88rem; margin-bottom: 1.25rem; color: #64748B;">Try adjusting your keywords or clearing allergen exclusions.</div>
            <button type="button" id="btnClearNutritionFilters" class="btn btn-secondary" style="padding: 0.5rem 1.2rem; font-size: 0.85rem; border-radius: 6px; cursor: pointer;">
              Clear All Filters
            </button>
          </td>
        </tr>
      `;
      const btnClearFilters = document.getElementById('btnClearNutritionFilters');
      if (btnClearFilters) {
        btnClearFilters.addEventListener('click', () => {
          searchQuery = '';
          activeCategory = 'All Items';
          allergensToAvoid = [];
          if (searchInput) searchInput.value = '';
          if (clearSearchBtn) clearSearchBtn.style.display = 'none';
          if (catFilterBar) {
            catFilterBar.querySelectorAll('.cat-pill').forEach((p) => {
              p.classList.toggle('is-active', p.dataset.category === 'All Items');
            });
          }
          if (allergenDropdown) {
            allergenDropdown.querySelectorAll('input[type="checkbox"]').forEach((cb) => { cb.checked = false; });
          }
          if (allergenCountBadge) {
            allergenCountBadge.textContent = '0';
            allergenCountBadge.style.display = 'none';
          }
          renderExplorerTable();
        });
      }
      checkTableScrollHint();
      return;
    }

    explorerTableBody.innerHTML = sorted.map((item) => {
      const cartEntry = cartItems.find((c) => c.id === item.id);
      const qty = cartEntry ? cartEntry.quantity : 0;

      // Calorie highlight class
      let calColor = '#15803D';
      if (item.calories >= 400) calColor = '#DC2626';
      else if (item.calories >= 250) calColor = '#D97706';

      return `
        <tr>
          <td style="position: sticky; left: 0; background: #FFFFFF; font-weight: 700; z-index: 5; box-shadow: 2px 0 6px rgba(0, 0, 0, 0.08); min-width: 170px; color: #0F172A;">
            <a href="#" class="item-modal-link" data-id="${item.id}" style="color: #0F172A; display: inline-flex; align-items: center; gap: 0.35rem; font-weight: 700;">
              <span>${item.name}</span>
              ${item.isSpicy ? '<span title="Spicy">🌶️</span>' : ''}
              ${item.isVegetarian ? '<span title="Vegetarian" style="color:#16A34A;font-size:0.75rem;">🌱</span>' : ''}
              ${item.isGlutenFree ? '<span title="Gluten-Free" style="color:#2563EB;font-size:0.75rem;">GF</span>' : ''}
            </a>
            <div style="font-size: 0.78rem; color: #475569; font-weight: 600;">${item.servingSize ? item.servingSize + ' oz' : 'Standard'}</div>
          </td>
          <td style="color: ${calColor}; font-weight: 800; font-size: 0.95rem;">${item.calories}</td>
          <td style="color: #1E293B; font-weight: 600;">${item.totalFat}g</td>
          <td style="color: #1E293B; font-weight: 600;">${item.saturatedFat ?? 0}g</td>
          <td style="color: #1E293B; font-weight: 600;">${item.transFat ?? 0}g</td>
          <td style="color: #1E293B; font-weight: 600;">${item.cholesterol ?? 0}mg</td>
          <td style="color: #1E293B; font-weight: 600;">${item.sodium}mg</td>
          <td style="color: #1E293B; font-weight: 600;">${item.totalCarbs}g</td>
          <td style="color: #1E293B; font-weight: 600;">${item.dietaryFiber ?? 0}g</td>
          <td style="color: #1E293B; font-weight: 600;">${item.sugars ?? 0}g</td>
          <td style="font-weight: 800; color: #15803D; font-size: 0.95rem;">${item.protein}g</td>
          <td>
            <div style="display: flex; gap: 0.25rem; flex-wrap: wrap;">
              ${(item.allergens && item.allergens.length > 0)
                ? item.allergens.map((a) => `<span style="font-size: 0.75rem; background:#EEF2F6; color:#0F172A; font-weight: 700; border: 1px solid #CBD5E1; padding:0.15rem 0.45rem; border-radius:4px; text-transform:capitalize;">${a}</span>`).join('')
                : '<span style="font-size:0.75rem; color:#15803D; font-weight:700; background:#DCFCE7; padding:0.15rem 0.45rem; border-radius:4px;">None</span>'
              }
            </div>
          </td>
          <td style="text-align: right; white-space: nowrap;">
            ${qty > 0 ? `
              <div style="display: inline-flex; align-items: center; gap: 0.35rem; background: #F8FAFC; border: 1px solid #CBD5E1; border-radius: 6px; padding: 0.15rem;">
                <button type="button" class="btn-qty-minus" data-id="${item.id}" style="width:24px;height:24px;border:none;background:#FFFFFF;border-radius:4px;cursor:pointer;font-weight:bold;">-</button>
                <span style="font-weight: 800; font-size: 0.85rem; min-width: 18px; text-align: center; color: #0F172A;">${qty}</span>
                <button type="button" class="btn-qty-plus" data-id="${item.id}" style="width:24px;height:24px;border:none;background:#FFFFFF;border-radius:4px;cursor:pointer;font-weight:bold;">+</button>
              </div>
            ` : `
              <button type="button" class="btn btn-sm btn-add-item" data-id="${item.id}" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;">
                + Add
              </button>
            `}
          </td>
        </tr>
      `;
    }).join('');
  }

  // Delegated click handler on explorer table body (Phase 5 INP optimization)
  if (explorerTableBody) {
    explorerTableBody.addEventListener('click', (e) => {
      const addBtn = e.target.closest('.btn-add-item');
      if (addBtn && addBtn.dataset.id) {
        addItemToCart(addBtn.dataset.id);
        return;
      }
      const plusBtn = e.target.closest('.btn-qty-plus');
      if (plusBtn && plusBtn.dataset.id) {
        addItemToCart(plusBtn.dataset.id);
        return;
      }
      const minusBtn = e.target.closest('.btn-qty-minus');
      if (minusBtn && minusBtn.dataset.id) {
        decrementCartItem(minusBtn.dataset.id);
        return;
      }
      const modalLink = e.target.closest('.item-modal-link');
      if (modalLink && modalLink.dataset.id) {
        e.preventDefault();
        openItemModal(modalLink.dataset.id, modalLink);
        return;
      }
    });
  }

  function addItemToCart(itemId) {
    const item = menuData.find((i) => i.id === itemId);
    if (!item) return;

    const existing = cartItems.find((c) => c.id === itemId);
    if (existing) {
      existing.quantity += 1;
    } else {
      cartItems.push({ ...item, quantity: 1 });
    }

    saveCart();
    renderExplorerTable();
    updateStickyDock();
  }

  function decrementCartItem(itemId) {
    const idx = cartItems.findIndex((c) => c.id === itemId);
    if (idx === -1) return;

    if (cartItems[idx].quantity > 1) {
      cartItems[idx].quantity -= 1;
    } else {
      cartItems.splice(idx, 1);
    }

    saveCart();
    renderExplorerTable();
    updateStickyDock();
  }

  function saveCart() {
    localStorage.setItem('panda-meal-cart', JSON.stringify(cartItems));
  }

  function updateStickyDock() {
    const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalCals = cartItems.reduce((acc, item) => acc + (item.calories * item.quantity), 0);

    // Update running summary header (Phase 5 Item 2)
    const runningTitle = document.getElementById('runningMealTitle');
    const runningCals = document.getElementById('runningMealCals');
    if (runningTitle) {
      runningTitle.textContent = `Your Meal (${totalCount} ${totalCount === 1 ? 'item' : 'items'})`;
    }
    if (runningCals) {
      runningCals.textContent = totalCount > 0
        ? `${totalCals.toLocaleString()} total calories • Calibrated macros`
        : '0 total calories • Select dishes to calculate';
    }

    if (!stickyDock) return;
    if (totalCount > 0) {
      stickyDock.classList.add('is-visible');
      if (dockCount) dockCount.textContent = `${totalCount} ${totalCount === 1 ? 'item' : 'items'} in meal`;
      if (dockValue) dockValue.textContent = `${totalCals.toLocaleString()} cal`;
    } else {
      stickyDock.classList.remove('is-visible');
    }
  }

  // Open item nutrition modal
  function openItemModal(itemId) {
    const item = menuData.find((i) => i.id === itemId);
    if (!item || !modalBackdrop || !modalContent) return;

    modalContent.innerHTML = `
      <div style="display: grid; grid-template-columns: 1fr; gap: 2rem;">
        <div>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem;">
            <span style="font-weight: 700; color: #C8102E;">${item.category}</span>
            ${item.isSpicy ? '<span style="background:#FEE2E2;color:#DC2626;padding:0.2rem 0.5rem;border-radius:999px;font-size:0.75rem;font-weight:700;">🌶️ Spicy</span>' : ''}
            ${item.isVegetarian ? '<span style="background:#DCFCE7;color:#15803D;padding:0.2rem 0.5rem;border-radius:999px;font-size:0.75rem;font-weight:700;">🌱 Vegetarian</span>' : ''}
            ${item.isGlutenFree ? '<span style="background:#DBEAFE;color:#2563EB;padding:0.2rem 0.5rem;border-radius:999px;font-size:0.75rem;font-weight:700;">GF</span>' : ''}
          </div>

          <h2 style="font-size: 1.6rem; margin-top: 0; margin-bottom: 0.5rem;">${item.name}</h2>
          <p style="color: #475569; font-size: 0.95rem; line-height: 1.6; margin-bottom: 1.5rem;">
            ${item.description || 'Authentic wok-crafted Panda Express specialty prepared fresh daily.'}
          </p>

          <!-- Macro Bars -->
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; padding: 1.25rem; margin-bottom: 1.5rem;">
            <h3 style="font-size: 0.95rem; margin-top: 0; margin-bottom: 0.75rem; text-transform: uppercase; color: #64748B;">Macro vs Daily Value</h3>
            
            <div style="margin-bottom: 0.75rem;">
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700;">
                <span>Protein</span>
                <span style="color: #16A34A;">${item.protein}g (${Math.round((item.protein / 50) * 100)}% DV)</span>
              </div>
              <div class="macro-progress-bar"><div class="macro-progress-fill" style="width: ${Math.min((item.protein / 50) * 100, 100)}%; background: #16A34A;"></div></div>
            </div>

            <div style="margin-bottom: 0.75rem;">
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700;">
                <span>Carbohydrates</span>
                <span style="color: #0284C7;">${item.totalCarbs}g (${Math.round((item.totalCarbs / 275) * 100)}% DV)</span>
              </div>
              <div class="macro-progress-bar"><div class="macro-progress-fill" style="width: ${Math.min((item.totalCarbs / 275) * 100, 100)}%; background: #0284C7;"></div></div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700;">
                <span>Total Fat</span>
                <span style="color: #D97706;">${item.totalFat}g (${Math.round((item.totalFat / 78) * 100)}% DV)</span>
              </div>
              <div class="macro-progress-bar"><div class="macro-progress-fill" style="width: ${Math.min((item.totalFat / 78) * 100, 100)}%; background: #D97706;"></div></div>
            </div>
          </div>

          <!-- Add to Meal Button -->
          <button type="button" class="btn" id="modalAddBtn" style="width: 100%; justify-content: center;">
            Add to Meal (${item.calories} cal)
          </button>
        </div>

        <!-- FDA Nutrition Box -->
        <div style="display: flex; justify-content: center;">
          <aside class="nutrition-panel" style="width: 100%; max-width: 320px;">
            <div class="nutrition-panel-title">Nutrition Facts</div>
            <div class="nutrition-serving">Serving Size: ${item.servingSize || 5.7} oz</div>
            <div class="nutrition-calories-row">
              <div style="font-weight: 700;">Calories</div>
              <div class="nutrition-cal-number">${item.calories}</div>
            </div>
            <div class="nutrition-row bold"><span>Total Fat ${item.totalFat}g</span><span>${Math.round((item.totalFat / 78) * 100)}%</span></div>
            <div class="nutrition-row indent"><span>Saturated Fat ${item.saturatedFat}g</span><span>${Math.round((item.saturatedFat / 20) * 100)}%</span></div>
            <div class="nutrition-row indent"><span>Trans Fat ${item.transFat}g</span><span>-</span></div>
            <div class="nutrition-row bold"><span>Cholesterol ${item.cholesterol}mg</span><span>${Math.round((item.cholesterol / 300) * 100)}%</span></div>
            <div class="nutrition-row bold"><span>Sodium ${item.sodium}mg</span><span>${Math.round((item.sodium / 2300) * 100)}%</span></div>
            <div class="nutrition-row bold"><span>Total Carbohydrate ${item.totalCarbs}g</span><span>${Math.round((item.totalCarbs / 275) * 100)}%</span></div>
            <div class="nutrition-row indent"><span>Dietary Fiber ${item.dietaryFiber}g</span><span>${Math.round((item.dietaryFiber / 28) * 100)}%</span></div>
            <div class="nutrition-row indent"><span>Total Sugars ${item.sugars}g</span><span>-</span></div>
            <div class="nutrition-row bold" style="border-bottom: 4px solid #000; padding: 0.4rem 0;"><span>Protein ${item.protein}g</span><span>${Math.round((item.protein / 50) * 100)}%</span></div>
          </aside>
        </div>
      </div>
    `;

    document.getElementById('modalAddBtn')?.addEventListener('click', () => {
      addItemToCart(item.id);
      closeModal();
    });

    lastFocusedElement = openerEl || document.activeElement;
    modalBackdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleModalKeydown);

    setTimeout(() => {
      if (modalCloseBtn) modalCloseBtn.focus();
    }, 50);
  }

  let lastFocusedElement = null;

  function handleModalKeydown(e) {
    if (!modalBackdrop || !modalBackdrop.classList.contains('is-open')) return;

    if (e.key === 'Tab') {
      const focusable = modalBackdrop.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    } else if (e.key === 'Escape') {
      closeModal();
    }
  }

  function closeModal() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('is-open');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', handleModalKeydown);

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeModal();
    });
  }

  // Share Meal Link Button (Phase 5 Item 3)
  const shareMealBtn = document.getElementById('btnShareMealLink');
  if (shareMealBtn) {
    shareMealBtn.addEventListener('click', async () => {
      if (cartItems.length === 0) {
        alert('Please add at least one dish to your meal first before sharing!');
        return;
      }
      const paramVal = cartItems.map((c) => `${c.id}:${c.quantity}`).join(',');
      const shareUrl = `${window.location.origin}${window.location.pathname}?meal=${encodeURIComponent(paramVal)}`;
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(shareUrl);
        } else {
          const ta = document.createElement('textarea');
          ta.value = shareUrl;
          ta.style.position = 'fixed';
          ta.style.left = '-999999px';
          document.body.appendChild(ta);
          ta.focus();
          ta.select();
          document.execCommand('copy');
          ta.remove();
        }
        const origText = shareMealBtn.innerHTML;
        shareMealBtn.innerHTML = '<span>✓ Link Copied!</span>';
        const announcer = document.getElementById('a11yClipboardAnnouncer');
        if (announcer) {
          announcer.textContent = 'Meal share link copied to clipboard!';
          setTimeout(() => { announcer.textContent = ''; }, 3000);
        }
        setTimeout(() => {
          shareMealBtn.innerHTML = origText;
        }, 2200);
      } catch (err) {
        console.error('Failed to copy share link:', err);
      }
    });
  }

  // Clear Meal Button
  const clearMealBtn = document.getElementById('btnClearMealCart');
  if (clearMealBtn) {
    clearMealBtn.addEventListener('click', () => {
      cartItems = [];
      saveCart();
      renderExplorerTable();
      updateStickyDock();
    });
  }

  // Mobile Table Scroll Affordance (Phase 1 & 5)
  function checkTableScrollHint() {
    const tableResp = document.querySelector('.table-responsive');
    const hint = document.getElementById('tableScrollHint');
    if (!tableResp || !hint) return;
    if (window.innerWidth <= 640 && tableResp.scrollWidth > tableResp.clientWidth) {
      hint.style.display = 'block';
    } else {
      hint.style.display = 'none';
    }
  }
  window.addEventListener('resize', checkTableScrollHint, { passive: true });

  // Initial explorer table render
  renderExplorerTable();
  updateStickyDock();
  checkTableScrollHint();
}

/**
 * 7. Header Transparency on Hero & Solid Blur on Scroll
 */
function initHeaderScroll() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  function onScroll() {
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/**
 * 8. Coupon Filtering Chips & View Toggle (Cards vs Accessible Table)
 */
function initCouponFilterAndToggle() {
  const filterPills = document.querySelectorAll('.coupon-filter-pill');
  const cards = document.querySelectorAll('.ticket-card');
  const tableRows = document.querySelectorAll('#couponTableMain tbody tr');
  const toggleBtn = document.getElementById('btnToggleCouponView');
  const cardsContainer = document.getElementById('couponCardsContainer');
  const tableWrapper = document.getElementById('couponTableWrapper');
  const toggleText = document.getElementById('viewToggleText');
  const toggleIcon = document.getElementById('viewToggleIcon');
  const searchInput = document.getElementById('couponSearchInput');
  const clearSearchBtn = document.getElementById('couponClearSearch');

  const resultsCount = document.getElementById('couponResultsCount');
  const emptyState = document.getElementById('couponEmptyState');
  const clearFiltersBtn = document.getElementById('btnClearCouponFilters');

  let activeCategory = 'all';
  let searchQuery = '';

  function applyFilters() {
    const query = searchQuery.trim().toLowerCase();
    let visibleCount = 0;

    // Filter Cards
    cards.forEach((card) => {
      const cat = card.dataset.category;
      const searchData = (card.dataset.search || card.textContent).toLowerCase();
      const matchesCategory = (activeCategory === 'all' || cat === activeCategory);
      const matchesSearch = (!query || searchData.includes(query));

      if (matchesCategory && matchesSearch) {
        card.classList.remove('is-hidden');
        visibleCount++;
      } else {
        card.classList.add('is-hidden');
      }
    });

    // Filter Table Rows
    tableRows.forEach((row) => {
      const cat = row.dataset.category;
      const searchData = (row.dataset.search || row.textContent).toLowerCase();
      const matchesCategory = (activeCategory === 'all' || cat === activeCategory);
      const matchesSearch = (!query || searchData.includes(query));

      if (matchesCategory && matchesSearch) {
        row.classList.remove('is-hidden');
      } else {
        row.classList.add('is-hidden');
      }
    });

    // Update Live Result Count
    if (resultsCount) {
      resultsCount.textContent = `Showing ${visibleCount} of ${cards.length} codes`;
    }

    // Empty State
    if (emptyState) {
      if (visibleCount === 0) {
        emptyState.classList.remove('is-hidden');
      } else {
        emptyState.classList.add('is-hidden');
      }
    }
  }

  // Filter Pills Logic
  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      filterPills.forEach((p) => {
        p.classList.remove('is-active');
        p.setAttribute('aria-pressed', 'false');
      });
      pill.classList.add('is-active');
      pill.setAttribute('aria-pressed', 'true');
      activeCategory = pill.dataset.filter;
      applyFilters();
    });
  });

  // Clear Filters in Empty State
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      activeCategory = 'all';
      searchQuery = '';
      if (searchInput) searchInput.value = '';
      if (clearSearchBtn) clearSearchBtn.style.display = 'none';
      filterPills.forEach((p) => {
        const isAll = p.dataset.filter === 'all';
        p.classList.toggle('is-active', isAll);
        p.setAttribute('aria-pressed', isAll ? 'true' : 'false');
      });
      applyFilters();
      if (searchInput) searchInput.focus();
    });
  }

  // Search Input Logic (Debounced for INP performance)
  if (searchInput) {
    searchInput.addEventListener('input', debounce((e) => {
      searchQuery = e.target.value;
      if (clearSearchBtn) {
        clearSearchBtn.style.display = searchQuery ? 'flex' : 'none';
      }
      applyFilters();
    }, 180));

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        clearSearchBtn.style.display = 'none';
        searchInput.focus();
        applyFilters();
      });
    }
  }

  // Table vs Card View Toggle
  if (toggleBtn && cardsContainer && tableWrapper) {
    let isTableView = false;

    toggleBtn.addEventListener('click', () => {
      isTableView = !isTableView;

      if (isTableView) {
        cardsContainer.classList.add('is-hidden');
        tableWrapper.classList.remove('is-hidden');
        if (toggleText) toggleText.textContent = 'Switch to Card View';
        if (toggleIcon) toggleIcon.textContent = '🎴';
      } else {
        cardsContainer.classList.remove('is-hidden');
        tableWrapper.classList.add('is-hidden');
        if (toggleText) toggleText.textContent = 'Switch to Table View';
        if (toggleIcon) toggleIcon.textContent = '⊞';
      }
    });
  }
}

/**
 * 9. Mobile Sticky Bottom Coupon Shortcut Bar
 */
function initMobileStickyBar() {
  const stickyBar = document.getElementById('mobileStickyCouponBar');
  if (!stickyBar) return;

  function handleScroll() {
    // Show only on mobile screens (< 860px) and when scrolled past 300px
    if (window.innerWidth <= 860 && window.scrollY > 320) {
      stickyBar.classList.add('is-visible');
    } else {
      stickyBar.classList.remove('is-visible');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleScroll, { passive: true });
  handleScroll();
}

/**
 * 10. Menu Page Live Search & Category Filtering
 */
function initMenuSearchAndFilter() {
  const searchInput = document.getElementById('menuSearchInput');
  const clearBtn = document.getElementById('menuClearSearch');
  const matchCount = document.getElementById('menuMatchCount');
  const catPills = document.querySelectorAll('.cat-nav-pill');
  const itemCards = document.querySelectorAll('.menu-item-card');
  const categorySections = document.querySelectorAll('.menu-category-block');
  const emptyState = document.getElementById('menuEmptyState');
  const clearFiltersBtn = document.getElementById('btnClearMenuFilters');

  if (!searchInput && !catPills.length) return;

  let activeCategory = 'all';
  let searchQuery = '';

  function applyFilters() {
    const query = searchQuery.trim().toLowerCase();
    let visibleCount = 0;

    // Filter each item card
    itemCards.forEach((card) => {
      const cat = card.dataset.category;
      const searchData = card.dataset.search || '';
      const matchesCat = (activeCategory === 'all' || cat === activeCategory);
      const matchesSearch = (!query || searchData.includes(query));

      if (matchesCat && matchesSearch) {
        card.classList.remove('is-hidden');
        visibleCount++;
      } else {
        card.classList.add('is-hidden');
      }
    });

    // Hide or show category sections based on whether they have visible cards
    categorySections.forEach((sec) => {
      const catId = sec.dataset.categoryId;
      if (activeCategory !== 'all' && catId !== activeCategory) {
        sec.classList.add('is-hidden');
        return;
      }

      const visibleInSec = sec.querySelectorAll('.menu-item-card:not(.is-hidden)').length;
      if (visibleInSec === 0 && (query || activeCategory !== 'all')) {
        sec.classList.add('is-hidden');
      } else {
        sec.classList.remove('is-hidden');
      }
    });

    // Update match count
    if (matchCount) {
      if (!query && activeCategory === 'all') {
        matchCount.textContent = `Showing all ${itemCards.length} items`;
      } else {
        matchCount.textContent = `${visibleCount} item${visibleCount === 1 ? '' : 's'} found`;
      }
    }

    // Empty state
    if (emptyState) {
      if (visibleCount === 0) {
        emptyState.classList.remove('is-hidden');
      } else {
        emptyState.classList.add('is-hidden');
      }
    }
  }

  // Category Pills
  catPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      catPills.forEach((p) => {
        p.classList.remove('is-active');
        p.setAttribute('aria-pressed', 'false');
      });
      pill.classList.add('is-active');
      pill.setAttribute('aria-pressed', 'true');
      activeCategory = pill.dataset.cat;
      applyFilters();

      // If specific category, scroll smoothly to section
      if (activeCategory !== 'all') {
        const targetSec = document.getElementById(activeCategory);
        if (targetSec) {
          targetSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // Clear filters
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      activeCategory = 'all';
      searchQuery = '';
      if (searchInput) searchInput.value = '';
      if (clearBtn) clearBtn.style.display = 'none';
      catPills.forEach((p) => {
        const isAll = p.dataset.cat === 'all';
        p.classList.toggle('is-active', isAll);
        p.setAttribute('aria-pressed', isAll ? 'true' : 'false');
      });
      applyFilters();
      if (searchInput) searchInput.focus();
    });
  }

  // Search Input (Debounced for INP performance)
  if (searchInput) {
    searchInput.addEventListener('input', debounce((e) => {
      searchQuery = e.target.value;
      if (clearBtn) {
        clearBtn.style.display = searchQuery ? 'flex' : 'none';
      }
      applyFilters();
    }, 180));

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        clearBtn.style.display = 'none';
        searchInput.focus();
        applyFilters();
      });
    }
  }
}

/**
 * 11. Homepage Table of Contents Active Tracking
 */
function initTableOfContents() {
  const desktopNav = document.getElementById('homeTocDesktop');
  const mobileNav = document.getElementById('homeTocMobile');
  if (!desktopNav && !mobileNav) return;

  const sectionIds = [
    'how-codes-work',
    'coupon-section',
    'howto-section-heading',
    'why-fail-heading',
    'delivery-platforms-section',
    'family-meal-deals',
    'rewards-section-heading',
    'other-discounts-heading',
    'verification-process-section',
    'faq-section-heading',
    'cta-final-heading'
  ];

  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  if (sections.length === 0) return;

  const desktopLinks = desktopNav ? desktopNav.querySelectorAll('.toc-pill') : [];
  const mobileLinks = mobileNav ? mobileNav.querySelectorAll('.toc-link') : [];

  function setActive(activeId) {
    desktopLinks.forEach((link) => {
      const match = link.getAttribute('href') === `#${activeId}`;
      link.classList.toggle('is-active', match);
      link.setAttribute('aria-current', match ? 'true' : 'false');
    });

    mobileLinks.forEach((link) => {
      const match = link.getAttribute('href') === `#${activeId}`;
      link.classList.toggle('is-active', match);
      link.setAttribute('aria-current', match ? 'true' : 'false');
    });
  }

  // Close mobile details on link click
  if (mobileNav) {
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileNav.removeAttribute('open');
      });
    });
  }

  // IntersectionObserver for active section highlighting
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0
      }
    );

    sections.forEach((sec) => observer.observe(sec));
  }
}

/**
 * 12. Panda Express Savings Calculator Engine
 */
function initSavingsCalculator() {
  const partyInput = document.getElementById('partySizeInput');
  const btnMinus = document.getElementById('btnPartyMinus');
  const btnPlus = document.getElementById('btnPartyPlus');
  const quickChips = document.querySelectorAll('.btn-quick-party');
  const couponCheck = document.getElementById('couponToggleCheckbox');

  if (!partyInput) return;

  function calculate() {
    let size = parseInt(partyInput.value, 10);
    if (isNaN(size) || size < 1) size = 1;
    if (size > 50) size = 50;
    partyInput.value = size;

    const hasCode = couponCheck ? couponCheck.checked : false;

    // Update display party size
    const dispEl = document.getElementById('displayPartySize');
    if (dispEl) dispEl.textContent = size;

    // Baseline definitions
    // Plate: $12–$14 normal ($13 avg), $9–$11 with code ($10 avg)
    const plateMin = hasCode ? 9 : 12;
    const plateMax = hasCode ? 11 : 14;
    const plateTotalMin = plateMin * size;
    const plateTotalMax = plateMax * size;
    const platePerPersonMin = plateMin;
    const platePerPersonMax = plateMax;

    // Bigger Plate: $14–$16 normal ($15 avg), $11–$13 with code ($12 avg)
    const bpMin = hasCode ? 11 : 14;
    const bpMax = hasCode ? 13 : 16;
    const bpTotalMin = bpMin * size;
    const bpTotalMax = bpMax * size;
    const bpPerPersonMin = bpMin;
    const bpPerPersonMax = bpMax;

    // Family Meal: Serves 4-5. $45–$55 normal ($50 avg), $35–$45 with code ($40 avg)
    const fmBundles = Math.max(1, Math.ceil(size / 5));
    const fmPriceMin = hasCode ? 35 : 45;
    const fmPriceMax = hasCode ? 45 : 55;
    const fmTotalMin = fmPriceMin * fmBundles;
    const fmTotalMax = fmPriceMax * fmBundles;
    const fmPerPersonMin = Math.round(fmTotalMin / size);
    const fmPerPersonMax = Math.round(fmTotalMax / size);

    // Catering: Serves 10. $90–$120 normal ($105 avg), $80–$110 with code ($95 avg)
    const catSets = Math.max(1, Math.ceil(size / 10));
    const catPriceMin = hasCode ? 80 : 90;
    const catPriceMax = hasCode ? 110 : 120;
    const catTotalMin = catPriceMin * catSets;
    const catTotalMax = catPriceMax * catSets;
    const catPerPersonMin = Math.round(catTotalMin / size);
    const catPerPersonMax = Math.round(catTotalMax / size);

    // Determine Best Recommendation
    let best = 'plate';
    let recTitle = '';
    let recReason = '';

    if (size === 1) {
      best = 'plate';
      recTitle = 'Individual Plate';
      recReason = hasCode
        ? 'For 1 person, an individual Plate with a promo code costs only ~$9–$11 vs $35+ for a Family Meal.'
        : 'For 1 person, an individual Plate ($12–$14) is the most practical choice.';
    } else if (size <= 3) {
      best = 'plate';
      recTitle = `${size} Individual Plates`;
      recReason = `For ${size} people, ordering ${size} Individual Plates totals $${plateTotalMin}–$${plateTotalMax} ($${plateMin}–$${plateMax}/person), which is cheaper out-of-pocket than a full Family Meal ($${fmTotalMin}–$${fmTotalMax}), unless you want substantial leftover meals.`;
    } else if (size <= 9) {
      best = 'family-meal';
      recTitle = `Family Meal (${fmBundles} ${fmBundles === 1 ? 'Bundle' : 'Bundles'})`;
      const diffMin = Math.max(10, plateTotalMin - fmTotalMin);
      const diffMax = Math.max(15, plateTotalMax - fmTotalMax);
      recReason = `For ${size} people, ${fmBundles} Family ${fmBundles === 1 ? 'Meal feeds' : 'Meals feed'} everyone for ~$${fmPerPersonMin}–$${fmPerPersonMax}/person ($${fmTotalMin}–$${fmTotalMax} total) — saving roughly $${diffMin}–$${diffMax} compared to individual plates!`;
    } else {
      best = 'catering';
      recTitle = `Party Catering (${catSets} ${catSets === 1 ? 'Set' : 'Sets'})`;
      recReason = `For ${size} guests, Party Catering ($${catTotalMin}–$${catTotalMax} total, ~$${catPerPersonMin}–$${catPerPersonMax}/person) includes serving utensils and party steam trays, matching or beating plate costs.`;
    }

    // Update Recommendation Banner
    const recTitleEl = document.getElementById('recommendationTitle');
    const recReasonEl = document.getElementById('recommendationReasoning');
    if (recTitleEl) recTitleEl.textContent = recTitle;
    if (recReasonEl) recReasonEl.textContent = recReason;

    // Update Cards
    const cardPlate = document.getElementById('cardPlate');
    const cardBp = document.getElementById('cardBiggerPlate');
    const cardFm = document.getElementById('cardFamilyMeal');
    const cardCat = document.getElementById('cardCatering');

    const badgePlate = document.getElementById('badgePlate');
    const badgeBp = document.getElementById('badgeBiggerPlate');
    const badgeFm = document.getElementById('badgeFamilyMeal');
    const badgeCat = document.getElementById('badgeCatering');

    [
      { card: cardPlate, badge: badgePlate, isBest: best === 'plate' },
      { card: cardBp, badge: badgeBp, isBest: best === 'bigger-plate' },
      { card: cardFm, badge: badgeFm, isBest: best === 'family-meal' },
      { card: cardCat, badge: badgeCat, isBest: best === 'catering' }
    ].forEach(({ card, badge, isBest }) => {
      if (card) {
        card.style.background = isBest ? '#F0FDF4' : '#FFFFFF';
        card.style.borderColor = isBest ? '#22C55E' : '#E2E8F0';
        card.style.borderWidth = isBest ? '2px' : '1px';
        card.style.boxShadow = isBest ? '0 4px 12px rgba(34,197,94,0.15)' : 'none';
      }
      if (badge) {
        badge.style.display = isBest ? 'inline-block' : 'none';
      }
    });

    // Quantities
    const qtyPlate = document.getElementById('qtyPlate');
    if (qtyPlate) qtyPlate.textContent = `${size} Plates (2 Entrees / ea)`;

    const qtyBp = document.getElementById('qtyBiggerPlate');
    if (qtyBp) qtyBp.textContent = `${size} Bigger Plates (3 Entrees / ea)`;

    const qtyFm = document.getElementById('qtyFamilyMeal');
    if (qtyFm) qtyFm.textContent = `${fmBundles} ${fmBundles === 1 ? 'Bundle (3 Lg Entrees + 2 Lg Sides)' : 'Bundles (' + (fmBundles * 3) + ' Entrees + ' + (fmBundles * 2) + ' Sides)'}`;

    const qtyCat = document.getElementById('qtyCatering');
    if (qtyCat) qtyCat.textContent = `${catSets} ${catSets === 1 ? 'Party Set (Serves 10-12)' : 'Party Sets (Serves ' + (catSets * 10) + ')'}`;

    // Total Costs
    const costPlate = document.getElementById('costPlate');
    if (costPlate) costPlate.textContent = `$${plateTotalMin}–$${plateTotalMax}`;

    const costBp = document.getElementById('costBiggerPlate');
    if (costBp) costBp.textContent = `$${bpTotalMin}–$${bpTotalMax}`;

    const costFm = document.getElementById('costFamilyMeal');
    if (costFm) costFm.textContent = `$${fmTotalMin}–$${fmTotalMax}`;

    const costCat = document.getElementById('costCatering');
    if (costCat) costCat.textContent = `$${catTotalMin}–$${catTotalMax}`;

    // Per Person
    const ppPlate = document.getElementById('perPersonPlate');
    if (ppPlate) ppPlate.textContent = `~$${platePerPersonMin}–$${platePerPersonMax} / person`;

    const ppBp = document.getElementById('perPersonBiggerPlate');
    if (ppBp) ppBp.textContent = `~$${bpPerPersonMin}–$${bpPerPersonMax} / person`;

    const ppFm = document.getElementById('perPersonFamilyMeal');
    if (ppFm) ppFm.textContent = `~$${fmPerPersonMin}–$${fmPerPersonMax} / person`;

    const ppCat = document.getElementById('perPersonCatering');
    if (ppCat) ppCat.textContent = `~$${catPerPersonMin}–$${catPerPersonMax} / person`;

    // Visual Chart Bars (normalize to max per-person cost)
    const avgPlate = (platePerPersonMin + platePerPersonMax) / 2;
    const avgBp = (bpPerPersonMin + bpPerPersonMax) / 2;
    const avgFm = (fmPerPersonMin + fmPerPersonMax) / 2;
    const avgCat = (catPerPersonMin + catPerPersonMax) / 2;
    const maxAvg = Math.max(avgPlate, avgBp, avgFm, avgCat, 1);

    const setChart = (barId, labelId, avg, isBest) => {
      const bar = document.getElementById(barId);
      const label = document.getElementById(labelId);
      if (bar) {
        const pct = Math.max(15, Math.min(100, Math.round((avg / maxAvg) * 100)));
        bar.style.width = `${pct}%`;
        bar.style.background = isBest ? '#22C55E' : '#94A3B8';
      }
      if (label) {
        label.textContent = `~$${Math.round(avg)}/person`;
        label.style.color = isBest ? '#16A34A' : '#64748B';
        label.style.fontWeight = isBest ? '800' : '700';
      }
    };

    setChart('chartBarPlate', 'chartLabelPlate', avgPlate, best === 'plate');
    setChart('chartBarBiggerPlate', 'chartLabelBiggerPlate', avgBp, best === 'bigger-plate');
    setChart('chartBarFamilyMeal', 'chartLabelFamilyMeal', avgFm, best === 'family-meal');
    setChart('chartBarCatering', 'chartLabelCatering', avgCat, best === 'catering');

    // Quick chips state
    quickChips.forEach((chip) => {
      const chipSize = parseInt(chip.dataset.size, 10);
      chip.classList.toggle('is-active', chipSize === size);
      if (chipSize === size) {
        chip.style.borderColor = '#C8102E';
        chip.style.background = '#FEE2E2';
        chip.style.color = '#C8102E';
      } else {
        chip.style.borderColor = '#E2E8F0';
        chip.style.background = '#F1F5F9';
        chip.style.color = '#1E293B';
      }
    });
  }

  // Event Listeners
  if (btnMinus) {
    btnMinus.addEventListener('click', () => {
      let current = parseInt(partyInput.value, 10) || 5;
      if (current > 1) {
        partyInput.value = current - 1;
        calculate();
      }
    });
  }

  if (btnPlus) {
    btnPlus.addEventListener('click', () => {
      let current = parseInt(partyInput.value, 10) || 5;
      if (current < 50) {
        partyInput.value = current + 1;
        calculate();
      }
    });
  }

  partyInput.addEventListener('input', calculate);
  partyInput.addEventListener('change', calculate);

  if (couponCheck) {
    couponCheck.addEventListener('change', calculate);
  }

  quickChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const sz = parseInt(chip.dataset.size, 10);
      if (sz) {
        partyInput.value = sz;
        calculate();
      }
    });
  });

  // Initial calculation
  calculate();
}

