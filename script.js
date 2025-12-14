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
  {title: "Connection Tester", file: "CTF/PatriotCTF2025/Web/ConnectionTester", flag: "PCTF{C0nnection_****}", type: "web"},
  {title: "Feedback Fallout", file: "CTF/PatriotCTF2025/Web/FeedbackFallout", flag: "PCTF{SQLI_****}", type: "web"},
  {title: "Secure Auth", file: "CTF/PatriotCTF2025/Web/SecureAuth", flag: "PCTF{cant_****}", type: "web"},
  {title: "Trust Fall", file: "CTF/PatriotCTF2025/Web/TrustFall", flag: "PCTF{auth_****}", type: "web"},
  {title: "Trust Vault", file: "CTF/PatriotCTF2025/Web/TrustVault", flag: "FLAG{py7h0n_****}", type: "web"},
  {title: "Reverse Metadata Part 1", file: "CTF/PatriotCTF2025/Misc/ReverseMetaData1", flag: "MASONCC{images_****}", type: "misc"},
  {title: "Reverse Metadata Part 2", file: "CTF/PatriotCTF2025/Misc/ReverseMetaData2", flag: "PCTF{hidden_****}", type: "misc"}
];

function updateCategoryStats() {
  const solved = { web: 0, misc: 0, crypto: 0, pwn: 0, forensics: 0 };
  challenges.forEach(c => { if (solved.hasOwnProperty(c.type)) solved[c.type]++; });

  // Only update category badges now
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

  // Take the last 4 challenges (most recent), then reverse so newest is on top
  const recentFour = challenges.reverse().slice(-4).reverse();

  recentFour.forEach(c => {
    const li = document.createElement('li');
    li.innerHTML = `<span class="tag tag-${c.type}">${c.title}</span>`;
    li.style.cursor = 'pointer';
    li.onclick = () => location.href = c.file;
    list.appendChild(li);
  });
}

function renderChallenges(filter = "all") {
  const container = document.getElementById("challengeCards");
  container.innerHTML = "";
  const toShow = filter === "all" ? challenges : challenges.filter(c => c.type === filter);
  if (toShow.length === 0) {
    container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 60px;">No challenges yet in this category.</p>';
  }
  toShow.forEach(c => {
    const card = document.createElement("div");
    card.className = "card reveal";
    card.innerHTML = `
      <div class="category-tag tag-${c.type}">${c.type.toUpperCase()}</div>
      <h3>${c.title}</h3>
      <p class="flag">Flag: <code>${c.flag}</code></p>
      <span style="opacity:0.7">Click for writeup</span>`;
    card.onclick = () => location.href = c.file;
    container.appendChild(card);
  });

  // ADD THIS BLOCK HERE (observe all new .reveal elements, including the freshly added cards)
  const reveals = document.querySelectorAll('.reveal:not(.observed)'); // optional: add a marker class to avoid double-observing
  reveals.forEach(el => {
    observer.observe(el);
    el.classList.add('observed'); // optional marker
  });
}

document.querySelectorAll('#challengeTabs .tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('#challengeTabs .tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderChallenges(tab.dataset.cat);
  });
});

document.getElementById("ctfGrid").innerHTML = '<div class="ctf-card" onclick="location.href=\'CTF/PatriotCTF2025/patriotctf2025\'"><h3>PatriotCTF 2025</h3><p>7+ solves</p><p style="color:#8b949e;font-weight:bold">Ended</p></div>';

document.getElementById('ctfToggle').addEventListener('click', () => document.getElementById('ctfModal').classList.add('open'));
document.querySelector('.close-modal').addEventListener('click', () => document.getElementById('ctfModal').classList.remove('open'));
document.getElementById('ctfModal').addEventListener('click', e => { if (e.target === e.currentTarget) document.getElementById('ctfModal').classList.remove('open'); });

document.getElementById('themeToggle').addEventListener('click', () => {
  document.documentElement.classList.toggle('light');
  localStorage.theme = document.documentElement.classList.contains('light') ? 'light' : 'dark';
});
if (localStorage.theme === 'light') document.documentElement.classList.add('light');

async function updateVisitorCount() {
  const el = document.getElementById('visitorCount');
  try {
    const res = await fetch('https://api.counterapi.dev/v2/syndro-counter/syndro-visitors/up', { method: 'POST' });
    if (!res.ok) throw new Error();
    const data = await res.json();
    el.textContent = data.value.toLocaleString();
  } catch (err) {
    // Fallback to localStorage
    let count = parseInt(localStorage.getItem('local-visits') || '0');
    count += 1;
    localStorage.setItem('local-visits', count);
    el.textContent = count.toLocaleString();
  }
}

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

// Run everything on load
window.addEventListener('load', () => {
  renderChallenges();
  updateCategoryStats();        // This populates category badges
  populateRecentSolves();       // This populates recent solves list
  updateVisitorCount();
});