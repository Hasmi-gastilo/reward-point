/**
 * ============================================
 * HELPER UTILITIES
 * ============================================
 * Helper functions untuk berbagai kebutuhan
 */

/**
 * Format number dengan separator ribuan
 * @param {number} num - Number to format
 * @returns {string}
 */
export function formatNumber(num) {
    return new Intl.NumberFormat('id-ID').format(num);
}

/**
 * Format date ke format Indonesia
 * @param {string|Date} date - Date to format
 * @returns {string}
 */
export function formatDate(date) {
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(new Date(date));
}

/**
 * Format date dengan waktu
 * @param {string|Date} date - Date to format
 * @returns {string}
 */
export function formatDateTime(date) {
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(date));
}

/**
 * Format relative time (2 jam yang lalu, 3 hari yang lalu)
 * @param {string|Date} date - Date to format
 * @returns {string}
 */
export function formatRelativeTime(date) {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSeconds < 60) return 'Baru saja';
    if (diffMinutes < 60) return `${diffMinutes} menit yang lalu`;
    if (diffHours < 24) return `${diffHours} jam yang lalu`;
    if (diffDays < 7) return `${diffDays} hari yang lalu`;
    
    return formatDate(date);
}

/**
 * Truncate text dengan ellipsis
 * @param {string} text - Text to truncate
 * @param {number} length - Max length
 * @returns {string}
 */
export function truncateText(text, length = 100) {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function}
 */
export function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Show toast notification
 * @param {string} message - Message to show
 * @param {string} type - Type: success, error, warning, info
 * @param {number} duration - Duration in ms
 */
export function showToast(message, type = 'info', duration = 3000) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    }[type];

    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;

    // Add to body
    document.body.appendChild(toast);

    // Show toast
    setTimeout(() => toast.classList.add('show'), 10);

    // Remove toast after duration
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

/**
 * Show loading overlay
 */
export function showLoading() {
    const loading = document.createElement('div');
    loading.className = 'loading-overlay';
    loading.id = 'loadingOverlay';
    loading.innerHTML = `
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading...</p>
        </div>
    `;
    document.body.appendChild(loading);
}

/**
 * Hide loading overlay
 */
export function hideLoading() {
    const loading = document.getElementById('loadingOverlay');
    if (loading) {
        loading.remove();
    }
}

/**
 * Show confirmation dialog
 * @param {string} message - Message to show
 * @returns {Promise<boolean>}
 */
export function showConfirm(message) {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.className = 'modal show';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 400px;">
                <div class="modal-header">
                    <h3 class="modal-title">Konfirmasi</h3>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-outline" id="confirmCancel">Batal</button>
                    <button class="btn btn-primary" id="confirmOk">Ya, Lanjutkan</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        document.getElementById('confirmOk').onclick = () => {
            modal.remove();
            resolve(true);
        };

        document.getElementById('confirmCancel').onclick = () => {
            modal.remove();
            resolve(false);
        };

        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.remove();
                resolve(false);
            }
        };
    });
}

/**
 * Validate file upload
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {Object}
 */
export function validateFile(file, options = {}) {
    const {
        maxSize = 5 * 1024 * 1024, // 5MB default
        allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
    } = options;

    if (!file) {
        return { valid: false, error: 'File tidak dipilih' };
    }

    if (file.size > maxSize) {
        return { valid: false, error: `File terlalu besar. Maksimal ${maxSize / 1024 / 1024}MB` };
    }

    if (!allowedTypes.includes(file.type)) {
        return { valid: false, error: 'Format file tidak didukung' };
    }

    return { valid: true };
}

/**
 * Get image preview URL dari File
 * @param {File} file - Image file
 * @returns {Promise<string>}
 */
export function getImagePreview(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>}
 */
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.error('Copy to clipboard error:', error);
        return false;
    }
}

/**
 * Generate random color
 * @returns {string}
 */
export function randomColor() {
    const colors = [
        '#2563EB', '#F59E0B', '#10B981', '#EF4444',
        '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Slugify text (untuk URL friendly)
 * @param {string} text - Text to slugify
 * @returns {string}
 */
export function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
}

/**
 * Get query parameter from URL
 * @param {string} param - Parameter name
 * @returns {string|null}
 */
export function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

/**
 * Set query parameter to URL
 * @param {string} param - Parameter name
 * @param {string} value - Parameter value
 */
export function setQueryParam(param, value) {
    const url = new URL(window.location);
    url.searchParams.set(param, value);
    window.history.pushState({}, '', url);
}

/**
 * Export data to CSV
 * @param {Array} data - Array of objects
 * @param {string} filename - CSV filename
 */
export function exportToCSV(data, filename = 'export.csv') {
    if (!data.length) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
}
