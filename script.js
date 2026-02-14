document.addEventListener('DOMContentLoaded', () => {
    const noBtn = document.getElementById('noBtn');
    const yesBtn = document.getElementById('yesBtn');
    const page1 = document.getElementById('page1');
    const page2 = document.getElementById('page2');

    let noCount = 0;

    const moveNoButton = () => {
        noCount++;

        if (noCount >= 5) {
            alert('Why are you trying to reject me Baby?');
            noBtn.style.display = 'none';
            return;
        }

        const margin = 50;
        const maxX = window.innerWidth - noBtn.offsetWidth - margin;
        const maxY = window.innerHeight - noBtn.offsetHeight - margin;

        const x = Math.max(margin, Math.random() * maxX);
        const y = Math.max(margin, Math.random() * maxY);

        noBtn.style.position = 'fixed';
        noBtn.style.left = `${x}px`;
        noBtn.style.top = `${y}px`;
        noBtn.style.zIndex = '1000';
    };

    // Move No button on mouse enter (Desktop)
    noBtn.addEventListener('mouseenter', moveNoButton);

    // Move No button on touch start (Mobile) - prevents clicking/touching
    noBtn.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent accidental click after touch
        moveNoButton();
    });

    // Handle Yes button click
    yesBtn.addEventListener('click', () => {
        page1.classList.add('hidden');
        page2.classList.remove('hidden');
        createConfetti();
    });

    // Add some floating hearts for aesthetics
    function createFloatingHeart() {
        const heart = document.createElement('div');
        heart.classList.add('floating-heart');
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
        heart.style.animationDuration = (Math.random() * 3 + 2) + 's';
        document.body.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 5000);
    }

    setInterval(createFloatingHeart, 500);

    function createConfetti() {
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('floating-heart');
            confetti.innerHTML = '❤️';
            confetti.style.left = '50vw';
            confetti.style.top = '50vh';

            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * 10 + 5;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;

            confetti.style.position = 'fixed';
            confetti.style.transition = 'all 1s ease-out';
            document.body.appendChild(confetti);

            requestAnimationFrame(() => {
                confetti.style.transform = `translate(${vx * 50}px, ${vy * 50}px)`;
                confetti.style.opacity = '0';
            });

            setTimeout(() => confetti.remove(), 1000);
        }
    }
});
