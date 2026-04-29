// Reddox Core Logic
document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('redditUsername');
    const subredditInput = document.getElementById('subredditInput');
    const searchBtn = document.getElementById('searchBtn');
    const copyBtn = document.getElementById('copyBtn');
    const optionChips = document.querySelectorAll('.search-options:not(.time-filters) .option-chip');
    const timeChips = document.querySelectorAll('.time-filters .option-chip');
    const resultArea = document.getElementById('result-area');

    let currentMode = 'all';
    let currentTime = 'any';

    // Toggle time modes
    timeChips.forEach(chip => {
        chip.addEventListener('click', () => {
            timeChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentTime = chip.dataset.time;
        });
    });

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

        // Clean subreddit
        let sub = subredditInput.value.trim().replace(/^r\//, '');
        let siteModifier = sub ? `site:reddit.com/r/${sub}` : `site:reddit.com`;
        
        if (!sub && (currentMode === 'posts' || currentMode === 'comments')) {
            siteModifier = `site:reddit.com/r/*`;
        }

        let query = '';
        switch(currentMode) {
            case 'posts':
                query = `${siteModifier} "submitted by ${cleanUser}"`;
                break;
            case 'comments':
                query = `${siteModifier} "${cleanUser}"`;
                break;
            default:
                query = `${siteModifier} "${cleanUser}"`;
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

    const performSearch = (redirectCurrentTab = false) => {
        const username = usernameInput.value;
        const query = getFinalQuery(username);
        
        if (!query) {
            showFeedback('Please enter a username', 'error');
            return;
        }

        addToHistory(username.trim().replace(/^u\//, ''));
        let url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        
        if (currentTime !== 'any') {
            url += `&tbs=${currentTime}`;
        }
        
        if (redirectCurrentTab === true) {
            window.location.href = url;
        } else {
            window.open(url, '_blank');
        }
    };

    const copyToClipboard = () => {
        const username = usernameInput.value;
        const query = getFinalQuery(username);
        
        if (!query) {
            showFeedback('Enter a username first', 'error');
            return;
        }

        // To create a sharable Reddox link instead of a Google link:
        const url = new URL(window.location.href);
        const shareableUrl = `${url.origin}/${encodeURIComponent(username.trim().replace(/^u\//, ''))}`;

        navigator.clipboard.writeText(shareableUrl).then(() => {
            showFeedback('Reddox link copied to clipboard!', 'success');
        }).catch(() => {
            // Fallback for older browsers
            showFeedback('Failed to copy link', 'error');
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

    // Auto-search logic from URL (e.g. reddox.in/0xCynic)
    const path = window.location.pathname.replace(/^\/+/, '');
    const searchParams = new URLSearchParams(window.location.search);
    const hash = window.location.hash.replace(/^#/, '');

    let autoSearchUser = '';
    
    // Priority: Pathname > Query Param > Hash
    // Ignore common paths like index.html
    if (path && !path.includes('.html') && path !== '/') {
        autoSearchUser = path;
    } else if (searchParams.has('u')) {
        autoSearchUser = searchParams.get('u');
    } else if (hash) {
        autoSearchUser = hash;
    }

    if (autoSearchUser) {
        usernameInput.value = decodeURIComponent(autoSearchUser);
        // Automatically perform search
        setTimeout(() => {
            performSearch(true);
        }, 100);
    }
});