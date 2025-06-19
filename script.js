document.addEventListener('DOMContentLoaded', () => {
    let countdownInterval; // ✅ Fix: Declare interval variable

    const birthdayCards = document.querySelectorAll('.birthday-card');
    const countdownSection = document.getElementById('countdown-section');
    const birthdayCardsContainer = document.querySelector('.birthday-cards-container');
    const mainHeader = document.querySelector('.main-header'); 

    // Easter Egg Elements
    const easterEgg = document.getElementById('easter-egg');
    const easterEggPopup = document.getElementById('easter-egg-popup');
    const closePopup = document.getElementById('close-popup');
    const easterEggVideo = easterEggPopup.querySelector('video');

    // Easter Egg Click Handler
    easterEgg.addEventListener('click', () => {
        easterEggPopup.classList.remove('hidden');
        easterEggVideo.play();
    });

    // Close Popup Handler
    closePopup.addEventListener('click', () => {
        easterEggPopup.classList.add('hidden');
        easterEggVideo.pause();
        easterEggVideo.currentTime = 0;
    });

    // Close popup when clicking outside the video
    easterEggPopup.addEventListener('click', (e) => {
        if (e.target === easterEggPopup) {
            easterEggPopup.classList.add('hidden');
            easterEggVideo.pause();
            easterEggVideo.currentTime = 0;
        }
    });

    const daysSpan = document.getElementById('days');
    const hoursSpan = document.getElementById('hours');
    const minutesSpan = document.getElementById('minutes');
    const secondsSpan = document.getElementById('seconds');

    const backgroundMusic = document.getElementById('background-music');

    // Close cards if clicking outside
    document.body.addEventListener('click', (event) => {
        if (!event.target.closest('.birthday-card')) {
            deactivateAllActiveElements();
        }
    });

    // Set target date
    const targetDate = new Date(2025, 5, 20, 0, 0, 0); // June 20, 2025

    // Set initial volume
    if (backgroundMusic) {
        backgroundMusic.volume = 0.5;
    }

    // Attempt to play music after interaction
    let musicStarted = false;
    function tryPlayBackgroundMusic() {
        if (backgroundMusic && !musicStarted) {
            backgroundMusic.play().then(() => {
                musicStarted = true;
                document.body.removeEventListener('click', tryPlayBackgroundMusic);
                document.body.removeEventListener('touchstart', tryPlayBackgroundMusic);
            }).catch(error => {
                console.warn("Music autoplay failed:", error);
            });
        }
    }

    document.body.addEventListener('click', tryPlayBackgroundMusic);
    document.body.addEventListener('touchstart', tryPlayBackgroundMusic);

    // Hide all cards
    function deactivateAllActiveElements() {
        birthdayCards.forEach(c => {
            c.classList.remove('active');
            const video = c.querySelector('video');
            if (video && video.tagName === 'VIDEO') {
                video.pause();
                video.currentTime = 0;
            }
        });
    }

    // Switch to message view
    function switchToMessageMode() {
        countdownSection.classList.add('hidden');
        if (mainHeader) mainHeader.classList.remove('hidden');
        if (birthdayCardsContainer) birthdayCardsContainer.classList.remove('hidden');

        if (backgroundMusic) {
            backgroundMusic.src = "music/bg_birthday.mp3";
            backgroundMusic.volume = 0.2;
            backgroundMusic.load();
            backgroundMusic.play().catch(error => {
                console.warn("Birthday music failed to autoplay:", error);
            });
        }
    }

    // Countdown logic
    function updateCountdown() {
        const currentTime = new Date().getTime();
        const timeLeft = targetDate.getTime() - currentTime;

        if (timeLeft <= 0) {
            switchToMessageMode();
            if (countdownInterval) {
                clearInterval(countdownInterval);
            }
        } else {
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

            daysSpan.textContent = String(days).padStart(2, '0');
            hoursSpan.textContent = String(hours).padStart(2, '0');
            minutesSpan.textContent = String(minutes).padStart(2, '0');
            secondsSpan.textContent = String(seconds).padStart(2, '0');
        }
    }

    // Initialize
    updateCountdown();

    if (targetDate.getTime() > new Date().getTime()) {
        countdownInterval = setInterval(updateCountdown, 1000);
    } else {
        switchToMessageMode();
    }

    // Card click logic
    if (birthdayCardsContainer) {
        birthdayCards.forEach(card => {
            card.addEventListener('click', () => {
                if (!birthdayCardsContainer.classList.contains('hidden')) {
                    const wasActive = card.classList.contains('active');
                    deactivateAllActiveElements();
                    if (!wasActive) {
                        card.classList.add('active');
                        const video = card.querySelector('video');
                        if (video && video.tagName === 'VIDEO') {
                            video.volume = 0.5;
                            video.play();
                        }
                    }
                }
            });
        });
    }

    // Wiggle animation
    setInterval(() => {
        if (easterEgg) {
            easterEgg.classList.add('wiggle');
            setTimeout(() => {
                easterEgg.classList.remove('wiggle');
            }, 600);
        }
    }, 5000);
});
