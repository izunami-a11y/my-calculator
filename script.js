// Time zone configuration
const timezones = {
    'est': { name: 'New York (EST)', offset: -5, id: 'clock-est', offsetId: 'offset-est' },
    'gmt': { name: 'London (GMT)', offset: 0, id: 'clock-gmt', offsetId: 'offset-gmt' },
    'cet': { name: 'Paris (CET)', offset: 1, id: 'clock-cet', offsetId: 'offset-cet' },
    'jst': { name: 'Tokyo (JST)', offset: 9, id: 'clock-jst', offsetId: 'offset-jst' },
    'aedt': { name: 'Sydney (AEDT)', offset: 11, id: 'clock-aedt', offsetId: 'offset-aedt' },
    'gst': { name: 'Dubai (GST)', offset: 4, id: 'clock-gst', offsetId: 'offset-gst' },
    'pst': { name: 'Los Angeles (PST)', offset: -8, id: 'clock-pst', offsetId: 'offset-pst' },
    'sgt': { name: 'Singapore (SGT)', offset: 8, id: 'clock-sgt', offsetId: 'offset-sgt' }
};

// Update all clocks
function updateClocks() {
    const now = new Date();
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;

    // Update preset timezones
    Object.values(timezones).forEach(tz => {
        const tzTime = new Date(utcTime + tz.offset * 3600000);
        const timeString = formatTime(tzTime);
        const offsetString = formatOffset(tz.offset);
        
        document.getElementById(tz.id).textContent = timeString;
        document.getElementById(tz.offsetId).textContent = `UTC ${offsetString}`;
    });

    // Update custom timezones
    updateCustomTimezones(now, utcTime);
}

// Format time as HH:MM:SS
function formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

// Format offset as +HH:MM or -HH:MM
function formatOffset(offset) {
    const sign = offset >= 0 ? '+' : '-';
    const absOffset = Math.abs(offset);
    const hours = String(Math.floor(absOffset)).padStart(2, '0');
    const minutes = String((absOffset % 1) * 60).padStart(2, '0');
    return `${sign}${hours}:${minutes}`;
}

// Update custom timezones
function updateCustomTimezones(now, utcTime) {
    const customContainer = document.getElementById('custom-timezones');
    const customCards = customContainer.querySelectorAll('.custom-clock-card');
    
    customCards.forEach(card => {
        const offset = parseFloat(card.dataset.offset);
        const tzTime = new Date(utcTime + offset * 3600000);
        const timeElement = card.querySelector('.digital-clock');
        const offsetElement = card.querySelector('.timezone-offset');
        
        timeElement.textContent = formatTime(tzTime);
        offsetElement.textContent = `UTC ${formatOffset(offset)}`;
    });
}

// Add custom timezone
function addCustomTimezone() {
    const input = prompt('Enter timezone offset (e.g., +5.5 for India, -6 for CST):');
    
    if (input === null) return; // User cancelled
    
    const offset = parseFloat(input);
    
    if (isNaN(offset) || offset < -12 || offset > 14) {
        alert('Please enter a valid offset between -12 and +14');
        return;
    }

    const customContainer = document.getElementById('custom-timezones');
    const cardId = 'custom-' + Date.now();
    
    const card = document.createElement('div');
    card.className = 'custom-clock-card';
    card.dataset.offset = offset;
    card.dataset.id = cardId;
    
    card.innerHTML = `
        <button class="remove-btn" onclick="removeCustomTimezone('${cardId}')">×</button>
        <div class="timezone-name">Custom Timezone</div>
        <div class="digital-clock">00:00:00</div>
        <div class="timezone-offset">UTC ${formatOffset(offset)}</div>
    `;
    
    customContainer.appendChild(card);
    updateClocks();
}

// Remove custom timezone
function removeCustomTimezone(cardId) {
    const card = document.querySelector(`[data-id="${cardId}"]`);
    if (card) {
        card.remove();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('add-timezone-btn').addEventListener('click', addCustomTimezone);
    updateClocks();
    setInterval(updateClocks, 1000);
});
