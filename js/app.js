/**
 * SAMIM JUNAYET ISTIAQ - MODERN INTERACTIVE PORTFOLIO
 * Features:
 * - Interactive Particle Network Canvas
 * - Role Typing Animation
 * - Interactive Terminal CLI Emulator
 * - Playable Retro Canvas Snake Game (GitHub Commit Edition)
 * - Synthesized 8-Bit Web Audio Sound Effects
 * - Theme Switcher & Storage
 * - Skill & Project Interactive Filters
 * - Contact Form & Toast System
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleBackground();
  initTypingAnimation();
  initTerminal();
  initSnakeGame();
  initFilterTabs();
  initThemeSwitcher();
  initAudioSystem();
  initContactForm();
  initMobileNav();
  initGitHubStats();
});

/* ==========================================================================
   1. INTERACTIVE PARTICLE NETWORK CANVAS
   ========================================================================== */
function initParticleBackground() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 14000), 75);
  const maxDistance = 140;

  const mouse = { x: null, y: null, radius: 150 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.5 ? '#38bdf8' : '#818cf8';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse interactivity
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 3;
          this.y -= (dy / dist) * force * 3;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const opacity = (1 - dist / maxDistance) * 0.25;
          ctx.strokeStyle = `rgba(56, 189, 248, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.shadowBlur = 0;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. ROLE TYPING ANIMATION
   ========================================================================== */
function initTypingAnimation() {
  const target = document.getElementById('typing-role');
  if (!target) return;

  const roles = [
    'Full-Stack Developer 🚀',
    'Flutter & Mobile Architect 📱',
    'Spring Boot & Backend Specialist ⚙️',
    'Angular & Creative UI Builder 💡',
    'Clean Code Advocate ✨'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      target.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      target.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingSpeed = 1800; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400; // Pause before new word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   3. WEB AUDIO SYNTHESIZER (8-Bit Sound Effects)
   ========================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initAudioSystem() {
  const audioBtn = document.getElementById('audio-toggle-btn');

  function getAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      audioBtn.innerHTML = soundEnabled ? '🔊' : '🔇';
      audioBtn.title = soundEnabled ? 'Sound Effects Enabled' : 'Sound Effects Muted';
      showToast(soundEnabled ? '🔊 Sound effects enabled' : '🔇 Sound effects muted');
      if (soundEnabled) playSynthSound('blip');
    });
  }

  // Global sound player
  window.playSynthSound = function(type) {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'blip') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'eat') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.setValueAtTime(600, now + 0.06);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'gameover') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.35);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'start') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.setValueAtTime(390, now + 0.08);
        osc.frequency.setValueAtTime(520, now + 0.16);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now);
        osc.stop(now + 0.25);
      }
    } catch (e) {
      // Audio context might fail before user interaction
    }
  };
}

/* ==========================================================================
   4. INTERACTIVE TERMINAL CLI EMULATOR
   ========================================================================== */
function initTerminal() {
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  const terminalBody = document.getElementById('terminal-body');
  const chipButtons = document.querySelectorAll('.chip-btn');

  if (!input || !output) return;

  const commandHistory = [];
  let historyIndex = -1;

  const COMMANDS = {
    help: `Available commands:
  • \x1b[36mabout\x1b[0m       - Learn about Junayet
  • \x1b[36mskills\x1b[0m      - List technical proficiencies
  • \x1b[36mprojects\x1b[0m    - Discover highlighted creations
  • \x1b[36msnake\x1b[0m       - Jump to interactive Snake game
  • \x1b[36mcontact\x1b[0m     - Get communication channels
  • \x1b[36mstats\x1b[0m       - View live profile analytics
  • \x1b[36mtheme\x1b[0m       - Change theme [dark|cyberpunk|light]
  • \x1b[36mhire\x1b[0m        - Why you should hire Junayet!
  • \x1b[36mclear\x1b[0m       - Clear the terminal screen`,

    about: `👨‍💻 Samim Junayet Istiaq
----------------------------------------
Role:     Full-Stack & Mobile Developer
Location: Dhaka, Bangladesh
Motto:    "Simple is Powerful" - in design, code & life.
Focus:    Building high-scalability cross-platform mobile apps 
          (Flutter) and rock-solid enterprise backends (Spring Boot, Node.js).`,

    skills: `🛠️ Technical Stack:
----------------------------------------
• Front-End:  Angular, JavaScript (ES6+), HTML5, CSS3/SCSS, Bootstrap
• Back-End:   Java, Spring Boot, Node.js, Express.js, JSP, REST APIs
• Mobile:     Flutter, Dart, Android SDK
• Databases:  MySQL, PostgreSQL, MongoDB, Firebase
• Tools:      Git, GitHub, VS Code, IntelliJ IDEA, Eclipse, Postman`,

    projects: `🚀 Featured Projects:
----------------------------------------
1. [Flutter]  Tune Tournament - Music & Tournament Mobile App
2. [FullStack] Baby Day Care - Flutter + Angular + Spring Boot
3. [Spring]   Enterprise Microservices & RESTful API Architecture
4. [Web]      junayetjun.github.io - Modern Interactive Portfolio 2.0`,

    snake: `🐍 Launching Snake Game! Use Arrow keys or WASD to eat GitHub commit dots!`,

    stats: `📊 Analytics:
----------------------------------------
• Public Repositories:  19+
• Primary Languages:    Dart, Java, JavaScript, SCSS
• Code Quality:         Clean Architecture & SOLID Principles`,

    hire: `💼 Looking for a dedicated engineer who cares about scalable architecture,
sleek UI/UX, and fast delivery?
Email me at: your-email@example.com or reach out on LinkedIn!`,

    clear: '__CLEAR__'
  };

  function executeCommand(cmd) {
    const rawCmd = cmd.trim();
    if (!rawCmd) return;

    if (window.playSynthSound) window.playSynthSound('blip');

    // Add to history
    commandHistory.push(rawCmd);
    historyIndex = commandHistory.length;

    // Echo input
    const commandRow = document.createElement('div');
    commandRow.className = 'terminal-echo';
    commandRow.innerHTML = `<span class="terminal-prompt">visitor@junayet-portfolio:~$</span> <span>${escapeHtml(rawCmd)}</span>`;
    output.appendChild(commandRow);

    const parts = rawCmd.split(' ');
    const mainCommand = parts[0].toLowerCase();
    const arg = parts[1] ? parts[1].toLowerCase() : '';

    if (mainCommand === 'clear') {
      output.innerHTML = '';
      return;
    }

    if (mainCommand === 'theme') {
      if (['dark', 'cyberpunk', 'light'].includes(arg)) {
        document.documentElement.setAttribute('data-theme', arg);
        localStorage.setItem('portfolio-theme', arg);
        appendOutput(`Theme changed to: ${arg}`);
      } else {
        appendOutput(`Usage: theme [dark | cyberpunk | light]`);
      }
      scrollToBottom();
      return;
    }

    if (mainCommand === 'snake') {
      appendOutput(COMMANDS.snake);
      const snakeSection = document.getElementById('snake-section');
      if (snakeSection) {
        snakeSection.scrollIntoView({ behavior: 'smooth' });
      }
      scrollToBottom();
      return;
    }

    if (mainCommand === 'sudo') {
      appendOutput(`Permission denied: You are already a VIP guest on this portfolio! 😎`);
      scrollToBottom();
      return;
    }

    if (COMMANDS[mainCommand]) {
      appendOutput(COMMANDS[mainCommand]);
    } else {
      appendOutput(`bash: command not found: ${escapeHtml(mainCommand)}. Type 'help' for available commands.`);
    }

    scrollToBottom();
  }

  function appendOutput(text) {
    const responseDiv = document.createElement('div');
    responseDiv.className = 'terminal-response';
    // Format simple color markers if present
    responseDiv.textContent = text.replace(/\\x1b\[\d+m/g, '');
    output.appendChild(responseDiv);
  }

  function scrollToBottom() {
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      executeCommand(input.value);
      input.value = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        input.value = commandHistory[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        input.value = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        input.value = '';
      }
    }
  });

  // Handle quick action chips
  chipButtons.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) {
        input.value = cmd;
        executeCommand(cmd);
        input.value = '';
      }
    });
  });
}

/* ==========================================================================
   5. PLAYABLE CANVAS SNAKE GAME (Commit Edition)
   ========================================================================== */
function initSnakeGame() {
  const canvas = document.getElementById('snake-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const scoreEl = document.getElementById('snake-score');
  const highscoreEl = document.getElementById('snake-highscore');
  const overlay = document.getElementById('game-overlay');
  const startBtn = document.getElementById('start-game-btn');

  // Hub tabs (Game vs SVG)
  const tabGameBtn = document.getElementById('tab-btn-game');
  const tabSvgBtn = document.getElementById('tab-btn-svg');
  const gameView = document.getElementById('snake-game-view');
  const svgView = document.getElementById('snake-svg-view');

  if (tabGameBtn && tabSvgBtn) {
    tabGameBtn.addEventListener('click', () => {
      tabGameBtn.classList.add('active');
      tabSvgBtn.classList.remove('active');
      gameView.style.display = 'flex';
      svgView.style.display = 'none';
      if (window.playSynthSound) window.playSynthSound('blip');
    });

    tabSvgBtn.addEventListener('click', () => {
      tabSvgBtn.classList.add('active');
      tabGameBtn.classList.remove('active');
      svgView.style.display = 'flex';
      gameView.style.display = 'none';
      if (window.playSynthSound) window.playSynthSound('blip');
    });
  }

  const GRID_SIZE = 20;
  const TILE_COUNT = 24; // 24x24 tiles = 480x480 canvas
  canvas.width = TILE_COUNT * GRID_SIZE;
  canvas.height = TILE_COUNT * GRID_SIZE;

  let snake = [];
  let food = { x: 15, y: 15, level: 3 };
  let dx = 0;
  let dy = 0;
  let nextDx = 0;
  let nextDy = 0;
  let score = 0;
  let highScore = parseInt(localStorage.getItem('snake-high-score') || '0', 10);
  let gameInterval = null;
  let isRunning = false;

  if (highscoreEl) highscoreEl.textContent = highScore;

  // GitHub contribution colors
  const COMMIT_COLORS = [
    '#0e4429', // Level 1
    '#006d32', // Level 2
    '#26a641', // Level 3
    '#39d353'  // Level 4
  ];

  function resetGame() {
    snake = [
      { x: 10, y: 12 },
      { x: 9, y: 12 },
      { x: 8, y: 12 }
    ];
    dx = 1;
    dy = 0;
    nextDx = 1;
    nextDy = 0;
    score = 0;
    if (scoreEl) scoreEl.textContent = score;
    placeFood();
  }

  function placeFood() {
    food = {
      x: Math.floor(Math.random() * TILE_COUNT),
      y: Math.floor(Math.random() * TILE_COUNT),
      level: Math.floor(Math.random() * 4)
    };

    // Don't spawn on snake body
    for (let segment of snake) {
      if (segment.x === food.x && segment.y === food.y) {
        placeFood();
        break;
      }
    }
  }

  function gameStep() {
    dx = nextDx;
    dy = nextDy;

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };

    // Wall collision (wrap around for fun arcade feel)
    if (head.x < 0) head.x = TILE_COUNT - 1;
    if (head.x >= TILE_COUNT) head.x = 0;
    if (head.y < 0) head.y = TILE_COUNT - 1;
    if (head.y >= TILE_COUNT) head.y = 0;

    // Self collision check
    for (let segment of snake) {
      if (segment.x === head.x && segment.y === head.y) {
        gameOver();
        return;
      }
    }

    snake.unshift(head);

    // Eat food
    if (head.x === food.x && head.y === food.y) {
      score += (food.level + 1) * 10;
      if (scoreEl) scoreEl.textContent = score;
      if (window.playSynthSound) window.playSynthSound('eat');

      if (score > highScore) {
        highScore = score;
        localStorage.setItem('snake-high-score', highScore.toString());
        if (highscoreEl) highscoreEl.textContent = highScore;
      }

      placeFood();
    } else {
      snake.pop();
    }

    draw();
  }

  function draw() {
    // Background
    ctx.fillStyle = '#0a0f1d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid lines (subtle GitHub commit grid look)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i < TILE_COUNT; i++) {
      ctx.beginPath();
      ctx.moveTo(i * GRID_SIZE, 0);
      ctx.lineTo(i * GRID_SIZE, canvas.height);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * GRID_SIZE);
      ctx.lineTo(canvas.width, i * GRID_SIZE);
      ctx.stroke();
    }

    // Food (GitHub commit box)
    ctx.fillStyle = COMMIT_COLORS[food.level];
    ctx.shadowBlur = 10;
    ctx.shadowColor = COMMIT_COLORS[food.level];
    ctx.fillRect(food.x * GRID_SIZE + 2, food.y * GRID_SIZE + 2, GRID_SIZE - 4, GRID_SIZE - 4);

    // Snake
    snake.forEach((segment, index) => {
      if (index === 0) {
        // Head
        ctx.fillStyle = '#38bdf8';
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#38bdf8';
      } else {
        // Body gradient
        ctx.fillStyle = '#34d399';
        ctx.shadowBlur = 4;
        ctx.shadowColor = '#34d399';
      }

      ctx.fillRect(segment.x * GRID_SIZE + 1, segment.y * GRID_SIZE + 1, GRID_SIZE - 2, GRID_SIZE - 2);
    });

    ctx.shadowBlur = 0;
  }

  function startGame() {
    resetGame();
    overlay.style.display = 'none';
    isRunning = true;
    if (window.playSynthSound) window.playSynthSound('start');

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameStep, 100);
  }

  function gameOver() {
    isRunning = false;
    clearInterval(gameInterval);
    if (window.playSynthSound) window.playSynthSound('gameover');

    const overlayTitle = overlay.querySelector('.overlay-title');
    const overlaySub = overlay.querySelector('.overlay-sub');
    if (overlayTitle) overlayTitle.textContent = 'Game Over!';
    if (overlaySub) overlaySub.textContent = `Score: ${score} | High Score: ${highScore}`;
    if (startBtn) startBtn.textContent = 'Play Again 🔄';
    overlay.style.display = 'flex';
  }

  if (startBtn) {
    startBtn.addEventListener('click', startGame);
  }

  // Keyboard controls
  window.addEventListener('keydown', (e) => {
    if (!isRunning) return;

    switch (e.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        if (dy !== 1) { nextDx = 0; nextDy = -1; }
        e.preventDefault();
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        if (dy !== -1) { nextDx = 0; nextDy = 1; }
        e.preventDefault();
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        if (dx !== 1) { nextDx = -1; nextDy = 0; }
        e.preventDefault();
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        if (dx !== -1) { nextDx = 1; nextDy = 0; }
        e.preventDefault();
        break;
    }
  });

  // Mobile D-Pad controls
  const dpadUp = document.getElementById('dpad-up');
  const dpadDown = document.getElementById('dpad-down');
  const dpadLeft = document.getElementById('dpad-left');
  const dpadRight = document.getElementById('dpad-right');

  if (dpadUp) dpadUp.addEventListener('click', () => { if (dy !== 1) { nextDx = 0; nextDy = -1; } });
  if (dpadDown) dpadDown.addEventListener('click', () => { if (dy !== -1) { nextDx = 0; nextDy = 1; } });
  if (dpadLeft) dpadLeft.addEventListener('click', () => { if (dx !== 1) { nextDx = -1; nextDy = 0; } });
  if (dpadRight) dpadRight.addEventListener('click', () => { if (dx !== -1) { nextDx = 1; nextDy = 0; } });

  // Initial draw
  resetGame();
  draw();
}

/* ==========================================================================
   6. FILTER TABS (Skills & Projects)
   ========================================================================== */
function initFilterTabs() {
  // Skills filter
  const skillFilterBtns = document.querySelectorAll('[data-skill-filter]');
  const skillCards = document.querySelectorAll('.skill-card');

  skillFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      skillFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-skill-filter');

      skillCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
      if (window.playSynthSound) window.playSynthSound('blip');
    });
  });

  // Projects filter
  const projectFilterBtns = document.querySelectorAll('[data-proj-filter]');
  const projectCards = document.querySelectorAll('.project-card');

  projectFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      projectFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-proj-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
      if (window.playSynthSound) window.playSynthSound('blip');
    });
  });
}

/* ==========================================================================
   7. THEME SWITCHER
   ========================================================================== */
function initThemeSwitcher() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  const themes = ['dark', 'cyberpunk', 'light'];

  // Load saved theme
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextIndex = (themes.indexOf(current) + 1) % themes.length;
      const nextTheme = themes[nextIndex];

      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('portfolio-theme', nextTheme);

      if (window.playSynthSound) window.playSynthSound('blip');
      showToast(`🎨 Theme switched to: ${nextTheme.toUpperCase()}`);
    });
  }
}

/* ==========================================================================
   8. CONTACT FORM & INTERACTIVE ACTIONS
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const copyEmailBtn = document.getElementById('copy-email-btn');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      if (!name || !email || !message) {
        showToast('⚠️ Please fill in all fields.');
        return;
      }

      if (window.playSynthSound) window.playSynthSound('eat');
      showToast(`🚀 Thank you, ${name}! Your message has been prepared.`);

      // Launch mailto
      const mailtoLink = `mailto:your-email@example.com?subject=Portfolio Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent(message + '\n\nSender Email: ' + email)}`;
      window.location.href = mailtoLink;

      form.reset();
    });
  }

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText('your-email@example.com').then(() => {
        showToast('📋 Email copied to clipboard!');
        if (window.playSynthSound) window.playSynthSound('blip');
      }).catch(() => {
        showToast('Email: your-email@example.com');
      });
    });
  }
}

/* ==========================================================================
   9. MOBILE NAVIGATION TOGGLE
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      toggleBtn.textContent = navMenu.classList.contains('open') ? '✕' : '☰';
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        toggleBtn.textContent = '☰';
      });
    });
  }
}

/* ==========================================================================
   10. GITHUB LIVE STATS INTEGRATION
   ========================================================================== */
function initGitHubStats() {
  const repoCountEl = document.getElementById('stat-repos-count');
  
  // Asynchronously fetch live GitHub user stats
  fetch('https://api.github.com/users/junayetjun')
    .then(res => {
      if (!res.ok) throw new Error('API limit');
      return res.json();
    })
    .then(data => {
      if (repoCountEl && data.public_repos !== undefined) {
        repoCountEl.textContent = `${data.public_repos}+`;
      }
    })
    .catch(() => {
      // Fallback
      if (repoCountEl) repoCountEl.textContent = '19+';
    });
}

/* ==========================================================================
   TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
