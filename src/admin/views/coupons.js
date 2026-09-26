/**
 * Admin Coupon Manager View (Phase 17f)
 */

function renderCoupons({ coupons }) {
  return `
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
      <div>
        <h1 style="font-size: 1.85rem; font-weight: 800; margin: 0 0 0.5rem 0; color: #FFF;">Coupons Manager</h1>
        <p style="color: var(--admin-muted); margin: 0; font-size: 0.95rem;">
          Manage discount codes, family deals, draft scheduling, and live status tags.
        </p>
      </div>
      <div style="display: flex; gap: 0.75rem;">
        <button id="btnBulkExpire" class="btn-admin-secondary" style="font-size: 0.85rem;">
          ⏳ Bulk Expire Selected
        </button>
        <button id="btnBulkDelete" class="btn-admin-secondary" style="font-size: 0.85rem; color: #F87171;">
          🗑️ Delete Selected
        </button>
        <button id="btnNewCoupon" class="btn-admin-primary">
          ➕ Add New Coupon
        </button>
      </div>
    </div>

    <!-- Coupons Table Card -->
    <div class="admin-card" style="padding: 0; overflow-x: auto;">
      <table class="admin-table" id="adminCouponTable">
        <thead>
          <tr>
            <th style="width: 40px; text-align: center;"><input type="checkbox" id="selectAllCoupons"></th>
            <th style="width: 70px;">Order</th>
            <th>Code</th>
            <th>Discount Offer</th>
            <th>Category</th>
            <th>Status</th>
            <th>Visibility</th>
            <th>Expiry Date</th>
            <th style="text-align: right;">Actions</th>
          </tr>
        </thead>
        <tbody>
          ${coupons.map((c, idx) => {
            const isDraft = c.isDraft === true;
            const statusClass = c.status === 'Active' ? 'badge-green' : (c.status === 'Expired' ? 'badge-red' : 'badge-gold');
            return `
              <tr data-id="${c.id || idx}">
                <td style="text-align: center;">
                  <input type="checkbox" class="coupon-check" value="${c.id || idx}">
                </td>
                <td>
                  <div style="display: flex; gap: 4px;">
                    <button class="btn-reorder" onclick="reorderCoupon(${idx}, -1)" ${idx === 0 ? 'disabled' : ''} style="background: none; border: none; color: #94A3B8; cursor: pointer; padding: 2px;">▲</button>
                    <button class="btn-reorder" onclick="reorderCoupon(${idx}, 1)" ${idx === coupons.length - 1 ? 'disabled' : ''} style="background: none; border: none; color: #94A3B8; cursor: pointer; padding: 2px;">▼</button>
                  </div>
                </td>
                <td>
                  <span style="font-family: monospace; font-weight: 700; background: rgba(255,255,255,0.08); padding: 0.25rem 0.5rem; border-radius: 4px; color: #FFF;">
                    ${c.code}
                  </span>
                </td>
                <td>
                  <strong style="color: #F1F5F9;">${c.discount || c.title || ''}</strong>
                  <div style="font-size: 0.8rem; color: #94A3B8; margin-top: 2px;">${c.details || ''}</div>
                </td>
                <td>
                  <span style="font-size: 0.82rem; color: #CBD5E1;">${c.category || 'General'}</span>
                </td>
                <td>
                  <span class="admin-badge ${statusClass}">${c.status || 'Active'}</span>
                </td>
                <td>
                  ${isDraft 
                    ? '<span class="admin-badge badge-blue">Draft (Hidden)</span>' 
                    : '<span class="admin-badge badge-green">Live on Site</span>'
                  }
                </td>
                <td style="font-size: 0.85rem; color: #CBD5E1;">
                  ${c.expiry || 'Ongoing'}
                </td>
                <td style="text-align: right;">
                  <button class="btn-admin-secondary" style="padding: 0.35rem 0.65rem; font-size: 0.8rem;" onclick='openEditModal(${JSON.stringify(c)}, ${idx})'>
                    ✏️ Edit
                  </button>
                  <button class="btn-admin-secondary" style="padding: 0.35rem 0.65rem; font-size: 0.8rem; color: #F87171;" onclick="deleteCoupon(${idx})">
                    🗑️
                  </button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>

    <!-- Modal Form for Coupon Add / Edit -->
    <div id="couponModal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 1000; align-items: center; justify-content: center; padding: 1rem;">
      <div style="background: #14141A; border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; max-width: 520px; width: 100%; padding: 2rem; box-sizing: border-box;">
        <h2 id="modalTitle" style="margin: 0 0 1.5rem 0; font-size: 1.35rem; color: #FFF;">Add New Coupon</h2>
        
        <form id="couponForm">
          <input type="hidden" id="couponIndex" value="-1">
          
          <div class="admin-form-group">
            <label class="admin-label" for="formCode">Promo Code (e.g. PANDA20)</label>
            <input class="admin-input" type="text" id="formCode" required>
          </div>

          <div class="admin-form-group">
            <label class="admin-label" for="formDiscount">Discount Offer (e.g. 20% Off Your Order)</label>
            <input class="admin-input" type="text" id="formDiscount" required>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="admin-form-group">
              <label class="admin-label" for="formBestFor">Best For (e.g. Any online order)</label>
              <input class="admin-input" type="text" id="formBestFor" placeholder="Any online order">
            </div>

            <div class="admin-form-group">
              <label class="admin-label" for="formMinOrder">Min Order (e.g. None / $25+)</label>
              <input class="admin-input" type="text" id="formMinOrder" placeholder="None">
            </div>
          </div>

          <div class="admin-form-group">
            <label class="admin-label" for="formNotes">Notes / Terms (e.g. Enter during checkout)</label>
            <input class="admin-input" type="text" id="formNotes" placeholder="Enter during checkout on pandaexpress.com">
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="admin-form-group">
              <label class="admin-label" for="formCategory">Category</label>
              <select class="admin-select" id="formCategory">
                <option value="Online Deals">Online Deals</option>
                <option value="Family Meals">Family Meals</option>
                <option value="App Exclusives">App Exclusives</option>
                <option value="In-Store &amp; Military">In-Store &amp; Military</option>
              </select>
            </div>

            <div class="admin-form-group">
              <label class="admin-label" for="formStatus">Status</label>
              <select class="admin-select" id="formStatus">
                <option value="Active">Active</option>
                <option value="Check App">Check App</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div class="admin-form-group">
              <label class="admin-label" for="formExpiry">Expiry Text (e.g. Dec 31, 2026)</label>
              <input class="admin-input" type="text" id="formExpiry" placeholder="Dec 31, 2026">
            </div>

            <div class="admin-form-group">
              <label class="admin-label" for="formIsDraft">Visibility</label>
              <select class="admin-select" id="formIsDraft">
                <option value="false">Published (Live)</option>
                <option value="true">Draft (Unpublished)</option>
              </select>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem;">
            <button type="button" class="btn-admin-secondary" onclick="closeModal()">Cancel</button>
            <button type="submit" id="btnSaveCouponSubmit" class="btn-admin-primary">Save Coupon</button>
          </div>
        </form>
      </div>
    </div>

    <script>
      const modal = document.getElementById('couponModal');
      const form = document.getElementById('couponForm');
      const saveSubmitBtn = document.getElementById('btnSaveCouponSubmit');

      document.getElementById('btnNewCoupon').onclick = () => {
        document.getElementById('modalTitle').textContent = 'Add New Coupon';
        document.getElementById('couponIndex').value = '-1';
        form.reset();
        modal.style.display = 'flex';
      };

      function closeModal() {
        modal.style.display = 'none';
      }

      function openEditModal(coupon, index) {
        document.getElementById('modalTitle').textContent = 'Edit Coupon';
        document.getElementById('couponIndex').value = index;
        document.getElementById('formCode').value = coupon.code || '';
        document.getElementById('formDiscount').value = coupon.discount || coupon.title || '';
        document.getElementById('formBestFor').value = coupon.bestFor || '';
        document.getElementById('formMinOrder').value = coupon.minOrder || '';
        document.getElementById('formNotes').value = coupon.notes || coupon.details || '';
        document.getElementById('formCategory').value = coupon.category || 'Online Deals';
        document.getElementById('formStatus').value = coupon.status || 'Active';
        document.getElementById('formExpiry').value = coupon.expiry || '';
        document.getElementById('formIsDraft').value = coupon.isDraft ? 'true' : 'false';
        modal.style.display = 'flex';
      }

      form.onsubmit = async (e) => {
        e.preventDefault();
        saveSubmitBtn.disabled = true;
        saveSubmitBtn.innerHTML = '⏳ Saving...';

        try {
          const index = parseInt(document.getElementById('couponIndex').value, 10);
          const couponData = {
            code: document.getElementById('formCode').value.trim().toUpperCase(),
            discount: document.getElementById('formDiscount').value.trim(),
            bestFor: document.getElementById('formBestFor').value.trim() || 'Any online order',
            minOrder: document.getElementById('formMinOrder').value.trim() || 'None',
            notes: document.getElementById('formNotes').value.trim(),
            category: document.getElementById('formCategory').value,
            status: document.getElementById('formStatus').value,
            expiry: document.getElementById('formExpiry').value.trim() || 'Ongoing',
            isDraft: document.getElementById('formIsDraft').value === 'true'
          };

          const data = await adminFetch('/admin/api/coupons', {
            method: 'POST',
            body: JSON.stringify({ action: index === -1 ? 'add' : 'edit', index, coupon: couponData })
          });

          if (data.success) {
            showToast('Coupon saved successfully!');
            setTimeout(() => location.reload(), 800);
          } else {
            throw new Error(data.error || 'Server error');
          }
        } catch (err) {
          showToast(err.message, 'error');
          alert('Failed to save coupon: ' + err.message);
        } finally {
          saveSubmitBtn.disabled = false;
          saveSubmitBtn.innerHTML = 'Save Coupon';
        }
      };

      async function deleteCoupon(index) {
        if (!confirm('Are you sure you want to delete this coupon?')) return;
        try {
          const data = await adminFetch('/admin/api/coupons', {
            method: 'POST',
            body: JSON.stringify({ action: 'delete', index })
          });
          if (data.success) {
            showToast('Coupon deleted!');
            setTimeout(() => location.reload(), 600);
          }
        } catch (err) {
          showToast(err.message, 'error');
          alert('Failed to delete coupon: ' + err.message);
        }
      }

      async function reorderCoupon(index, direction) {
        try {
          const data = await adminFetch('/admin/api/coupons', {
            method: 'POST',
            body: JSON.stringify({ action: 'reorder', index, direction })
          });
          if (data.success) location.reload();
        } catch (err) {
          showToast(err.message, 'error');
          alert('Failed to reorder: ' + err.message);
        }
      }

      // Bulk actions
      document.getElementById('selectAllCoupons').onchange = (e) => {
        document.querySelectorAll('.coupon-check').forEach(cb => cb.checked = e.target.checked);
      };

      const btnBulkExpire = document.getElementById('btnBulkExpire');
      btnBulkExpire.onclick = async () => {
        const selected = Array.from(document.querySelectorAll('.coupon-check:checked')).map(cb => parseInt(cb.value, 10));
        if (!selected.length) return alert('No coupons selected.');
        if (!confirm('Mark ' + selected.length + ' coupons as Expired?')) return;

        btnBulkExpire.disabled = true;
        btnBulkExpire.textContent = '⏳ Expiring...';
        try {
          const data = await adminFetch('/admin/api/coupons', {
            method: 'POST',
            body: JSON.stringify({ action: 'bulk-expire', indices: selected })
          });
          if (data.success) {
            showToast('Selected coupons marked as expired!');
            setTimeout(() => location.reload(), 600);
          }
        } catch (err) {
          showToast(err.message, 'error');
          alert('Failed to bulk expire: ' + err.message);
        } finally {
          btnBulkExpire.disabled = false;
          btnBulkExpire.textContent = '⏳ Bulk Expire Selected';
        }
      };

      const btnBulkDelete = document.getElementById('btnBulkDelete');
      btnBulkDelete.onclick = async () => {
        const selected = Array.from(document.querySelectorAll('.coupon-check:checked')).map(cb => parseInt(cb.value, 10));
        if (!selected.length) return alert('No coupons selected.');
        if (!confirm('Permanently delete ' + selected.length + ' coupons?')) return;

        btnBulkDelete.disabled = true;
        btnBulkDelete.textContent = '⏳ Deleting...';
        try {
          const data = await adminFetch('/admin/api/coupons', {
            method: 'POST',
            body: JSON.stringify({ action: 'bulk-delete', indices: selected })
          });
          if (data.success) {
            showToast('Selected coupons deleted!');
            setTimeout(() => location.reload(), 600);
          }
        } catch (err) {
          showToast(err.message, 'error');
          alert('Failed to bulk delete: ' + err.message);
        } finally {
          btnBulkDelete.disabled = false;
          btnBulkDelete.textContent = '🗑️ Delete Selected';
        }
      };
    </script>
  `;
}

module.exports = renderCoupons;
