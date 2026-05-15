import toolsData from '@/data/tools.json';

/***************************  TOOLS DATA SERVICE  ***************************/

/** All tools */
export const allTools = toolsData;

/** Extract unique categories with counts and colors */
export const categories = (() => {
  const map = new Map();
  toolsData.forEach((tool) => {
    const existing = map.get(tool.badge);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(tool.badge, { name: tool.badge, color: tool.badgeColor, count: 1 });
    }
  });
  return Array.from(map.values()).sort((a, b) => b.count - a.count);
})();

/** Category names only (sorted by count desc) */
export const categoryNames = categories.map((c) => c.name);

/**
 * Search and filter tools
 * @param {Object} options
 * @param {string} [options.query] - Search query (matches name, description, badge)
 * @param {string} [options.category] - Filter by badge category
 * @param {number} [options.page] - Page number (1-based)
 * @param {number} [options.perPage] - Items per page (default 24)
 * @returns {{ tools: Array, total: number, totalPages: number, page: number }}
 */
export function searchTools({ query = '', category = '', page = 1, perPage = 24 } = {}) {
  let filtered = toolsData;

  if (category) {
    filtered = filtered.filter((t) => t.badge === category);
  }

  if (query) {
    const q = query.toLowerCase().trim();
    filtered = filtered.filter(
      (t) => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.badge.toLowerCase().includes(q)
    );
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const tools = filtered.slice(start, start + perPage);

  return { tools, total, totalPages, page };
}

/**
 * Get a single tool by slug
 * @param {string} slug - Tool slug
 * @returns {Object|null} Tool data or null
 */
export function getToolBySlug(slug) {
  return toolsData.find((t) => t.slug === slug) || null;
}

/**
 * Get related tools (same category, excluding current)
 * @param {string} slug - Current tool slug
 * @param {number} limit - Max results
 * @returns {Array} Related tools
 */
export function getRelatedTools(slug, limit = 6) {
  const tool = getToolBySlug(slug);
  if (!tool) return [];
  return toolsData.filter((t) => t.badge === tool.badge && t.slug !== slug).slice(0, limit);
}
