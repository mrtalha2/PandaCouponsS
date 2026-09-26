/**
 * Admin Dashboard View (Phase 17j)
 */

function renderDashboard({ publishState, stats }) {
  const pendingChanges = publishState.pendingChanges || [];
  const lastPubStr = publishState.lastPublished
    ? new Date(publishState.lastPublished).toLocaleString()
    : 'Not yet published';

  return `
    <div style="margin-bottom: 2rem;">
      <h1 style="font-size: 1.85rem; font-weight: 800; margin: 0 0 0.5rem 0; color: #FFF;">Admin Dashboard</h1>
      <p style="color: var(--admin-muted); margin: 0; font-size: 0.95rem;">
        Manage deals, content overrides, SEO metadata, redirects, and site deployments.
      </p>
    </div>

    <!-- Overview Stats Grid -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; margin-bottom: 2rem;">
      <div class="admin-card" style="margin: 0;">
        <div style="font-size: 0.85rem; color: var(--admin-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 0.5rem;">
          Coupons Active
        </div>
        <div style="font-size: 2.2rem; font-weight: 900; color: #F5B301;">
          ${stats.activeCoupons} <span style="font-size: 1rem; color: var(--admin-muted); font-weight: 500;">/ ${stats.totalCoupons} total</span>
        </div>
      </div>

      <div class="admin-card" style="margin: 0;">
        <div style="font-size: 0.85rem; color: var(--admin-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 0.5rem;">
          Publish Status
        </div>
        <div style="font-size: 1.25rem; font-weight: 800; color: #34D399; margin-top: 0.4rem;">
          ✓ Instant Live Sync Active
        </div>
        <div style="font-size: 0.8rem; color: var(--admin-muted); margin-top: 0.35rem;">
          Last published: ${lastPubStr}
        </div>
      </div>

      <div class="admin-card" style="margin: 0;">
        <div style="font-size: 0.85rem; color: var(--admin-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 0.5rem;">
          Managed Pages
        </div>
        <div style="font-size: 2.2rem; font-weight: 900; color: #60A5FA;">
          9 <span style="font-size: 1rem; color: var(--admin-muted); font-weight: 500;">routes</span>
        </div>
      </div>

      <div class="admin-card" style="margin: 0;">
        <div style="font-size: 0.85rem; color: var(--admin-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 0.5rem;">
          301 Redirect Rules
        </div>
        <div style="font-size: 2.2rem; font-weight: 900; color: #A78BFA;">
          ${stats.totalRedirects}
        </div>
      </div>
    </div>

    <!-- Live Publishing Status -->
    <div class="admin-card">
      <div class="admin-card-header">
        <h2 class="admin-card-title">Live Site Deployment Status</h2>
        <button onclick="document.getElementById('btnPublishLive').click()" class="btn-admin-primary" style="font-size: 0.82rem; padding: 0.4rem 0.85rem;">
          🚀 Rebuild Live Site
        </button>
      </div>
      
      <div style="padding: 1.5rem; text-align: center; color: #CBD5E1; font-size: 0.95rem;">
        <span style="color: #34D399; font-weight: 700;">✓ Instant Auto-Publishing is Active:</span> Every change made to coupons, pages, SEO meta, custom code, or redirects is automatically compiled and published to the live site immediately upon clicking Save.
      </div>
    </div>

    <!-- Quick Navigation Modules -->
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;">
      <a href="/admin/coupons" class="admin-card" style="text-decoration: none; display: block; transition: transform 0.15s ease;">
        <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🎟️</div>
        <h3 style="color: #FFF; margin: 0 0 0.4rem 0; font-size: 1.15rem;">Coupons Manager</h3>
        <p style="color: var(--admin-muted); font-size: 0.88rem; margin: 0; line-height: 1.5;">
          Create, edit, toggle drafts, reorder, and set expiration dates on promo codes and family deals.
        </p>
      </a>

      <a href="/admin/pages" class="admin-card" style="text-decoration: none; display: block; transition: transform 0.15s ease;">
        <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">📄</div>
        <h3 style="color: #FFF; margin: 0 0 0.4rem 0; font-size: 1.15rem;">Page Content Overrides</h3>
        <p style="color: var(--admin-muted); font-size: 0.88rem; margin: 0; line-height: 1.5;">
          Safely customize headings, body copy, and FAQ questions without touching template source code.
        </p>
      </a>

      <a href="/admin/meta" class="admin-card" style="text-decoration: none; display: block; transition: transform 0.15s ease;">
        <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🏷️</div>
        <h3 style="color: #FFF; margin: 0 0 0.4rem 0; font-size: 1.15rem;">SEO &amp; Social Meta</h3>
        <p style="color: var(--admin-muted); font-size: 0.88rem; margin: 0; line-height: 1.5;">
          Tune page titles, meta descriptions, Open Graph preview images, and canonical tags.
        </p>
      </a>

      <a href="/admin/code" class="admin-card" style="text-decoration: none; display: block; transition: transform 0.15s ease;">
        <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">💻</div>
        <h3 style="color: #FFF; margin: 0 0 0.4rem 0; font-size: 1.15rem;">Code Injection</h3>
        <p style="color: var(--admin-muted); font-size: 0.88rem; margin: 0; line-height: 1.5;">
          Add analytics trackers, Google Tag Manager, or verification scripts to head and body.
        </p>
      </a>

      <a href="/admin/redirects" class="admin-card" style="text-decoration: none; display: block; transition: transform 0.15s ease;">
        <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🔀</div>
        <h3 style="color: #FFF; margin: 0 0 0.4rem 0; font-size: 1.15rem;">301 Redirects</h3>
        <p style="color: var(--admin-muted); font-size: 0.88rem; margin: 0; line-height: 1.5;">
          Forward legacy or campaign URLs directly to live routes to preserve link equity.
        </p>
      </a>

      <a href="/admin/media" class="admin-card" style="text-decoration: none; display: block; transition: transform 0.15s ease;">
        <div style="font-size: 1.5rem; margin-bottom: 0.5rem;">🖼️</div>
        <h3 style="color: #FFF; margin: 0 0 0.4rem 0; font-size: 1.15rem;">Media Library</h3>
        <p style="color: var(--admin-muted); font-size: 0.88rem; margin: 0; line-height: 1.5;">
          Upload new banners and photos with automated Sharp WebP compression and budget enforcement.
        </p>
      </a>
    </div>
  `;
}

module.exports = renderDashboard;
