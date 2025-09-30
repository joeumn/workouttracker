// Global state
let currentStats = null;
let todayCheckin = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadDashboard();
});

// Load dashboard data
async function loadDashboard() {
    try {
        // Load stats and today's check-in in parallel
        const [statsResponse, todayResponse] = await Promise.all([
            fetch('/api/checkins/stats'),
            fetch('/api/checkins/today')
        ]);

        if (!statsResponse.ok || !todayResponse.ok) {
            throw new Error('Failed to load dashboard data');
        }

        const stats = await statsResponse.json();
        const today = await todayResponse.json();

        currentStats = stats;
        todayCheckin = today.checkin;

        updateDashboard();
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showError('Failed to load dashboard data. Please try again.');
    }
}

// Update dashboard with current data
function updateDashboard() {
    if (!currentStats) return;

    // Update streak stats
    document.getElementById('currentStreak').textContent = currentStats.streak.current_streak || 0;
    document.getElementById('bestStreak').textContent = currentStats.streak.longest_streak || 0;
    document.getElementById('totalXP').textContent = currentStats.streak.total_xp || 0;

    // Update weekly comparison
    document.getElementById('thisWeekWorkouts').textContent = currentStats.thisWeek.checkins || 0;
    document.getElementById('thisWeekXP').textContent = currentStats.thisWeek.xp || 0;
    document.getElementById('lastWeekWorkouts').textContent = currentStats.lastWeek.checkins || 0;
    document.getElementById('lastWeekXP').textContent = currentStats.lastWeek.xp || 0;

    // Update today's status
    updateTodayStatus();
}

// Update today's check-in status
function updateTodayStatus() {
    const statusContainer = document.getElementById('todayStatus');
    
    if (todayCheckin) {
        const statusClass = todayCheckin.status === 'went' ? 'status-went' : 'status-going';
        const statusText = todayCheckin.status === 'went' ? 
            '✅ You completed your workout today!' : 
            '🎯 You\'re planning to workout today!';
        
        statusContainer.innerHTML = `
            <div class="status-display ${statusClass}">
                ${statusText}
                <br><small>+${todayCheckin.xp || 0} XP earned</small>
            </div>
        `;
    } else {
        statusContainer.innerHTML = `
            <div class="status-display" style="background: #fff3cd; color: #856404;">
                📝 No check-in for today yet. How's your workout going?
            </div>
        `;
    }
}

// Handle check-in
async function checkin(status) {
    try {
        // Disable buttons during request
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => btn.disabled = true);

        const response = await fetch('/api/checkins', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status })
        });

        if (!response.ok) {
            throw new Error('Failed to submit check-in');
        }

        const result = await response.json();
        
        if (result.success) {
            // Update local state
            todayCheckin = result.checkin;
            
            // Show success message
            showSuccess(status === 'went' ? 
                'Great job! Workout completed! 🎉' : 
                'Awesome! You\'re committed to working out today! 💪');
            
            // Reload dashboard to get updated stats
            await loadDashboard();
        } else {
            throw new Error('Check-in was not successful');
        }
    } catch (error) {
        console.error('Error submitting check-in:', error);
        showError('Failed to submit check-in. Please try again.');
    } finally {
        // Re-enable buttons
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(btn => btn.disabled = false);
    }
}

// Show success message
function showSuccess(message) {
    const alert = document.createElement('div');
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #d4edda;
        color: #155724;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        max-width: 300px;
    `;
    alert.textContent = message;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 3000);
}

// Show error message
function showError(message) {
    const alert = document.createElement('div');
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #f8d7da;
        color: #721c24;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        max-width: 300px;
    `;
    alert.textContent = message;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Utility function to format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Auto-refresh dashboard every 5 minutes
setInterval(loadDashboard, 5 * 60 * 1000);