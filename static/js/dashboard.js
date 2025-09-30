// Dashboard JavaScript functionality

// Global variables
let allContent = [];
let currentDailyPack = null;

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

async function initializeDashboard() {
    try {
        // Load initial data
        await Promise.all([
            loadDailyPack(),
            loadAllContent()
        ]);
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        showError('Failed to load dashboard data');
    }
}

// Daily Pack functions
async function loadDailyPack() {
    try {
        const response = await fetch('/api/motivation/daily-pack');
        const result = await response.json();
        
        if (result.success) {
            currentDailyPack = result.data;
            renderDailyPack(result.data);
            updateDailyPackCount(result.data);
        } else {
            renderNoDailyPack();
            updateDailyPackCount(null);
        }
    } catch (error) {
        console.error('Error loading daily pack:', error);
        renderErrorState('#daily-pack-container', 'Failed to load daily pack');
    }
}

function renderDailyPack(pack) {
    const container = document.getElementById('daily-pack-container');
    
    if (!pack) {
        renderNoDailyPack();
        return;
    }
    
    const contentItemsHtml = pack.content_items && pack.content_items.length > 0 
        ? pack.content_items.map(item => renderContentItemInPack(item.content_item)).join('')
        : '<p class="text-center mb-0">No content items in this pack yet.</p>';
    
    container.innerHTML = `
        <div class="daily-pack fade-in">
            <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                    <h4 class="mb-1">${escapeHtml(pack.title)}</h4>
                    <p class="mb-2 opacity-75">${escapeHtml(pack.description || 'No description')}</p>
                    ${pack.theme ? `<span class="theme-badge">${escapeHtml(pack.theme)}</span>` : ''}
                </div>
                <div class="text-end">
                    <small class="opacity-75">Today's Pack</small>
                </div>
            </div>
            
            <div class="daily-pack-content">
                <h6 class="mb-3"><i class="fas fa-list"></i> Content (${pack.content_items ? pack.content_items.length : 0} items)</h6>
                ${contentItemsHtml}
            </div>
        </div>
    `;
}

function renderNoDailyPack() {
    const container = document.getElementById('daily-pack-container');
    container.innerHTML = `
        <div class="text-center py-4">
            <i class="fas fa-music fa-3x text-muted mb-3"></i>
            <h5 class="text-muted">No daily pack for today</h5>
            <p class="text-muted">Create a daily pack to get started with today's vibes!</p>
            <button class="btn btn-primary" onclick="createTodaysPack()">
                <i class="fas fa-plus"></i> Create Today's Pack
            </button>
        </div>
    `;
}

function renderContentItemInPack(item) {
    const platformClass = `platform-${item.platform}`;
    const thumbnailHtml = item.thumbnail_url 
        ? `<img src="${escapeHtml(item.thumbnail_url)}" alt="Thumbnail" class="content-thumbnail me-3">`
        : `<div class="content-thumbnail me-3 bg-light d-flex align-items-center justify-content-center">
             <i class="fas fa-${item.content_type === 'video' ? 'play' : 'list'} text-muted"></i>
           </div>`;
    
    return `
        <div class="content-item d-flex align-items-center">
            ${thumbnailHtml}
            <div class="flex-grow-1">
                <h6 class="mb-1">${escapeHtml(item.title)}</h6>
                <p class="mb-2 text-muted small">${escapeHtml(item.description || 'No description')}</p>
                <div class="d-flex align-items-center gap-2">
                    <span class="platform-badge ${platformClass}">
                        <i class="fab fa-${item.platform}"></i> ${item.platform.charAt(0).toUpperCase() + item.platform.slice(1)}
                    </span>
                    <span class="content-type-badge">${item.content_type}</span>
                    ${item.duration ? `<span class="text-muted small">${escapeHtml(item.duration)}</span>` : ''}
                </div>
            </div>
            <div>
                <a href="${escapeHtml(item.url)}" target="_blank" class="btn btn-sm btn-outline-primary">
                    <i class="fas fa-external-link-alt"></i>
                </a>
            </div>
        </div>
    `;
}

function updateDailyPackCount(pack) {
    const countElement = document.getElementById('daily-pack-count');
    if (pack && pack.content_items) {
        countElement.textContent = `${pack.content_items.length} items`;
    } else {
        countElement.textContent = '0 items';
    }
}

// All Content functions
async function loadAllContent() {
    try {
        const response = await fetch('/api/content?active=true');
        const result = await response.json();
        
        if (result.success) {
            allContent = result.data;
            renderAllContent(result.data);
        } else {
            throw new Error(result.error || 'Failed to load content');
        }
    } catch (error) {
        console.error('Error loading all content:', error);
        renderErrorState('#all-content-container', 'Failed to load content');
    }
}

function renderAllContent(content) {
    const container = document.getElementById('all-content-container');
    
    if (!content || content.length === 0) {
        container.innerHTML = `
            <div class="text-center py-3">
                <i class="fas fa-folder-open fa-2x text-muted mb-2"></i>
                <p class="text-muted mb-2">No content yet</p>
                <button class="btn btn-sm btn-primary" onclick="addContent()">
                    <i class="fas fa-plus"></i> Add Content
                </button>
            </div>
        `;
        return;
    }
    
    const contentHtml = content.slice(0, 5).map(item => renderContentItemSmall(item)).join('');
    const moreCount = content.length > 5 ? content.length - 5 : 0;
    
    container.innerHTML = `
        <div class="content-list">
            ${contentHtml}
            ${moreCount > 0 ? `<p class="text-center text-muted small mt-2">And ${moreCount} more items...</p>` : ''}
            <div class="text-center mt-3">
                <button class="btn btn-sm btn-outline-primary" onclick="addContent()">
                    <i class="fas fa-plus"></i> Add Content
                </button>
            </div>
        </div>
    `;
}

function renderContentItemSmall(item) {
    const platformClass = `platform-${item.platform}`;
    
    return `
        <div class="d-flex align-items-center mb-2 p-2 border rounded">
            <div class="me-2">
                <i class="fas fa-${item.content_type === 'video' ? 'play' : 'list'} text-muted"></i>
            </div>
            <div class="flex-grow-1">
                <h6 class="mb-0 fs-6">${escapeHtml(item.title)}</h6>
                <small class="platform-badge ${platformClass}">
                    <i class="fab fa-${item.platform}"></i> ${item.platform}
                </small>
            </div>
            <div>
                <a href="${escapeHtml(item.url)}" target="_blank" class="btn btn-sm btn-outline-secondary">
                    <i class="fas fa-external-link-alt"></i>
                </a>
            </div>
        </div>
    `;
}

// Modal and form functions
function addContent() {
    const modal = new bootstrap.Modal(document.getElementById('addContentModal'));
    modal.show();
}

async function saveContent() {
    const form = document.getElementById('addContentForm');
    const formData = new FormData(form);
    
    const contentData = {
        title: document.getElementById('contentTitle').value,
        description: document.getElementById('contentDescription').value,
        content_type: document.getElementById('contentType').value,
        platform: document.getElementById('contentPlatform').value,
        url: document.getElementById('contentUrl').value,
        thumbnail_url: document.getElementById('contentThumbnail').value,
        duration: document.getElementById('contentDuration').value
    };
    
    // Validate required fields
    if (!contentData.title || !contentData.content_type || !contentData.platform || !contentData.url) {
        showError('Please fill in all required fields');
        return;
    }
    
    try {
        const response = await fetch('/api/content', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contentData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('addContentModal'));
            modal.hide();
            
            // Reset form
            form.reset();
            
            // Reload content
            await loadAllContent();
            
            showSuccess('Content added successfully!');
        } else {
            showError(result.error || 'Failed to save content');
        }
    } catch (error) {
        console.error('Error saving content:', error);
        showError('Failed to save content');
    }
}

async function createTodaysPack() {
    const today = new Date().toISOString().split('T')[0];
    
    const packData = {
        date: today,
        title: 'Today\'s Vibes',
        description: 'Daily motivation pack for ' + new Date().toLocaleDateString(),
        theme: 'Daily Motivation'
    };
    
    try {
        const response = await fetch('/api/motivation/daily-pack', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(packData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            await loadDailyPack();
            showSuccess('Today\'s pack created successfully!');
        } else {
            showError(result.error || 'Failed to create daily pack');
        }
    } catch (error) {
        console.error('Error creating daily pack:', error);
        showError('Failed to create daily pack');
    }
}

// Utility functions
function refreshVibes() {
    loadDailyPack();
}

function renderErrorState(containerSelector, message) {
    const container = document.querySelector(containerSelector);
    if (container) {
        container.innerHTML = `
            <div class="text-center py-4">
                <i class="fas fa-exclamation-triangle fa-2x text-warning mb-2"></i>
                <p class="text-muted">${escapeHtml(message)}</p>
                <button class="btn btn-sm btn-outline-primary" onclick="initializeDashboard()">
                    <i class="fas fa-refresh"></i> Retry
                </button>
            </div>
        `;
    }
}

function showError(message) {
    // Simple alert for now - could be replaced with a toast notification
    alert('Error: ' + message);
}

function showSuccess(message) {
    // Simple alert for now - could be replaced with a toast notification
    alert('Success: ' + message);
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Export functions for global access
window.refreshVibes = refreshVibes;
window.addContent = addContent;
window.saveContent = saveContent;
window.createTodaysPack = createTodaysPack;