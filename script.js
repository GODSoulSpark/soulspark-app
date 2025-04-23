let healthPoints = localStorage.getItem('healthPoints') ? parseInt(localStorage.getItem('healthPoints')) : 0;
let moodHistory = localStorage.getItem('moodHistory') ? JSON.parse(localStorage.getItem('moodHistory')) : [];
let gardenItems = localStorage.getItem('gardenItems') ? JSON.parse(localStorage.getItem('gardenItems')) : [];
let dailyProgress = localStorage.getItem('dailyProgress') ? JSON.parse(localStorage.getItem('dailyProgress')) : [];

document.getElementById('health-points').textContent = healthPoints;
updateMoodHistory();

// Check if background images load
const backgrounds = [
    { id: 'home', file: 'soulspark_start_page.png' },
    { id: 'garden', file: 'soulspark_garden_page.png' },
    { id: 'mood', file: 'soulspark_mood_page.png' },
    { id: 'feed', file: 'soulspark_feed_page.png' },
    { id: 'calendar', file: 'soulspark_calendar_page.png' }
];

backgrounds.forEach(bg => {
    const img = new Image();
    img.src = bg.file;
    img.onload = () => console.log(`Background image for ${bg.id} (${bg.file}) loaded successfully`);
    img.onerror = () => {
        alert(`Error: Could not load ${bg.file} for the ${bg.id} page. Ensure it’s in the same folder as index.html, named exactly "${bg.file}" (case-sensitive), and is a valid PNG file.`);
        console.error(`Background image (${bg.file}) failed to load for ${bg.id} page. Check file path, name, and format.`);
    };
});

// Particle Animation
const particleCanvas = document.getElementById('particle-canvas');
const particleCtx = particleCanvas.getContext('2d');
particleCanvas.width = window.innerWidth;
particleCanvas.height = window.innerHeight;

const particles = [];
for (let i = 0; i < 8; i++) {
    particles.push({
        x: Math.random() * particleCanvas.width,
        y: particleCanvas.height,
        radius: Math.random() * 3 + 2,
        speed: Math.random() * 1 + 0.5,
        opacity: Math.random() * 0.5 + 0.3
    });
}

function animateParticles() {
    particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    particles.forEach(particle => {
        particle.y -= particle.speed;
        particle.opacity -= 0.005;
        if (particle.opacity <= 0) return;

        particleCtx.beginPath();
        particleCtx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        particleCtx.fillStyle = `rgba(255, 215, 0, ${particle.opacity})`;
        particleCtx.fill();
    });

    if (particles.some(p => p.opacity > 0)) {
        requestAnimationFrame(animateParticles);
    }
}

// Lists of Sparks
const physicalSparks = [
    "Drink 8 glasses of water",
    "Take a 10-minute walk",
    "Do a 5-minute stretch",
    "Eat a piece of fruit",
    "Get 7-8 hours of sleep",
    "Try a new healthy recipe",
    "Do 10 push-ups",
    "Take 10 deep breaths",
    "Go for a 15-minute jog",
    "Dance to your favorite song",
    "Climb stairs for 5 minutes",
    "Do a quick yoga session",
    "Drink a green smoothie",
    "Walk in nature for 20 minutes",
    "Do a 5-minute plank",
    "Cycle for 10 minutes",
    "Jump rope for 3 minutes",
    "Take a cold shower",
    "Do a 10-minute HIIT workout",
    "Stretch your arms and legs",
    "Walk 5,000 steps",
    "Do a 5-minute meditation walk",
    "Try a new sport for 10 minutes",
    "Drink herbal tea",
    "Do 10 squats",
    "Take a 30-minute nap",
    "Practice balancing for 2 minutes",
    "Do a 5-minute core workout",
    "Go for a swim",
    "Walk barefoot on grass",
    "Do a 10-minute bodyweight workout"
];

const soulSparks = [
    "Express gratitude to someone",
    "Meditate for 5 minutes",
    "Write down 3 things you’re thankful for",
    "Listen to calming music",
    "Spend 10 minutes in silence",
    "Reflect on a happy memory",
    "Write a positive affirmation",
    "Practice deep breathing for 5 minutes",
    "Light a candle and relax",
    "Read an inspiring quote",
    "Journal your thoughts for 10 minutes",
    "Forgive someone in your heart",
    "Visualize your dreams for 5 minutes",
    "Say a prayer or set an intention",
    "Compliment a stranger",
    "Watch the sunrise or sunset",
    "Create a small piece of art",
    "Write a letter to your future self",
    "Practice mindfulness for 5 minutes",
    "Share a kind word with a friend",
    "Meditate on a positive word",
    "Reflect on your purpose",
    "Do a random act of kindness",
    "Read a spiritual passage",
    "Sit under the stars for 10 minutes",
    "Express love to someone",
    "List 5 things you love about yourself",
    "Chant a mantra for 5 minutes",
    "Recall a moment of joy",
    "Practice self-compassion",
    "Smile at yourself in the mirror"
];

// Function to get today's Sparks
function getDailySparks() {
    const today = new Date().toLocaleDateString();
    let storedSparks = localStorage.getItem('dailySparks');
    let dailySparks = storedSparks ? JSON.parse(storedSparks) : null;

    // Check if we need to update the Sparks for a new day
    if (!dailySparks || dailySparks.date !== today) {
        const dayOfMonth = new Date().getDate(); // 1 to 31
        const physicalIndex = (dayOfMonth - 1) % physicalSparks.length;
        const soulIndex = (dayOfMonth - 1) % soulSparks.length;

        dailySparks = {
            date: today,
            physical: physicalSparks[physicalIndex],
            soul: soulSparks[soulIndex]
        };

        localStorage.setItem('dailySparks', JSON.stringify(dailySparks));
    }

    return dailySparks;
}

// Function to update the Spark display
function updateSparkDisplay() {
    const dailySparks = getDailySparks();
    document.getElementById('physical-spark-text').textContent = dailySparks.physical;
    document.getElementById('soul-spark-text').textContent = dailySparks.soul;
}

// Show/hide pages
function showPage(pageId) {
    try {
        // Ensure all pages are hidden
        document.querySelectorAll('.page').forEach(page => {
            page.style.display = 'none';
            page.style.background = ''; // Reset background to avoid conflicts
        });

        // Show the selected page
        const pageElement = document.getElementById(pageId);
        if (!pageElement) {
            throw new Error(`Page with ID ${pageId} not found`);
        }
        pageElement.style.display = 'block';

        // Page-specific actions
        if (pageId === 'garden') drawGarden();
        if (pageId === 'calendar') renderCalendar();
        if (pageId === 'home') {
            animateParticles();
            updateSparkDisplay(); // Update Sparks when showing the Home page
        }

        // Update navigation buttons
        document.querySelectorAll('nav button').forEach(button => button.classList.remove('active'));
        const navButton = document.getElementById(`nav-${pageId}`);
        if (navButton) {
            navButton.classList.add('active');
        }
    } catch (error) {
        console.error('Error in showPage:', error);
        alert('An error occurred while loading the page. Please check the console for details.');
    }
}

// Complete a Spark
function completeSpark(type) {
    healthPoints += 10;
    document.getElementById('health-points').textContent = healthPoints;
    localStorage.setItem('healthPoints', healthPoints);

    gardenItems.push({
        type: type,
        x: Math.random() * 280,
        y: Math.random() * 280,
        size: type === 'physical' ? 15 : 10
    });
    localStorage.setItem('gardenItems', JSON.stringify(gardenItems));

    const feed = document.getElementById('spark-feed');
    const li = document.createElement('li');
    const dailySparks = getDailySparks();
    const sparkText = type === 'physical' ? dailySparks.physical : dailySparks.soul;
    li.textContent = `You completed a ${type.charAt(0).toUpperCase() + type.slice(1)} Spark: ${sparkText}!`;
    feed.prepend(li);

    // Track daily progress
    const today = new Date().toLocaleDateString();
    let todayProgress = dailyProgress.find(entry => entry.date === today);
    if (!todayProgress) {
        todayProgress = { date: today, physical: false, soul: false, mood: false };
        dailyProgress.push(todayProgress);
    }
    todayProgress[type] = true;
    localStorage.setItem('dailyProgress', JSON.stringify(dailyProgress));

    alert(`Great job! Your ${type} health grows.`);
}

// Draw Dual Growth Garden
function drawGarden() {
    const canvas = document.getElementById('garden-canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#a5d6a7';
    ctx.fillRect(0, 200, canvas.width, 100);

    gardenItems.forEach(item => {
        if (item.type === 'physical') {
            ctx.fillStyle = '#388e3c';
            ctx.beginPath();
            ctx.arc(item.x, item.y, item.size, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.fillStyle = '#ffd700';
            ctx.beginPath();
            ctx.moveTo(item.x, item.y - item.size);
            for (let i = 0; i < 5; i++) {
                ctx.lineTo(
                    item.x + item.size * Math.cos((18 + i * 72) * Math.PI / 180),
                    item.y + item.size * Math.sin((18 + i * 72) * Math.PI / 180)
                );
                ctx.lineTo(
                    item.x + (item.size / 2) * Math.cos((54 + i * 72) * Math.PI / 180),
                    item.y + (item.size / 2) * Math.sin((54 + i * 72) * Math.PI / 180)
                );
            }
            ctx.closePath();
            ctx.fill();
        }
    });
}

// Log Mood
function logMood() {
    const physicalMood = document.getElementById('physical-mood').value;
    const soulMood = document.getElementById('soul-mood').value;
    const today = new Date().toLocaleDateString();
    moodHistory.push({
        physical: physicalMood,
        soul: soulMood,
        date: today
    });
    localStorage.setItem('moodHistory', JSON.stringify(moodHistory));

    // Track daily progress
    let todayProgress = dailyProgress.find(entry => entry.date === today);
    if (!todayProgress) {
        todayProgress = { date: today, physical: false, soul: false, mood: false };
        dailyProgress.push(todayProgress);
    }
    todayProgress.mood = true;
    localStorage.setItem('dailyProgress', JSON.stringify(dailyProgress));

    updateMoodHistory();
}

function updateMoodHistory() {
    const history = document.getElementById('mood-history');
    history.innerHTML = '<h3>Your Holistic Moods</h3>';
    moodHistory.forEach(entry => {
        history.innerHTML += `<p>${entry.date}: Physical - ${entry.physical}, Soul - ${entry.soul}</p>`;
    });
}

// Calendar Logic
let currentDate = new Date();

function renderCalendar() {
    try {
        const month = currentDate.getMonth();
        const year = currentDate.getFullYear();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        const todayStr = today.toLocaleDateString();

        // Update month header
        const monthHeader = document.getElementById('calendar-month');
        if (!monthHeader) {
            throw new Error('Calendar month header not found');
        }
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        monthHeader.textContent = `${monthNames[month]} ${year}`;

        // Generate calendar grid
        const calendarGrid = document.getElementById('calendar-grid');
        if (!calendarGrid) {
            throw new Error('Calendar grid element not found');
        }
        calendarGrid.innerHTML = '';

        // Add weekday labels
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        weekdays.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'day empty';
            dayElement.textContent = day;
            calendarGrid.appendChild(dayElement);
        });

        // Add empty days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'day empty';
            calendarGrid.appendChild(emptyDay);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day).toLocaleDateString();
            const progress = dailyProgress.find(entry => entry.date === date) || { physical: false, soul: false, mood: false };
            const isToday = date === todayStr && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();

            const dayElement = document.createElement('div');
            dayElement.className = `day ${isToday ? 'today' : ''}`;
            dayElement.innerHTML = `
                <span>${day}</span>
                <div class="indicators">
                    ${progress.physical ? '<div class="indicator physical"></div>' : ''}
                    ${progress.soul ? '<div class="indicator soul"></div>' : ''}
                    ${progress.mood ? '<div class="indicator mood"></div>' : ''}
                </div>
            `;
            calendarGrid.appendChild(dayElement);
        }
    } catch (error) {
        console.error('Error in renderCalendar:', error);
        alert('An error occurred while rendering the calendar. Please check the console for details.');
    }
}

function changeMonth(offset) {
    currentDate.setMonth(currentDate.getMonth() + offset);
    renderCalendar();
}

// Audio Control
const audio = document.getElementById('background-audio');
const audioToggle = document.getElementById('audio-toggle');
let isAudioPlaying = false;

// Attempt to autoplay audio (muted if necessary)
audio.muted = true; // Start muted to comply with autoplay policies
audio.play().then(() => {
    console.log('Audio autoplay started (muted)');
    isAudioPlaying = true;
    audioToggle.textContent = '🔇 Mute Audio';
    audioToggle.classList.add('playing');
}).catch(error => {
    console.error('Autoplay failed:', error);
    audioToggle.textContent = '🔊 Play Audio';
});

// Unmute audio on first user interaction
document.body.addEventListener('click', function unmuteOnInteraction() {
    if (audio.muted) {
        audio.muted = false;
        audio.play();
        isAudioPlaying = true;
        audioToggle.textContent = '🔇 Mute Audio';
        audioToggle.classList.add('playing');
        console.log('Audio unmuted after user interaction');
    }
    // Remove the event listener after unmuting
    document.body.removeEventListener('click', unmuteOnInteraction);
}, { once: true });

function toggleAudio() {
    if (isAudioPlaying) {
        audio.pause();
        isAudioPlaying = false;
        audioToggle.textContent = '🔊 Play Audio';
        audioToggle.classList.remove('playing');
    } else {
        audio.play();
        isAudioPlaying = true;
        audioToggle.textContent = '🔇 Mute Audio';
        audioToggle.classList.add('playing');
    }
}

// Initialize active page
showPage('home');