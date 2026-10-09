/**
 * Reusable UI Components
 * Author / Reviewer Card and Conditional Advertising Disclosure
 */
const authorsData = require('../../data/authors.json');

function renderAuthorComponent() {
  const activeAuthor = (authorsData.authors || []).find(a => a.isActive && a.name);
  const activeReviewer = (authorsData.reviewers || []).find(r => r.isActive && r.name);

  // Hidden until author fields are filled by site owner
  if (!activeAuthor && !activeReviewer) {
    return `
      <!-- Author transparency component (hidden until populated in data/authors.json) -->
      <div class="author-attribution-container" hidden style="display: none;"></div>
    `;
  }

  return `
    <div class="author-attribution-container" style="background: rgba(255,255,255,0.04); border: 1px solid var(--color-borders); border-radius: 12px; padding: 1.25rem; margin: 2rem 0;">
      <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
        ${activeAuthor ? `
          <div style="flex: 1; min-width: 240px;">
            <div style="font-size: 0.78rem; text-transform: uppercase; color: #94A3B8; font-weight: 700;">Written by</div>
            <div style="font-size: 1.05rem; font-weight: 800; color: #FFFFFF;">${activeAuthor.name}</div>
            ${activeAuthor.role ? `<div style="font-size: 0.85rem; color: #CBD5E1;">${activeAuthor.role}</div>` : ''}
            ${activeAuthor.bio ? `<p style="font-size: 0.85rem; color: #94A3B8; margin-top: 0.35rem; margin-bottom: 0;">${activeAuthor.bio}</p>` : ''}
          </div>
        ` : ''}
        ${activeReviewer ? `
          <div style="flex: 1; min-width: 240px; border-left: 1px solid var(--color-borders); padding-left: 1rem;">
            <div style="font-size: 0.78rem; text-transform: uppercase; color: #94A3B8; font-weight: 700;">Reviewed by</div>
            <div style="font-size: 1.05rem; font-weight: 800; color: #FFFFFF;">${activeReviewer.name}</div>
            ${activeReviewer.credentials ? `<div style="font-size: 0.85rem; color: #CBD5E1;">${activeReviewer.credentials}</div>` : ''}
            ${activeReviewer.bio ? `<p style="font-size: 0.85rem; color: #94A3B8; margin-top: 0.35rem; margin-bottom: 0;">${activeReviewer.bio}</p>` : ''}
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

function renderAffiliateDisclosure({ isEnabled = false } = {}) {
  // Shown only when confirmed by site owner
  if (!isEnabled) {
    return '';
  }

  return `
    <div class="ad-affiliate-disclosure-banner" role="note" style="background: rgba(245, 179, 1, 0.08); border-left: 4px solid #F5B301; padding: 0.75rem 1rem; margin: 1rem 0; font-size: 0.85rem; color: #E2E8F0; border-radius: 4px;">
      <strong>Advertising &amp; Affiliate Disclosure:</strong> This website may receive compensation from links or promotional partnerships. We independently evaluate promo codes and nutrition data, and commercial relationships do not affect our discount verification status.
    </div>
  `;
}

module.exports = {
  renderAuthorComponent,
  renderAffiliateDisclosure
};
