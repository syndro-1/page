const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedY = Math.random() * 0.6 + 0.2;
    this.hue = 180 + Math.random() * 30;
  }
  update() {
    this.y += this.speedY;
    if (this.y > canvas.height) this.y = 0;
  }
  draw() {
    ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, 0.6)`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}
for (let i = 0; i < 70; i++) particles.push(new Particle());

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

window.addEventListener('scroll', () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  document.querySelector('.scroll-progress').style.width = scrolled + '%';
});

const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('active');
  });
}, { threshold: 0.1 });
reveals.forEach(el => observer.observe(el));

const challenges = [
  {title: "Graph grief", file: "CTF/Nite2025/GraphGrief", flag: "nite{Th3_Qu4ntum_****}", type: "web"},
  {title: "Database Reincursion", file: "CTF/Nite2025/DatabaseReincursion", flag: "nite{neVeR_9Onn4_****}", type: "web"},
  {title: "Connection Tester", file: "CTF/PatriotCTF2025/Web/ConnectionTester", flag: "PCTF{C0nnection_****}", type: "web"},
  {title: "Feedback Fallout", file: "CTF/PatriotCTF2025/Web/FeedbackFallout", flag: "PCTF{SQLI_****}", type: "web"},
  {title: "Secure Auth", file: "CTF/PatriotCTF2025/Web/SecureAuth", flag: "PCTF{cant_****}", type: "web"},
  {title: "Trust Fall", file: "CTF/PatriotCTF2025/Web/TrustFall", flag: "PCTF{auth_****}", type: "web"},
  {title: "Trust Vault", file: "CTF/PatriotCTF2025/Web/TrustVault", flag: "FLAG{py7h0n_****}", type: "web"},
  {title: "Reverse Metadata Part 1", file: "CTF/PatriotCTF2025/Misc/ReverseMetaData1", flag: "MASONCC{images_****}", type: "misc"},
  {title: "Reverse Metadata Part 2", file: "CTF/PatriotCTF2025/Misc/ReverseMetaData2", flag: "PCTF{hidden_****}", type: "misc"}
];

// My CTFs
const myCTFs = [
  {
    name: "PatriotCTF 2025",
    solves: "7+ solves",
    status: "Ended",
    link: "CTF/PatriotCTF2025/patriotctf2025"
  },
  {
    name: "NiteCTF 2025",
    solves: "2 solves",
    status: "Ended",
    link: "CTF/Nite2025/Nite2025.html"
  }
];

function populateMyCTFs() {
  const ctfGrid = document.getElementById("ctfGrid");
  ctfGrid.innerHTML = myCTFs.map(ctf => `
    <div class="ctf-card" onclick="location.href='${ctf.link}'">
      <h3>${ctf.name}</h3>
      <p>${ctf.solves}</p>
      <p class="status">${ctf.status}</p>
    </div>
  `).join('');
}

function updateCategoryStats() {
  const solved = { web: 0, misc: 0, crypto: 0, pwn: 0, forensics: 0 };
  challenges.forEach(c => { if (solved.hasOwnProperty(c.type)) solved[c.type]++; });

  const container = document.getElementById('category-badges');
  container.innerHTML = '';
  const cats = [
    {type: 'web', label: 'WEB'},
    {type: 'misc', label: 'MISC'},
    {type: 'crypto', label: 'CRYPTO'},
    {type: 'pwn', label: 'PWN'},
    {type: 'forensics', label: 'FORENSICS'}
  ];
  cats.forEach((cat, i) => {
    if (solved[cat.type] > 0) {
      setTimeout(() => {
        const badge = document.createElement('div');
        badge.className = `category-badge ${cat.type} visible`;
        badge.textContent = `${cat.label} • ${solved[cat.type]}`;
        container.appendChild(badge);
      }, i * 150);
    }
  });
}

function populateRecentSolves() {
  const list = document.getElementById('recentSolvesList');
  list.innerHTML = '';
  challenges
    .reverse()
    .slice(-4)
    .reverse()
    .forEach(c => {
      const li = document.createElement('li');
      li.textContent = c.title;
      li.onclick = () => location.href = c.file;
      list.appendChild(li);
    });
}

function renderChallenges(filter = 'all') {
  const container = document.getElementById('challengeCards');
  container.innerHTML = '';
  challenges
    .filter(c => filter === 'all' || c.type === filter)
    .forEach(c => {
      const card = document.createElement('div');
      card.className = 'card reveal';
      card.innerHTML = `
        <div class="category-tag tag-${c.type}">${c.type.toUpperCase()}</div>
        <h3>${c.title}</h3>
        <p class="flag">Flag: <code>${c.flag}</code></p>
        <span style="opacity:0.7">Click for writeup</span>`;
      card.onclick = () => location.href = c.file;
      container.appendChild(card);
    });

  document.querySelectorAll('.reveal:not(.observed)').forEach(el => {
    observer.observe(el);
    el.classList.add('observed');
  });
}

document.querySelectorAll('#challengeTabs .tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('#challengeTabs .tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderChallenges(tab.dataset.cat);
  });
});

document.getElementById('ctfToggle').addEventListener('click', () => {
  document.getElementById('ctfModal').classList.add('open');
});
document.querySelector('.close-modal').addEventListener('click', () => {
  document.getElementById('ctfModal').classList.remove('open');
});
document.getElementById('ctfModal').addEventListener('click', e => {
  if (e.target === e.currentTarget) document.getElementById('ctfModal').classList.remove('open');
});

document.getElementById('themeToggle').addEventListener('click', () => {
  document.documentElement.classList.toggle('light');
  localStorage.theme = document.documentElement.classList.contains('light') ? 'light' : 'dark';
});
if (localStorage.theme === 'light') document.documentElement.classList.add('light');

document.getElementById('searchBar').addEventListener('input', e => {
  const term = e.target.value.toLowerCase();
  document.querySelectorAll('.card').forEach(card => {
    card.style.display = card.textContent.toLowerCase().includes(term) ? 'block' : 'none';
  });
});

function updateClock() {
  const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  document.getElementById('liveClock').textContent = time;
}
updateClock();
setInterval(updateClock, 1000);

// === Web3Forms Inline Submission (No Redirect) ===
document.getElementById('feedbackForm')?.addEventListener('submit', async function(e) {
  e.preventDefault();

  const form = e.target;
  const formMessage = document.getElementById('formMessage');
  const submitBtn = form.querySelector('button[type="submit"]');

  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  const formData = new FormData(form);
  const object = Object.fromEntries(formData);
  const json = JSON.stringify(object);

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: json
    });

    const result = await response.json();

    if (response.status === 200) {
      form.reset();
      formMessage.style.display = 'block';
      formMessage.style.color = '#00ffff';
      formMessage.innerHTML = '<strong>Thank you! ❤️</strong><br>Your message was sent successfully.';
      setTimeout(() => { formMessage.style.display = 'none'; }, 6000);
    } else {
      formMessage.style.display = 'block';
      formMessage.style.color = '#ff6b6b';
      formMessage.textContent = result.message || 'Something went wrong. Please try again.';
    }
  } catch (err) {
    formMessage.style.display = 'block';
    formMessage.style.color = '#ff6b6b';
    formMessage.textContent = 'Connection error. Please try again later.';
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Feedback';
  }
});

window.addEventListener('load', () => {
  renderChallenges();
  updateCategoryStats();
  populateRecentSolves();
  populateMyCTFs();
});
