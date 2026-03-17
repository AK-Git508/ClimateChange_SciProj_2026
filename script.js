const graphData = {
    1: {
        title: 'Global Temperature Spike',
        src: 'graph_1.png',
        alt: 'Graph showing global temperature changes over time',
        caption: 'Global surface temperatures were stable until the late 1800s, then rose +1.0°C since 1970.',
    },
    2: {
        title: 'Greenhouse Gas Concentrations',
        src: 'graph_2.jpg',
        alt: 'Graph showing 2,000 years of greenhouse gas concentrations.',
        caption: 'CO₂, methane, and nitrous oxide remained stable for centuries, then spiked sharply with industrialization.',
    },
    3: {
        title: '800,000 Years of CO2',
        src: 'graph_3.png',
        alt: 'Graph showing CO₂ over 800,000 years.',
        caption: 'CO₂ levels never exceeded ~300 ppm until the last 150 years, now at 422.8 ppm.',
    },
};

const modal = document.getElementById('graphModal');
const modalTitle = document.getElementById('modalTitle');
const modalImage = document.getElementById('modalImage');
const modalCaption = document.getElementById('modalCaption');
let currentGraphId = null;

function scrollToEvidence() {
    document.getElementById('evidence').scrollIntoView({ behavior: 'smooth' });
}

function openGraphModal(id) {
    const graph = graphData[id];
    if (!graph) return;

    currentGraphId = id;
    modalTitle.textContent = graph.title;
    modalImage.src = graph.src;
    modalImage.alt = graph.alt;
    modalCaption.textContent = graph.caption;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
}

function toggleDetails(id) {
    const details = document.getElementById(`details-${id}`);
    if (!details) return;
    details.classList.toggle('hidden');
}

function toggleMobileNav() {
    const nav = document.getElementById('navLinks');
    if (!nav) return;
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
}

function toggleTheme() {
    const isLight = document.body.classList.toggle('light-theme');
    const button = document.getElementById('themeToggle');
    if (button) button.textContent = isLight ? '☀️' : '🌙';
    localStorage.setItem('climateTheme', isLight ? 'light' : 'dark');
}

function applyStoredTheme() {
    const stored = localStorage.getItem('climateTheme');
    if (stored === 'light') {
        document.body.classList.add('light-theme');
        const button = document.getElementById('themeToggle');
        if (button) button.textContent = '☀️';
    }
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateScrollButton() {
    const btn = document.getElementById('scrollTopBtn');
    if (!btn) return;
    if (window.scrollY > window.innerHeight / 2) {
        btn.classList.add('visible');
    } else {
        btn.classList.remove('visible');
    }
}

function openSources() {
    const sources = [
        'NASA GISS Surface Temperature Analysis',
        'NOAA Global Climate Report',
        'IPCC Assessment Reports',
        'Mauna Loa CO₂ Measurements',
    ];
    const list = sources.map(s => `• ${s}`).join('\n');
    prompt(`Data Sources:\n\n${list}`, '_blank');
}

function downloadGraph() {
    if (!currentGraphId) return;
    const graph = graphData[currentGraphId];
    if (!graph) return;

    const link = document.createElement('a');
    link.href = graph.src;
    link.download = graph.src.split('/').pop();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function shareGraph() {
    if (!currentGraphId) return;
    const graph = graphData[currentGraphId];
    if (!graph) return;

    if (navigator.share) {
        navigator.share({
            title: graph.title,
            text: graph.caption,
            url: window.location.href,
        }).catch(() => {});
    } else {
        alert('Sharing is not supported on this device. Copy the URL to share.');
    }
}

window.addEventListener('scroll', updateScrollButton);
window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
});

applyStoredTheme();

// Card Sort Activity Data
const causesData = [
    { text: "Burning fossil fuels for energy and transport", correctRank: 1 },
    { text: "Agriculture and livestock farming (methane emissions)", correctRank: 2 },
    { text: "Deforestation and land use change", correctRank: 3 },
    { text: "Industrial processes and manufacturing", correctRank: 4 },
    { text: "Waste management and landfills", correctRank: 5 },
    { text: "Cement production", correctRank: 6 },
    { text: "Fluorinated gases from refrigeration and air conditioning", correctRank: 7 },
    { text: "Aviation and shipping", correctRank: 8 },
    { text: "Mining and fossil fuel extraction", correctRank: 9 },
    { text: "Other human activities (e.g., construction, electronics)", correctRank: 10 }
];

let shuffledCauses = [];
let draggedElement = null;

// Initialize card sort on page load
document.addEventListener('DOMContentLoaded', () => {
    shuffleCards();
});

// Shuffle and display cards
function shuffleCards() {
    shuffledCauses = [...causesData].sort(() => Math.random() - 0.5);
    renderCards();
    clearSlots();
    hideResults();
}

function renderCards() {
    const cardPool = document.getElementById('cardPool');
    cardPool.innerHTML = '';

    shuffledCauses.forEach((cause, index) => {
        const card = document.createElement('div');
        card.className = 'sort-card';
        card.draggable = true;
        card.dataset.index = index;
        card.textContent = cause.text;

        card.addEventListener('dragstart', handleDragStart);
        card.addEventListener('dragend', handleDragEnd);

        cardPool.appendChild(card);
    });
}

function clearSlots() {
    const slots = document.querySelectorAll('.slot');
    slots.forEach(slot => {
        slot.innerHTML = slot.dataset.rank;
        slot.classList.remove('occupied');
    });
}

function hideResults() {
    document.getElementById('results').classList.add('hidden');
}

// Drag and Drop Handlers
function handleDragStart(e) {
    draggedElement = e.target;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    draggedElement = null;
}

// Slot drop handlers
document.addEventListener('DOMContentLoaded', () => {
    const slots = document.querySelectorAll('.slot');
    slots.forEach(slot => {
        slot.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
        });

        slot.addEventListener('drop', handleDrop);
    });
});

function handleDrop(e) {
    e.preventDefault();
    if (!draggedElement) return;

    const slot = e.target.closest('.slot');
    if (!slot || slot.classList.contains('occupied')) return;

    // Remove from current position
    if (draggedElement.parentElement) {
        draggedElement.parentElement.removeChild(draggedElement);
    }

    // Add to slot
    slot.innerHTML = '';
    slot.appendChild(draggedElement);
    slot.classList.add('occupied');
}

// Check answers
function checkAnswers() {
    const slots = document.querySelectorAll('.slot');
    let correctCount = 0;
    const results = [];

    slots.forEach((slot, index) => {
        const rank = parseInt(slot.dataset.rank);
        const card = slot.querySelector('.sort-card');
        let isCorrect = false;

        if (card) {
            const causeIndex = parseInt(card.dataset.index);
            const cause = shuffledCauses[causeIndex];
            isCorrect = cause.correctRank === rank;
            if (isCorrect) correctCount++;
        }

        results.push({
            rank,
            text: card ? card.textContent : 'Empty',
            isCorrect
        });
    });

    displayResults(correctCount, results);
}

function displayResults(correctCount, results) {
    const resultsDiv = document.getElementById('results');
    const scoreText = document.getElementById('scoreText');
    const correctOrder = document.getElementById('correctOrder');

    scoreText.textContent = `You got ${correctCount} out of 10 correct!`;

    correctOrder.innerHTML = '';
    results.forEach(result => {
        const item = document.createElement('div');
        item.className = `correct-item ${result.isCorrect ? 'correct' : 'incorrect'}`;
        item.innerHTML = `
            <span class="rank-number">${result.rank}</span>
            <span>${result.text}</span>
            <span>${result.isCorrect ? '✓' : '✗'}</span>
        `;
        correctOrder.appendChild(item);
    });

    resultsDiv.classList.remove('hidden');
    resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

// Reset activity
function resetActivity() {
    shuffleCards();
}