// Reddox Core Logic
document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('redditUsername');
    const searchBtn = document.getElementById('searchBtn');
    const copyBtn = document.getElementById('copyBtn');
    const optionChips = document.querySelectorAll('.option-chip');
    const resultArea = document.getElementById('result-area');

    let currentMode = 'all';

    // Toggle search modes
    optionChips.forEach(chip => {
        chip.addEventListener('click', () => {
            optionChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentMode = chip.id.replace('opt-', '');
        });
    });

    const getFinalQuery = (username) => {
        // Clean username (remove u/ if present)
        const cleanUser = username.trim().replace(/^u\//, '');
        if (!cleanUser) return null;

        let query = '';
        switch(currentMode) {
            case 'posts':
                query = `site:reddit.com/r/* "submitted by ${cleanUser}"`;
                break;
            case 'comments':
                query = `site:reddit.com/r/* "${cleanUser}"`;
                break;
            default:
                query = `site:reddit.com "${cleanUser}"`;
        }
        return query;
    };

    const loadHistory = () => {
        const history = JSON.parse(localStorage.getItem('reddoxHistory') || '[]');
        const historyContainer = document.getElementById('history-list');
        if (!historyContainer) return;

        historyContainer.innerHTML = history.map(user => `
            <span class="history-item" onclick="document.getElementById('redditUsername').value='${user}'; document.getElementById('searchBtn').click();">${user}</span>
        `).join('');
    };

    const addToHistory = (user) => {
        let history = JSON.parse(localStorage.getItem('reddoxHistory') || '[]');
        history = [user, ...history.filter(h => h !== user)].slice(0, 5);
        localStorage.setItem('reddoxHistory', JSON.stringify(history));
        loadHistory();
    };

    const performSearch = () => {
        const username = usernameInput.value;
        const query = getFinalQuery(username);
        
        if (!query) {
            showFeedback('Please enter a username', 'error');
            return;
        }

        addToHistory(username.trim().replace(/^u\//, ''));
        const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        window.open(url, '_blank');
    };

    const copyToClipboard = () => {
        const username = usernameInput.value;
        const query = getFinalQuery(username);
        
        if (!query) {
            showFeedback('Enter a username first', 'error');
            return;
        }

        const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        navigator.clipboard.writeText(url).then(() => {
            showFeedback('Link copied to clipboard!', 'success');
        });
    };

    const showFeedback = (message, type) => {
        resultArea.innerHTML = `<p style="color: ${type === 'error' ? '#ff4b2b' : '#4bb543'}; font-size: 0.9rem;">${message}</p>`;
        resultArea.classList.add('visible');
        setTimeout(() => {
            resultArea.classList.remove('visible');
        }, 3000);
    };

    // Event Listeners
    searchBtn.addEventListener('click', performSearch);
    copyBtn.addEventListener('click', copyToClipboard);

    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });

    // Initial load
    loadHistory();
});