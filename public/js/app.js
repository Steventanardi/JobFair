/**
 * App Utilities — NQU Job Fair System
 * Toast notifications, modals, and shared UI helpers
 */

const App = {
  /**
   * Show a toast notification
   */
  toast(message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const icons = {
      success: '✓',
      error: '✕',
      info: 'ℹ'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    const iconSpan = document.createElement('span');
    iconSpan.textContent = icons[type] || 'ℹ';
    const msgSpan = document.createElement('span');
    msgSpan.textContent = message;
    toast.appendChild(iconSpan);
    toast.appendChild(msgSpan);
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'fadeOut 0.3s var(--ease-out) forwards';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  },

  /**
   * Show a modal
   */
  showModal(id) {
    const overlay = document.getElementById(id);
    if (overlay) {
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  /**
   * Hide a modal
   */
  hideModal(id) {
    const overlay = document.getElementById(id);
    if (overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  /**
   * Format a date string
   */
  formatDate(dateStr) {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  /**
   * Format relative time
   */
  timeAgo(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return App.formatDate(dateStr);
  },

  /**
   * Create a status badge HTML
   */
  statusBadge(status) {
    return `<span class="badge badge--${status}">${status}</span>`;
  },

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  },

  /**
   * Handle logout
   */
  async logout() {
    try {
      await API.post('/api/auth/logout');
      window.location.href = '/';
    } catch (err) {
      App.toast('Logout failed', 'error');
    }
  },

  /**
   * Require auth — redirect to login if not authenticated
   */
  async requireAuth(role) {
    const user = await API.checkAuth();
    if (!user || user.role !== role) {
      window.location.href = role === 'admin' ? '/admin/login.html' : '/employer/login.html';
      return null;
    }
    return user;
  },

  /**
   * Initialize tab system
   */
  initTabs(container) {
    const tabs = container.querySelectorAll('.tab');
    const panels = container.querySelectorAll('.tab-panel');

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('tab--active'));
        panels.forEach(p => p.classList.remove('tab-panel--active'));
        tab.classList.add('tab--active');
        const target = document.getElementById(tab.dataset.tab);
        if (target) target.classList.add('tab-panel--active');
      });
    });
  },

  /**
   * Confirm dialog
   */
  confirm(message) {
    return window.confirm(message);
  },

  /**
   * Initialize hamburger nav drawer (for pages using .nav)
   */
  initNav() {
    const hamburger = document.querySelector('.nav__hamburger');
    const navLinks  = document.querySelector('.nav__links');
    const overlay   = document.querySelector('.nav__overlay');
    if (!hamburger || !navLinks) return;

    function toggle(open) {
      hamburger.classList.toggle('is-open', open);
      navLinks.classList.toggle('is-open', open);
      if (overlay) overlay.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    }

    hamburger.addEventListener('click', () => toggle(!navLinks.classList.contains('is-open')));
    if (overlay) overlay.addEventListener('click', () => toggle(false));
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggle(false)));
  },

  /**
   * Initialize off-canvas sidebar (for admin dashboard)
   */
  initSidebar() {
    const toggle  = document.querySelector('.dashboard__sidebar-toggle');
    const sidebar = document.querySelector('.dashboard__sidebar');
    const overlay = document.querySelector('.sidebar__overlay');
    if (!toggle || !sidebar) return;

    function open(state) {
      sidebar.classList.toggle('is-open', state);
      if (overlay) overlay.classList.toggle('is-open', state);
      document.body.style.overflow = state ? 'hidden' : '';
    }

    toggle.addEventListener('click', () => open(!sidebar.classList.contains('is-open')));
    if (overlay) overlay.addEventListener('click', () => open(false));

    // Close sidebar when a tab is switched on mobile
    sidebar.querySelectorAll('.sidebar-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) open(false);
      });
    });
  }
};

// Auto-initialize nav and sidebar on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  App.initNav();
  App.initSidebar();
});
